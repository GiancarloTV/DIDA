// === MAIN FUNCTIONALITY ===

let current_y = $(this).scrollTop();
let current_w = $(this).width();
let server_config = null;
const BLACK = "color:#537684";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+52\d{10}$/;

const targets = [$('.section_main_hero'), $('.section_main_form')];

$(document).ready(function() {

    (async function() {

        await handle_server_config();

        if (server_config) {
            if (server_config['MAINTENANCE'] === true) {
                window.location.href = '/';
            }
        } else {
            window.location.href = '/';
        }


    })();

    // === SMOOTH SCROLLING FOR NAVIGATION ===
    
    $('.section_header_nav_list li, .aside_header_nav_list li').on('click', function() {
        const text = $(this).text().toLowerCase();
        let targetSection;

        console.log(text);
        
        switch (text) {
            case 'inicio':
                targetSection = '.section_main_hero';
                break;

            case 'servicios':
                targetSection = '.section_main_services';
                break;

            case 'contacto':
                targetSection = '.section_main_form';
                break;

            case 'faq':
                targetSection = '.section_main_faq';
                break;

            default:
                return;
        }

        if ($('#aside_header_nav').is(':visible')) {
            $('#aside_header_nav').fadeOut(300);
        };
        
        if (targetSection) {
            $('html, body').animate({
                scrollTop: $(targetSection).offset().top
            }, 800);
        }
    });

    // === SMOOTH SCROLLING FOR MENU NAVIGATION ===

    $('#menu_button').on('click', function() {
        $('#aside_header_nav').fadeIn(300);
    });

    $('#aside_header_nav_close').on('click', function() {
        $('#aside_header_nav').fadeOut(300);
    });
    
    // FAQ Accordion functionality
    $('.section_main_content_faq_item').on('click', function(e) {
        e.stopPropagation(); // evita que el click llegue al document y cierre inmediatamente

        const $item = $(this);
        const $answer = $item.find('.section_main_content_faq_item_a');

        // Si el item ya está activo => cerrarlo
        if ($item.hasClass('active')) {
            $answer.slideUp(300, function() {
                $item.removeClass('active');
            });
            return;
        }

        // Si queremos que solo haya 1 abierto a la vez: cerrar los otros primero
        const $others = $('.section_main_content_faq_item').not($item);
        $others.removeClass('active').find('.section_main_content_faq_item_a').slideUp(300);

        // Abrir el actual y marcar activo al inicio (para estilos inmediatos)
        $item.addClass('active');
        $answer.slideDown(300);
    });

    // Optional: Close FAQ items when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.section_main_content_faq_item').length) {
            $('.section_main_content_faq_item').removeClass('active');
            $('.section_main_content_faq_item_a').slideUp(300);
        }

        if (!$(e.target).closest('#aside_header_nav, #menu_button').length) {
            $('#aside_header_nav').fadeOut(300);
        }
    });

    animateFocus(current_y);
    $(window).on('scroll', function() {
        const y = $(this).scrollTop();

        if (y != current_y) {
            current_y = y;

            animateFocus(y);

            if ($('#aside_header_nav').is(':visible')) {
                $('#aside_header_nav').fadeOut(300);
            };
        }
        // console.log('Scroll:', y);
    });

    // === FORM VALIDATION (Optional) ===

    $('#name_input, #company_input, #email_input, #phone_input, #message_input').on('input', function() {
        const fieldId = $(this).attr('id');
        const errorSpan = $('#' + fieldId.replace('_input', '_error'));

        if ($(this).val().trim() !== '') {
            errorSpan.hide();
        }

        switch (fieldId) {

            case 'email_input':
                if (emailRegex.test($(this).val())) {
                    errorSpan.hide();
                } else {
                    errorSpan.text('Formato de email inválido').show();
                }
                break;

            case 'phone_input':
                if (validateMexPhone($(this).val())) {
                    errorSpan.hide();
                } else {
                    errorSpan.text('Formato de teléfono inválido').show();
                }
                break;

        }
    });

    $('#send_button').on('click', function(e) {
        e.preventDefault();
        
        // Basic form validation
        let isValid = true;
        
        // Check each required field
        const fields = ['name_input', 'company_input', 'email_input', 'phone_input', 'message_input'];
        
        fields.forEach(function(fieldId) {
            const field = $('#' + fieldId);
            const errorSpan = $('#' + fieldId.replace('_input', '_error'));
            
            if (field.val().trim() === '') {
                errorSpan.text('Este campo es requerido').show();
                isValid = false;
            } else {
                errorSpan.hide();
            }
        });
        
        // Email validation
        const email = $('#email_input').val();
        if (email && !emailRegex.test(email)) {
            $('#email_error').text('Formato de email inválido').show();
            isValid = false;
        }

        // Phone validation
        const phone = $('#phone_input').val();
        if (phone && !validateMexPhone(phone)) {
            $('#phone_error').text('Formato de teléfono inválido').show();
            isValid = false;
        }
        
        if (isValid) {
            
            // fetch('https://pedagogically-nonactinic-arline.ngrok-free.dev/form/contact', {
            fetch('/form/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: $('#name_input').val(),
                    company: $('#company_input').val(),
                    email: $('#email_input').val(),
                    phone: $('#phone_input').val(),
                    message: $('#message_input').val()
                })
            })
            .then (response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then (data => {
                if (data.Success) {
                    alert('¡Formulario enviado exitosamente! Nos pondremos en contacto contigo pronto.');

                    fields.forEach(function(fieldId) {
                        const field = $('#' + fieldId);

                        field.val('');
                    });
                } else {
                    alert('Error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.');
                    console.error('Server error:', data.Error);
                }
            }).catch(error => {
                alert('Error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.');
                console.error('Network error:', error);
            });
        }
    });

    // === CTA BUTTON ANIMATION ===
    
    $('.cta-a').on('click', function() {
        if ($(this).text().includes('prueba gratuita')) {
            
            $('html, body').animate({
                scrollTop: $('.section_main_form').offset().top
            }, 1000);

            $('#name_input').focus();
            $('#message_input').val('Me interesa una prueba gratuita de su sistema KPI.');
        }
    });

    //? === FOOTER FUNCTIONALITY ===

    //todo WhatsApp link functionality
    $('a[href*="wa.me"]').on('click', function(e) {
        e.preventDefault();
        const message = encodeURIComponent('Hola, me interesa conocer más sobre los sistemas KPI de DIDA GROUP. ¿Podrían brindarme más información?');
        window.open(`https://wa.me/524272312080?text=${message}`, '_blank');
    });

    //todo Current year update
    $('.footer_copyright').html($('.footer_copyright').html().replace('2025', new Date().getFullYear()));

});

