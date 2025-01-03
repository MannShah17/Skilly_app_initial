/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { FPS } from "../../constants/constants";
import makeThisEventHappen from "../utils/makeThisEventHappen";

export default function usePlayer(
  recordings,
  recorderStartTime,
  recorderEndTime,
  recordedAudio,
  editorRef,
  setCode // Accept setCode to reset the editor content
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const cursorRef = useRef();
  let startTimeStamp = 0;
  let fps = FPS;

  useEffect(() => {
    if (cursorRef.current) {
      if (isPlaying) {
        cursorRef.current.style.display = "block";
      } else {
        cursorRef.current.style.display = "none";
      }
    }
  }, [cursorRef.current, isPlaying]);

  const eventsPlayer = () => {
    if (isPlaying) {
      for (let timeStamp = startTimeStamp; timeStamp <= fps; timeStamp++) {
        if (timeStamp in recordings) {
          console.log("Replaying event at timestamp:", timeStamp);
          makeThisEventHappen(recordings[timeStamp], cursorRef, editorRef);
        }
      }
      startTimeStamp += 16;
      fps += 16;
      setProgress(
        `${(startTimeStamp / (recorderEndTime - recorderStartTime)) * 100}%`
      );
      if (startTimeStamp >= recorderEndTime - recorderStartTime) {
        clearInterval(eventPlayerInterval);
        cursorRef.current.style.display = "none";
        startTimeStamp = 0;
        fps = FPS;
        setIsPlaying(false);
      }
    }
  };

  let eventPlayerInterval = null;

  useEffect(() => {
    if (isPlaying) {
      console.log("Starting playback");
      // Reset the editor content before starting the playback
      setCode("// Write your C code here");
      recordedAudio.play();
      eventPlayerInterval = setInterval(() => {
        eventsPlayer();
      }, 16);
    }

    return () => {
      clearInterval(eventPlayerInterval);
    };
  }, [isPlaying]);

  return {
    isPlaying,
    setIsPlaying,
    cursorRef,
    progress,
  };
}
