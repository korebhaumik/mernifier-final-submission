import React, { useState } from "react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

type props = {
  stream: MediaStream | undefined;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  status: "RECORDING" | "STOPPED";
  setStatus: React.Dispatch<React.SetStateAction<"RECORDING" | "STOPPED">>;
  recorder: RecordRTC | null;
  setRecorder: React.Dispatch<React.SetStateAction<RecordRTC | null>>;
  setTemp: React.Dispatch<React.SetStateAction<string>>;
  socket: React.MutableRefObject<WebSocket | null>;
};

function Microphone({
  stream,
  setStream,
  status,
  setStatus,
  recorder,
  setRecorder,
  setTemp,
  socket,
}: props) {
  const stop = async () => {
    console.log("stopping");
    if (stream && status == "RECORDING") {
      try {
        if (socket) {
          socket.current?.send(JSON.stringify({ terminate_session: true }));
          socket.current?.close();
          console.log("socketconnection closed");
          socket.current = null;
        }
        if (recorder) {
          recorder.pauseRecording();
          setRecorder(null);
        }
        stream?.getTracks().forEach((track) => track.stop());
        // putHumanInput(streamText);
      } catch (error) {
        console.log("Error accessing media devices.", error);
      }
      setStatus("STOPPED");
    }
  };

  const run = async () => {
    if (status != "RECORDING") {
      // existing setup logic
      try {
        const response = await fetch("/api/getToken", {
          method: "POST",
        });
        const data = await response.json();

        if (data.error) {
          alert(data.error);
          return;
        }
        console.log("DATA : ", data);

        const { token } = data.data;
        const newSocket = new WebSocket(
          `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
        );

        socket.current = newSocket;

        // handle incoming messages to display transcription to the DOM
        const texts: Record<string, string> = {};
        newSocket.onmessage = (message) => {
          let msg = "";
          const res = JSON.parse(message.data);
          texts[res.audio_start] = res.text;
          const keys = Object.keys(texts);
          keys.sort((a: any, b: any) => a - b);
          for (const key of keys) {
            if (texts[key]) {
              msg += ` ${texts[key]}`;
            }
          }
          setTemp(msg);
        };
        newSocket.onerror = (event) => {
          console.error(event);
          socket.current?.close();
        };

        newSocket.onclose = (event) => {
          console.log("SETTING SOCKET TO NULL 2 ", event);
          socket.current = null;
        };
        newSocket.onopen = () => {
          // once socket is open, begin recording
          setTemp("");
          // setFinalText("");
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              setStream(stream);
              setStatus("RECORDING");
              const localRecorder = new RecordRTC(stream, {
                type: "audio",
                mimeType: "audio/webm;codecs=pcm", // endpoint requires 16bit PCM audio
                recorderType: StereoAudioRecorder,
                timeSlice: 250, // set 250 ms intervals of data that sends to AAI
                desiredSampRate: 16000,
                numberOfAudioChannels: 1, // real-time requires only one channel
                bufferSize: 16384,
                audioBitsPerSecond: 128000,
                ondataavailable: (blob: Blob) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64data = reader.result as string;
                    // audio data must be sent as a base64 encoded string
                    if (socket) {
                      if (typeof base64data == "string") {
                        socket.current?.send(
                          JSON.stringify({
                            audio_data: base64data?.split("base64,")[1],
                          })
                        );
                      }
                    }
                  };
                  reader.readAsDataURL(blob);
                },
              });
              setRecorder(localRecorder);
              localRecorder.startRecording();
            })
            .catch((err) => console.error(err));
        };
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div>
      {status == "RECORDING" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 mr-1 text-red-600 cursor-pointer"
          onClick={stop}
        >
          <path
            fill-rule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564a1.312 1.312 0 0 1-1.313-1.313V9.564Z"
            clip-rule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          className="w-6 h-6 cursor-pointer mr-1"
          onClick={run}
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
      )}
    </div>
  );
}

export default Microphone;
