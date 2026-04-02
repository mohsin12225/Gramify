// import { useState } from 'react'
// import { useAuth } from '../context/AuthContext'

// export default function LoginScreen() {
//   const { signInWithGoogle, continueAsGuest } = useAuth()
//   const [gLoading, setGLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleGoogle = async () => {
//     try {
//       setError('')
//       setGLoading(true)
//       await signInWithGoogle()
//     } catch {
//       setError('Sign in failed. Please try again.')
//       setGLoading(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-gray-50 dark:bg-[#0a0a0b] flex items-center justify-center px-6 overflow-hidden">
//       {/* BG glows */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute top-[15%] left-[20%] w-96 h-96 rounded-full bg-indigo-600/[0.06] blur-[150px] animate-glow" />
//         <div className="absolute bottom-[20%] right-[15%] w-72 h-72 rounded-full bg-purple-600/[0.05] blur-[120px] animate-glow [animation-delay:2s]" />
//       </div>

//       <div className="relative z-10 flex flex-col items-center w-full max-w-[380px]">
//         {/* Logo */}
//         <div className="animate-slide mb-8 relative">
//           <div className="absolute -inset-4 rounded-3xl bg-indigo-500/10 blur-2xl animate-glow" />
//           <div className="relative w-20 h-20 rounded-[22px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/25 animate-float">
//             <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5Z"/>
//               <path d="M19 3l.5 2L22 5.5 19.5 6 19 8l-.5-2L16 5.5 18.5 5Z" opacity=".7"/>
//             </svg>
//           </div>
//         </div>

//         <h1 className="animate-slide-d1 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white text-center">
//           AI Assistant
//         </h1>
//         <p className="animate-slide-d2 mt-3 text-base text-gray-500 dark:text-zinc-400 text-center font-medium">
//           Your intelligent companion
//         </p>

//         <div className="animate-slide-d3 flex items-center gap-2 mt-6">
//           {['Grammar Fix', 'Instant', 'Free'].map((l) => (
//             <span key={l} className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase
//                                      bg-gray-200/60 dark:bg-white/[0.05] text-gray-500 dark:text-zinc-500
//                                      border border-gray-200 dark:border-white/[0.06]">{l}</span>
//           ))}
//         </div>

//         <div className="w-full mt-10 space-y-3">
//           <button onClick={handleGoogle} disabled={gLoading}
//             className="animate-slide-d3 group flex items-center justify-center gap-3 w-full rounded-2xl py-4 px-6
//                        font-semibold text-[15px] bg-gray-900 dark:bg-white text-white dark:text-black
//                        hover:opacity-90 active:scale-[0.98] transition-all duration-300
//                        disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10 dark:shadow-white/10">
//             {gLoading ? <Spinner /> : <><GoogleIcon /><span>Continue with Google</span></>}
//           </button>

//           <button onClick={continueAsGuest}
//             className="animate-slide-d4 flex items-center justify-center gap-3 w-full rounded-2xl py-4 px-6
//                        font-semibold text-[15px] bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-zinc-300
//                        border border-gray-200 dark:border-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.08]
//                        active:scale-[0.98] transition-all duration-300">
//             <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
//             </svg>
//             <span>Continue as Guest</span>
//           </button>
//         </div>

//         {error && (
//           <div className="mt-4 w-full rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 animate-scale">
//             <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
//           </div>
//         )}

//         <p className="animate-slide-d5 mt-8 text-[11px] text-gray-400 dark:text-zinc-600 text-center tracking-wide">
//           Guest data is stored locally only · No account required
//         </p>
//       </div>
//     </div>
//   )
// }

// function GoogleIcon() {
//   return (
//     <svg width={18} height={18} viewBox="0 0 24 24">
//       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
//       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//     </svg>
//   )
// }

// function Spinner() {
//   return (
//     <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
//       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
//     </svg>
//   )
// }
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function LoginScreen() {
  const { signInWithGoogle, continueAsGuest } = useAuth()
  const [gLoading, setGLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogle = async () => {
    try {
      setError('')
      setGLoading(true)
      await signInWithGoogle()
    } catch {
      setError('Sign in failed. Please try again.')
      setGLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-[#0a0a0b] flex items-center justify-center px-6 overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] left-[20%] w-96 h-96 rounded-full bg-violet-600/[0.06] blur-[150px] animate-glow" />
        <div className="absolute bottom-[20%] right-[15%] w-72 h-72 rounded-full bg-purple-600/[0.05] blur-[120px] animate-glow [animation-delay:2s]" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-[380px]">
        {/* Logo */}
        <div className="animate-slide mb-8 relative">
          <div className="absolute -inset-6 rounded-3xl bg-violet-500/10 blur-3xl animate-glow" />
          <div className="relative w-24 h-24 rounded-[26px] bg-white/10 dark:bg-white/5
                          border border-white/20 dark:border-white/10
                          backdrop-blur-xl flex items-center justify-center
                          shadow-2xl shadow-violet-500/20 animate-float">
            <Logo size="xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="animate-slide-d1 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white text-center">
          Gramify
        </h1>
        <p className="animate-slide-d2 mt-3 text-base text-gray-500 dark:text-zinc-400 text-center font-medium">
          Your professtional grammer fixer assistant
        </p>

        {/* Feature pills */}
        <div className="animate-slide-d3 flex items-center gap-2 mt-6">
          {['Grammar Fix', 'Instant', 'Free'].map((l) => (
            <span
              key={l}
              className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase
                         bg-gray-200/60 dark:bg-white/[0.05] text-gray-500 dark:text-zinc-500
                         border border-gray-200 dark:border-white/[0.06]"
            >
              {l}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="w-full mt-10 space-y-3">
          <button
            onClick={handleGoogle}
            disabled={gLoading}
            className="animate-slide-d3 group flex items-center justify-center gap-3 w-full rounded-2xl py-4 px-6
                       font-semibold text-[15px] bg-gray-900 dark:bg-white text-white dark:text-black
                       hover:opacity-90 active:scale-[0.98] transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10 dark:shadow-white/10"
          >
            {gLoading ? (
              <Spinner />
            ) : (
              <>
                <GoogleIcon />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <button
            onClick={continueAsGuest}
            className="animate-slide-d4 flex items-center justify-center gap-3 w-full rounded-2xl py-4 px-6
                       font-semibold text-[15px] bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-zinc-300
                       border border-gray-200 dark:border-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.08]
                       active:scale-[0.98] transition-all duration-300"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Continue as Guest</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 w-full rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 animate-scale">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        <p className="animate-slide-d5 mt-8 text-[11px] text-gray-400 dark:text-zinc-600 text-center tracking-wide">
          Guest data is stored locally only · No account required
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}