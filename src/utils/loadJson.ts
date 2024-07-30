import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export async function loadJson(context: vscode.ExtensionContext, fileName: string): Promise<any> {
  const filePath = path.join(context.extensionPath, fileName);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } else {
    throw new Error(`File ${fileName} does not exist`);
  }
}
