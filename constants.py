"""
@file constants.py
@brief Constats for WEB PAGE
@author Ing Giancarlo TV
@date Last revision: October 29th 2025
@copyright (c) 2024 by Giancarlo TV. DIDA GROUP
"""


# COLORS
BLACK   = 'black'    # Black color
RED     = 'red'      # Red color
GREEN   = 'green'    # Green color
YELLOW  = 'yellow'   # Yellow color
BLUE    = 'blue'     # Blue color
MAGENTA = 'magenta'  # Magenta color
CYAN    = 'cyan'     # Cyan color
WHITE   = 'white'    # White color
RESET   = 'reset'    # Reset color

# Tabs for formatting
TAB1    = '    '
TAB2    = '          ' 
TAB3    = '               '


# WINDOWS
class WindowNames:
    APP         =   'app'           # Main app window
    SRVR_HTTP   =   'server_http'   # HTTP server window
    INIT        =   'init'          # Initialization event
    REINIT      =   'reinit'        # Reinitialization event


# FILETYPE
class FileType:
    TEXT    = 'txt'         # Text file
    JSON    = 'json'        # JSON file
    CSV     = 'csv'         # CSV file
    JAVASCRIPT  = 'js'      # JavaScript file
    STYLESHEET  = 'css'     # CSS file
    IMAGE       = 'png'     # PNG image file
    DATABASE    = 'db'      # Database file


# OPEN MODE
class Mode:
    WRITE   = 'w'   # Write mode
    READ    = 'r'   # Read mode


# PATHS
class SystemPaths:
    SYS         = 'Sys'             # System folder
    EXCEPTIONS  = 'Exceptions.txt'  # Exceptions file
    CONFIG      = 'Config.json'     # Configuration file
    VERSION     = 'Version.json'    # Version file


# System log tags
SYS     = '\033[90m [SYS]\033[0m'    # System tag
HTTP    = '\033[36m[HTTP]\033[0m'    # HTTP tag


# NETWORK
NETWORK_TIMEOUT = 300     # Network timeout in seconds
PING_TIMEOUT = 30         # Ping timeout in seconds

# ROOT
REPOSITORY = "DIDA"  # Repository name