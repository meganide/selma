import { GoogleGenAI, Modality } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are Selma, an AI sales coach listening to a live sales call. Provide real-time coaching to the sales rep.

Listen and suggest:
- Objection handling responses
- Follow-up questions to ask
- Closing techniques when the moment is right
- Rapport-building phrases

Rules:
- 1-2 sentences max per suggestion
- Only suggest when truly helpful, stay silent if the call is going well
- Be specific to what was just said
- Frame as what to say, not what to think`;

interface SessionCallbacks {
  onSuggestion: (text: string) => void;
  onError: (error: string) => void;
}

export async function createGeminiSession(callbacks: SessionCallbacks) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }

  const ai = new GoogleGenAI({ apiKey });
  let currentText = "";

  const session = await ai.live.connect({
    model: "gemini-2.0-flash-live-001",
    config: {
      responseModalities: [Modality.TEXT],
      systemInstruction: SYSTEM_INSTRUCTION,
    },
    callbacks: {
      onopen() {
        console.log("Gemini Live session opened");
      },
      onmessage(message) {
        if (message.text) {
          currentText += message.text;
        }
        if (message.serverContent?.turnComplete) {
          if (currentText.trim()) {
            callbacks.onSuggestion(currentText.trim());
          }
          currentText = "";
        }
      },
      onerror(e) {
        console.error("Gemini Live error:", e.message);
        callbacks.onError(e.message);
      },
      onclose(e) {
        console.log("Gemini Live session closed:", e.reason);
      },
    },
  });

  return {
    sendAudio(base64Data: string) {
      session.sendRealtimeInput({
        audio: {
          data: base64Data,
          mimeType: "audio/pcm;rate=16000",
        },
      });
    },
    close() {
      session.close();
    },
  };
}
