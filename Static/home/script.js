// Server
  const server = {
    host      : window.location.hostname,
    port      : window.location.port,
    state     : false,
    ws        : null,
    error     : false,
    interval  : 10000
  }

// Navegator
  const GEN_NAV = 'Gen';
  const DIS_NAV = 'Dis';
  const PER_NAV = 'Per';
  const QUA_NAV = 'Qua';
  const EVENTS_NAV = 'Events';
  const STATES_NAV = 'States';

  const SHIFTS = ['1st', '2nd', '3rd', '4th', '-'];

// Main
  $(document).ready(async function() {
    // Body
    handle_resize();
    handle_notifications();
    handle_company();
    // Menu
    handle_menu_hover();
    handle_session();
    handle_pages_button();
    handle_theme();
    show_time();
    setInterval(show_time, 1000);
    // Main
    clean_fields();
    handle_graphic_hover();
    handle_navegator();
    handle_complements_navegator();
    // Events
    $(window).on("focus", function() {
      console.log("%c[WINDOW] Focus", BLACK);
      valid_session();
    });
  });

// Handle body
  function on_resize (width_new, width_pre) {
    if (width_new - width_pre > 50 || width_pre - width_new > 50) {
      setTimeout(function () {
        resize_charts();
      }, 600);
    }

    resize_charts();
  }

