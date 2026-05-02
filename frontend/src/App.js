import { useState } from "react";

const LANGUAGES = [
  "Arabic", "Bengali", "Burmese", "Chinese (Simplified)", "Chinese (Traditional)",
  "Czech", "Danish", "Dutch", "English", "Finnish",
  "French", "German", "Greek", "Gujarati", "Hebrew",
  "Hindi", "Hungarian", "Indonesian", "Italian", "Japanese",
  "Kannada", "Khmer", "Korean", "Malayalam", "Malay",
  "Marathi", "Nepali", "Norwegian", "Pashto", "Persian",
  "Polish", "Portuguese", "Punjabi", "Romanian", "Russian",
  "Sinhala", "Spanish", "Swahili", "Swedish", "Tagalog",
  "Tamil", "Telugu", "Thai", "Turkish", "Ukrainian",
  "Urdu", "Vietnamese"
].sort();

export default function App() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panicDate, setPanicDate] = useState("");
  const [panicTopics, setPanicTopics] = useState("");
  const [panicHours, setPanicHours] = useState(3);
  const [panicPlan, setPanicPlan] = useState("");
  const [panicLoading, setPanicLoading] = useState(false);

  const generateFlashcards = async () => {
    if (!topic) return;
    setLoading(true);
    setFlashcards([]);
    try {
      const res = await fetch("http://127.0.0.1:8000/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language }),
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

  const generatePanicPlan = async () => {
    if (!panicDate || !panicTopics) return;
    setPanicLoading(true);
    setPanicPlan("");
    try {
      const res = await fetch("http://127.0.0.1:8000/panic-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_date: panicDate,
          topics: panicTopics.split(",").map((t) => t.trim()),
          hours_per_day: panicHours,
        }),
      });
      const data = await res.json();
      setPanicPlan(data.plan);
    } catch (err) {
      console.error(err);
    }
    setPanicLoading(false);
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
        <select
          style={styles.select}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
        </select>
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

      {/* DEADLINE PANIC MODE */}
      <div style={styles.panicSection}>
        <h2 style={styles.panicTitle}>Deadline Panic Mode</h2>
        <p style={styles.panicSubtitle}>Exam coming up?? Drop your date and topics — AI builds your war plan!!</p>

        <div style={styles.panicRow}>
          <div style={styles.panicField}>
            <label style={styles.label}>Exam Date</label>
            <input
              style={styles.input}
              type="date"
              value={panicDate}
              onChange={(e) => setPanicDate(e.target.value)}
            />
          </div>
          <div style={styles.panicField}>
            <label style={styles.label}>Hours per day</label>
            <input
              style={{ ...styles.input, width: "80px" }}
              type="number"
              min="1"
              max="12"
              value={panicHours}
              onChange={(e) => setPanicHours(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ maxWidth: "700px", margin: "0 auto 16px" }}>
          <label style={styles.label}>Topics (comma separated)</label>
          <input
            style={{ ...styles.input, width: "100%" }}
            placeholder="e.g. MPMC, Data Analytics, Deep Learning..."
            value={panicTopics}
            onChange={(e) => setPanicTopics(e.target.value)}
          />
        </div>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <button
            style={{ ...styles.button, background: "#DC2626" }}
            onClick={generatePanicPlan}
            disabled={panicLoading}
          >
            {panicLoading ? "Building your war plan..." : "ACTIVATE PANIC MODE"}
          </button>
        </div>

        {panicPlan && (
          <div style={styles.planBox}>
            <pre style={styles.planText}>{panicPlan}</pre>
          </div>
        )}
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
          {flipped ? answer : question}
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
  inputRow: { display: "flex", gap: "12px", maxWidth: "700px", margin: "0 auto 32px", flexWrap: "wrap" },
  input: { flex: 2, padding: "14px 18px", borderRadius: "12px", border: "2px solid #C7D2FE", fontSize: "1rem", outline: "none", minWidth: "200px" },
  select: { flex: 1, padding: "14px 12px", borderRadius: "12px", border: "2px solid #C7D2FE", fontSize: "1rem", background: "#fff", color: "#4F46E5", fontWeight: "bold", cursor: "pointer", minWidth: "120px" },
  button: { padding: "14px 24px", borderRadius: "12px", background: "#4F46E5", color: "#fff", border: "none", fontSize: "1rem", cursor: "pointer", fontWeight: "bold" },
  loading: { textAlign: "center", color: "#7C3AED", fontSize: "1.1rem", marginBottom: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", maxWidth: "900px", margin: "0 auto" },
  cardWrap: { cursor: "pointer" },
  card: { borderRadius: "16px", padding: "28px", minHeight: "180px", boxShadow: "0 4px 20px rgba(79,70,229,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "all 0.3s ease" },
  cardNumber: { fontSize: "0.8rem", color: "#9CA3AF", fontWeight: "bold", marginBottom: "12px" },
  cardText: { fontSize: "1.1rem", fontWeight: "500", lineHeight: "1.6", flex: 1 },
  cardHint: { fontSize: "0.8rem", marginTop: "12px" },
  panicSection: { maxWidth: "900px", margin: "60px auto 0", padding: "32px", background: "#FEF2F2", borderRadius: "20px", border: "2px solid #FECACA" },
  panicTitle: { textAlign: "center", fontSize: "1.8rem", color: "#DC2626", marginBottom: "8px" },
  panicSubtitle: { textAlign: "center", color: "#EF4444", marginBottom: "24px" },
  panicRow: { display: "flex", gap: "16px", maxWidth: "700px", margin: "0 auto 16px", flexWrap: "wrap" },
  panicField: { display: "flex", flexDirection: "column", gap: "6px", flex: 1 },
  label: { fontSize: "13px", fontWeight: "bold", color: "#6B7280" },
  planBox: { background: "#ffffff", borderRadius: "12px", padding: "24px", border: "1px solid #FECACA" },
  planText: { whiteSpace: "pre-wrap", fontFamily: "Arial", fontSize: "14px", color: "#374151", lineHeight: "1.8" },
};