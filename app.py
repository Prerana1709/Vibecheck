from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
from dotenv import load_dotenv
import logging
from gtts import gTTS
import speech_recognition as sr
from io import BytesIO

# === Load .env ===
load_dotenv()

# === Setup Flask ===
app = Flask(__name__)
CORS(app)

# === Logging ===
logging.basicConfig(level=logging.INFO)
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    logging.error("GEMINI_API_KEY not found in environment.")
    raise ValueError("Missing GEMINI_API_KEY in .env")
else:
    logging.info("GEMINI_API_KEY loaded successfully.")

# === Configure Gemini ===
genai.configure(api_key=api_key)

# === Generation Config ===
generation_config = {
    "temperature": 0.3,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# === Persona Setup ===
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-8b",
    generation_config=generation_config,
)

chat_session = model.start_chat(history=[
    {
        "role": "user",
        "parts": [
            "You are a friendly and supportive mental health chatbot named ZenBot, designed for Gen Z users. "
            "Your tone is casual, positive, and empathetic. You use relatable examples, modern slang, and short, clear messages. "
            "Avoid sounding like a textbook or a therapist. Respond in less than 100 words unless asked for more. "
            "Always validate the user's feelings before offering any tips or support. Add emojis and humor where appropriate. "
            "Be a conversational chatbot — don’t give answers like a lecturer. Add an emotional touch into your responses. "
            "Use Gen Z slang — like you're texting a bestie."
        ],
    },
    {
        "role": "model",
        "parts": [
            "Hey! ✨ I'm ZenBot, your friendly AI pal. Feeling overwhelmed? Totally valid. Lots of us do. Tell me what's up. 🫂"
        ],
    },
    {
        "role": "user",
        "parts": [
            "i am stressed"
        ],
    },
    {
        "role": "model",
        "parts": [
            "Ugh, stress is the worst, bestie. Totally get it. It's like, a pressure cooker fr. Deep breath first. What's bugging you rn? 💪"
        ],
    }
])

# === API Endpoint for Chat ===
@app.route('/chat', methods=['POST'])
def chat_with_zenbot():
    data = request.get_json()
    user_input = data.get('message')
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    try:
        # 1) Generate the text reply
        logging.info(f"User: {user_input}")
        resp = chat_session.send_message(user_input)
        reply = resp.text.strip()
        logging.info(f"ZenBot: {reply}")

        # 2) Synthesize TTS
        tts = gTTS(reply, lang="en", tld="us")
        mp3_buffer = BytesIO()
        tts.write_to_fp(mp3_buffer)
        mp3_buffer.seek(0)
        audio_hex = mp3_buffer.read().hex()

        # 3) Return both text and audio
        return jsonify({
            "reply": reply,
            "audio": audio_hex
        }), 200

    except Exception as e:
        logging.error(f"Chat/TTS Error: {e}")
        return jsonify({"error": str(e)}), 500

# === API Endpoint for Voice Assistant (Listen) ===
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")

    try:
        # LLM response
        response = model.generate_content(user_input)
        reply = response.text

        # gTTS audio response
        tts = gTTS(reply, lang="en", tld="us")
        audio = BytesIO()
        tts.write_to_fp(audio)
        audio.seek(0)

        return jsonify({
            "text": reply,
            "audio": audio.read().hex()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === Start Server ===
if __name__ == '__main__':
    app.run(debug=True)  