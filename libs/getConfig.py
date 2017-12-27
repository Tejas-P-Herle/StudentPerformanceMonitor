import configparser
import os.path
from libs.restrictIO import print_
print_('File-getConfig.py Importing-Complete')
print_('File-getConfig.py Starting Setup')

config = configparser.ConfigParser()
MAX_PORT_NUMBER = 65535


class Config:
    def __init__(self, file, default=True):
        self.file = file
        self.host = None
        self.port = None
        self.debug = None
        if default:
            if self.file_exists():
                try:
                    self.read_config()
                except ValueError as e:
                    print(e)
                    set_params = input('Set Parameters? <Y/N> ')
                    if set_params:
                        self.get_config()
                    else:
                        exit(1)
            else:
                self.set_default_config()
        else:
            self.get_config()

    def file_exists(self):
        return os.path.exists(self.file) and os.path.isfile(self.file)

    def validate_config_params(self, host, port, debug):
        if not host or host.count('.') != 3:
            raise ValueError('Invalid Host Address')
        if port in ['', None] or int(port) > MAX_PORT_NUMBER:
            raise ValueError('Invalid Port Number')
        if not debug:
                raise ValueError('Invalid Debug Value')
        self.host = host
        self.port = int(port)
        self.debug = (debug[0].lower() == 'y' or debug == 'True')

    def set_config_params(self, host, port, debug):
        self.validate_config_params(host, port, debug)
        config['DEFAULT']['host'] = self.host
        config['DEFAULT']['port'] = str(self.port)
        config['DEFAULT']['debug'] = str(self.debug)

    def write_config(self):
        with open(self.file, 'w') as configfile:
            config.write(configfile)

    def get_config(self):
        config.clear()
        print('-' * 50)
        host = input('Please Enter Host Address: ')
        port = input('Please Enter Port Number: ')
        debug = input('Set Debug to True? <Y/N> ')
        print('-' * 50)
        self.set_config_params(host, port, debug)

    def set_default_config(self):
        config.clear()
        self.set_config_params('', '', '')
        self.write_config()

    def read_config(self):
        config.read(self.file)
        try:
            host = config['DEFAULT']['host']
            port = config['DEFAULT']['port']
            debug = config['DEFAULT']['debug']
        except Exception:
            raise
        self.set_config_params(host, port, debug)


print_('File-getConfig.py Setup-Complete')
