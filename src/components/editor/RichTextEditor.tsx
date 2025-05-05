import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import type { EditorView } from '@tiptap/pm/view'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
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
  const convertToMarkdown = (editor: Editor): string => {
    const json = editor.getJSON()
    let markdown = ''

    json.content?.forEach((node) => {
      if (node.type === 'paragraph') {
        // Handle regular text
        const text = node.content
          ?.map((item) => {
            if (item.type === 'text') return item.text
            if (item.type === 'hardBreak') return '\n'
            return ''
          })
          .join('')
        markdown += text + '\n\n'
      } else if (node.type === 'image') {
        // For base64 images, we need to preserve the full data URL
        const imageUrl = node.attrs?.src || ''
        markdown += `![image](${imageUrl})\n\n`
      } else if (node.type === 'heading') {
        // Handle headings
        const level = '#'.repeat(node.attrs?.level || 1)
        const text = node.content?.map((item) => item.text || '').join('')
        markdown += `${level} ${text}\n\n`
      }
    })

    return markdown.trim()
  }

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
    // Fix: Don't parse content if it's a string
    content: content || '',
    onUpdate: ({ editor }) => {
      const markdown = convertToMarkdown(editor)
      console.log('Content with images:', markdown) // Check this output
      onChange(markdown)
    },
    editorProps: {
      handlePaste: (view: EditorView, event: ClipboardEvent) => {
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
      handleDrop: (view: EditorView, event: DragEvent) => {
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
  const handleImageFile = async (file: File, view: EditorView) => {
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

interface EditorProps {
  children: React.ReactNode
  className?: string
}

// Replace any with proper type
export const EditorComponent = ({ children, className }: EditorProps) => {
  return <div className={className}>{children}</div>
}
