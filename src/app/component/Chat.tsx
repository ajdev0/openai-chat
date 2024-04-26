"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface Message {
  role: string;
  content: string;
}

const Chat: React.FC = () => {
  const [prompt, setPrompt] = useState<Message>({ role: "", content: "" });

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [count, setCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const storedCount = localStorage.getItem("COUNT");
      return parseInt(storedCount!) || 0;
    } else {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem("COUNT", count.toString());
    const chatCookie = Cookies.get("_chat");
    if (!chatCookie) {
      setCount(0);
    }
  }, [count]);

  const sendMessage = async () => {
    if (!prompt.content.trim()) return;

    setMessages((prevMessages) => [...prevMessages, prompt]);
    setLoading(true);

    try {
      const options = {
        method: "POST",
        body: JSON.stringify(prompt.content),
      };
      const res = await fetch("/api/chat", options);
      const data = await res.json();
      const responseMessage = data.data.choices[0].message;

      setMessages((prevMessages) => [...prevMessages, responseMessage]);
      setLoading(false);
    } catch (error) {
      // console.error("Error:", error);
      setError(
        "Oops! 🙈 Looks like you've reached your daily quota for today..."
      );
      setLoading(false);
    }

    if (count !== 5) {
      setCount((prevCount) => prevCount + 1);
    } else {
      setCount(5);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
    setPrompt({ role: "", content: "" });
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex border-b-2 border-white/10 justify-between p-4 bg-white/20">
        <div></div>
        <div className="text-[#ff7c00] flex flex-col text-center font-ibm">
          <h3 className=" text-3xl">Techy</h3> <span>gpt-3.5-turbo</span>
        </div>
        <div className="bg-gradient-to-t from-[#FFA34D] to-[#ff7c00]  rounded shadow w-10 h-10 flex items-center justify-center">
          {count}/5
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-2 overflow-scroll">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="msg flex flex-col gap-2 bg-neutral-950/90 p-4 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 p-4 font-bold rounded-full bg-gradient-to-t from-[#FFA34D] to-[#ff7c00] flex justify-center items-center">
                T
              </div>
              <span className="capitalize">{msg.role}</span>
            </div>
            <pre className="text-wrap">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </pre>
          </div>
        ))}
        {loading && (
          <div className="bg-neutral-950/90 p-4 rounded-lg">
            <div className="flex space-x-2 justify-center items-center dark:invert">
              <span className="sr-only">Loading...</span>
              <div className="h-8 w-8 bg-gradient-to-t from-[#FFA34D] to-[#ff7c00] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-8 w-8 bg-gradient-to-t from-[#FFA34D] to-[#ff7c00] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-8 w-8 bg-gradient-to-t from-[#FFA34D] to-[#ff7c00] rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-neutral-950/90 p-4 rounded-lg">{error}</div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex bg-white/20 m-4 p-4 rounded-full">
          <input
            type="text"
            placeholder="Message Techy..."
            value={prompt.content}
            onChange={(e) =>
              setPrompt({ role: "user", content: e.target.value })
            }
            className="bg-transparent w-full p-3 border-none outline-none"
          />
          <button
            type="submit"
            className={`bg-gradient-to-t from-[#FFA34D] to-[#ff7c00] px-6 py-2 rounded-full shadow ${
              loading ? "animate-pulse" : ""
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
