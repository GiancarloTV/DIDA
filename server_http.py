"""
@file server_http.py
@brief HTTP server for KPI SYSTEM
@author Ing Giancarlo TV
@date Last revision: September 19th 2025
@copyright (c) 2025 by Giancarlo TV. DIDA GROUP
"""

#---------------RESOURCES---------------
try:
    from gevent import monkey
    monkey.patch_all()

    # IMPORT COLORS
    from constants import (TAB1, TAB2, TAB3, BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, SYS, HTTP)
    # IMPORT RESOURCES NAMES
    from constants import SystemPaths
    from constants import WindowNames
    from constants import Mode

    # IMPORT SYSTEM RESOURCES
    from functions import (color, welcome, get_date, get_directory_path, verify_path, construct_path, read_file, write_file, log, set_title)
    from functions import SystemClass
    from functions import NetworkClass

    from time import sleep as wait
    import json

    # IMPORT RESOURCES FOR SERVER SYSTEM
    import mimetypes
    from bottle import (Bottle, run, template, static_file, response, request, redirect, abort, TEMPLATE_PATH)

except ImportError as e:
    print(f"[SYS] Resource error: {e}")
    input("[SYS] Press enter to close...")

# ----------------SERVER-----------------
TEMPLATE_PATH.insert(0, get_directory_path(directory='Views'))

app = Bottle()
app.config['ENV'] = 'production'


server_port: int = 0
sys_version: dict = {}

def start_server (ip: list[(str)], port: int):
    global app
    global system

    log(TAB1, SYS, f"HTTP server started on port {port}", BLUE, True)

    for interface in ip:
        log(TAB2, "", f"http://{interface}:{port}/", BLACK)

    run(app=app, host='0.0.0.0', port=port, quiet=True, debug=True, server='gevent')

def server_request (begin_endline: bool = False) -> None:
    log(TAB1, HTTP, f"{get_date('%H:%M:%S %d/%m/%Y')} ({request.remote_addr}) ({request.method}) ({request.path})", BLACK, begin_endline)

def enable_cors(fn):
    def _enable_cors(*args, **kwargs):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Cache-Control'

        if request.method == 'OPTIONS':
            response.status = 200
            return ''
        
        return fn(*args, **kwargs)
    return _enable_cors

@app.hook('before_request')
def check_valid_http():
    
    valid_methods = {'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'}
    try:
        content_length = request.headers.get('Content-Length', '0')
        content_length = int(content_length)

        if request.method not in valid_methods:
            log(TAB1, HTTP, f"Invalid HTTP method: {request.method} from {request.remote_addr}", RED, True)
            abort(400, "Bad Request")

        http_version = request.environ.get('SERVER_PROTOCOL', '')
        if not http_version.startswith('HTTP/1.'):
            log(TAB1, HTTP, f"Invalid HTTP version: {http_version} from {request.remote_addr}", RED, True)
            abort(400, "Invalid HTTP version")

    except ValueError:
        log(TAB1, HTTP, "Invalid Content-Length header", RED)
        return abort(400, "Bad Request: Invalid Content-Length")
    
    except Exception as e:
        log(TAB1, HTTP, f"Error in request validation: {e}", RED)
        abort(400, "Bad Request")

@app.hook('after_request')
def add_ngrok_skip_header():
    try:
        response.set_header('ngrok-skip-browser-warning', '1')
    except Exception:
        pass

#todo -------------------MAIN WEB PAGES-----------------
@app.route('/')
def index():
    server_request(True)

    return template('index')

@app.route('/home')
def home():
    server_request(True)

    return template('home')

@app.route('/lol')
def lol():
    server_request(True)

    return template('1009_amsc')


#! -------------------ERROR WEB PAGE----------------
@app.error(code=500)
def error_500(error):
    return template('error', error_message = f"Error interno del servidor: {error}", error_code = 500)

@app.error(code=404)
def error_404(error):
    return template('404', error_message = "Página no encontrada", error_code = 404)


#* -------------------COMPANY----------------
@app.route('/company/config', method='GET')
def company_load():
    server_request(True)
    company_name = "Company Name"
    company_logo = "/static/base/DIDA.png"

    name_path = construct_path(part_one=get_directory_path(directory='Static'), part_two='company/name.txt')
    logo_path = construct_path(part_one=get_directory_path(directory='Static'), part_two='company/logo.png')

    if verify_path(name_path):
        name_data = read_file(path=name_path)
        if name_data is not None and len(name_data) > 0:
            company_name = name_data

    if verify_path(logo_path):
        company_logo = "/static/company/logo.png"

    return {
        "Name"  : company_name,
        "Logo"  : company_logo
    }

