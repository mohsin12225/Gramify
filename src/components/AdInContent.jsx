import { useState, useEffect } from 'react'

/**
 * In-content ad — appears between sections
 * 300x250 on desktop, 320x100 on mobile
 */
export default function AdInContent({ className = '', style = {} }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (window.adsbygoogle && window.adsbygoogle.push) {
      window.adsbygoogle.push({})
      setLoaded(true)
    } else {
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
                  p-4 flex items-center justify-center gap-2 text-sm text-gray-500
                  ${className}`}
      style={{
        minHeight: '250px',
        display: 'block',
        maxWidth: '300px',
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