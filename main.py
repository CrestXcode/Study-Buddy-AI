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
    language: str = "English"

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
                "content": f"Generate 5 flashcards for the topic: {request.topic}. Respond entirely in {request.language}. Format each as Q: [question] A: [answer]. Keep it clear and concise."
            }
        ]
    )
    return {"flashcards": response.choices[0].message.content}

class PanicRequest(BaseModel):
    exam_date: str
    topics: list[str]
    hours_per_day: int = 3

from datetime import date

@app.post("/panic-mode")
def deadline_panic_mode(request: PanicRequest):
    today = date.today().strftime("%B %d, %Y")
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": f"""Today is {today}. My exam is on {request.exam_date}.
I need to cover these topics: {', '.join(request.topics)}.
I can study {request.hours_per_day} hours per day.
Calculate exactly how many days are left and create a realistic day-by-day study plan.
Format strictly as:
Day 1 ({today}): [Topic] - [Specific what to study] - [{request.hours_per_day} hours]
Day 2 (date): [Topic] - [Specific what to study] - [{request.hours_per_day} hours]
Continue until exam date. Be specific, aggressive and practical. No fluff!!"""
            }
        ]
    )
    return {"plan": response.choices[0].message.content}