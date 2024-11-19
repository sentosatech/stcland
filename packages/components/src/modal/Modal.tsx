import * as React from 'react'
import { createPortal } from 'react-dom'
import { appliedStyles, cns } from '@stcland/utils'
import type { ModalStyles } from '../styles/'
import useOutsideClick from './utils'

//*****************************************************************************
// Interface
//*****************************************************************************

export type TModalHandlers = {
  open: () => void
  close: () => void
}

export interface ModalProps {
  open?: boolean
  onClose?: (event?: MouseEvent | React.KeyboardEvent<HTMLDivElement>) => void
  ariaDescribedBy?: string
  ariaLabelledBy?: string
  disableEscapeKeyDown?: boolean
  fullScreen?: boolean
  maxWidth?: number
  header?: React.ReactNode
  content?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  customStyles?: Partial<ModalStyles>
}

//*****************************************************************************
// Components
//*****************************************************************************

const Modal = React.forwardRef<TModalHandlers, ModalProps>(function Modal(
  {
    open = false,
    onClose,
    ariaDescribedBy,
    ariaLabelledBy,
    disableEscapeKeyDown = false,
    fullScreen = false,
    maxWidth = 650,
    header,
    content,
    actions,
    className,
    customStyles
  },
  ref
) {
  const [showModal, setShowModal] = React.useState(open)
  const modalRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<Element | null>(null)

  const handleOpen = () => setShowModal(true)
  const handleClose = (event?: MouseEvent | React.KeyboardEvent<HTMLDivElement>) => {
    setShowModal(false)
    onClose?.(event)
  }

  React.useImperativeHandle(
    ref,
    () => ({
      open: handleOpen,
      close: handleClose,
    }),
    []
  )

  React.useEffect(() => {
    if (showModal) {
      triggerRef.current = document.activeElement
      modalRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      if (triggerRef.current) {
        (triggerRef.current as HTMLElement).focus()
      }
    }

    // Cleanup on component unmount to avoid any lingering styles
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [showModal])

  useOutsideClick(modalRef, { onClickOutside: onClose })

  if (!showModal) return null

  const modalStyles: ModalStyles = {
    root: 'fixed inset-0 z-50 flex items-center justify-center',
    modal: 'z-20 bg-gray-850 text-primary-main p-6 shadow-lg transition-all relative rounded min-w-[500px] flex flex-col space-y-16',
    backdrop: 'absolute inset-0 bg-black opacity-50',
    fullScreen: 'w-screen h-screen',
    closeButton: 'absolute top-4 right-4 text-3xl text-gray-500 hover:text-gray-800 focus:outline-none',
    headerContentContainer: 'flex flex-col flex-1 space-y-4',
    header: 'border-b border-primary-main text-2xl pb-4',
    content: 'text-gray-400',
    actions: 'flex justify-end'
  }

  const maxWidthStyle = maxWidth && `max-w-${maxWidth}`

  const mergedStyles = appliedStyles<ModalStyles>(modalStyles, customStyles)

  const cn = {
    root: cns(mergedStyles.root, className),
    modal: cns(
      mergedStyles.modal,
      fullScreen ? mergedStyles.fullScreen : 'max-w-screen-lg mx-auto',
      maxWidthStyle,
    ),
    backdrop: cns(mergedStyles.backdrop, fullScreen, maxWidthStyle),
    closeButton: mergedStyles.closeButton,
    headerContentContainer: mergedStyles.headerContentContainer,
    header: mergedStyles.header,
    content: mergedStyles.content,
    actions: mergedStyles.actions
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={cn.root}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape' && !disableEscapeKeyDown) handleClose(event)
      }}
    >
      <div className={cn.backdrop} />
      <div ref={modalRef} className={cn.modal} tabIndex={-1}>
        <button
          aria-label="Close"
          onClick={()=> handleClose()}
          className={cn.closeButton}
        >
          ×
        </button>
        <div className={cn.headerContentContainer}>
          {header && <div className={cn.header}>{header}</div>}
          {content && <div className={cn.content}>{content}</div>}
        </div>
        {actions && <div className={cn.actions}>{actions}</div>}
      </div>
    </div>,
    document.body
  )
})

export default Modal
