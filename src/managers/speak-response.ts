import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatOpenAI } from '@langchain/openai'

import { z } from 'zod'

export class SpeakMessage {
  history: { content: string; role: string }[] = []
  firstLanguage: string
  targetLanguage: string

  model: ChatOpenAI

  constructor(history: { content: string; role: string }[], firstLanguage: string, targetLanguage: string) {
    this.history = history

    this.firstLanguage = firstLanguage
    this.targetLanguage = targetLanguage

    this.model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0.5
    })
  }

  systemPrompt() {
    return `
      You are an AI assistant that helps people learn new languages.
      Keep the conversation flowing and provide a response that is helpful and engaging.
      Keep the conversation as natural as possible like you are talking to a friend.
      Sometimes you may need to ask questions to keep the conversation going or you can provide a statement or suggestion. 
      The response should be in the target language: ${this.targetLanguage}

      Keep the conversation flowing and provide a response that is helpful and engaging.

      Response:
      - response: the response to the input. This could be a question, a statement, or a suggestion. A sentence to continue the conversation. It should be in the target language: ${this.targetLanguage}
      - feedback: User's input feedback. This could be a suggestion for improvement, rephrase, a comment on the quality of the user input. It should be in the first language: ${this.firstLanguage}
      - alternatives: alternative responses that users could reply to the generated response
          - alternative: alternative response to the input.
          - translation: translation of the alternative response in the first language. ${this.firstLanguage}
          
      `
  }

  humanPrompt(input: string) {
    return `
      Reply to the following message in the target language: ${this.targetLanguage}
      ---------------------
      Message: ${input}
    `
  }

  createSchema() {
    return z.object({
      response: z.string().describe('the response to the input'),
      responseTranslation: z.string().describe('translation of the response in the first language'),
      feedback: z
        .string()
        .describe(
          'feedback about the user input like a suggestion for improvement or a comment on the quality of the input or rephrase'
        ),
      alternatives: z
        .array(
          z.object({
            alternative: z.string().describe('alternative response to the input'),
            translation: z.string().describe('translation of the alternative response in the first language')
          })
        )
        .max(2),
      pronunciationScore: z.number().describe('the pronunciation score of the response from 0 to 100'),
      grammarScore: z.number().describe('the grammar score of the response from 0 to 100')
    })
  }

  async run(input: string) {
    const schema = this.createSchema()
    const structuredLlm = this.model.withStructuredOutput(schema)

    const response = await structuredLlm.invoke([
      new SystemMessage(this.systemPrompt()),
      ...this.history.map(message => {
        if (message.role === 'AI') {
          return new AIMessage(message.content)
        } else {
          return new HumanMessage(message.content)
        }
      }),
      new HumanMessage(this.humanPrompt(input))
    ])

    return response
  }
}
