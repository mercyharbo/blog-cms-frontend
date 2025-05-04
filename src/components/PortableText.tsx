import { PortableText as BasePortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <div className='relative w-full h-96 my-8'>
          <Image
            src={value.asset._ref}
            alt={value.alt || ' '}
            fill
            className='object-cover rounded-lg'
          />
        </div>
      )
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined
      return (
        <Link
          href={value.href}
          rel={rel}
          className='text-primary underline hover:text-primary/80'
        >
          {children}
        </Link>
      )
    },
    strong: ({ children }: any) => (
      <strong className='font-semibold'>{children}</strong>
    ),
    em: ({ children }: any) => <em className='italic'>{children}</em>,
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className='text-4xl font-bold mt-8 mb-4'>{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className='text-3xl font-bold mt-8 mb-4'>{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className='text-2xl font-bold mt-6 mb-3'>{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className='mb-4 leading-relaxed'>{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className='border-l-4 border-primary pl-4 italic my-6'>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className='list-disc pl-6 mb-4'>{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className='list-decimal pl-6 mb-4'>{children}</ol>
    ),
  },
}

export function PortableText({ content }: { content: any }) {
  return (
    <article className='prose prose-lg max-w-none'>
      <BasePortableText value={content} components={components} />
    </article>
  )
}
