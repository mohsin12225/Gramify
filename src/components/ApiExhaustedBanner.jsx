import Logo from './Logo'

export default function ApiExhaustedBanner({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 animate-fade">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onDismiss} />

      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/[0.08] p-6 shadow-2xl animate-scale">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-amber-500">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[18px] font-bold text-gray-900 dark:text-white text-center">
          Service Temporarily Unavailable
        </h3>

        {/* Honest message */}
        <div className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-500/[0.06] border border-amber-200 dark:border-amber-500/15 p-4">
          <p className="text-[14px] text-amber-800 dark:text-amber-200 leading-relaxed text-center">
            We use free AI API tiers to keep this tool free for everyone.
            All our API providers have reached their daily free usage limits.
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <InfoRow
            icon="⏰"
            text="Limits reset automatically every day"
          />
          <InfoRow
            icon="💾"
            text="Your remaining requests are safe and won't be deducted"
          />
          <InfoRow
            icon="🔄"
            text="Try again in a few hours or tomorrow"
          />
        </div>

        {/* Provider status */}
        <div className="mt-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] p-3">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
            Provider Status
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {['Groq', 'OpenRouter', 'NVIDIA'].map((name) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-[12px] text-gray-500 dark:text-zinc-500 font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="mt-5 w-full rounded-2xl py-3.5 px-6 font-semibold text-[15px]
                     bg-gray-900 dark:bg-white text-white dark:text-black
                     hover:opacity-90 active:scale-[0.98] transition-all"
        >
          I Understand
        </button>

        <p className="mt-3 text-[11px] text-gray-400 dark:text-zinc-600 text-center">
          We're working hard to keep this service free. Thank you for your patience.
        </p>
      </div>
    </div>
  )
}

function InfoRow({ icon, text }) {
  return (
    <div className="flex items-start gap-3 px-1">
      <span className="text-[16px] mt-0.5 flex-shrink-0">{icon}</span>
      <p className="text-[13px] text-gray-600 dark:text-zinc-400 leading-snug">{text}</p>
    </div>
  )
}