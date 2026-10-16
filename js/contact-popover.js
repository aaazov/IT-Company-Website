(function () {
    'use strict';

    const popup = document.querySelector('.contact-popover');
    const sourceForm = document.getElementById('contact-form');
    const contactSection = document.querySelector('.contact-in');
    const topButton = document.querySelector('.back-to-top');
    if (!popup || !sourceForm || !contactSection) return;

    const storageKey = 'aikangaroo.contact-popover.disabled';
    const initialDelay = 10 * 1000;
    const laterDelay = 30 * 60 * 1000;
    let permanentlyDisabled = false;
    let contactSeen = false;
    let readyToShow = false;
    let promptTimer;
    let framePending = false;
    let previousFocus;

    function readDisabled() {
        try {
            return Boolean(localStorage.getItem(storageKey));
        } catch (error) {
            return permanentlyDisabled;
        }
    }

    function hide() {
        const restoreFocus = popup.contains(document.activeElement);
        popup.hidden = true;
        readyToShow = false;
        clearTimeout(promptTimer);
        if (restoreFocus && previousFocus && previousFocus.isConnected) {
            previousFocus.focus({ preventScroll: true });
        }
    }

    function disableForever(reason) {
        permanentlyDisabled = true;
        try {
            localStorage.setItem(storageKey, reason);
        } catch (error) {
            // Keep the preference in memory when browser storage is unavailable.
        }
        hide();
    }

    // Reuse the existing fields and validation without duplicating their IDs.
    const popupForm = sourceForm.cloneNode(true);
    popupForm.id = 'contact-popover-form';
    popupForm.removeAttribute('onsubmit');
    popupForm.addEventListener('submit', submitForm);
    const labels = {
        name: 'Name',
        phone: 'Phone number',
        email: 'Email (optional)',
        message: 'Your message',
    };
    const autocomplete = { name: 'name', phone: 'tel', email: 'email' };
    popupForm.querySelectorAll('input, textarea').forEach(function (field) {
        field.id = 'contact-popover-' + field.name;
        if (autocomplete[field.name]) field.autocomplete = autocomplete[field.name];
        const label = document.createElement('label');
        label.htmlFor = field.id;
        label.textContent = labels[field.name] || field.name;
        field.before(label);
    });
    popup.querySelector('.contact-form').prepend(popupForm);
    popup.querySelector('h2').textContent = document.querySelector('.contact .heading').textContent;

    function updatePosition() {
        let bottom = 15;
        if (topButton && getComputedStyle(topButton).display !== 'none') {
            bottom = window.innerHeight - topButton.getBoundingClientRect().top + 12;
        }
        popup.style.setProperty('--contact-popover-bottom', bottom + 'px');
    }

    function checkContactVisibility() {
        if (contactSeen) return;
        const rect = contactSection.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        if (rect.height > 0 && visibleHeight >= rect.height / 6 &&
            rect.right > 0 && rect.left < window.innerWidth) {
            contactSeen = true;
            hide();
        }
    }

    function maybeShow() {
        checkContactVisibility();
        if (!readyToShow || document.hidden || contactSeen || permanentlyDisabled || readDisabled()) return;
        readyToShow = false;
        updatePosition();
        previousFocus = document.activeElement;
        popup.hidden = false;
    }

    function schedule(delay) {
        clearTimeout(promptTimer);
        promptTimer = setTimeout(function () {
            readyToShow = true;
            maybeShow();
        }, delay);
    }

    function onViewportChange() {
        if (framePending) return;
        framePending = true;
        requestAnimationFrame(function () {
            framePending = false;
            updatePosition();
            checkContactVisibility();
        });
    }

    popup.querySelector('.contact-popover-close').addEventListener('click', hide);
    popup.querySelector('[data-contact-action="later"]').addEventListener('click', function () {
        hide();
        schedule(laterDelay);
    });
    popup.querySelector('[data-contact-action="never"]').addEventListener('click', function () {
        disableForever('opt-out');
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !popup.hidden) hide();
    });

    const demoLink = Array.from(document.querySelectorAll('.navbar a')).find(function (link) {
        return /demo request/i.test(link.textContent);
    });
    function onDemoClick(event) {
        const link = event.target.closest('a');
        if (demoLink && link && link.href === demoLink.href && (event.button === 0 || event.button === 1)) {
            disableForever('demo-request');
        }
    }
    document.addEventListener('click', onDemoClick);
    document.addEventListener('auxclick', onDemoClick);
    document.addEventListener('contact:submitted', function (event) {
        const submittedHere = event.detail.form === popupForm && !popup.hidden;
        disableForever('submitted');
        if (submittedHere) {
            // Keep the confirmation visible until the visitor closes it.
            popupForm.hidden = true;
            popup.querySelector('.contact-popover-actions').hidden = true;
            popup.hidden = false;
        }
    });
    window.addEventListener('storage', function (event) {
        if (event.key === storageKey && event.newValue) disableForever(event.newValue);
    });
    window.addEventListener('scroll', onViewportChange, { passive: true });
    window.addEventListener('resize', onViewportChange);
    if (topButton) {
        // fadeOut sets display:none after scrolling has stopped.
        new MutationObserver(onViewportChange).observe(topButton, {
            attributes: true,
            attributeFilter: ['style'],
        });
    }
    document.addEventListener('visibilitychange', maybeShow);
    window.addEventListener('pagehide', hide);
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            contactSeen = false;
            start();
        }
    });

    function start() {
        checkContactVisibility();
        if (!contactSeen && !readDisabled()) schedule(initialDelay);
    }
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
})();
