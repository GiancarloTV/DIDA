let synchronizing = false;
let timeout_id = 0;
const INTERVAL_TIME = 120000;

// SENDER OBJECT
  class Sender {

    constructor () {
      // Device
      this.version      = "0.0.0";
      this.ups          = "0.0.0";
      this.ps           = "0";
      this.architecture = "-";
      this.mac          = "00:00:00:00:00:00";

      // Monitoring
      this.monitoring = false;
      this.min_states = 0;
      this.max_states = 0;
      this.beacon     = 0;

      // General data
      this.machine          = "-";
      this.machine_area     = "-";
      this.machine_desc     = "-";
      this.worker       = 0;
      this.order            = "-";
      this.order_units      = 0;
      this.order_time       = 0;
      this.order_processes  = 0;
      this.part     = "-";
      this.lote     = "-";

      // Disponibility
      this.states   = 0;
      this.codes    = {};

      this.report           = 0;
      this.endprocess_time  = 0;
      this.lunch_time       = 0;
      this.break_time       = 0;
      this.meeting_time     = 0;
      this.training_time    = 0;
      this.max_schedules    = 0;
      this.schedules = {};

      // Network
      this.network = {
        State         : false,
        IP            : "0.0.0.0",
        Mode          : true,
        Autoconnect   : false,
        StaticIP     : "0.0.0.0",
        StaticGW     : "0.0.0.0",
        StaticSN     : "0.0.0.0",
        StaticDNS    : "0.0.0.0"
      };

      // Server
      this.server = {
        State         : false,
        IP            : "0.0.0.0",
        HTTP          : 0,
        TCP           : 0,
        LocalHTTP     : 0,
        LocalTCP      : 0,
        Mode          : true,
        Autoconnect   : false,
        StaticIP     : "0.0.0.0",
        StaticPort   : 0
      };
    }

    update_data (new_data) {
      // Principal Data
      this.version      = new_data.Version;
      this.ups          = new_data.UPS;
      this.ps           = new_data.PS;
      this.architecture = new_data.Architecture;
      this.mac          = new_data.MAC;

      // Monitoring
      this.monitoring = new_data.Monitoring;
      this.min_states = new_data.MinStates;
      this.max_states = new_data.MaxStates;
      this.beacon     = new_data.Beacon;

      // General Data
      this.machine          = new_data.Machine;
      this.machine_area     = new_data.MachineArea;
      this.machine_desc     = new_data.MachineDesc;
      this.worker           = new_data.Worker;
      this.order            = new_data.Order;
      this.order_units      = new_data.OrderUnits;
      this.order_time       = new_data.OrderTime;
      this.order_processes  = new_data.OrderProcesses;
      this.part             = new_data.Part;
      this.lote             = new_data.Lote;

      // Disponibility
      this.states           = new_data.States;
      this.codes            = new_data.Codes;
      this.report           = new_data.ReportTime;
      this.endprocess_time  = new_data.EndProcessTime;
      this.lunch_time       = new_data.LunchTime;
      this.break_time       = new_data.BreakTime;
      this.meeting_time     = new_data.MeetiningTime;
      this.training_time    = new_data.TrainingTime;
      this.schedules        = new_data.Schedules;

      // Network
      this.network = new_data.Network;

      // Server
      this.server = new_data.Server;

      this.update_labels();

    }

    update_labels () {
      // System
      $('#MAC').text(this.mac);
      $('#version').text(this.version);
      $('#ups_version').text(this.ups);
      $('#power_supply').text(this.ps);

      $('#max_states').text(this.max_states);
      $('#min_states').text(this.min_states);
      $('#beacon_inputs').text(this.beacon);
      $('#state_method').text('Beacon & QR Sensor');
      $('#code_method').text('QR Sensor & UART cmd');

      // render_state(this.monitoring);
      $('#max_monitoring').text((this.report / 3600).toFixed(0));
      $('#min_report').text(_10_MIN / 60);
      $('#min_schedules').text(_10_MIN / 60);

      // Production Data
      // $('#machine').text(this.machine);
      // $('#machine_footer').text(this.machine);
      // $('#worker').text(this.worker);
      // $('#part').text(this.part);
      // $('#lote').text(this.lote);
      // $('#states').text(this.states);
      // $('#time_unit').text(to_HHMMSS(this.time_unit));
      // $('#processes_unit').text(this.processes_unit);
      // $('#target').text(this.target);
      
      // // Schedules
      // $('#schedule0').text(HHMMSS_to_String(this.schedules.Schedule0.Value[0], this.schedules.Schedule0.Value[1], this.schedules.Schedule0.Value[2]));
      // $('#schedule0_enable').prop("checked", this.schedules.Schedule0.State);
      // $('#schedule0_enable + .enable_label').text(this.schedules.Schedule0.State ? "Enabled" : "Disabled");
      // $('#schedule0_action').val(this.schedules.Schedule0.Action);

      // $('#schedule1').text(HHMMSS_to_String(this.schedules.Schedule1.Value[0], this.schedules.Schedule1.Value[1], this.schedules.Schedule1.Value[2]));
      // $('#schedule1_enable').prop("checked", this.schedules.Schedule1.State);
      // $('#schedule1_enable + .enable_label').text(this.schedules.Schedule1.State ? "Enabled" : "Disabled");
      // $('#schedule1_action').val(this.schedules.Schedule1.Action);

      // $('#schedule2').text(HHMMSS_to_String(this.schedules.Schedule2.Value[0], this.schedules.Schedule2.Value[1], this.schedules.Schedule2.Value[2]));
      // $('#schedule2_enable').prop("checked", this.schedules.Schedule2.State);
      // $('#schedule2_enable + .enable_label').text(this.schedules.Schedule2.State ? "Enabled" : "Disabled");
      // $('#schedule2_action').val(this.schedules.Schedule2.Action);

      // // Week
      // for (let weekday = 0; weekday < 7; weekday ++ ){
      //   $(`#day_${weekday}`).prop("checked", this.schedules.Week[weekday]);
      // }
      // clean_schedule_on_input();

      // // Times
      // $('#lunch').text(to_HHMMSS(this.lunch_time));
      // $('#break').text(to_HHMMSS(this.break_time));
      // $('#tout').text(to_HHMMSS(this.endprocess_tout));

      // // Codes
      // render_codes_inputs(this.min_states, this.max_states, this.states, this.codes);

      // // Network
      // $('#net_architecture').text(this.architecture);
      // $('#network_state').text(this.network.State ? "Connected" : "Disconnected");
      // $('#network_ip').text(this.network.IP);

      // $('#network_dynamic_ip').prop("checked", this.network.Mode);
      // $('#network_static_ip').prop("checked", !this.network.Mode);

      // render_network_inputs(!this.network.Mode);
      // render_address_inputs("network_ip", address_from_string(this.network.StaticIP));
      // render_address_inputs("network_gw", address_from_string(this.network.StaticGW));
      // render_address_inputs("network_sn", address_from_string(this.network.StaticSN));
      // render_address_inputs("network_dns", address_from_string(this.network.StaticDNS));
      // $("#update_network").prop("disabled", true);

      // // Server
      // $('#server_local_http').text(this.server.LocalHTTP);
      // $('#server_local_tcp').text(this.server.LocalTCP);

      // $('#server_state').text(this.server.State ? "Online" : "Offline");
      render_user_form(this.server.State, session.User, session.Admin);

      // $('#server_ip').text(this.server.IP);
      // $('#server_port_http').text(this.server.HTTP);
      // $('#server_port_tcp').text(this.server.TCP);
      // $('#server_redirect_button').prop("disabled", !this.server.State);

      // $('#server_autoconnect').prop("checked", this.server.Autoconnect);
      // $('#server_dynamic_ip').prop("checked", this.server.Mode);
      // $('#server_static_ip').prop("checked", !this.server.Mode);

      // render_server_inputs(!this.server.Mode);
      // render_address_inputs("server_ip", address_from_string(this.server.StaticIP));
      // $('#server_port').val(this.server.StaticPort);
      // $('#server_port_error').css("opacity", "0");
      // $("#update_server").prop("disabled", true);

      $('#sync_button span').removeClass('main_menu_function_flip');
      $('#prompt_sync').fadeOut();
      console.log("%c[SYS] Synchronized", BLACK);
      synchronizing = false;

    }

  }

