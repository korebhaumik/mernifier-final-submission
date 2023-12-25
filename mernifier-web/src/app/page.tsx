import MessageSection from "@/components/chat-container";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";

export default async function Home() {
  return (
    <main className="">
      <Navbar />
      <MessageSection />
      <Toaster />
    </main>
  );
}
