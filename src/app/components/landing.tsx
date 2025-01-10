/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import TypingAnimation from '@/components/ui/typing-animation'
import { useUserHook } from '@/hooks/user.hook'
import { ChevronRightIcon, VideoIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { login } from './auth'

import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { BellIcon, CalendarIcon, FileTextIcon, GlobeIcon, InputIcon } from '@radix-ui/react-icons'

function HeroPage() {
  const { user } = useUserHook()

  return (
    <section className="text-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 space-y-10">
        <Link
          href="https://github.com/JoseChipanaTica/speak-mentor"
          target="_blank"
          className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-white bg-gray-800 rounded-full hover:bg-gray-800/50"
          role="alert"
        >
          <span className="text-xs bg-primary rounded-full text-white px-4 py-1.5 mr-3">New</span>{' '}
          <span className="text-sm font-medium">{`SpeakMentor is out! See what's new`}</span>
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
        <TypingAnimation>The best way to practice your speaking</TypingAnimation>
        <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 xl:px-48 text-gray-400">
          SpeakMentorAI is an open-source project that helps you practice your speaking skills. It uses AI to analyze
          your pronunciation and grammar, and provides feedback to help you improve.
        </p>
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          {user ? (
            <Link
              href="/app"
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg  bg-primary  hover:bg-gray-600/50 focus:ring-4 focus:ring-gray-100 text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Go to App
            </Link>
          ) : (
            <button
              onClick={login}
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg  bg-primary hover:bg-gray-600/50 focus:ring-4 focus:ring-gray-100 text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Get started
            </button>
          )}
          <Link
            href="#"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg border border-gray-600/50 hover:bg-gray-600/50 focus:ring-4 focus:ring-gray-100 text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            <VideoIcon className="w-6 h-6 mr-2" /> Watch video
          </Link>
        </div>
      </div>
    </section>
  )
}

function ContentPage() {
  return (
    <section className="">
      <div className="flex flex-col text-center items-center py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="font-light text-gray-200 sm:text-lg">
          <h2 className="mb-4 text-2xl tracking-tight font-extrabold text-white">
            Speak & Practice your speaking skills
          </h2>
          <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 xl:px-48 text-gray-400">
            SpeakMentor helps you practice your speaking skills by providing feedback on your pronunciation and grammar.
          </p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <Image
            className="w-full rounded-lg shadow-lg shadow-primary"
            src="/feature.png"
            alt="office content 1"
            width={800}
            height={600}
          />
        </div>
      </div>
    </section>
  )
}

function FeaturePage() {
  const features = [
    {
      Icon: FileTextIcon,
      name: 'Save your files',
      description: 'We automatically save your files as you type.',
      href: '/',
      cta: 'Learn more',
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: 'lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3'
    },
    {
      Icon: InputIcon,
      name: 'Full text search',
      description: 'Search through all your files in one place.',
      href: '/',
      cta: 'Learn more',
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3'
    },
    {
      Icon: GlobeIcon,
      name: 'Multilingual',
      description: 'Supports 100+ languages and counting.',
      href: '/',
      cta: 'Learn more',
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4'
    },
    {
      Icon: CalendarIcon,
      name: 'Calendar',
      description: 'Use the calendar to filter your files by date.',
      href: '/',
      cta: 'Learn more',
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: 'lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2'
    },
    {
      Icon: BellIcon,
      name: 'Notifications',
      description: 'Get notified when someone shares a file or mentions you in a comment.',
      href: '/',
      cta: 'Learn more',
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: 'lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4'
    }
  ]
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <BentoGrid className="lg:grid-rows-3">
        {features.map(feature => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </div>
  )
}

function CTAPage() {
  const { user } = useUserHook()

  return (
    <section className="">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-white">Get started today</h2>
          <p className="mb-6 font-light text-gray-500 md:text-lg">
            Sign up for SpeakMentor today and start practicing your speaking skills
          </p>
          {user ? (
            <Link
              href="/app"
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg  bg-primary hover:bg-gray-600/50 focus:ring-4 focus:ring-gray-100 text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Go to App
            </Link>
          ) : (
            <button
              onClick={login}
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg bg-primary  hover:bg-gray-600/50 focus:ring-4 focus:ring-gray-100 text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Get started
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function FooterPage() {
  return (
    <footer className="py-4 border-t border-gray-600/20">
      <div className="mx-auto max-w-screen-xl text-center flex justify-between">
        <a href="#" className="flex justify-center items-center text-2xl font-semibold text-white">
          SpeakMentor
        </a>

        <div className="flex justify-center items-center content-center text-white">
          <div>
            <Link
              href="https://github.com/JoseChipanaTica/speak-mentor"
              target="_blank"
              className="mr-4 hover:underline md:mr-6 "
            >
              Github
            </Link>
          </div>
          <div>
            <Link href="https://x.com/josepaulct" target="_blank" className="mr-4 hover:underline md:mr-6">
              X
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <div className="p-10 md:p-0">
      <HeroPage />
      <ContentPage />
      <CTAPage />
      <FooterPage />
    </div>
  )
}
