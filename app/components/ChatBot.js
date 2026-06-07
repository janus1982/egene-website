"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const WELCOME = "Hej! Jeg kan hjælpe dig med spørgsmål om Egene Rideklub. Hvad vil du gerne vide?";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }]);
  const scrollRef = useRef(null);

  // Scroll til bunden når der kommer nyt
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const tekst = input.trim();
    if (!tekst || sending) return;

    const nyeBeskeder = [...messages, { role: "user", content: tekst }];
    setMessages(nyeBeskeder);
    setInput("");
    setSending(true);

    // Send samtalen uden den indledende velkomstbesked
    const payload = nyeBeskeder.slice(1);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!res.ok || !res.body) throw new Error("Netværksfejl");

      // Tilføj en tom assistent-besked vi fylder op mens svaret streamer ind
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let svar = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        svar += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const kopi = [...m];
          kopi[kopi.length - 1] = { role: "assistant", content: svar };
          return kopi;
        });
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Beklager, der opstod en fejl. Skriv til kontakt@egene.dk eller ring til Sigurd på 27 14 01 33.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Viser typing-prikker mens vi venter på første tegn
  const venterPaaSvar = sending && messages[messages.length - 1]?.role === "user";

  return (
    <>
      {/* Boble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Åbn chat"
          className="fixed bottom-5 right-5 z-[60] bg-green-800 hover:bg-green-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-2xl transition-colors"
        >
          💬
        </button>
      )}

      {/* Chatvindue */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[60] w-[350px] max-w-[calc(100vw-2.5rem)] h-[500px] max-h-[calc(100vh-2.5rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-green-100">
          {/* Header */}
          <div className="bg-green-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-white rounded-lg p-1">
                <Image src="/logo.png" alt="Egene Rideklub" width={28} height={28} className="object-contain" />
              </span>
              <span className="font-semibold text-sm">Egene Rideklub</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Luk chat" className="text-white/80 hover:text-white text-xl leading-none">
              ✕
            </button>
          </div>

          {/* Beskeder */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-green-50/40">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap " +
                    (m.role === "user"
                      ? "bg-green-800 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-green-100 rounded-bl-sm")
                  }
                >
                  {m.content.replace(/\*\*/g, "").replace(/^#+\s*/gm, "")}
                </div>
              </div>
            ))}

            {/* Typing-indikator */}
            {venterPaaSvar && (
              <div className="flex justify-start">
                <div className="bg-white border border-green-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-green-700/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-green-700/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-green-700/60 rounded-full animate-bounce" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-green-100 p-3 flex gap-2 items-end bg-white">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Skriv dit spørgsmål…"
              className="flex-1 resize-none rounded-xl border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 max-h-24"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              aria-label="Send"
              className="bg-green-800 hover:bg-green-700 disabled:opacity-40 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
