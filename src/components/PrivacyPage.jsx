import Logo from './Logo'
import AdInContent from './AdInContent'

export default function PrivacyPage({ onBack }) {
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
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="text-[12px] text-gray-500 dark:text-zinc-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
      </header>

      <div className="space-y-5">
        <Section title="Overview">
          <p>
            AI Grammar Fixer. the app is committed to protecting your privacy.
            This policy explains what data we collect, how we use it, and your rights.
          </p>
        </Section>

        <Section title="Data We Collect">
          <Subsection title="For Google Login Users:">
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>Email address (from Google OAuth)</li>
              <li>Display name and profile picture (from Google)</li>
              <li>Text you submit for grammar correction</li>
              <li>Corrected text output</li>
              <li>Daily request count</li>
            </ul>
          </Subsection>
          <Subsection title="For Guest Users:">
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>All data is stored locally in your browser only</li>
              <li>No data is sent to our servers</li>
              <li>History and usage counts are stored in localStorage</li>
            </ul>
          </Subsection>
        </Section>

        <Section title="How We Use Your Data">
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>To provide grammar correction services</li>
            <li>To enforce daily usage limits</li>
            <li>To store your correction history for your convenience</li>
            <li>We do <strong className="text-gray-900 dark:text-white">not</strong> sell, share, or monetize your data</li>
            <li>We do <strong className="text-gray-900 dark:text-white">not</strong> use your text for AI training</li>
          </ul>
        </Section>

        <Section title="Third-Party Services">
          <p>We use the following third-party services:</p>
          <div className="mt-3 space-y-2">
            <ServiceCard name="Supabase" purpose="Authentication & database" url="supabase.com/privacy" />
            <ServiceCard name="Google OAuth" purpose="Sign-in authentication" url="policies.google.com/privacy" />
            <ServiceCard name="Groq" purpose="AI grammar correction" url="groq.com/privacy" />
            <ServiceCard name="OpenRouter" purpose="AI grammar correction (fallback)" url="openrouter.ai/privacy" />
            <ServiceCard name="NVIDIA" purpose="AI grammar correction (fallback)" url="nvidia.com/en-us/about-nvidia/privacy-policy" />
          </div>
        </Section>

        <Section title="Data Storage & Security">
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>Authenticated user data is stored securely in Supabase (PostgreSQL with Row Level Security)</li>
            <li>Each user can only access their own data</li>
            <li>Text is transmitted over HTTPS encryption</li>
            <li>We do not store your data beyond what is necessary for the service</li>
          </ul>
        </Section>

                <Section title="Data Storage & Security">
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>Authenticated user data is stored securely in Supabase (PostgreSQL with Row Level Security)</li>
            <li>Each user can only access their own data</li>
            <li>Text is transmitted over HTTPS encryption</li>
            <li>We do not store your data beyond what is necessary for the service</li>
          </ul>
        </Section>

        {/* Ad in content (between sections) */}
        <AdInContent className="mt-6 mb-8" />

        <Section title="Your Rights">
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li><strong className="text-gray-900 dark:text-white">Delete history</strong> — Clear all saved corrections anytime from Settings</li>
            <li><strong className="text-gray-900 dark:text-white">Delete account</strong> — Permanently remove all your data from Settings</li>
            <li><strong className="text-gray-900 dark:text-white">Guest mode</strong> — Use the app without creating any account</li>
            <li><strong className="text-gray-900 dark:text-white">Export</strong> — Copy any corrected text from your history</li>
          </ul>
        </Section>

        <Section title="Your Rights">
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li><strong className="text-gray-900 dark:text-white">Delete history</strong> — Clear all saved corrections anytime from Settings</li>
            <li><strong className="text-gray-900 dark:text-white">Delete account</strong> — Permanently remove all your data from Settings</li>
            <li><strong className="text-gray-900 dark:text-white">Guest mode</strong> — Use the app without creating any account</li>
            <li><strong className="text-gray-900 dark:text-white">Export</strong> — Copy any corrected text from your history</li>
          </ul>
        </Section>

        <Section title="Cookies">
          <p>
            We use essential cookies only for authentication session management.
            We do not use analytics, tracking, or advertising cookies.
          </p>
        </Section>

        <Section title="Children's Privacy">
          <p>
            This service is not directed to children under 13. We do not knowingly
            collect data from children.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this policy from time to time. Changes will be reflected
            on this page with an updated revision date.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            If you have any questions about this privacy policy, please reach out
            through the app's support channels or contact with developer email: mohsin.alaum10@gmail.com.
          </p>
        </Section>
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-5 shadow-sm dark:shadow-none">
      <h2 className="text-[16px] font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
      <div className="text-[14px] text-gray-600 dark:text-zinc-400 leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  )
}

function Subsection({ title, children }) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">{title}</p>
      {children}
    </div>
  )
}

function ServiceCard({ name, purpose, url }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04] px-4 py-2.5">
      <div>
        <p className="text-[13px] font-semibold text-gray-800 dark:text-zinc-300">{name}</p>
        <p className="text-[11px] text-gray-400 dark:text-zinc-600">{purpose}</p>
      </div>
      <a
        href={`https://${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] font-medium text-violet-500 hover:text-violet-400 transition-colors flex-shrink-0"
      >
        Policy ↗
      </a>
    </div>
  )
}