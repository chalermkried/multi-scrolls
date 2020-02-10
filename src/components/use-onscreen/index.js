import { useEffect, useState } from 'react'

// Modified from https://usehooks.com/
function useOnScreen(ref, { rootMargin = '0px', threshold = 0.5 }) {
  const [isIntersecting, setIntersecting] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    if (!ref.current) {
      return () => null
    }

    const nodeRef = ref.current

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIntersecting(entry.isIntersecting)
        },
        {
          rootMargin,
          threshold,
        },
      )

      observer.observe(nodeRef)

      return () => {
        observer.unobserve(nodeRef)
      };
    // If IntersectionObserver is not supported
    } else {
      setIsSupported(false)
    }
    
    return () => null
  }, []) // Run only once

  return [isIntersecting, isSupported]
}

export default useOnScreen
