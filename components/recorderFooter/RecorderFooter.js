import React, { useState } from "react";
import styles from "./RecorderFooter.module.css";

export default function RecorderFooter({
  onStart = console.log,
  onStop = console.log,
  onRecordingPlay = console.log,
  onRecordingPause = console.log,
  setIsPlaying,
  isRecording,
  isPlaying,
  progress,
  isPlayerVisible,
  recordedTime,
  onUpload = console.log, // New prop for upload functionality
}) {
  const toggleRecordingHandler = (event) => {
    isRecording ? onStop(event) : onStart(event);
  };

  const toggleRecordingPlaying = () => {
    isPlaying ? onRecordingPause() : onRecordingPlay();
    setIsPlaying((prevPlayingState) => !prevPlayingState);
  };

  return (
    <div className={styles.footerContainer}>
      <div
        className={`${styles.recorder} ${isRecording && styles.stopRecorder}`}
        onClick={(event) => toggleRecordingHandler(event)}
      ></div>
      {isRecording ? null : (
        <div className={styles.timeDisplay}>{recordedTime}</div>
      )}
      {isPlayerVisible && (
        <>
          <div
            className={`${styles.button} ${isPlaying && styles.paused}`}
            onClick={toggleRecordingPlaying}
          ></div>
          <div className={styles.progressBackdrop}>
            <div
              className={styles.progressBar}
              style={{ width: progress }}
            ></div>
          </div>
          <button onClick={onUpload} className={styles.uploadButton}>
            Upload
          </button>
        </>
      )}
    </div>
  );
}
