import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { fixGrammar, AllProvidersExhaustedError, getProviderStatus } from '../lib/ai.jsx'
import { incrementGuestUsage, incrementUserUsage, logRequest, DAILY_LIMIT } from '../lib/limits'
import { addGuestHistory } from '../lib/history'
import AdInContent from './AdInContent'
import Logo from './Logo'
import ApiExhaustedBanner from './ApiExhaustedBanner'

const MAX_WORDS = 1200
const countWords = (t) => { const s = t.trim(); return s ? s.split(/\s+/).length : 0 }

export default function FixerPage({ remaining, refreshRemaining, refreshHistory, goToHistory }) {
  const { user, isGuest } = useAuth()

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [usedProvider, setUsedProvider] = useState(null)
  const [showExhausted, setShowExhausted] = useState(false)
  const outputRef = useRef(null)

  const wordCount = countWords(input)
  const overLimit = wordCount > MAX_WORDS
  const noInput = wordCount === 0
  const limitReached = remaining <= 0

  const handleFix = async () => {
    if (noInput || overLimit || loading || limitReached) return
    setLoading(true); setOutput(''); setError(''); setUsedProvider(null)

    // We do NOT increment usage yet — only after successful AI response
    // This ensures users don't lose a request point if ALL APIs are down

    try {
      // 1. Call AI first (before deducting usage)
      let result
      try {
        result = await fixGrammar(input)
      } catch (aiError) {
        if (aiError instanceof AllProvidersExhaustedError) {
          // Don't deduct usage — show honest message
          setShowExhausted(true)
          setLoading(false)
          return
        }
        throw aiError
      }

      // 2. AI succeeded → now deduct usage
      let usageResult
      if (isGuest) usageResult = incrementGuestUsage()
      else usageResult = await incrementUserUsage(user.id)

      if (!usageResult.allowed) {
        setError('Daily limit reached. Try again tomorrow.')
        setLoading(false)
        await refreshRemaining()
        return
      }

      // 3. Set output
      setOutput(result.text)
      setUsedProvider(result.provider)

      // 4. Save to history
      if (isGuest) addGuestHistory(input, result.text)
      else if (user) await logRequest(user.id, input, result.text)

      await refreshRemaining()
      await refreshHistory()

      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150)
    } catch (e) {
      setError(e.message || 'Something went wrong.')
      // Don't refresh remaining — we didn't deduct
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(output) } catch {
      const t = document.createElement('textarea'); t.value = output; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t)
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const providerStatus = getProviderStatus()
  const configuredCount = providerStatus.filter(p => p.configured).length

  return (
    <>
      {/* Exhausted banner */}
      {showExhausted && (
        <ApiExhaustedBanner onDismiss={() => setShowExhausted(false)} />
      )}

      {/* Header */}
      <header className="flex items-center gap-3 pt-6 pb-4 animate-slide">
        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Logo size="sm" />
        </div>
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-gray-900 dark:text-white">Grammar Fixer</h1>
          <p className="text-[12px] text-gray-500 dark:text-zinc-500 font-medium">
            Fix grammar, spelling & punctuation
          </p>
        </div>
      </header>

      {/* Usage bar */}
      <div className="animate-slide-d1 mb-5">
        <div className={`flex items-center justify-between rounded-2xl px-5 py-3.5 border transition-all
          ${limitReached
            ? 'bg-red-50 dark:bg-red-500/[0.06] border-red-200 dark:border-red-500/20'
            : 'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.06]'
          }`}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${limitReached ? 'bg-red-400' : 'bg-emerald-400'}`} />
            <span className={`text-[13px] font-medium ${limitReached ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-zinc-400'}`}>
              {limitReached ? 'Daily limit reached' : `${remaining} of ${DAILY_LIMIT} requests left`}
            </span>
          </div>
          <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-white/[0.06] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${limitReached ? 'bg-red-500' : 'bg-violet-500'}`}
              style={{ width: `${(remaining / DAILY_LIMIT) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Provider status chips */}
      <div className="animate-slide-d1 mb-4 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold text-gray-400 dark:text-zinc-600 uppercase tracking-wider">
          AI Engines:
        </span>
        {providerStatus.map((p) => (
          <span
            key={p.name}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border
              ${p.configured
                ? 'bg-emerald-50 dark:bg-emerald-500/[0.06] text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/15'
                : 'bg-gray-100 dark:bg-white/[0.03] text-gray-400 dark:text-zinc-600 border-gray-200 dark:border-white/[0.06]'
              }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${p.configured ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-zinc-600'}`} />
            {p.name}
          </span>
        ))}
      </div>

      {/* Input card */}
      <div className="animate-slide-d2 rounded-3xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-5 sm:p-6 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <label className="text-[13px] font-semibold text-gray-400 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
            Your text
          </label>
          <span className={`text-[12px] font-mono font-medium tabular-nums ${overLimit ? 'text-red-500' : 'text-gray-400 dark:text-zinc-600'}`}>
            {wordCount}/{MAX_WORDS}
          </span>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type text you want to fix…"
          rows={8}
          disabled={loading}
          className="w-full bg-gray-50 dark:bg-zinc-900/50 rounded-2xl px-5 py-4 text-[15px]
                     text-gray-900 dark:text-zinc-200 placeholder:text-gray-300 dark:placeholder:text-zinc-700
                     resize-none outline-none border border-gray-200 dark:border-white/[0.04]
                     focus:border-violet-400 dark:focus:border-violet-500/30
                     transition-all duration-300 leading-relaxed disabled:opacity-40"
        />

        {overLimit && (
          <div className="mt-2 flex items-center gap-2 px-1 animate-scale">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-[12px] text-red-500 font-medium">Exceeds maximum word count</span>
          </div>
        )}

        <button
          onClick={handleFix}
          disabled={noInput || overLimit || loading || limitReached}
          className="mt-5 group flex items-center justify-center gap-3 w-full rounded-2xl py-4 px-6
                     font-semibold text-[15px] text-white bg-gradient-to-r from-violet-600 to-purple-600
                     hover:from-violet-500 hover:to-purple-500 hover:shadow-lg hover:shadow-violet-500/20
                     active:scale-[0.98] transition-all duration-300
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {loading ? (
            <>
              <Spin />
              <span>Fixing grammar…</span>
            </>
          ) : (
            <>
              <Logo size="xs" />
              <span>Fix Grammar</span>
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-2xl bg-red-50 dark:bg-red-500/[0.06] border border-red-200 dark:border-red-500/15 p-4 animate-scale">
          <p className="text-[13px] text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Ad in content (between error and loading) */}
      <AdInContent className="mt-6 mb-8" />

      {/* Loading skeleton */}
      {loading && !output && (
        <div className="mt-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-5 animate-slide shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-5">
            <div className="animate-spin">
              <Logo size="xs" />
            </div>
            <div>
              <span className="text-[13px] text-violet-600 dark:text-violet-400 font-medium">Processing your text…</span>
              <p className="text-[11px] text-gray-400 dark:text-zinc-600 mt-0.5">
                Trying {configuredCount} AI engine{configuredCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {[90, 100, 85, 72, 60].map((w, i) => (
              <div key={i} className="h-3 rounded-full animate-shimmer" style={{ width: `${w}%`, animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Output */}
      {output && !loading && (
        <div ref={outputRef} className="mt-5 rounded-3xl bg-white dark:bg-white/[0.04] border border-violet-200 dark:border-violet-500/10 p-5 sm:p-6 animate-slide shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <label className="text-[13px] font-semibold uppercase tracking-wider flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Corrected
              </label>
              {usedProvider && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-white/[0.05] text-gray-400 dark:text-zinc-500 border border-gray-200 dark:border-white/[0.06]">
                  via {usedProvider}
                </span>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium
                         bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/[0.08]
                         border border-gray-200 dark:border-white/[0.06] active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500"><path d="M20 6 9 17l-5-5" /></svg>
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  <span className="text-gray-500 dark:text-zinc-400">Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-2xl px-5 py-4 text-[15px] text-gray-800 dark:text-zinc-200
                          leading-relaxed border border-gray-200 dark:border-white/[0.04] whitespace-pre-wrap
                          max-h-[400px] overflow-y-auto">
            {output}
          </div>

          <button
            onClick={goToHistory}
            className="mt-3 flex items-center gap-1.5 text-[12px] text-gray-400 dark:text-zinc-500 hover:text-violet-500 dark:hover:text-violet-400 transition-colors font-medium"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            Saved to history
          </button>
        </div>
      )}
    </>
  )
}

function Spin() {
  return (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}