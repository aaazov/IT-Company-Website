export function useSurveyInvitation() {
  const popup = ref<HTMLElement | null>(null)
  const visible = ref(false)
  const hidden = ref(true)
  let dismissed = false
  let hideTimer: ReturnType<typeof setTimeout> | undefined
  let frame = 0
  let previousFocus: HTMLElement | null = null

  function setVisible(value: boolean) {
    if (value === visible.value) return
    clearTimeout(hideTimer)
    const element = popup.value
    if (!element) return
    if (value) {
      if (hidden.value) previousFocus = document.activeElement as HTMLElement | null
      hidden.value = false
      element.hidden = false
      void element.getBoundingClientRect()
      visible.value = true
      document.body.classList.add('survey-invite-visible')
    } else {
      if (element.contains(document.activeElement) && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
      visible.value = false
      document.body.classList.remove('survey-invite-visible')
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) hidden.value = true
      else hideTimer = setTimeout(() => { if (!visible.value) hidden.value = true }, 220)
    }
  }

  function dismiss() {
    dismissed = true
    setVisible(false)
  }

  onMounted(() => {
    const element = popup.value
    const invitation = document.querySelector<HTMLElement>('.communicate')
    const header = document.querySelector<HTMLElement>('.header')
    if (!element || !invitation || !header) return
    const topButton = document.querySelector<HTMLElement>('.back-to-top')
    const navbar = document.querySelector<HTMLElement>('.header .navbar')
    const mobile = window.matchMedia('(max-width: 600px)')
    const viewport = window.visualViewport
    const disposers: (() => void)[] = []
    const listen = (target: EventTarget, event: string, handler: EventListener) => {
      target.addEventListener(event, handler, { passive: true })
      disposers.push(() => target.removeEventListener(event, handler))
    }

    function update() {
      frame = 0
      if (!element || !invitation || !header) return
      const viewportHeight = viewport?.height ?? window.innerHeight
      const viewportBottom = (viewport?.offsetTop ?? 0) + viewportHeight
      const invitationRect = invitation.getBoundingClientRect()
      const invitationVisible = invitationRect.top < viewportBottom && invitationRect.bottom > header.getBoundingClientRect().bottom
      const keyboardOpen = mobile.matches && viewport && viewportHeight < window.innerHeight * 0.75
      const show = window.scrollY > Number(header.dataset.scrollThreshold) && !dismissed && !invitationVisible && !navbar?.classList.contains('nav-toggle') && !keyboardOpen && !document.hidden
      let bottom = 16
      if (mobile.matches) {
        const viewportWidth = viewport?.width ?? window.innerWidth
        const viewportLeft = viewport?.offsetLeft ?? 0
        const bottomInset = Math.max(0, window.innerHeight - viewportBottom)
        bottom = 12 + bottomInset
        document.body.style.setProperty('--survey-viewport-width', viewportWidth + 'px')
        document.body.style.setProperty('--survey-viewport-right', Math.max(0, window.innerWidth - viewportLeft - viewportWidth) + 'px')
        document.body.style.setProperty('--survey-viewport-bottom', bottomInset + 'px')
      } else if (topButton && getComputedStyle(topButton).display !== 'none') {
        bottom = Math.max(bottom, window.innerHeight - topButton.getBoundingClientRect().top + 12)
      }
      element.style.setProperty('--contact-popover-bottom', bottom + 'px')
      setVisible(Boolean(show))
      if (show && mobile.matches) document.body.style.setProperty('--survey-dock-height', Math.ceil(element.getBoundingClientRect().height + 24) + 'px')
    }

    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    listen(window, 'scroll', schedule)
    listen(window, 'resize', schedule)
    listen(window, 'load', schedule)
    listen(window, 'pageshow', schedule)
    listen(document, 'visibilitychange', schedule)
    listen(document, 'keydown', ((event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible.value) dismiss()
    }) as EventListener)
    listen(element, 'transitionend', ((event: TransitionEvent) => {
      if (event.target === element && event.propertyName === 'opacity' && !visible.value) {
        clearTimeout(hideTimer)
        hidden.value = true
      }
    }) as EventListener)
    if (viewport) { listen(viewport, 'resize', schedule); listen(viewport, 'scroll', schedule) }
    const mutation = new MutationObserver(schedule)
    if (navbar) mutation.observe(navbar, { attributes: true, attributeFilter: ['class'] })
    if (topButton) mutation.observe(topButton, { attributes: true, attributeFilter: ['style'] })
    const resize = new ResizeObserver(schedule)
    resize.observe(invitation)
    schedule()
    onBeforeUnmount(() => {
      disposers.forEach(dispose => dispose())
      mutation.disconnect()
      resize.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(hideTimer)
      document.body.classList.remove('survey-invite-visible')
      for (const name of ['--survey-viewport-width', '--survey-viewport-right', '--survey-viewport-bottom', '--survey-dock-height']) document.body.style.removeProperty(name)
    })
  })

  return { popup, visible, hidden, dismiss }
}
