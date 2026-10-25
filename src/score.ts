import type { Issue } from "./github.js";

export type ScoreBreakdown = { beginnerLabel: number; discussion: number; freshness: number; health: number; total: number };
const beginnerLabels = new Set(["good first issue", "help wanted", "first-timers-only"]);

export function scoreBreakdown(issue: Issue): ScoreBreakdown {
  const beginnerLabel = issue.labels.some((label) => beginnerLabels.has(label.toLowerCase())) ? 50 : 0;
  const discussion = Math.max(0, 30 - Math.min(issue.comments, 30));
  const freshness = Math.max(0, 20 - Math.floor((Date.now() - Date.parse(issue.updatedAt)) / 86400000));
  const health = issue.health ? Math.min(10, Math.floor(Math.log10(issue.health.stars + 1) * 2) + Math.min(4, issue.health.forks)) : 0;
  return { beginnerLabel, discussion, freshness, health, total: Math.min(100, beginnerLabel + discussion + freshness + health) };
}

export function scoreIssue(issue: Issue): number { return scoreBreakdown(issue).total; }
export function rankIssues(issues: Issue[]): Array<Issue & { score: number; breakdown: ScoreBreakdown }> {
  return issues.map((issue) => ({ ...issue, score: scoreIssue(issue), breakdown: scoreBreakdown(issue) })).sort((left, right) => right.score - left.score);
}