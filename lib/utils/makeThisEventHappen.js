export default function makeThisEventHappen(event, cursorRef, editorRef) {
  cursorRef.current.style.top = `${event.offsetY}px`;
  cursorRef.current.style.left = `${event.offsetX}px`;

  if (!editorRef.current) {
    console.error("Editor instance is not available");
    return;
  }

  console.log("Dispatching event:", event);

  switch (event.type) {
    case "mousemove":
      console.log("Mousemove event:", event);
      if (event.cursorStartPosition && event.cursorEndPosition) {
        editorRef.current.setCursorPosition(
          event.cursorStartPosition.lineNumber,
          event.cursorStartPosition.column
        );
      }
      break;
    case "click":
      console.log("Click event:", event);
      document.elementFromPoint(event.offsetX, event.offsetY).click();
      if (event.cursorStartPosition && event.cursorEndPosition) {
        editorRef.current.setCursorPosition(
          event.cursorStartPosition.lineNumber,
          event.cursorStartPosition.column
        );
      }
      break;
    case "keyup":
      console.log("Keyup event:", event);
      if (event.cursorStartPosition && event.cursorEndPosition) {
        editorRef.current.setCursorPosition(
          event.cursorStartPosition.lineNumber,
          event.cursorStartPosition.column
        );
      }
      editorRef.current.insertText(event.data);
      break;
    case "select":
      console.log("Select event:", event);
      if (event.cursorStartPosition && event.cursorEndPosition) {
        editorRef.current.setCursorPosition(
          event.cursorStartPosition.lineNumber,
          event.cursorStartPosition.column
        );
      }
      break;
    default:
      break;
  }
}
