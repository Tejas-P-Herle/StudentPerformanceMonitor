import sys

verbose = False


def set_verbose(value):
    global verbose
    verbose = value


def print_(message):
    if verbose:
        print(message)


def print_r(message):
    if verbose:
        _ = sys.stdout.write(message + '\r')
        sys.stdout.flush()
