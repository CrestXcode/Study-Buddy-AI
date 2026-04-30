import { useState } from "react";

export default function App() {
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateFlashcards = async () => {
    if (!topic) return;
    setLoading(true);
    setFlashcards([]);
    try {
      const res = await fetch("http://127.0.0.1:8000/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      const parsed = data.flashcards
        .split("\n\n")
        .filter((f) => f.includes("Q:"))
        .map((f) => {
          const [q, a] = f.split("\nA:");
          return {
            question: q.replace("Q:", "").trim(),
            answer: a?.trim(),
          };
        });
      setFlashcards(parsed);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Study Buddy AI</h1>
      <p style={styles.subtitle}>Drop a topic. Get flashcards. Study smarter!!</p>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="e.g. Python loops, Photosynthesis, World War 2..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateFlashcards()}
        />
        <button
          style={styles.button}
          onClick={generateFlashcards}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {loading && <p style={styles.loading}>AI is thinking...</p>}

      <div style={styles.grid}>
        {flashcards.map((card, i) => (
          <FlipCard key={i} index={i} question={card.question} answer={card.answer} />
        ))}
      </div>
    </div>
  );
}

function FlipCard({ question, answer, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={styles.cardWrap} onClick={() => setFlipped(!flipped)}>
      <div style={{ ...styles.card, background: flipped ? "#4F46E5" : "#ffffff" }}>
        <div style={styles.cardNumber}>Card {index + 1}</div>
        <p style={{ ...styles.cardText, color: flipped ? "#ffffff" : "#1E1B4B" }}>
          {flipped ? ` ${answer}` : ` ${question}`}
        </p>
        <p style={{ ...styles.cardHint, color: flipped ? "#C7D2FE" : "#9CA3AF" }}>
          {flipped ? "Click to see question" : "Click to reveal answer"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#F5F3FF", padding: "40px 20px", fontFamily: "Arial, sans-serif" },
  title: { textAlign: "center", fontSize: "2.5rem", color: "#4F46E5", marginBottom: "8px" },
  subtitle: { textAlign: "center", color: "#7C3AED", marginBottom: "32px", fontSize: "1.1rem" },
  inputRow: { display: "flex", gap: "12px", maxWidth: "600px", margin: "0 auto 32px" },
  input: { flex: 1, padding: "14px 18px", borderRadius: "12px", border: "2px solid #C7D2FE", fontSize: "1rem", outline: "none" },
  button: { padding: "14px 24px", borderRadius: "12px", background: "#4F46E5", color: "#fff", border: "none", fontSize: "1rem", cursor: "pointer", fontWeight: "bold" },
  loading: { textAlign: "center", color: "#7C3AED", fontSize: "1.1rem", marginBottom: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", maxWidth: "900px", margin: "0 auto" },
  cardWrap: { cursor: "pointer" },
  card: { borderRadius: "16px", padding: "28px", minHeight: "180px", boxShadow: "0 4px 20px rgba(79,70,229,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "all 0.3s ease" },
  cardNumber: { fontSize: "0.8rem", color: "#9CA3AF", fontWeight: "bold", marginBottom: "12px" },
  cardText: { fontSize: "1.1rem", fontWeight: "500", lineHeight: "1.6", flex: 1 },
  cardHint: { fontSize: "0.8rem", marginTop: "12px" },
};