// Graphic
  const chart_template = {
    layout: {
      fontSize: 10,
      textColor: _text_color_dark,
      background: { type: 'solid', color: 'transparent' },
      attributionLogo: false,
    },
  };

  const graph_options = {
    timeScale: {
      timeVisible: true,
      fixLeftEdge: true,
      fixRightEdge: true,
      minBarSpacing: 0.05,
      tickMarkFormatter: (time, tickMarkType, locale) => {
        const date = new Date(time * 1000);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      },
    },
    rightPriceScale: {
      visible: true,
      scaleMargins: {
        top: 0.2,
        bottom: 0.1
      },
      autoScale: true,
      borderColor: _grid_color_dark,
      minValue: 0,
      maxValue: 120,
    },
    crosshair: {
        horzLine: {
            visible: true,
            labelVisible: false,
        },
        vertLine: {
            labelVisible: false,
        },
    },
    grid: {
        vertLines: {
            visible: true,
            color: _grid_color_dark,
        },
        horzLines: {
            visible: true,
            color: _grid_color_dark,
        },
    },
  }

  const graph_options_area = {
    topColor: '#2680a647',
    bottomColor: '#2688a60d',
    lineColor: '#268aa6ff',
    lineWidth: 2,
    crossHairMarkerVisible: true,
  }

  const tool_tip_options = {
    background  : _background_color_dark,
    title_color : _subtitle_color_dark,
    text_color  : _subtitle_color_dark,
    width       : 65,
    height      : 45,
    margin      : 15
  }

  const msr_container = document.getElementById('msr_graph');
  let msr_chart = LightweightCharts.createChart(msr_container, chart_template);
  const msr_series = msr_chart.addAreaSeries(graph_options_area);

  let msr_price_lines = {
    max: null,
    ave: null
  };

  const OEE = 'OEE';
  const DIS = 'DIS';
  const PER = 'PER';
  const QUA = 'QUA';

  let kpi_selector = OEE;

  const kpi_container = document.getElementById('kpi_graph');
  let kpi_chart = LightweightCharts.createChart(kpi_container, chart_template);
  const kpi_series = kpi_chart.addAreaSeries(graph_options_area);
  
  let kpi_price_lines = {
    max: null,
    ave: null
  };

  let autofix = true;

  let tmp_enable = false;

  function update_graph (IndicatorsFile, render) {

    const timestamp   = IndicatorsFile.Timestamp;

    const kpi_values  = IndicatorsFile[kpi_selector];
    // const msr_values  = IndicatorsFile.Measured;
    const msr_values  = tmp_enable ? IndicatorsFile.TMP : IndicatorsFile.Measured;

    const time_kpi_value = timestamp.map((time, index) => ({
      time : time / 1000,
      value: kpi_values[index]
    }));

    const time_msr_value = timestamp.map((time, index) => ({
      time : time / 1000,
      value: msr_values[index]
    }));

    create_ref_lines(time_kpi_value, kpi_series, kpi_price_lines, '#26a626ff', '#0037ffff');
    create_ref_lines(time_msr_value, msr_series, msr_price_lines, '#26a626ff', '#0037ffff');

    kpi_series.setData(time_kpi_value);
    msr_series.setData(time_msr_value);

    if (render) {
      kpi_chart.applyOptions(chart_template);
      kpi_chart.applyOptions(graph_options);

      msr_chart.applyOptions(chart_template);
      msr_chart.applyOptions(graph_options);

      let kpi_tool_tip = document.getElementById('kpi_tool_tip');
      if (!kpi_tool_tip) {
        kpi_tool_tip = document.createElement('div');
        kpi_tool_tip.id = 'kpi_tool_tip';
    
        kpi_tool_tip.style = `
          width: ${tool_tip_options.width}px;
          height: ${tool_tip_options.height}px;
          position: absolute;
          display: none;
          padding: 8px;
          box-sizing: border-box;
          font-size: 12px;
          text-align: left;
          z-index: 30;
          top: 12px;
          left: 12px;
          pointer-events: none;
          border: 1px solid;
          border-radius: 2px;
          font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        `;
        kpi_tool_tip.style.background = tool_tip_options.background;
        kpi_tool_tip.style.color = tool_tip_options.text_color;
        kpi_tool_tip.style.borderColor = '#268aa6ff';
    
        kpi_container.appendChild(kpi_tool_tip);
      }
      
      kpi_chart.subscribeCrosshairMove(param => {
        if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > kpi_container.clientWidth || param.point.y < 0 || param.point.y > kpi_container.clientHeight) {
            kpi_tool_tip.style.display = 'none';
        } else {
            const date = new Date(param.time * 1000);
            // const year = date.getFullYear();
            // const month = (date.getMonth() + 1).toString().padStart(2, '0');
            // const day = date.getDate().toString().padStart(2, '0');
            // const date_str = `${day}-${month}-${year % 100}`;
  
            const hour    = date.getHours().toString().padStart(2, '0');
            const minute  = date.getMinutes().toString().padStart(2, '0');
            const second  = date.getSeconds().toString().padStart(2, '0');
  
            kpi_tool_tip.style.display = 'block';
            const data = param.seriesData.get(kpi_series);
            const price = data.value !== undefined ? data.value : data.close;
            kpi_tool_tip.innerHTML = `
              <div style="color: ${'#268aa6ff'}">
                ${Math.round(100 * price) / 100}%
              </div>
              <div style="font-size: 10px; margin: 4px 0px; color: ${tool_tip_options.text_color}">
                ${hour}:${minute}:${second}
              </div>`;
  
            const y = param.point.y;
            let left = param.point.x + tool_tip_options.margin;
            if (left > kpi_container.clientWidth - tool_tip_options.width) {
              left = param.point.x - tool_tip_options.margin - tool_tip_options.width;
            }
  
            let top = y + tool_tip_options.margin;
            if (top > kpi_container.clientHeight - tool_tip_options.height) {
              top = y - tool_tip_options.height - tool_tip_options.margin;
            }
            kpi_tool_tip.style.left = left + 'px';
            kpi_tool_tip.style.top  = top + 'px';
        }
      });

      let kpi_legend = document.getElementById('kpi_legend');
      if (!kpi_legend) {
        kpi_legend = document.createElement('div');
        kpi_legend.id = 'kpi_legend';
        kpi_legend.style = `position: absolute; left: 5px; top: 10px; z-index: 1; font-size: 2vh; font-family: sans-serif; line-height: 18px; font-weight: 300;`;
        kpi_container.appendChild(kpi_legend);
    
        const kpi_title = document.createElement('div');
        kpi_title.id = 'kpi_title';
        kpi_title.innerHTML = kpi_selector === OEE ? 'OEE' : (kpi_selector === DIS ? 'Disponibility' : (kpi_selector === PER ? 'Performance' : 'Quality'));
        kpi_title.style.color = 'var(--subtitle-color';
        kpi_legend.appendChild(kpi_title);
      } else {
        $('#kpi_title').html('');
        $('#kpi_title').html(kpi_selector === OEE ? 'OEE' : (kpi_selector === DIS ? 'Disponibility' : (kpi_selector === PER ? 'Performance' : 'Quality')));
      }

      let msr_tool_tip = document.getElementById('msr_tool_tip');
      if (!msr_tool_tip) {
        msr_tool_tip = document.createElement('div');
        msr_tool_tip.id = 'msr_tool_tip';
    
        msr_tool_tip.style = `
          width: ${tool_tip_options.width * 1.25}px;
          height: ${tool_tip_options.height}px;
          position: absolute;
          display: none;
          padding: 8px;
          box-sizing: border-box;
          font-size: 12px;
          text-align: left;
          z-index: 30;
          top: 12px;
          left: 12px;
          pointer-events: none;
          border: 1px solid;
          border-radius: 2px;
          font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        `;
        msr_tool_tip.style.background = tool_tip_options.background;
        msr_tool_tip.style.color = tool_tip_options.text_color;
        msr_tool_tip.style.borderColor = '#268aa6ff';
    
        msr_container.appendChild(msr_tool_tip);
      }
      
      msr_chart.subscribeCrosshairMove(param => {
        if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > msr_container.clientWidth || param.point.y < 0 || param.point.y > msr_container.clientHeight) {
            msr_tool_tip.style.display = 'none';
        } else {
            const date = new Date(param.time * 1000);
            // const year = date.getFullYear();
            // const month = (date.getMonth() + 1).toString().padStart(2, '0');
            // const day = date.getDate().toString().padStart(2, '0');
            // const date_str = `${day}-${month}-${year % 100}`;
  
            const hour    = date.getHours().toString().padStart(2, '0');
            const minute  = date.getMinutes().toString().padStart(2, '0');
            const second  = date.getSeconds().toString().padStart(2, '0');
  
            msr_tool_tip.style.display = 'block';
            const data = param.seriesData.get(msr_series);
            const price = data.value !== undefined ? data.value : data.close;
            msr_tool_tip.innerHTML = `
              <div style="color: ${'#268aa6ff'}">
                ${price} ${tmp_enable ? '°C' : 'U/Hr'}
              </div>
              <div style="font-size: 10px; margin: 4px 0px; color: ${tool_tip_options.text_color}">
                ${hour}:${minute}:${second}
              </div>`;
  
            const y = param.point.y;
            let left = param.point.x + tool_tip_options.margin;
            if (left > msr_container.clientWidth - tool_tip_options.width) {
              left = param.point.x - tool_tip_options.margin - tool_tip_options.width;
            }
  
            let top = y + tool_tip_options.margin;
            if (top > msr_container.clientHeight - tool_tip_options.height) {
              top = y - tool_tip_options.height - tool_tip_options.margin;
            }
            msr_tool_tip.style.left = left + 'px';
            msr_tool_tip.style.top  = top + 'px';
        }
      });

    } else {

      if (autofix) {
        kpi_chart.timeScale().fitContent();
        kpi_chart.timeScale().scrollToPosition(20);

        msr_chart.timeScale().fitContent();
        msr_chart.timeScale().scrollToPosition(20);
      }

    }

  }

  function create_ref_lines (data, series, lines, max_color, ave_color) {

    if (lines.max) {
      series.removePriceLine(lines.max);
    }

    if (lines.ave) {
      series.removePriceLine(lines.ave);
    }

    let max_value = 0;
    let ave_value = 0;
    const size = data.length;

    for (let i = 0; i < size; i ++) {

      const value = data[i].value;
      if (value > max_value) {
        max_value = value;
      }

      ave_value += value;

    }

    const maxPriceLine = {
      price: max_value,
      color: max_color,
      lineWidth: 2,
      lineStyle: 2,
      axisLabelVisible: true,
      title: 'max',
    };

    const avePriceLine = {
      price: ave_value / size,
      color: ave_color,
      lineWidth: 2,
      lineStyle: 2,
      axisLabelVisible: true,
      title: 'ave',
    };

    lines.max = series.createPriceLine(maxPriceLine);
    lines.ave = series.createPriceLine(avePriceLine);

  }

  function resize_charts () {
    let width = 0;
    let height = 0;

    if (msr_chart) {
      width   = $('#msr_graph').width();
      height  = $('#msr_graph').height();
      msr_chart.resize(width, height);
    }

    if (kpi_chart) {
      width   = $('#kpi_graph').width();
      height  = $('#kpi_graph').height();
      kpi_chart.resize(width, height);
    }
  }

  function handle_graphic_hover () {

    const graph_container = $('.main_content_graphic');

    graph_container.on('mouseenter', function () {
      autofix = false;
    });

    graph_container.on('mouseleave', function () {
      autofix = true;
    });

    const kpi_donuts = $('.main_content_indicators_item');

    kpi_donuts.on('click', function () {
      const id = $(this).attr('id');

      let kpi_button;

      switch (id) {

        case 'OEE_B':
          kpi_button = OEE;
          break;

        case 'DIS_B':
          kpi_button = DIS;
          break;

        case 'PER_B':
          kpi_button = PER;
          break;

        case 'QUA_B':
          kpi_button = QUA;
          break;

      }

      if (kpi_selector !== kpi_button) {
        kpi_selector = kpi_button;
        kpi_donuts.removeClass('indicators_item-active');
        $(this).addClass('indicators_item-active');
        update_graph(senders[sender_on_display].indicators_file, true);
      }
    });

  }

