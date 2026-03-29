from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TopicRequest(BaseModel):
    topic: str

@app.get("/")
def root():
    return {"message": "Study Buddy API is alive!! 🌧️"}

@app.post("/flashcards")
def generate_flashcards(request: TopicRequest):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": f"Generate 5 flashcards for the topic: {request.topic}. Format each as Q: [question] A: [answer]. Keep it clear and concise."
            }
        ]
    )
    return {"flashcards": response.choices[0].message.content}