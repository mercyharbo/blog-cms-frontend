import { Editor } from '@tiptap/react'
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react'
import { useRef } from 'react'
import { Button } from '../ui/button'

interface EditorToolbarProps {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) {
    return null
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          editor.chain().focus().setImage({ src: e.target.result }).run()
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const addImage = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='border-b p-2 flex flex-wrap gap-2'>
      <Button
        type='button'
        size='sm'
        variant={
          editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={
          editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={
          editor.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className='h-4 w-4' />
      </Button>
      <div className='w-px h-6 bg-border mx-2' />
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className='h-4 w-4' />
      </Button>
      <div className='w-px h-6 bg-border mx-2' />
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className='h-4 w-4' />
      </Button>
      <Button type='button' size='sm' variant='ghost' onClick={addImage}>
        <ImageIcon className='h-4 w-4' />
      </Button>

      <input
        type='file'
        ref={fileInputRef}
        className='hidden'
        accept='image/*'
        onChange={handleImageUpload}
      />
    </div>
  )
}
