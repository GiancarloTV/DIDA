
"""
@file functions.py
@brief System functions and classes to use in the WEB PAGE
@author Ing Giancarlo TV
@date Last revision: October 29th 2025
@copyright (c) 2025 by Giancarlo TV. DIDA GROUP
"""

# IMPORT COLORS
from constants import (TAB1, TAB2, TAB3, BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE, RESET, SYS, HTTP, REPOSITORY)
# IMPORT RESOURCES NAMES
from constants import WindowNames
# IMPORT TYPEFILES
from constants import FileType
# IMPORT PATH NAMES
from constants import SystemPaths
# GENERAL FUNCTIONS
from datetime import datetime
# VARTYPES
from constants import Mode
from pandas.core.frame import DataFrame
from subprocess import Popen
import traceback

#? REPOSITORY
import requests
import base64


def upload_folder (token: str, local_path: str, repo_path: str, commit_comment: str, begin_enline: bool = True) -> bool:
    log(TAB2, "", f"Uploading {local_path} to {REPOSITORY}/{repo_path}", BLACK, begin_enline)

    for root, dirs, files in os.walk(local_path):
        for file_name in files:
            file_path = construct_path(part_one=root, part_two=file_name)
            relative_path = os.path.relpath(file_path, local_path)

            github_file_path = construct_path(part_one=repo_path, part_two=relative_path).replace("\\", "/")
            upload_file(token=token, local_path=file_path, repo_path=github_file_path, commit_comment=commit_comment)

def upload_file (token: str, local_path:str, repo_path:str, commit_comment:str, overwrite: bool = False):
    try:
        url = f"https://api.github.com/repos/GiancarloTV/{REPOSITORY}/contents/{repo_path}"

        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json"
        }

        sha = None
        response_get = requests.get(url, headers=headers)
        if response_get.status_code == 200:
            if overwrite:
                sha = response_get.json().get("sha")
            else:
                log(TAB2, "", f" Skipped  {local_path} to {REPOSITORY}/{repo_path}", BLACK)
                return

        with open(local_path, "rb") as file:
            content = file.read()
            content_encoded = base64.b64encode(content).decode('utf-8')

        data = {
            "message": commit_comment,
            "content": content_encoded
        }

        if sha:
            data['sha'] = sha

        response = requests.put(url=url, headers=headers, json=data)

        code = response.status_code

        log(TAB2, "", f"Uploaded: {local_path} to {REPOSITORY}/{repo_path}", GREEN if (code == 200 or code == 201) else RED)
    
    except requests.RequestException as e:
        log(TAB2, "", f"Upload error: {local_path} to {REPOSITORY}/{repo_path} {e}", RED)

    except Exception as e:
        log(TAB2, "", f"File error: {local_path}: {e}", RED) 

# GENERAL

def color(text: str, color: str, end: str = RESET) -> str:

    colors = {
        RESET     : '\033[0m',
        BLACK     : '\033[90m',
        RED       : '\033[31m',
        GREEN     : '\033[32m',
        YELLOW    : '\033[33m',
        BLUE      : '\033[34m',
        MAGENTA   : '\033[35m',
        CYAN      : '\033[36m',
        WHITE     : '\033[37m'
    }
    
    return f"{colors[color]}{text}{colors[end]}"

def log (tab: str, source: str, text: str, style: str, begin_endline: bool = False) -> None:
    print(f"{'\n' if begin_endline else ''}{tab}{source} {color(text=text, color=style)}")

def welcome(window: WindowNames = WindowNames.APP) -> None:

    word = 'DIDA'
    print(f"\n{word:>30}{color("GROUP", RED)}")

    if window == WindowNames.APP:
        word = 'APPWEB'
        print(f"\n{word:>30}{color("SYSTEM", CYAN)}")
        log("", "", "System started  Close: [Ctrl+C]", BLACK, True)

    elif window == WindowNames.SRVR_HTTP:
        word = 'APPWEB'
        print(f"\n{word:>30}{color("HTTP", YELLOW)}")
        log("", "", "Server window started", BLACK, True)

    else:
        raise Exception(f"Window {window} error on welcome()")

