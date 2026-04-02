import { useState, useEffect } from 'react'

/**
 * Top banner ad — responsive, 320x100 on mobile, 728x90 on desktop
 * Auto-loads after DOM is ready
 */
export default function AdBanner({ className = '', style = {} }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (window.adsbygoogle && window.adsbygoogle.push) {
      // AdSense script already loaded
      window.adsbygoogle.push({})
      setLoaded(true)
    } else {
      // Script not loaded yet — wait 100ms then try again
      const timer = setTimeout(() => {
        if (window.adsbygoogle && window.adsbygoogle.push) {
          window.adsbygoogle.push({})
          setLoaded(true)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!loaded) {
    return null
  }

  return (
    <ins
      className={`adsbygoogle block w-full max-w-2xl mx-auto
                  rounded-2xl bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06]
                  p-3 flex items-center justify-center gap-2 text-sm text-gray-500
                  ${className}`}
      style={{
        minHeight: '100px',
        display: 'block',
        maxWidth: '728px',
        margin: '0 auto',
        ...style,
      }}
      data-ad-client="ca-pub-3927069064153661"
      data-ad-slot="3077264714"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}