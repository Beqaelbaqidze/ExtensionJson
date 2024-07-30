import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export async function saveJson(context: vscode.ExtensionContext, fileName: string, content: any): Promise<void> {
  const filePath = path.join(context.extensionPath, fileName);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
}