def clean_lines(lines: int) -> None:
    """
    Description:
    This function clears the specified number of lines from the console, moving the cursor up and deleting each line.

    Parameters:
    lines (int): The number of lines to clear from the console.

    """
    
    for _ in range(lines):
        print("\033[F\033[K", end='')

def get_date(format: str = '%H:%M:%S %d/%m/%Y') -> str:
    """
    Description:
    This function returns the current date and time formatted according to the specified format string.

    Parameters:
    format (str): A string specifying the format in which to return the current date and time. This follows the directives used by the strftime function in Python's datetime module.

    Return:
    str: The current date and time as a string, formatted according to the given format.
    """
    
    now = datetime.now()
    return now.strftime(format)

def ss_hhmmss (seconds: int, formated_24: bool = True) -> str:
    hours: int = (seconds // 3600) % 24 if formated_24 else seconds // 3600
    minutes: int = (seconds % 3600) // 60
    seconds_: int = seconds % 60

    return f'{hours:>02}:{minutes:>02}:{seconds_:>02}'

def get_type(var) -> None:
    """
    Description:
    This function prints the type of a given variable in a formatted string.

    Parameters:
    var: The variable whose type is to be determined and printed.

    """
    
    var_type = type(var)
    log(TAB1, SYS, f"{var=} {var_type=}", BLUE)

# PATH FUNCTIONS
import os
import sys
import shutil
import json
import pandas as pd

def set_title (title: str):
    os.system("cls")
    os.system(f"title {title}")

def verify_path(path: str, dir: bool = False) -> bool:
    """
    Verify if a file or directory exist

    Parameter:
    path (str): path of file or directory
    dir (bool): indicates if the path is a directory

    Return:
    bool: Return the result of `os.path.exists()`
    """

    if dir:
        return os.path.isdir(path)
    
    return os.path.exists(path)

def delete_path (path: str, dir: bool = False) -> bool:
    """
    Remove a file or directory

    Parameters:
    path (str): Path of file or directory

    Returns:
    bool: Return the result of `verify_path()` for path deleted
    """

    if verify_path(path=path):
        while True:
            try:
                if dir:
                    shutil.rmtree(path)
                    break

                os.remove(path)
                break

            except PermissionError as e:
                log(TAB1, SYS, f"Warning: {e}", YELLOW)

    return not verify_path(path=path)

def construct_path (part_one: str, part_two: str) ->str:
    return os.path.join(part_one, part_two)


def get_directory_path (directory: str) -> (str | None):
    """
    Gets the absolute path to a directory, works both for development and for the packaged environment with PyInstaller

    Parameters:
    directory (str): The name of the directory

    Returns:
    str: The absolute path of the directory
    """

    try:
        base_path = sys._MEIPASS
    except AttributeError:
        base_path = os.path.abspath(os.path.dirname(__file__))
    
    complete_path = os.path.join(base_path, directory)

    if verify_path(path=complete_path):
        return complete_path
    
    return None

def get_file_path(file: str) -> (str | None):
    """
    Gets the absolute path to a resource, works both for development and for the packaged environment with PyInstaller

    Parameters:
    file (str): The name of the file

    Returns:
    str: The absolute path of the file
    """

    try:
        base_path = sys._MEIPASS
    except AttributeError:
        base_path = os.path.abspath(os.path.dirname(__file__))
    
    complete_path = os.path.join(base_path, file)

    if verify_path(path=complete_path):
        return complete_path
    
    return None

def get_file_type(path: str) -> FileType:
    """
    Returns the file extension given the path.
    
    Parameter:
    path (str): The path of the file.
    
    Returns:
    str: The file extension.
    
    Raises:
    ValueError: If the path does not contain a file extension.
    """

    parts = path.split('.')
    if len(parts) == 1:
        raise ValueError("The path does not contain a file extension.")
    
    file_extension = parts[-1]
    
    if not file_extension:
        raise ValueError("The path does not contain a file extension.")
    
    if file_extension == FileType.TEXT:
        return FileType.TEXT
    
    elif file_extension == FileType.JSON:
        return FileType.JSON
    
    elif file_extension == FileType.CSV:
        return FileType.CSV
    
    else:
        raise Exception(f"File type not supported on get_file_type({path=})")


def create_directory (directory: str) -> bool:
    """
    Make a directory with name specific

    Parameters:
    directory (str): Name of new directory

    Returns:
    bool: Return the result of `verify_path()` for the new directory
    """

    try:
        base_path = sys._MEIPASS
    except AttributeError:
        base_path = os.path.abspath(".")
    
    complete_path = os.path.join(base_path, directory)

    os.makedirs(complete_path, exist_ok=True)

    return verify_path(path=complete_path)

def create_file(directory: str, name: str, init: (str | dict | DataFrame)) -> bool:
    """
    Write a file with a specific name and file type.

    Parameters:
    directory (str): The directory where the new file will be created.
    name (str): The name of the new file.
    init (str | dict | DataFrame): The initial data to be written into the file.

    Returns:
    bool: Returns the result of the `verify_path()` function for the new file.
    """
    
    complete_path = os.path.join(directory, name)
    file_type = get_file_type(complete_path)

    if file_type == FileType.TEXT:
        with open(complete_path, 'w') as file:
            file.write(str(init))

    elif file_type == FileType.JSON:
        with open(complete_path, "w") as file:
            json.dump(init, file, indent=2)

    elif file_type == FileType.CSV:
        init.to_csv(complete_path, index=False)

    else:
        raise Exception(f"File type not supported on create_file({directory=}, {name=})")

    return verify_path(path=complete_path)


def read_file(path: str, columns_selected = None) -> (str | dict | DataFrame | None):
    """
    Read a file from the specified path.

    Parameters:
    path (str): The path to the file to be read.

    Returns:
    str | dict | DataFrame | None: The data read from the file. The return type depends on the file type:
        - If 'TEXT': Returns a string containing the file's contents.
        - If 'JSON': Returns a Python dictionary representing the JSON data.
        - If 'CSV': Returns a pandas DataFrame containing the CSV data.
        - None if the file has not content

    Raises:
    Exception: If the file type is not recognized or if the specified path is None.
    """
    data: (str | dict | DataFrame | None) = None

    if verify_path(path=path):
        file_type = get_file_type(path=path)

        if file_type == FileType.TEXT:
            try:
                with open(path, "r") as file:
                    data = file.read()

                return data
            except Exception as e:
                return None

        elif file_type == FileType.JSON:
            try:
                with open(path, "r") as file:
                    data = json.load(file)

                return data
            except Exception as e:
                return None

        elif file_type == FileType.CSV:
            try:
                if columns_selected is None:
                    return pd.read_csv(path)

                return pd.read_csv(path, usecols = columns_selected)
            
            except Exception as e:
                return None

        elif file_type == FileType.DATABASE:
            try:
                import sqlite3

                conn = sqlite3.connect(path)
                return conn

            except Exception as e:
                return None

        else:
            raise Exception(f"File type not supported on read_file({path=})")
        
    return None

def write_file(path: str, data: (str | dict | DataFrame)) -> None:
    """
    Write data to a file specified by the path.

    Parameters:
    path (str): The path to the file to which data will be written.
    data (str | dict | DataFrame): The data to be written into the file.

    Raises:
    Exception: If the file type is not recognized or if the specified path does not exist.
    """
        
    file_type = get_file_type(path=path)

    if file_type == FileType.TEXT:
        
        try:
            with open(path, "w") as file:
                file.write(data)
        except Exception as e:
            return None

    elif file_type == FileType.JSON:
        try:
            with open(path, "w") as file:
                json.dump(data, file, indent=2)
        except Exception as e:
            return None

    elif file_type == FileType.CSV:
        try:
            data.to_csv(path, index=False)
        except Exception as e:
            return None

    else:
        raise Exception(f"File type not supported on write_file({path=})")

# ----------------NETWORK----------------
from psutil import net_if_addrs
import subprocess
import socket

class NetworkClass:

    def __init__ (self) -> None:
        self.interfaces = []
        self.ip = []

        self.loop = False

    def verify_connection (self) -> bool:
        interfaces = self.get_interfaces()

        if interfaces is not None:
            return self.get_interface_connected(interfaces)

        if self.loop:
            return False
        else:
            raise Exception("No network connected")

    def get_interfaces (self) -> (list | None):
        try:
            result = subprocess.run(['netsh', 'interface', 'show', 'interface'], capture_output=True, text=True)

            lines = result.stdout.splitlines()
            lines = lines[3:(len(lines) - 1)]
            lines = [line.split() for line in lines]

            if len(lines) <= 0:
                return None

            interfaces = []
            for line in lines:
                interface = [' '.join(line[3:]), line[0], line[1]]
                interfaces.append(interface)

            return interfaces
        
        except Exception as e:
            return None

    def get_interface_connected (self, interfaces: list[(str)]) -> bool:
        wifi_interfaces = ['wifi', 'wi-fi', 'Wi-Fi', 'WIFI']
        ethernet_interfaces = ['ethernet', 'ETHERNET', 'Ethernet']
        notallowed_interfaces = ['Virtual', 'virtual', 'Box', 'box', 'VirtualBox', 'virtualbox']

        some_connection = False

        for interface in interfaces:
            allowed: bool = True

            for notallowed in notallowed_interfaces:
                if notallowed in interface[0]:
                    allowed = False
                    break

            if allowed and (interface[1] == 'Enable' or interface[1] == 'Habilitado') and (interface[2] == "Connected" or interface[2] == 'Conectado'):
                
                if not self.loop:
                    log(TAB2, "", f"Connection by {interface[0]} interface", GREEN)

                self.interfaces.append(interface[0])

                for wifi_interface in wifi_interfaces:
                    if wifi_interface in interface[0]:

                        ip = self.get_IP(interface=interface[0])
                        self.ip.append(ip)

                        if not self.loop:
                            if self.ip:
                                log(TAB3, "", f"  IP: {ip}", GREEN)
                            else:
                                log(TAB3, "", "Error to get WiFi details", YELLOW)

                        some_connection = True

                for ethernet_interface in ethernet_interfaces:
                    if ethernet_interface in interface[0]:

                        ip = self.get_IP(interface=interface[0])
                        self.ip.append(ip)

                        if not self.loop:
                            if self.ip:
                                log(TAB3, "", f"  IP: {ip}", GREEN)
                            else:
                                log(TAB3, "", "Error to get Ethernet details", YELLOW)

                        some_connection = True
                    
                if not self.loop and not some_connection:
                    log(TAB2, "", f"Error to get interface details from {interface[0]}", YELLOW)
            
        return some_connection

    def get_IP (self, interface: str, format: str = 'str') -> (str | bytes | None):
        """
        Consult IP device in network connected

        Parameters:
        format (str): Formate to return str or byte

        Returns:
        str | bytes | None: Returns IP in str or bytes format and None if there is not connection
        """
        try:
            result = subprocess.run(["netsh", "interface", "ip", "show", "config", f"name={interface}"], capture_output=True, text=True)
            lines = result.stdout.splitlines()

            interface_ip = lines[3].split(':')[1].strip()
            
            return interface_ip if format == "str" else socket.inet_aton(interface_ip)

        except Exception:
            return None

        if self.interface_type == 'WiFi':
            wifi_ip = None
            interfaces = net_if_addrs()
            for interface, snics in interfaces.items():
                if 'Wi-Fi' in interface or 'Wireless' in interface:
                    for snic in snics:
                        if snic.family == socket.AF_INET and snic.address != '127.0.0.1':
                            wifi_ip = snic.address
                            break
                    if wifi_ip:
                        break

            if wifi_ip is not None:
                if format == 'str':
                    return wifi_ip
                else:
                    return socket.inet_aton(wifi_ip)
        else:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s.connect(("8.8.8.8", 80))
                ethernet_ip = s.getsockname()[0]
                s.close()
                if format == 'str':
                    return ethernet_ip
                else:
                    return socket.inet_aton(ethernet_ip)
                
            except Exception:
                return None

    def convert_IP (self, ip: str) -> bytes:
        return socket.inet_aton(ip)

    def check_port (self, port: int) -> bool:
        port_available: bool = False

        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

            sock.bind(("localhost", port))

            port_available = True

        except OSError:
            pass

        finally:
            sock.close()
            return port_available
        
    def get_port (self, port_unavailable: int = 80) -> int:
        
        for port in range(9000, 9100):
            if self.check_port(port=port) and port != port_unavailable:
                return port
            
        raise Exception("Any port avaialble")

# ----------------SYSTEM----------------

class SystemClass:

    def __init__(self, window: str = WindowNames.APP) -> None:

        self.sys_path         = None

        self.exceptions_path  = None
        self.exceptions_text  = ""

        self.config_path      = None
        self.version_path     = None

        self.users_path      = None
        self.users_data = DataFrame ({
            'Name'      :   [],
            'Company'   :   [],
            'Email'     :   [],
            'Phone'     :   [],
            'Message'   :   [],
            'Date'      :   []
        })

        self.license_path     = None
        self.local_window = window

        self.server_data = {
            "HTTP_PORT"     : 80,
            "MAINTENANCE"   : False,
            "SYNC"          : False
        }

        self.version_data = {
            "Version": "0.0.1",
            "Date": get_date(format='%d/%m/%Y'),
            "LastModified": get_date(format='%d/%m/%Y'),
            "Author" : "Ing Giancarlo TV"
        }

    def verify_resources (self) -> None:
        """
        Check if all resources exist for the system
        """
    
        self.sys_path = self.verify_folder()
        self.config_path        = self.verify_file(SystemPaths.CONFIG, self.server_data)
        self.exceptions_path    = self.verify_file(SystemPaths.EXCEPTIONS, '')
        self.users_path = self.verify_file(SystemPaths.USERS, self.users_data)
        self.version_path = self.verify_file(SystemPaths.VERSION, self.version_data)

        self.license_path = construct_path(part_one=self.sys_path, part_two=SystemPaths.LICENSE)
        if not verify_path(path=self.license_path):
            raise Exception('License invalid')

        if self.local_window != WindowNames.SRVR_HTTP:
            self.read_write_file(SystemPaths.EXCEPTIONS, '')

    def verify_file (self, file: str, init: (str | dict | DataFrame)) -> str:
        
        file_path = os.path.join(self.sys_path, file)

        if not verify_path(file_path):

            if create_file(directory=self.sys_path, name=file, init=init):
                
                message = f'  File {file} created:'
                log(TAB2, "", f"{message:<32} {file_path}", YELLOW)

                return file_path
                
            else:
                raise Exception(f"{file} file cannot be created on {SystemPaths.SYS}/")
            
        message = f'  File {file} OK:'
        log(TAB2, "", f"{message:<32} {file_path}", GREEN)

        return file_path

    def verify_folder (self, name: str = SystemPaths.SYS) -> str:

        folder_path = get_directory_path(directory=name)

        if folder_path == None:
            if create_directory(directory=name):
                folder_path = get_directory_path(directory=name)

                message = f'Directory {name} created:'
                log(TAB2, "", f"{message:<32} {folder_path}", YELLOW)

            else:
                raise Exception(f"{name} directory cannot be created")
            
        message = f'Directory {name} OK:'
        log(TAB2, "", f"{message:<32} {folder_path}", GREEN)

        return folder_path

    def read_write_file (self, file_name: str, data: (str | dict) = '', mode: str = Mode.WRITE) -> (str | dict | None):

        file_path = os.path.join(self.sys_path, file_name)
        
        if mode == Mode.WRITE:
            write_file(path=file_path, data=data)
        elif mode == Mode.READ:
            return read_file(path=file_path)

    def read_license (self) -> str:
        with open(self.license_path, Mode.READ) as file:
            license_encoded = file.read().strip()

        license_bytes = base64.b64decode(license_encoded)
        license = license_bytes.decode('utf-8')

        return license
    

    def server_config (self, http: int = 80, new: bool = False, network: (NetworkClass | None) = None) -> dict:
        config = read_file(path=self.config_path)

        if new:
            
            cmd_port: str = 'port>'

            http_pre = config['HTTP_PORT']
            if http_pre != http:
                if not network.check_port(port=http):
                    log(TAB2, "", f"Port {http} unavailable", RED)
                    return {
                        'Success'   : False,
                        'Error'     : f"Port {http} unavailable"
                    }

                config['HTTP_PORT'] = http
                cmd_port += 'http,'

            write_file(path=self.config_path, data=config)

            log(TAB2, "", 'Server updated', GREEN)
            return {
                'Success'   : True
            }

        if config is not None:
            return config

        return self.server_data

    def server_exception (self, error: (str | None) = None) -> bool:
        if error is not None:
            self.read_write_file(file_name=SystemPaths.EXCEPTIONS, data=error)
            return True
        
        self.exceptions_text = self.read_write_file(file_name=SystemPaths.EXCEPTIONS, mode=Mode.READ)

        if self.exceptions_text is None:
            self.read_write_file(file_name=SystemPaths.EXCEPTIONS)
            return False

        if len(self.exceptions_text) > 0:
            self.read_write_file(file_name=SystemPaths.EXCEPTIONS)
            return True
        
        return False


    def users_add (self, name: str, company : str, email: str, phone: str, message: (str | None)) -> dict:
        users_pre = read_file(path=self.users_path)

        if users_pre is not None:
            mask = users_pre['Email'] == email
            if mask.any():
                log(TAB2, "", f"User {email} already exists", RED)
                return {
                    'Success' : False,
                    'Error'   : 'El correo ya fue registrado'
                }
            
        date = get_date(format='%Y/%m/%d %H:%M:%S')

        users_new = pd.DataFrame({
            'Name'      :   [name],
            'Company'   :   [company],
            'Email'     :   [email],
            'Phone'     :   [phone],
            'Message'   :   [message if message is not None else ''],
            'Date'      :   [date]
        })

        if users_pre is None or users_pre.empty:
            write_file(path=self.users_path, data=users_new)
        
        else:
            data = pd.concat([users_pre, users_new], ignore_index=True)
            write_file(path=self.users_path, data=data)

        log(TAB2, "", f"Contact form submitted:", GREEN)
        log(TAB3, "", f"Name:       {name}", BLACK)
        log(TAB3, "", f"Company:    {company}", BLACK)
        log(TAB3, "", f"Email:      {email}", BLACK)
        log(TAB3, "", f"Phone:      {phone}", BLACK)
        log(TAB3, "", f"Message:    {message}", BLACK)
        log(TAB3, "", f"Date:       {date}", BLACK)

        self.server_exception(error='upload')
        return {
            'Success' : True
        }


# ----------------WINDOWS----------------

class WindowClass:

    def __init__ (self) -> None:
        self.app_window:    (Popen | None) = None

        self.http_window:   (Popen | None) = None

    def start (self, window: str = WindowNames.SRVR_HTTP, event: str = WindowNames.INIT) -> (bool | None):
        path = get_file_path(f'{window}.py')

        if path is None:
            raise Exception(f'Missing {window}.py resource in root directory')

        if window == WindowNames.SRVR_HTTP:
            self.http_window    = subprocess.Popen(['python', path], creationflags=subprocess.CREATE_NEW_CONSOLE)
        
        else:
            self.app_window    = subprocess.Popen(['cmd', '/c', 'python', path], creationflags=subprocess.CREATE_NEW_CONSOLE)

        log(TAB2, "", f"Window {window} {'started' if event == WindowNames.INIT else 'restarted'}", MAGENTA)
        
        return True

    def alive (self, window: str = WindowNames.SRVR_HTTP) -> (bool | None):
        
        if window == WindowNames.SRVR_HTTP and self.http_window is not None:
            if self.http_window.poll() is not None:
                log(TAB1, SYS, f"Window {WindowNames.SRVR_HTTP} was closed", BLACK, True)

                self.start(window=WindowNames.SRVR_HTTP, event= WindowNames.REINIT)
                return False

            return True

        else:    
            return None

    def close (self, window: str = WindowNames.SRVR_HTTP) -> bool:

        if window == WindowNames.SRVR_HTTP and self.http_window:
            code = self.http_window.poll()
            if code is None:
                try:
                    self.http_window.terminate()
                    code = self.http_window.poll()

                except Exception as e:
                    log(TAB1, SYS, f"Window {WindowNames.SRVR_HTTP}: {e}", RED)
                    return False
                
            self.http_window = None

        else:
            return False

        log(TAB2, "", f"Window {window} closed. Code: {code if code != None and code != 0 else 'OK'}", MAGENTA)

        return True

    def status (self, window: str = WindowNames.SRVR_HTTP) -> (Popen | None):

        if window == WindowNames.SRVR_HTTP:
            return self.http_window

        else:
            return None

    def any_open (self) -> bool:
        return (self.http_window  is not None)
