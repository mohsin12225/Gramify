import { createContext, useContext, useState, useEffect, useCallback } from 'react'

var ThemeContext = createContext(null)

function getSystemPreference() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch (e) {
    return 'dark'
  }
}

function getStoredTheme() {
  try {
    return localStorage.getItem('gf_theme') || 'dark'
  } catch (e) {
    return 'dark'
  }
}

function resolveTheme(theme) {
  if (theme === 'system') return getSystemPreference()
  return theme === 'light' ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  var [theme, setThemeState] = useState(function() {
    return getStoredTheme()
  })

  var applyTheme = useCallback(function(themeValue) {
    try {
      var resolved = resolveTheme(themeValue)
      var root = document.documentElement
      var bg = resolved === 'dark' ? '#0a0a0b' : '#f2f2f7'

      if (resolved === 'dark') {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.remove('dark')
        root.classList.add('light')
      }

      root.setAttribute('data-theme', resolved)
      root.style.colorScheme = resolved
      root.style.backgroundColor = bg

      if (document.body) {
        document.body.style.backgroundColor = bg
        document.body.style.color = resolved === 'dark' ? '#fafafa' : '#09090b'
      }

      var meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', bg)
    } catch (e) {
      console.warn('[Theme] Apply failed:', e)
    }
  }, [])

  var setTheme = useCallback(function(newTheme) {
    var value = newTheme || 'dark'
    try {
      localStorage.setItem('gf_theme', value)
    } catch (e) {
      // storage blocked
    }
    setThemeState(value)
    applyTheme(value)
  }, [applyTheme])

  useEffect(function() {
    applyTheme(theme)
  }, [])

  useEffect(function() {
    applyTheme(theme)
  }, [theme, applyTheme])

  useEffect(function() {
    if (theme !== 'system') return

    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)')
      var handler = function() { applyTheme('system') }
      mq.addEventListener('change', handler)
      return function() { mq.removeEventListener('change', handler) }
    } catch (e) {
      // matchMedia not supported
    }
  }, [theme, applyTheme])

  var isDark = resolveTheme(theme) === 'dark'

  return (
    <ThemeContext.Provider value={{ theme: theme, setTheme: setTheme, isDark: isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  var ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}