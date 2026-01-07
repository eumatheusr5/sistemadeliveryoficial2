import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => onOpenChange(false)
    dialog.addEventListener('close', handleClose)

    return () => dialog.removeEventListener('close', handleClose)
  }, [onOpenChange])

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-transparent p-0 m-0 max-w-none max-h-none w-full h-full"
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onOpenChange(false)
        }
      }}
    >
      {children}
    </dialog>
  )
}

interface DialogContentProps {
  children: ReactNode
  className?: string
  onClose?: () => void
}

function DialogContent({ children, className, onClose }: DialogContentProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div
        className={cn(
          'relative bg-background rounded-xl shadow-lg border border-border w-full max-w-lg max-h-[85vh] overflow-y-auto',
          className
        )}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    </div>
  )
}

interface DialogHeaderProps {
  children: ReactNode
  className?: string
}

function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)}>
      {children}
    </div>
  )
}

interface DialogTitleProps {
  children: ReactNode
  className?: string
}

function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
      {children}
    </h2>
  )
}

interface DialogDescriptionProps {
  children: ReactNode
  className?: string
}

function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  )
}

interface DialogFooterProps {
  children: ReactNode
  className?: string
}

function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cn('flex justify-end space-x-2 p-6 pt-4', className)}>
      {children}
    </div>
  )
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
