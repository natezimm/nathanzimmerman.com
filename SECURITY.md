# Security policy

## Reporting a vulnerability

Please report security problems privately, not in a public issue: use **Report a vulnerability** on this repository's [Security tab](https://github.com/natezimm/nathanzimmerman.com/security/advisories/new). Include what you found, how to reproduce it and what it lets someone do. You should hear back within a week.

The site is static apart from one endpoint, `/api/ask`, which has no accounts and stores nothing; the contact form sends through EmailJS. [`docs/security.md`](docs/security.md) is the threat model. You are welcome to look at [nathanzimmerman.com](https://nathanzimmerman.com) gently, but please do not load-test `/api/ask` (it spends real money and is rate limited), send messages in bulk through the contact form, or try to reach the server itself.

Prompt injection that makes Ask my portfolio say something odd while citing a real source is a known, accepted risk. Reports of anything that reads the key, reaches other services, stores data or gets around the spending caps are very welcome.

## Supported versions

Only what is on `main` is supported; every merge to `main` deploys.
