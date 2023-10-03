import React, { useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [output, setOutput] = useState<string | null>(null);

  const handleRunCode = () => {
    try {
      // Use eval to execute the code
      const result = eval(code);
      console.log({ result });
      setOutput(result.toString());
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  return (
    <div>
      <div>
        <label>Select a programming language:</label>
        <select onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          {/* Add more language options here */}
        </select>
      </div>
      <Editor
        height="500px"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(val) => {
          if (val) {
            setCode(val);
          }
        }}
      />
      <button onClick={handleRunCode}>Run Code</button>
      {output && (
        <div>
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
