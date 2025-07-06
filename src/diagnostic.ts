import * as vscode from 'vscode';
import { Issue } from './ruleEngine/ruleRunner';


const diagnosticCollection = vscode.languages.createDiagnosticCollection('frontend-quality');

export function updateDiagnostics(document: vscode.TextDocument, issues: Issue[]): void {
  const diagnostics: vscode.Diagnostic[] = issues.map(issue => {
    const range = new vscode.Range(
      new vscode.Position(issue.line, issue.start),
      new vscode.Position(issue.line, issue.end)
    );
    const diagnostic = new vscode.Diagnostic(range, issue.message, issue.severity);
    diagnostic.code = issue.ruleId;
    diagnostic.source = 'Frontend Quality Copilot';
    return diagnostic;
  });
  diagnosticCollection.set(document.uri, diagnostics);
}

export function clearDiagnostics(document: vscode.TextDocument): void {
  diagnosticCollection.set(document.uri, []);
}
