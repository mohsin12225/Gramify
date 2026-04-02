
import AdInContent from './AdInContent'
import AdSidebar from './AdSidebar'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../lib/supabase'
import { clearGuestHistory } from '../lib/history'
import Logo from './Logo'

const themes = [
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'system', label: 'System', icon: '💻' },
]

export default function SettingsPage({ historyCount, onClearHistory }) {
  const { user, isGuest, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [clearing, setClearing] = useState(false)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest'
  const email = user?.email || 'Local storage only'
  const avatar = user?.user_metadata?.avatar_url

  const handleClearHistory = async () => {
    setClearing(true)
    await onClearHistory()
    setClearing(false)
    setShowClearConfirm(false)
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      if (isGuest) {
        clearGuestHistory()
        localStorage.removeItem('gf_guest_limits')
        localStorage.removeItem('gf_guest')
      } else if (user) {
        await supabase.from('requests').delete().eq('user_id', user.id)
        await supabase.from('users').delete().eq('id', user.id)
      }
      await signOut()
    } catch {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <header className="pt-6 pb-4 animate-slide">
        <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        <p className="text-[13px] text-gray-500 dark:text-zinc-500 font-medium mt-0.5">Manage your account & preferences</p>
      </header>

      {/* ═══ Profile Card ═══ */}
      <div className="animate-slide-d1 rounded-3xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-5 mb-6 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/15 flex-shrink-0 overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="" className="w-14 h-14 rounded-2xl object-cover" />
            ) : (
              <span className="text-xl font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-white truncate">{displayName}</h3>
            <p className="text-[13px] text-gray-500 dark:text-zinc-400 truncate">{email}</p>
            <span className={`inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide
              ${isGuest
                ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
              }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isGuest ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              {isGuest ? 'Guest' : 'Google Account'}
            </span>
          </div>
        </div>
      </div>


      {/* ═══ Data ═══ */}
      <div className="animate-slide-d3 mb-6">
        <SectionLabel>Data</SectionLabel>
        <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] overflow-hidden shadow-sm dark:shadow-none">
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
            iconColor="bg-blue-100 dark:bg-blue-500/10 text-blue-500"
            label="History"
            sublabel={`${historyCount} item${historyCount !== 1 ? 's' : ''} saved`}
          />
          <Divider />
          <SettingsButton
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>}
            iconColor="bg-orange-100 dark:bg-orange-500/10 text-orange-500"
            label="Clear History"
            sublabel="Remove all saved corrections"
            onClick={() => setShowClearConfirm(true)}
            disabled={historyCount === 0}
          />
        </div>
      </div>

      {/* ═══ Account ═══ */}
      <div className="animate-slide-d4 mb-6">
        <SectionLabel>Account</SectionLabel>
        <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] overflow-hidden shadow-sm dark:shadow-none">
          <SettingsButton
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>}
            iconColor="bg-gray-100 dark:bg-white/[0.05] text-gray-500 dark:text-zinc-400"
            label="Sign Out"
            onClick={() => setShowSignOutConfirm(true)}
          />
          <Divider />
          <SettingsButton
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
            iconColor="bg-red-100 dark:bg-red-500/10 text-red-500"
            label="Delete Account"
            sublabel="Permanently remove all data"
            danger
            onClick={() => setShowDeleteConfirm(true)}
          />
        </div>
      </div>

      {/* ═══ About ═══ */}
      {/* ═══ AI Providers ═══ */}
      <div className="animate-slide-d5 mb-6">
        <SectionLabel>AI Providers</SectionLabel>
        <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] overflow-hidden shadow-sm dark:shadow-none">
          {(() => {
            // Import inline to avoid circular deps
            const statuses = [
              { name: 'Groq', configured: !!import.meta.env.VITE_GROQ_API_KEY && !import.meta.env.VITE_GROQ_API_KEY.includes('your-') },
              { name: 'OpenRouter', configured: !!import.meta.env.VITE_OPENROUTER_API_KEY && !import.meta.env.VITE_OPENROUTER_API_KEY.includes('your-') },
              { name: 'NVIDIA', configured: !!import.meta.env.VITE_NVIDIA_API_KEY && !import.meta.env.VITE_NVIDIA_API_KEY.includes('your-') },
            ]
            return statuses.map((p, i) => (
              <div key={p.name}>
                {i > 0 && <Divider />}
                <SettingsRow
                  icon={
                    <div className={`w-3 h-3 rounded-full ${p.configured ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-zinc-600'}`} />
                  }
                  iconColor={p.configured
                    ? 'bg-emerald-100 dark:bg-emerald-500/10'
                    : 'bg-gray-100 dark:bg-white/[0.04]'
                  }
                  label={p.name}
                  sublabel={p.configured ? 'Active — Free tier' : 'Not configured'}
                />
              </div>
            ))
          })()}
        </div>
        <p className="text-[11px] text-gray-400 dark:text-zinc-600 mt-2 ml-1">
          Providers are used in order. If one hits its free limit, the next is tried automatically.
        </p>
      </div>

      {/* ═══ About ═══ */}
      <div className="animate-slide-d5 mb-6">
        <SectionLabel>About</SectionLabel>
        <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] overflow-hidden shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3.5 px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center flex-shrink-0">
              <Logo size="xs" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-gray-900 dark:text-white">AI Grammar Fixer</p>
              <p className="text-[12px] text-gray-400 dark:text-zinc-500 mt-0.5">Version 1.1.0</p>
            </div>
          </div>
        </div>
      </div>

            {/* ═══ About ═══ */}
      <div className="animate-slide-d5 mb-6">
        <SectionLabel>Appearance</SectionLabel>
        <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-4 shadow-sm dark:shadow-none">
          <p className="text-[14px] font-semibold text-gray-900 dark:text-white mb-3">Theme</p>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/[0.04] rounded-2xl p-1.5 border border-gray-200 dark:border-white/[0.04]">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold
                  transition-all duration-300
                  ${theme === t.id
                    ? 'bg-white dark:bg-white/[0.1] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-white/[0.08]'
                    : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-400'
                  }`}
              >
                <span className="text-[15px]">{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ad in content (after settings sections) */}
      <AdInContent className="mb-8" />

      {/* ═══ Dialogs ═══ */}
      {showClearConfirm && (
        <Dialog title="Clear History?" desc={`This will permanently remove ${historyCount} item${historyCount !== 1 ? 's' : ''}.`}
          confirmLabel={clearing ? 'Clearing…' : 'Clear All'}
          onConfirm={handleClearHistory} onCancel={() => setShowClearConfirm(false)} danger disabled={clearing} />
      )}

      {/* ═══ Dialogs ═══ */}
      {showClearConfirm && (
        <Dialog
          title="Clear History?"
          desc={`This will permanently remove ${historyCount} item${historyCount !== 1 ? 's' : ''}.`}
          confirmLabel={clearing ? 'Clearing…' : 'Clear All'}
          onConfirm={handleClearHistory}
          onCancel={() => setShowClearConfirm(false)}
          danger
          disabled={clearing}
        />
      )}

      {showSignOutConfirm && (
        <Dialog
          title="Sign Out?"
          desc={isGuest ? 'Your local data will stay on this device.' : 'You can sign back in anytime.'}
          confirmLabel="Sign Out"
          onConfirm={signOut}
          onCancel={() => setShowSignOutConfirm(false)}
        />
      )}

      {showDeleteConfirm && (
        <Dialog
          title="Delete Account?"
          desc="This action cannot be undone. All your data will be permanently removed."
          confirmLabel={deleting ? 'Deleting…' : 'Delete Forever'}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteConfirm(false)}
          danger
          disabled={deleting}
        />
      )}

      {/* Sidebar Ad (desktop only) */}
      <div className="hidden sm:block">
        <AdSidebar className="fixed right-4 top-24 z-20" />
      </div>

    </>
  )
}

      {/* Sidebar Ad (desktop only) */}
      
function SectionLabel({ children }) {
  return <p className="text-[12px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 ml-1">{children}</p>
}

function Divider() {
  return <div className="ml-16 border-t border-gray-100 dark:border-white/[0.04]" />
}

function SettingsRow({ icon, iconColor, label, sublabel }) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-gray-900 dark:text-white">{label}</p>
        {sublabel && <p className="text-[12px] text-gray-400 dark:text-zinc-500 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}

function SettingsButton({ icon, iconColor, label, sublabel, onClick, danger, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-white/[0.03] active:bg-gray-100 dark:active:bg-white/[0.05]'}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-medium ${danger ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{label}</p>
        {sublabel && <p className={`text-[12px] mt-0.5 ${danger ? 'text-red-400/70' : 'text-gray-400 dark:text-zinc-500'}`}>{sublabel}</p>}
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-zinc-600 flex-shrink-0">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  )
}

function Dialog({ title, desc, confirmLabel, onConfirm, onCancel, danger, disabled }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 animate-fade">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/[0.08] p-6 shadow-2xl animate-scale">
        <h3 className="text-[18px] font-bold text-gray-900 dark:text-white text-center">{title}</h3>
        <p className="text-[14px] text-gray-500 dark:text-zinc-400 text-center mt-2 leading-relaxed">{desc}</p>
        <div className="mt-6 space-y-2">
          <button
            onClick={onConfirm}
            disabled={disabled}
            className={`flex items-center justify-center w-full rounded-2xl py-3.5 px-6 font-semibold text-[15px]
              active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${danger
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-900 dark:bg-white hover:opacity-90 text-white dark:text-black'
              }`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-2xl py-3.5 px-6 font-semibold text-[15px]
                       bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-zinc-300
                       hover:bg-gray-200 dark:hover:bg-white/[0.08]
                       active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