// Handle Menu Functions
  function on_theme_change (light_mode, init) {
    chart_template.layout.textColor = light_mode ? _text_color_light : _text_color_dark;

    graph_options.rightPriceScale.borderColor = light_mode ? _grid_color_light : _grid_color_dark;
    graph_options.grid.vertLines.color = light_mode ? _grid_color_light : _grid_color_dark;
    graph_options.grid.horzLines.color = light_mode ? _grid_color_light : _grid_color_dark;

    tool_tip_options.background = light_mode ? _background_color_light : _background_color_dark;
    tool_tip_options.text_color = light_mode ? _subtitle_color_light : _subtitle_color_dark;

    if (!init) {
      if (sender_on_display >= 0) {
        if (senders[sender_on_display] != null) {
          update_graph(senders[sender_on_display].indicators_file, true);
        }
      }
    }

  }

  function handle_pages_button () {
    let submenu_cursor = false;

    const pages_button = $('#pages_button');
    const menu_pages = $('#menu_pages');

    pages_button.mouseenter(function () {
      menu_pages.fadeIn(250);
    });

    pages_button.mouseleave(function () {
      setTimeout(function () {
        if (!submenu_cursor) {
          menu_pages.fadeOut(250);
        }
      }, 100);

    });

    menu_pages.mouseenter(function () {
      submenu_cursor = true;
    });

    menu_pages.mouseleave(function () {
      submenu_cursor = false;
      menu_pages.fadeOut(250);
    });

    let open_windows = {};

    $('#pages_list li').on('click', function () {
      const page = $(this).find('p').text();
      let url;

      switch (page) {
        case 'Live':
          url = '/live';
          break;

        case 'Monitoring':
          url = '/monitoring';
          break;

        case 'Consult':
          url = '/consult';
          break;

        case 'QR Codes':
          url = '/qrcodes';
          break;

        case 'Senders':
          url = '/senders';
          break;

        case 'Admin':
          url = '/admin';
          break;
      }

      if (!open_windows[url] || open_windows[url].closed) {
        open_windows[url] = window.open(url, '_blank');
      } else {
        open_windows[url].focus();
      }
    });

    $('#ip').on('click', function () {
      let url = `http://${$(this).text()}/`;
      if (!open_windows[url] || open_windows[url].closed) {
        open_windows[url] = window.open(url, '_blank');
      } else {
        open_windows[url].focus();
      }
    });

  }

// Handle Session
  function on_close_session_prompt () {
    if (session.Init && server.ws === null) {
      server.port = server_config.WS_PORT || 82;
      ws_connect();
    } else if (!session.Init && server.ws !== null){
      ws_disconnect();

      localStorage.removeItem('User');
      localStorage.removeItem('Pass');
    }
  }

