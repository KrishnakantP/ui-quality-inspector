import { Issue } from "../ruleEngine/ruleRunner";

export function generateCopilotPrompt(fileType: string, issues: Issue[], fileContent: string): string {
  const lines = fileContent.split(/\r?\n/);
  const filtered = issues.map(issue => {
    return {
      line: issue.line + 1,
      code: lines[issue.line],
      rule: issue.message
    };
  });

  const issueList = filtered.map(i => `- Line ${i.line}: ${i.rule}`).join('\n');
  const codeList = filtered.map(i => `// Line ${i.line}\n${i.code}`).join('\n\n');

  return `You are a frontend code quality assistant.\n\nFile Type: ${fileType}\n\nViolations Detected:\n${issueList}\n\nCode:\n${codeList}\n\nYour task:\n- Explain each issue\n- Suggest a fix for each line\n- Return JSON array with line, problem, and fix.`;
}
