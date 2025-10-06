$(document).ready(function () {
    $('.fa-bars').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('load scroll', function () {
        $('.fa-bars').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if ($(window).scrollTop() > 35) {
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
        $('.accordion .accordion-body').slideUp(500);
        $(this).next('.accordion-body').slideDown(500);
        $('.accordion .accordion-header span').text('+');
        $(this).children('span').text('-');
    });
});

function submitForm(event) {
    event.preventDefault();

    const submitBtn = document.querySelector('.contact-form-btn');
    const responseMessage = document.getElementById('response-message');

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = {
        name: document.querySelector('[name="name"]').value,
        phone: document.querySelector('[name="phone"]').value,
        email: document.querySelector('[name="email"]').value,
        message: document.querySelector('[name="message"]').value,
    };

    const devURL = "DEV_URL_PLACEHOLDER";
    const execUrl = "EXEC_URL_PLACEHOLDER";

    // 发送到 API
    fetch(
        execUrl;
        {
            method: 'POST',
            body: JSON.stringify(formData),
        }
    )
        .then((response) => response.json())
        .then((data) => {
            responseMessage.textContent =
                'Thank you! Your message has been sent.';
            document.getElementById('contact-form').reset();
        })
        .catch((error) => {
            responseMessage,
                (textContent = 'Error submitting the form. Please try again.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}
