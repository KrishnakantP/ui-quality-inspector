import * as vscode from 'vscode';
import { Issue } from './ruleEngine/ruleRunner';

let statusBarItem: vscode.StatusBarItem;

export function initStatusBar(): vscode.StatusBarItem {
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.tooltip = 'Frontend Quality Copilot';
  statusBarItem.command = 'frontend-quality.showDashboard';
  statusBarItem.show();
  return statusBarItem;
}

export function updateStatusBar(issues: Issue[]): void {
  const errors = issues.filter(i => i.severity === vscode.DiagnosticSeverity.Error).length;
  const warnings = issues.filter(i => i.severity === vscode.DiagnosticSeverity.Warning).length;
  const infos = issues.filter(i => i.severity === vscode.DiagnosticSeverity.Information).length;

  statusBarItem.text = `Sonar Quality Checks: ${errors} Errors / ${warnings} Warnings / ${infos} Info`;
}