// COLORS
  const BLACK = "color:#959595";

// MENU VARS
  const LOGIN       = "Login";
  const DEVICE      = "Device";
  const PRODUCTION  = "Production";
  const SCHEDULES   = "Schedules";
  const CODES       = "Codes";
  const NETWORK     = "Network";
  const SERVER      = "Server";
  let menu_now      = DEVICE;

// Session Prompt
  const USER  = "User";
  const ADMIN = "Admin";
  let session_now = USER;
  let session = {
    Prompt  : false,
    Init    : false,
    User    : false,
    Admin   : false,
    ID      : 0,
    Name    : "User"
  }

  const expressions = {
    email   : /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]/,
    password: /^.{8,15}$/,
    masterkey: /^.{15,20}$/
  }

  const session_inputs = {
    email     : false,
    password  : false,
    masterkey : false
  }

  let width = window.innerWidth;

// Menu windows
  const WINDOWS = {
    SYSTEM      : 'System',
    DEVICE      : 'Device',
    PRODUCTION  : 'Production',
    SCHEDULES   : 'Schedules',
    CODES       : 'Codes',
    NETWORK     : 'Network',
    SERVER      : 'Server',
    ADMIN_MAX   : 7,
    USER_MAX    : 5,
    MIN         : 1
  }

// SYSTEM
  const STATE_METHOD = "Beacon & Scanner";
  const CODE_METHOD = "QR Scanner";

// KPI VARS
  let sender = new Sender();

  const _10_CHARS   = 10;
  const _15_CHARS   = 15;
  const _20_CHARS   = 20;
  const _MAX_INT    = 99999;
  const _10_MIN     = 600;
  const _30_MIN     = 1800;
  const MAX_STATES  = 40;
  const MIN_STATES  = 8;

// Main
  $(document).ready(async function() {
    handle_theme();
    handle_resize();

    handle_menu();
    handle_session();

    handle_events();

    // form_update_data();
    // form_update_schedules();
    // form_update_times();
    // form_update_network();
    // form_update_server();

    synchronize_data();
    // start_timer();
  });

// Handle body
  function handle_theme () {

    if (localStorage.getItem("theme") === "light") {
      $("body").addClass("light-mode-variables");
      $("#theme-toggler").attr("title", "Toggle To Light Mode");
      $(".main_menu_function_theme_light").css("width", "100%");
      $(".main_menu_function_theme_dark").css("width", "0%");
    }

    $("#theme-toggler").on("click", function() {
      $("body").toggleClass("light-mode-variables");

      let light_mode = $("body").hasClass("light-mode-variables");

      localStorage.setItem("theme", light_mode ? "light" : "dark");
      $("#theme-toggler").attr("title", light_mode ? "Toggle To Dark Mode" : "Toggle To Light Mode");
      $(".main_menu_function_theme_light").css("width", light_mode ? "100%" : "0%");
      $(".main_menu_function_theme_dark").css("width", light_mode ? "0%" : "100%");

    });

  }

  function handle_resize () {
    window.addEventListener("resize", function() {
      let new_width = this.window.innerWidth;

      if (new_width > 800 && $('#menu_block').hasClass('main_menu-hover')) {
        $('.main_menu').removeClass('main_menu-hover')
        $('.main_menu span').removeAttr('style');
        $('.main_menu p').removeAttr('style');
      }

      width = window.innerWidth;
    });
  }

  function handle_menu () {

    const menu_block = $('#menu_block');
    const menu_button = $('#menu_button');

    const main_menu = $('#main_menu li');

    const window_system     = $('#window_system');
    const window_device     = $('#window_device');
    const window_production = $('#window_production');
    const window_schedules  = $('#window_schedules');
    const window_codes      = $('#window_codes');
    const window_network    = $('#window_network');
    const window_server     = $('#window_server');
    
    main_menu.on('click', function () {

      const window = $(this).find('p').text();
      const active = $(this).hasClass('main_menu_window-active');
      const disabled = $(this).hasClass('main_menu_window-disabled')

      if (!disabled && !active) {
        main_menu.removeClass('main_menu_window-active');
        $(this).addClass('main_menu_window-active')

        window_system.removeClass('main_data_window-active');
        window_device.removeClass('main_data_window-active');
        window_production.removeClass('main_data_window-active');
        window_schedules.removeClass('main_data_window-active');
        window_codes.removeClass('main_data_window-active');
        window_network.removeClass('main_data_window-active');
        window_server.removeClass('main_data_window-active');

        if (width <= 800 && menu_block.hasClass('main_menu-hover')) {

          menu_block.removeClass('main_menu-hover');
          $('.main_menu span').removeAttr('style');
          $('.main_menu p').removeAttr('style');
  
        }

        switch (window) {
  
          case WINDOWS.SYSTEM:
            window_system.addClass('main_data_window-active');
            break;
  
          case WINDOWS.DEVICE:
            window_device.addClass('main_data_window-active');
            break;
  
          case WINDOWS.PRODUCTION:
            window_production.addClass('main_data_window-active');
            break;
  
          case WINDOWS.SCHEDULES:
            window_schedules.addClass('main_data_window-active');
            break;
  
          case WINDOWS.CODES:
            window_codes.addClass('main_data_window-active');
            break;
  
          case WINDOWS.NETWORK:
            window_network.addClass('main_data_window-active');
            break;
  
          case WINDOWS.SERVER:
            window_server.addClass('main_data_window-active');
            break;
  
        }

      }

    });

    menu_button.on('click', function () {

      if (width <= 800 && !menu_block.hasClass('main_menu-hover')) {

        menu_block.addClass('main_menu-hover')
        $('.main_menu span').css('width', '25%');
        $('.main_menu p').css('width', '70%');

      } else if (menu_block.hasClass('main_menu-hover')) {

        menu_block.removeClass('main_menu-hover');
        $('.main_menu span').removeAttr('style');
        $('.main_menu p').removeAttr('style');

      }

    });

    $(document).on('click touchstart', function (event) {
      if (!$(event.target).closest('.main_menu').length) {
        if (width <= 800 && menu_block.hasClass('main_menu-hover')) {

          menu_block.removeClass('main_menu-hover');
          $('.main_menu span').removeAttr('style');
          $('.main_menu p').removeAttr('style');
  
        }
      }
    });

  }




  function construct_time_input (div_target, id_target) {
    let select_list = `<select id="${id_target}_hour_in" required><option value="" disabled selected>HH</option>`;
    for (let value = 0; value < 24; value ++) {
      let hour = value < 10 ? '0' + value : value;
      select_list += '<option value="' + value + '">' + hour + '</option>';
    }
    select_list += '</select>';

    select_list += `<select id="${id_target}_min_in" required><option value="" disabled selected>MM</option>`;
    for (let value = 0; value < 60; value ++) {
      let hour = value < 10 ? '0' + value : value;
      select_list += '<option value="' + value + '">' + hour + '</option>';
    }
    select_list += '</select>';

    select_list += `<select id="${id_target}_sec_in" required><option value="" disabled selected>SS</option>`;
    for (let value = 0; value < 60; value ++) {
      let hour = value < 10 ? '0' + value : value;
      select_list += '<option value="' + value + '">' + hour + '</option>';
    }
    select_list += `</select> <button id="${id_target}_reset_time" title="Clean all fields">Reset</button>`;
    $(div_target).html(select_list);

    $(`#${id_target}_reset_time`).click(function(){
      $(`#${id_target}_hour_in`).val("");
      $(`#${id_target}_min_in`).val("");
      $(`#${id_target}_sec_in`).val("");
      $(`#${id_target}_enable`).prop("checked", id_target == "schedule0" ? sender.schedules.Schedule0.State : (id_target == "schedule1" ? sender.schedules.Schedule1.State : sender.schedules.Schedule2.State));
      $(`#${id_target}_action`).val(id_target == "schedule0" ? sender.schedules.Schedule0.Action : (id_target == "schedule1" ? sender.schedules.Schedule1.Action : sender.schedules.Schedule2.Action));

      if (id_target == "time_unit") {
        verify_data_on_input();
      } else if (id_target == "schedule0" || id_target == "schedule1" || id_target == "schedule2") {
        verify_schedule_on_input();
      } else if (id_target == "lunch" || id_target == "break" || id_target == "tout") {
        verify_times_on_input();
      }
    });
  }

