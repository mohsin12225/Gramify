/**
 * Multi-provider AI engine with automatic fallback.
 *
 * Chain: Groq → OpenRouter → NVIDIA
 * If ALL providers fail due to quota/rate limits,
 * throws a specific "all exhausted" error.
 */
const ADS_ENABLED = true // Set to false to disable all ads
const SYSTEM_PROMPT = `You are a grammar correction tool. Your ONLY task is to fix grammar, spelling, and punctuation errors in the text provided. Rules:
- Return ONLY the corrected text.
- Do NOT add any explanations, notes, or commentary.
- Do NOT change the meaning, tone, or style.
- Preserve original formatting and paragraph breaks.
- If the text has no errors, return it unchanged.`

// ─── Provider Configurations ─────────────────────────────────

const providers = [
  {
    name: 'Groq',
    key: import.meta.env.VITE_GROQ_API_KEY,
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-8b-instant',
    maxTokens: 4096,
    buildHeaders(apiKey) {
      return {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    },
    buildBody(model, messages, maxTokens) {
      return {
        model,
        messages,
        temperature: 0.15,
        max_tokens: maxTokens,
        stream: false,
      }
    },
    extractText(data) {
      return data?.choices?.[0]?.message?.content?.trim() || null
    },
    isQuotaError(status, errorBody) {
      // Groq returns 429 for rate limit, 402 for quota
      if (status === 429 || status === 402) return true
      const msg = (errorBody?.error?.message || '').toLowerCase()
      return msg.includes('rate limit') ||
             msg.includes('quota') ||
             msg.includes('limit reached') ||
             msg.includes('exceeded') ||
             msg.includes('too many')
    },
  },
  {
    name: 'OpenRouter',
    key: import.meta.env.VITE_OPENROUTER_API_KEY,
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    maxTokens: 4096,
    buildHeaders(apiKey) {
      return {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Grammar Fixer',
      }
    },
    buildBody(model, messages, maxTokens) {
      return {
        model,
        messages,
        temperature: 0.15,
        max_tokens: maxTokens,
        stream: false,
      }
    },
    extractText(data) {
      return data?.choices?.[0]?.message?.content?.trim() || null
    },
    isQuotaError(status, errorBody) {
      if (status === 429 || status === 402 || status === 403) return true
      const msg = (errorBody?.error?.message || errorBody?.message || '').toLowerCase()
      return msg.includes('rate limit') ||
             msg.includes('quota') ||
             msg.includes('limit') ||
             msg.includes('exceeded') ||
             msg.includes('credits') ||
             msg.includes('insufficient')
    },
  },
  {
    name: 'NVIDIA',
    key: import.meta.env.VITE_NVIDIA_API_KEY,
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'meta/llama-3.1-8b-instruct',
    maxTokens: 4096,
    buildHeaders(apiKey) {
      return {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    },
    buildBody(model, messages, maxTokens) {
      return {
        model,
        messages,
        temperature: 0.15,
        max_tokens: maxTokens,
        stream: false,
      }
    },
    extractText(data) {
      return data?.choices?.[0]?.message?.content?.trim() || null
    },
    isQuotaError(status, errorBody) {
      if (status === 429 || status === 402 || status === 403) return true
      const msg = (errorBody?.error?.message || errorBody?.detail || '').toLowerCase()
      return msg.includes('rate limit') ||
             msg.includes('quota') ||
             msg.includes('exceeded') ||
             msg.includes('limit') ||
             msg.includes('credits')
    },
  },
]

  {/* Ad in content (between error and loading) */}
  {ADS_ENABLED && <AdInContent className="mt-6 mb-8" />}

// ─── Error Types ─────────────────────────────────────────────

export class AllProvidersExhaustedError extends Error {
  constructor(failedProviders) {
    super('ALL_PROVIDERS_EXHAUSTED')
    this.name = 'AllProvidersExhaustedError'
    this.failedProviders = failedProviders
  }
}

// ─── Single Provider Call ────────────────────────────────────

async function callProvider(provider, inputText) {
  if (!provider.key || provider.key.includes('your-')) {
    return { success: false, quotaError: false, error: 'Not configured' }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: inputText },
  ]

  try {
    const response = await fetch(provider.url, {
      method: 'POST',
      headers: provider.buildHeaders(provider.key),
      signal: controller.signal,
      body: JSON.stringify(
        provider.buildBody(provider.model, messages, provider.maxTokens)
      ),
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      const isQuota = provider.isQuotaError(response.status, errorBody)
      const errorMsg = errorBody?.error?.message || errorBody?.message || errorBody?.detail || `HTTP ${response.status}`

      return {
        success: false,
        quotaError: isQuota,
        error: errorMsg,
        status: response.status,
      }
    }

    const data = await response.json()
    const text = provider.extractText(data)

    if (!text) {
      return { success: false, quotaError: false, error: 'Empty response' }
    }

    return { success: true, text, provider: provider.name }
  } catch (e) {
    clearTimeout(timeout)
    if (e.name === 'AbortError') {
      return { success: false, quotaError: false, error: 'Timeout' }
    }
    return { success: false, quotaError: false, error: e.message }
  }
}

// ─── Main Export: fixGrammar with fallback ────────────────────

export async function fixGrammar(inputText) {
  const configuredProviders = providers.filter(
    (p) => p.key && !p.key.includes('your-')
  )

  if (configuredProviders.length === 0) {
    throw new Error(
      'No AI API keys configured. Add at least one API key (VITE_GROQ_API_KEY, VITE_OPENROUTER_API_KEY, or VITE_NVIDIA_API_KEY) to your .env file.'
    )
  }

  const failedProviders = []
  let allQuotaErrors = true

  for (const provider of configuredProviders) {
    const result = await callProvider(provider, inputText)

    if (result.success) {
      return {
        text: result.text,
        provider: result.provider,
      }
    }

    // Track failures
    failedProviders.push({
      name: provider.name,
      error: result.error,
      quotaError: result.quotaError,
    })

    if (!result.quotaError) {
      allQuotaErrors = false
    }

    // If it's a quota error, try next provider
    if (result.quotaError) {
      console.warn(`[AI] ${provider.name} quota/rate limit hit, trying next provider...`)
      continue
    }

    // If it's a non-quota error (server error, etc.), still try next
    console.warn(`[AI] ${provider.name} failed: ${result.error}, trying next provider...`)
  }

  // All providers failed
  if (allQuotaErrors && failedProviders.length === configuredProviders.length) {
    throw new AllProvidersExhaustedError(failedProviders)
  }

  // Mixed errors — throw the last one
  const lastError = failedProviders[failedProviders.length - 1]
  throw new Error(lastError?.error || 'All AI providers failed. Please try again later.')
}

// ─── Provider Status Check (for Settings page) ──────────────

export function getProviderStatus() {
  return providers.map((p) => ({
    name: p.name,
    configured: !!(p.key && !p.key.includes('your-')),
  }))
}