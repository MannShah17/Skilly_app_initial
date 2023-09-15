/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { FPS } from '../../constants/constants';
import makeThisEventHappen from '../utils/makeThisEventHappen';

export default function usePlayer(
  recordings,
  recorderStartTime,
  recorderEndTime,
  recordedAudio
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const cursorRef = useRef();
  let startTimeStamp = 0;
  let fps = FPS;

  useEffect(() => {
    if (cursorRef.current) {
      if (isPlaying) {
        cursorRef.current.style.display = 'block';
      } else {
        cursorRef.current.style.display = 'none';
      }
    }
  }, [cursorRef.current, isPlaying]);

  const eventsPlayer = () => {
    if (isPlaying) {
      for (let timeStamp = startTimeStamp; timeStamp <= fps; timeStamp++) {
        if (timeStamp in recordings) {
          makeThisEventHappen(recordings[timeStamp], cursorRef);
        }
      }
      startTimeStamp += 16;
      fps += 16;
      setProgress(
        `${(startTimeStamp / (recorderEndTime - recorderStartTime)) * 100}%`
      );
      if (startTimeStamp >= recorderEndTime - recorderStartTime) {
        clearInterval(eventPlayerInterval);
        cursorRef.current.style.display = 'none';
        startTimeStamp = 0;
        fps = FPS;
        setIsPlaying(false);
      }
    }
  };

  let eventPlayerInterval = null;

  useEffect(() => {
    if (isPlaying) {
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
