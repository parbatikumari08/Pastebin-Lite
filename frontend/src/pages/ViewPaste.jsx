import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function ViewPaste() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/pastes/${id}`)
      .then((res) => setContent(res.data.content))
      .catch(() => setError("Paste not found or expired"));
  }, [id]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <pre style={styles.pre}>{content}</pre>
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
    padding: "24px",
    borderRadius: "12px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },
  pre: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  },
  error: {
    textAlign: "center",
    color: "red"
  }
};
