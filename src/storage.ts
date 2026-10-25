import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Issue } from "./github.js";

const storagePath = join(process.cwd(), ".issuescout", "saved.json");
export async function listSaved(): Promise<Issue[]> { try { return JSON.parse(await readFile(storagePath, "utf8")) as Issue[]; } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; } }
export async function saveIssue(issue: Issue): Promise<void> { const issues = await listSaved(); if (!issues.some((saved) => saved.url === issue.url)) issues.push(issue); await mkdir(dirname(storagePath), { recursive: true }); await writeFile(storagePath, JSON.stringify(issues, null, 2) + "\n", "utf8"); }
export async function removeSaved(url: string): Promise<boolean> { const issues = await listSaved(); const remaining = issues.filter((issue) => issue.url !== url); if (remaining.length === issues.length) return false; await writeFile(storagePath, JSON.stringify(remaining, null, 2) + "\n", "utf8"); return true; }