#!/usr/bin/env node
import { Command } from "commander";
import { searchIssues } from "./github.js";
import { rankIssues } from "./score.js";
const program = new Command();
program.name("issuescout").description("Find open-source issues worth contributing to").version("0.1.0");
program.command("search").description("Search GitHub for beginner-friendly issues").option("-l, --language <language>", "filter by programming language").option("-t, --topic <topic>", "search topic or keyword").option("-n, --limit <number>", "number of results", "10").action(async (options: { language?: string; topic?: string; limit: string }) => {
  const terms = ["is:issue", "is:open", "(label:\"good first issue\" OR label:\"help wanted\")"];
  if (options.language) terms.push(`language:${options.language}`); if (options.topic) terms.push(options.topic);
  try { const issues = rankIssues(await searchIssues(terms.join(" "), Number(options.limit))); if (!issues.length) return console.log("No matching issues found."); for (const [index, issue] of issues.entries()) { console.log(`${index + 1}. [${issue.score}/100] ${issue.title}`); console.log(`   ${issue.repository} | ${issue.labels.join(", ") || "unlabelled"}`); console.log(`   ${issue.url}\n`); } } catch (error) { console.error(error instanceof Error ? error.message : "Something went wrong."); process.exitCode = 1; }
});
await program.parseAsync();
