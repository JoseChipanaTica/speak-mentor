'use client'

import { ConversationResponse } from '@/app/components/main/conversation-response'
import { useMessageHook } from '@/hooks/message.hook'
import { TrashIcon } from 'lucide-react'
import { LogoIcon } from '../components/icons'
import { ConversationConfig } from '../components/main/conversation-config'
import { ConversationFeedback } from '../components/main/conversation-feedback'

export default function Home() {
  const { message, updateMessage } = useMessageHook()
  return (
    <>
      <div className="h-full w-full p-10">
        <div className="h-full w-full flex flex-col md:flex-row border border-gray-600/50 rounded-lg">
          {message ? (
            <div className="indicator w-full">
              <span className="indicator-item cursor-pointer bg-red-600 p-2 rounded-lg">
                <TrashIcon
                  onClick={() => {
                    updateMessage(undefined)
                  }}
                />
              </span>
              <ConversationResponse />
              <ConversationFeedback />
            </div>
          ) : (
            <>
              <div className="flex justify-center items-center w-full h-full space-x-4">
                <LogoIcon />
                <span className="self-center text-xl font-semibold whitespace-nowrap text-white">SpeakMentor</span>
              </div>
              <ConversationConfig />
            </>
          )}
        </div>
      </div>
    </>
  )
}