// Handle session
  function handle_session () {
    // open_session_prompt();

    $('#open_session_prompt').click(function () {
      open_session_prompt();
    });
    $('#form_user').on('submit', send_user_form);

    $("#close_session_prompt").click(function () {
      close_session_prompt();
    });
    $('#form_admin').on('submit', send_admin_form);
  }

  function open_session_prompt () {
    session_now = session.Init && session.Admin ? ADMIN : (sender.server.State ? USER : ADMIN);

    const nav_user = $('#nav_user');
    const nav_admin = $('#nav_admin');

    $('.session_main_form_input').css('opacity', session.Init ? '0.5' : '1');

    if (session_now === USER) {
      open_user_form();
    } else {
      open_admin_form();
    }

    nav_user.on("click", open_user_form);
    nav_admin.on("click", open_admin_form);

    $("#session_prompt").fadeIn(250);
  }

  function close_session_prompt () {
    $("#session_prompt").fadeOut(250);

    close_user_form();
    close_admin_form();

    $('#open_session_prompt').prop("title", session.Init ? "Log out" : "Log in");
    if (session.Init) {
      $('#open_session_prompt span').addClass("main_menu_session-logout");
    } else {
      $('#open_session_prompt span').removeClass("main_menu_session-logout");
    }
    $('#open_session_prompt p').text(session.Init ? session.Name : "Log in");


    if (session.Init) {

      let session_type = session.Admin ? WINDOWS.ADMIN_MAX : WINDOWS.USER_MAX;
      for (let li = 1; li < session_type; li ++) {
        $('#main_menu li').eq(li).removeClass('main_menu_window-disabled');
      }

    } else if (!session.Init) {

      $('#main_menu li').eq(0).addClass('main_menu_window-active');
      for (let li = 1; li < WINDOWS.ADMIN_MAX; li ++) {
        const menu_window = $('#main_menu li').eq(li);
        menu_window.removeClass('main_menu_window-active');
        menu_window.addClass('main_menu_window-disabled');
      }

      $('#window_system').addClass('main_data_window-active');
      $('#window_device').removeClass('main_data_window-active');
      $('#window_production').removeClass('main_data_window-active');
      $('#window_schedules').removeClass('main_data_window-active');
      $('#window_codes').removeClass('main_data_window-active');
      $('#window_network').removeClass('main_data_window-active');
      $('#window_server').removeClass('main_data_window-active');

    }

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
          prompt_response.text(session.Init ? "Close Session" : "Session Required");
          prompt_loader.removeClass('session_footer_spinner-active');
        }, 500);

        if (exit) {
          close_session_prompt();
        }
      }, time);

    }

  }

  function print_message (tittle, message, time) {
    const prompt_print    = $("#prompt_print");
    const prompt_tittle   = $('#print_tittle');
    const prompt_message  = $('#print_message');

    prompt_tittle.text(tittle);
    prompt_message.text(message);
    
    prompt_print.fadeIn();

    setTimeout(function () {
      prompt_print.fadeOut();
    }, time);
  }

