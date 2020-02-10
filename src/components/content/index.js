import React, { useCallback, useRef, useState } from 'react'
import StackContent from './stack'
import './style.scss'

function Content() {
  const [isTopShown, setIsTopShown] = useState(true)
  const [isFooterShown, setIsFooterShown] = useState(false)
  const topRef = useRef(null)
  const footerRef = useRef(null)
  const showFooter = useCallback((scrollTo = false) => {
    setIsTopShown(false)
    setIsFooterShown(true)

    if (scrollTo) {
      requestAnimationFrame(() => {
        footerRef.current.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [footerRef.current])
  
  const hideFooter = useCallback((scrollTo = false) => {
    setIsTopShown(true)
    setIsFooterShown(false)

    if (scrollTo) {
      requestAnimationFrame(() => {
        topRef.current.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [topRef.current])

  return (
    <>
      <div ref={topRef} className={`main-content__top${isTopShown ? ' active' : ''}`}>
        Normal Scrolling Section
      </div>
      <StackContent
        hideFooter={hideFooter}
        showFooter={showFooter}
      />
      <div ref={footerRef} className={`main-content__footer${isFooterShown ? ' active' : ''}`}>
        Footer Section
      </div>
    </>
  )
}

export default Content