// Server
  function ws_connect () {
    const sync_text   = $('#prompt_sync_text');

    if (session.Init) {

      console.log('%c[SRVR] %s', server.state ? YELLOW : BLACK, server.state ? "Reconnecting" : "Connecting");
      sync_text.text(`${server.state ? "Reconnecting" : "Connecting"} server`);
      server.ws = new WebSocket(`ws://${server.host}:${server.port}/live`);

      server.ws.onopen = function (event) {
        console.log('%c[SRVR] %s', GREEN, server.state ? "Reconnected" : "Connected");
        server.error = false;

        ws_send({'cmd' : 'open'})

        // setTimeout(function () {
        //   ws_send({'cmd' : 'open'})
        // }, 1000);
      };

      server.ws.onmessage = function (event) {
        try {
          
          const data = JSON.parse(event.data);
          let command = "error";

          if (data.hasOwnProperty('cmd')) {
            command = data.cmd;
            delete data.cmd;
          }

          switch (command) {

            case 'open':
              console.log("%c[SRVR] %s", BLUE, data.value);
              sync_text.text(`Server ${server.state ? "reconnected" : "connected"}`);
              server.state = true;
              ws_send({'cmd':'init'});
              break;

            case 'init':
              set_display('lock', 'Synchronizing devices connected');
              render_devices(data.value.list, data.value.dict);

              ws_send({'cmd':'data'});
              break;

            case 'data':
                update_devices(data.value.dict);
                update_display();

                // setInterval(ws_send({'cmd':'sender', 'id':sender_on_display}), 1000);
                break;

            case 'error':
              console.log("%c[SRVR] CMD Error", RED);
              break;

          }

        } catch (error) {
          
          sync_text.text(`Server error: ${error}`);
          console.error("%c[SRVR] Error on message: %o, %o", YELLOW, error, JSON.parse(event.data));

        }
      };

      server.ws.onclose = function (event) {
        
        set_display('lock', `Server connection ${server.error ? 'error' : 'closed'}`);
        console.log('%c[SRVR] Connection %s', YELLOW, server.error ? 'error' : 'closed');
        show_notification('Server', `Connection ${server.error ? 'failed' : 'closed'}`, 'Warning');
        
        server.error = true;

        ws_reconnect();

      };

    } else {
      set_display('lock', 'Waiting Session', true);
    }

  }

  function ws_reconnect () {
    
    if (server.ws !== null && session.Init) {
      setTimeout(ws_connect, server.interval);
    } else {
      set_display('lock', 'Waiting Session', true);
    }

  }

  function ws_send (data) {

    if (server.ws && server.ws.readyState === WebSocket.OPEN) {
      server.ws.send(JSON.stringify(data));
      return true;
    }

    return false;

  }

  function ws_disconnect () {

    if (server.ws) {
      server.ws.close();
      server.ws = null;
      server.state = false;
    }

  }

