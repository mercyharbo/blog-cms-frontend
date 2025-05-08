'use client'

import { UploadCloud, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { Button } from './button'

interface ImageUploadProps {
  value?: { url: string; alt: string } | null
  onChange: (value: { url: string; alt: string } | null) => void
  onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setLoading(true)
        const file = acceptedFiles[0]

        if (file.size > 10 * 1024 * 1024) {
          toast.error('Image size should be less than 10MB')
          return
        }

        const base64String = await convertToBase64(file)
        onChange({ url: base64String, alt: '' })
        toast.success('Image added successfully')
      } catch (err) {
        console.error('Image processing error:', err)
        toast.error(
          err instanceof Error ? err.message : 'Failed to process image'
        )
      } finally {
        setLoading(false)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <div>
      {value?.url ? (
        <div className='relative rounded-lg overflow-hidden border border-border'>
          <div className='aspect-video relative'>
            <Image
              src={value.url}
              alt={value.alt || ''}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
          <div className='absolute top-2 right-2 flex gap-2'>
            <Button
              type='button'
              variant='destructive'
              size='icon'
              onClick={onRemove}
              className='h-8 w-8 rounded-full'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 
            hover:bg-muted/50 transition cursor-pointer
            ${isDragActive ? 'border-primary' : 'border-muted-foreground/25'}
            ${loading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center justify-center gap-2'>
            <UploadCloud
              className={`h-10 w-10 ${loading ? 'animate-bounce' : ''}`}
            />
            <div className='text-center'>
              {loading ? (
                <p className='text-sm text-muted-foreground'>Processing...</p>
              ) : (
                <>
                  <p className='text-sm font-medium'>
                    Drag & drop an image here, or click to select
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Max file size: 10MB. Supported formats: PNG, JPG, GIF, WEBP
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
