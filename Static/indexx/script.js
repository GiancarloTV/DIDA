
// Main
  $(document).ready(async function() {
    // Body
    (async function() {

      await handle_server_config();

      if (server_config) {
        
        if (server_config['MAINTENANCE'] === true) {
          $('#status').text('Sorry, we are under maintenance.');
        } else {
          $('#status').text('Redirecting');
          setTimeout(function() {
            window.location.href = '/home';
          }, 2000);
        }
      }

    })();
  });