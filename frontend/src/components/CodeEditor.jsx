import { useState } from "react";
import Editor from "@monaco-editor/react";

/**
 * Language map: frontend label → Monaco language ID + Judge0 ID
 */
export const LANGUAGES = [
  { id: "cpp",        label: "C++ 17",    monacoLang: "cpp",        judge0Id: 54 },
  { id: "java",       label: "Java 17",   monacoLang: "java",       judge0Id: 62 },
  { id: "python",     label: "Python 3",  monacoLang: "python",     judge0Id: 71 },
  { id: "javascript", label: "JavaScript",monacoLang: "javascript", judge0Id: 63 },
  { id: "c",          label: "C",         monacoLang: "c",          judge0Id: 50 },
];

/**
 * Default starter code templates per language
 */
export const STARTER_CODE = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}`,
  java: `import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        Scanner sc = new Scanner(System.in);
        
        // Your code here
    }
}`,
  python: `import sys
input = sys.stdin.readline

def main():
    # Your code here
    pass

if __name__ == "__main__":
    main()`,
  javascript: `const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const lines = [];
rl.on('line', (line) => lines.push(line.trim()));
rl.on('close', () => {
    // Your code here using lines[]
});`,
  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Your code here
    
    return 0;
}`,
};

/**
 * CodeEditor — Monaco-based editor with Brutalist styling.
 */
function CodeEditor({ code, setCode, language = "cpp", height = "100%" }) {
  const [fontSize, setFontSize] = useState(14);
  const [focused, setFocused] = useState(false);

  const langDef = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div
      style={{
        borderRadius: 0,
        overflow: "hidden",
        border: focused
          ? "2px solid var(--accent)"
          : "2px solid var(--border)",
        background: "#000",
        height: height,
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.1s",
      }}
    >
      {/* ── Editor Toolbar ── */}
      <div
        style={{
          padding: "4px 12px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          alignItems: "center",
          background: "var(--surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: "700" }}>
            FONT_SIZE:
          </span>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{
              background: "#000",
              color: "var(--accent)",
              border: "1px solid var(--border)",
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
              padding: "2px 4px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {[12, 13, 14, 15, 16, 18, 20].map((s) => (
              <option key={s} value={s} style={{ background: "#000" }}>{s}PX</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Monaco Editor ── */}
      <div style={{ flex: 1, position: "relative" }}>
        <Editor
          height="100%"
          language={langDef.monacoLang}
          value={code}
          onChange={(val) => setCode(val || "")}
          theme="vs-dark"
          onMount={(editor) => {
            editor.onDidFocusEditorText(() => setFocused(true));
            editor.onDidBlurEditorText(() => setFocused(false));
          }}
          options={{
            fontSize: fontSize,
            fontFamily: "var(--font-mono)",
            fontLigatures: true,
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: "off",
            renderWhitespace: "selection",
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
            bracketPairColorization: { enabled: true },
            backgroundColor: "#000000",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            }
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