// Sync button
  function handle_events () {
    $('#sync_button').on("click", function () {
      if (!synchronizing) {
        synchronizing = true;
        reset_timer();
        synchronize_data();
      }
    });
  
    $('.main_menu_function_state').mouseenter(function () {
      if (!$('#menu_block').hasClass('main_menu-hover')) {
        $('#prompt_state').fadeIn();
      }
    });
  
    $('.main_menu_function_state').mouseleave(function () {
      $('#prompt_state').fadeOut();
    });
  
    $('.main_menu_function_state').on('touchstart', function (event) {
      event.preventDefault();
      if (!$('#menu_block').hasClass('main_menu-hover')) {
        $('#prompt_state').fadeIn();
      }
    });
  
    $(document).on('click touchstart', function (event) {
      if (!$(event.target).closest('.main_menu_function_state').length) {
        $('#prompt_state').fadeOut();
      }
    });
  }

  function render_state (status) {
    const monitoring_content = $('.menu_header_state');
    const monitoring_label = $('.menu_header_state p');
    const monitoring_block = $('.prompt_state_content p');

    monitoring_label.css("opacity", "0");
    monitoring_block.css("opacity", "0");

    monitoring_content.css("color", status ? "var(--text-color-ok)" : "var(--text-color-bad)");
    
    setTimeout(function () {
      monitoring_label.text(status ? "Monitoring" : "Setting");
      monitoring_block.text(`Sender is ${status ? "monitoring" : "setting"}, you ${status ? "can't" : "can"} modify any item.`);

      monitoring_label.css("opacity", "1");
      monitoring_block.css("opacity", "1");
    }, 500);
  }

  function show_state (timeout) {
    $('#prompt_state').fadeIn();
    setTimeout (function () {
      $('#prompt_state').fadeOut();
    }, timeout);
  }

  //! USER PROMPT
  function render_user_form (server_state, user_session, admin_session) {
    $('#prompt_message').text(server_state ? "Server connected" : "Server disconnected");
    $('#prompt_message').css("color", server_state ? "var(--text-color-ok)" : "var(--text-color-bad)");
    if (session_now === USER) {
      open_user_form();
    }
  }

  function open_user_form () {
    close_admin_form();
    session_now = USER;

    const nav_user = $('#nav_user');
    const form_user = $('#form_user');
    const form_inputs = $('#form_user input');
    const button_user = $('#login_button');

    nav_user.addClass('session_main_nav_option-active');
    form_user.addClass('session_main_form-active');

    button_user.prop('disabled', !session.User || session.Admin || !sender.server.State);
    button_user.text(session.Init ? "Log out" : "Log in");

    form_inputs.each(function() {
      if (!session.Init && sender.server.State) {
        $(this).prop("disabled", false);
        $(this).on('input', verify_session_form);
        $(this).on('change', verify_session_form);
        $(this).removeAttr('style');
      } else {
        $(this).css('opacity', '0.5');
        $(this).prop("disabled", true);
      }
    });

  }

  function send_user_form (e) {
    
    e.preventDefault();

    $('#login_button').prop('disabled', true);

    if (!session.Init && !session.User) {
      loading_prompt("", false, 0, false, true, false);

      let data = {
        User      : $('#user_email').val(),
        Password  : $('#user_pass').val()
      }
  
      fetch (`/login`, {
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
        if (data.State) {
          session.Init = true;
          session.User = true;
          session.ID = data.ID;
          session.Name = data.Name;
          loading_prompt("Accepted", true, 1000, true, false, false);
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
      session.User = false;
      loading_prompt("Session Required", false, 0, false, false, true);

    }

  }

  function close_user_form () {

    const nav_user = $('#nav_user');
    const form_user = $('#form_user');
    const form_inputs = $('#form_user input');
    const button_user = $('#login_button');

    nav_user.removeClass('session_main_nav_option-active');
    form_user.removeClass('session_main_form-active');
    form_user[0].reset();
    $('#user_email_error').removeClass('input_error-active');
    $('#user_pass_error').removeClass('input_error-active');
    button_user.prop('disabled', true);

    form_inputs.each(function() {
      $(this).off('input', verify_session_form);
      $(this).off('change', verify_session_form);
      $(this).removeClass('input_bad')
    });

    session_inputs.email = false;
    session_inputs.password = false;

  }

  //! ADMIN PROMPT
  function open_admin_form () {
    close_user_form();
    session_now = ADMIN;

    const nav_admin = $('#nav_admin');
    const form_admin = $('#form_admin');
    const form_inputs = $('#form_admin input');
    const button_admin = $('#access_button');

    nav_admin.addClass('session_main_nav_option-active');
    form_admin.addClass('session_main_form-active');

    button_admin.prop('disabled', session.User || !session.Admin);
    button_admin.text(session.Init && session.Admin ? "Log out" : "Log in");

    form_inputs.each(function() {
      if (!session.Init) {
        $(this).prop("disabled", false);
        $(this).on('input', verify_session_form);
        $(this).on('change', verify_session_form);
      } else {
        $(this).prop("disabled", true);
      }
    });

  }

  function send_admin_form (e) {

    e.preventDefault();

    $('#access_button').prop('disabled', true);

    if (!session.Init && !session.Admin) {
      loading_prompt("", false, 0, false, true, false);

      let data = {
        User      : 'Admin',
        Password  : $('#admin_pass').val()
      }
  
      fetch (`/admin`, {
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
        if (data.State) {
          session.Init = true;
          session.Admin = true;
          session.ID = 0;
          session.Name = 'Admin';
          loading_prompt("Accepted", true, 1000, true, false, false);
        } else {
          loading_prompt("Declined", false, 2000, false, false, false);
          setTimeout(function () {
            $('#access_button').prop('disabled', false);
          }, 2700);
        }
      })
      .catch (error => {
        loading_prompt('Server offline', false, 5000, false, false, false);
        setTimeout(function () {
          $('#access_button').prop('disabled', false);
        }, 5700);
      });

    } else {

      session.Init = false;
      session.Admin = false;
      loading_prompt("Session Required", false, 0, false, false, true);

    }

  }

  function close_admin_form () {

    const nav_admin = $('#nav_admin');
    const form_admin = $('#form_admin');
    const form_inputs = $('#form_admin input');
    const button_admin = $('#access_button');

    nav_admin.removeClass('session_main_nav_option-active');
    form_admin.removeClass('session_main_form-active');
    form_admin[0].reset();
    $('#admin_pass_error').removeClass('input_error-active');
    button_admin.prop('disabled', true);

    form_inputs.each(function() {
      $(this).off('input', verify_session_form);
      $(this).off('change', verify_session_form);
      $(this).removeClass('input_bad')
    });

    session_inputs.masterkey = false;

  }

  //! VERIFY SESSION INPUTS
  function verify_session_form (e) {
    const input = $(this);

    switch (input.attr('name')) {

      case 'email':
        session_inputs.email = valid_session_input(expressions.email, input, $('#user_email_error'));
        break;

      case 'password':
        session_inputs.password = valid_session_input(expressions.password, input, $('#user_pass_error'));
        break;

      case 'masterkey':
        session_inputs.masterkey = valid_session_input(expressions.masterkey, input, $('#admin_pass_error'));
        break;

    }

    $('#login_button').prop('disabled', !(session_inputs.email && session_inputs.password));
    $('#access_button').prop('disabled', !session_inputs.masterkey);

  }

  function valid_session_input (expression, input, error) {

    if (expression.test(input.val())) {
      input.removeClass('input_bad');
      error.removeClass('input_error-active');
      return true;
    }

    input.addClass('input_bad');
    error.addClass('input_error-active');
    return false;

  }

// RECEIVE DATA
  function synchronize_data () {
    $('#sync_button span').addClass('main_menu_function_flip');

    if (!$('#menu_block').hasClass('main_menu-hover')) {
      $('#prompt_sync').fadeIn();
    }

    console.log("%c[SYS] Synchronizing", BLACK);

    setTimeout(function() {
      download_data();
    }, 1500)
  }

  function download_data () {
    fetch ('/sender/HTTPData', {
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
      console.log("%c[SYS] Data Downloaded: %o", BLACK, data_downloaded);
      sender.update_data(data_downloaded);
    })
    .catch (error => {
      $('#sync_button span').removeClass('main_menu_function_flip');
      $('#prompt_sync').fadeOut();
      print_message("Synchronize Data", error.message, 5000);
    });
  }

  function start_timer () {
    clearInterval(timeout_id);
    timeout_id = setInterval(synchronize_data, INTERVAL_TIME);
  }

  function reset_timer () {
    start_timer();
  }

// SEND DATA

  function form_update_data () {
    construct_time_input(".data_production_input_new_time", "time_unit");
    $('[window="data"] input').on('input', verify_data_on_input);
    $('#time_unit_hour_in, #time_unit_min_in, #time_unit_sec_in').on('change', verify_data_on_input);

    const update_data_button = $('#update_data');

    update_data_button.mouseenter(function () {
      if (sender.monitoring) {
        show_state(3000);
      }
    });

    update_data_button.click(function () {
      update_data_button.prop("disabled", true);
      reset_timer();

      let data = {};
      data.User = session.ID;

      const machine = $('#machine_in');
      const worker  = $('#worker_in');
      const part    = $("#part_in");
      const lote    = $("#lote_in");
      const states  = $("#states_in");
      const time_unit  = [$('#time_unit_hour_in'), $('#time_unit_min_in'), $('#time_unit_sec_in')];
      const processes_unit  = $("#processes_unit_in");
      const target  = $("#target_in");

      if (machine.val()) {
        data.Machine = machine.val();
      }

      if (worker.val()) {
        data.Worker = parseInt(worker.val(), 10);
      }

      if (part.val()) {
        data.Part = part.val();
      }

      if (lote.val()) {
        data.Lote = lote.val();
      }

      if (states.val()) {
        data.States = parseInt(states.val(), 10);
      }

      if (time_unit[0].val() && time_unit[1].val() && time_unit[2].val()) {
        data.TimeUnit = to_seconds(parseInt(time_unit[0].val(), 10), parseInt(time_unit[1].val(), 10), parseInt(time_unit[2].val(), 10));
      }

      if (processes_unit.val()) {
        data.ProcessesUnit = parseInt(processes_unit.val(), 10);
      }

      if (target.val()) {
        data.Target = parseInt(target.val(), 10);
      }

      fetch ('/sender/UpdateData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then (response => {
        if (response.ok) {
          machine.val("");
          worker.val("");
          part.val("");
          lote.val("");
          states.val("");
          time_unit.forEach(element => {
            element.val("");
          });
          processes_unit.val("");
          target.val("");

          synchronize_data();
          print_message("Update Data", "Sender has received data succesfully", 2000);
        } else {
          print_message("Update Data", "Sender has not received data: " + response.statusText, 3500);
          update_data_button.prop("disabled", false);
        }
      })
      .catch (error => {
        print_message("Update Data", error.message, 5000);
        update_data_button.prop("disabled", false);
      });

    });
  }

  function form_update_schedules () {
    construct_time_input(".data_schedules0", "schedule0");
    construct_time_input(".data_schedules1", "schedule1");
    construct_time_input(".data_schedules2", "schedule2");

    $('#schedule0_hour_in, #schedule0_min_in, #schedule0_sec_in, #schedule0_enable, #schedule0_action').on('change', verify_schedule_on_input);
    $('#schedule1_hour_in, #schedule1_min_in, #schedule1_sec_in, #schedule1_enable, #schedule1_action').on('change', verify_schedule_on_input);
    $('#schedule2_hour_in, #schedule2_min_in, #schedule2_sec_in, #schedule2_enable, #schedule2_action').on('change', verify_schedule_on_input);
    $('#day_0, #day_1, #day_2, #day_3, #day_4, #day_5, #day_6').on('change', verify_schedule_on_input);

    const update_schedules_button = $('#update_schedules');

    update_schedules_button.mouseenter(function () {
      if (sender.monitoring) {
        show_state(3000);
      }
    });

    update_schedules_button.click(function () {
      update_schedules_button.prop("disabled", true);
      reset_timer();

      let data = {};
      data.User = session.ID;

      const schedule0_enable = $('#schedule0_enable').prop("checked");
      const schedule0_action = $('#schedule0_action');
      const schedule0_time = [$('#schedule0_hour_in'), $('#schedule0_min_in'), $('#schedule0_sec_in')];

      verify_schedule_on_send(data, sender.schedules.Schedule0, 0, schedule0_enable, schedule0_action, schedule0_time);

      const schedule1_enable = $('#schedule1_enable').prop("checked");
      const schedule1_action = $('#schedule1_action');
      const schedule1_time = [$('#schedule1_hour_in'), $('#schedule1_min_in'), $('#schedule1_sec_in')];

      verify_schedule_on_send(data, sender.schedules.Schedule1, 1, schedule1_enable, schedule1_action, schedule1_time);

      const schedule2_enable = $('#schedule2_enable').prop("checked");
      const schedule2_action = $('#schedule2_action');
      const schedule2_time = [$('#schedule2_hour_in'), $('#schedule2_min_in'), $('#schedule2_sec_in')];

      verify_schedule_on_send(data, sender.schedules.Schedule2, 2, schedule2_enable, schedule2_action, schedule2_time);

      const schedule_week = [$('#day_0'), $('#day_1'), $('#day_2'), $('#day_3'), $('#day_4'), $('#day_5'), $('#day_6')];
      verify_week_on_send(data, schedule_week);

      fetch ('/sender/UpdateSchedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then (response => {
        if (response.ok) {
          schedule0_time.forEach(element => {
            element.val("");
          });
          schedule1_time.forEach(element => {
            element.val("");
          });
          schedule2_time.forEach(element => {
            element.val("");
          });

          synchronize_data();
          print_message("Update Schedules", "Sender has received data succesfully", 2000);
        } else {
          print_message("Update Schedules", "Sender has not received data: " + response.statusText, 3500);
          update_schedules_button.prop("disabled", false);
        }
      })
      .catch (error => {
        print_message("Update Schedules", error.message, 5000);
        update_schedules_button.prop("disabled", false);
      });

    });
  }

  function form_update_times () {
    construct_time_input(".data_lunch", "lunch");
    construct_time_input(".data_break", "break");
    construct_time_input(".data_tout", "tout");

    $('#lunch_hour_in, #lunch_min_in, #lunch_sec_in').on('change', verify_times_on_input);
    $('#break_hour_in, #break_min_in, #break_sec_in').on('change', verify_times_on_input);
    $('#tout_hour_in, #tout_min_in, #tout_sec_in').on('change', verify_times_on_input);

    const update_times_button = $('#update_times');

    update_times_button.mouseenter(function () {
      if (sender.monitoring) {
        show_state(3000);
      }
    });

    update_times_button.click(function () {
      update_times_button.prop("disabled", true);
      reset_timer();

      let data = {};
      data.User = session.ID;

      let lunch = verify_times_on_send(data, "lunch", "Lunch");
      let _break = verify_times_on_send(data, "break", "Break");
      let process_tout =verify_times_on_send(data, "tout", "ProcessTout");

      fetch ('/sender/UpdateData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then (response => {
        if (response.ok) {
          lunch.forEach(element => {
            element.val("");
          });
          _break.forEach(element => {
            element.val("");
          });
          process_tout.forEach(element => {
            element.val("");
          });

          synchronize_data();
          print_message("Update Times", "Sender has received data succesfully", 2000);
        } else {
          print_message("Update Times", "Sender has not received data: " + response.statusText, 3500);
          update_times_button.prop("disabled", false);
        }
      })
      .catch (error => {
        print_message("Update Times", error.message, 5000);
        update_times_button.prop("disabled", false);
      });
    });
  }

  function form_update_codes () {
    for (let code = sender.min_states; code < sender.states; code ++) {
      const key = `D${code.toString().padStart(2, '0')}`;
      $(`#code_${key}`).on('input', verify_codes_on_input);
    }

    const update_codes_button = $('#update_codes');

    update_codes_button.mouseenter(function () {
      if (sender.monitoring) {
        show_state(3000);
      }
    });

    update_codes_button.off('click');

    update_codes_button.click(function () {
      update_codes_button.prop("disabled", true);
      reset_timer();

      let data = {};
      data.User = session.ID;
      let codes = {};

      for (let code = 0; code < sender.states; code ++) {

        const key = `D${code.toString().padStart(2, '0')}`;

        if (code < sender.min_states) {
          codes[key] = sender.codes[key];
        } else {
          codes[key] = $(`#code_${key}`).text();
        }

      }

      data.Codes = codes;

      fetch ('/sender/UpdateCodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then (response => {
        if (response.ok) {
          synchronize_data();
          print_message("Update Codes", "Sender has received data succesfully", 2000);
        } else {
          print_message("Update Codes", "Sender has not received data: " + response.statusText, 3500);
          update_codes_button.prop("disabled", false);
        }
      })
      .catch (error => {
        print_message("Update Codes", error.message, 5000);
        update_codes_button.prop("disabled", false);
      });

    });
  }

  function form_update_network () {
    const network_dynamic_checkbox = $('#network_dynamic_ip');
    const network_static_checkbox = $('#network_static_ip');
    const update_network_button = $('#update_network');

    network_dynamic_checkbox.on('change', function () {

      const state = $(this).prop("checked");
      network_static_checkbox.prop("checked", !state);
      render_network_inputs(!state);

      update_network_button.prop("disabled", !(state != sender.network.Mode) || sender.monitoring);

      if (state) {
        render_address_inputs("network_ip", address_from_string(sender.network.StaticIP));
        render_address_inputs("network_gw", address_from_string(sender.network.StaticGW));
        render_address_inputs("network_sn", address_from_string(sender.network.StaticSN));
        render_address_inputs("network_dns", address_from_string(sender.network.StaticDNS));
      }

    });

    network_static_checkbox.on('change', function () {

      const state = $(this).prop("checked");
      network_dynamic_checkbox.prop("checked", !state);
      render_network_inputs(state);

      update_network_button.prop("disabled", !(state != !sender.network.Mode) || sender.monitoring);

      if (!state) {
        render_address_inputs("network_ip", address_from_string(sender.network.StaticIP));
        render_address_inputs("network_gw", address_from_string(sender.network.StaticGW));
        render_address_inputs("network_sn", address_from_string(sender.network.StaticSN));
        render_address_inputs("network_dns", address_from_string(sender.network.StaticDNS));
      }

    });

    $('#network_ip_oct0, #network_ip_oct1, #network_ip_oct2, #network_ip_oct3').on('input', verify_network_on_inputs);
    $('#network_sn_oct0, #network_sn_oct1, #network_sn_oct2, #network_sn_oct3').on('input', verify_network_on_inputs);
    $('#network_gw_oct0, #network_gw_oct1, #network_gw_oct2, #network_gw_oct3').on('input', verify_network_on_inputs);
    $('#network_dns_oct0, #network_dns_oct1, #network_dns_oct2, #network_dns_oct3').on('input', verify_network_on_inputs);

    update_network_button.mouseenter(function () {
      if (sender.monitoring) {
        show_state(3000);
      }
    });

    update_network_button.click(function () {
      update_network_button.prop("disabled", true);
      reset_timer();

      let data = {};

      data.Mode = network_dynamic_checkbox.prop("checked");

      if (!data.Mode) {
        data.StaticIP = `${$(`#network_ip_oct0`).val()}.${$(`#network_ip_oct1`).val()}.${$(`#network_ip_oct2`).val()}.${$(`#network_ip_oct3`).val()}`;
        data.StaticSN = `${$(`#network_sn_oct0`).val()}.${$(`#network_sn_oct1`).val()}.${$(`#network_sn_oct2`).val()}.${$(`#network_sn_oct3`).val()}`;
        data.StaticGW = `${$(`#network_gw_oct0`).val()}.${$(`#network_gw_oct1`).val()}.${$(`#network_gw_oct2`).val()}.${$(`#network_gw_oct3`).val()}`;
        data.StaticDNS = `${$(`#network_dns_oct0`).val()}.${$(`#network_dns_oct1`).val()}.${$(`#network_dns_oct2`).val()}.${$(`#network_dns_oct3`).val()}`;
      }

      fetch ('/sender/UpdateNetwork', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then (response => {
        if (response.ok) {
          synchronize_data();
          print_message("Update Network", "Sender has received data succesfully", 2000);
        } else {
          print_message("Update Network", "Sender has not received data: " + response.statusText, 3500);
          update_network_button.prop("disabled", false);
        }
      })
      .catch (error => {
        print_message("Update Network", error.message, 5000);
        update_network_button.prop("disabled", false);
      });

    });
  }

  function form_update_server () {
    const server_autoconnect_checkbox = $('#server_autoconnect');

    const server_dynamic_checkbox = $('#server_dynamic_ip');
    const server_static_checkbox = $('#server_static_ip');
    const update_server_button = $("#update_server");

    server_autoconnect_checkbox.on('change', verify_server_on_inputs);

    server_dynamic_checkbox.on('change', function () {

      const state = $(this).prop("checked");
      server_static_checkbox.prop("checked", !state);
      render_server_inputs(!state);

      // update_server_button.prop("disabled", !(state != sender.server.Mode) || sender.monitoring || server_autoconnect_checkbox.prop("checked") != sender.server.Autoconnect);
      update_server_button.prop("disabled", sender.monitoring || !(state != sender.server.Mode || server_autoconnect_checkbox.prop("checked") != sender.server.Autoconnect));

      if (state) {
        render_address_inputs("server_ip", address_from_string(sender.server.StaticIP));
        $('#server_port').val(sender.server.StaticPort);
        $('#server_port_error').css("opacity", "0");
      }

    });

    server_static_checkbox.on('change', function () {

      const state = $(this).prop("checked");
      server_dynamic_checkbox.prop("checked", !state);
      render_server_inputs(state);

      // update_server_button.prop("disabled", !(state != !sender.server.Mode) || sender.monitoring || server_autoconnect_checkbox.prop("checked") != sender.server.Autoconnect);
      update_server_button.prop("disabled", sender.monitoring || !(state != !sender.server.Mode || server_autoconnect_checkbox.prop("checked") != sender.server.Autoconnect));

      if (!state) {
        render_address_inputs("server_ip", address_from_string(sender.server.StaticIP));
        $('#server_port').val(sender.server.StaticPort);
        $('#server_port_error').css("opacity", "0");
      }
    });

    $('#server_ip_oct0, #server_ip_oct1, #server_ip_oct2, #server_ip_oct3, #server_port').on('input', verify_server_on_inputs);

    update_server_button.mouseenter(function () {
      if (sender.monitoring) {
        show_state(3000);
      }
    });

    update_server_button.click(function () {
      update_server_button.prop("disabled", true);
      reset_timer();

      let data = {};
      data.Mode = server_dynamic_checkbox.prop("checked");
      data.Autoconnect = server_autoconnect_checkbox.prop("checked");

      if (!data.Mode) {
        data.StaticIP = `${$(`#server_ip_oct0`).val()}.${$(`#server_ip_oct1`).val()}.${$(`#server_ip_oct2`).val()}.${$(`#server_ip_oct3`).val()}`;
        data.StaticPort = $('#server_port').val();
      }

      fetch ('/sender/UpdateServer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then (response => {
        if (response.ok) {
          synchronize_data();
          print_message("Update Server", "Sender has received data succesfully", 2000);
        } else {
          print_message("Update Server", "Sender has not received data: " + response.statusText, 3500);
          update_server_button.prop("disabled", false);
        }
      })
      .catch (error => {
        print_message("Update Server", error.message, 5000);
        update_server_button.prop("disabled", false);
      });

    });

    const server_redirect_button = $('#server_redirect_button');
    server_redirect_button.click(function () {
      window.open(`http://${sender.server.IP}:${sender.server.HTTP}/`, '_blank');
    })
  }

