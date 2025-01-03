import { useMessageHook } from '@/hooks/message.hook'
import { PlayCircleIcon } from 'lucide-react'

export function ConversationFeedback() {
  const { message } = useMessageHook()

  if (!message) {
    return null
  }

  return (
    <div className="h-full w-full basis-1/4 px-4 py-6 bg-gray-800/20">
      <div className="w-full h-full flex flex-col space-y-4">
        <div className="flex space-x-4 overflow-auto">
          <div className="stat">
            <div className={`stat-figure ${message.pronunciationScore > 70 ? 'text-primary' : 'text-error'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <div className={`stat-value ${message.pronunciationScore > 70 ? 'text-primary' : 'text-error'}`}>
              {message.pronunciationScore}%
            </div>
            <div className="stat-desc">Pronunciation</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div className="stat-value text-secondary">{message.grammarScore}%</div>
            <div className="stat-desc">Precision</div>
          </div>
        </div>

        <div>
          <p className="text-base text-white text-justify p-4 border border-gray-600/50 rounded-lg">
            {message.feedback}
          </p>
        </div>

        <div className="divider text-sm text-white">Alternatives</div>

        <div className="flex flex-col space-y-4">
          {message.alternatives.map((item, index) => (
            <div
              key={index}
              className="border border-gray-600/50 p-4 rounded-lg cursor-pointer hover:border-secondary hover:text-secondary tooltip tooltip-secondary flex flex-col text-justify"
              data-tip={item.translation}
              onClick={() => {
                console.log('Play audio:', item.audioUrl)
                if (!item.audioUrl) {
                  return
                }
                const audio = new Audio(item.audioUrl)
                audio.play()
              }}
            >
              <p>{item.alternative}</p>
              <div className="flex justify-end">
                <PlayCircleIcon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