@app.route('/company/config', method='POST')
def company_update():
    server_request(True)

    company_name = request.forms.get('name')
    company_logo = request.files.get('logo')

    if company_name:
        write_file(path='./Static/company/name.txt', data=company_name)
        log(TAB2, "", f"Company name updated: {company_name}", MAGENTA)

    if company_logo:
        company_logo.save('./Static/company/logo.png', overwrite=True)
        log(TAB2, "", "Company logo updated", MAGENTA)

    if company_name or company_logo:
        return {
            'Success'   : True
        }
    
    log(TAB2, "", "Error, empty data", RED)
    return {
        'Success'   : False,
        'Error'     : 'Empty data'
    }


#* -------------------FORM----------------
@app.route('/form/contact', method=['POST', 'OPTIONS'])
@enable_cors
def contact_form():
    server_request(True)

    name     = request.json.get('name')
    company  = request.json.get('company')
    email    = request.json.get('email')
    phone    = request.json.get('phone')
    message  = request.json.get('message')

    if name and company and email and phone:
        response.status = 200
        return system.users_add(name=name, company=company, email=email, phone=phone, message=message)

    response.status = 400
    log(TAB2, "", "Error, empty data", RED)
    return {'error': 'Empty form data'}

#? -------------------RESOURCES----------------
@app.route('/Static/favicon.ico')
def favicon():
    server_request()
    return static_file('favicon.ico', root=f'./Static/')

@app.route('/<folder:path>/<filename:path>', method=['GET', 'OPTIONS'])
def serve_static_base(folder, filename):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Cache-Control'

    server_request()
    
    if request.method == 'OPTIONS':
        response.status = 200
        return ''
    
    # cache_time = 604800
    cache_time = 0

    file_path = f"./{folder}/{filename}"

    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type is None:
        mime_type = 'application/octet-stream'

    try:

        with open(file_path, 'rb') as file:
            content = file.read()

        response.content_type = mime_type
        response.set_header('Cache-Control', f"public, max-age={cache_time}")
        return content
    
    except Exception as e:
        response.status = 404
        return f'File not found: {filename}'
    
@app.route('/Static/<page:path>/<filename:path>', method=['GET', 'OPTIONS'])
def serve_static(page, filename):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Cache-Control'

    server_request()
    
    if request.method == 'OPTIONS':
        response.status = 200
        return ''
    
    # cache_time = 604800
    cache_time = 0

    file_path = f"./Static/{page}/{filename}"

    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type is None:
        mime_type = 'application/octet-stream'

    try:

        with open(file_path, 'rb') as file:
            content = file.read()

        response.content_type = mime_type
        response.set_header('Cache-Control', f"public, max-age={cache_time}")
        return content
    
    except Exception as e:
        response.status = 404
        return f'File not found: {filename}'


#todo ------------------MAIN-----------------
if __name__ == '__main__':
    error: bool = False
    set_title("APP WEB HTTP")

    try:
        welcome(window=WindowNames.SRVR_HTTP)

        log(TAB1, SYS, "Verifying resources", BLACK, True)
        system = SystemClass(window=WindowNames.SRVR_HTTP)
        system.verify_resources()

        config_file = system.server_config()
        server_port = config_file["HTTP_PORT"]

        sys_version = system.read_write_file(file_name=SystemPaths.VERSION, mode=Mode.READ)

        network = NetworkClass()
        network.loop = True
        network.verify_connection()

        start_server(ip=network.ip, port=server_port)

    except KeyboardInterrupt as e:
        log(TAB1, SYS, "Aborted", RED, True)

    except Exception as e:
        log(TAB1, SYS, f"Fatal error: {e}", RED, True)
        error = True
        # system.server_exception(error=f"HTTP > {str(e)}")
        import traceback
        traceback.print_exc()

    finally:

        if app:
            app.close()
            log(TAB1, SYS, "Server finished", BLUE, True)

        if error:
            input(f"\n{TAB1}{SYS} {color("Press enter to close...", YELLOW)}")

        log("", "", "Server window finished", BLACK, True)