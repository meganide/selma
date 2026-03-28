import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createGeminiSession } from "./gemini-session.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

function send(ws: WebSocket, data: Record<string, unknown>) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

wss.on("connection", (ws) => {
  console.log("Client connected");
  let geminiSession: Awaited<ReturnType<typeof createGeminiSession>> | null =
    null;

  ws.on("message", async (raw) => {
    try {
      const message = JSON.parse(raw.toString());

      switch (message.type) {
        case "start": {
          if (geminiSession) {
            geminiSession.close();
          }
          geminiSession = await createGeminiSession({
            onSuggestion(text) {
              send(ws, { type: "suggestion", text, timestamp: Date.now() });
            },
            onError(error) {
              send(ws, { type: "status", status: "error", message: error });
            },
          });
          send(ws, { type: "status", status: "listening" });
          break;
        }
        case "audio": {
          geminiSession?.sendAudio(message.data);
          break;
        }
        case "stop": {
          geminiSession?.close();
          geminiSession = null;
          send(ws, { type: "status", status: "stopped" });
          break;
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";
      console.error("WebSocket message error:", errorMessage);
      send(ws, { type: "status", status: "error", message: errorMessage });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    geminiSession?.close();
    geminiSession = null;
  });

  send(ws, { type: "status", status: "connected" });
});

server.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