// VERIFY INPUTS

  function verify_data_on_input () {
    let every_valid = true;
    let value_new = false;

    const small_display = width < 1000; 

    const machine = $('#machine_in');
    const machine_error = $('#machine_in_error');
    if (machine.val()) {

      const machine_value = machine.val();
      const max_reached = machine_value.length > _10_CHARS;
      const char_invalid = check_chars_invalid(machine_value);

      if (max_reached || char_invalid) {
        
        machine.css("width", small_display ? "55%" : "70%");
        machine_error.text(char_invalid ? "Character invalid" : "Max length reached");
        machine_error.css("width", small_display ? "45%" : "30%");
        every_valid = false

      } else {
        machine.css("width", "70%");
        machine_error.css("width", "0%");

        if (machine_value !== sender.machine) {
          value_new = true;
        }
      }
    } else {
      machine.css("width", "70%");
      machine_error.css("width", "0%");
    }

    const worker = $('#worker_in');
    const worker_error = $('#worker_in_error');
    if (worker.val()) {

      const worker_value = parseInt(worker.val(), 10);
      const max_reached = worker_value > _MAX_INT;

      if (max_reached || worker_value === 0) {
        
        worker.css("width", small_display ? "55%" : "70%");
        worker_error.text(!max_reached ? "Value invalid" : "Max value reached");
        worker_error.css("width", small_display ? "45%" : "30%");
        every_valid = false

      } else {
        worker.css("width", "70%");
        worker_error.css("width", "0%");

        if (worker_value !== sender.worker) {
          value_new = true;
        }
      }
    } else {
      worker.css("width", "70%");
      worker_error.css("width", "0%");
    }

    const part = $('#part_in');
    const part_error = $('#part_in_error');
    if (part.val()) {

      const part_value = part.val();
      const max_reached = part_value.length > _20_CHARS;
      const char_invalid = check_chars_invalid(part_value);

      if (max_reached || char_invalid) {
        
        part.css("width", small_display ? "55%" : "70%");
        part_error.text(char_invalid ? "Character invalid" : "Max length reached");
        part_error.css("width", small_display ? "45%" : "30%");
        every_valid = false

      } else {
        part.css("width", "70%");
        part_error.css("width", "0%");

        if (part_value != sender.part) {
          value_new = true;
        }
      }
    } else {
      part.css("width", "70%");
      part_error.css("width", "0%");
    }

    const lote = $('#lote_in');
    const lote_error = $('#lote_in_error');
    if (lote.val()) {

      const lote_value = lote.val();
      const max_reached = lote_value.length > _20_CHARS;
      const char_invalid = check_chars_invalid(lote_value);

      if (max_reached || char_invalid) {
        
        lote.css("width", small_display ? "55%" : "70%");
        lote_error.text(char_invalid ? "Character invalid" : "Max length reached");
        lote_error.css("width", small_display ? "45%" : "30%");
        every_valid = false

      } else {
        lote.css("width", "70%");
        lote_error.css("width", "0%");

        if (lote_value != sender.lote) {
          value_new = true;
        }
      }
    } else {
      lote.css("width", "70%");
      lote_error.css("width", "0%");
    }

    const states = $('#states_in');
    const states_error = $('#states_in_error');
    if (states.val()) {

      const states_value = parseInt(states.val(), 10);
      const max_reached = states_value > MAX_STATES;
      const min_reached = states_value < MIN_STATES;

      if (max_reached || min_reached) {
        
        states.css("width", small_display ? "55%" : "70%");
        states_error.text(!max_reached ? "Min value reached" : "Max value reached");
        states_error.css("width", small_display ? "45%" : "30%");
        every_valid = false

      } else {
        states.css("width", "70%");
        states_error.css("width", "0%");

        if (states_value !== sender.states) {
          value_new = true;
        }
      }
    } else {
      states.css("width", "70%");
      states_error.css("width", "0%");
    }

    const time_unit = [$('#time_unit_hour_in'), $('#time_unit_min_in'), $('#time_unit_sec_in')];
    const time_unit_error = $('#time_unit_in_error');
    if (time_unit[0].val() || time_unit[1].val() || time_unit[2].val()) {

      const time_unit_value = [parseInt(time_unit[0].val(), 10), parseInt(time_unit[1].val(), 10), parseInt(time_unit[2].val(), 10)];

      if (!(time_unit_value[0] >= 0 && time_unit_value[1] >= 0 && time_unit_value[2] >= 0)) {

        time_unit_error.text("Empty Values");
        time_unit_error.css("width", "30%");
        every_valid = false;

      } else if (to_seconds(time_unit_value[0], time_unit_value[1], time_unit_value[2]) < _10_MIN) {

        time_unit_error.text("Min time reached");
        time_unit_error.css("width", "30%");
        every_valid = false;

      } else {
        time_unit_error.css("width", "0%");

        if (to_seconds(time_unit_value[0], time_unit_value[1], time_unit_value[2]) != sender.time_unit) {
          value_new = true;
        }
      }

    } else {
      time_unit_error.css("width", "0%");
    }

    const processes_unit = $('#processes_unit_in');
    const processes_unit_error = $('#processes_unit_in_error');
    if (processes_unit.val()) {

      const processes_unit_value = parseInt(processes_unit.val(), 10);
      const max_reached = processes_unit_value > _MAX_INT;

      if (max_reached || processes_unit_value < 1) {
        
        processes_unit.css("width", small_display ? "55%" : "70%");
        processes_unit_error.text(!max_reached ? "Value invalid" : "Max value reached");
        processes_unit_error.css("width", small_display ? "45%" : "30%");
        every_valid = false

      } else {
        processes_unit.css("width", "70%");
        processes_unit_error.css("width", "0%");

        if (processes_unit_value !== sender.processes_unit) {
          value_new = true;
        }
      }
    } else {
      processes_unit.css("width", "70%");
      processes_unit_error.css("width", "0%");
    }

    const target = $('#target_in');
    const target_error = $('#target_in_error');
    if (target.val()) {

      const target_value = parseInt(target.val(), 10);
      const max_reached = target_value > _MAX_INT;

      if (max_reached || target_value < 1) {
        
        target.css("width", small_display ? "55%" : "70%");
        target_error.text(!max_reached ? "Value invalid" : "Max value reached");
        target_error.css("width", small_display ? "45%" : "30%");
        every_valid = false

      } else {
        target.css("width", "70%");
        target_error.css("width", "0%");

        if (target_value !== sender.target) {
          value_new = true;
        }
      }
    } else {
      target.css("width", "70%");
      target_error.css("width", "0%");
    }

    $('#update_data').prop('disabled', !(every_valid && value_new && !sender.monitoring));
  }

  function clean_data_on_input () {
    $('#machine_in').val("");
    $('#worker_in').val("");
    $("#part_in").val("");
    $("#lote_in").val("");
    $("#states_in").val("");

    $('#time_unit_hour_in').val("");
    $('#time_unit_min_in').val("");
    $('#time_unit_sec_in').val("");

    $("#processes_unit_in").val("");
    $("#target_in").val("");

    verify_data_on_input();
  }

  function verify_schedule_on_input () {
    let verification = {
      Every : true
    }

    verify_schedule_on_change(verification, sender.schedules.Schedule0, 0);
    verify_schedule_on_change(verification, sender.schedules.Schedule1, 1);
    verify_schedule_on_change(verification, sender.schedules.Schedule2, 2);
    verify_week_on_change(verification, sender.schedules.Week);

    $('#update_schedules').prop('disabled', !(verification.Every && !sender.monitoring && (verification.Sch0New || verification.Sch1New || verification.Sch2New || verification.Week)));
  }

  function clean_schedule_on_input () {
    for (let addr = 0; addr < 3; addr ++) {
      let schedule = sender.schedules[`Schedule${addr}`];
      $(`#schedule${addr}_enable`).prop("checked", schedule.State);
      $(`#schedule${addr}_action`).val(schedule.Action);

      $(`#schedule${addr}_hour_in`).val("");
      $(`#schedule${addr}_min_in`).val("");
      $(`#schedule${addr}_sec_in`).val("");
    }

    verify_schedule_on_input();
  }

  function verify_schedule_on_change (Verification, Schedule, id) {
    const schedule_enable = $(`#schedule${id}_enable`);
    const schedule_enable_value = schedule_enable.prop("checked");
    $(`#schedule${id}_enable + .enable_label`).text(schedule_enable_value ? "Enabled" : "Disabled");

    if (schedule_enable_value != Schedule.State) {
      Verification[`Sch${id}New`] = true;
    }

    const schedule_action = $(`#schedule${id}_action`);
    if (schedule_action.val()) {
      const schedule_action_value = parseInt(schedule_action.val(), 10);

      if (schedule_action_value !== Schedule.Action) {
        Verification[`Sch${id}New`] = true;
      }
    } else {
      schedule_error.text("Empty Action");
      schedule_error.css("width", "30%");
      Verification.Every = false;
    }

    const schedule_time = [$(`#schedule${id}_hour_in`), $(`#schedule${id}_min_in`), $(`#schedule${id}_sec_in`)];
    const schedule_error = $(`#schedule${id}_in_error`);
    if (schedule_time[0].val() || schedule_time[1].val() || schedule_time[2].val()) {

      const schedule_time_value = [parseInt(schedule_time[0].val(), 10), parseInt(schedule_time[1].val(), 10), parseInt(schedule_time[2].val(), 10)];

      if (!(schedule_time_value[0] >= 0 && schedule_time_value[1] >= 0 && schedule_time_value[2] >= 0)) {

        schedule_error.text("Empty Values");
        schedule_error.css("width", "30%");
        Verification.Every = false;

      } else {
        if (Verification.Every) {
          schedule_error.css("width", "0%");
        }

        if (schedule_time_value[0] !== Schedule.Value[0] || schedule_time_value[1] !== Schedule.Value[1] || schedule_time_value[2] !== Schedule.Value[2]) {
          Verification[`Sch${id}New`] = true;
        }
      }

    } else {
      if (Verification.Every) {
        schedule_error.css("width", "0%");
      }
    }
  }

  function verify_schedule_on_send (data, Schedule, id, enable, action, times) {
    if (enable != Schedule.State || action.val() || (times[0].val() && times[1].val() && times[2].val())) {
      let new_value = false;
      let schedule = {};

      if (enable != Schedule.State) {
        schedule.State = enable;
        new_value = true;
      }

      if (action.val()) {
        const action_value = parseInt(action.val(), 10);
        if (action_value != Schedule.Action) {
          schedule.Action = action_value;
          new_value = true;
        }
      }

      if (times[0].val() && times[1].val() && times[2].val()) {
        const times_value = [];
        times.forEach(element => {
          times_value.push(parseInt(element.val(), 10));
        });

        let is_different = false;
        for (let time = 0; time < 3; time++) {
          if (times_value[time] != Schedule.Value[time]) {
            is_different = true;
          }
        }

        if (is_different) {
          schedule.Value = times_value;
          new_value = true;
        }
      }

      if (new_value) {
        data[`Schedule${id}`] = schedule;
      }

    }
  }

  function verify_week_on_change (Verification, Week) {
    const schedule_week = [$('#day_0'), $('#day_1'), $('#day_2'), $('#day_3'), $('#day_4'), $('#day_5'), $('#day_6')];

    for (let weekday = 0; weekday < 7; weekday ++) {
      const day_checked = schedule_week[weekday].prop("checked");
      
      if (day_checked !== Week[weekday]) {
        Verification.Week = true;
      }
    }
  }

  function verify_week_on_send (data, week) {
    let new_value = false;
    let week_states = [];
    for (let weekday = 0; weekday < 7; weekday ++) {
      week_states.push(week[weekday].prop("checked"));
      
      if (week_states[weekday] !== sender.schedules.Week[weekday]) {
        new_value = true;
      }
    }

    if (new_value) {
      data.Week = week_states;
    }
  }

  function verify_times_on_input () {
    let verification = {
      Every : true
    };

    verify_times_on_change(verification, sender.lunch_time, "lunch");
    verify_times_on_change(verification, sender.break_time, "break");
    verify_times_on_change(verification, sender.endprocess_tout, "tout");

    $('#update_times').prop('disabled', !(verification.Every && !sender.monitoring && (verification.lunchNew || verification.breakNew || verification.toutNew)));
  }

  function clean_times_on_input () {
    $('#lunch_hour_in').val("");
    $('#lunch_min_in').val("");
    $('#lunch_sec_in').val("");

    $('#break_hour_in').val("");
    $('#break_min_in').val("");
    $('#break_sec_in').val("");

    $('#tout_hour_in').val("");
    $('#tout_min_in').val("");
    $('#tout_sec_in').val("");

    verify_times_on_input();
  }

  function verify_times_on_change (Verification, schedule_time, time_id) {
    const time = [$(`#${time_id}_hour_in`), $(`#${time_id}_min_in`), $(`#${time_id}_sec_in`)];
    const time_error = $(`#${time_id}_in_error`);
    if (time[0].val() || time[1].val() || time[2].val()) {

      const time_value = [parseInt(time[0].val(), 10), parseInt(time[1].val(), 10), parseInt(time[2].val(), 10)];

      if (!(time_value[0] >= 0 && time_value[1] >= 0 && time_value[2] >= 0)) {

        time_error.text("Empty Values");
        time_error.css("width", "30%");
        Verification.Every = false;

      } else if (to_seconds(time_value[0], time_value[1], time_value[2]) < _10_MIN) {

        time_error.text("Min time reached");
        time_error.css("width", "30%");
        Verification.Every = false;

      } else {
        time_error.css("width", "0%");

        if (to_seconds(time_value[0], time_value[1], time_value[2]) != schedule_time) {
          Verification[`${time_id}New`] = true;
        }
      }

    } else {
      time_error.css("width", "0%");
    }
  }

  function verify_times_on_send (data, time_id, key) {
    const time = [$(`#${time_id}_hour_in`), $(`#${time_id}_min_in`), $(`#${time_id}_sec_in`)];
    if (time[0].val() && time[1].val() && time[2].val()) {
      data[`${key}`] = to_seconds(parseInt(time[0].val(), 10), parseInt(time[1].val(), 10), parseInt(time[2].val(), 10));
    }

    return time;
  }

  function verify_codes_on_input () {
    let every_valid = true;
    let value_new = false;

    for (let code = sender.min_states; code < sender.states; code ++) {
      const key = `D${code.toString().padStart(2, '0')}`;
      const value = sender.codes[key];
      const code_name = $(`#code_${key}`);
      const code_error = $(`#code_${key}_error`);
      
      if (code_name.text()) {

        const code_name_value = code_name.text();
        const max_reached = code_name_value.length > _20_CHARS;
        const char_invalid = check_chars_invalid(code_name_value);

        if (max_reached || char_invalid) {

          every_valid = false;
          code_error.css("opacity", "1");

        } else {

          code_error.css("opacity", "0");
          if (code_name_value !== value) {
            value_new = true;
          }

        }

      } else {
        code_error.css("opacity", "1");
      }

    }

    $('#update_codes').prop("disabled", !(every_valid && !sender.monitoring && value_new));
  }

  function render_codes_inputs (min_states, max_states, active_codes, codes) {
    let div_target = $('.data_code_default');
    let content = "";

    for (let code = 0; code < min_states; code ++) {
      const key = `D${code.toString().padStart(2, '0')}`;
      let div = '<div class="code_default">';
      div += `<p class="code">${key}</p>`;
      div += `<p class="name">${codes[key]}</p>`;
      div += '</div>';
      content += div;
    }

    div_target.html(content);

    div_target = $('.data_code_editable');
    content = "";

    for (let code = min_states; code < max_states; code ++) {
      const key = `D${code.toString().padStart(2, '0')}`;
      let div = '<div class="code_editable">';
      div += `<p class="code">${key}</p>`;
      div += `<p ${code < active_codes ? 'contenteditable="true"' : ""} class=${code < active_codes ? "editable_name" : "name"} id="code_${key}" title="Click to edit">${code < active_codes ? codes[key] : "None"}</p>`;
      div += code < active_codes ? `<p class="editable_error" id="code_${key}_error">Error</p>` : "";
      div += '</div>';
      content += div;
    }

    div_target.html(content);
    $('#update_codes').prop("disabled", true);
    form_update_codes();
  }

  function clean_codes () {
    for (let code = sender.min_states; code < sender.states; code ++) {
      const key = `D${code.toString().padStart(2, '0')}`;
      $(`#code_${key}`).text(sender.codes[key]);
    }

    $('#update_codes').prop("disabled", true);
  }

  function check_chars_invalid (word) {
    const invalid_chars = ['$', '%', '@', '#', '!', '^', '?', '{', '}', '[', ']', '/'];

    for (let i = 0; i < invalid_chars.length; i++) {
      if (word.includes(invalid_chars[i])) {
        return true;
      }
    }

    return false;
  }

