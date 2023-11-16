'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EmptyScreen } from './components/empty-screen'
import MemoizedMD from './components/memoized-react-markdown'

export default function InputWithButton() {
  const [response, setResponse] = useState()
  const [messages, setMessages] = useState([])
  const [processing, setProcessing] = useState(false)
  const handleFormSubmission = async () => {
    setResponse()
    const mes = document.getElementById('message').value
    if (mes) {
      try {
        setMessages((messages) => [...messages, { type: 'user', message: mes }])
        setProcessing(true)
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input: mes }),
        })
        if (!response.ok) {
          const message = await response.text()
          setMessages((messages) => [...messages, { type: 'ai', message }])
          throw new Error('Error fetching data')
        }
        let chunks = ''
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          setResponse((prevChunk) => {
            if (prevChunk) return prevChunk + decoder.decode(value)
            return decoder.decode(value)
          })
          chunks += decoder.decode(value)
        }
        setResponse()
        setMessages((messages) => [...messages, { type: 'ai', message: chunks }])
        document.getElementById('message').value = ''
      } catch (e) {
        console.log(e)
      } finally {
        setProcessing(false)
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex flex-col items-start w-full max-w-lg px-5 overflow-hidden">
        {(!messages || messages.length < 1) && <EmptyScreen handleFormSubmission={handleFormSubmission} />}
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            await handleFormSubmission()
          }}
          className="flex flex-row w-[300px] sm:min-w-[500px] items-center space-x-2 fixed bottom-4"
        >
          <Input className="border-black shadow" id="message" type="message" placeholder="What's your next question?" />
          <Button disabled={processing} type="submit">
            Submit
          </Button>
        </form>
        <div className="w-full flex flex-col max-h-[90vh] overflow-y-scroll">
          {messages && messages.map((i, _) => <MemoizedMD key={_} index={_} {...i} />)}
          {response && <MemoizedMD message={response} />}
          {processing && !response && (
            <div className="flex flex-row items-center border-t mt-4 pt-4 gap-x-3">
              <div className="ml-4 h-[10px] w-[10px] rounded-full bg-gray-400 animate-ping"></div>
              <span className="text-gray-400">Loading</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
