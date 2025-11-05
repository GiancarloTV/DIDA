// Main
  $(document).ready(async function() {
    // Body
    handle_resize();
    // handle_notifications();
    // handle_company();
    // Menu
    handle_menu_hover();
    // handle_session();
    // handle_pages_button();
    // handle_theme();
    // show_time();
    // setInterval(show_time, 1000);
    // Main
    // clean_fields();
    // handle_graphic_hover();
    // handle_navegator();
    // handle_complements_navegator();
    // Events
    // $(window).on("focus", function() {
    //   console.log("%c[WINDOW] Focus", BLACK);
    //   valid_session();
    // });
  });

// Handle body
  function on_resize (width_new, width_pre) {
    if (width_new - width_pre > 50 || width_pre - width_new > 50) {
      // setTimeout(function () {
      //   resize_charts();
      // }, 600);
    }

    // resize_charts();
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