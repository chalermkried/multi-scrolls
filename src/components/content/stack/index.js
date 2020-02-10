import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDrag } from 'react-use-gesture'
import useWindowSize from '../../use-windowsize'
import useOnScreen from '../../use-onscreen'

function StackContent({ hideFooter, showFooter }) {
  const lastHeight = useRef(null)
  const wrapperRef = useRef(null)
  const [contentHeight, setContentHeight] = useState('')
  const [isStackActive, setIsStackActive] = useState(false)
  const [currentItemNo, setCurrentItemNo] = useState(0)
  const windowSize = useWindowSize()

  // Use isSupported to handle browser without IntersectionObserver
  const [isOnScreen, isSupported] = useOnScreen(wrapperRef, { threshold: 0.8 })
  const EL_ID_PREFIX = 'test_'
  const VELOCITY_THRESHOLD = 0.1
  const HEIGHT_THRESHOLD = 0.35
  
  const dragBind = useDrag(({
    down,
    event,
    movement: [mx, my],
    direction: [xDir, yDir],
    distance,
    velocity,
  }) => {
    const previousItem = document.getElementById(`${EL_ID_PREFIX}${currentItemNo - 1}`)
    const currentItem = document.getElementById(`${EL_ID_PREFIX}${currentItemNo}`)
    const nextItem = document.getElementById(`${EL_ID_PREFIX}${currentItemNo + 1}`)

    // yDir = 0 means a tap not drag
    if (yDir === 0) {
      return
    }

    if (isStackActive) {
      // ScrollIntoView animation doesn't work on iOS,
      // this works though https://github.com/flyingant/react-scroll-to-component
      wrapperRef.current.scrollIntoView({ behavior: 'smooth' })

      if (event.cancelable) {
        event.preventDefault() // Maybe can use touch-action: none
      }
    }

    // Released
    if (!down) {
      if (isOnScreen && !isStackActive) {
        setIsStackActive(true)
      } else if (isStackActive && (velocity > VELOCITY_THRESHOLD || distance > window.innerHeight * HEIGHT_THRESHOLD)) {

        // Pop one layer out
        if (my > 0) {
          if (previousItem) {
            setCurrentItemNo(currentItemNo - 1)
            currentItem.classList.remove('active')

            if (previousItem?.classList.contains('push')) {
              previousItem.classList.remove('hidden')
            }

            hideFooter()
            wrapperRef.current.scrollIntoView()

          // No more layer to pop out
          } else {
            hideFooter(true)
            setIsStackActive(false)
          }

        // Put one layer in
        } else if (my < 0) {
          if (nextItem) {
            setCurrentItemNo(currentItemNo + 1)
            nextItem.classList.add('active')
  
            if (currentItem?.classList.contains('push')) {
              currentItem.classList.add('hidden')
            }

          // No more layer to put in
          } else {
            showFooter(true)
            setIsStackActive(false)
          }
        }
      }
    }
  }, {
    axis: 'y',
    domTarget: window,
    eventOptions: { passive: false },
  })

  useEffect(dragBind, [dragBind])
  
  useEffect(() => {
    setContentHeight(lastHeight.current && lastHeight.current < windowSize.height
      ? '100vh'
      : `${windowSize.height}px`
    )

    lastHeight.current = windowSize.height
  }, [windowSize.height])

  return (
    <div className="main-content__stack" ref={wrapperRef} style={{ height: contentHeight }}>
      <div id={`${EL_ID_PREFIX}0`} className="main-content__stack-item active">
        <span style={{ position: 'absolute', top: '0' }}>Test top</span>
        <div className="image">Image 1</div>
        <span style={{ position: 'absolute', bottom: '0' }}>Test bottom</span>
      </div>
      <div id={`${EL_ID_PREFIX}1`} className="main-content__stack-item">
        <span style={{ position: 'absolute', top: '0' }}>Test top</span>
        <div className="image">Image 2</div>
        <span style={{ position: 'absolute', bottom: '0' }}>Test bottom</span>
      </div>
      <div id={`${EL_ID_PREFIX}2`} className="main-content__stack-item">
        <span style={{ position: 'absolute', top: '0' }}>Test top</span>
        <div className="image">Image 3</div>
        <span style={{ position: 'absolute', bottom: '0' }}>Test bottom</span>
      </div>
      <div id={`${EL_ID_PREFIX}3`} className="main-content__stack-item">
        <span style={{ position: 'absolute', top: '0' }}>Test top</span>
        <div className="image">Image 4</div>
        <span style={{ position: 'absolute', bottom: '0' }}>Test bottom</span>
      </div>
      <div id={`${EL_ID_PREFIX}4`} className="main-content__stack-item">
        <span style={{ position: 'absolute', top: '0' }}>Test top</span>
        <div className="image">Image 5</div>
        <span style={{ position: 'absolute', bottom: '0' }}>Test bottom</span>
      </div>
    </div>
  )
}

StackContent.propTypes = {
  hideFooter: PropTypes.func.isRequired,
  showFooter: PropTypes.func.isRequired,
}

export default StackContent
