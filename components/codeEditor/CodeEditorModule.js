import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import styles from "./CodeEditor.module.css";

export default function CodeEditor({ code, setCode, language, editorRef }) {
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    if (editorRef) {
      editorRef.current = {
        setCursorPosition: (lineNumber, column) => {
          const editor = editorInstanceRef.current;
          if (editor) {
            editor.setPosition({ lineNumber, column });
            editor.focus();
          }
        },
        insertText: (text) => {
          const editor = editorInstanceRef.current;
          if (editor) {
            const position = editor.getPosition();
            editor.executeEdits("", [
              {
                range: new monaco.Range(
                  position.lineNumber,
                  position.column,
                  position.lineNumber,
                  position.column
                ),
                text: text,
                forceMoveMarkers: true,
              },
            ]);
            editor.focus();
          }
        },
        setValue: (value) => {
          const editor = editorInstanceRef.current;
          if (editor) {
            editor.setValue(value);
            editor.focus();
          }
        },
      };
    }
  }, [editorRef]);

  return (
    <div className={styles.editorContainer}>
      <Editor
        height="80vh"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={(value) => setCode(value)}
        onMount={(editor) => {
          editorInstanceRef.current = editor;
          // Set the Monaco Editor instance on the DOM element
          editor.getDomNode().__monaco_editor_instance = editor;
        }}
      />
    </div>
  );
}
