"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import WebSocketManager from "@/services/ws";

export function useWebSocket(path: string = "/ws/landmarks") {
  const wsManagerRef = useRef<WebSocketManager | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocketManager(path);
    wsManagerRef.current = ws;

    ws.on("*", (data) => {
      setLastMessage(data);
      if (data.type === "status") {
        setIsConnected(data.status === "active");
      }
    });

    ws.connect();

    return () => {
      ws.disconnect();
    };
  }, [path]);

  const sendMessage = useCallback((payload: any) => {
    wsManagerRef.current?.send(payload);
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
}
