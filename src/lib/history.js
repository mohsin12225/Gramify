import { supabase } from './supabase'

const LOCAL_KEY = 'gf_history'
const MAX_LOCAL = 50

// ─── Guest (localStorage) ─────────────────────────────────────

export function getGuestHistory() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
  } catch {
    return []
  }
}

export function addGuestHistory(inputText, outputText) {
  const history = getGuestHistory()
  history.unshift({
    id: crypto.randomUUID(),
    input_text: inputText,
    output_text: outputText,
    created_at: new Date().toISOString(),
  })
  if (history.length > MAX_LOCAL) history.pop()
  localStorage.setItem(LOCAL_KEY, JSON.stringify(history))
}

export function deleteGuestHistory(id) {
  const history = getGuestHistory().filter((h) => h.id !== id)
  localStorage.setItem(LOCAL_KEY, JSON.stringify(history))
}

export function clearGuestHistory() {
  localStorage.removeItem(LOCAL_KEY)
}

// ─── Authenticated (Supabase) ────────────────────────────────

export async function getUserHistory(userId) {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('id, input_text, output_text, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export async function deleteUserHistory(id) {
  try {
    await supabase.from('requests').delete().eq('id', id)
  } catch {
    // silent
  }
}

export async function clearUserHistory(userId) {
  try {
    await supabase.from('requests').delete().eq('user_id', userId)
  } catch {
    // silent
  }
}