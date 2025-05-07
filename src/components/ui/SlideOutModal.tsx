import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from './button'

interface SlideOutModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function SlideOutModal({
  isOpen,
  onClose,
  children,
  title,
}: SlideOutModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-all duration-100',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full overflow-x-hidden bg-background w-full md:w-2/3 lg:w-1/2 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className='h-full flex flex-col'>
          {/* Header */}
          <div className='flex items-center justify-between p-4 border-b'>
            <h2 className='text-lg font-semibold'>{title || 'Edit Post'}</h2>
            <Button variant='ghost' size='icon' onClick={onClose}>
              <X className='h-4 w-4' />
            </Button>
          </div>

          {/* Content */}
          <div className='flex-1 overflow-y-auto overflow-x-hidden p-4'>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
