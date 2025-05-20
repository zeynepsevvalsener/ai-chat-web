import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/api"

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "../../src/firebase";  // adjust path as needed

type Message = {
  id: string;          // Firestore doc ID
  text: string;
  from: "me" | "them";
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);   

  // 1) Firestore realtime listener
  useEffect(() => {
    const q = query(
      collection(db, "chats", "default", "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text as string,
          from: data.sender === "user" ? "me" : "them"
        };
      });
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  // 2) Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3) Send handler
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setIsSending(true); 
    setInput("");
    try {
      await addDoc(collection(db, 'chats', 'default', 'messages'), {
        text,
        sender: 'user',
        createdAt: serverTimestamp(),
      });

      const res = await api.post('/api/chat/api/analyze', { input: text });
      const botReply = res.data.reply as string;
      console.log(botReply);
  
      // 3) Bot cevabını Firestore’a yaz
      await addDoc(collection(db, 'chats', 'default', 'messages'), {
        text: botReply,
        sender: 'bot',
        createdAt: serverTimestamp(),
      });
  
    } catch (err) {
      console.error('API Gateway error:', err);
    } finally {
      setIsSending(false);
    }
    
    
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white border shadow-sm">
      <div className="p-4 border-b font-semibold text-lg">Canlı Destek</div>

      <ScrollArea className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-muted">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <Card
              className={`max-w-[75%] m-1 ${
                msg.from === "me"
                  ? "bg-primary text-white"
                  : "bg-background border"
              }`}
            >
              <CardContent className="text-sm">{msg.text}</CardContent>
            </Card>
          </div>
        ))}
        <div ref={scrollRef} />
      </ScrollArea>

      <div className="p-3 border-t flex gap-2">
        <Input
          className="flex-1"
          placeholder="Mesaj yaz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
      <Button
          onClick={handleSend}
          disabled={!input.trim() || isSending} 
        >
          {isSending ? "Gönderiliyor…" : "Gönder"}
        </Button>
      </div>
    </div>
  );
}
