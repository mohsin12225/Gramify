// import { useState, useCallback, useEffect } from 'react'
// import { useAuth } from '../context/AuthContext'
// import {
//   getGuestRemaining, getUserRemaining, DAILY_LIMIT,
// } from '../lib/limits'
// import {
//   getGuestHistory, deleteGuestHistory, clearGuestHistory,
//   getUserHistory, deleteUserHistory, clearUserHistory,
// } from '../lib/history'
// import Logo from './Logo'
// import FixerPage from './FixerPage'
// import HistoryPage from './HistoryPage'
// import SettingsPage from './SettingsPage'

// const tabs = [
//   { id: 'fixer', label: 'Fixer' },
//   { id: 'history', label: 'History' },
//   { id: 'settings', label: 'Settings' },
// ]

// export default function MainApp() {
//   const { user, isGuest } = useAuth()
//   const [activeTab, setActiveTab] = useState('fixer')

//   const [history, setHistory] = useState([])
//   const [historyLoading, setHistoryLoading] = useState(true)
//   const [remaining, setRemaining] = useState(DAILY_LIMIT)

//   const refreshRemaining = useCallback(async () => {
//     try {
//       if (isGuest) setRemaining(getGuestRemaining())
//       else if (user) setRemaining(await getUserRemaining(user.id))
//     } catch { setRemaining(DAILY_LIMIT) }
//   }, [isGuest, user])

//   const refreshHistory = useCallback(async () => {
//     setHistoryLoading(true)
//     try {
//       if (isGuest) setHistory(getGuestHistory())
//       else if (user) setHistory(await getUserHistory(user.id))
//     } catch { setHistory([]) }
//     setHistoryLoading(false)
//   }, [isGuest, user])

//   useEffect(() => {
//     refreshRemaining()
//     refreshHistory()
//   }, [refreshRemaining, refreshHistory])

//   const handleDeleteOne = async (id) => {
//     if (isGuest) { deleteGuestHistory(id); setHistory(getGuestHistory()) }
//     else { await deleteUserHistory(id); setHistory(p => p.filter(h => h.id !== id)) }
//   }

//   const handleClearAll = async () => {
//     if (isGuest) { clearGuestHistory(); setHistory([]) }
//     else if (user) { await clearUserHistory(user.id); setHistory([]) }
//   }

//   return (
//     <div className="min-h-screen bg-[#f2f2f7] dark:bg-[#0a0a0b] transition-colors duration-300">
//       {/* Ambient BG */}
//       <div className="pointer-events-none fixed inset-0 overflow-hidden dark:block hidden">
//         <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/[0.04] blur-[150px] rounded-full" />
//       </div>

//       <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-28 pt-2">
//         <div key={activeTab} className="animate-fade">
//           {activeTab === 'fixer' && (
//             <FixerPage
//               remaining={remaining}
//               refreshRemaining={refreshRemaining}
//               refreshHistory={refreshHistory}
//               goToHistory={() => setActiveTab('history')}
//             />
//           )}
//           {activeTab === 'history' && (
//             <HistoryPage
//               history={history}
//               loading={historyLoading}
//               onDelete={handleDeleteOne}
//               onClearAll={handleClearAll}
//             />
//           )}
//           {activeTab === 'settings' && (
//             <SettingsPage
//               historyCount={history.length}
//               onClearHistory={handleClearAll}
//             />
//           )}
//         </div>
//       </div>

//       {/* ═══ Bottom Tab Bar ═══ */}
//       <nav
//         className="fixed bottom-0 left-0 right-0 z-50
//                    bg-white/80 dark:bg-[#0a0a0b]/80
//                    backdrop-blur-2xl border-t border-gray-200/80 dark:border-white/[0.06]"
//         style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
//       >
//         <div className="max-w-2xl mx-auto flex items-center justify-around px-2">
//           {tabs.map((tab) => {
//             const active = activeTab === tab.id
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex flex-col items-center gap-0.5 py-2 px-5 rounded-2xl transition-all duration-200
//                   ${active
//                     ? 'text-violet-500'
//                     : 'text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400'
//                   }`}
//               >
//                 {tab.id === 'fixer' ? (
//                   <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
//                     <Logo size="xs" />
//                   </div>
//                 ) : (
//                   <TabIcon name={tab.id} active={active} />
//                 )}
//                 <span className={`text-[10px] font-semibold ${active ? 'text-violet-500' : ''}`}>
//                   {tab.label}
//                 </span>
//               </button>
//             )
//           })}
//         </div>
//       </nav>
//     </div>
//   )
// }

// function TabIcon({ name, active }) {
//   const w = active ? '22' : '20'
//   const sw = active ? '2.2' : '1.8'
//   const cls = `transition-all duration-200 ${active ? 'scale-110' : 'scale-100'}`

//   if (name === 'history')
//     return (
//       <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls}>
//         <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
//       </svg>
//     )
//   if (name === 'settings')
//     return (
//       <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls}>
//         <circle cx="12" cy="12" r="3" />
//         <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
//       </svg>
//     )
//   return null
// }
import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getGuestRemaining, getUserRemaining, DAILY_LIMIT,
} from '../lib/limits'
import {
  getGuestHistory, deleteGuestHistory, clearGuestHistory,
  getUserHistory, deleteUserHistory, clearUserHistory,
} from '../lib/history'
import Logo from './Logo'
import FixerPage from './FixerPage'
import HistoryPage from './HistoryPage'
import SettingsPage from './SettingsPage'
import PrivacyPage from './PrivacyPage'
import AboutPage from './AboutPage'

