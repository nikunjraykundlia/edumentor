import os
import speech_recognition as sr
from elevenlabs.client import ElevenLabs
from elevenlabs import play
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_elevenlabs_client():
    api_key = os.getenv("ELEVENLABS_API_KEY", "").strip()
    if not api_key:
        raise ValueError("ELEVENLABS_API_KEY env variable is required")
    return ElevenLabs(api_key=api_key)

def speech_to_text(phrase_time_limit=5, adjust_duration=1):
    recognizer = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            print("Adjusting microphone ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=adjust_duration)
            print("Speak now...")
            audio = recognizer.listen(source, phrase_time_limit=phrase_time_limit)

        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        raise RuntimeError("Could not understand audio.")
    except sr.RequestError as e:
        raise RuntimeError(f"Google Speech API request failed: {e}")
    except Exception as e:
        raise RuntimeError(f"An unexpected error occurred: {e}")

def text_to_speech(text, voice_id="21m00Tcm4TlvDq8ikWAM", voice_settings=None):
    if voice_settings is None:
        voice_settings = {
            "stability": 0.5,
            "similarity_boost": 0.8,
            "style": 0.0,
            "use_speaker_boost": True,
        }

    client = get_elevenlabs_client()
    audio_response = client.text_to_speech.convert(
        voice_id=voice_id,
        text=text,
        model_id="eleven_multilingual_v2",
        voice_settings=voice_settings,
    )
    # Correct way to play audio in ElevenLabs 2.x
    if hasattr(play, 'play'):
        play.play(audio_response)
    else:
        play(audio_response)

if __name__ == "__main__":
    # Example flow
    try:
        print("Say something to convert to text...")
        spoken = speech_to_text()
        print("You said:", spoken)

        response_text = f"You said: {spoken}. Converting to speech now."
        text_to_speech(response_text)
    except Exception as e:
        print(f"Error: {e}")
