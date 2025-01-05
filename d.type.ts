/* eslint-disable @typescript-eslint/no-unused-vars */

type speakMessageResponse = {
  transcript: string
  audioUrl: string
  response: string
  response_translated: string
  pronunciationScore: number
  grammarScore: number
  feedback: string
  alternatives: { alternative: string; translation: string; audioUrl: string | null }[]
  sessionId: string
}

type conversationResponse = {
  created_at: string
  firstlanguage: string
  id: string
  targetlanguage: string
  topic: string
  updated_at: string
  user_id: string
}
