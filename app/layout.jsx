import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'A Real-Time AI Chatbot serving cached responses and rate limiting users with HarperDB for speed and reliability!',
  description: 'A demo of custom content chatbot trained with Pinecone and cached on HarperDB using Next.js App and Pages Router, LangChain and Streaming',
  openGraph: {
    url: 'https://pinecone-langchain-harperdb-chatbot.vercel.app',
    title: 'A Real-Time AI Chatbot serving cached responses and rate limiting users with HarperDB for speed and reliability!',
    siteName: 'A Real-Time AI Chatbot serving cached responses and rate limiting users with HarperDB for speed and reliability!',
    description: 'A demo of custom content chatbot trained with Pinecone and cached on HarperDB using Next.js App and Pages Router, LangChain and Streaming',
  },
  twitter: {
    site: '@rishi_raj_jain_',
    creator: '@rishi_raj_jain_',
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
