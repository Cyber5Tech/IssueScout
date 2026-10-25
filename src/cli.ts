#!/usr/bin/env node
import { Command } from "commander";
import { getIssue, searchIssues } from "./github.js";
import { rankIssues } from "./score.js";
import { listSaved, removeSaved, saveIssue } from "./storage.js";

const program = new Command();
const positiveInteger = (value: string): number => { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) throw new Error("Limit must be an integer from 1 to 100."); return parsed; };
program.name("issuescout").description("Find open-source issues worth contributing to").version("0.2.0");

program.command("search").description("Search GitHub for beginner-friendly issues").option("-l, --language <language>", "filter by programming language").option("-t, --topic <topic>", "search topic or keyword").option("-n, --limit <number>", "number of results", "10").option("--json", "print machine-readable JSON").option("--health", "include repository health signals").action(async (options: { language?: string; topic?: string; limit: string; json?: boolean; health?: boolean }) => {
  try { const limit = positiveInteger(options.limit); const terms = ["is:issue", "is:open", "(label:\"good first issue\" OR label:\"help wanted\")"]; if (options.language?.trim()) terms.push(`language:${options.language.trim()}`); if (options.topic?.trim()) terms.push(options.topic.trim()); const issues = rankIssues(await searchIssues(terms.join(" "), limit, { includeHealth: options.health })); if (options.json) return console.log(JSON.stringify(issues, null, 2)); if (!issues.length) return console.log("No matching issues found."); for (const [index, issue] of issues.entries()) { console.log(`${index + 1}. [${issue.score}/100] ${issue.title}`); console.log(`   ${issue.repository} | ${issue.labels.join(", ") || "unlabelled"}`); console.log(`   ${issue.breakdown.beginnerLabel ? "+50 beginner-friendly label" : "+0 beginner-friendly label"} | +${issue.breakdown.freshness} freshness | +${issue.breakdown.discussion} low discussion`); if (issue.health) console.log(`   ${issue.health.stars} stars | ${issue.health.forks} forks | ${issue.health.openIssues} open issues`); console.log(`   ${issue.url}\n`); } } catch (error) { console.error(error instanceof Error ? error.message : "Something went wrong."); process.exitCode = 1; }
});

program.command("save <url>").description("Save an issue for later").action(async (url: string) => { try { const issue = await getIssue(url); await saveIssue(issue); console.log(`Saved: ${issue.title}`); } catch (error) { console.error(error instanceof Error ? error.message : "Something went wrong."); process.exitCode = 1; } });
program.command("saved").description("List saved issues").option("--json", "print machine-readable JSON").action(async (options: { json?: boolean }) => { const issues = await listSaved(); if (options.json) return console.log(JSON.stringify(issues, null, 2)); if (!issues.length) return console.log("No saved issues."); issues.forEach((issue, index) => console.log(`${index + 1}. ${issue.title}\n   ${issue.repository}\n   ${issue.url}\n`)); });
program.command("remove <url>").description("Remove an issue from saved issues").action(async (url: string) => { if (await removeSaved(url)) console.log("Removed saved issue."); else { console.error("Issue is not saved."); process.exitCode = 1; } });
await program.parseAsync();