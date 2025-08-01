import Image from '@tiptap/extension-image'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef } from 'react'
import { EditorToolbar } from './EditorToolbar'

interface RichTextEditorProps {
  content: string
  onChange: (value: string) => void
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const initialContentSet = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bold: {},
        italic: {},
        blockquote: {},
        bulletList: {},
        orderedList: {},
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-6',
        },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Process and set initial content only once when editor is ready
  useEffect(() => {
    if (editor && content && !initialContentSet.current) {
      const processContent = (markdown: string) => {
        // First clean up standalone hashes and multiple line breaks
        const cleanContent = markdown
          // Remove lines that are just hashes with optional whitespace
          .replace(/^[\s#]*#[\s#]*$/gm, '')
          // Replace multiple newlines with double newlines
          .replace(/\n{3,}/g, '\n\n')
          // Remove trailing hashes
          .replace(/\s*#+\s*$/gm, '')
          // Clean up any remaining standalone hashes
          .replace(/^#+\s*$/gm, '')

        // Split into sections while preserving valid headers
        const sections = cleanContent.split(/(?=^#+\s+[^#\n]+$)/m)

        return sections
          .map((section) => {
            return (
              section
                .trim()
                // Process headings (only when they start a line and have text)
                .replace(/^###\s+([^#\n]+)$/m, '<h3>$1</h3>')
                .replace(/^##\s+([^#\n]+)$/m, '<h2>$1</h2>')
                .replace(/^#\s+([^#\n]+)$/m, '<h1>$1</h1>')
                // Process formatting
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                // Process lists
                .replace(/^\s*[-*+]\s+(.*)$/gm, '<ul><li>$1</li></ul>')
                .replace(/^\s*\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>')
                // Process blockquotes
                .replace(/^>\s(.+)$/gm, '<blockquote><p>$1</p></blockquote>')
                // Process images
                .replace(
                  /!\[.*?\]\((data:image\/[^;]+;base64,[^)]+)\)/g,
                  '<img src="$1" />'
                )
            )
          })
          .filter(Boolean)
          .join('\n\n')
          .split(/\n\n+/)
          .map((para) => {
            const trimmed = para.trim()
            if (!trimmed) return ''
            if (trimmed.startsWith('<')) return trimmed
            return `<p>${trimmed}</p>`
          })
          .filter(Boolean)
          .join('\n\n')
      }

      const processedContent = processContent(content)
      editor.commands.setContent(processedContent)
      initialContentSet.current = true
    }
  }, [editor, content])

  return (
    <div className='h-[300px] border dark:border-gray-700 rounded-lg overflow-hidden flex flex-col'>
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className='prose prose-slate dark:prose-invert max-w-none p-4 flex-1'
      />
    </div>
  )
}