// VERIFY NETWORK

  function verify_network_on_inputs () {
    let verification = {
      Every : true,
      Mode  : false,
      IP    : false,
      SN    : false,
      GW    : false,
      DNS   : false
    }

    const network_static_value = $('#network_static_ip').prop("checked");

    if (network_static_value != !sender.network.Mode) {
      verification.Mode = true;
    }

    verify_address_on_input(verification, "IP", address_from_string(sender.network.StaticIP), "network_ip");
    verify_address_on_input(verification, "SN", address_from_string(sender.network.StaticGW), "network_gw");
    verify_address_on_input(verification, "GW", address_from_string(sender.network.StaticSN), "network_sn");
    verify_address_on_input(verification, "DNS", address_from_string(sender.network.StaticDNS), "network_dns");

    $('#update_network').prop("disabled", !(verification.Every && !sender.monitoring && (verification.IP || verification.GW || verification.SN || verification.DNS)))
  }

  function render_network_inputs (enable) {
    $('.data_network_ipconfig_input').css("opacity", enable ? "1" : "0.2");
    
    for (let octet = 0; octet < 4; octet ++) {
      $(`#network_ip_oct${octet}`).prop("disabled",   !enable);
      $(`#network_gw_oct${octet}`).prop("disabled",   !enable);
      $(`#network_sn_oct${octet}`).prop("disabled",   !enable);
      $(`#network_dns_oct${octet}`).prop("disabled",  !enable);
    }
  }

