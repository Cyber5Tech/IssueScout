export type Issue = { title: string; url: string; repository: string; labels: string[]; comments: number; updatedAt: string };
type GitHubSearchResponse = { items: Array<{ title: string; html_url: string; repository_url: string; labels: Array<{ name?: string }>; comments: number; updated_at: string }> };
export async function searchIssues(query: string, limit = 10): Promise<Issue[]> {
  const response = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=${limit}`, { headers: { Accept: "application/vnd.github+json", "User-Agent": "issuescout" } });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}: ${response.statusText}`);
  const data = (await response.json()) as GitHubSearchResponse;
  return data.items.map((item) => ({ title: item.title, url: item.html_url, repository: item.repository_url.replace("https://api.github.com/repos/", ""), labels: item.labels.flatMap((label) => label.name ? [label.name] : []), comments: item.comments, updatedAt: item.updated_at }));
}