// Handle navegator
  function handle_navegator () {
    const gen_window = $('#gen_win');
    const dis_window = $('#dis_win');
    const per_window = $('#per_win');
    const qua_window = $('#qua_win');
    const nav_options = [$('#gen_nav'), $('#dis_nav'), $('#per_nav'), $('#qua_nav')];

    $('.main_data_nav li').mouseenter(function () {
      nav_options.forEach(nav => {
        nav.css('width', nav.text() === $(this).text() ? '40%' : '20%');
      });
    });

    $('.main_data_nav li').mouseleave(function () {
      nav_options.forEach(nav => {
        nav.removeAttr('style');
      });
    });

    $('.main_data_nav li').on('click', function () {
      nav_options.forEach(nav => {
        if (nav.text() === $(this).text()) {
          nav.addClass('main_data_nav_option-active');
        } else {
          nav.removeClass('main_data_nav_option-active');
        }
      });

      switch ($(this).text()) {
        case GEN_NAV:
          gen_window.addClass('main_data_window-active');
          dis_window.removeClass('main_data_window-active');
          per_window.removeClass('main_data_window-active');
          qua_window.removeClass('main_data_window-active');
          break;

        case DIS_NAV:
          gen_window.removeClass('main_data_window-active');
          dis_window.addClass('main_data_window-active');
          per_window.removeClass('main_data_window-active');
          qua_window.removeClass('main_data_window-active');
          break;

        case PER_NAV:
          gen_window.removeClass('main_data_window-active');
          dis_window.removeClass('main_data_window-active');
          per_window.addClass('main_data_window-active');
          qua_window.removeClass('main_data_window-active');
          setTimeout(resize_charts, 600);
          break;

        case QUA_NAV:
          gen_window.removeClass('main_data_window-active');
          dis_window.removeClass('main_data_window-active');
          per_window.removeClass('main_data_window-active');
          qua_window.addClass('main_data_window-active');
          break;
      }

    });

    handle_codes_hover();
    handle_production_hover();

    $('#input_0').on('click', function () {
      tmp_enable = !tmp_enable;
      update_graph(senders[sender_on_display].indicators_file, true);

      setTimeout(function () {
        tmp_enable = !tmp_enable;
        update_graph(senders[sender_on_display].indicators_file, true);
      }, 10000);
    });

  }

  function handle_complements_navegator () {
    const events_window = $('#events_win');
    const states_window = $('#states_win');
    const nav_options = [$('#events_nav'), $('#states_nav')];

    $('.main_data_complements_nav li').mouseenter(function () {
      nav_options.forEach(nav => {
        nav.css('width', nav.text() === $(this).text() ? '70%' : '30%');
      });
    });

    $('.main_data_complements_nav li').mouseleave(function () {
      nav_options.forEach(nav => {
        nav.removeAttr('style');
      });
    });

    $('.main_data_complements_nav li').on('click', function () {
      nav_options.forEach(nav => {
        if (nav.text() === $(this).text()) {
          nav.addClass('main_data_complements_option-active');
        } else {
          nav.removeClass('main_data_complements_option-active');
        }
      });

      switch ($(this).text()) {
        case EVENTS_NAV:
          events_window.addClass('main_data_complement-active');
          states_window.removeClass('main_data_complement-active');
          break;

        case STATES_NAV:
          events_window.removeClass('main_data_complement-active');
          states_window.addClass('main_data_complement-active');
          break;
      }

    });

    handle_events_hover();
    handle_states_hover();
  }

  function handle_codes_hover () {
    const counters_container      = $('#window_statecounters');

    counters_container.on('mouseleave', function () {

      $(this).scrollTop(0);
      $(this).scrollLeft(0);

    });
  }

  function construct_codes_list (states, state_values, state_names, monitoring_time) {

    let code_html = "";
    let time_html = "";
    let prop_html = "";
    let name_html = "";

    let processing_time = 0;
    let row_light = false;
    for (let state = 0; state < states; state ++) {

      code_html += `<p ${row_light ? 'class="row_light"' : ''}>D${state.toString().padStart(2, '0')}</p>`;
      time_html += `<p ${row_light ? 'class="row_light"' : ''} id="code_${state}">${SS_to_HHMMSS(state_values[state])}</p>`;
      prop_html += `<p ${row_light ? 'class="row_light"' : ''}>${state_values[state] > 0 ? ((state_values[state] / monitoring_time) * 100).toFixed(2) : "0.00"}%</p>`;
      name_html += `<p ${row_light ? 'class="row_light"' : ''}>${state_names[state]}</p>`;
      row_light = !row_light;

      if (state_names[state].includes('Processing')) {
        processing_time += state_values[state];
      }
    }

    $('#monitoring_time').text(SS_to_HHMMSS(monitoring_time));

    $('#codes_code').html(code_html);
    $('#codes_time').html(time_html);
    $('#codes_proportion').html(prop_html);
    $('#codes_name').html(name_html);

  }

  function handle_production_hover () {
    const production_container = $('.main_data_window_production');
    const production_container_clone = $('#main_data_window_production_clone');

    production_container.on('click', function () {

      if (width > 800) {
        const h = production_container.height();
        const top = production_container.offset().top + 1;

        production_container_clone.css({
          'height': h + 'px',
          'top': top + 'px',
        })

        production_container_clone.fadeIn(0);
      }

    });

    production_container_clone.on('mouseleave', function () {

      setTimeout(function () {
        production_container_clone.fadeOut(0);
        production_container_clone.scrollTop(0);
        production_container_clone.scrollLeft(0);
      }, 500);

      production_container.scrollTop(0);
      production_container.scrollLeft(0);

    });

    production_container.on('mouseleave', function () {
      
      $(this).scrollTop(0);
      $(this).scrollLeft(0);

    });
  }

  function construct_production_list (ProductionFile) {

    const prod_time         = [...ProductionFile.Time].reverse();
    const prod_worker       = [...ProductionFile.Worker].reverse();
    const prod_produced     = [...ProductionFile.Produced].reverse();
    const prod_accepted     = [...ProductionFile.Accepted].reverse();
    const prod_reworked     = [...ProductionFile.Reworked].reverse();
    const prod_defective    = [...ProductionFile.Defective].reverse();
    const prod_contaminated = [...ProductionFile.Contaminated].reverse();
    const prod_adjust       = [...ProductionFile.Adjust].reverse();
    
    let time_html         = "<p>Time</p>";
    let worker_html       = "<p>Worker</p>";
    let produced_html     = "<p>Produced</p>";
    let accepted_html     = "<p>Accepted</p>";
    let reworked_html     = "<p>Reworked</p>";
    let defective_html    = "<p>Defective</p>";
    let contaminated_html = "<p>Contaminated</p>";
    let adjust_html       = "<p>Adjust</p>";

    const size = prod_time.length;
    if (size > 0) {

      let row_light = true;

      for (let i = 0; i < size; i ++) {

        time_html         += `<p ${row_light ? 'class="row_light"' : ''}>${prod_time[i]}</p>`;
        worker_html       += `<p ${row_light ? 'class="row_light"' : ''}>${prod_worker[i]}</p>`;
        produced_html     += `<p ${row_light ? 'class="row_light"' : ''}>${prod_produced[i]}</p>`;
        accepted_html     += `<p ${row_light ? 'class="row_light"' : ''}>${prod_accepted[i]}</p>`;
        reworked_html     += `<p ${row_light ? 'class="row_light"' : ''}>${prod_reworked[i]}</p>`;
        defective_html    += `<p ${row_light ? 'class="row_light"' : ''}>${prod_defective[i]}</p>`;
        contaminated_html += `<p ${row_light ? 'class="row_light"' : ''}>${prod_contaminated[i]}</p>`;
        adjust_html       += `<p ${row_light ? 'class="row_light"' : ''}>${prod_adjust[i]}</p>`;

        row_light = !row_light;

      }

    } else {
      time_html         += "<p>--:--:--</p>";
      worker_html       += "<p>-</p>";
      produced_html     += "<p>-</p>";
      accepted_html     += "<p>-</p>";
      reworked_html     += "<p>-</p>";
      defective_html    += "<p>-</p>";
      contaminated_html += "<p>-</p>";
      adjust_html       += "<p>-</p>";
    }

    $('#production_time').html(time_html);
    $('#production_worker').html(worker_html);
    $('#production_produced').html(produced_html);
    $('#production_accepted').html(accepted_html);
    $('#production_reworked').html(reworked_html);
    $('#production_defective').html(defective_html);
    $('#production_contaminated').html(contaminated_html);
    $('#production_adjust').html(adjust_html);

    $('#production_time_clone').html(time_html);
    $('#production_worker_clone').html(worker_html);
    $('#production_produced_clone').html(produced_html);
    $('#production_accepted_clone').html(accepted_html);
    $('#production_reworked_clone').html(reworked_html);
    $('#production_defective_clone').html(defective_html);
    $('#production_contaminated_clone').html(contaminated_html);
    $('#production_adjust_clone').html(adjust_html);

  }