const tabs = [
  { id: 'fixer', label: 'Fixer' },
  { id: 'history', label: 'History' },
  { id: 'settings', label: 'Settings' },
]

export default function MainApp() {
  const { user, isGuest } = useAuth()
  const [activeTab, setActiveTab] = useState('fixer')

  // Sub-pages (overlay on top of tabs)
  const [subPage, setSubPage] = useState(null) // 'privacy' | 'about' | null

  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [remaining, setRemaining] = useState(DAILY_LIMIT)

  const refreshRemaining = useCallback(async () => {
    try {
      if (isGuest) setRemaining(getGuestRemaining())
      else if (user) setRemaining(await getUserRemaining(user.id))
    } catch { setRemaining(DAILY_LIMIT) }
  }, [isGuest, user])

  const refreshHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      if (isGuest) setHistory(getGuestHistory())
      else if (user) setHistory(await getUserHistory(user.id))
    } catch { setHistory([]) }
    setHistoryLoading(false)
  }, [isGuest, user])

  useEffect(() => {
    refreshRemaining()
    refreshHistory()
  }, [refreshRemaining, refreshHistory])

  const handleDeleteOne = async (id) => {
    if (isGuest) { deleteGuestHistory(id); setHistory(getGuestHistory()) }
    else { await deleteUserHistory(id); setHistory(p => p.filter(h => h.id !== id)) }
  }

  const handleClearAll = async () => {
    if (isGuest) { clearGuestHistory(); setHistory([]) }
    else if (user) { await clearUserHistory(user.id); setHistory([]) }
  }

  // If sub-page is active, show it instead of tabs
  const showSubPage = subPage !== null

  return (
    <div className="min-h-screen bg-[#f2f2f7] dark:bg-[#0a0a0b] transition-colors duration-300">
      {/* Ambient BG */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden dark:block hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/[0.04] blur-[150px] rounded-full" />
      </div>

      {/* Top Ad Banner */}
      <AdBanner />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-28 pt-2">
        {/* Top Links */}
        {!showSubPage && (
          <div className="flex items-center justify-end gap-1 pt-4 pb-0 animate-fade">
            <TopLink onClick={() => setSubPage('about')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              About
            </TopLink>
            <span className="text-gray-300 dark:text-zinc-700 text-[10px]">·</span>
            <TopLink onClick={() => setSubPage('privacy')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Privacy
            </TopLink>
          </div>
        )}

        {/* Sub-pages */}
        {subPage === 'privacy' && <PrivacyPage onBack={() => setSubPage(null)} />}
        {subPage === 'about' && <AboutPage onBack={() => setSubPage(null)} />}

        {/* Main Tab Content */}
        {!showSubPage && (
          <div key={activeTab} className="animate-fade">
            {activeTab === 'fixer' && (
              <FixerPage
                remaining={remaining}
                refreshRemaining={refreshRemaining}
                refreshHistory={refreshHistory}
                goToHistory={() => setActiveTab('history')}
              />
            )}
            {activeTab === 'history' && (
              <HistoryPage
                history={history}
                loading={historyLoading}
                onDelete={handleDeleteOne}
                onClearAll={handleClearAll}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsPage
                historyCount={history.length}
                onClearHistory={handleClearAll}
              />
            )}
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      {!showSubPage && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50
                     bg-white/80 dark:bg-[#0a0a0b]/80
                     backdrop-blur-2xl border-t border-gray-200/80 dark:border-white/[0.06]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-around px-2">
            {tabs.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-0.5 py-2 px-5 rounded-2xl transition-all duration-200
                    ${active
                      ? 'text-violet-500'
                      : 'text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400'
                    }`}
                >
                  {tab.id === 'fixer' ? (
                    <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                      <Logo size="xs" />
                    </div>
                  ) : (
                    <TabIcon name={tab.id} active={active} />
                  )}
                  <span className={`text-[10px] font-semibold ${active ? 'text-violet-500' : ''}`}>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      )}

      {/* Bottom Ad Banner */}
      <AdBanner />
    </div>
  )
}

/* ─── Top link button ─────────────────────────────────── */

function TopLink({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium
                 text-gray-400 dark:text-zinc-500
                 hover:text-gray-600 dark:hover:text-zinc-300
                 hover:bg-gray-100 dark:hover:bg-white/[0.05]
                 active:scale-95 transition-all duration-200"
    >
      {children}
    </button>
  )
}

/* ─── Tab icons ───────────────────────────────────────── */

function TabIcon({ name, active }) {
  const w = active ? '22' : '20'
  const sw = active ? '2.2' : '1.8'
  const cls = `transition-all duration-200 ${active ? 'scale-110' : 'scale-100'}`

  if (name === 'history')
    return (
      <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    )
  if (name === 'settings')
    return (
      <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  return null
}