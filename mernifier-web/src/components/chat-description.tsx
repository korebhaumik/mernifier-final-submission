import React from "react";

type Props = {};

export default function EmptyMessage({}: Props) {
  return (
    <div className="px-8 py-9 border rounded-xl border-stone-200 shadow-md ">
      <h1 className="text-lg">Welcome to MERNIFIER AI Assistant!</h1>
      <p className="pt-3 text-zinc-500">
        Discover the excellence of GPT-4 in a compact form with our Lite GPT-4
        Chatbot. It's designed for advanced conversational interactions, aiming
        to boost user involvement and contentment, perfectly suited for a
        MERN-based AI assistant.
      </p>
      <p className="pt-3 text-zinc-500">
        You can start a conversation here or try the following examples:
      </p>
      <ul className="pt-3 text-zinc-700">
        <li className="flex cursor-pointer hover:underline underline-offset-4">
          <RightArrowSVG />
          <span className="ml-2 w-fit">
            How do I set up React Router for a single-page application?
          </span>
        </li>
        <li className="flex mt-2 cursor-pointer hover:underline underline-offset-4">
          <RightArrowSVG />
          <span className="ml-2 w-fit">
            Can you provide an example of using async/await for file operations
            in Node.js?
          </span>
        </li>
        <li className="flex mt-2 cursor-pointer hover:underline underline-offset-4">
          <RightArrowSVG />
          <span className="ml-2 w-fit">
            How do I add schema validation to a MongoDB collection? Can you show
            an example?
          </span>
        </li>
      </ul>
    </div>
  );
}

function RightArrowSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  );
}
