/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import convertMsToTime from "../utils/convertMSToTime";
import dispatchRecording from "../utils/dispatchRecording";
import recordAudio from "../utils/recordAudio";

export default function useRecorder() {
  const [recordings, setRecordings] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [recorderStartTime, setRecorderStartTime] = useState(null);
  const [recorderEndTime, setRecorderEndTime] = useState(null);
  const [secondaryStartTime, setSecondaryStartTime] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recorder, setRecorder] = useState(null);

  const recorderElementRef = useRef();
  const effectRan = useRef(false);

  const recordEventHandler = useCallback(
    ({ action, event }) => {
      console.log("Recording event:", { action, event });
      const target = event.target;
      const editorElement = target.closest(".monaco-editor");
      if (editorElement) {
        const editorInstance = editorElement.__monaco_editor_instance;
        if (editorInstance) {
          const selection = editorInstance.getSelection();
          const startPosition = selection.getStartPosition();
          const endPosition = selection.getEndPosition();

          dispatchRecording(
            {
              action,
              target,
              pageX: event.pageX,
              pageY: event.pageY,
              value: editorInstance.getValue(),
              timeStamp: event.timeStamp,
              timeElapsedFromStartTime: Math.floor(
                event.timeStamp - recorderStartTime
              ),
              selectionStartLineNumber: startPosition.lineNumber,
              selectionStartColumn: startPosition.column,
              selectionEndLineNumber: endPosition.lineNumber,
              selectionEndColumn: endPosition.column,
            },
            setRecordings
          );
        }
      }
    },
    [recorderStartTime]
  );

  const clickEventListener = useCallback(
    (event) => recordEventHandler({ action: "click", event }),
    [recordEventHandler]
  );

  const mousemoveEventListener = useCallback(
    (event) => recordEventHandler({ action: "mousemove", event }),
    [recordEventHandler]
  );

  const selectEventListener = useCallback(
    (event) => recordEventHandler({ action: "select", event }),
    [recordEventHandler]
  );

  const keyupEventListener = useCallback(
    (event) => recordEventHandler({ action: "keyup", event }),
    [recordEventHandler]
  );

  const onRecordingStart = useCallback(
    async (event) => {
      console.log("Starting recording");
      if (!recorderStartTime) {
        setRecorderStartTime(event.timeStamp);
      } else {
        setSecondaryStartTime(event.timeStamp);
      }
      setIsRecording(true);
      if (!recorder) {
        const tempRecorder = await recordAudio();
        setRecorder(tempRecorder);
        tempRecorder.start();
      } else {
        recorder.start();
      }
    },
    [recorderStartTime, recorder]
  );

  async function onRecordingStop(event) {
    console.log("Stopping recording");
    if (secondaryStartTime) {
      setRecorderEndTime(
        recorderEndTime + (event.timeStamp - secondaryStartTime)
      );
    } else {
      setRecorderEndTime(event.timeStamp);
    }

    setIsRecording(false);
    const audio = await recorder.stop();
    setRecordedAudio(audio);
    setIsPlayerVisible(true);
  }

  useEffect(() => {
    const element = recorderElementRef.current;
    if (element && !isRecording) {
      element.removeEventListener("click", clickEventListener);
      element.removeEventListener("mousemove", mousemoveEventListener);
      element.removeEventListener("keyup", keyupEventListener);
      element.removeEventListener("select", selectEventListener);
      effectRan.current = false;
      recorderStartTime && setIsPlayerVisible(true);
    }
    if (element && !effectRan.current && isRecording) {
      element.addEventListener("click", clickEventListener);
      element.addEventListener("mousemove", mousemoveEventListener);
      element.addEventListener("keyup", keyupEventListener);
      element.addEventListener("select", selectEventListener);
      effectRan.current = true;
      setIsPlayerVisible(false);
    }
  }, [recorderElementRef.current, isRecording]);

  return {
    recordings,
    recorderElementRef,
    isRecording,
    setIsRecording,
    isPlayerVisible,
    onRecordingStart,
    onRecordingStop,
    recordedTime: convertMsToTime(recorderEndTime - recorderStartTime),
    recorderStartTime,
    recorderEndTime,
    recordedAudio,
  };
}
