import * as vscode from 'vscode';

export class QuickFixProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
  ];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.CodeAction[] {
    return context.diagnostics
      .filter((diag) => diag.source === 'Frontend Quality Copilot')
      .map((diag) => this.createFix(document, diag));
  }

  private createFix(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction {
    const fix = new vscode.CodeAction(`Fix: ${diagnostic.message}`, vscode.CodeActionKind.QuickFix);

    // Sample quick fix: remove inline styles
    if (diagnostic.message.includes('inline style')) {
      const original = document.getText(diagnostic.range);
      const fixedText = original.replace(/style\\s*=\\s*\"[^\"]*\"/, '');
      fix.edit = new vscode.WorkspaceEdit();
      fix.edit.replace(document.uri, diagnostic.range, fixedText);
    }

    fix.diagnostics = [diagnostic];
    fix.isPreferred = true;
    return fix;
  }
}

export function registerQuickFixProvider(): void {
  vscode.languages.registerCodeActionsProvider(
    ['html', 'css', 'javascript', 'typescript'],
    new QuickFixProvider(),
    { providedCodeActionKinds: QuickFixProvider.providedCodeActionKinds }
  );
}