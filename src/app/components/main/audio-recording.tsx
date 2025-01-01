/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useLoadingHook } from '@/hooks/loading.hook'
import { useMessageHook } from '@/hooks/message.hook'
import { supabaseClient } from '@/providers/supabase/client'
import { useRef, useState } from 'react'
import { LogoIcon, StopIcon } from '../icons'
import { Loading } from '../loading'

export function AudioRecording() {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const { message, updateMessage } = useMessageHook()
  const { loading, updateLoading } = useLoadingHook()

  if (!message) {
    return null
  }

  const startRecording = async (): Promise<void> => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })

      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' })
        audioChunks.current = []
        startConversation(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const startConversation = async (audioBlob: Blob) => {
    const { data, error } = await supabaseClient.auth.getSession()

    if (error || !data || !data.session) {
      return
    }

    updateLoading(true)
    const formData = new FormData()
    formData.append('audio', audioBlob as Blob)

    const response = await fetch(`/api/conversation/${message.sessionId}/message`, {
      method: 'POST',
      body: formData,
      headers: {
        access_token: data.session?.access_token!,
        refresh_token: data.session?.refresh_token!
      }
    })

    updateLoading(false)
    if (response.status !== 200) {
      console.error('Error sending message:', response.statusText)
      return
    }

    const { messageResponse }: { messageResponse: speakMessageResponse } = await response.json()
    updateMessage(messageResponse)
  }

  const stopRecording = (): void => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  return (
    <>
      <div>
        {!isRecording ? (
          <button
            className={`btn cursor-pointer rounded-full p-4 w-24 h-24 flex justify-center items-center bg-primary text-white hover:border-primary hover:text-primary`}
            onClick={startRecording}
            disabled={loading}
          >
            {loading ? <Loading /> : <LogoIcon />}
          </button>
        ) : (
          <div
            className={`text-primary cursor-pointer rounded-full p-4 w-24 h-24 
          flex justify-center items-center border border-red-500 hover:bg-red-500/10 hover:text-white`}
            onClick={stopRecording}
          >
            <StopIcon />
          </div>
        )}
      </div>
    </>
  )
}
