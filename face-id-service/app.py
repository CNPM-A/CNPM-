from flask import Flask, request, jsonify
from src.controllers import recognize_face, register_face

app = Flask(__name__)

@app.route('/')
def home():
    return "Face ID Service đang khởi chạy! 📷"

@app.route('/recognize', methods=['POST'])
def recognize():
    return recognize_face(request)

@app.route('/register', methods=['POST'])
def register():
    return register_face(request)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)