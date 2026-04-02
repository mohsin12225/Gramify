import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

var AuthContext = createContext(null)

async function syncProfile(authUser) {
  if (!authUser || !authUser.id) return

  var today = new Date().toISOString().split('T')[0]

  try {
    var result = supabase.from('users').upsert(
      {
        id: authUser.id,
        email: authUser.email || '',
        requests_today: 0,
        last_reset_date: today,
      },
      { onConflict: 'id', ignoreDuplicates: true }
    )

    var timeout = new Promise(function(_, reject) {
      setTimeout(function() { reject(new Error('timeout')) }, 5000)
    })

    await Promise.race([result, timeout])
  } catch (e) {
    console.warn('[Auth] Profile sync skipped:', e.message)
  }
}

export function AuthProvider({ children }) {
  var [user, setUser] = useState(null)
  var [loading, setLoading] = useState(true)
  var [isGuest, setIsGuest] = useState(false)
  var resolved = useRef(false)

  function resolveLoading() {
    if (!resolved.current) {
      resolved.current = true
      setLoading(false)
    }
  }

  useEffect(function() {
    var mounted = true

    // Safety timeout — always resolves loading within 3 seconds
    var safetyTimeout = setTimeout(function() {
      if (mounted && !resolved.current) {
        console.warn('[Auth] Safety timeout triggered')
        try {
          if (localStorage.getItem('gf_guest') === '1') {
            setIsGuest(true)
          }
        } catch (e) { /* ignore */ }
        resolveLoading()
      }
    }, 3000)

    // Auth state listener
    var subscription = null
    try {
      var result = supabase.auth.onAuthStateChange(function(event, session) {
        if (!mounted) return

        var currentUser = session && session.user ? session.user : null
        setUser(currentUser)

        if (currentUser) {
          setIsGuest(false)
          try { localStorage.removeItem('gf_guest') } catch(e) {}
          syncProfile(currentUser)
        }

        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          if (!currentUser && event !== 'SIGNED_IN') {
            try {
              if (localStorage.getItem('gf_guest') === '1') {
                setIsGuest(true)
              }
            } catch(e) {}
          }
          resolveLoading()
        }
      })

      subscription = result.data.subscription
    } catch (e) {
      console.warn('[Auth] onAuthStateChange failed:', e)
      resolveLoading()
    }

    // Fallback getSession
    try {
      supabase.auth.getSession().then(function(response) {
        if (!mounted) return

        var session = response && response.data && response.data.session
        var u = session && session.user ? session.user : null

        setUser(u)

        if (u) {
          syncProfile(u)
        } else {
          try {
            if (localStorage.getItem('gf_guest') === '1') {
              setIsGuest(true)
            }
          } catch(e) {}
        }

        resolveLoading()
      }).catch(function(err) {
        console.warn('[Auth] getSession failed:', err)
        if (mounted) {
          try {
            if (localStorage.getItem('gf_guest') === '1') {
              setIsGuest(true)
            }
          } catch(e) {}
          resolveLoading()
        }
      })
    } catch (e) {
      console.warn('[Auth] getSession threw:', e)
      resolveLoading()
    }

    return function() {
      mounted = false
      clearTimeout(safetyTimeout)
      if (subscription) {
        try { subscription.unsubscribe() } catch(e) {}
      }
    }
  }, [])

  var signInWithGoogle = async function() {
    var result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (result.error) throw result.error
  }

  var continueAsGuest = function() {
    try { localStorage.setItem('gf_guest', '1') } catch(e) {}
    setIsGuest(true)
  }

  var signOut = async function() {
    if (isGuest) {
      try { localStorage.removeItem('gf_guest') } catch(e) {}
      setIsGuest(false)
      setUser(null)
    } else {
      try { await supabase.auth.signOut() } catch (e) {
        console.warn('[Auth] signOut error:', e)
      }
      setUser(null)
      setIsGuest(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      user: user,
      loading: loading,
      isGuest: isGuest,
      isAuthenticated: !!user || isGuest,
      signInWithGoogle: signInWithGoogle,
      continueAsGuest: continueAsGuest,
      signOut: signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  var ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}