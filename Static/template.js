// Constants Variables
  // Color
  const BLACK = "color:#537684";
  const WHITE = "color:#cbcbcb";
  const RED   = "color:#a61717";
  const GREEN = "color:#199a19";
  const BLUE  = "color:#2782e9";
  const YELLOW = "color:#a6a603";

  //! Dark theme
  const _background_color_dark  = "black";
  const _content_color_dark     = "#121212";

  const _grid_color_dark        = "#393939";

  const _subtitle_color_dark    = "rgba(210, 210, 215, 0.6)";
  const _text_color_dark        = "rgba(210, 210, 215, 0.2)";
  //! Light theme
  const _background_color_light = "white";
  const _content_color_light    = "#c2c2c2";

  const _grid_color_light       = "#9e9e9e";

  const _subtitle_color_light   = "#525252";
  const _text_color_light       = "rgb(116, 116, 116)";

// Handle body
  let width = window.innerWidth;
  let height = window.innerHeight;

  function handle_resize () {
    window.addEventListener("resize", function() {
      let new_width = window.innerWidth;
      const notifications = [$('#notification0'), $('#notification1'), $('#notification2')];

      height = window.innerHeight;
      on_resize(new_width, width);
      width = new_width;

      if (width > 800 && $('.main_menu').hasClass('main_menu-hover')) {
        $('.main_menu').removeClass('main_menu-hover')
        $('.main_menu span').removeAttr('style');
        $('.main_menu p').removeAttr('style');
        $('#main_menu_dark').fadeOut(100);
      }

      notifications.forEach((notif, index) => {
        clearTimeout(notification_timeout[index]);
        notif.removeClass('notification-active');
        notif.addClass('notification-inactive');
        notif.fadeOut(200 + (index * 100));

        notification_id = 0;
      });
    });

    window.addEventListener('load', function () {
      const footer_height = document.querySelector('footer')?.offsetHeight || 0;

      setTimeout(() => {
        window.scrollTo(0, footer_height * 0.5);
      }, 100);
    });
  }

