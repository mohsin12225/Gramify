import Logo from './Logo'
import AdInContent from './AdInContent'

export default function AboutPage({ onBack }) {
  return (
    <div className="animate-fade">
      {/* Header */}
      <header className="flex items-center gap-3 pt-6 pb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.06]
                     flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/[0.08]
                     active:scale-95 transition-all flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-zinc-400">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-[22px] font-extrabold tracking-tight text-gray-900 dark:text-white">About Us</h1>
      </header>

      <div className="space-y-5">
        {/* Hero card */}
        <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-6 shadow-sm dark:shadow-none text-center">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-violet-500/10 blur-2xl animate-glow" />
              <div className="relative w-20 h-20 rounded-[22px] bg-violet-100 dark:bg-violet-500/10
                              border border-violet-200 dark:border-violet-500/20
                              flex items-center justify-center shadow-lg shadow-violet-500/10">
                <Logo size="lg" />
              </div>
            </div>
          </div>
          <h2 className="text-[22px] font-extrabold text-gray-900 dark:text-white">Gramify</h2>
          <p className="text-[14px] text-gray-500 dark:text-zinc-400 mt-1 font-medium">Version 1.1.0</p>

          <div className="flex items-center justify-center gap-2 mt-4">
            {['Free', 'Private', 'Open'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase
                           bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400
                           border border-violet-200 dark:border-violet-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Mission */}
        <Card title="Our Mission">
          <p>
            We believe everyone deserves access to clear, professional writing.
            AI Grammar Fixer was built to make grammar correction instant, free,
            and private — no subscriptions, no ads, no data selling.
          </p>
        </Card>

        {/* How it works */}
        <Card title="How It Works">
          <div className="space-y-4">
            <Step number="1" title="Paste Your Text" desc="Enter any text — emails, essays, messages, documents." />
            <Step number="2" title="AI Processes It" desc="Our multi-provider AI engine fixes grammar, spelling, and punctuation." />
            <Step number="3" title="Get Clean Results" desc="Copy the corrected text instantly. That's it." />
          </div>
        </Card>

        {/* Tech stack */}
        <Card title="Built With">
          <div className="grid grid-cols-2 gap-2">
            <TechBadge name="React" desc="Frontend framework" />
            <TechBadge name="Supabase" desc="Auth & database" />
            <TechBadge name="Groq AI" desc="Primary AI engine" />
            <TechBadge name="OpenRouter" desc="Fallback AI" />
            <TechBadge name="NVIDIA" desc="Fallback AI" />
            <TechBadge name="TailwindCSS" desc="Styling" />
          </div>
        </Card>

        {/* Values */}
        <Card title="Our Values">
          <div className="space-y-3">
            <Value icon="🔒" title="Privacy First" desc="Your text is never stored for training. Guest mode keeps everything local." />
            <Value icon="🆓" title="Free Forever" desc="We use free AI API tiers to keep the service accessible to everyone." />
            <Value icon="⚡" title="Speed" desc="Instant results with smart API fallback — no waiting." />
            <Value icon="🎯" title="Simplicity" desc="One feature, done perfectly. No bloat, no distractions." />
          </div>
        </Card>

        {/* Transparency */}
        <Card title="Transparency">
          <p>
            This app uses free-tier AI APIs. When one provider reaches its daily limit,
            we automatically switch to the next. If all providers are exhausted,
            we tell you honestly — no fake errors, no hidden paywalls.
          </p>
          <p className="mt-3">
            Your request points are <strong className="text-gray-900 dark:text-white">never deducted</strong> when
            AI providers are unavailable.
          </p>
        </Card>

                {/* Transparency */}
        <Card title="Transparency">
          <p>
            This app uses free-tier AI APIs. When one provider reaches its daily limit,
            we automatically switch to the next. If all providers are exhausted,
            we tell you honestly — no fake errors, no hidden paywalls.
          </p>
          <p className="mt-3">
            Your request points are <strong className="text-gray-900 dark:text-white">never deducted</strong> when
            AI providers are unavailable.
          </p>
        </Card>

        {/* Ad in content (between sections) */}
        <AdInContent className="mt-6 mb-8" />

        {/* Acknowledgments */}
        <Card title="Acknowledgments">
          <p className="mb-3">
            This project wouldn't be possible without the generous free tiers
            provided by our technology partners:
          </p>
          <div className="space-y-2">
            <Credit name="Groq" desc="Ultra-fast AI inference" />
            <Credit name="OpenRouter" desc="Multi-model AI routing" />
            <Credit name="NVIDIA NIM" desc="Enterprise AI endpoints" />
            <Credit name="Supabase" desc="Open-source Firebase alternative" />
            <Credit name="Vercel" desc="Frontend deployment platform" />
          </div>
        </Card>

        {/* Credits */}
        <Card title="Acknowledgments">
          <p className="mb-3">
            This project wouldn't be possible without the generous free tiers
            provided by our technology partners:
          </p>
          <div className="space-y-2">
            <Credit name="Groq" desc="Ultra-fast AI inference" />
            <Credit name="OpenRouter" desc="Multi-model AI routing" />
            <Credit name="NVIDIA NIM" desc="Enterprise AI endpoints" />
            <Credit name="Supabase" desc="Open-source Firebase alternative" />
            <Credit name="Vercel" desc="Frontend deployment platform" />
          </div>
        </Card>
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  )
}

/* ─── Sub-components ───────────────────────────────────── */

function Card({ title, children }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-5 shadow-sm dark:shadow-none">
      <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <div className="text-[14px] text-gray-600 dark:text-zinc-400 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

function Step({ number, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20
                      flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-[12px] font-bold text-violet-600 dark:text-violet-400">{number}</span>
      </div>
      <div>
        <p className="text-[14px] font-semibold text-gray-800 dark:text-zinc-200">{title}</p>
        <p className="text-[13px] text-gray-500 dark:text-zinc-500 mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

function TechBadge({ name, desc }) {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04] px-3.5 py-2.5">
      <p className="text-[13px] font-semibold text-gray-800 dark:text-zinc-300">{name}</p>
      <p className="text-[11px] text-gray-400 dark:text-zinc-600">{desc}</p>
    </div>
  )
}

function Value({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[18px] mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[14px] font-semibold text-gray-800 dark:text-zinc-200">{title}</p>
        <p className="text-[13px] text-gray-500 dark:text-zinc-500 mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

function Credit({ name, desc }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04] px-4 py-2.5">
      <p className="text-[13px] font-semibold text-gray-800 dark:text-zinc-300">{name}</p>
      <p className="text-[11px] text-gray-400 dark:text-zinc-600">{desc}</p>
    </div>
  )
}