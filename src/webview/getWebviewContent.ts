export const generateProgramSelection = (programs: any[], existingPrograms: any[]): string => {
    let programSelectionHtml = '';
    programs.forEach(program => {
      const exists = existingPrograms.includes(program.id);
      programSelectionHtml += `
        <div class="program-box">
          <h2>${program.name}</h2>
          <p>ID: ${program.id}</p>
          <button onclick="downloadProgram('${program.id}')">Download</button>
          ${exists ? `<button onclick="uploadProgram('${program.id}')">Upload</button>` : ''}
        </div>`;
    });
    return programSelectionHtml;
  };
  
  export const getWebviewContent = (programs: any, existingPrograms: any) => {
    const programListHtml = generateProgramSelection(programs.programs, existingPrograms);
  
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Programs</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .program-box {
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 20px;
                margin-bottom: 20px;
            }
            .program-box h2 {
                margin-top: 0;
            }
            .program-box button {
                background-color: #007acc;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 10px 20px;
                cursor: pointer;
                margin-right: 10px;
            }
            .program-box button:hover {
                background-color: #005a9e;
            }
            .upload-button {
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 10px 20px;
                cursor: pointer;
                margin-top: 20px;
            }
            .upload-button:hover {
                background-color: #218838;
            }
        </style>
    </head>
    <body>
        <h1>Programs List</h1>
        <div id="program-list">
            ${programListHtml}
        </div>
        <script>
            const vscode = acquireVsCodeApi();
  
            function downloadProgram(programId) {
                vscode.postMessage({ command: 'download', id: programId });
            }
  
            function uploadProgram(programId) {
                vscode.postMessage({ command: 'upload', id: programId });
            }
  
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.command) {
                    case 'refresh':
                        location.reload();
                        break;
                }
            });
        </script>
    </body>
    </html>`;
  };
  