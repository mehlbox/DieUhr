from flask import Flask, request, jsonify, Response, render_template, redirect, url_for
import os
import json
import time
import threading
import secrets
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='static')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

AUTH_USERNAME = os.getenv('BASIC_AUTH_USERNAME', '')
AUTH_PASSWORD = os.getenv('BASIC_AUTH_PASSWORD', '')
ASSET_VERSION = os.getenv('ASSET_VERSION') or str(int(time.time()))

PUBLIC_PATHS = {
    '/display',
    '/display.html',
    '/display.css',
    '/favicon.ico',
    '/svg/stopwatch.svg',
    '/js/jquery.js',
    '/js/bigtext.js',
    '/js/displayFunction.js',
    '/js/display.js',
}

state_lock = threading.RLock()

DEFAULT_DATA = {
    'onOff': 'off',
    'upperLine': 'clock',
    'lowerLine': 'textarea',
    'displayChange': 0,
    'timeout': '300',
    'timeoutTimestamp': 'inf',
    'countdown': 300,
    'countdownTimeout': 300,
    'countdownState': 'stop',
    'message': '',
    'stateVersion': 0,
}

data = DEFAULT_DATA.copy()


def unauthorized_response():
    return Response(
        'Authentication required',
        401,
        {'WWW-Authenticate': 'Basic realm="Restricted"'}
    )


@app.before_request
def enforce_basic_auth():
    if request.path in PUBLIC_PATHS:
        return None

    if request.path == '/data' and request.method == 'GET':
        return None

    auth = request.authorization
    if (
        auth
        and auth.type == 'basic'
        and secrets.compare_digest(auth.username or '', AUTH_USERNAME)
        and secrets.compare_digest(auth.password or '', AUTH_PASSWORD)
    ):
        return None

    return unauthorized_response()


@app.after_request
def disable_ui_asset_cache(response):
    cache_sensitive_paths = ('/', '/display', '/index.html', '/display.html')
    cache_sensitive_extensions = ('.js', '.css')

    if request.method == 'GET' and (
        request.path in cache_sensitive_paths
        or request.path.endswith(cache_sensitive_extensions)
    ):
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    return response

def init_data():
    global data
    with state_lock:
        data = DEFAULT_DATA.copy()


def snapshot_data():
    with state_lock:
        snapshot = data.copy()
    snapshot['timestamp'] = int(time.time())
    return snapshot

 
@app.route('/command', methods=['POST'])
def handle_command():
    command = request.form.get('command')
    if command:
        response = ""
        if command == 'refresh':
            response = os.popen('bash -c "export DISPLAY=\":0\" && xdotool key F5"').read()
        elif command == 'stop':
            response = os.popen('killall midori').read()
        elif command == 'start':
            response = os.popen('xinit /var/www/startMidori.sh').read()
        elif command == 'reboot':
            response = os.popen('reboot').read()
        elif command == 'delete':
            init_data()
            response = "Deleted"
        elif command == 'linux':
            response = os.popen('uname -a').read()
        elif command == 'user':
            response = os.popen('whoami').read()

        return response, {'Content-Type': 'text/plain'}
    print(f'Invalid command: {command}')
    return f'Invalid command: {command}', 400

@app.route('/data', methods=['GET'])
def get_data():
    return jsonify(snapshot_data())

@app.route('/main', methods=['GET', 'POST'])
def main():
    global data
    if request.method == 'GET':
        snapshot = snapshot_data()
        print(snapshot)
        return jsonify(snapshot)

    if request.method == 'POST' and 'data' in request.form:
        try:
            new_data = json.loads(request.form['data'])
        except json.JSONDecodeError:
            return jsonify({'error': 'Invalid JSON in form field "data".'}), 400

        if not isinstance(new_data, dict):
            return jsonify({'error': 'Payload must be a JSON object.'}), 400

        requested_base_version = new_data.pop('baseVersion', None)
        try:
            if requested_base_version is not None:
                requested_base_version = int(requested_base_version)
        except (TypeError, ValueError):
            return jsonify({'error': '"baseVersion" must be an integer.'}), 400

        with state_lock:
            current_version = int(data.get('stateVersion', 0))
            if requested_base_version is not None and requested_base_version != current_version:
                conflict_snapshot = data.copy()
                conflict_snapshot['timestamp'] = int(time.time())
                conflict_snapshot['error'] = 'State changed by another client.'
                return jsonify(conflict_snapshot), 409

            if 'timeoutTimestamp' in new_data and new_data['timeoutTimestamp'] != 'inf':
                new_data['timeoutTimestamp'] = int(new_data['timeoutTimestamp']) + int(time.time())

            data.update(new_data)
            data['stateVersion'] = current_version + 1
            response_data = data.copy()
            response_data['timestamp'] = int(time.time())

        if new_data.get('onOff') == 'on' and 'message' in new_data:
            log_entry = f"{datetime.now().strftime('%a %d.%m.%Y %H:%M:%S')} Message: {new_data['message']} by: {request.remote_addr}"
            with open(os.path.join(app.root_path, 'log.txt'), 'a', encoding='utf-8') as log_file:
                log_file.write(log_entry + '\n')

        return jsonify(response_data), 200

    return jsonify({'error': 'Missing form field "data".'}), 400

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', asset_version=ASSET_VERSION)


@app.route('/index.html', methods=['GET'])
def index_static_redirect():
    return redirect(url_for('index', v=ASSET_VERSION), code=302)

@app.route('/display', methods=['GET'])
def display():
    return render_template('display.html', asset_version=ASSET_VERSION)


@app.route('/display.html', methods=['GET'])
def display_static_redirect():
    return redirect(url_for('display', v=ASSET_VERSION), code=302)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
