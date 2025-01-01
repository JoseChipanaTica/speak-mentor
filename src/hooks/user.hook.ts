import { User } from '@supabase/supabase-js'
import { create } from 'zustand'

type userHook = {
  user: User | null
  updateUser: (user: User | null) => void
}

export const useUserHook = create<userHook>(set => ({
  user: null,
  updateUser: user => set({ user })
}))