// Handle events list
  function handle_events_hover () {
    const events_container = $('.main_data_events_container');

    events_container.on('mouseleave', function () {

      $(this).scrollTop(0);
      $(this).scrollLeft(0);

    });
  }

  function construct_events_list (EventsFile) {
    const events_time   = [...EventsFile.Time].reverse();
    const events_event  = [...EventsFile.Event].reverse();

    let time_html = "<p>Time</p>";
    let desc_html = "<p>Event</p>";
    let row_light = true;
    for (let event = 0; event < events_time.length; event ++) {

      time_html += `<p ${row_light ? 'class="row_light"' : ''} >${events_time[event]}</p>`;
      desc_html += `<p ${row_light ? 'class="row_light"' : ''} >${events_event[event]}</p>`;
      row_light = !row_light;

    }

    $('#events_time').html(time_html);
    $('#events_event').html(desc_html);
  }

// Handle states list
  function handle_states_hover () {
    const states_container = $('.main_data_states_container');

    states_container.on('mouseleave', function () {

      $(this).scrollTop(0);
      $(this).scrollLeft(0);

    });
  }

  function construct_states_list (StatesFile, MainWorker) {
    const states_time       = [...StatesFile.Time].reverse();
    const states_worker     = [...StatesFile.Worker].reverse();
    const states_state      = [...StatesFile.State].reverse();
    const states_name       = [...StatesFile.Name].reverse();

    let time_html   = "<p>Time</p>";
    let worker_html = "<p>Worker</p>";
    let state_html  = "<p>State</p>";
    let name_html   = "<p>Name</p>";

    let row_light = true;
    for (let event = 0; event < states_time.length; event ++) {

      time_html   += `<p ${row_light ? 'class="row_light"' : ''}>${states_time[event]}</p>`;
      worker_html += `<p ${row_light ? 'class="row_light"' : ''}>${states_worker[event]}</p>`;
      state_html  += `<p ${row_light ? 'class="row_light"' : ''}>${states_state[event]}</p>`;
      name_html   += `<p ${row_light ? 'class="row_light"' : ''}>${states_name[event]}</p>`;

      row_light = !row_light;

    }

    $('#states_time').html(time_html);
    $('#states_worker').html(worker_html);
    $('#states_state').html(state_html);
    $('#states_name').html(name_html);

    let ignore = [0, 1, MainWorker];
    let reliefs = [...new Set(states_worker)].filter(n => !ignore.includes(n));
    $('#reliefs').html(reliefs.length > 0 ? reliefs.join(', ') : '-');
  }

// Handle inputs
  function handle_inputs_state (clean, inputs) {

    for (let input = 0; input < inputs.length; input ++) {

      if (inputs[input] && !clean) {
        $(`#input_${input}`).addClass(`main_data_input_${input}-active`);
        $(`#input_${input}`).removeClass(`main_data_input_${input}-inactive`);
      } else {
        $(`#input_${input}`).removeClass(`main_data_input_${input}-active`);
        $(`#input_${input}`).addClass(`main_data_input_${input}-inactive`);
      }

    }

  }

// Handle display
  function render_devices (senders_list, senders_dict) {

    const senders_list_lenght = senders_list.length;
    senders = [];

    if (senders_list_lenght > 0) {

      construct_senders_list(senders_dict);
      
      for (let id = 0; id < senders_list_lenght; id ++) {

        senders.push(senders_list[id] ? new Sender() : null);

      }

    } else {

      set_display('lock', 'Waiting Devices', true);

    }

  }

  function update_devices (senders_dict) {

    senders_dict.forEach((dict) => {
      let id = dict.DataFile.Sender;

      if (senders[id] != null) {
        senders[id].update_data(dict);
      }
    });

  }

  function on_set_display (action = 'lock', clean = false) {
    if (action === 'unlock') {
      $('.main_menu_devices li').removeClass('main_menu_device-disabled');
    }

    if (clean) {
      senders = [];
      sender_on_display = -1;
      clean_fields();
      $('.main_menu_devices').html("");
    } else if (action === 'lock') {
      $('.main_menu_devices li').addClass('main_menu_device-disabled');
    }
  }

  function update_display () {

    if (sender_on_display >= 0) {

      if (senders[sender_on_display] != null) {
        senders[sender_on_display].show();
      }

      setTimeout(function () {
        if (server.ws != null) {
          if (server.ws.readyState === WebSocket.OPEN) {
            set_display('unlock', 'Live Monitoring');
          }
        }
      }, 1000);

    }

  }

