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

function showToast(type, message) {
    const toastEl = document.getElementById('global-toast');
    const titleEl = document.getElementById('toast-title');
    const bodyEl = document.getElementById('toast-body');

    const isSuccess = type === 'success';
    titleEl.textContent = isSuccess ? 'Success' : 'Notice';
    bodyEl.textContent = message;

    const header = toastEl.querySelector('.toast-header');
    header.classList.remove('bg-success', 'bg-danger', 'text-white');
    if (isSuccess) {
        header.classList.add('bg-success', 'text-white');
    } else {
        header.classList.add('bg-danger', 'text-white');
    }

    $(toastEl).toast('show');
}

function submitForm(e) {
    e.preventDefault();

    const form = e.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const submitBtn = document.querySelector('.contact-form-btn');

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = {
        name: document.querySelector('[name="name"]').value,
        phone: document.querySelector('[name="phone"]').value,
        email: document.querySelector('[name="email"]').value,
        message: document.querySelector('[name="message"]').value,
    };

    const devURL = CONFIG.DEV_URL;
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
               showToast('success', 'Thank you! Your Message sent successfully!');
                console.log('success');
                document.getElementById('contact-form').reset();
            } else {
                showToast('error','Submission Failed:  ' + (data.error || 'Please try again.'));
                console.log('response fail');
                console.log('Response JSON:', data);
            }
        })
        .catch((error) => {
            showToast('error', 'Error submitting the form. Please try again.');
            console.log('catch block error:  ' + error);
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

