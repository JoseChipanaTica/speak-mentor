import { AssemblyAI } from 'assemblyai'
import Groq from 'groq-sdk'
import OpenAI from 'openai'

export async function SpeechToText(audio: File | Blob) {
  const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLY_API_KEY!
  })

  const transcript = await client.transcripts.transcribe({ audio: audio, language_detection: true })

  if (transcript.status === 'error') {
    console.error(transcript.error)
    return undefined
  }

  return transcript
}

export async function SpeechToTextOpenAI(audio: Blob) {
  const openai = new OpenAI()

  const file = new File([audio], 'audio.wav', { type: 'audio/wav' })

  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word']
  })

  return transcription
}

export async function SpeechToTextGroq(audio: File) {
  const groq = new Groq()

  const transcript = await groq.audio.transcriptions.create({ file: audio, model: 'whisper-large-v3-turbo' })

  return transcript
}
