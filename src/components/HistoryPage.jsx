import HistoryPanel from './HistoryPanel'
import AdInContent from './AdInContent'

export default function HistoryPage({ history, loading, onDelete, onClearAll }) {
  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text) } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t)
    }
  }

  return (
    <>
      <header className="pt-6 pb-4 animate-slide">
        <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900 dark:text-white">History</h1>
        <p className="text-[13px] text-gray-500 dark:text-zinc-500 font-medium mt-0.5">
          {history.length} saved correction{history.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Ad in content (after header) */}
      <AdInContent className="mt-6 mb-8" />

      <div className="animate-slide-d1">
        <HistoryPanel
          history={history}
          loading={loading}
          onDelete={onDelete}
          onClearAll={onClearAll}
          onCopy={copyText}
        />
      </div>
    </>
  )
}
