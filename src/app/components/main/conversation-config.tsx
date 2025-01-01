/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client'

import { useLoadingHook } from '@/hooks/loading.hook'
import { useMessageHook } from '@/hooks/message.hook'
import { supabaseClient } from '@/providers/supabase/client'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Loading } from '../loading'

export function ConversationConfig() {
  const [conversationForm, setConversationForm] = useState({
    topic: '',
    firstLanguage: '',
    targetLanguage: ''
  })

  const { updateMessage } = useMessageHook()
  const { loading, updateLoading } = useLoadingHook()

  const startConversation = async () => {
    const { data, error } = await supabaseClient.auth.getSession()

    if (error || !data || !data.session) {
      return
    }

    if (!conversationForm.topic || !conversationForm.firstLanguage || !conversationForm.targetLanguage) {
      toast.error('Missing form data')
      return
    }

    updateLoading(true)
    const response = await fetch('/api/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: data.session?.access_token!,
        refresh_token: data.session?.refresh_token!
      },
      body: JSON.stringify(conversationForm)
    })

    updateLoading(false)
    if (response.status !== 200) {
      console.error('Error starting conversation:', response.statusText)
      return
    }

    const { messageResponse }: { messageResponse: speakMessageResponse } = await response.json()
    updateMessage(messageResponse)
  }

  return (
    <div className="w-full px-36 flex flex-col space-y-4 justify-center items-center">
      <input
        className="input input-bordered w-full"
        placeholder="Topic"
        value={conversationForm.topic}
        onChange={e => {
          setConversationForm({ ...conversationForm, topic: e.target.value })
        }}
      />

      <div className="flex space-x-4 w-full">
        <input
          className="input input-bordered w-full"
          placeholder="First language"
          value={conversationForm.firstLanguage}
          onChange={e => {
            setConversationForm({ ...conversationForm, firstLanguage: e.target.value })
          }}
        />

        <input
          className="input input-bordered w-full"
          placeholder="Target language"
          value={conversationForm.targetLanguage}
          onChange={e => {
            setConversationForm({ ...conversationForm, targetLanguage: e.target.value })
          }}
        />
      </div>

      <div>
        {loading ? (
          <Loading />
        ) : (
          <button className="btn btn-primary w-full" onClick={startConversation}>
            <span className="text-base font-bold text-white">Start conversation</span>
          </button>
        )}
      </div>
    </div>
  )
}
