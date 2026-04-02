// import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// const ThemeContext = createContext(null)

// export function ThemeProvider({ children }) {
//   const [theme, setThemeState] = useState(() => {
//     return localStorage.getItem('gf_theme') || 'dark'
//   })

//   const applyTheme = useCallback((t) => {
//     const root = document.documentElement

//     if (t === 'system') {
//       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
//       root.classList.toggle('dark', prefersDark)
//     } else {
//       root.classList.toggle('dark', t === 'dark')
//     }

//     // Set body bg to prevent flash
//     const isDark =
//       t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
//     document.body.style.background = isDark ? '#0a0a0b' : '#f2f2f7'
//   }, [])

//   const setTheme = (t) => {
//     setThemeState(t)
//     localStorage.setItem('gf_theme', t)
//     applyTheme(t)
//   }

//   useEffect(() => {
//     applyTheme(theme)

//     if (theme === 'system') {
//       const mq = window.matchMedia('(prefers-color-scheme: dark)')
//       const handler = () => applyTheme('system')
//       mq.addEventListener('change', handler)
//       return () => mq.removeEventListener('change', handler)
//     }
//   }, [theme, applyTheme])

//   const isDark =
//     theme === 'dark' ||
//     (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export function useTheme() {
//   const ctx = useContext(ThemeContext)
//   if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
//   return ctx
// }
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(null)

function getSystemPreference() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'dark'
  }
}

function getStoredTheme() {
  try {
    return localStorage.getItem('gf_theme') || 'dark'
  } catch {
    return 'dark'
  }
}

function resolveTheme(theme) {
  if (theme === 'system') return getSystemPreference()
  return theme === 'light' ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme)

  const applyTheme = useCallback((themeValue) => {
    const resolved = resolveTheme(themeValue)
    const root = document.documentElement

    // Explicit add/remove — never use toggle with boolean
    if (resolved === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }

    // Set data attribute as fallback
    root.setAttribute('data-theme', resolved)

    // Update body + html background directly
    const bg = resolved === 'dark' ? '#0a0a0b' : '#f2f2f7'
    const fg = resolved === 'dark' ? '#fafafa' : '#09090b'

    root.style.colorScheme = resolved
    root.style.backgroundColor = bg
    document.body.style.backgroundColor = bg
    document.body.style.color = fg

    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', bg)
  }, [])

  const setTheme = useCallback((newTheme) => {
    const value = newTheme || 'dark'

    try {
      localStorage.setItem('gf_theme', value)
    } catch {
      // storage full or blocked
    }

    setThemeState(value)
    applyTheme(value)
  }, [applyTheme])

  // Apply on mount
  useEffect(() => {
    applyTheme(theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Apply when theme state changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  // Listen for system preference changes when in "system" mode
  useEffect(() => {
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')

    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, applyTheme])

  const isDark = resolveTheme(theme) === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}