from flask import Flask, request, jsonify
import os
import json
import time
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='static')

data = {"onOff": "off"}

def init_data():
    global data
    data = {
        'onOff': 'off',
        'upperLine': 'clock',
        'lowerLine': 'textarea',
        'displayChange': 0,
        }

 
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
    return jsonify(data)

@app.route('/main', methods=['GET', 'POST'])
def main():
    global data
    if request.method == 'GET':
        new_data = {'timestamp': int(time.time())}
        data.update(new_data)
        print(data)
        return jsonify(data)

    if request.method == 'POST' and 'data' in request.form:
        new_data = json.loads(request.form['data'])    

        if 'timeoutTimestamp' in new_data and new_data['timeoutTimestamp'] != 'inf':
            new_data['timeoutTimestamp'] =  int(new_data['timeoutTimestamp']) + int(time.time())

        data.update(new_data)

        if new_data.get('onOff') == 'on' and 'message' in new_data:
            log_entry = f"{datetime.now().strftime('%a %d.%m.%Y %H:%M:%S')} Message: {new_data['message']} by: {request.remote_addr}"
            with open(os.path.join(app.root_path, 'log.txt'), 'a') as log_file:
                log_file.write(log_entry + '\n')

        return 'OK', 204

@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('index.html')

@app.route('/display', methods=['GET'])
def display():
    return app.send_static_file('display.html')

if __name__ == '__main__':
    app.run(debug=True)
