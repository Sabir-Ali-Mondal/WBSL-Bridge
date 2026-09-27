"use client";
import { getAuthToken } from "./auth";
import { WsLandmarksPayload } from "@/lib/types";

type MessageHandler = (data: any) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  private getUrl(): string {
    if (typeof window === "undefined") return "";
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = process.env.NEXT_PUBLIC_API_HOST || "localhost:8000";
    const token = getAuthToken();
    const authQuery = token ? `?token=${encodeURIComponent(token)}` : "";
    return `${wsProtocol}//${host}${this.path}${authQuery}`;
  }

  connect() {
    if (typeof window === "undefined") return;
    if (this.ws?.readyState === WebSocket.OPEN) return;
    
    try {
      const url = this.getUrl();
      if (!url) return;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          (this.handlers.get(data.type) || []).forEach((h) => h(data));
          (this.handlers.get("*") || []).forEach((h) => h(data));
        } catch (e) {
          console.error("WS parse error:", e);
        }
      };

      this.ws.onclose = () => {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
          }, 2000 * Math.pow(2, this.reconnectAttempts));
        }
      };
    } catch (err) {
      console.warn("WebSocket connection attempt failed:", err);
    }
  }

  send(payload: WsLandmarksPayload | any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) this.handlers.set(type, []);
    this.handlers.get(type)!.push(handler);
  }

  off(type: string, handler: MessageHandler) {
    const list = this.handlers.get(type) || [];
    this.handlers.set(
      type,
      list.filter((h) => h !== handler)
    );
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.handlers.clear();
  }
}

export default WebSocketManager;
