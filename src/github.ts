export type RepositoryHealth = {
  stars: number;
  forks: number;
  openIssues: number;
  pushedAt: string | null;
};

export type Issue = {
  title: string;
  url: string;
  repository: string;
  labels: string[];
  comments: number;
  updatedAt: string;
  health?: RepositoryHealth;
};

type GitHubIssue = { title: string; html_url: string; repository_url: string; labels: Array<{ name?: string }>; comments: number; updated_at: string };
type GitHubSearchResponse = { items: GitHubIssue[] };
type GitHubIssueResponse = GitHubIssue;
type GitHubRepository = { stargazers_count: number; forks_count: number; open_issues_count: number; pushed_at: string | null };

type GitHubOptions = { token?: string; includeHealth?: boolean };

function headers(token?: string): HeadersInit {
  return { Accept: "application/vnd.github+json", "User-Agent": "issuescout", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function request<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(url, { headers: headers(token) });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}: ${response.statusText}`);
  return (await response.json()) as T;
}

function toIssue(item: GitHubIssue): Issue {
  return { title: item.title, url: item.html_url, repository: item.repository_url.replace("https://api.github.com/repos/", ""), labels: item.labels.flatMap((label) => label.name ? [label.name] : []), comments: item.comments, updatedAt: item.updated_at };
}

export async function searchIssues(query: string, limit = 10, options: GitHubOptions = {}): Promise<Issue[]> {
  const token = options.token ?? process.env.GITHUB_TOKEN;
  const data = await request<GitHubSearchResponse>(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=${limit}`, token);
  const issues = data.items.map(toIssue);
  if (!options.includeHealth) return issues;
  return Promise.all(issues.map(async (issue) => ({ ...issue, health: await repositoryHealth(issue.repository, token) })));
}

export async function getIssue(url: string, options: GitHubOptions = {}): Promise<Issue> {
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)(?:$|[?#])/.exec(url);
  if (!match) throw new Error("Issue URL must look like https://github.com/owner/repository/issues/123");
  const token = options.token ?? process.env.GITHUB_TOKEN;
  return toIssue(await request<GitHubIssue>(`https://api.github.com/repos/${match[1]}/${match[2]}/issues/${match[3]}`, token));
}

export async function repositoryHealth(repository: string, token = process.env.GITHUB_TOKEN): Promise<RepositoryHealth> {
  const data = await request<GitHubRepository>(`https://api.github.com/repos/${repository}`, token);
  return { stars: data.stargazers_count, forks: data.forks_count, openIssues: data.open_issues_count, pushedAt: data.pushed_at };
}