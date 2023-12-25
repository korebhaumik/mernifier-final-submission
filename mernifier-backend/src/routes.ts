import { Application, Request, Response } from "express";
import { handleSimpleAgent } from "./controllers/agent.handler";

export default async function routes(app: Application) {
  app.get("/", (req: Request, res: Response) => {
    res.send("GET Successful");
  });
  app.post("/", (req: Request, res: Response) => {
    console.log(req.body);
    res.send("POST Successful");
  });

  app.post("/agentOne", handleSimpleAgent);
  // app.post("/multiLLM", handleMultiLLMAgent);
}
