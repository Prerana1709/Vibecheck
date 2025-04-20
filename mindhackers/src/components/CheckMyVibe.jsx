import React, { useState } from "react";

const CheckMyVibe = () => {
    const [response, setResponse] = useState("...");
    const [status, setStatus] = useState("Click mic and speak");

    const askMicPermission = () => {
        startVoice();
    };

    const startVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setStatus("⚠ Your browser doesn’t support SpeechRecognition");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognition.onstart = () => setStatus("🎧 Listening...");
        recognition.start();

        recognition.onresult = async (event) => {
            const userMessage = event.results[0][0].transcript;
            setStatus("🧠 Thinking...");

            try {
                const res = await fetch("http://localhost:5000/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: userMessage }),
                });

                const data = await res.json();

                if (data.reply && data.audio) {
                    setResponse(data.reply);
                    setStatus("✅ Responded");

                    const audioBlob = base64ToBlob(data.audio, "audio/mp3");
                    const audioUrl = URL.createObjectURL(audioBlob);
                    new Audio(audioUrl).play();
                } else if (data.reply) {
                    setResponse(data.reply);
                    setStatus("✅ Responded (voice only)");
                } else {
                    setResponse("🤖 Sorry, I couldn't understand that.");
                    setStatus("⚠ Error in response");
                }
            } catch (error) {
                console.error("Connection error:", error);
                setResponse("🚫 Could not connect to the backend.");
                setStatus("⚠ Connection Error");
            }
        };

        recognition.onerror = (evt) => {
            console.error("SpeechRecognition error:", evt.error, evt.message);
            switch (evt.error) {
                case "not-allowed":
                case "permission-denied":
                    setStatus("❌ Microphone permission denied");
                    break;
                case "aborted":
                    setStatus("⏹️ Listening aborted");
                    break;
                default:
                    setStatus(`⚠ ${evt.error}`);
            }
        };
    };

    const base64ToBlob = (base64, mimeType) => {
        const byteChars = atob(base64);
        const byteNumbers = Array.from(byteChars, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <h1>🧘‍♀️ Check My Vibe</h1>
            <button
                onClick={askMicPermission}
                style={{
                    fontSize: "2rem",
                    padding: "1rem",
                    borderRadius: "50%",
                    backgroundColor: "#ff69b4",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                🎤
            </button>
            <p style={{ marginTop: "1rem", fontStyle: "italic" }}>{status}</p>
            <p><strong>ZenBot:</strong> {response}</p>
        </div>
    );
};

export default CheckMyVibe;
