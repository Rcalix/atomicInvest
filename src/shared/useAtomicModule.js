import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * Atomic Module is running inside iframe.
 */
export default function useAtomicModule(config) {
  // Make module URL
  const moduleURL = `https://module.cdn.atomicvest.com/atomic-module/latest/index.html`
  const moduleOrigin = new URL(moduleURL).origin
  console.log(moduleURL, moduleOrigin)
  // 1. Define two html refs
  const iframeRef = useRef() // to host Atomic Module
  const backdropRef = useRef() // to show backdrop while Atomic Module is loading

  // 2. Define internal state
  const [isOpen, setOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState()

  // 3. Define open and exit handlers
  const open = useCallback((userId) => {
    setOpen(true)
    setCurrentUserId(userId)
  }, [])

  const onExit = useCallback(() => {
    setOpen(false)
  }, [])

  // 4. Define callback to get a new oneTimeToken when session expired
  const requestSessionUpdate = useCallback(() => {
    return fetch('/example/auth/onetime-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: currentUserId,
      }),
    })
      .then((rsp) => rsp.json())
      .then((data) => data.token)
  }, [currentUserId])

  // 5. Define message handler for LOAD, EXIT, SESSION_EXPIRED events from Atomic Module
  const handleMessage = useCallback(
    (event) => {
      // Handle only messages from Atomic Module.
      // Check both origin and source.
      // See https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#security_concerns
      if (
        event.origin !== moduleOrigin ||
        event.source !== iframeRef.current.contentWindow
      ) {
        return
      }


      // LOAD event is fired after Atomic Module is ready
      if (event.data === 'LOAD') {
        if (backdropRef.current) {
          document.body.style.overflow = 'hidden'
          backdropRef.current.style.background = 'transparent'
        }
      }

      // EXIT event is fired when user wants to exit from Atomic Module
      if (event.data === 'EXIT') {
        document.body.style.overflow = 'auto'
        onExit()
      }

      // SESSION_EXPIRED event notify you about session that expired (~45min)
      if (event.data === 'SESSION_EXPIRED') {
        requestSessionUpdate().then((token) =>
          iframeRef.current.contentWindow.postMessage(
            {
              type: 'ONE_TIME_TOKEN',
              token,
            },
            moduleOrigin
          )
        )
      }
    },
    [onExit, backdropRef, iframeRef, requestSessionUpdate, moduleOrigin]
  )

  // 6. Listen to messages from Atomic Module
  useEffect(() => {
    window.addEventListener('message', handleMessage, false)

    return () => {
      window.removeEventListener('message', handleMessage, false)
    }
  }, [handleMessage])

  return {
    isOpen,
    open,
    iframeRef,
    backdropRef,
    moduleURL,
    config: {
      ...config,
      shouldCloseAfterOnboarding: true,
    },
  }
}
