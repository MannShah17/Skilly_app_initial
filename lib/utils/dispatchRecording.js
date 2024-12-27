import { defaultEventRecorderTemplate } from "../../constants/constants";
import getElementSelector from "./getElementSelector";

export default function dispatchRecording(recordingObject, setRecordings) {
  const currentEventRecorderData = { ...defaultEventRecorderTemplate };
  currentEventRecorderData.type = recordingObject.action;
  currentEventRecorderData.selector = getElementSelector(
    recordingObject.target
  );
  currentEventRecorderData.offsetX = recordingObject.pageX;
  currentEventRecorderData.offsetY = recordingObject.pageY;
  currentEventRecorderData.data = recordingObject.value;
  currentEventRecorderData.timeStamp = recordingObject.timeStamp;
  currentEventRecorderData.cursorStartPosition =
    recordingObject.target.selectionStart;
  currentEventRecorderData.cursorEndPosition =
    recordingObject.target.selectionEnd;

  setRecordings((prevRecordings) => {
    const newRecordings = { ...prevRecordings };
    newRecordings[recordingObject.timeElapsedFromStartTime] =
      currentEventRecorderData;
    return newRecordings;
  });
}
