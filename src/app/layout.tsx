import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Navbar } from './components/navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'SpeakMentor',
  description: 'SpeakMentor is a platform for language learners to practice speaking with native speakers.'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="w-screen h-screen flex flex-col">
          <Navbar />
          {children}
        </div>
        <Analytics />
        <ToastContainer />
      </body>
    </html>
  )
}
