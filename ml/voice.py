from dotenv import load_dotenv
import os

# Important: Load .env before importing voice_service if voice_service doesn't do it
load_dotenv()

from voice_service import speech_to_text, text_to_speech

if __name__ == "__main__":
    try:
        print("--- Voice Integration Test ---")
        spoken = speech_to_text()
        print("STT result:", spoken)

        print("\nConverting response to speech...")
        text_to_speech(f"You said: {spoken}. Hello from your integrated service.")
        
    except Exception as e:
        print(f"\nError: {e}")
        print("Note: Ensure you have a working microphone and the ELEVENLABS_API_KEY is correct in .env")