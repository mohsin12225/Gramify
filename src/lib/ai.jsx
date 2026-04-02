/**
 * Multi-provider AI engine with automatic fallback.
 * Chain: Groq → OpenRouter → NVIDIA
 * 
 * IMPORTANT: This file must remain .js (no JSX).
 */

const SYSTEM_PROMPT = `You are a grammar correction tool. Your ONLY task is to fix grammar, spelling, and punctuation errors in the text provided. Rules:
- Return ONLY the corrected text.
- Do NOT add any explanations, notes, or commentary.
- Do NOT change the meaning, tone, or style.
- Preserve original formatting and paragraph breaks.
- If the text has no errors, return it unchanged.`

const providers = [
  {
    name: 'Groq',
    key: import.meta.env.VITE_GROQ_API_KEY,
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-8b-instant',
    maxTokens: 4096,
    buildHeaders: function(apiKey) {
      return {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      }
    },
    buildBody: function(model, messages, maxTokens) {
      return {
        model: model,
        messages: messages,
        temperature: 0.15,
        max_tokens: maxTokens,
        stream: false,
      }
    },
    extractText: function(data) {
      var choices = data && data.choices
      if (!choices || !choices[0]) return null
      var msg = choices[0].message
      return msg && msg.content ? msg.content.trim() : null
    },
    isQuotaError: function(status, errorBody) {
      if (status === 429 || status === 402) return true
      var msg = ''
      if (errorBody && errorBody.error && errorBody.error.message) msg = errorBody.error.message
      msg = msg.toLowerCase()
      return msg.indexOf('rate limit') !== -1 ||
             msg.indexOf('quota') !== -1 ||
             msg.indexOf('limit reached') !== -1 ||
             msg.indexOf('exceeded') !== -1 ||
             msg.indexOf('too many') !== -1
    },
  },
  {
    name: 'OpenRouter',
    key: import.meta.env.VITE_OPENROUTER_API_KEY,
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    maxTokens: 4096,
    buildHeaders: function(apiKey) {
      return {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Grammar Fixer',
      }
    },
    buildBody: function(model, messages, maxTokens) {
      return {
        model: model,
        messages: messages,
        temperature: 0.15,
        max_tokens: maxTokens,
        stream: false,
      }
    },
    extractText: function(data) {
      var choices = data && data.choices
      if (!choices || !choices[0]) return null
      var msg = choices[0].message
      return msg && msg.content ? msg.content.trim() : null
    },
    isQuotaError: function(status, errorBody) {
      if (status === 429 || status === 402 || status === 403) return true
      var msg = ''
      if (errorBody && errorBody.error && errorBody.error.message) msg = errorBody.error.message
      else if (errorBody && errorBody.message) msg = errorBody.message
      msg = msg.toLowerCase()
      return msg.indexOf('rate limit') !== -1 ||
             msg.indexOf('quota') !== -1 ||
             msg.indexOf('limit') !== -1 ||
             msg.indexOf('exceeded') !== -1 ||
             msg.indexOf('credits') !== -1 ||
             msg.indexOf('insufficient') !== -1
    },
  },
  {
    name: 'NVIDIA',
    key: import.meta.env.VITE_NVIDIA_API_KEY,
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'meta/llama-3.1-8b-instruct',
    maxTokens: 4096,
    buildHeaders: function(apiKey) {
      return {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      }
    },
    buildBody: function(model, messages, maxTokens) {
      return {
        model: model,
        messages: messages,
        temperature: 0.15,
        max_tokens: maxTokens,
        stream: false,
      }
    },
    extractText: function(data) {
      var choices = data && data.choices
      if (!choices || !choices[0]) return null
      var msg = choices[0].message
      return msg && msg.content ? msg.content.trim() : null
    },
    isQuotaError: function(status, errorBody) {
      if (status === 429 || status === 402 || status === 403) return true
      var msg = ''
      if (errorBody && errorBody.error && errorBody.error.message) msg = errorBody.error.message
      else if (errorBody && errorBody.detail) msg = errorBody.detail
      msg = msg.toLowerCase()
      return msg.indexOf('rate limit') !== -1 ||
             msg.indexOf('quota') !== -1 ||
             msg.indexOf('exceeded') !== -1 ||
             msg.indexOf('limit') !== -1 ||
             msg.indexOf('credits') !== -1
    },
  },
]

