import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

/**
 * Non-blocking profile sync.
 * Has its own 5s timeout — will never hang the app.
 */
async function syncProfile(authUser) {
  if (!authUser?.id) return

  const today = new Date().toISOString().split('T')[0]

  // Wrap in a race against a timeout
  const profilePromise = supabase.from('users').upsert(
    {
      id: authUser.id,
      email: authUser.email || '',
      requests_today: 0,
      last_reset_date: today,
    },
    { onConflict: 'id', ignoreDuplicates: true }
  )

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Profile sync timeout')), 5000)
  )

  try {
    await Promise.race([profilePromise, timeoutPromise])
  } catch (e) {
    // Completely silent — profile sync is optional
    console.warn('[Auth] Profile sync skipped:', e?.message)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  // Ref prevents multiple calls to setLoading(false)
  const resolved = useRef(false)

  function resolveLoading() {
    if (!resolved.current) {
      resolved.current = true
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    // ──────────────────────────────────────────────
    // 1. AUTH STATE LISTENER (primary source of truth)
    //
    //    Supabase v2 fires events in this order on page load:
    //    - INITIAL_SESSION (restored from localStorage)
    //    - TOKEN_REFRESHED (if token was expired and refresh succeeded)
    //    - SIGNED_OUT (if refresh failed)
    //
    //    On new login (OAuth redirect back):
    //    - SIGNED_IN
    // ──────────────────────────────────────────────
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      const currentUser = session?.user ?? null

      // Always update user state
      setUser(currentUser)

      if (currentUser) {
        setIsGuest(false)
        localStorage.removeItem('gf_guest')

        // Fire-and-forget — never blocks loading
        syncProfile(currentUser)
      }

      // Resolve loading on these events
      switch (event) {
        case 'INITIAL_SESSION':
          // Session was restored (or null if not logged in)
          if (!currentUser && localStorage.getItem('gf_guest') === '1') {
            setIsGuest(true)
          }
          resolveLoading()
          break

        case 'SIGNED_IN':
          resolveLoading()
          break

        case 'SIGNED_OUT':
          setUser(null)
          resolveLoading()
          break

        case 'TOKEN_REFRESHED':
          // Token refreshed successfully — user stays logged in
          resolveLoading()
          break

        default:
          break
      }
    })

    // ──────────────────────────────────────────────
    // 2. FALLBACK: getSession()
    //
    //    Older Supabase clients may not fire INITIAL_SESSION.
    //    This catches that edge case.
    //    .finally() guarantees loading is resolved no matter what.
    // ──────────────────────────────────────────────
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return

        if (error) {
          console.warn('[Auth] getSession error:', error.message)
          // Session is corrupt — clear it
          supabase.auth.signOut().catch(() => {})
          setUser(null)

          if (localStorage.getItem('gf_guest') === '1') {
            setIsGuest(true)
          }
          resolveLoading()
          return
        }

        const u = data?.session?.user ?? null
        setUser(u)

        if (u) {
          syncProfile(u)
        } else if (localStorage.getItem('gf_guest') === '1') {
          setIsGuest(true)
        }

        resolveLoading()
      })
      .catch((err) => {
        // getSession itself threw — extremely rare
        console.warn('[Auth] getSession threw:', err)
        if (mounted) {
          if (localStorage.getItem('gf_guest') === '1') {
            setIsGuest(true)
          }
          resolveLoading()
        }
      })

    // ──────────────────────────────────────────────
    // 3. NUCLEAR SAFETY NET
    //
    //    If everything else fails (network down, Supabase
    //    unreachable, storage locked), force loading to end.
    //    3 seconds is generous — most sessions restore in <100ms.
    // ──────────────────────────────────────────────
    const safetyTimeout = setTimeout(() => {
      if (mounted && !resolved.current) {
        console.warn('[Auth] Safety timeout — forcing app to load')
        if (localStorage.getItem('gf_guest') === '1') {
          setIsGuest(true)
        }
        resolveLoading()
      }
    }, 3000)

    // ──────────────────────────────────────────────
    // Cleanup
    // ──────────────────────────────────────────────
    return () => {
      mounted = false
      clearTimeout(safetyTimeout)
      subscription.unsubscribe()
    }
  }, []) // No dependencies — runs once on mount

  // ──────────────────────────────────────────────
  // Auth actions
  // ──────────────────────────────────────────────

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }

  const continueAsGuest = () => {
    localStorage.setItem('gf_guest', '1')
    setIsGuest(true)
  }

  const signOut = async () => {
    if (isGuest) {
      localStorage.removeItem('gf_guest')
      setIsGuest(false)
      setUser(null)
    } else {
      try {
        await supabase.auth.signOut()
      } catch (e) {
        console.warn('[Auth] signOut error:', e)
      }
      setUser(null)
      setIsGuest(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        isAuthenticated: !!user || isGuest,
        signInWithGoogle,
        continueAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}