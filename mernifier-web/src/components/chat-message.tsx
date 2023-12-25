import { Message } from "ai";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { CodeBlock } from "@/components/codeblock";
import { MemoizedReactMarkdown } from "@/components/markdown";
import cn from "@/lib/utils";

export interface ChatMessageProps {
  message: Message;
  isLoading: boolean;
  agentTwoBool: boolean;
  agentOneBool: boolean;
  formatBool: boolean;
  isLast: boolean;
}

export function ChatMessage({
  message,
  isLoading,
  agentTwoBool,
  agentOneBool,
  formatBool,
  isLast,
  ...props
}: ChatMessageProps) {
  return (
    <>
      <div
        //   className={cn("group relative mb-4 flex items-start md:-ml-12")}
        className={"relative  my-8 flex items-start md:-ml-12"}
        {...props}
      >
        <div
          className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border shadow ${
            message.role === "user"
              ? "bg-white text-black border-stone-50"
              : "bg-black"
          }`}
        >
          {message.role === "user" ? <IconUser /> : <IconOpenAI />}
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
          <MemoizedReactMarkdown
            className="prose text-black/75 break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              code({ node, inline, className, children, ...props }) {
                // if (children.length) {
                //   if (children[0] == "▍") {
                //     return (
                //       <span className="mt-1 animate-pulse cursor-default">
                //         ▍
                //       </span>
                //     );
                //   }

                //   children[0] = (children[0] as string).replace("`▍`", "▍");
                // }

                const match = /language-(\w+)/.exec(className || "");

                if (inline) {
                  return (
                    <code className={cn(className, "text-blue-900")} {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ""}
                    value={String(children).replace(/\n$/, "")}
                    {...props}
                  />
                );
              },
            }}
          >
            {message.role === "user"
              ? JSON.parse(message.content).input
              : message.content}
          </MemoizedReactMarkdown>
        </div>
      </div>
      {message.role === "user" && (
        <div
          className={cn(
            "flex items-center md:-ml-12 rounded-lg shadow-md border-2 border-blue-800 px-4 py-4",
            {
              "border-blue-800": agentOneBool,
              "border-stone-200": !agentOneBool,
            }
          )}
        >
          <SparklesSVG />
          <p className=" ml-3 mr-3 ">CodeBot generating code 🤖. . .</p>
          {isLast && agentOneBool && <LoadingSpinner />}
        </div>
      )}
      {message.role === "user" && !agentOneBool && (
        <div
          className={cn(
            "flex items-center md:-ml-12 mt-3 rounded-lg shadow-md border-2 border-stone-200 px-4 py-4",
            {
              // "border-blue-800": agentTwoBool,
              // "border-stone-200": !agentTwoBool,
            }
          )}
        >
          <SparklesSVG />
          <p className="ml-3 mr-3 ">Code Generated</p>
          <TickSVG />
        </div>
      )}
      {message.role === "user" && !agentOneBool && (
        <div
          className={cn(
            "flex items-center md:-ml-12 mt-3 rounded-lg shadow-md border-2 border-stone-200 px-4 py-4",
            {
              "border-blue-800": agentTwoBool,
              "border-stone-200": !agentTwoBool,
            }
          )}
        >
          <SparklesSVG />
          <p className="ml-3 mr-3 ">TesterBot testing the code 🐢 . . .</p>
          {isLast && agentTwoBool && <LoadingSpinner />}
        </div>
      )}
      {message.role === "user" && !agentOneBool && !agentTwoBool && (
        <div
          className={cn(
            "flex items-center md:-ml-12 mt-3 rounded-lg shadow-md border-2 border-stone-200 px-4 py-4",
            {
              "border-blue-800": formatBool,
              "border-stone-200": !formatBool,
            }
          )}
        >
          {/* <SparklesSVG /> */}
          <p className="ml-3 mr-3 ">Formating the response...</p>
          {isLast && formatBool && <LoadingSpinner />}
        </div>
      )}
    </>
  );
}

function IconUser() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="16"
      viewBox="0 0 13 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.85647 3.42857C2.85647 2.51926 3.21769 1.64719 3.86067 1.0042C4.50366 0.361223 5.37573 0 6.28504 0C7.19435 0 8.06642 0.361223 8.7094 1.0042C9.35238 1.64719 9.71361 2.51926 9.71361 3.42857C9.71361 4.33788 9.35238 5.20995 8.7094 5.85293C8.06642 6.49591 7.19435 6.85714 6.28504 6.85714C5.37573 6.85714 4.50366 6.49591 3.86067 5.85293C3.21769 5.20995 2.85647 4.33788 2.85647 3.42857ZM9.09739e-05 14.1752C0.0257826 12.5253 0.699246 10.9517 1.87511 9.79396C3.05097 8.63626 4.63491 7.98738 6.28504 7.98738C7.93516 7.98738 9.51911 8.63626 10.695 9.79396C11.8708 10.9517 12.5443 12.5253 12.57 14.1752C12.572 14.2863 12.5415 14.3955 12.4824 14.4896C12.4233 14.5836 12.338 14.6584 12.237 14.7047C10.3697 15.5609 8.33925 16.0028 6.28504 16C4.16237 16 2.14561 15.5367 0.333043 14.7047C0.23208 14.6584 0.146815 14.5836 0.0876811 14.4896C0.0285473 14.3955 -0.00189092 14.2863 9.09739e-05 14.1752Z"
        fill="black"
      />
    </svg>
  );
}

function IconOpenAI() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-white border-none rounded w-7 h-7 p-[5px] bg-black"
    >
      <path
        d="M11.1348 1.01758C10.8718 1.00499 10.6068 1.00883 10.338 1.03321C8.1136 1.2339 6.33629 2.79408 5.60944 4.82031C3.89712 5.17684 2.43734 6.30485 1.67194 7.95703C0.734056 9.98406 1.19735 12.3008 2.58796 13.9434C2.04033 15.6052 2.28569 17.4345 3.3321 18.9219C4.61828 20.7478 6.85664 21.5047 8.97468 21.1211C10.1397 22.4276 11.8476 23.1305 13.6622 22.9668C15.8866 22.7661 17.6639 21.206 18.3907 19.1797C20.103 18.8231 21.5639 17.696 22.3301 16.043C23.2682 14.0163 22.8054 11.6971 21.4141 10.0547C21.9608 8.39344 21.714 6.56484 20.668 5.07813C19.3819 3.25224 17.1435 2.49531 15.0255 2.87891C14.033 1.766 12.6469 1.08998 11.1348 1.01758ZM11.0255 2.51367C11.922 2.54885 12.7551 2.87459 13.4317 3.42188C13.3186 3.47792 13.2002 3.51641 13.0899 3.58008L9.07624 5.89649C8.77024 6.07249 8.58024 6.39896 8.57624 6.75196L8.51765 12.2383L6.75007 11.1895V6.78516C6.75007 4.64916 8.30766 2.74225 10.4337 2.53125C10.633 2.5115 10.8305 2.50603 11.0255 2.51367ZM16.1251 4.25586C17.3987 4.26342 18.6399 4.82516 19.418 5.91016C20.0709 6.81959 20.3103 7.902 20.1466 8.94727C20.0415 8.87736 19.9482 8.79415 19.838 8.73047L15.8262 6.41406C15.5202 6.23806 15.144 6.23521 14.836 6.40821L10.0528 9.10352L10.0762 7.04883L13.8907 4.84766C14.5844 4.44716 15.3609 4.25133 16.1251 4.25586ZM5.28327 6.47266C5.27528 6.59853 5.25007 6.7204 5.25007 6.84766V11.4805C5.25007 11.8335 5.4363 12.1598 5.7403 12.3398L10.4649 15.1367L8.6739 16.1426L4.85944 13.9395C3.00944 12.8715 2.13665 10.5671 3.01765 8.6211C3.47963 7.60069 4.29644 6.85358 5.28327 6.47266ZM15.3262 7.85742L19.1407 10.0605C20.9907 11.1285 21.8654 13.4329 20.9844 15.3789C20.5224 16.3996 19.704 17.1465 18.7169 17.5273C18.7248 17.4017 18.7501 17.2794 18.7501 17.1523V12.5215C18.7501 12.1675 18.5638 11.8402 18.2598 11.6602L13.5352 8.86328L15.3262 7.85742ZM12.0255 9.71094L13.9942 10.8789L13.9669 13.168L11.9747 14.2871L10.0059 13.1211L10.0313 10.832L12.0255 9.71094ZM15.4825 11.7617L17.2501 12.8105V17.2148C17.2501 19.3508 15.6925 21.2578 13.5665 21.4688C12.45 21.5793 11.3922 21.2444 10.5684 20.5781C10.6815 20.5221 10.8 20.4836 10.9102 20.4199L14.9239 18.1035C15.2299 17.9275 15.4199 17.601 15.4239 17.248L15.4825 11.7617ZM13.9473 14.8965L13.9239 16.9512L10.1094 19.1523C8.25944 20.2203 5.8271 19.8258 4.5821 18.0898C3.92921 17.1804 3.68983 16.098 3.85358 15.0527C3.9588 15.1228 4.05174 15.2057 4.16218 15.2695L8.1739 17.5859C8.4799 17.7619 8.85613 17.7648 9.16413 17.5918L13.9473 14.8965Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SparklesSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 fill-blue-800"
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
function TickSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 fill-lime-800"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-300 fill-blue-800"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
