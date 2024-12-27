export default function makeThisEventHappen(event, cursorRef) {
  cursorRef.current.style.top = `${event.offsetY}px`;
  cursorRef.current.style.left = `${event.offsetX}px`;

  switch (event.type) {
    case "mousemove":
      if (event.cursorStartPosition !== event.cursorEndPosition) {
        document
          .querySelector(event.selector)
          .setSelectionRange(
            event.cursorStartPosition,
            event.cursorEndPosition
          );
      }
      break;
    case "click":
      document.elementFromPoint(event.offsetX, event.offsetY).click();
      if (event.cursorStartPosition !== event.cursorEndPosition) {
        document
          .querySelector(event.selector)
          .setSelectionRange(
            event.cursorStartPosition,
            event.cursorEndPosition
          );
      }
      break;
    case "keyup":
      document.querySelector(event.selector).focus();
      document.querySelector(event.selector).value = event.data;
      if (event.cursorStartPosition === event.cursorEndPosition) {
        document
          .querySelector(event.selector)
          .setSelectionRange(
            event.cursorStartPosition,
            event.cursorEndPosition
          );
      }
      break;
    case "select":
      document.querySelector(event.selector).focus();
      if (event.cursorStartPosition && event.cursorEndPosition) {
        document
          .querySelector(event.selector)
          .setSelectionRange(
            event.cursorStartPosition,
            event.cursorEndPosition
          );
      }
      break;
    default:
      break;
  }
}
