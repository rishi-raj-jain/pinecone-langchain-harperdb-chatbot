export const runtime = 'edge'

export const dynamic = 'force-dynamic'

import train from '@/lib/train'
import { deleteRecords, searchByValue } from '@/lib/harper'

export async function POST(req) {
  // If `urls` is not in body, return with `Bad Request`
  const { urls } = await req.json()
  if (!urls) return new Response('Bad Request.', { status: 400 })
  // Train on the particular URLs
  await train(urls)
  // Get all the cached responses ID
  const t = await searchByValue(true, 'isChat', ['hash'])
  // Once trained, delete all the cached responses
  await deleteRecords(t.map((i) => i.hash))
  return new Response(null, { status: 200 })
}