// VERIFY SERVER

  function verify_server_on_inputs () {
    let verification = {
      Every : true,
      Mode  : false,
      Auto  : false,
      IP    : false,
      PORT  : false
    }

    const server_auto_value = $('#server_autoconnect').prop("checked");
    if (server_auto_value != sender.server.Autoconnect) {
      verification.Auto = true;
    }

    const server_static_value = $('#server_static_ip').prop("checked");
    if (server_static_value != !sender.server.Mode) {
      verification.Mode = true;
    }

    verify_address_on_input(verification, "IP", address_from_string(sender.server.StaticIP), "server_ip");

    const server_port = $('#server_port');
    const server_port_error = $('#server_port_error');
    if (server_port.val()) {

      const server_port_value = parseInt(server_port.val(), 10);

      if (server_port_value > _MAX_INT) {
        
        server_port.val(_MAX_INT);

      } else if (server_port_value === 0) {

        server_port_error.css("opacity", "1");
        verification.Every = false;

      } else {
        server_port_error.css("opacity", "0");

        if (server_port_value != sender.server.StaticPort) {
          verification.PORT = true;
        }
      }
    } else {
      server_port_error.css("opacity", "1");
      verification.Every = false;
    }

    $("#update_server").prop("disabled", !(verification.Every && !sender.monitoring && (verification.Auto || verification.Mode || verification.IP || verification.PORT)));
  }

  function render_server_inputs (enable) {
    $('.data_server_ipconfig_input').css("opacity", enable ? "1" : "0.2");

    for (let octet = 0; octet < 4; octet ++) {
      $(`#server_ip_oct${octet}`).prop("disabled",   !enable);
    }
    $(`#server_port`).prop("disabled", !enable);
  }

