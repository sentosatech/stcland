import * as React from 'react'

interface UseOutsideClickOptions {
  onClickOutside?: () => void
  capture?: boolean
}

export default function useOutsideClick(
  ref: React.RefObject<HTMLElement>,
  { onClickOutside = () => {}, capture = false }: UseOutsideClickOptions = {}
) {
  const handleClickOutside = React.useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside()
      }
    },
    [onClickOutside, ref]
  )

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, { capture })
    document.addEventListener('touchstart', handleClickOutside, { capture })

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture })
      document.removeEventListener('touchstart', handleClickOutside, { capture })
    }
  }, [handleClickOutside, capture])
}
