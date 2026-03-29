# 🧠 Study Buddy AI

> An intelligent, personalized study assistant powered by Groq AI — built to adapt to *how you learn*, not just *what you learn*.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-orange)
![License](https://img.shields.io/badge/License-MIT-purple)
![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)

---

## ✨ What Makes This Different

Most study apps give everyone the same content. Study Buddy AI adapts to **your personality, your confusion patterns, and your deadlines** — making every study session uniquely yours.

---

## 🚀 Features

### ✅ Currently Built
- **Flashcard Generation** — Paste any topic and instantly get 5 AI-generated flashcards formatted as Q&A pairs

### 🔄 In Development
- **Study Personality Adaptation** — Answer 5 questions about how you learn (visual, storytelling, examples) and every explanation is generated in your style — forever
- **Confusion Detector** — Tracks which flashcards confuse you and auto-generates simpler explanations targeting your exact weak spots
- **Deadline Panic Mode** — Enter your exam date and topic list → AI builds an aggressive day-by-day study plan based on how much time you have left
- **Multi-language Support** — Get concepts explained in any language (Hindi, Spanish, Japanese, French and more) — making quality education truly global 🌍

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python) |
| AI Model | LLaMA 3.3 70B via Groq API |
| Server | Uvicorn |
| Environment | python-dotenv |

---

## ⚡ Getting Started

### Prerequisites
- Python 3.12+
- A free [Groq API key](https://console.groq.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/study-buddy-ai.git
cd study-buddy-ai
```

**2. Create and activate virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install fastapi uvicorn groq python-dotenv
```

**4. Set up environment variables**

Create a `.env` file in the root directory:
```
GROQ_API_KEY=your_groq_api_key_here
```

**5. Run the server**
```bash
uvicorn main:app --reload
```

**6. Open your browser**
```
http://127.0.0.1:8000/docs
```

---

## 📡 API Endpoints

### `GET /`
Health check — confirms the API is running.

**Response:**
```json
{
  "message": "Study Buddy API is alive!! 🌧️"
}
```

---

### `POST /flashcards`
Generate 5 AI-powered flashcards for any topic.

**Request Body:**
```json
{
  "topic": "Python loops"
}
```

**Response:**
```json
{
  "flashcards": "Q: What is a for loop?\nA: A for loop iterates over a sequence...\n\nQ: ..."
}
```

---

## 📁 Project Structure

```
study-buddy-ai/
├── main.py          # FastAPI application + all endpoints
├── .env             # API keys (never committed to GitHub)
├── .gitignore       # Files excluded from version control
├── requirements.txt # Project dependencies
└── README.md        # You are here!
```

---

## 🗺️ Roadmap

- [x] Backend API setup
- [x] Flashcard generation endpoint
- [ ] Study Personality system
- [ ] Confusion Detector engine
- [ ] Deadline Panic Mode
- [ ] Multi-language support
- [ ] React frontend
- [ ] User authentication
- [ ] Deployment (Railway / Render)

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Kashish**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [your-linkedin](https://linkedin.com/in/yourlinkedin)

---

<p align="center">Built with 💜 and lots of late nights</p>