
// Main
  $(document).ready(async function() {
    
    while (true) {

      (async function() {
  
        await handle_server_config();
  
        if (server_config) {
          
          if (server_config['MAINTENANCE'] === true) {
            $('#status').text('Lo sentimos, la página solicitada se encuentra en mantenimiento.');
          } else {
            $('#status').text('Redirigiendo...');
            setTimeout(function() {
              window.location.href = '/home';
            }, 2000);
          }
        }
  
      })();

      await new Promise(resolve => setTimeout(resolve, 10000));
    }

  });