// === GENERAL FUNCTIONS ===

    function animateFocus (y) {
        const threshold = 0.65; // 55% visible

        targets.forEach(target => {
            const el = target && target.get ? target.get(0) : null;
            if (!el) return;

            const targetClass = target.attr('class').split(' ')[0];

            const rect = el.getBoundingClientRect();
            if (rect.height <= 0) {

                switch (targetClass) {
                    case 'section_main_hero':
                        $('#section_main_img').removeClass('section_main_content_wrap_focus');
                        break;

                    case 'section_main_form':
                        $('#section_form_img').removeClass('section_main_content_form_img_focus');
                        break;
                }
                return;
            }

            // calcular la altura visible del elemento dentro del viewport
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const ratio = Math.max(0, visibleHeight) / rect.height;

            if (ratio >= threshold) {

                switch (targetClass) {
                    case 'section_main_hero':
                        $('#section_main_img').addClass('section_main_content_wrap_focus');
                        break;

                    case 'section_main_form':
                        $('#section_form_img').addClass('section_main_content_form_img_focus');
                        break;
                }
            } else {
                switch (targetClass) {
                    case 'section_main_hero':
                        $('#section_main_img').removeClass('section_main_content_wrap_focus');
                        break;

                    case 'section_main_form':
                        $('#section_form_img').removeClass('section_main_content_form_img_focus');
                        break;
                }
            }
        });

    }

    function validateMexPhone(input) {
        // quitar todo lo que no sea dígito
        let digits = input.replace(/\D/g, '');

        // quitar prefijo internacional 00 o + en forma de 00 (ya quitamos no-dígitos)
        if (digits.startsWith('00')) digits = digits.replace(/^00/, '');

        // quitar country code 52 si existe
        if (digits.startsWith('52')) digits = digits.slice(2);

        // si quedó un '1' de móvil (cuando se usó +52 1 ...) quitarlo
        if (digits.startsWith('1') && digits.length === 11) digits = digits.slice(1);

        // ahora digits debe tener exactamente 10 dígitos
        return /^\d{10}$/.test(digits);
    }

    async function handle_server_config () {
        try {

        let response = await fetch (`/Sys/Config.json`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        let data = await response.json();

        console.log("%c[SRVR] Config Downloaded: %o", BLACK, data);
        server_config = data;

        } catch (error) {
        console.error(error);
        server_config = null;
        }
    }