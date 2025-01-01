/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useUserHook } from '@/hooks/user.hook'
import { supabaseClient } from '@/providers/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { login } from './auth'
import { LogoIcon } from './icons'

export function Navbar() {
  const { user, updateUser } = useUserHook()
  const router = useRouter()

  const getUser = async () => {
    const { data } = await supabaseClient.auth.getUser()

    if (data && data.user) {
      updateUser(data.user)
    }
  }

  const logOut = async () => {
    const { error } = await supabaseClient.auth.signOut()

    if (!error) {
      updateUser(null)
      router.push('/')
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <header>
      <nav className="border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex flex-wrap justify-between items-center">
          <Link href="/" className="flex items-center space-x-4">
            <LogoIcon />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">SpeakMentor</span>
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href={`/app`}>
                <label className="text-white cursor-pointer">App</label>
              </Link>
              <div className="divider divider-horizontal"></div>
              <div className="avatar m-1">
                <div className=" w-12 rounded-full cursor-pointer">
                  <img src={user.user_metadata.avatar_url} alt="user image" />
                </div>
              </div>
              <button className="btn primary" onClick={logOut}>
                Sign out
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={login}>
              Sign in
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
