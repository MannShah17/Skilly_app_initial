import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import useRecorder from "../lib/hooks/useRecorder";
import RecorderFooter from "../components/recorderFooter/RecorderFooter";
import usePlayer from "../lib/hooks/usePlayer";
import Cursor from "../components/cursor/Cursor";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const {
    recordings,
    recorderElementRef,
    isRecording,
    isPlayerVisible,
    onRecordingStop,
    onRecordingStart,
    recordedTime,
    recorderEndTime,
    recorderStartTime,
    recordedAudio,
  } = useRecorder();

  const { isPlaying, setIsPlaying, cursorRef, progress } = usePlayer(
    recordings,
    recorderStartTime,
    recorderEndTime,
    recordedAudio
  );

  const [htmlContent, setHtmlContent] = useState("");

  const handleInputChange = (event) => {
    setHtmlContent(event.target.value);
  };

  useEffect(() => {
    if (isPlaying) {
      const textarea = document.querySelector(".code-input");
      textarea.value = htmlContent;
    }
  }, [isPlaying, htmlContent]);

  return (
    <div className="code-editor">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Cursor cursorRef={cursorRef} />
      <RecorderFooter
        isRecording={isRecording}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isPlayerVisible={isPlayerVisible}
        onStart={onRecordingStart}
        onStop={onRecordingStop}
        recordedTime={recordedTime}
        progress={progress}
      />
      <main className="code-editor-content" ref={recorderElementRef}>
        <div style={{ display: "flex", height: "100vh" }}>
          <iframe
            style={{ width: "50%", border: "none" }}
            srcDoc={htmlContent}
            title="Output"
          ></iframe>
          <textarea
            className="code-input"
            style={{ width: "50%", padding: "10px", fontSize: "16px" }}
            placeholder="Write your HTML code here"
            // value={htmlContent}
            onChange={handleInputChange}
          ></textarea>
        </div>
      </main>
    </div>
  );
}
