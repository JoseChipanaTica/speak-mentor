/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useMessageHook } from '@/hooks/message.hook'
import { PlayCircleIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { AudioRecording } from './audio-recording'

export function ConversationResponse() {
  const { message } = useMessageHook()

  if (!message) {
    return null
  }

  const playAudio = () => {
    const audio = new Audio(message.audioUrl)
    audio.play()
  }

  useEffect(() => {
    playAudio()
  }, [message.audioUrl])

  return (
    <div className="h-full w-full basis-3/4 overflow-auto">
      <div className="w-full h-full flex flex-col overflow-auto">
        <div className="w-full h-full flex flex-col justify-center content-center items-center space-y-8">
          <div className="indicator">
            <span className="indicator-item">
              <PlayCircleIcon
                className="w-8 h-8 cursor-pointer text-primary hover:text-blue-600/50"
                onClick={() => {
                  playAudio()
                }}
              />
            </span>
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                <Image src="/avatar.jpg" width={80} height={80} alt="Avatar" />
              </div>
            </div>
          </div>

          <div className="lg:px-48 text-center">
            <span
              className="text-2xl lg:text-3xl font-bold text-white cursor-pointer tooltip tooltip-secondary hover:text-secondary"
              data-tip={message.response_translated}
            >
              {message.response}
            </span>
          </div>

          <div className="divider">
            <span className="font-bold text-base">Your turn</span>
          </div>

          <AudioRecording />
        </div>
      </div>
    </div>
  )
}
