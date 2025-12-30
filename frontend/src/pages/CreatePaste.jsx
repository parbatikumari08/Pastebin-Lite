import React, { useState } from "react";
import api from "../services/api";

export default function CreatePaste() {
  const [content, setContent] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [ttl, setTtl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setResult(null);

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      const payload = {
        content
      };

      if (maxViews) payload.max_views = Number(maxViews);
      if (ttl) payload.ttl_seconds = Number(ttl);

      const res = await api.post("/pastes", payload);

      setResult(res.data);
      setContent("");
      setMaxViews("");
      setTtl("");
    } catch {
      setError("Failed to create paste");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Pastebin Lite</h1>
        <p style={styles.subtitle}>
          Create a paste and share it instantly
        </p>

        <textarea
          rows={10}
          placeholder="Enter your text here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />

        <input
          type="number"
          placeholder="Max views (optional)"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="TTL in seconds (optional)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          style={styles.input}
        />

        <button onClick={submit} style={styles.button}>
          Create Paste
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {result && (
          <div style={styles.result}>
            <p>Shareable link:</p>
            <a
              href={result.url}
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              {result.url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "#fff",
    padding: "32px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },
  title: {
    margin: 0,
    marginBottom: "8px"
  },
  subtitle: {
    marginTop: 0,
    marginBottom: "24px",
    color: "#555"
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "16px",
    resize: "vertical"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "16px"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 500
  },
  error: {
    color: "red",
    marginTop: "12px"
  },
  result: {
    marginTop: "20px",
    padding: "12px",
    background: "#f1f5f9",
    borderRadius: "8px"
  },
  link: {
    wordBreak: "break-all",
    color: "#4f46e5"
  }
};
