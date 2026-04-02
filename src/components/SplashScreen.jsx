import Logo from './Logo'

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-[#0a0a0b] flex items-center justify-center">
      <div className="absolute w-80 h-80 rounded-full bg-violet-500/10 blur-[120px] animate-glow" />

      <div className="relative flex flex-col items-center gap-5 animate-fade">
        <div className="relative">
          <div className="absolute -inset-3 rounded-3xl bg-violet-500/10 blur-2xl animate-glow" />
          <div className="relative w-20 h-20 rounded-[22px] bg-white/10 dark:bg-white/5
                          border border-white/20 dark:border-white/10
                          backdrop-blur-xl flex items-center justify-center
                          shadow-2xl shadow-violet-500/10">
            <Logo size="lg" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-violet-400 animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-violet-400 animate-pulse [animation-delay:0.2s]" />
          <div className="w-1 h-1 rounded-full bg-violet-400 animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  )
}