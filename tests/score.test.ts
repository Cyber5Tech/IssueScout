import { describe, expect, it } from "vitest";
import { rankIssues, scoreBreakdown } from "../src/score.js";
import type { Issue } from "../src/github.js";

const issue = (overrides: Partial<Issue> = {}): Issue => ({ title: "Issue", url: "https://github.com/example/repo/issues/1", repository: "example/repo", labels: ["good first issue"], comments: 1, updatedAt: new Date().toISOString(), ...overrides });

describe("scoreIssue", () => {
  it("puts clearly beginner-friendly issues first", () => { const ranked = rankIssues([issue({ title: "Complex", labels: ["bug"], comments: 20 }), issue({ title: "Easy" })]); expect(ranked[0].title).toBe("Easy"); });
  it("explains score signals and includes repository health", () => { const breakdown = scoreBreakdown(issue({ health: { stars: 1000, forks: 5, openIssues: 10, pushedAt: new Date().toISOString() } })); expect(breakdown.beginnerLabel).toBe(50); expect(breakdown.health).toBeGreaterThan(0); expect(breakdown.total).toBe(scoreBreakdown(issue({ health: { stars: 1000, forks: 5, openIssues: 10, pushedAt: new Date().toISOString() } })).total); });
  it("does not let comment volume go below zero", () => { expect(scoreBreakdown(issue({ comments: 100 })).discussion).toBe(0); });
});