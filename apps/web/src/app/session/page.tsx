"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Mic,
  MicOff,
  ArrowLeft,
  Sparkles,
  Radio,
  CircleAlert,
} from "lucide-react";
import Link from "next/link";

type Status = "idle" | "connecting" | "listening" | "error" | "stopped";

interface Suggestion {
  id: string;
  text: string;
  timestamp: number;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += 0x8000) {
    chunks.push(
      String.fromCharCode.apply(
        null,
        Array.from(bytes.subarray(i, i + 0x8000))
      )
    );
  }
  return btoa(chunks.join(""));
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function SessionPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [meetLink, setMeetLink] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const sendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioBufferRef = useRef<Int16Array[]>([]);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [suggestions.length]);

  const cleanup = useCallback(() => {
    if (sendTimerRef.current) {
      clearInterval(sendTimerRef.current);
      sendTimerRef.current = null;
    }
    audioBufferRef.current = [];

    workletRef.current?.disconnect();
    workletRef.current = null;

    audioContextRef.current?.close();
    audioContextRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "stop" }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startSession = useCallback(async () => {
    setError(null);
    setStatus("connecting");
    setSuggestions([]);

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) {
        stream.getTracks().forEach((t) => t.stop());
        throw new Error(
          'No audio track found. Make sure to check "Also share tab audio" when selecting the tab.'
        );
      }

      stream.getVideoTracks().forEach((t) => t.stop());
      streamRef.current = stream;

      audioTrack.onended = () => {
        stopSession();
      };

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "start", meetLink }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case "status":
            if (msg.status === "listening") {
              setStatus("listening");
            } else if (msg.status === "error") {
              setError(msg.message);
              setStatus("error");
            } else if (msg.status === "stopped") {
              setStatus("stopped");
            }
            break;
          case "suggestion":
            setSuggestions((prev) => [
              ...prev,
              {
                id: `${msg.timestamp}-${Math.random()}`,
                text: msg.text,
                timestamp: msg.timestamp,
              },
            ]);
            break;
        }
      };

      ws.onerror = () => {
        setError("WebSocket connection failed. Is the API server running?");
        setStatus("error");
      };

      ws.onclose = () => {
        if (status === "listening") {
          setStatus("stopped");
        }
      };

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      await audioContext.audioWorklet.addModule("/pcm-processor.js");

      const source = audioContext.createMediaStreamSource(
        new MediaStream([audioTrack])
      );
      const worklet = new AudioWorkletNode(audioContext, "pcm-processor");
      workletRef.current = worklet;

      worklet.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
        audioBufferRef.current.push(new Int16Array(e.data));
      };

      source.connect(worklet);
      worklet.connect(audioContext.destination);

      sendTimerRef.current = setInterval(() => {
        const chunks = audioBufferRef.current;
        if (
          chunks.length === 0 ||
          !wsRef.current ||
          wsRef.current.readyState !== WebSocket.OPEN
        )
          return;

        const totalLen = chunks.reduce((sum, c) => sum + c.length, 0);
        const merged = new Int16Array(totalLen);
        let offset = 0;
        for (const chunk of chunks) {
          merged.set(chunk, offset);
          offset += chunk.length;
        }
        audioBufferRef.current = [];

        wsRef.current.send(
          JSON.stringify({
            type: "audio",
            data: arrayBufferToBase64(merged.buffer),
          })
        );
      }, 200);
    } catch (err) {
      cleanup();
      const message =
        err instanceof Error ? err.message : "Failed to start session";
      setError(message);
      setStatus("error");
    }
  }, [meetLink, cleanup, status]);

  const stopSession = useCallback(() => {
    cleanup();
    setStatus("stopped");
  }, [cleanup]);

  const statusConfig: Record<
    Status,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    idle: {
      label: "Ready",
      color: "border-zinc-600 text-zinc-400 bg-zinc-800/50",
      icon: <Mic className="size-3" />,
    },
    connecting: {
      label: "Connecting...",
      color: "border-amber-500/30 text-amber-400 bg-amber-500/5",
      icon: <Radio className="size-3 animate-pulse" />,
    },
    listening: {
      label: "Listening",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
      icon: <Radio className="size-3 animate-pulse" />,
    },
    error: {
      label: "Error",
      color: "border-red-500/30 text-red-400 bg-red-500/5",
      icon: <CircleAlert className="size-3" />,
    },
    stopped: {
      label: "Stopped",
      color: "border-zinc-600 text-zinc-400 bg-zinc-800/50",
      icon: <MicOff className="size-3" />,
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="relative min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <span className="font-display text-xl italic text-amber-400">
              Selma
            </span>
            <Badge variant="outline" className={currentStatus.color}>
              {currentStatus.icon}
              {currentStatus.label}
            </Badge>
          </div>
          {status === "listening" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={stopSession}
              className="rounded-full"
            >
              End Session
            </Button>
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Setup */}
        {(status === "idle" || status === "error" || status === "stopped") && (
          <div className="mx-auto max-w-md">
            <div className="text-center">
              <h1 className="text-2xl font-medium tracking-tight text-zinc-100">
                Sales Call Assistant
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Paste your Google Meet link and start listening. Selma will
                provide real-time suggestions during your call.
              </p>
            </div>

            <Card className="mt-8 bg-zinc-900/40">
              <CardContent className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="meet-link"
                    className="mb-1.5 block text-sm font-medium text-zinc-300"
                  >
                    Google Meet link
                  </label>
                  <Input
                    id="meet-link"
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                  />
                </div>

                <Button
                  onClick={startSession}
                  className="w-full bg-amber-500 text-zinc-950 hover:bg-amber-400"
                >
                  <Mic className="mr-2 size-4" />
                  Start Listening
                </Button>

                <p className="text-center text-xs text-zinc-500">
                  You&apos;ll be asked to select the tab with your Google Meet
                  call.
                  <br />
                  Make sure to check{" "}
                  <span className="text-zinc-300">
                    &quot;Also share tab audio&quot;
                  </span>
                  .
                </p>

                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {suggestions.length > 0 && (
              <>
                <Separator className="my-8" />
                <p className="mb-4 text-center text-sm text-zinc-500">
                  Previous session suggestions
                </p>
              </>
            )}
          </div>
        )}

        {/* Connecting */}
        {status === "connecting" && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-12 animate-pulse rounded-full bg-amber-500/10 p-3">
              <Sparkles className="size-6 text-amber-400" />
            </div>
            <p className="mt-4 text-lg font-medium text-zinc-100">
              Connecting to Selma...
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Setting up audio capture and AI session
            </p>
          </div>
        )}

        {/* Suggestion Feed */}
        {suggestions.length > 0 && (
          <div
            className={
              status === "listening" ? "mx-auto max-w-2xl" : "mx-auto max-w-md"
            }
          >
            {status === "listening" && (
              <div className="mb-6 flex items-center gap-2">
                <div className="size-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-sm text-zinc-400">
                  Listening to your call. Suggestions will appear below.
                </span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {suggestions.map((s) => (
                <Card key={s.id} className="bg-zinc-900/40 animate-fade-up">
                  <CardContent className="flex gap-4">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-zinc-200">
                        {s.text}
                      </p>
                      <p className="mt-1 text-xs text-zinc-600">
                        {formatTime(s.timestamp)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div ref={feedEndRef} />
            </div>

            {status === "listening" && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopSession}
                  className="rounded-full"
                >
                  <MicOff className="mr-2 size-3" />
                  Stop Listening
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty listening state */}
        {status === "listening" && suggestions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-12 rounded-full bg-emerald-500/10 p-3">
              <Radio className="size-6 animate-pulse text-emerald-400" />
            </div>
            <p className="mt-4 text-lg font-medium text-zinc-100">
              Listening...
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Selma is analyzing the conversation. Suggestions will appear when
              relevant.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={stopSession}
              className="mt-6 rounded-full"
            >
              <MicOff className="mr-2 size-3" />
              Stop Listening
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
