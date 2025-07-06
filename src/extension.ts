import * as vscode from 'vscode';
import { registerQuickFixProvider } from './quickFix/quickFixProvider';
import { clearDiagnostics, updateDiagnostics } from './diagnostic';
import { runRulesOnDocument } from './ruleEngine/ruleRunner';
import { getWebviewContent } from './dashboard/webview';
import { initStatusBar, updateStatusBar } from './statusBar';

export function activate(context: vscode.ExtensionContext) {
  const statusBar = initStatusBar();
  registerQuickFixProvider();

  // Trigger when document is opened, saved, or closed
  vscode.workspace.onDidOpenTextDocument(handleDocument, null, context.subscriptions);
  vscode.workspace.onDidSaveTextDocument(handleDocument, null, context.subscriptions);
  vscode.workspace.onDidCloseTextDocument(clearDiagnostics, null, context.subscriptions);

  // ✅ NEW: Trigger when user types
  vscode.workspace.onDidChangeTextDocument((e) => {
    handleDocument(e.document);
  }, null, context.subscriptions);

  // ✅ NEW: Trigger when user switches files
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      handleDocument(editor.document);
    }
  }, null, context.subscriptions);

  // Analyze active file at startup
  if (vscode.window.activeTextEditor) {
    handleDocument(vscode.window.activeTextEditor.document);
  }

  context.subscriptions.push(statusBar);

  // Register WebView Dashboard command
  context.subscriptions.push(
    vscode.commands.registerCommand('frontend-quality.showDashboard', () => {
      const panel = vscode.window.createWebviewPanel(
        'frontendQualityDashboard',
        'Frontend Quality Copilot',
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      const document = vscode.window.activeTextEditor?.document;
      if (!document) return;

      const issues = runRulesOnDocument(document);
      panel.webview.html = getWebviewContent(issues);
    })
  );
}

function handleDocument(document: vscode.TextDocument) {
  if (document.languageId === 'plaintext') return;
  const issues = runRulesOnDocument(document);
  updateDiagnostics(document, issues);
  updateStatusBar(issues);
}

export function deactivate() {}