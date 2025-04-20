import google.generativeai as genai
import speech_recognition as sr
from datetime import date
from gtts import gTTS
from io import BytesIO
from pygame import mixer 
import threading
import queue
import time

# === Initialize Mixer ===
mixer.init()
mixer.set_num_channels(1)
voice = mixer.Channel(0)

# === Configure Gemini API ===
GEMINI_API_KEY = "AIzaSyB3oNxtjXJe5itlSyrZtSHvrckGYom_nUs"
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("models/gemini-1.5-pro-latest")

today = str(date.today())
numtext = 0 
numtts = 0 
numaudio = 0
messages = [] 
slang = "en-EN"

def chatfun(request, text_queue, llm_done):
    global numtext, messages
    messages.append({'role': 'user', 'parts': [request]})
    
    try:
        response = model.generate_content(request)
        reply = response.text
    except Exception as e:
        print(f"[Chat Error] {e}")
        text_queue.put("Sorry, I had trouble responding.")
        llm_done.set()
        return

    print(f"AI: {reply}")
    append2log(f"AI: {reply}")
    sentences = reply.split('. ')
    for sentence in sentences:
        if sentence.strip():
            text_queue.put(sentence.strip() + '.')
            numtext += 1
    llm_done.set()

def speak_text(text):
    mp3file = BytesIO()
    tts = gTTS(text, lang="en", tld='us') 
    tts.write_to_fp(mp3file)
    mp3file.seek(0)
    sound1 = mixer.Sound(mp3file)
    voice.play(sound1)
    while voice.get_busy():
        time.sleep(0.01)
    mp3file = None

def text2speech(text_queue, tts_done, llm_done, audio_queue, stop_event):
    global numtext, numtts
    numshort = 0
    while not stop_event.is_set():
        if not text_queue.empty():
            text = text_queue.get(timeout=0.5)
            if len(text) > 1:
                numtts += 1 
                mp3file1 = BytesIO()
                tts = gTTS(text, lang="en", tld='us') 
                tts.write_to_fp(mp3file1)
                audio_queue.put(mp3file1)
                text_queue.task_done()
            else:
                numshort += 1
                text_queue.task_done()
        if llm_done.is_set() and numtts + numshort == numtext:
            time.sleep(0.2)
            tts_done.set()
            break 

def play_audio(audio_queue, tts_done, stop_event):
    global numtts, numaudio 
    while not stop_event.is_set():
        mp3audio1 = audio_queue.get()  
        mp3audio1.seek(0)  
        sound1 = mixer.Sound(mp3audio1) 
        voice.play(sound1)
        numaudio += 1          
        audio_queue.task_done() 
        while voice.get_busy():
            time.sleep(0.01)
        if tts_done.is_set() and numtts == numaudio: 
            break

def append2log(text):
    global today
    fname = 'chatlog-' + today + '.txt'
    with open(fname, "a", encoding='utf-8') as f:
        f.write(text + "\n")

def main():
    global today, slang, numtext, numtts, numaudio, messages
    
    rec = sr.Recognizer()
    mic = sr.Microphone()
    rec.dynamic_energy_threshold = False
    rec.energy_threshold = 400    
    sleeping = True

    while True:
        with mic as source:
            rec.adjust_for_ambient_noise(source, duration=1)
            print("Listening ...")
            try:
                audio = rec.listen(source, timeout=20, phrase_time_limit=30)
                text = rec.recognize_google(audio, language=slang)

                if sleeping:
                    if "jack" in text.lower():
                        request = text.lower().split("jack")[1]
                        sleeping = False
                        append2log("_" * 40)
                        today = str(date.today())  
                        messages = []
                        if len(request) < 2:
                            speak_text("Hi there, how can I help?")
                            append2log("AI: Hi there, how can I help?")
                            continue
                    else:
                        continue
                else:
                    request = text.lower()
                    if "that's all" in request:
                        append2log(f"You: {request}")
                        speak_text("Bye now")
                        append2log("AI: Bye now.")
                        sleeping = True
                        continue
                    if "jack" in request:
                        request = request.split("jack")[1]

                append2log(f"You: {request}")
                print(f"You: {request}\nAI: ", end='')

                numtext = 0 
                numtts = 0 
                numaudio = 0
                text_queue = queue.Queue()
                audio_queue = queue.Queue()
                llm_done = threading.Event()
                tts_done = threading.Event()
                stop_event = threading.Event()

                llm_thread = threading.Thread(target=chatfun, args=(request, text_queue, llm_done))
                tts_thread = threading.Thread(target=text2speech, args=(text_queue, tts_done, llm_done, audio_queue, stop_event))
                play_thread = threading.Thread(target=play_audio, args=(audio_queue, tts_done, stop_event))

                llm_thread.start()
                tts_thread.start()
                play_thread.start()

                llm_done.wait()
                llm_thread.join()
                tts_done.wait()
                audio_queue.join()

                stop_event.set()
                tts_thread.join()
                play_thread.join()
                print('\n')

            except Exception as e:
                print("[Main Error]", e)
                continue

if __name__ == "__main__":
    main()
