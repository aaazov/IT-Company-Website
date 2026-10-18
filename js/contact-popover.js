(function () {
    'use strict';

    const popup = document.querySelector('.contact-popover');
    const product = document.getElementById('product');
    const invitation = document.querySelector('.communicate');
    if (!popup || !product || !invitation) return;

    const topButton = document.querySelector('.back-to-top');
    const navbar = document.querySelector('.header .navbar');
    const header = document.querySelector('.header');
    const mobile = window.matchMedia('(max-width: 600px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dismissed = false;
    let requestedVisible = false;
    let hideTimer;
    let productReached = false;
    let framePending = false;
    let previousFocus;

    // Dismissal lasts only until this page is reloaded.

    function finishHide() {
        if (requestedVisible) return;
        clearTimeout(hideTimer);
        popup.hidden = true;
        document.body.classList.remove('survey-invite-visible');
    }

    function setVisible(visible) {
        if (visible === requestedVisible) return;
        requestedVisible = visible;
        clearTimeout(hideTimer);
        if (visible) {
            if (popup.hidden) {
                previousFocus = document.activeElement;
                popup.hidden = false;
                // Commit the starting style before transitioning into view.
                popup.getBoundingClientRect();
            }
            popup.inert = false;
            popup.removeAttribute('aria-hidden');
            document.body.classList.add('survey-invite-visible');
            popup.classList.add('is-visible');
        } else {
            if (popup.contains(document.activeElement) && previousFocus && previousFocus.isConnected) {
                previousFocus.focus({ preventScroll: true });
            }
            popup.inert = true;
            popup.setAttribute('aria-hidden', 'true');
            popup.classList.remove('is-visible');
            if (reducedMotion.matches) finishHide();
            else hideTimer = setTimeout(finishHide, 220);
        }
    }

    popup.addEventListener('transitionend', function (event) {
        if (event.target === popup && event.propertyName === 'opacity') finishHide();
    });

    function dismiss() {
        dismissed = true;
        setVisible(false);
    }

    function update() {
        framePending = false;
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const viewportBottom = window.visualViewport ? window.visualViewport.offsetTop + viewportHeight : viewportHeight;
        const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
        const productRect = product.getBoundingClientRect();

        // Also handles anchor navigation and a restored scroll position past Product.
        if (window.scrollY > 0 && productRect.top < viewportBottom * .85) productReached = true;

        const invitationRect = invitation.getBoundingClientRect();
        const invitationVisible = invitationRect.top < viewportBottom && invitationRect.bottom > headerBottom;
        const menuOpen = navbar && navbar.classList.contains('nav-toggle');
        const keyboardOpen = mobile.matches && window.visualViewport && viewportHeight < window.innerHeight * .75;
        const visible = productReached && !dismissed && !invitationVisible && !menuOpen && !keyboardOpen && !document.hidden;

        let bottom = 16;
        if (mobile.matches) {
            const viewportWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
            const viewportLeft = window.visualViewport ? window.visualViewport.offsetLeft : 0;
            const bottomInset = Math.max(0, window.innerHeight - viewportBottom);
            bottom = 12 + bottomInset;
            document.body.style.setProperty('--survey-viewport-width', viewportWidth + 'px');
            document.body.style.setProperty('--survey-viewport-right', Math.max(0, window.innerWidth - viewportLeft - viewportWidth) + 'px');
            document.body.style.setProperty('--survey-viewport-bottom', bottomInset + 'px');
        } else if (topButton && getComputedStyle(topButton).display !== 'none') {
            bottom = Math.max(bottom, window.innerHeight - topButton.getBoundingClientRect().top + 12);
        }
        popup.style.setProperty('--contact-popover-bottom', bottom + 'px');
        setVisible(visible);
        if (visible && mobile.matches) {
            // Leave space to scroll the final page content clear of the compact dock.
            document.body.style.setProperty('--survey-dock-height', Math.ceil(popup.getBoundingClientRect().height + 24) + 'px');
        }
    }

    function scheduleUpdate() {
        if (framePending) return;
        framePending = true;
        requestAnimationFrame(update);
    }

    popup.querySelector('.contact-popover-close').addEventListener('click', function () {
        dismiss();
    });
    const feedbackLink = popup.querySelector('.contact-popover-feedback');
    feedbackLink.addEventListener('click', function () {
        dismiss();
    });
    feedbackLink.addEventListener('auxclick', function (event) {
        if (event.button === 1) dismiss();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && requestedVisible) dismiss();
    });

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate, { once: true });
    window.addEventListener('pageshow', scheduleUpdate);
    document.addEventListener('visibilitychange', scheduleUpdate);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', scheduleUpdate);
        window.visualViewport.addEventListener('scroll', scheduleUpdate);
    }
    if (navbar) new MutationObserver(scheduleUpdate).observe(navbar, { attributes: true, attributeFilter: ['class'] });
    if (topButton) new MutationObserver(scheduleUpdate).observe(topButton, { attributes: true, attributeFilter: ['style'] });
    if (window.ResizeObserver) {
        const observer = new ResizeObserver(scheduleUpdate);
        observer.observe(product);
        observer.observe(invitation);
    }
    scheduleUpdate();
})();