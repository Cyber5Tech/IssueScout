# IssueScout

IssueScout is a small, open-source CLI for finding GitHub issues that are welcoming to new contributors.

## Quick start

```bash
npm install
npm run dev -- search --language TypeScript --topic documentation
```

The search uses GitHub's public API. GitHub's unauthenticated rate limit still applies.

## What it does

- Searches open issues marked `good first issue` or `help wanted`.
- Filters by language and topic.
- Scores results using beginner-friendly labels, freshness, and discussion volume.
- Prints repository names, labels, scores, and direct links.

## Development

```bash
npm run build
npm test
```

## Roadmap

- Add GitHub token support for higher rate limits.
- Save and revisit issues locally.
- Add project health signals such as recent commits and response time.
- Offer JSON output for integrations.

## Contributing

Issues and pull requests are welcome. Start by running the project locally, reading the roadmap, and opening an issue describing the change you have in mind.

## License

MIT
