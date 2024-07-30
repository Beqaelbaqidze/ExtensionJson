import * as vscode from 'vscode';
import { createFilesFromJsonCommand } from './commands/createFilesFromJson';
import { uploadFilesFromJsonCommand } from './commands/uploadFilesFromJson';
import { MainPanel } from './webview/mainPanel';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.createFilesFromJson', (programId: string) => {
      createFilesFromJsonCommand(context, programId);
    }),
    vscode.commands.registerCommand('extension.uploadFilesFromJson', (programId: string) => {
      uploadFilesFromJsonCommand(context, programId);
    })
  );

  MainPanel.createOrShow(context.extensionUri, context);
}

export function deactivate() {}
