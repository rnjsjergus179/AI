from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests

app = Flask(__name__)
CORS(app)  # CORS 설정
load_dotenv()  # .env 파일에서 환경 변수 로드

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@app.route('/api/openai', methods=['POST'])
def call_openai():
    data = request.json
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"error": "프롬프트가 필요합니다."}), 400

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        },
        headers=headers
    )
    if response.status_code != 200:
        return jsonify({"error": "OpenAI API 호출 실패", "details": response.text}), 500
    result = response.json()
    return jsonify({"response": result["choices"][0]["message"]["content"]})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)