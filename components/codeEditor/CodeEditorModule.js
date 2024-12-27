import React from "react";
import Editor from "@monaco-editor/react";
import styles from "./CodeEditor.module.css";

export default function CodeEditor({ code, setCode }) {
  return (
    <div className={styles.editorContainer}>
      <Editor
        height="80vh"
        defaultLanguage="c"
        defaultValue={code}
        theme="vs-dark"
        onChange={(value) => setCode(value)}
        options={{
          minimap: { enabled: false },
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
