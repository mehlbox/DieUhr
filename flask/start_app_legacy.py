from flask import Flask, request, jsonify
import os
import json
import time
import threading
import codecs
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='static')

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
    print 'Invalid command:', command
    return 'Invalid command: %s' % command, 400

@app.route('/data', methods=['GET'])
def get_data():
    return jsonify(snapshot_data())

@app.route('/main', methods=['GET', 'POST'])
def main():
    global data
    if request.method == 'GET':
        snapshot = snapshot_data()
        print snapshot
        return jsonify(snapshot)

    if request.method == 'POST' and 'data' in request.form:
        try:
            new_data = json.loads(request.form['data'])
        except ValueError:
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
            log_entry = '%s Message: %s by: %s' % (
                datetime.now().strftime('%a %d.%m.%Y %H:%M:%S'),
                new_data['message'],
                request.remote_addr,
            )
            log_path = os.path.join(app.root_path, 'log.txt')
            with codecs.open(log_path, 'a', 'utf-8') as log_file:
                log_file.write(log_entry + '\n')

        return jsonify(response_data), 200

    return jsonify({'error': 'Missing form field "data".'}), 400

@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('index.html')

@app.route('/display', methods=['GET'])
def display():
    return app.send_static_file('display.html')

if __name__ == '__main__':
    app.run(debug=True)
