import React, { useState } from 'react';
import './App.css';

import MonacoEditor from 'react-monaco-editor';

import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";



function App() {
  const [code, setCode] = useState([
    'func main() -> () {',
    '  int x = 10;',
    '  int y = 20;',
    '  int z = x + y;',
    '  if(x <= 6) {',
    '    print("x is less than or equal to 6");',
    '  } else {',
    '    print("x is greater than 6");',
    '  }',
    '  println("Hello, world!")',
    '}'
  ].join('\n'));
  const options = {
    selectOnLineNumbers: false,
    automaticLayout: true,
    contextMenu: false,
    cursorBlinking: "smooth",
    wordWrap: "on",
    wrappingIndent: "same",
    scrollBeyondLastLine: false,
    fontFamily: "'Fira Code', monospace",
    fontFeatureSettings: "",
    minimap: {
      enabled: false
    }
  };
  const showEditor = () => {
    console.log(code);
  }

  const editorDidMount = (editor, monaco) => {
    // console.log('editorDidMount', editor);
    // console.log('monacoDidMount', monaco);
    // console.log('lenguajes: ', monaco.languages.getLanguages());
    editor.focus();
  }

  const editorWillMount = (monaco) => {
    console.log('editorWillMount', monaco);
    monaco.languages.register({ id: 'dummycode' });
    monaco.languages.setMonarchTokensProvider('dummycode', {
      defaultToken: 'invalid',
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
      tokenizer: {
        root: [

          {include: '@whitespace'},

          [/\[error.*/, 'custom-error'],
          [/\[notice.*/, 'custom-notice'],
          [/\[info.*/, 'custom-info'],
          [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
          [/=>/, 'arrow'],

          [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
          [/"/, 'string', '@string'],
        ],
        whitespace: [
          [/[ \t\r\n]+/, 'white'],
          [/\/\*/, 'comment', '@comment'],
          [/\/\+/, 'comment', '@comment'],
          [/\/\/.*$/, 'comment'],
        ],
        comment: [
          [/[^\/*]+/, 'comment'],
          [/\/\+/, 'comment', '@push'],
          [/\/\*/, 'comment.invalid'],
          ["\\*/", 'comment', '@pop'],
          ["\\+/", 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ],
        string: [
          [/[^\\"]+/, 'string'],
          [/@escapes/, 'string.escape'],
          [/\\./, 'string.escape.invalid'],
          [/"/, 'string', '@pop']
        ],

      }
    });
    monaco.editor.defineTheme('dummy-Theme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'custom-info', foreground: '808080' },
        { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
        { token: 'custom-notice', foreground: 'FFA500' },
        { token: 'custom-date', foreground: '008800' },
        { token: 'arrow', foreground: '0000ff' },
        { token: 'string', foreground: 'ce9a24' },
        { token: 'string.invalid', foreground: '9e7823' },
      ],
      colors: {
        'editor.foreground': '#394555'
      }
    });
    monaco.languages.registerCompletionItemProvider('dummycode', {
      provideCompletionItems: () => {
        var suggestions = [
          {
            label: 'simpleText',
            kind: monaco.languages.CompletionItemKind.Text,
            insertText: 'simpleText'
          },
          {
            label: 'testing',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'testing(${1:condition})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'ifelse',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If-Else Statement'
          }
        ];
        return { suggestions: suggestions };
      }
    });
    console.log('lenguajes: ', monaco.languages.getLanguages());
  }

  const handleEditorValidation = (markers) => {
    console.log('handleEditorValidation', markers);
    markers.forEach(marker => console.log('onValidate:', marker.message));

  }

  return (
    <div className="App fira" fontFamily="'Fira Code', 'Fira Mono', monospace">
      <div onClick={showEditor}>&lt;- Dummy Code -&gt;</div>
      {/* <MonacoEditor
        width="800"
        height="600"
        language="python"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={e => setCode(e)}
        editorDidMount={editorDidMount}
      /> */}

      <Editor
        width="100%"
        height="500px"
        theme="vs-dark"
        defaultLanguage="swift"
        options={options}
        defaultValue={code}
        onMount={editorDidMount}
        beforeMount={editorWillMount}
        onValidate={handleEditorValidation}
        readOnly="true"
      />
    </div>
  );
}

export default App;
