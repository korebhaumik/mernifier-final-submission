import { Request, Response } from "express";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "langchain/tools";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIChat } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { config } from "dotenv";
import { LangChainStream, Message, StreamingTextResponse } from "ai";
config({ path: `.env.local` });


const fs = require("fs");
const { exec } = require("child_process");

const testJScode = new DynamicTool({
  name: "TEST_JS_CODE",
  description:
    "call this to test javascript code. The input should be pure code with no explaination, complete and can be run directly by calling it. It should have proper arguments in order to verify the output. output should be a string indicating the result of the code.",
  func: async (input) => {
    let data = input;

    fs.writeFileSync("dummy.js", data, (err: any) => {
      if (err) throw err;
      // console.log("The file has been saved!");
    });

    let text = "";
    exec("node dummy.js", (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      text = stdout;
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    return text;
  },
});

const llm = new OpenAIChat({
  streaming: true,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  modelName: "gpt-4-1106-preview",
  //   verbose: true,
});

const PseudoAgentOne = async (res: Response, query: string) => {
  const oneInputPrompt = new PromptTemplate({
    inputVariables: ["query"],
    template: `The following is the user's query "{query}". Generate the appropriate code for the given problem.
                If the given query doesn't demand to return code, just answer the givern question. 
          `,
  });
  const formattedPrompt = await oneInputPrompt.format({
    query,
  });
  res.write("system Generating Code...\n");

  const result = await llm
    .call(formattedPrompt, {
      callbacks: [
        {
          handleLLMNewToken(token, idx, runId, parentRunId, tags) {
            console.log(token);
          },
        },
      ],
    })
    .catch(console.error);

  return result;
};

export async function handleSimpleAgent(req: Request, res: Response) {
  const { messages } = req.body;

  console.log(messages);

  const userMessage: Message = messages.at(-1);

  const prompt = await PseudoAgentOne(res, userMessage.content as string);

  const { handlers, stream } = LangChainStream();

  const tools = [testJScode];
  const chat = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
    streaming: true,
  });

  const executor = await initializeAgentExecutorWithOptions(tools, chat, {
    agentType: "openai-functions",
    // agentType: "zero-shot-react-description",
    // verbose: true,
  });

  await executor.run(prompt, {
    callbacks: [
      {
        handleLLMNewToken(token, idx, runId, parentRunId, tags) {
          console.log(token);
          // res.write(token);
        },
      },
    ],
  });
  return new StreamingTextResponse(stream);
}
