import { supabaseClient } from '@/providers/supabase/client'

export const login = () => {
  supabaseClient.auth.signInWithOAuth({
    provider: 'google'
  })
}
