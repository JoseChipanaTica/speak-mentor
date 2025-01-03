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
        {message ? (
          <div className="md:w-full md:h-full flex flex-col md:flex-row border border-gray-800/50 rounded-lg">
            <div className="indicator w-full">
              <span className="indicator-item cursor-pointer bg-red-600 p-2 rounded-lg text-white">
                <TrashIcon
                  onClick={() => {
                    updateMessage(undefined)
                  }}
                />
              </span>
              <div className="flex flex-col md:flex-row w-full h-full overflow-auto">
                <ConversationResponse />
                <ConversationFeedback />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col md:flex-row border border-gray-800/50 rounded-lg">
            <div className="flex justify-center items-center w-full h-full md:space-x-4 basis-1/2 bg-gray-800/50">
              <LogoIcon />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-white">SpeakMentor</span>
            </div>
            <ConversationConfig />
          </div>
        )}
      </div>
    </>
  )
}