//! Handle switch between senders on display
  function construct_senders_list (senders_dict) {
    $('.main_menu_devices li').off('click');

    let list_content = "";

    senders_dict.forEach(sender => {

      let device_div = `
        <li class="main_menu_device main_menu_device-disabled" device="${sender.id}">
          <span title="${sender.machine}" class="symbols"> &#xe8c7; </span>
          <p class="device_name" id="sender_${sender.id}">${sender.machine}</p>
        </li>
      `;
      list_content += device_div;

    });

    $('.main_menu_devices').html(list_content);

    const first_device = $('.main_menu_devices li').eq(0);
    sender_on_display = parseInt(first_device.attr("device"), 10);
    first_device.addClass('main_menu_device-active');

    $('.main_menu_devices li').on('click', function () {

      if (!$(this).hasClass('main_menu_device-disabled')) {

        $('.main_menu_devices li').removeClass('main_menu_device-active');
        $(this).addClass('main_menu_device-active');

        let sender_clicked = parseInt($(this).attr("device"), 10);

        if (sender_clicked !== sender_on_display) {
          sender_on_display = sender_clicked;

          senders[sender_on_display].focus_flag = true;
          update_display();
        }

      }

      if (width < 800) {

        const main_menu = $('.main_menu');
        if (main_menu.hasClass('main_menu-hover')) {
  
          main_menu.removeClass('main_menu-hover');
          $('.main_menu span').removeAttr('style');
          $('.main_menu p').removeAttr('style');
          $('#main_menu_dark').fadeOut(100);
  
        }

      }

    });
  }

  class Sender {

    constructor() {
      this.data_file  = {};
      this.monitoring = false;
      this.online     = false;

      this.codes_file = {
        Name: []
      };
      this.codes_file_update = false;

      this.states_file = {
        Time      : [],
        State     : [],
        Name      : []
      };
      this.states_file_update = false;

      this.events_file = {
        Time  : [],
        Event : []
      };
      this.events_file_update = false;

      this.production_file = {
        Time          : [],
        Produced      : [],
        Defective     : [],
        Contaminated  : [],
        Adjust        : [],
      };
      this.production_file_update = false;

      this.indicators_file = {
        Timestamp   : [],
        DIS         : [],
        PER         : [],
        QUA         : [],
        OEE         : [],
        Measured    : [],
      };
      this.indicators_file_update = false;

      this.init_flag = true;

      this.focus_flag = false;
    }

    update_data (data) {
      this.data_file       = data.DataFile;
      $(`#sender_${this.data_file.Sender}`).text(this.data_file.Machine);
      let monitoring_now  = this.data_file.Monitoring;
      let online_now      = this.data_file.Online;

      if (this.monitoring != monitoring_now) {
        show_notification(`Device mode`, `Device of ${this.data_file.Machine} is ${monitoring_now ? 'monitoring' : 'in stand by'}`, 'e30a', monitoring_now ? 'green' : 'yellow');
      }
      

      if (!this.init_flag) {
        if (this.online != online_now) {
          show_notification(`Device status`, `Device of ${this.data_file.Machine} is ${online_now ? 'online' : 'offline'}`, online_now ? 'e9ba' : 'e30a', online_now ? 'green' : 'red');
        }
      } else if (this.init_flag) {
        this.init_flag = false;
      }

      this.monitoring = monitoring_now;
      this.online     = online_now;

      if(data.hasOwnProperty('CodesFile')) {
        this.codes_file         = data.CodesFile;
        this.codes_file_update  = true;
      }

      if(data.hasOwnProperty('StatesFile')) {
        this.states_file         = data.StatesFile;
        this.states_file_update  = true;
      }

      if(data.hasOwnProperty('EventsFile')) {
        this.events_file         = data.EventsFile;
        this.events_file_update   = true;
      }

      if(data.hasOwnProperty('ProductionFile')) {
        this.production_file         = data.ProductionFile;
        this.production_file_update   = true;
      }

      if(data.hasOwnProperty('IndicatorsFile')) {
        this.indicators_file         = data.IndicatorsFile;
        this.indicators_file_update   = true;
      }

    }

    show () {
      // General
      this.set_status_of('monitoring', this.monitoring, false);
      this.set_status_of('online', this.data_file.Online, false);
      this.set_status_of('battery', this.data_file.Battery, this.data_file.Charger);
      this.set_status_of('power', this.data_file.Power, false);

      this.set_status_of('tcp', this.data_file.TCP, false);
      this.set_status_of('interface', this.data_file.Interface, false);

      $('#ip').text(this.data_file.IP);
      $('#machine').text(this.data_file.Machine);
      $('#machine_area').text(this.data_file.MachineArea);
      $('#machine_desc').text(this.data_file.MachineDesc);

      $('#worker').text(`${this.data_file.Worker} for ${SHIFTS[this.data_file.Shift]}`);
      $('#order').text(this.data_file.Order);
      $('#product').text(this.data_file.Product);
      $('#group').text(this.data_file.Group);
      $('#client').text(this.data_file.Client);

      update_donut('oee_value', this.data_file.OEE / 100);

      // Disponibility
      update_donut('dis_value', this.data_file.DIS / 100);

      $('#state').text(`${this.data_file.State} ${this.codes_file.Name[parseInt(this.data_file.State.substring(1), 10)]}`);
      $('#event').text(this.data_file.Event);

      $('#start_cease_p').text(this.data_file.Monitoring ? 'Started at' : 'Finished at');
      $('#start_cease').text(this.data_file.Monitoring ? this.data_file.Start : this.data_file.Cease);

      // Codes
      construct_codes_list(this.data_file.States, this.data_file.StatesCounters, this.codes_file.Name, this.data_file.MonitoringT);
      
      // Performance
      update_donut('per_value', this.data_file.PER / 100);
      $('#standard').text(`${this.data_file.Standard} C/Hr`);
      $('#measured').text(`${this.data_file.Measured} C/Hr`);
      $('#cavities').text(`${this.data_file.Cavities} U/C`);
      $('#produced').text(`${this.data_file.Produced} U`);
      $('#card_produced').text(this.data_file.Produced);
      $('#toproduce').text(`${this.data_file.ToProduce} U`);

      // Production
      if (this.production_file_update || this.focus_flag) {
        this.production_file_update = false;
        construct_production_list(this.production_file);
      }

      // Quality
      update_donut('qua_value', this.data_file.QUA / 100);
      $('#accepted').text(`${this.data_file.Accepted} U`);
      $('#card_accepted').text(this.data_file.Accepted);

      $('#reworked').text(`${this.data_file.Reworked} U`);
      $('#card_reworked').text(this.data_file.Reworked);

      $('#defective').text(`${this.data_file.Defective} U`);
      $('#contaminated').text(`${this.data_file.Contaminated} U`);
      $('#adjust').text(`${this.data_file.Adjust} U`);
      $('#card_scrap').text(this.data_file.Defective + this.data_file.Contaminated + this.data_file.Adjust);

      // Inputs
      handle_inputs_state(false, this.data_file.Inputs);

      // Events
      if (this.events_file_update || this.focus_flag) {
        this.events_file_update = false;
        construct_events_list(this.events_file);
      }

      // States
      if (this.states_file_update || this.focus_flag) {
        this.states_file_update = false;
        construct_states_list(this.states_file, this.data_file.Worker);
      }

      // Graphic
      if (this.indicators_file_update || this.focus_flag) {
        this.indicators_file_update = false;
        update_graph(this.indicators_file, !this.data_file.Monitoring);
      }

      if (this.focus_flag) {
        this.focus_flag = false;
      }
    }

    set_status_of (id, value, charger) {

      switch (id) {

        case 'monitoring':

          $(`#${id}_p`).text(value ? 'Monitoring' : 'Stand by');

          if (value) {
            $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-ok');
            $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-bad');
          } else {
            $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-ok');
            $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-bad');
          }

          break;

        case 'online':

          $(`#${id}_p`).text(value ? 'Online' : 'Offline');

          if (value) {
            $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-ok');
            $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-bad');
          } else {
            $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-ok');
            $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-bad');
          }

          break;

        case 'battery':

          if (value > 0) {
            $(`#${id}_span`).html(charger ? '&#xe1a3;' : '&#xe1a4;');
            $(`#${id}_p`).text(`${(value / 1000).toFixed(2).padStart(5, '0')}V`);

            if (value >= 800) {
              $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-ok');
              $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-bad');
              $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-error');
            } else {
              $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-ok');
              $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-bad');
              $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-error');
            }
          } else {
            $(`#${id}_span`).html('&#xe19c;');
            $(`#${id}_p`).text('Disconnected');
            $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-ok');
            $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-bad');
            $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-error');
          }

          break;

        case 'power':

          if (value > 0) {
            $(`#${id}_span`).html('&#xe63c;');
            $(`#${id}_p`).text(`${(value / 1000).toFixed(2).padStart(5, '0')}V`);
            $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-ok');
            $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-error');
          } else {
            $(`#${id}_span`).html('&#xe646;');
            $(`#${id}_p`).text('Disconnected');
            $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-ok');
            $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-error');
          }

          break;

        case 'tcp':
          
          if (value) {
            $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-ok');
            $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-error');
          } else {
            $(`#${id}_span, #${id}_p`).removeClass('main_data_window_status-ok');
            $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-error');
          }

          break;

        case 'interface':
          $(`#${id}_span, #${id}_p`).addClass('main_data_window_status-info');

          if (value === 'WIFI' || value === 'WiFi') {
            $(`#${id}_span`).html('&#xe0e5;');
            $(`#${id}_p`).text('WiFi');
          } else {
            $(`#${id}_span`).html('&#xeb2f;');
            $(`#${id}_p`).text('ETHERNET');
          }

          break;

      }


    }

  }

  function clean_fields () {
    // General
    $('#monitoring_span, #monitoring_p').removeClass('main_data_window_status-ok');
    $('#monitoring_span, #monitoring_p').removeClass('main_data_window_status-bad');

    $('#online_span, #online_p').removeClass('main_data_window_status-ok');
    $('#online_span, #online_p').removeClass('main_data_window_status-bad');

    $('#battery_group').prop('title', 'Battery state');
    $('#battery_span, #battery_p').removeClass('main_data_window_status-ok');
    $('#battery_span, #battery_p').removeClass('main_data_window_status-error');

    $('#power_group').prop('title', 'Power Supply state');
    $('#power_span, #power_p').removeClass('main_data_window_status-ok');
    $('#power_span, #power_p').removeClass('main_data_window_status-error');

    $('#interface_span, #interface_p').removeClass('main_data_window_status-info');

    $('#tcp_span, #tcp_p').removeClass('main_data_window_status-ok');
    $('#tcp_span, #tcp_p').removeClass('main_data_window_status-error');

    $('#ip').text('0.0.0.0');
    $('#machine').text('-');
    $('#machine_area').text('-');
    $('#machine_desc').text('-');

    $('#worker').text('- for -');
    $('#order').text('-');
    $('#product').text('-');

    update_donut('oee_value', 0.0);

    // Disponibility
    update_donut('dis_value', 0.0);

    $('#state').text('D-- -');
    $('#event').text('--:--:--');

    $('#start_cease_p').text('Started at');
    $('#start_cease').text('--:--:--');

    // Codes
    construct_codes_list(0, [], [], 0, 0, 0);

    // Performance
    update_donut('per_value', 0.0);
    $('#standard').text('- C/Hr');
    $('#measured').text('- C/Hr');
    $('#cavities').text('- U/C');
    $('#produced').text('- U');
    $('#toproduce').text('- U');

    // Production
    construct_production_list({Time:[], Worker:[], Produced:[], Accepted:[], Reworked:[], Defective:[], Contaminated:[], Adjust:[]});

    // Quality
    update_donut('qua_value', 0.0);
    $('#accepted').text('- U');
    $('#defective').text('- U');
    $('#contaminated').text('- U');
    $('#adjust').text('- U');

    // Inputs
    handle_inputs_state(true, [false, false, false, false, false, false]);

    // Events
    construct_events_list({Time:[], Event:[]});

    // States
    construct_states_list({Time:[], Worker:[], State:[], Name:[]}, 0);

    // Graphic
    update_graph({Timestamp: [0], DIS: [0.0], PER: [0.0], QUA: [0.0], OEE: [0.0], Measured: [0]}, true);

  }

let senders = [];
let sender_on_display = -1;