# IssueScout

[![CI](https://github.com/Cyber5Tech/IssueScout/actions/workflows/ci.yml/badge.svg)](https://github.com/Cyber5Tech/IssueScout/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

IssueScout is an open-source command-line tool for discovering beginner-friendly GitHub issues and organizing the opportunities you want to pursue. It searches GitHub’s public issue index, filters for issues that welcome contributors, and ranks results so you can spend less time searching and more time contributing.

## Why IssueScout?

Finding a suitable first contribution can be difficult. A repository may have thousands of issues, incomplete labels, or tasks that are no longer active. IssueScout gives contributors a fast starting point by focusing on open issues commonly marked for newcomers.

## Features

- Searches open GitHub issues labeled `good first issue` or `help wanted`.
- Filters results by programming language.
- Searches by topic, keyword, or technology.
- Ranks results on a 0–100 score.
- Displays issue titles, repositories, labels, and direct links.
- Supports JSON output for scripts and integrations.
- Optionally includes repository health signals such as stars, forks, and open issues.
- Saves interesting issues locally for later review.
- Supports authenticated GitHub requests through `GITHUB_TOKEN`.
- Runs locally as a lightweight TypeScript CLI.
- Includes automated tests and GitHub Actions CI.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Internet access for GitHub API requests

Check your installed versions:

```bash
node --version
npm --version
```

## Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/Cyber5Tech/IssueScout.git
cd IssueScout
npm install
```

Build the TypeScript source:

```bash
npm run build
```

You can now run IssueScout through the development command or the compiled output.

## Usage

### Search for issues

Run a broad search for beginner-friendly issues:

```bash
npm run dev -- search
```

Search for TypeScript issues:

```bash
npm run dev -- search --language TypeScript
```

Search for documentation-related issues in Python projects:

```bash
npm run dev -- search --language Python --topic documentation
```

Search for issues related to accessibility:

```bash
npm run dev -- search --topic accessibility
```

Limit the number of results:

```bash
npm run dev -- search --topic testing --limit 5
```

After building, run the compiled CLI directly:

```bash
node dist/cli.js search --language JavaScript --topic documentation
```

If the package is installed globally or linked locally, the command is also available as:

```bash
issuescout search --language TypeScript --topic documentation
```

### Command options

| Option | Description | Example |
| --- | --- | --- |
| `-l, --language <language>` | Filter by GitHub’s detected repository language | `--language Rust` |
| `-t, --topic <topic>` | Add a topic or keyword to the GitHub search | `--topic accessibility` |
| `-n, --limit <number>` | Set the maximum number of results from 1 to 100; defaults to `10` | `--limit 5` |
| `--json` | Print machine-readable JSON | `--json` |
| `--health` | Include repository health signals | `--health` |
| `-V, --version` | Display the IssueScout version | `--version` |
| `-h, --help` | Display command help | `--help` |

> Note: GitHub search syntax is used behind the scenes. A topic containing spaces can be passed as a quoted value, for example `--topic "machine learning"`.

## Saving issues

Save an issue for later review:

```bash
npm run dev -- save https://github.com/owner/repository/issues/123
```

List saved issues:

```bash
npm run dev -- saved
npm run dev -- saved --json
```

Remove a saved issue:

```bash
npm run dev -- remove https://github.com/owner/repository/issues/123
```

Saved issues are stored locally in `.issuescout/saved.json`, which is excluded from version control.

## JSON output and repository health

Use `--json` when another tool will consume the results:

```bash
npm run dev -- search --topic accessibility --json
```

Add repository health signals to each result:

```bash
npm run dev -- search --health --limit 5
```

Health data includes stars, forks, open issue count, and the repository’s latest push timestamp. Health lookups make additional GitHub API requests, so use them selectively.

## GitHub authentication

Set `GITHUB_TOKEN` to use authenticated requests and receive a higher GitHub API rate limit. Never commit the token to the repository.

PowerShell:

```powershell
$env:GITHUB_TOKEN = "your-github-token"
```

macOS or Linux:

```bash
export GITHUB_TOKEN="your-github-token"
```

The token is optional. IssueScout continues to use unauthenticated public requests when it is not set.
## Understanding the score

Each result receives a score from 0 to 100. The current MVP uses three signals:

- **Beginner-friendly label — up to 50 points:** issues with `good first issue`, `help wanted`, or `first-timers-only` receive this bonus.
- **Discussion volume — up to 30 points:** issues with fewer comments score higher, because they may be easier to approach.
- **Freshness — up to 20 points:** recently updated issues score higher than older issues.

The score is a guide, not a guarantee. Before starting work, read the issue, inspect the repository’s contribution guidelines, and ask whether someone else is already working on it.

## GitHub API limits

IssueScout uses GitHub’s public Search Issues API and does not require a token for the current MVP. Unauthenticated API requests are rate-limited by GitHub. If searches stop working temporarily, wait and try again later.

Authentication and higher-rate-limit support are planned for a future release.

## Development

Install dependencies:

```bash
npm install
```

Run the CLI directly from TypeScript during development:

```bash
npm run dev -- search --topic documentation
```

Compile the project:

```bash
npm run build
```

Run the test suite:

```bash
npm test
```

The same build and test checks run automatically in GitHub Actions for pushes to `main` and pull requests.

## Project structure

```text
IssueScout/
├── .github/workflows/ci.yml  # Continuous integration workflow
├── src/cli.ts                 # Command-line interface
├── src/github.ts              # GitHub API client and issue types
├── src/score.ts               # Issue scoring and ranking
├── tests/score.test.ts        # Ranking behavior tests
├── LICENSE                    # MIT license
├── package.json               # Scripts and dependencies
└── tsconfig.json              # TypeScript configuration
```

## Troubleshooting

### 
pm install` fails

Confirm that Node.js 20 or newer is installed, then retry:

```bash
node --version
npm install
```

### GitHub returns a rate-limit error

The unauthenticated GitHub API limit has been reached. Wait for the limit to reset, or use the project’s planned authentication support when it becomes available.

### No issues are found

Try a broader search by removing the language or topic filter:

```bash
npm run dev -- search
```

GitHub issue labels vary by project, and IssueScout currently focuses on a small set of contributor-friendly labels.

### The command is not recognized

Use the development form from the repository root:

```bash
npm run dev -- search
```

Or build first and run the compiled file:

```bash
npm run build
node dist/cli.js search
```

## Roadmap

- Add GitHub token support for higher API limits. *(Implemented in v0.2.0)*
- Add JSON output for scripts and integrations. *(Implemented in v0.2.0)*
- Save and revisit interesting issues locally. *(Implemented in v0.2.0)*
- Add repository health signals such as stars, forks, open issues, and latest push time. *(Initial version implemented in v0.2.0)*
- Explain each score with a per-signal breakdown. *(Implemented in v0.2.0)*
- Add filters for issue age, repository size, and contribution language.
- Add an interactive mode for browsing and saving issues.

## Contributing

Contributions are welcome. To get started:

1. Fork the repository.
2. Create a branch for your change.
3. Install dependencies with 
pm install`.
4. Make your change and add or update tests where appropriate.
5. Run 
pm run build` and 
pm test`.
6. Open a pull request with a clear description of the change.

For substantial changes, open an issue first so the approach can be discussed. Please keep pull requests focused and follow the existing TypeScript style.

## License

IssueScout is available under the [MIT License](LICENSE).
