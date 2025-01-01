import { create } from 'zustand'

type loadingHook = {
  loading: boolean
  updateLoading: (loading: boolean) => void
}

export const useLoadingHook = create<loadingHook>(set => ({
  loading: false,
  updateLoading: loading => set({ loading })
}))