// Handle Menu Functions
  function handle_menu_hover () {

    const main_menu = $('.main_menu');
    const menu_button = $('.main_menu_title');
    const menu_dark = $('#main_menu_dark');
    const menu_pages = $('#menu_pages');

    menu_button.on('click', function () {

      if (width <= 800 && !main_menu.hasClass('main_menu-hover')) {

        main_menu.addClass('main_menu-hover')
        $('.main_menu span').css('width', '25%');
        $('.main_menu p').css('width', '70%');
        menu_dark.fadeIn(100);
        menu_pages.css('left', '50.8vw');

      } else if (main_menu.hasClass('main_menu-hover')) {

        main_menu.removeClass('main_menu-hover');
        $('.main_menu span').removeAttr('style');
        $('.main_menu p').removeAttr('style');
        menu_dark.fadeOut(100);
        menu_pages.removeAttr('style');

      }

    });

    $(document).on('click touchstart', function (event) {
      if (!$(event.target).closest('.main_menu').length) {
        if (width <= 800 && main_menu.hasClass('main_menu-hover')) {

          main_menu.removeClass('main_menu-hover');
          $('.main_menu span').removeAttr('style');
          $('.main_menu p').removeAttr('style');
          menu_dark.fadeOut(100);
          menu_pages.removeAttr('style');

        }
      }

      if (!$(event.target).closest('.search_result_list').length && !$(event.target).closest('.search_order_input').length) {
        $('#search_result').empty();
      }
    });

  }

  function handle_theme () {

    if (localStorage.getItem("theme") === "light") {
      $("body").addClass("light-mode-variables");
      $("#theme-toggler").attr("title", "Toggle To Light Mode");
      $(".main_menu_function_theme_light").css("width", "100%");
      $(".main_menu_function_theme_dark").css("width", "0%");
      update_bar_theme(true);

      on_theme_change(true, true);
    } else {
      update_bar_theme(false);
    }

    $("#theme-toggler").on("click", function() {
      $("body").toggleClass("light-mode-variables");

      let light_mode = $("body").hasClass("light-mode-variables");
      
      localStorage.setItem("theme", light_mode ? "light" : "dark");
      $("#theme-toggler").attr("title", light_mode ? "Toggle To Dark Mode" : "Toggle To Light Mode");
      $(".main_menu_function_theme_light").css("width", light_mode ? "100%" : "0%");
      $(".main_menu_function_theme_dark").css("width", light_mode ? "0%" : "100%");
      
      update_bar_theme(light_mode);
      on_theme_change(light_mode, false);
    });

  }

  function check_theme () {
    let set = localStorage.getItem("theme") === "light";
    let now = $("body").hasClass("light-mode-variables");

    // console.log("%c[THEME] Set: %o | Now: %o", BLACK, set, now);

    if (set !== now) {
      $("body").toggleClass("light-mode-variables");

      let light_mode = $("body").hasClass("light-mode-variables");
      
      localStorage.setItem("theme", light_mode ? "light" : "dark");
      $("#theme-toggler").attr("title", light_mode ? "Toggle To Dark Mode" : "Toggle To Light Mode");
      $(".main_menu_function_theme_light").css("width", light_mode ? "100%" : "0%");
      $(".main_menu_function_theme_dark").css("width", light_mode ? "0%" : "100%");
      
      update_bar_theme(light_mode);
      on_theme_change(light_mode, false);
    }
  }

  function update_bar_theme (light_mode) {
    const theme_color_meta = document.querySelector("meta[name='theme-color']");
    if (theme_color_meta) {
      theme_color_meta.setAttribute("content", light_mode ? _content_color_light : _content_color_dark);
    }
  }

  function handle_company () {

    fetch (`/company/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store'
    })
    .then(response => response.text())
    .then (data => {
      let data_downloaded = JSON.parse(data);
      $('#company_name').text(data_downloaded.Name);

      $('#company_logo').attr('src', `${data_downloaded.Logo}?t=${Date.now()}`);
      $('#company_logo').css('display', 'block');

      const path = window.location.pathname;
      if (path === '/admin') {
        $('#company_name_input').val(data_downloaded.Name);
        $('#company_name_input').attr('val_prev', data_downloaded.Name);

        $('#company_logo_preview').attr('src', `${data_downloaded.Logo}?t=${Date.now()}`);
        $('#company_logo_preview').css('display', 'block');
      }

    })
    .catch (error => {
      show_notification('Company Info', error.message, 'Error');
      console.error(error);
    });

  }

  function show_time () {
    let current_date = new Date();
    let hour = current_date.getHours();
    let minutes = current_date.getMinutes();
    let seconds = current_date.getSeconds();

    let am_pm = (hour < 12) ? 'a. m.' : 'p. m.';

    hour = (hour % 12) || 12;

    hour = hour < 10 ? '0' + hour : hour;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    let formatted_time = hour + ':' + minutes + ' ' + am_pm;

    $('#current_time').text(formatted_time);
  }

  let server_config = null;

  async function handle_server_config () {
    try {

      let response = await fetch (`/server/config`, {
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
      show_notification('Sync Server', error.message, 'Error');
      console.error(error);
      server_config = null;
    }
  }

// Handle Session
  let session = {
    Init        : false,
    Name        : "User",
    Workstation : "None",
    Admin       : false
  }

  let admin_required = false;

  const expressions = {
    email   : /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]/,
    password: /^.{8,16}$/
  }

  const session_inputs = {
    email     : false,
    password  : false
  }

  function handle_session () {
    $('#open_session_prompt').on('click', open_session_prompt);
    $('#close_session_prompt').on('click', close_session_prompt);
    $('#form_login').on('submit', send_login_form);

    (async function() {

      await handle_server_config();

      if (server_config) {
        check_session();
      }

    })();
  }

  function check_session () {

    const user = localStorage.getItem('User');
    const pass = localStorage.getItem('Pass');

    if (user && pass) {

      set_display('lock', 'Auto login');
      $('#open_session_prompt').off('click');
      $('#open_session_prompt').addClass('main_menu_session-disabled');

      (async function() {

        let success = await auto_login(user, pass);

        if (!success) {
          localStorage.removeItem('User');
          localStorage.removeItem('Pass');
          
          open_session_prompt();
          set_display('lock', admin_required ? 'Waiting Admin Session' : 'Waiting Session');
        } else {
          close_session_prompt();
        }

        $('#open_session_prompt').on('click', function () {
          open_session_prompt();
        })
        $('#open_session_prompt').removeClass('main_menu_session-disabled');

      })();

    } else {
      open_session_prompt();
    }

  }

  function valid_session () {
    const user = localStorage.getItem('User');
    const pass = localStorage.getItem('Pass');

    if (user && pass) {
      if (!session.Init) {
        check_session();
      }
    } else {
      if (session.Init) {
        session.Init = false;
        loading_prompt(admin_required ? "Admin Session Required" : "Session Required", false, 0, false, false, true);
        close_session_prompt();
  
        setTimeout(open_session_prompt, 1000);
      }
    }
  }

  async function auto_login(username, password) {
    let credentials = {
      Email     : username,
      Password  : password
    };

    try {

      let response = await fetch(`http://${window.location.hostname}:${server_config.DB_PORT}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      let data = await response.json();

      if (data.Success) {
        session.Admin       = data.Admin;
        
        if (admin_required && !session.Admin) {
          show_notification('Autologin error', 'User is not admin', 'Warning');
          return false;
        } else {
          show_notification('Autologin', `${username} has logged in`, 'OK');
        }
        
        session.Init        = true;
        session.Name        = data.Name;
        session.Workstation = data.Workstation;

        return true;
      } else {
        show_notification('Autologin error', `${data.Error}`, 'Error');
        return false;
      }

    } catch (error) {
      show_notification('Autologin error', error, 'Error');
      return false;
    }
  }

  function open_session_prompt () {
    const form_login_inputs = $('#form_inputs');
    const form_inputs = $('#form_login input');
    const form_button = $('#login_button');

    if (!session.Init) {
      form_login_inputs.addClass('session_main_form_inputs-active');
    } else {
      form_login_inputs.removeClass('session_main_form_inputs-active');
    }

    form_button.prop('disabled', !session.Init);
    form_button.text(session.Init ? "Log out" : "Log in");

    form_inputs.each(function() {
      if (!session.Init) {
        $(this).prop("disabled", false);
        $(this).on('input', verify_session_form);
        $(this).on('change', verify_session_form);
      } else {
        $(this).prop("disabled", true);
      }
    });

    $("#session_prompt").fadeIn(250);
  }

  function close_session_prompt () {
    $("#session_prompt").fadeOut(250);

    const form_login  = $('#form_login');
    const form_inputs = $('#form_login input');
    const form_button = $('#login_button');

    form_login[0].reset();
    $('#user_email_error').removeClass('input_error-active');
    $('#user_pass_error').removeClass('input_error-active');
    form_button.prop('disabled', true);

    form_inputs.each(function() {
      $(this).off('input', verify_session_form);
      $(this).off('change', verify_session_form);
      $(this).removeClass('input_bad')
    });

    session_inputs.email = false;
    session_inputs.password = false;

    if (session.Init) {
      $('#open_session_prompt span').addClass("main_menu_session-logout");
    } else {
      $('#open_session_prompt span').removeClass("main_menu_session-logout");
    }
    $('#open_session_prompt span').prop("title", session.Init ? "Log out" : "Log in");
    $('#open_session_prompt p').prop("title", session.Init ? session.Workstation : "Log in");
    $('#open_session_prompt p').text(session.Init ? session.Name : "Log in");

    on_close_session_prompt();

  }

  function send_login_form (e) {
    
    e.preventDefault();

    $('#login_button').prop('disabled', true);

    if (!session.Init) {
      loading_prompt("", false, 0, false, true, false);

      let data = {
        Email     : $('#user_email').val(),
        Password  : $('#user_pass').val(),
      }

      fetch (`http://${window.location.hostname}:${server_config.DB_PORT}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then (response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        return response.json();
      })
      .then (data => {
        if (data.Success) {
          session.Admin       = data.Admin;

          if (admin_required && !session.Admin) {
            loading_prompt("User not admin", false, 2000, false, false, false);
            setTimeout(function () {
              $('#login_button').prop('disabled', false);
            }, 2700);
          } else {
            session.Init        = true;
            session.Name        = data.Name;
            session.Workstation = data.Workstation;

            localStorage.setItem('User', $('#user_email').val());
            localStorage.setItem('Pass', $('#user_pass').val());
  
            loading_prompt("Accepted", true, 1000, true, false, false);
          }

        } else {
          loading_prompt("Declined", false, 2000, false, false, false);
          setTimeout(function () {
            $('#login_button').prop('disabled', false);
          }, 2700);
        }
      })
      .catch (error => {
        loading_prompt('Server offline', false, 5000, false, false, false);
        setTimeout(function () {
          $('#login_button').prop('disabled', false);
        }, 5700);
      });

    } else {

      session.Init = false;
      loading_prompt(admin_required ? "Admin Session Required" : "Session Required", false, 0, false, false, true);

    }

  }

  function verify_session_form (e) {
    const input = $(this);

    switch (input.attr('name')) {

      case 'email':
        session_inputs.email = valid_input(expressions.email, input, $('#user_email_error'));
        break;

      case 'password':
        session_inputs.password = valid_input(expressions.password, input, $('#user_pass_error'));
        break;

    }

    $('#login_button').prop('disabled', !(session_inputs.email && session_inputs.password));

  }

  function valid_input (expression, input, error) {

    if (expression.test(input.val())) {
      input.removeClass('input_bad');
      error.removeClass('input_error-active');
      return true;
    }

    input.addClass('input_bad');
    error.addClass('input_error-active');
    return false;

  }

  function evaluate_value (value, min, max, input, error) {
    if (value >= min && value <= max) {
      input.removeClass('input_bad');
      error.removeClass('input_error-active');
      return true;
    }

    input.addClass('input_bad');
    error.addClass('input_error-active');
    return false
  }

  function loading_prompt (response, status, time, exit, loading, session_close) {
    const prompt_response = $('#prompt_response');
    const prompt_loader = $('#prompt_loader');

    prompt_response.text(response);

    if (loading) {

      prompt_loader.addClass('session_footer_spinner-active');

    } else if (session_close) {

      close_session_prompt();

    } else {

      prompt_response.addClass(`session_footer-${status ? 'ok' : 'bad'}`);

      setTimeout(function () {
        prompt_response.removeClass(`session_footer-${status ? 'ok' : 'bad'}`);

        setTimeout(function () {
          prompt_response.text(session.Init ? "Close Session" : session.Admin ? "Admin Session Required" : "Session Required");
          prompt_loader.removeClass('session_footer_spinner-active');
        }, 500);

        if (exit) {
          close_session_prompt();
        }
      }, time);

    }

  }

// Handle Notifications
  let notification_id = 0;
  let notification_timeout = [];
  let notification_hover      = [false, false, false];
  let notification_autoclose  = [false, false, false];

  function handle_notifications() {
    
    const notifications = [$('#notification0'), $('#notification1'), $('#notification2')];
    const notification_close = [$('#notification0_close'), $('#notification1_close'), $('#notification2_close')];

    notification_close.forEach((btn, index) => {
      btn.on('click', function () {
        clearTimeout(notification_timeout);
        notification_hover[index] = false;
        notification_autoclose[index] = false;

        notifications[index].removeClass('notification-active');
        notifications[index].addClass('notification-inactive');
        notifications[index].fadeOut(200);

        reset_notifications();
      });
    });

    notifications.forEach((notif, index) => {
      notif.on('mouseenter', function () {
        notification_hover[index] = true;
      });
    });

    notifications.forEach((notif, index) => {
      notif.on('mouseleave', function () {
        notification_hover[index] = false;

        if (notification_autoclose[index]) {
          notification_autoclose[index] = false;
          notifications[index].removeClass('notification-active');
          notifications[index].addClass('notification-inactive');
          notifications[index].fadeOut(200);

          reset_notifications();
        }
      });
    });

  }

  function show_notification (title, text, icon, icon_color = 'green') {
    let notification_m = notification_id;
    notification_id ++;
    if (notification_id > 2) notification_id = 0;

    const notifications       = [$('#notification0'), $('#notification1'), $('#notification2')];
    const notifications_icon  = [$('#notification0_icon'), $('#notification1_icon'), $('#notification2_icon')];

    switch (icon) {
      case 'Warning':
        notifications_icon[notification_m].html('&#xe002;');
        notifications_icon[notification_m].addClass('notification_yellow');
        notifications_icon[notification_m].removeClass('notification_red');
        notifications_icon[notification_m].removeClass('notification_green');
        break;
      
      case 'Error':
        notifications_icon[notification_m].html('&#xe000;');
        notifications_icon[notification_m].removeClass('notification_yellow');
        notifications_icon[notification_m].addClass('notification_red');
        notifications_icon[notification_m].removeClass('notification_green');
        break;

      case 'OK':
        notifications_icon[notification_m].html('&#xe86c;');
        notifications_icon[notification_m].removeClass('notification_yellow');
        notifications_icon[notification_m].removeClass('notification_red');
        notifications_icon[notification_m].addClass('notification_green');
        break;

      default:
        notifications_icon[notification_m].html(`&#x${icon};`);
        notifications_icon[notification_m].removeClass('notification_yellow');
        notifications_icon[notification_m].removeClass('notification_red');
        notifications_icon[notification_m].removeClass('notification_green');
        notifications_icon[notification_m].addClass(`notification_${icon_color}`);
        break;
    }

    $(`#notification${notification_m}_title`).text(title);
    $(`#notification${notification_m}_text`).text(text);

    notifications[notification_m].fadeIn(500 + (notification_m * 100));
    notifications[notification_m].removeClass('notification-inactive');
    notifications[notification_m].addClass('notification-active');

    clearTimeout(notification_timeout[notification_m]);

    notification_timeout[notification_m] = setTimeout(() => {
      if (!notification_hover[notification_m]) {
        notifications[notification_m].removeClass('notification-active');
        notifications[notification_m].addClass('notification-inactive');
        notifications[notification_m].fadeOut(200);

        reset_notifications();
      } else {
        notification_autoclose[notification_m] = true;
      }
    }, 5000 + (notification_m * 100));
  }

  function reset_notifications () {
    const notifications       = [$('#notification0'), $('#notification1'), $('#notification2')];

    let all_closed = true;
    notifications.forEach((notif, index) => {
      if (notif.hasClass('notification-active')) {
        all_closed = false;
      }
    });
    if (all_closed) {
      notification_id = 0;
    }
  }

// Handle Sync Display
  const SYNC_STATE = {
    NO_SESSION  : 'Waiting session',
    NO_DEVICES  : 'Waiting devices',
    UPDATING    : 'Synchronizing devices',
    NO_SERVER   : 'Server connection closed'
  }

  function set_display (action = 'lock', message = 'Display locked', clean = false) {

    const sync_prompt = $('#prompt_sync');
    const sync_text   = $('#prompt_sync_text');
    const is_hidden   = sync_prompt.is(':hidden');

    sync_text.text(message);

    if (action === 'lock' && is_hidden) {
      sync_prompt.fadeIn(100);
    } else if (action === 'unlock') {
      sync_prompt.fadeOut(100);
    }

    on_set_display(action, clean);

  }

// Time
  function SS_to_HHMMSS (seconds) {
    let hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    let minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    let secondsRest = (seconds % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${secondsRest}`;
  }

  function HHMMSS_to_SS (hours, minutes, seconds) {
    return (hours * 3600) + (minutes * 60) + seconds;
  }

  function HHMMSS_to_String (hours, minutes, seconds) {
    const hrs = hours.toString().padStart(2, '0');
    const min = minutes.toString().padStart(2, '0');
    const sec = seconds.toString().padStart(2, '0');

    return `${hrs}:${min}:${sec}`;
  }

  function String_to_SS (time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return HHMMSS_to_SS(hours, minutes, seconds);
  }

  function get_date (format) {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    // Obteniendo componentes de la hora
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    format = format.replace("%d", day)
                  .replace("%m", month)
                  .replace("%Y", year)
                  .replace("%H", hours)
                  .replace("%M", minutes)
                  .replace("%S", seconds);

    return format;
  }

  function convert_to_timestamp(dateStr, timeStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    return date.getTime() / 1000;
  }

// GUI
  function update_donut (id, value, text = null) {
    const donut = document.getElementById(id);
    const meter = donut.querySelector('.meter');
    const label = donut.querySelector('.percentage');

    const val = Math.max(0, Math.min(100, parseFloat(value)));
    meter.setAttribute('stroke-dasharray', `${val}, 100`);
    label.textContent = text !== null ? text : `${val.toFixed(2)}%`;

    let color = "var(--color-red)";
    if (val >= 75) color = "var(--color-blue)";
    else if (val >= 50) color = "var(--color-green)";
    else if (val >= 25) color = "var(--color-yellow)";

    meter.style.stroke = color;
  }