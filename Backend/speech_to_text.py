import speech_recognition as sr

def recognize_speech():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("🎤 Listening...")
        recognizer.adjust_for_ambient_noise(source)
        try:
            audio = recognizer.listen(source, timeout=5)
            return recognizer.recognize_google(audio)
        except sr.UnknownValueError:
            return "❌ Could not understand audio"
        except sr.RequestError:
            return "❌ Speech recognition service unavailable"
        except sr.WaitTimeoutError:
            return "⌛ No speech detected, try again."
