/* eslint-disable @typescript-eslint/no-explicit-any */
import { SpeakMessage } from '@/managers/speak-response'
import { SpeechToTextOpenAI } from '@/managers/speech-to-text'
import { TextToSpeech } from '@/managers/text-to-speech'
import { DBClient } from '@/providers/supabase/server'
import { uploadFile } from '@/providers/supabase/storage'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const access_token = request.headers.get('access_token')
    const refresh_token = request.headers.get('refresh_token')

    if (!access_token || !refresh_token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const formddata = await request.formData()
    const audio = formddata.get('audio') as Blob

    const db = new DBClient()
    await db.setSession(access_token, refresh_token)
    const user = await db.getUser()

    if (!user) {
      console.error('User not found')
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    const { data: conversation, error }: { data: conversationResponse | null; error: any } = await db.client
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single()
    const { data: messages } = await db.client.from('messages').select('*').eq('conversation_id', id)

    if (!conversation || error) {
      return new Response('Conversation not found', { status: 404 })
    }

    const history = messages ? messages.map(message => ({ content: message.content, role: message.role })) : []

    const transcript = await SpeechToTextOpenAI(audio)

    if (!transcript) {
      return new Response('Transcript error', { status: 500 })
    }

    if (!transcript.text) {
      return new Response('No transcript', { status: 400 })
    }

    const speakResponse = new SpeakMessage(history, conversation.firstlanguage, conversation.targetlanguage)
    const response = await speakResponse.run(transcript.text)

    if (!response) {
      return new Response('Speak error', { status: 500 })
    }

    const audioBlob = await TextToSpeech(response.response)
    const audioUrl = await uploadFile(audioBlob, 'mp3')

    if (!audioUrl) {
      return new Response('Audio error', { status: 500 })
    }

    const alternatives = await Promise.all(
      response.alternatives.map(async alternative => {
        const audioBlob = await TextToSpeech(alternative.alternative)
        const audioUrl = await uploadFile(audioBlob, 'mp3')
        return { ...alternative, audioUrl }
      })
    )

    const messageResponse: speakMessageResponse = {
      audioUrl: audioUrl,
      response: response.response,
      response_translated: response.responseTranslation,
      pronunciationScore: response.pronunciationScore,
      grammarScore: response.grammarScore,
      feedback: response.feedback,
      alternatives: alternatives,
      sessionId: conversation.id
    }

    await db.client.from('messages').insert([
      {
        conversation_id: conversation.id,
        user_id: user.id,
        content: transcript.text,
        content_translation: '',
        feedback: '',
        alternatives: [],
        role: 'Human'
      },
      {
        conversation_id: conversation.id,
        user_id: user.id,
        content: response.response,
        content_translation: response.responseTranslation,
        feedback: response.feedback,
        alternatives: response.alternatives,
        role: 'AI'
      }
    ])

    return new Response(JSON.stringify({ messageResponse }), { status: 200 })
  } catch (error) {
    console.error('Error', error)
    return new Response('Conversation error', { status: 500 })
  }
}
