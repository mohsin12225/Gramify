import { useState } from 'react'

export default function HistoryPanel({ history, onDelete, onClearAll, onCopy, loading }) {
  const [expanded, setExpanded] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [showClear, setShowClear] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const handleCopy = (id, text) => { onCopy(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000) }
  const handleDelete = async (id) => { setDeletingId(id); await onDelete(id); if (expanded === id) setExpanded(null); setDeletingId(null) }
  const handleClear = async () => { await onClearAll(); setShowClear(false) }

  const fmt = (d) => {
    const now = new Date(), diff = now - new Date(d)
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`
    return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric' })
  }

  const trunc = (t, m = 85) => t && t.length > m ? t.slice(0, m) + '…' : t || ''

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] p-4">
          <div className="space-y-2">
            <div className="h-3 rounded-full animate-shimmer w-[60%]"/>
            <div className="h-3 rounded-full animate-shimmer w-[80%] [animation-delay:0.1s]"/>
          </div>
        </div>
      ))}
    </div>
  )

  if (!history.length) return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] py-16 px-6 text-center shadow-sm dark:shadow-none">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 dark:text-zinc-600">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <p className="text-[15px] text-gray-500 dark:text-zinc-500 font-medium">No history yet</p>
      <p className="text-[13px] text-gray-400 dark:text-zinc-600 mt-1">Fixed texts will appear here</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {history.length > 1 && (
        <div className="flex justify-end">
          {showClear ? (
            <div className="flex items-center gap-2 animate-scale">
              <span className="text-[12px] text-gray-500">Clear all?</span>
              <button onClick={handleClear} className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">Yes</button>
              <button onClick={() => setShowClear(false)} className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-gray-100 dark:bg-white/[0.05] text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowClear(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-gray-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
              Clear all
            </button>
          )}
        </div>
      )}

      {history.map((item) => {
        const isExp = expanded === item.id
        const isDel = deletingId === item.id
        return (
          <div key={item.id} className={`rounded-2xl border overflow-hidden transition-all duration-300
            ${isDel ? 'opacity-30 scale-95' : ''}
            ${isExp
              ? 'bg-white dark:bg-white/[0.04] border-indigo-200 dark:border-indigo-500/15 shadow-sm dark:shadow-none'
              : 'bg-white dark:bg-white/[0.02] border-gray-200 dark:border-white/[0.04] hover:border-gray-300 dark:hover:border-white/[0.08]'}`}>

            <button onClick={() => setExpanded(isExp ? null : item.id)} className="w-full px-4 py-3.5 flex items-start gap-3 text-left">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                ${isExp ? 'bg-indigo-100 dark:bg-indigo-500/15' : 'bg-gray-100 dark:bg-white/[0.05]'}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className={`transition-all duration-300 ${isExp ? 'text-indigo-500 dark:text-indigo-400 rotate-180' : 'text-gray-400 dark:text-zinc-500'}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-700 dark:text-zinc-300 font-medium truncate leading-snug">{trunc(item.output_text || item.input_text)}</p>
                <p className="text-[11px] text-gray-400 dark:text-zinc-600 mt-1 font-medium">{fmt(item.created_at)}</p>
              </div>
            </button>

            {isExp && (
              <div className="px-4 pb-4 animate-fade">
                <div className="ml-10 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-600"/>
                      <span className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Original</span>
                    </div>
                    <div className="rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-white/[0.04] px-4 py-3 text-[13px] text-gray-500 dark:text-zinc-500 leading-relaxed whitespace-pre-wrap max-h-[150px] overflow-y-auto">{item.input_text}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-500/70 uppercase tracking-wider">Corrected</span>
                    </div>
                    <div className="rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-emerald-200 dark:border-emerald-500/10 px-4 py-3 text-[13px] text-gray-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto">{item.output_text}</div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={() => handleCopy(item.id, item.output_text)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium
                                 bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/[0.08]
                                 border border-gray-200 dark:border-white/[0.06] active:scale-95 transition-all">
                      {copiedId === item.id
                        ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500"><path d="M20 6 9 17l-5-5"/></svg><span className="text-emerald-500">Copied!</span></>
                        : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span className="text-gray-500 dark:text-zinc-400">Copy</span></>}
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium
                                 text-gray-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400
                                 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent
                                 hover:border-red-200 dark:hover:border-red-500/15 active:scale-95 transition-all">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}