// ADDRESS
  function verify_address_on_input (verification, key, static_address, id_address) {
    const address = [$(`#${id_address}_oct0`), $(`#${id_address}_oct1`), $(`#${id_address}_oct2`), $(`#${id_address}_oct3`)];
    const address_error = $(`#${id_address}_error`);
    if (address[0].val() || address[1].val() || address[2].val() || address[3]) {

      const address_value = [parseInt(address[0].val(), 10), parseInt(address[1].val(), 10), parseInt(address[2].val(), 10), parseInt(address[3].val(), 10)];

      if (!(address_value[0] >= 0 && address_value[1] >= 0 && address_value[2] >= 0 && address_value[3] >= 0)) {

        address_error.css("opacity", "1");
        verification.Every = false;

      } else if (address_value[0] == 0 || address_value[1] == 0) {

        address_error.css("opacity", "1");
        verification.Every = false;

      } else if (address_value[0] > 255 || address_value[1] > 255 || address_value[2] > 255 || address_value[3] > 255) {

        address.forEach(element => {
          if (element.val()) {
            if (parseInt(element.val(), 10) > 255) {
              element.val(255);
            }
          }
        });

      } else {
        for (let octet = 0; octet < 4; octet ++) {
          if (address_value[octet] != static_address[octet]) {
            verification[key] = true;
            break;
          }
        }
        address_error.css("opacity", "0");
      }
    }
  }

  function render_address_inputs (id_target, address) {
    for (let octet = 0; octet < 4; octet ++) {
      $(`#${id_target}_oct${octet}`).val(address[octet]);
    }
    $(`#${id_target}_error`).css("opacity", "0");
  }

  function address_from_string (address) {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (regex.test(address)) {
      return address.split('.').map(Number);
    } else {
        return [0, 0, 0, 0];
    }
  }

// TIME FUNCTIONS

  function to_seconds (hours, minutes, seconds) {
    return (hours * 3600) + (minutes * 60) + seconds;
  }

  function to_HHMMSS (seconds) {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secondsRest = (seconds % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${secondsRest}`;
  }

  function HHMMSS_to_String (hours, minutes, seconds) {
    const hrs = hours.toString().padStart(2, '0');
    const min = minutes.toString().padStart(2, '0');
    const sec = seconds.toString().padStart(2, '0');

    return `${hrs}:${min}:${sec}`;
  }