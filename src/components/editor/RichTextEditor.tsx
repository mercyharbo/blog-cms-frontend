import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../ui/button'

// Add helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
    ],
    content: typeof content === 'string' ? JSON.parse(content) : content,
    onUpdate: ({ editor }) => {
      // Convert editor content to Portable Text blocks
      const portableTextBlocks = editor.getJSON()
      onChange(JSON.stringify(portableTextBlocks))
    },
    editorProps: {
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || [])
        const imageItem = items.find((item) => item.type.startsWith('image/'))

        if (imageItem) {
          event.preventDefault()
          const file = imageItem.getAsFile()
          if (file) handleImageFile(file, view)
          return true
        }
        return false
      },
      handleDrop: (view, event) => {
        const hasFiles = event.dataTransfer?.files.length
        if (!hasFiles) return false

        const file = event.dataTransfer.files[0]
        if (!file.type.startsWith('image/')) return false

        event.preventDefault()
        handleImageFile(file, view)
        return true
      },
    },
  })

  // Add helper function to handle image files
  const handleImageFile = async (file: File, view: any) => {
    try {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        toast.error('Unsupported image format')
        return
      }

      const base64String = await fileToBase64(file)
      const { schema } = view.state
      const node = schema.nodes.image.create({ src: base64String })
      const transaction = view.state.tr.replaceSelectionWith(node)
      view.dispatch(transaction)
    } catch (error) {
      console.error('Error processing image:', error)
      toast.error('Failed to process image')
    }
  }

  const handleImageUpload = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault() // Prevent form submission

      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'

      input.onchange = async () => {
        if (!input.files?.length) return

        const file = input.files[0]
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB')
          return
        }

        try {
          const base64String = await fileToBase64(file)
          editor?.chain().focus().setImage({ src: base64String }).run()
        } catch (error) {
          console.error('Error processing image:', error)
          toast.error('Failed to process image')
        }
      }

      input.click()
    },
    [editor]
  )

  if (!editor) return null

  return (
    <div className='border rounded-lg'>
      {/* Toolbar */}
      <div className='border-b p-2 flex flex-wrap gap-2 bg-card'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className='h-4 w-4' />
        </Button>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className='h-4 w-4' />
        </Button>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className='h-4 w-4' />
        </Button>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className='h-4 w-4' />
        </Button>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-muted' : ''}
        >
          <Quote className='h-4 w-4' />
        </Button>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => {
            const url = window.prompt('Enter the URL')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={editor.isActive('link') ? 'bg-muted' : ''}
        >
          <LinkIcon className='h-4 w-4' />
        </Button>

        {/* Replace the image button with new upload handler */}
        <Button
          type='button' // Add this to prevent form submission
          variant='ghost'
          size='sm'
          onClick={handleImageUpload}
          title='Upload image'
        >
          <ImageIcon className='h-4 w-4' />
        </Button>

        <div className='ml-auto flex gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className='prose prose-sm max-w-none p-4'>
        <EditorContent editor={editor} />
      </div>

      {/* Add styles for images */}
      <style jsx global>{`
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  )
}
