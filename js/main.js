$(document).ready(function () {
    const headerScrollThreshold = Number(document.querySelector('.header').dataset.scrollThreshold);

    $('.fa-bars').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('load scroll', function () {
        $('.fa-bars').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if ($(window).scrollTop() > headerScrollThreshold) {
            $('.header').css({
                background: '#002e5f',
                'box-shadow': '0 .2rem .5rem rgba(0,0,0,.4)',
            });
        } else {
            $('.header').css({ background: 'none', 'box-shadow': 'none' });
        }
    });

    const counters = document.querySelectorAll('.counter');
    const speed = 120;
    counters.forEach((counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;
            if (count < target) {
                counter.innerText = count + inc;
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });

    (function ($) {
        'use strict';

        $('.clients-carousel').owlCarousel({
            autoplay: true,
            dots: true,
            loop: true,
            responsive: {
                0: { items: 2 },
                768: { items: 4 },
                900: { items: 6 },
            },
        });

        $('.testimonials-carousel').owlCarousel({
            autoplay: true,
            dots: true,
            loop: true,
            responsive: {
                0: { items: 1 },
                576: { items: 2 },
                768: { items: 3 },
                992: { items: 4 },
            },
        });
    })(jQuery);

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    $('.accordion-header').click(function () {
        const $header = $(this);
        const $body = $header.next('.accordion-body');
        const opening = !$header.hasClass('is-open');

        $header.toggleClass('is-open', opening);
        $header.children('span').text(opening ? '-' : '+');

        $body.stop(true, false);
        if (opening) {
            $body.slideDown(250, 'linear');
        } else {
            $body.slideUp(250, 'linear');
        }
    });
});

function submitForm(e) {
    e.preventDefault();

    const form = e.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const submitBtn = form.querySelector('.contact-form-btn');
    const responseMessage = form.parentElement.querySelector('[role="status"]');

    if (submitBtn.disabled) return;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = {
        name: form.elements.namedItem('name').value,
        phone: form.elements.namedItem('phone').value,
        email: form.elements.namedItem('email').value,
        message: form.elements.namedItem('message').value,
    };

    const execUrl = CONFIG.EXEC_URL;

    fetch(
        execUrl,
        {
            method: 'POST',
            body: JSON.stringify(formData),
        }
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                responseMessage.textContent =
                    'Thank you! Your message has been sent.';
                console.log('success');
                form.reset();

                setTimeout(() => {
                    if (!form.hidden) responseMessage.textContent = '';
                }, 5000);
            } else {
                responseMessage.textContent =
                    'Submission Failed:  ' +
                    (data.error || 'Please try again.');
                console.log('response fail');
                console.log('Response JSON:', data);

                // 5秒后清空提示
                setTimeout(() => {
                    responseMessage.textContent = '';
                }, 5000);
            }
        })
        .catch((error) => {
            responseMessage.textContent =
                'Error submitting the form. Please try again.';
            console.log('catch block error:  ' + error);

            setTimeout(() => {
                responseMessage.textContent = '';
            }, 5000);
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

