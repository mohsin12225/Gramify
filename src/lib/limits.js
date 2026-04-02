import { supabase } from './supabase'

const DAILY_LIMIT = 5

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

function getGuestData() {
  try {
    return JSON.parse(localStorage.getItem('gf_guest_limits') || '{}')
  } catch {
    return {}
  }
}

function setGuestData(data) {
  localStorage.setItem('gf_guest_limits', JSON.stringify(data))
}

export function getGuestRemaining() {
  const today = getTodayDate()
  const d = getGuestData()
  if (d.date !== today) return DAILY_LIMIT
  return Math.max(0, DAILY_LIMIT - (d.count || 0))
}

export function incrementGuestUsage() {
  const today = getTodayDate()
  const d = getGuestData()

  if (d.date !== today) {
    setGuestData({ date: today, count: 1 })
    return { allowed: true, remaining: DAILY_LIMIT - 1 }
  }

  if ((d.count || 0) >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  const newCount = (d.count || 0) + 1
  setGuestData({ date: today, count: newCount })
  return { allowed: true, remaining: DAILY_LIMIT - newCount }
}

export async function getUserRemaining(userId) {
  const today = getTodayDate()

  try {
    const { data, error } = await supabase
      .from('users')
      .select('requests_today, last_reset_date')
      .eq('id', userId)
      .maybeSingle()

    if (error || !data) {
      await supabase.from('users').upsert(
        { id: userId, requests_today: 0, last_reset_date: today },
        { onConflict: 'id' }
      )
      return DAILY_LIMIT
    }

    if (data.last_reset_date !== today) {
      await supabase
        .from('users')
        .update({ requests_today: 0, last_reset_date: today })
        .eq('id', userId)
      return DAILY_LIMIT
    }

    return Math.max(0, DAILY_LIMIT - data.requests_today)
  } catch {
    return DAILY_LIMIT
  }
}

export async function incrementUserUsage(userId) {
  const today = getTodayDate()

  try {
    const { data, error } = await supabase
      .from('users')
      .select('requests_today, last_reset_date')
      .eq('id', userId)
      .maybeSingle()

    if (error || !data) {
      await supabase.from('users').upsert(
        { id: userId, requests_today: 1, last_reset_date: today },
        { onConflict: 'id' }
      )
      return { allowed: true, remaining: DAILY_LIMIT - 1 }
    }

    let currentCount = data.requests_today || 0

    if (data.last_reset_date !== today) {
      currentCount = 0
    }

    if (currentCount >= DAILY_LIMIT) {
      return { allowed: false, remaining: 0 }
    }

    const newCount = currentCount + 1

    await supabase
      .from('users')
      .update({ requests_today: newCount, last_reset_date: today })
      .eq('id', userId)

    return { allowed: true, remaining: DAILY_LIMIT - newCount }
  } catch {
    return { allowed: true, remaining: DAILY_LIMIT - 1 }
  }
}

export async function logRequest(userId, inputText, outputText) {
  try {
    await supabase.from('requests').insert({
      user_id: userId,
      input_text: inputText,
      output_text: outputText,
    })
  } catch {
    // silent
  }
}

export { DAILY_LIMIT }