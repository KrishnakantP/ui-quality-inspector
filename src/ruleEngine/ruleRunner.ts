import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface Rule {
  id: string;
  pattern: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  type: 'bug' | 'code_smell' | 'vulnerability' | string;
  description: string;
}

export interface Issue {
  line: number;
  start: number;
  end: number;
  ruleId: string;
  message: string;
  severity: vscode.DiagnosticSeverity;
}

export function loadRules(fileType: string): Rule[] {
  const configPath = path.join(__dirname, '../rules', `${fileType}.json`);
  if (!fs.existsSync(configPath)) return [];
  const content = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(content);
}

export function runRulesOnDocument(document: vscode.TextDocument): Issue[] {
  const fileType = document.languageId;
  const rules = loadRules(fileType);
  const issues: Issue[] = [];

  for (let i = 0; i < document.lineCount; i++) {
    const lineText = document.lineAt(i).text;

    for (const rule of rules) {
      let regex: RegExp;
      try {
        regex = new RegExp(rule.pattern, 'g');
      } catch (e) {
        console.warn(`Invalid regex in rule ${rule.id}: ${rule.pattern}`);
        continue;
      }

      let match: RegExpExecArray | null;
      while ((match = regex.exec(lineText)) !== null) {
        if (match[0].length === 0) {
          regex.lastIndex++;
          continue;
        }

        issues.push({
          line: i,
          start: match.index,
          end: match.index + match[0].length,
          ruleId: rule.id,
          message: rule.message || rule.description,
          severity: mapSeverity(rule.severity, rule.type),
        });
      }
    }
  }

  return issues;
}

// 🔁 Extracted function to map string to VS Code DiagnosticSeverity
function mapSeverity(severity: string, type: string): vscode.DiagnosticSeverity {
  const s = severity.toLowerCase();
  const t = type.toLowerCase();
  if (s === 'error' || t === 'bug' || t === 'vulnerability') return vscode.DiagnosticSeverity.Error;
  if (s === 'warning' || t === 'code_smell') return vscode.DiagnosticSeverity.Warning;
  if (s === 'info') return vscode.DiagnosticSeverity.Information;
  return vscode.DiagnosticSeverity.Information;
}
