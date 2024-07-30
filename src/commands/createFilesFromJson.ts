import * as vscode from 'vscode';
import { loadJson } from '../utils/loadJson';
import * as fs from 'fs';
import * as path from 'path';

const createFileStructure = (files: any[], root: string) => {
  files.forEach(file => {
    const fullPath = path.join(root, file.path);
    const dirPath = path.dirname(fullPath);

    // Log the paths and contents for debugging
    console.log(`Creating directory: ${dirPath}`);
    console.log(`Creating file: ${fullPath}`);
    console.log(`File content: ${file.content}`);
    console.log(`Mimetype: ${file.mimetype}`);

    // Create directories recursively
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create file with specified content
    fs.writeFileSync(fullPath, file.content);
  });
};

export const createFilesFromJsonCommand = async (context: vscode.ExtensionContext, programId: string) => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    const rootPath = path.join(workspaceFolders[0].uri.fsPath, programId);
    const json = await loadJson(context, 'download.json');
    const programFiles = json.files.filter((file: any) => file.program === programId);

    // Log the root path and number of files for debugging
    console.log(`Root path: ${rootPath}`);
    console.log(`Number of files to create: ${programFiles.length}`);

    createFileStructure(programFiles, rootPath);
    vscode.window.showInformationMessage(`Files for program ${programId} have been created.`);
  } else {
    vscode.window.showErrorMessage('Please open a workspace folder first.');
  }
};
