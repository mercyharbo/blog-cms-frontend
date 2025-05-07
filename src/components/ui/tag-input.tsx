'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './button'
import { Input } from './input'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [input, setInput] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (input.trim() && !value.includes(input.trim())) {
        onChange([...value, input.trim()])
        setInput('')
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className='border rounded-md p-2'>
      <div className='flex flex-wrap gap-2 mb-2'>
        {value.map((tag) => (
          <span
            key={tag}
            className='bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1'
          >
            {tag}
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-auto p-0 hover:bg-transparent'
              onClick={() => removeTag(tag)}
            >
              <X className='h-4 w-4' />
            </Button>
          </span>
        ))}
      </div>
      <Input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className='border-0 py-0 px-2 shadow-none focus-visible:ring-0'
      />
    </div>
  )
}
