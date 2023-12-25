"use client";
import { useChat, type Message } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./chat-message";
import EmptyMessage from "./chat-description";
import ChatInput from "./chat-input";
import { toast } from "react-hot-toast";
// import { useAuth } from "@/context/supabase-auth-provider";

type Props = {};

export default function MessageSection({}: Props) {
  // const { promptCount } = useAuth();
  const [systemMessages, setSystemMessages] = useState<Message[]>([]);
  const [agentOneBool, setAgentOneBool] = useState<boolean>(false);
  const [agentTwoBool, setAgentTwoBool] = useState<boolean>(false);
  const [formatBool, setFormatBool] = useState<boolean>(false);
  const { messages, setInput, append, input, isLoading, setMessages, reload } =
    useChat({
      body: {
        promptCount: 10,
      },
      api: "http://localhost:1337/agentOne",
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
    });
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length === 0) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentOneBool, agentTwoBool, formatBool]);
  return (
    <div className="pb-[160px] pt-4 md:pt-8">
      <div className="relative mx-auto max-w-2xl px-4">
        {messages.map((message, index) => (
          <>
            <div key={index}>
              <ChatMessage
                message={message}
                isLoading={isLoading}
                agentTwoBool={agentTwoBool}
                agentOneBool={agentOneBool}
                formatBool={formatBool}
                isLast={messages.length - 1 == index}
              />
              {index < messages.length - 1 && (
                <hr className="border-stone-200" />
              )}
            </div>
            {/* <>
              {systemMessages.map((sysMessage, sysIndex) => (
                <>
                  {sysIndex <= index && (
                    <div key={sysIndex}>
                      <p>{sysMessage.content}</p>
                    </div>
                  )}
                </>
              ))}
            </> */}
          </>
        ))}
        {messages.length === 0 && <EmptyMessage />}
      </div>
      <div ref={bottomRef} className="" />

      <button></button>
      <ChatInput
        append={append}
        messages={messages}
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        setMessages={setMessages}
        systemMessages={systemMessages}
        setSystemMessages={setSystemMessages}
        reload={reload}
        setAgentTwoBool={setAgentTwoBool}
        setAgentOneBool={setAgentOneBool}
        setFormatBool={setFormatBool}
      />
    </div>
  );
}
