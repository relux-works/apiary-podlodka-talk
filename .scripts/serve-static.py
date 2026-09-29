#!/usr/bin/env python3
"""Static file server for the audit: like `python3 -m http.server`, but with a
listen backlog large enough for a Vite build. The stock server queues only five
pending connections, so a page that requests dozens of modules at once gets some
of them refused, and the audit reports a random "Failed to fetch dynamically
imported module".

Usage: serve-static.py <port> <directory>
"""
import functools
import http.server
import sys


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 256
    daemon_threads = True


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


port, directory = int(sys.argv[1]), sys.argv[2]
Server(('127.0.0.1', port), functools.partial(Quiet, directory=directory)).serve_forever()
