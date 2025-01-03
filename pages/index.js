import Head from "next/head";
import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";
import useRecorder from "../lib/hooks/useRecorder";
import RecorderFooter from "../components/recorderFooter/RecorderFooter";
import usePlayer from "../lib/hooks/usePlayer";
import Cursor from "../components/cursor/Cursor";
import { OpenAI } from "openai";
// import { ChatOpenAI } from "langchain/chat_models/openai";

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
  const [suggestion, setSuggestion] = useState("");

  const handleInputChange = async (event) => {
    const code = event.target.value;
    setHtmlContent(code);

    // Call LangChain API for suggestions
    const aiResponse = await getAISuggestions(code);
    setSuggestion(aiResponse);
  };

  // Function to get AI suggestions
  const getAISuggestions = async (code) => {
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that improves HTML code.",
          },
          {
            role: "user",
            content: `Please review this code and suggest improvements:\n\n${code}`,
          },
        ],
      });

      // return response.choices[0].message.content;
      return response.text;
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      return "Could not get suggestions. Please try again.";
    }
  };

  const handleRecordingStop = async (event) => {
    await onRecordingStop(event);
    const response = await fetch("/api/uploadRecording", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recordings,
        htmlContent,
        recordedTime,
        recorderStartTime,
        recorderEndTime,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="code-editor">
      <Head>
        <title>Skilly Code Editor</title>
        <meta
          name="description"
          content="Interactive coding with AI suggestions"
        />
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
        onStop={handleRecordingStop}
        recordedTime={recordedTime}
        progress={progress}
      />
      <main className="code-editor-content" ref={recorderElementRef}>
        <textarea
          className="code-input"
          placeholder="Write your HTML code here"
          onChange={handleInputChange}
        ></textarea>
        <iframe
          style={{ width: "50%", border: "none", height: "50%" }}
          srcDoc={htmlContent}
          title="Output"
        ></iframe>
        <div className="ai-suggestions">
          <h3>AI Suggestions</h3>
          <p>{suggestion}</p>
        </div>
      </main>
    </div>
  );
}
