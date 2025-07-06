import * as vscode from 'vscode';
import { Issue } from '../ruleEngine/ruleRunner';


export function getWebviewContent(issues: Issue[]): string {
  const rows = issues
    .map(i => `
      <tr>
        <td>${i.line + 1}</td>
        <td>${i.ruleId}</td>
        <td>${i.message}</td>
        <td>${vscode.DiagnosticSeverity[i.severity]}</td>
      </tr>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
      </style>
    </head>
    <body>
      <h2>Frontend Quality Report</h2>
      <table>
        <tr>
          <th>Line</th>
          <th>Rule</th>
          <th>Message</th>
          <th>Severity</th>
        </tr>
        ${rows}
      </table>
    </body>
    </html>
  `;
}
