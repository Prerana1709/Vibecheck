from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
from dotenv import load_dotenv
import logging
from pymongo import MongoClient  # Added for MongoDB

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
            "You are a friendly and supportive mental health chatbot named ZenBot, designed for Gen Z users..."
        ],
    },
    {
        "role": "model",
        "parts": [
            "Hey! ✨ I'm ZenBot, your friendly AI pal. Feeling overwhelmed? Totally valid. Lots of us do. Tell me what's up. 🫂"
        ],
    },
])

# === Connect to MongoDB ===
client = MongoClient("mongodb+srv://sanamujawar1902:sana1902@cluster1.b6wjmy9.mongodb.net/")  # Replace with your URI
db = client["vibecheck"]
users_collection = db["users_data"]

# === API Endpoint for Login ===
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and Password are required"}), 400
    
    # Simulate successful login and store user data in MongoDB
    user = {
        "email": email,
        "password": password  # Store password directly (no hashing)
    }

    try:
        # Store user data directly
        users_collection.insert_one(user)  # Insert user data into MongoDB
        logging.info(f"User with email {email} stored successfully.")
    except Exception as e:
        logging.error(f"Error storing user data: {e}")
        return jsonify({"error": "Failed to store user data."}), 500

    return jsonify({"success": True, "message": "Login successful!"}), 200

# === API Endpoint for Chat ===
@app.route('/chat', methods=['POST'])
def chat_with_zenbot():
    data = request.get_json()
    user_input = data.get('message')

    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    try:
        logging.info(f"User: {user_input}")
        response = chat_session.send_message(user_input)
        reply = response.text.strip()
        logging.info(f"ZenBot: {reply}")

        return jsonify({"reply": reply})
    except Exception as e:
        logging.error(f"Gemini Error: {e}")
        return jsonify({"error": str(e)}), 500

# === Start Server ===
if __name__ == '__main__':
    app.run(debug=True)
