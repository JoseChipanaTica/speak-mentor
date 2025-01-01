import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export class DBClient {
  client
  constructor() {
    const cookieStore = cookies()

    this.client = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async getAll() {
            return (await cookieStore).getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(async ({ name, value, options }) => (await cookieStore).set(name, value, options))
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          }
        }
      }
    )
  }

  async getUser() {
    const { data } = await this.client.auth.getUser()
    return data.user
  }

  async setSession(access_token: string, refresh_token: string) {
    return await this.client.auth.setSession({ access_token, refresh_token })
  }
}
