import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import usePlayer from "../lib/hooks/usePlayer";
import Cursor from "../components/cursor/Cursor";
import RecorderFooter from "../components/recorderFooter/RecorderFooter";

export default function EditVideo() {
  const router = useRouter();
  const { id } = router.query;
  const [recordingData, setRecordingData] = useState(null);

  useEffect(() => {
    const fetchRecording = async () => {
      if (id) {
        const response = await fetch(`/api/getRecording?id=${id}`);
        const data = await response.json();
        setRecordingData(data);
      }
    };

    fetchRecording();
  }, [id]);

  const { isPlaying, setIsPlaying, cursorRef, progress } = usePlayer(
    recordingData?.recordings,
    recordingData?.recorderStartTime,
    recordingData?.recorderEndTime,
    recordingData?.recordedAudio
  );

  return (
    <div className="code-editor">
      <Head>
        <title>Edit Video</title>
        <meta name="description" content="Edit recorded video" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Cursor cursorRef={cursorRef} />
      <RecorderFooter
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        progress={progress}
      />
      <main className="code-editor-content">
        <textarea
          className="code-input"
          placeholder="Write your HTML code here"
          value={recordingData?.htmlContent || ""}
          readOnly
        ></textarea>
        <iframe
          style={{ width: "50%", border: "none", height: "50%" }}
          srcDoc={recordingData?.htmlContent || ""}
          title="Output"
        ></iframe>
        <div className="controls">
          <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </main>
    </div>
  );
}
