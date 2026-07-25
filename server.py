#!/usr/bin/env python3
import http.server
import json
import os
import hashlib

PORT = 8000
DIR = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(DIR, "images")

os.makedirs(IMAGES_DIR, exist_ok=True)

ALLOWED = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
RESUME_ALLOWED = {".pdf"}

ADMIN_HASH = "82580f067c62f6655090f7e49f349c685e1588d189e50118b437d6a830d72dbb"


def check_auth(handler):
    auth = handler.headers.get("Authorization", "")
    token = auth.replace("Bearer ", "").strip()
    if hashlib.sha256(token.encode()).hexdigest() != ADMIN_HASH:
        return False
    return True


def parse_multipart(rfile, content_length, content_type):
    boundary = content_type.split("boundary=")[1].strip().encode()
    body = rfile.read(content_length)

    parts = body.split(b"--" + boundary)
    result = {}

    for part in parts:
        if b"Content-Disposition" not in part:
            continue
        header_end = part.find(b"\r\n\r\n")
        if header_end == -1:
            continue
        headers = part[:header_end].decode(errors="replace")
        data = part[header_end + 4:]
        if data.endswith(b"\r\n"):
            data = data[:-2]

        if 'name="' in headers:
            name = headers.split('name="')[1].split('"')[0]
            filename = None
            if "filename=" in headers:
                filename = headers.split('filename="')[1].split('"')[0]
            result[name] = {"data": data, "filename": filename}

    return result


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def do_POST(self):
        path = self.path
        if path in ("/upload", "/api/upload"):
            self._handle_upload()
        elif path in ("/upload-resume", "/api/upload-resume"):
            self._handle_upload_resume()
        elif path in ("/delete", "/api/delete"):
            self._handle_delete()
        else:
            self.send_error(404)

    def _handle_upload(self):
        if not check_auth(self):
            self._json_response(401, {"success": False, "error": "Unauthorized"})
            return

        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type:
            self._json_response(400, {"success": False, "error": "Invalid content type"})
            return

        content_length = int(self.headers.get("Content-Length", 0))
        try:
            fields = parse_multipart(self.rfile, content_length, content_type)
        except Exception as e:
            self._json_response(500, {"success": False, "error": str(e)})
            return

        file_field = fields.get("file")
        if not file_field or not file_field["filename"]:
            self._json_response(400, {"success": False, "error": "No file"})
            return

        filename = os.path.basename(file_field["filename"])
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ALLOWED:
            self._json_response(400, {"success": False, "error": "File type not allowed"})
            return

        filepath = os.path.join(IMAGES_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(file_field["data"])

        print(f"[UPLOAD] {filename} ({len(file_field['data'])} bytes)")
        self._json_response(200, {"success": True, "filename": filename})

    def _handle_upload_resume(self):
        if not check_auth(self):
            self._json_response(401, {"success": False, "error": "Unauthorized"})
            return

        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type:
            self._json_response(400, {"success": False, "error": "Invalid content type"})
            return

        content_length = int(self.headers.get("Content-Length", 0))
        try:
            fields = parse_multipart(self.rfile, content_length, content_type)
        except Exception as e:
            self._json_response(500, {"success": False, "error": str(e)})
            return

        file_field = fields.get("file")
        if not file_field or not file_field["filename"]:
            self._json_response(400, {"success": False, "error": "No file"})
            return

        filename = os.path.basename(file_field["filename"])
        ext = os.path.splitext(filename)[1].lower()
        if ext not in RESUME_ALLOWED:
            self._json_response(400, {"success": False, "error": "Only PDF allowed"})
            return

        filepath = os.path.join(DIR, filename)
        with open(filepath, "wb") as f:
            f.write(file_field["data"])

        print(f"[UPLOAD RESUME] {filename} ({len(file_field['data'])} bytes)")
        self._json_response(200, {"success": True, "filename": filename})

    def _handle_delete(self):
        if not check_auth(self):
            self._json_response(401, {"success": False, "error": "Unauthorized"})
            return

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        data = json.loads(body)
        name = os.path.basename(data.get("name", ""))

        filepath = os.path.join(IMAGES_DIR, name)
        if not os.path.exists(filepath):
            filepath = os.path.join(DIR, name)
        if os.path.exists(filepath):
            os.remove(filepath)
            print(f"[DELETE] {name}")
            self._json_response(200, {"success": True})
        else:
            self._json_response(404, {"success": False, "error": "File not found"})

    def _json_response(self, code, data):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def log_message(self, format, *args):
        if "/upload" in str(args) or "/delete" in str(args):
            print(f"[REQ] {args[0]}")


if __name__ == "__main__":
    print(f"Portfolio: http://localhost:{PORT}")
    print(f"Admin:     http://localhost:{PORT}/admin.html")
    server = http.server.HTTPServer(("", PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
        server.server_close()
