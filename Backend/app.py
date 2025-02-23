from flask import Flask, jsonify
from speech_to_text import recognize_speech
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app)

listening = False  # Flag to control listening
latest_text = ""   # Store last recognized text

def listen_loop():
    """Continuously listens and updates latest_text."""
    global listening, latest_text
    while listening:
        text = recognize_speech()
        if text:
            latest_text = text  # Store latest recognized text

@app.route('/start_listening', methods=['GET'])
def start_listening():
    """Starts continuous listening in a separate thread."""
    global listening
    if not listening:
        listening = True
        threading.Thread(target=listen_loop, daemon=True).start()
    return jsonify({"status": "Listening started"})

@app.route('/stop_listening', methods=['GET'])
def stop_listening():
    """Stops listening."""
    global listening
    listening = False
    return jsonify({"status": "Listening stopped"})

@app.route('/get_text', methods=['GET'])
def get_text():
    """Returns the latest recognized text."""
    return jsonify({"text": latest_text})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
