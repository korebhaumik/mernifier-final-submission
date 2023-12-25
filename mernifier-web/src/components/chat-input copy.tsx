// import { useAuth } from "@/context/supabase-auth-provider";
import { Message, CreateMessage, ChatRequestOptions } from "ai";
import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import RecordRTC from "recordrtc";

type Props = {
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => Promise<string | null | undefined>;
  input: string;
  setInput: (value: React.SetStateAction<string>) => void;
  setMessages: (messages: Message[]) => void;
  setSystemMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  systemMessages?: Message[];
  messages: Message[];
  isLoading: boolean;
  setAgentTwoBool: React.Dispatch<React.SetStateAction<boolean>>;
  setAgentOneBool: React.Dispatch<React.SetStateAction<boolean>>;
  setFormatBool: React.Dispatch<React.SetStateAction<boolean>>;
  reload: () => void;
};

export default function ChatInput({
  append,
  setInput,
  isLoading,
  setMessages,
  messages,
  reload,
  setAgentTwoBool,
  setAgentOneBool,
  setFormatBool,
}: Props) {
  const Microphone = dynamic(() => import("./microphone"), { ssr: false });

  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState("");
  const [temp, setTemp] = useState<string>("");

  const [stream, setStream] = useState<MediaStream | undefined>();
  const [status, setStatus] = useState<"RECORDING" | "STOPPED">("STOPPED");
  const [recorder, setRecorder] = useState<RecordRTC | null>(null);
  //   const emptyPartialTranscripts = useRef<number>(0);
  const socket = useRef<WebSocket | null>(null);

  const submit = async () => {
    if (!temp) return;
    setInput(temp);
    setMessages([
      ...messages,
      {
        content: JSON.stringify({ input: temp, file: fileText }),
        role: "user",
        id: "temp",
      },
    ]);
    setAgentOneBool(true);

    setTimeout(async () => {
      setAgentOneBool(false);
      setAgentTwoBool(true);
    }, 5000);

    setTimeout(async () => {
      setAgentTwoBool(false);
      setFormatBool(true);
    }, 10000);

    setTimeout(async () => {
      let tempMessageArray = messages.filter(
        (message) => message.id !== "temp"
      );
      console.log(messages.pop());
      setMessages(tempMessageArray);
      setFormatBool(false);
      await append({
        // content: `You: ${input}`,
        content: JSON.stringify({ input: temp, file: fileText }),
        role: "user",
      });
    }, 15000);
    setTemp("");
    setInput("");
  };

  const regenerate = () => {
    let newItems = [...messages];
    if (newItems.length > 0) {
      newItems[newItems.length - 1].content = "";
    }
    setMessages(newItems);

    setAgentOneBool(true);
    setAgentTwoBool(false);
    setFormatBool(false);

    setTimeout(async () => {
      setAgentOneBool(false);
      setAgentTwoBool(true);
    }, 5000);

    setTimeout(async () => {
      setAgentTwoBool(false);
      setFormatBool(true);
    }, 10000);

    setTimeout(async () => {
      let tempMessageArray = messages.filter(
        (message) => message.id !== "temp"
      );
      console.log(messages.pop());
      setMessages(tempMessageArray);
      setFormatBool(false);
      reload();
    }, 15000);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 flex w-full h-[10.5rem] text-black bg-white border-t border-zinc-200">
      <div className="absolute flex -translate-x-1/2 -top-12 left-1/2">
        <button
          onClick={regenerate}
          className="flex items-center px-4 py-2 bg-white rounded-lg shadow-md"
        >
          <RegenSVG />
          <span className="ml-2 text-sm">Regenerate</span>
        </button>
        <button className="flex items-center px-4 py-2 ml-3 bg-white rounded-lg shadow-md">
          <ShareSVG />
          <span className="ml-2 text-sm">Share</span>
        </button>
      </div>
      {file && (
        <div className="flex absolute top-2 left-1/2 -translate-x-1/2 bg-white items-center justify-between  w-full md:w-[40rem] px-4">
          <p className="text-sm text-zinc-600  underline">{file.name}</p>
          <button
            className="text-sm text-red-400"
            onClick={() => {
              setFile(null);
              setFileText("");
            }}
          >
            Remove
          </button>
        </div>
      )}
      <div className="fixed bottom-0 pb-8 w-full md:w-[40rem] left-1/2 -translate-x-1/2  rounded-t">
        <div className="flex items-center px-4 py-2 mb-5 border rounded-lg shadow-md border-stone-100">
          <TripleDotsSVG />
          <input
            type="text"
            placeholder="Eg: How create a new collection in mongoDB?"
            value={temp}
            className="w-full px-4 py-2 text-sm border-none rounded-none outline-none placeholder-zinc-500 bg-inherit"
            onChange={(e) => {
              setTemp(e.target.value);
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit();
              }
            }}
          />
          <div className="flex items-center py-2 w-[5.2rem] justify-between ">
            <UploadFile setFile={setFile} setFileText={setFileText} />
            {isLoading ? (
              <MicSVG />
            ) : (
              <Microphone
                recorder={recorder}
                setRecorder={setRecorder}
                status={status}
                setStatus={setStatus}
                stream={stream}
                setStream={setStream}
                setTemp={setTemp}
                socket={socket}
              />
            )}
            <button onClick={submit} disabled={isLoading}>
              <PlaneSVG />
            </button>
          </div>
        </div>
        <p className="mx-auto text-sm text-zinc-500 w-fit">
          Mernifier AI Assistant developed by{" "}
          <span className="underline cursor-pointer text-zinc-400">
            @random_state_42
          </span>
        </p>
      </div>
    </div>
  );
}

function TripleDotsSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // width="25"
      // height="25"
      viewBox="0 0 25 25"
      fill="none"
      className="w-7 h-7"
    >
      <path
        d="M9.125 12.5C9.125 12.5995 9.08549 12.6948 9.01517 12.7652C8.94484 12.8355 8.84946 12.875 8.75 12.875C8.65054 12.875 8.55516 12.8355 8.48484 12.7652C8.41451 12.6948 8.375 12.5995 8.375 12.5C8.375 12.4005 8.41451 12.3052 8.48484 12.2348C8.55516 12.1645 8.65054 12.125 8.75 12.125C8.84946 12.125 8.94484 12.1645 9.01517 12.2348C9.08549 12.3052 9.125 12.4005 9.125 12.5ZM9.125 12.5H8.75M12.875 12.5C12.875 12.5995 12.8355 12.6948 12.7652 12.7652C12.6948 12.8355 12.5995 12.875 12.5 12.875C12.4005 12.875 12.3052 12.8355 12.2348 12.7652C12.1645 12.6948 12.125 12.5995 12.125 12.5C12.125 12.4005 12.1645 12.3052 12.2348 12.2348C12.3052 12.1645 12.4005 12.125 12.5 12.125C12.5995 12.125 12.6948 12.1645 12.7652 12.2348C12.8355 12.3052 12.875 12.4005 12.875 12.5ZM12.875 12.5H12.5M16.625 12.5C16.625 12.5995 16.5855 12.6948 16.5152 12.7652C16.4448 12.8355 16.3495 12.875 16.25 12.875C16.1505 12.875 16.0552 12.8355 15.9848 12.7652C15.9145 12.6948 15.875 12.5995 15.875 12.5C15.875 12.4005 15.9145 12.3052 15.9848 12.2348C16.0552 12.1645 16.1505 12.125 16.25 12.125C16.3495 12.125 16.4448 12.1645 16.5152 12.2348C16.5855 12.3052 16.625 12.4005 16.625 12.5ZM16.625 12.5H16.25M21.5 12.5C21.5 13.6819 21.2672 14.8522 20.8149 15.9442C20.3626 17.0361 19.6997 18.0282 18.864 18.864C18.0282 19.6997 17.0361 20.3626 15.9442 20.8149C14.8522 21.2672 13.6819 21.5 12.5 21.5C11.3181 21.5 10.1478 21.2672 9.05585 20.8149C7.96392 20.3626 6.97177 19.6997 6.13604 18.864C5.30031 18.0282 4.63738 17.0361 4.18508 15.9442C3.73279 14.8522 3.5 13.6819 3.5 12.5C3.5 10.1131 4.44821 7.82387 6.13604 6.13604C7.82387 4.44821 10.1131 3.5 12.5 3.5C14.8869 3.5 17.1761 4.44821 18.864 6.13604C20.5518 7.82387 21.5 10.1131 21.5 12.5Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RegenSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
    >
      <path
        d="M13.3522 8.29019H17.5122L14.8613 5.63769C14.0079 4.78425 12.9448 4.17052 11.779 3.8582C10.6132 3.54588 9.38567 3.54597 8.21989 3.85846C7.0541 4.17096 5.99113 4.78485 5.13783 5.63842C4.28452 6.49198 3.67096 7.55515 3.35883 8.72103M2.48716 16.8702V12.7102M2.48716 12.7102H6.64716M2.48716 12.7102L5.13716 15.3627C5.99059 16.2161 7.05366 16.8299 8.21948 17.1422C9.38531 17.4545 10.6128 17.4544 11.7786 17.1419C12.9444 16.8294 14.0074 16.2155 14.8607 15.362C15.714 14.5084 16.3275 13.4452 16.6397 12.2794M17.5122 4.13019V8.28853"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ShareSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
    >
      <path
        d="M13.3927 18.2096C13.8735 18.6917 14.4598 18.9337 15.1458 18.9337C15.8318 18.9337 16.4181 18.6924 16.8988 18.2117C17.3796 17.7309 17.6208 17.1446 17.6208 16.4587C17.6208 15.7727 17.3796 15.1864 16.8988 14.7057C16.4181 14.2249 15.8318 13.9837 15.1458 13.9837C14.7739 13.9837 14.4407 14.0445 14.1484 14.1687C13.8843 14.2809 13.6496 14.4269 13.4448 14.6068L7.26088 11.0965C7.2817 11.009 7.30039 10.9224 7.31693 10.8368C7.33887 10.7234 7.35 10.6128 7.35 10.5053C7.35 10.3984 7.33897 10.2702 7.31774 10.1216C7.30102 10.0045 7.28198 9.8976 7.26053 9.80108L13.438 6.37596C13.6467 6.59421 13.895 6.75418 14.1819 6.85508C14.489 6.96312 14.8106 7.01699 15.1458 7.01699C15.8318 7.01699 16.4181 6.77577 16.8988 6.29499C17.3796 5.81422 17.6208 5.22793 17.6208 4.54199C17.6208 3.85605 17.3796 3.26976 16.8988 2.78899C16.4181 2.30822 15.8318 2.06699 15.1458 2.06699C14.4599 2.06699 13.8736 2.30822 13.3928 2.78899C12.9121 3.26976 12.6708 3.85605 12.6708 4.54199C12.6708 4.66264 12.6818 4.78692 12.7035 4.91474C12.7199 5.01122 12.7425 5.10155 12.7718 5.18543L6.59901 8.73018C6.36846 8.51153 6.11243 8.3415 5.83106 8.22091C5.52686 8.09054 5.20789 8.02533 4.875 8.02533C4.18906 8.02533 3.60277 8.26655 3.122 8.74732C2.64123 9.2281 2.4 9.81438 2.4 10.5003C2.4 11.1863 2.64123 11.7726 3.122 12.2533C3.60277 12.7341 4.18906 12.9753 4.875 12.9753C5.21024 12.9753 5.53739 12.8987 5.85557 12.7468C6.14594 12.6082 6.39538 12.4296 6.60277 12.2106L12.7738 15.7951C12.7434 15.8882 12.72 15.9888 12.7033 16.0966C12.682 16.2335 12.6708 16.3522 12.6708 16.4518C12.6708 17.1395 12.912 17.7274 13.3927 18.2096ZM15.8771 5.27272C15.6816 5.46873 15.4403 5.56699 15.1466 5.56699C14.8527 5.56699 14.6112 5.46891 14.4151 5.27329C14.2191 5.07772 14.1208 4.83649 14.1208 4.54272C14.1208 4.24887 14.2189 4.00734 14.4145 3.81127C14.6101 3.61526 14.8513 3.51699 15.1451 3.51699C15.439 3.51699 15.6805 3.61507 15.8766 3.8107C16.0726 4.00627 16.1708 4.24749 16.1708 4.54126C16.1708 4.83511 16.0728 5.07665 15.8771 5.27272ZM5.60629 11.231C5.41072 11.4271 5.1695 11.5253 4.87573 11.5253C4.58188 11.5253 4.34035 11.4272 4.14428 11.2316C3.94827 11.036 3.85 10.7948 3.85 10.5011C3.85 10.2072 3.94808 9.96567 4.14371 9.7696C4.33927 9.57359 4.5805 9.47533 4.87427 9.47533C5.16812 9.47533 5.40965 9.57341 5.60572 9.76903C5.80173 9.9646 5.9 10.2058 5.9 10.4996C5.9 10.7934 5.80192 11.035 5.60629 11.231ZM15.8771 17.1894C15.6816 17.3854 15.4403 17.4837 15.1466 17.4837C14.8527 17.4837 14.6112 17.3856 14.4151 17.19C14.2191 16.9944 14.1208 16.7532 14.1208 16.4594C14.1208 16.1655 14.2189 15.924 14.4145 15.7279C14.6101 15.5319 14.8513 15.4337 15.1451 15.4337C15.439 15.4337 15.6805 15.5317 15.8766 15.7274C16.0726 15.9229 16.1708 16.1642 16.1708 16.4579C16.1708 16.7518 16.0728 16.9933 15.8771 17.1894Z"
        fill="#374151"
        stroke="#374151"
        strokeWidth="0.2"
      />
    </svg>
  );
}
function PlaneSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      className="w-5 h-5"
    >
      <path
        d="M6.49955 12.5L3.76855 3.62598C10.3014 5.52565 16.4619 8.52677 21.9846 12.5C16.4623 16.4738 10.3021 19.4755 3.76955 21.376L6.49955 12.5ZM6.49955 12.5H13.9996"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function MicSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      className="w-5 h-5"
    >
      <path
        d="M8.75 5C8.75 4.00544 9.14509 3.05161 9.84835 2.34835C10.5516 1.64509 11.5054 1.25 12.5 1.25C13.4946 1.25 14.4484 1.64509 15.1517 2.34835C15.8549 3.05161 16.25 4.00544 16.25 5V13.25C16.25 14.2446 15.8549 15.1984 15.1517 15.9017C14.4484 16.6049 13.4946 17 12.5 17C11.5054 17 10.5516 16.6049 9.84835 15.9017C9.14509 15.1984 8.75 14.2446 8.75 13.25V5Z"
        fill="currentColor"
      />
      <path
        d="M6.5 11C6.69891 11 6.88968 11.079 7.03033 11.2197C7.17098 11.3603 7.25 11.5511 7.25 11.75V13.25C7.25 14.6424 7.80312 15.9777 8.78769 16.9623C9.77225 17.9469 11.1076 18.5 12.5 18.5C13.8924 18.5 15.2277 17.9469 16.2123 16.9623C17.1969 15.9777 17.75 14.6424 17.75 13.25V11.75C17.75 11.5511 17.829 11.3603 17.9697 11.2197C18.1103 11.079 18.3011 11 18.5 11C18.6989 11 18.8897 11.079 19.0303 11.2197C19.171 11.3603 19.25 11.5511 19.25 11.75V13.25C19.25 14.9104 18.638 16.5126 17.5312 17.7503C16.4243 18.9879 14.9001 19.7743 13.25 19.959V22.25H16.25C16.4489 22.25 16.6397 22.329 16.7803 22.4697C16.921 22.6103 17 22.8011 17 23C17 23.1989 16.921 23.3897 16.7803 23.5303C16.6397 23.671 16.4489 23.75 16.25 23.75H8.75C8.55109 23.75 8.36032 23.671 8.21967 23.5303C8.07902 23.3897 8 23.1989 8 23C8 22.8011 8.07902 22.6103 8.21967 22.4697C8.36032 22.329 8.55109 22.25 8.75 22.25H11.75V19.959C10.0999 19.7743 8.57571 18.9879 7.46884 17.7503C6.36196 16.5126 5.75002 14.9104 5.75 13.25V11.75C5.75 11.5511 5.82902 11.3603 5.96967 11.2197C6.11032 11.079 6.30109 11 6.5 11Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UploadSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="absolute w-5 h-5 top-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
      />
    </svg>
  );
}
type UploadFileProps = {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setFileText: React.Dispatch<React.SetStateAction<string>>;
};
function UploadFile({ setFile, setFileText }: UploadFileProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      // console.log(e.target?.result);
      setFileText(e.target!.result as string);
    };

    reader.readAsText(file);
    setFile(file);
  };
  return (
    <div className="relative">
      <UploadSVG />
      <input
        type="file"
        accept=".js,.html,.css"
        className="z-10 w-5 h-5 opacity-0 cursor-pointer"
        onChange={handleChange}
      />
    </div>
  );
}