// Custom error class
export function AllProvidersExhaustedError(failedProviders) {
  this.name = 'AllProvidersExhaustedError'
  this.message = 'ALL_PROVIDERS_EXHAUSTED'
  this.failedProviders = failedProviders
}
AllProvidersExhaustedError.prototype = Object.create(Error.prototype)
AllProvidersExhaustedError.prototype.constructor = AllProvidersExhaustedError

// Single provider call
async function callProvider(provider, inputText) {
  if (!provider.key || provider.key.indexOf('your-') !== -1) {
    return { success: false, quotaError: false, error: 'Not configured' }
  }

  var controller = new AbortController()
  var timeout = setTimeout(function() { controller.abort() }, 30000)

  var messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: inputText },
  ]

  try {
    var response = await fetch(provider.url, {
      method: 'POST',
      headers: provider.buildHeaders(provider.key),
      signal: controller.signal,
      body: JSON.stringify(
        provider.buildBody(provider.model, messages, provider.maxTokens)
      ),
    })

    clearTimeout(timeout)

    if (!response.ok) {
      var errorBody = {}
      try { errorBody = await response.json() } catch(e) { /* ignore */ }
      var isQuota = provider.isQuotaError(response.status, errorBody)
      var errorMsg = ''
      if (errorBody.error && errorBody.error.message) errorMsg = errorBody.error.message
      else if (errorBody.message) errorMsg = errorBody.message
      else if (errorBody.detail) errorMsg = errorBody.detail
      else errorMsg = 'HTTP ' + response.status

      return {
        success: false,
        quotaError: isQuota,
        error: errorMsg,
        status: response.status,
      }
    }

    var data = await response.json()
    var text = provider.extractText(data)

    if (!text) {
      return { success: false, quotaError: false, error: 'Empty response' }
    }

    return { success: true, text: text, provider: provider.name }
  } catch (e) {
    clearTimeout(timeout)
    if (e.name === 'AbortError') {
      return { success: false, quotaError: false, error: 'Timeout' }
    }
    return { success: false, quotaError: false, error: e.message }
  }
}

// Main export
export async function fixGrammar(inputText) {
  var configuredProviders = providers.filter(function(p) {
    return p.key && p.key.indexOf('your-') === -1
  })

  if (configuredProviders.length === 0) {
    throw new Error(
      'No AI API keys configured. Add at least one key (VITE_GROQ_API_KEY, VITE_OPENROUTER_API_KEY, or VITE_NVIDIA_API_KEY) to your .env file.'
    )
  }

  var failedProviders = []
  var allQuotaErrors = true

  for (var i = 0; i < configuredProviders.length; i++) {
    var provider = configuredProviders[i]
    var result = await callProvider(provider, inputText)

    if (result.success) {
      return {
        text: result.text,
        provider: result.provider,
      }
    }

    failedProviders.push({
      name: provider.name,
      error: result.error,
      quotaError: result.quotaError,
    })

    if (!result.quotaError) {
      allQuotaErrors = false
    }

    if (result.quotaError) {
      console.warn('[AI] ' + provider.name + ' quota/rate limit hit, trying next...')
      continue
    }

    console.warn('[AI] ' + provider.name + ' failed: ' + result.error + ', trying next...')
  }

  if (allQuotaErrors && failedProviders.length === configuredProviders.length) {
    throw new AllProvidersExhaustedError(failedProviders)
  }

  var lastError = failedProviders[failedProviders.length - 1]
  throw new Error(lastError ? lastError.error : 'All AI providers failed. Please try again later.')
}

// Provider status (for UI display)
export function getProviderStatus() {
  return providers.map(function(p) {
    return {
      name: p.name,
      configured: !!(p.key && p.key.indexOf('your-') === -1),
    }
  })
}