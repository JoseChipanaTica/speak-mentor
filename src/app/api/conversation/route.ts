import { SpeakMessage } from '@/managers/speak-response'
import { TextToSpeech } from '@/managers/text-to-speech'
import { DBClient } from '@/providers/supabase/server'
import { uploadFile } from '@/providers/supabase/storage'

export async function POST(request: Request) {
  try {
    const { firstLanguage, targetLanguage, topic } = await request.json()
    if (!firstLanguage || !targetLanguage || !topic) {
      return new Response('Missing required fields', { status: 400 })
    }

    const access_token = request.headers.get('access_token')
    const refresh_token = request.headers.get('refresh_token')

    if (!access_token || !refresh_token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const db = new DBClient()
    await db.setSession(access_token, refresh_token)
    const user = await db.getUser()

    if (!user) {
      console.error('User not found')
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    const { data, error } = await db.client
      .from('conversations')
      .insert({
        topic,
        firstlanguage: firstLanguage,
        targetlanguage: targetLanguage,
        user_id: user.id
      })
      .select('id')
      .single()

    const speakResponse = new SpeakMessage([], firstLanguage, targetLanguage)
    const response = await speakResponse.run(topic)

    if (error) {
      console.error('Error inserting conversation:', error)
      return new Response('Conversation error', { status: 500 })
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
      transcript: topic,
      audioUrl: audioUrl,
      response: response.response,
      response_translated: response.responseTranslation,
      pronunciationScore: response.pronunciationScore,
      grammarScore: response.grammarScore,
      feedback: response.feedback,
      alternatives: alternatives,
      sessionId: data.id
    }

    const { data: insertedMessage, error: insertedMessageError } = await db.client
      .from('messages')
      .insert([
        {
          conversation_id: data.id,
          user_id: user.id,
          content: topic,
          content_translation: '',
          feedback: '',
          alternatives: [],
          role: 'Human'
        },
        {
          conversation_id: data.id,
          user_id: user.id,
          content: response.response,
          content_translation: response.responseTranslation,
          feedback: response.feedback,
          alternatives: response.alternatives,
          role: 'AI'
        }
      ])
      .select('*')

    if (insertedMessageError || !insertedMessage) {
      console.error('Error inserting message:', insertedMessageError)
      return new Response('Conversation error', { status: 500 })
    }

    return new Response(JSON.stringify({ messageResponse }), { status: 200 })
  } catch (error) {
    console.error('Error accessing microphone:', error)
    return new Response('Conversation error', { status: 500 })
  }
}
