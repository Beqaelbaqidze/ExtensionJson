import * as vscode from 'vscode';
import { getWebviewContent } from './getWebviewContent';
import { loadJson } from '../utils/loadJson';

export class MainPanel {
  public static currentPanel: MainPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private readonly _context: vscode.ExtensionContext;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, context: vscode.ExtensionContext, programs: any, existingPrograms: any) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._context = context;

    this._update(programs, existingPrograms);

    this._panel.onDidDispose(() => this.dispose(), null);

    this._panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'download':
            await vscode.commands.executeCommand('extension.createFilesFromJson', message.id);
            this.refresh();
            return;
          case 'upload':
            await vscode.commands.executeCommand('extension.uploadFilesFromJson', message.id);
            this.refresh();
            return;
        }
      },
      null
    );
  }

  private static async getExistingPrograms(baseDir: string): Promise<any[]> {
    const existingPrograms = [];
    const items = await vscode.workspace.fs.readDirectory(vscode.Uri.file(baseDir));
    for (const [name, type] of items) {
      if (type === vscode.FileType.Directory) {
        existingPrograms.push(name);
      }
    }
    return existingPrograms;
  }

  public static async createOrShow(extensionUri: vscode.Uri, context: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    if (MainPanel.currentPanel) {
      MainPanel.currentPanel._panel.reveal(column);
    } else {
      const panel = vscode.window.createWebviewPanel(
        'programsView',
        'Programs View',
        column || vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      const programs = await loadJson(context, 'programs.json');
      const workspaceFolders = vscode.workspace.workspaceFolders;
      let existingPrograms = [];

      if (workspaceFolders && workspaceFolders.length > 0) {
        existingPrograms = await MainPanel.getExistingPrograms(workspaceFolders[0].uri.fsPath);
      }

      MainPanel.currentPanel = new MainPanel(panel, extensionUri, context, programs, existingPrograms);
    }
  }

  public dispose() {
    MainPanel.currentPanel = undefined;

    this._panel.dispose();
  }

  private _update(programs: any, existingPrograms: any) {
    this._panel.webview.html = getWebviewContent(programs, existingPrograms);
  }

  private async refresh() {
    const programs = await loadJson(this._context, 'programs.json');
    const workspaceFolders = vscode.workspace.workspaceFolders;
    let existingPrograms = [];

    if (workspaceFolders && workspaceFolders.length > 0) {
      existingPrograms = await MainPanel.getExistingPrograms(workspaceFolders[0].uri.fsPath);
    }

    this._update(programs, existingPrograms);
  }
}
