/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import convertMsToTime from '../utils/convertMSToTime';
import dispatchRecording from '../utils/dispatchRecording';
import recordAudio from '../utils/recordAudio';

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
      dispatchRecording(
        {
          action,
          target: event.target,
          pageX: event.pageX,
          pageY: event.pageY,
          value: event.target.value,
          timeStamp: event.timeStamp,
          timeElapsedFromStartTime: Math.floor(
            event.timeStamp - recorderStartTime
          ),
        },
        setRecordings
      );
    },
    [recorderStartTime]
  );

  const clickEventListener = useCallback(
    (event) => recordEventHandler({ action: 'click', event }),
    [recordEventHandler]
  );

  const mousemoveEventListener = useCallback(
    (event) => recordEventHandler({ action: 'mousemove', event }),
    [recordEventHandler]
  );

  // const pointerupEventListener = useCallback(
  //   (event) => recordEventHandler({ action: 'pointerup', event }),
  //   [recordEventHandler]
  // );

  // const pointerdownEventListener = useCallback(
  //   (event) => recordEventHandler({ action: 'pointerdown', event }),
  //   [recordEventHandler]
  // );

  const selectEventListener = useCallback(
    (event) => recordEventHandler({ action: 'select', event }),
    [recordEventHandler]
  );

  const keyupEventListener = useCallback(
    (event) => recordEventHandler({ action: 'keyup', event }),
    [recordEventHandler]
  );

  const onRecordingStart = useCallback(
    async (event) => {
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
  }

  useEffect(() => {
    const element = recorderElementRef.current;
    if (!isRecording) {
      element.removeEventListener('click', clickEventListener);
      element.removeEventListener('mousemove', mousemoveEventListener);
      element.removeEventListener('keyup', keyupEventListener);
      // element.removeEventListener('pointerup', pointerupEventListener);
      element.removeEventListener('select', selectEventListener);
      // element.removeEventListener('pointerdown', pointerdownEventListener);
      effectRan.current === false;
      recorderStartTime && setIsPlayerVisible(true);
    }
    if (
      recorderElementRef.current &&
      effectRan.current === false &&
      isRecording
    ) {
      element.addEventListener('click', clickEventListener);
      element.addEventListener('mousemove', mousemoveEventListener);
      element.addEventListener('keyup', keyupEventListener);
      // element.addEventListener('pointerup', pointerupEventListener);
      element.addEventListener('select', selectEventListener);
      // element.addEventListener('pointerdown', pointerdownEventListener);

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
