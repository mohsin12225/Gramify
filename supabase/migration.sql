-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  AI Grammar Fixer — Database Setup                              ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- 1. Users table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  requests_today   INTEGER DEFAULT 0,
  last_reset_date  DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Requests log table
CREATE TABLE IF NOT EXISTS public.requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  input_text  TEXT NOT NULL,
  output_text TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON public.requests(user_id);
CREATE INDEX IF NOT EXISTS idx_users_last_reset ON public.users(last_reset_date);

-- 4. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies — users can only access their own data

-- users: SELECT
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- users: INSERT
CREATE POLICY "Users can create own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- users: UPDATE
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- requests: INSERT
CREATE POLICY "Users can insert own requests"
  ON public.requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- requests: SELECT
CREATE POLICY "Users can read own requests"
  ON public.requests FOR SELECT
  USING (auth.uid() = user_id);