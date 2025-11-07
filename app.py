"""
@file app.py
@brief Main application window for WEB PAGE
@author Ing Giancarlo TV
@date Last revision: October 29th 2025
@copyright (c) 2024 by Giancarlo TV. DIDA GROUP
"""

#---------------RESOURCES---------------
try:

    # IMPORT CONSTANTS
    from constants import (TAB1, TAB2, TAB3, BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, SYS, NETWORK_TIMEOUT)
    # IMPORT RESOURCES NAMES
    from constants import SystemPaths
    from constants import WindowNames
    from constants import Mode
    # IMPORT SYSTEM RESOURCES
    from functions import (color, welcome, get_date, construct_path, read_file, log, set_title, upload_file)
    from time import sleep as wait
    from time import time as elapsed
    from datetime import datetime, timedelta
    import sys
    # IMPORT OBJECTS
    from functions import SystemClass
    from functions import NetworkClass
    from functions import WindowClass

except ImportError as e:
    print(f"[SYS] Resource error: {e}")
    input("[SYS] Press enter to close...")


#----------------OBJECTS----------------
window: (WindowClass | None)    = None
system: (SystemClass | None)    = None
network : (NetworkClass | None) = None

sync: bool = False

#------------------MAIN-----------------

if __name__ == "__main__":
    error: bool = False
    close_window: bool = False

    set_title("KPI SYSTEM")

    try:
        welcome()

        log(TAB1, SYS, "Verifying resources", BLACK, True)
        system = SystemClass(window=WindowNames.APP)
        system.verify_resources()

        config_file = system.server_config()

        http_port   = config_file["HTTP_PORT"]
        sync        = config_file["SYNC"]
        
        log(TAB1, SYS, "Checking network connection", BLACK, True)
        network = NetworkClass()
        network.verify_connection()
        network.loop = True

        if not network.check_port(port=http_port):
            raise OSError(f"Port {http_port} for HTTP server is unavailable")

        window = WindowClass()

        log(TAB1, SYS, "Starting subprocesses", BLACK, True)
        window.start(window=WindowNames.SRVR_HTTP)
        wait(2)

        elapsed_sec: int = 0
        elapsed_now: int = elapsed()
        elapsed_pre: int = elapsed_now

        network_state_now: bool = True
        network_state_pre: bool = True

        # LOOP
        while True:

            network_state_now = network.verify_connection()
            if network_state_now != network_state_pre:
                log(TAB1, SYS, f"Network {'reconnected' if network_state_now else 'disconnected'} {get_date()}", CYAN if network_state_now else RED, True)

                if network_state_now:
                    elapsed_sec = 0

                    window.start(window=WindowNames.SRVR_HTTP, event=WindowNames.REINIT)
                    wait(2)

                else:
                    if window.status(window=WindowNames.SRVR_HTTP) is not None:
                        window.close(window=WindowNames.SRVR_HTTP)
                        wait(1)

                network_state_pre = network_state_now
            
            elapsed_now = elapsed()
            if not network_state_now:
                elapsed_pre = elapsed_now
                elapsed_sec = elapsed_sec + 1

                if elapsed_sec > NETWORK_TIMEOUT:
                    raise Exception("Network Connection Timeout")

            if window.any_open():
                    
                if window.status(window=WindowNames.SRVR_HTTP):
                    if window.alive(window=WindowNames.SRVR_HTTP) is None:
                        raise Exception(f'Window {WindowNames.SRVR_HTTP} in window.alive() error')

            if system.server_exception():
                error_text = system.exceptions_text

                if error_text == 'upload':
                    config_file = system.server_config()
                    sync        = config_file["SYNC"]
                    
                    system.read_write_file(SystemPaths.EXCEPTIONS, '')
                    log(TAB1, SYS, "New user registered", CYAN, True)

                    if sync:
                        log(TAB1, SYS, "Uploading users to server", BLACK, True)
                        upload_file(token=system.read_license(), local_path=system.users_path, repo_path='Sys/Users.csv', commit_comment="New User Added", overwrite=True)
                else:
                    raise Exception(error_text)
            
            wait(1)
        
    except KeyboardInterrupt:
        log(TAB1, SYS, "Aborted", RED, True)

    except Exception as e:
        log(TAB1, SYS, f"Fatal error: {e}", RED, True)
        error = True

        import traceback
        traceback.print_exc()

    finally:

        if window is not None:
            if window.any_open():
                log(TAB1, SYS, "Closing subprocesses", BLACK, True)
                wait(1)

                if window.status(window=WindowNames.SRVR_HTTP) is not None:
                    window.close(window=WindowNames.SRVR_HTTP)
                    wait(1)
        
        if error:
            input(f"\n{TAB1}{SYS} {color("Press enter to close...", YELLOW)}")

        log("", "", "System finished", BLACK, True)

        if close_window:
            sys.exit()