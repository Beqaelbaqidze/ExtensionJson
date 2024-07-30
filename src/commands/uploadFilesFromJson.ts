import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { saveJson } from '../utils/saveJson';
import { loadJson } from '../utils/loadJson';

const getFilesRecursively = (dir: string, baseDir: string, programId: string, ignorePatterns: string[]): any[] => {
  const results: any[] = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    file = path.resolve(dir, file);
    const relativePath = path.relative(baseDir, file);
    if (ignorePatterns.some(pattern => relativePath.includes(pattern))) {
      return;
    }

    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results.push(...getFilesRecursively(file, baseDir, programId, ignorePatterns));
    } else {
      results.push({
        program: programId,
        path: relativePath.replace(/\\/g, '/'),
        mimetype: mimeType(file),
        content: fs.readFileSync(file, 'utf8')
      });
    }
  });

  return results;
};

const mimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.js':
      return 'application/javascript';
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.json':
      return 'application/json';
    case '.xml':
      return 'application/xml';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.pdf':
      return 'application/pdf';
    case '.txt':
      return 'text/plain';
    case '.md':
      return 'text/markdown';
    case '.py':
      return 'text/x-python';
    case '.rb':
      return 'application/x-ruby';
    case '.java':
      return 'text/x-java-source';
    case '.c':
    case '.h':
      return 'text/x-c';
    case '.cpp':
    case '.hpp':
      return 'text/x-c++src';
    case '.ts':
      return 'application/typescript';
    case '.tsx':
      return 'text/tsx';
    case '.cs':
      return 'text/x-csharp';
    case '.php':
      return 'application/x-httpd-php';
    case '.sh':
      return 'application/x-sh';
    case '.bat':
      return 'application/x-bat';
    case '.sql':
      return 'application/sql';
    default:
      return 'application/octet-stream';
  }
};

const loadIgnorePatterns = (baseDir: string): string[] => {
  const ignoreFile = path.join(baseDir, '.uploadignore');
  if (fs.existsSync(ignoreFile)) {
    return fs.readFileSync(ignoreFile, 'utf8').split('\n').map(pattern => pattern.trim()).filter(pattern => pattern.length > 0);
  }
  return [];
};

export const uploadFilesFromJsonCommand = async (context: vscode.ExtensionContext, programId: string) => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    const baseDir = path.join(workspaceFolders[0].uri.fsPath, programId);
    const ignorePatterns = loadIgnorePatterns(baseDir);
    const programFiles = getFilesRecursively(baseDir, baseDir, programId, ignorePatterns);
    const existingJson = await loadJson(context, 'download.json');

    programFiles.forEach(file => {
      const existingFileIndex = existingJson.files.findIndex((f: any) => f.path === file.path && f.program === file.program);
      if (existingFileIndex !== -1) {
        // Update existing file
        existingJson.files[existingFileIndex] = file;
      } else {
        // Add new file
        existingJson.files.push(file);
      }
    });

    await saveJson(context, 'download.json', existingJson);
    vscode.window.showInformationMessage(`Files for program ${programId} have been uploaded.`);
  } else {
    vscode.window.showErrorMessage('Please open a workspace folder first.');
  }
};
