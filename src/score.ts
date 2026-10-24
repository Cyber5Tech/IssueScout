import type { Issue } from "./github.js";
const beginnerLabels = new Set(["good first issue", "help wanted", "first-timers-only"]);
export function scoreIssue(issue: Issue): number {
  const labelScore = issue.labels.some((label) => beginnerLabels.has(label.toLowerCase())) ? 50 : 0;
  const activityScore = Math.max(0, 30 - Math.min(issue.comments, 30));
  const freshnessScore = Math.max(0, 20 - Math.floor((Date.now() - Date.parse(issue.updatedAt)) / 86400000));
  return Math.min(100, labelScore + activityScore + freshnessScore);
}
export function rankIssues(issues: Issue[]): Array<Issue & { score: number }> { return issues.map((issue) => ({ ...issue, score: scoreIssue(issue) })).sort((left, right) => right.score - left.score); }
