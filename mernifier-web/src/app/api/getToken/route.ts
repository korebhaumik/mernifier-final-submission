import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request, res: Response) {
  const response = await axios.post(
    "https://api.assemblyai.com/v2/realtime/token",
    { expires_in: 3600 },
    {
      headers: {
        authorization: process.env.NEXT_PUBLIC_AIASSEMLBY_apiKey as string,
      },
    }
  );
  const { data } = response;
  console.log(data);
  console.log("response sent");
  return NextResponse.json({ data });
}
