import { ElevenLabsClient } from 'elevenlabs'

export async function TextToSpeech(text: string) {
  const elevenClient = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY!
  })

  const tts = await elevenClient.textToSpeech.convert('9BWtsMINqrJLrRacOk9x', {
    model_id: 'eleven_turbo_v2_5',
    text
  })

  const chunks: Uint8Array[] = []
  for await (const chunk of tts) {
    chunks.push(chunk)
  }

  const totalLenght = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  const audioArray = new Uint8Array(totalLenght)
  let offset = 0

  for (const chunk of chunks) {
    audioArray.set(chunk, offset)
    offset += chunk.length
  }

  const podcastAudio = new Blob([audioArray], { type: 'audio/mp3' })

  return podcastAudio
}
