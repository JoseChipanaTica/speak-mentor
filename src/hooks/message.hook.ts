import { create } from 'zustand'

type messageHook = {
  message: speakMessageResponse | undefined
  updateMessage: (message: speakMessageResponse | undefined) => void
}

export const useMessageHook = create<messageHook>(set => ({
  message: undefined,
  updateMessage: message => set({ message })
}))

/* {
  response: 'That sounds like a lot of fun! How often do you play padel with your friends?',
  feedback:
    'Great job mentioning your activity! You could add more details about your experiences or how you feel about playing padel.',
  pronunciationScore: 60,
  grammarScore: 90,
  audioUrl: '',
  alternatives: [
    {
      alternative: 'I like to play tennis every weekend',
      translation: 'Me gusta jugar al tenis todos los fines de semana'
    },
    {
      alternative: 'I like to play tennis every weekend',
      translation: 'Me gusta jugar al tenis todos los fines de semana'
    },
    {
      alternative: 'I like to play tennis every weekend',
      translation: 'Me gusta jugar al tenis todos los fines de semana'
    },
    {
      alternative: 'I like to play tennis every weekend',
      translation: 'Me gusta jugar al tenis todos los fines de semana'
    }
  ],
  sessionId: '123'
} */
