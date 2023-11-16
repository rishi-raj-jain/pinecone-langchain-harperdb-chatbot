import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'

export async function loadVectorStore() {
  const pinecone = new Pinecone()
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX)
  return await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), { pineconeIndex })
}
