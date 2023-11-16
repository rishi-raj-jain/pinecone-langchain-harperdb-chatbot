export const runtime = 'edge'

export const dynamic = 'force-dynamic'

import { z } from 'zod'
import { PromptTemplate } from 'langchain/prompts'
import { RetrievalQAChain } from 'langchain/chains'
import { loadVectorStore } from '@/lib/vectorStore'
import { insert, searchByValue } from '@/lib/harper'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OutputFixingParser, StructuredOutputParser } from 'langchain/output_parsers'

export async function POST(req) {
  // If `input` is not in body, return with `Bad Request`
  const { input } = await req.json()
  if (!input) return new Response('Bad Request.', { status: 400 })
  // Load the trained model
  const vectorStore = await loadVectorStore()
  // Create a prompt specifying for Open AI what to write
  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      answer: z.string().describe('answer to question in HTML friendly format, use all of the tags wherever possible and including reference links'),
    }),
  )
  // LookUp for response in HarperDB
  const cachedResponse = await searchByValue(input, 'id', ['answer'])
  // If cached response found, return as is
  if (cachedResponse[0] && cachedResponse[0]['answer']) return new Response(cachedResponse[0]['answer'])
  const encoder = new TextEncoder()
  const customReadable = new ReadableStream({
    start(controller) {
      const model = new ChatOpenAI({
        streaming: true,
        callbacks: [
          {
            handleLLMNewToken(token) {
              controller.enqueue(encoder.encode(token))
            },
            async handleLLMEnd(output) {
              // Once the response is sent, cache it in HarperDB
              await insert([{ id: input, answer: output.generations[0][0].text, isChat: true }])
              controller.close()
            },
          },
        ],
      })
      const outputFixingParser = OutputFixingParser.fromLLM(model, outputParser)
      // Create a prompt specifying for Open AI how to process on the input
      const prompt = new PromptTemplate({
        template: `Answer the user's question as best and be as detailed as possible:\n{format_instructions}\n{query}`,
        inputVariables: ['query'],
        partialVariables: {
          format_instructions: outputFixingParser.getFormatInstructions(),
        },
      })
      const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), prompt)
      chain.call({ query: input })
    },
  })
  return new Response(customReadable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
