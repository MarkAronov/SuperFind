# SkillVector TypeScript SDK

A small TypeScript SDK for SkillVector providing a thin wrapper around the REST API.

## Installation

```bash
npm install @skillvector/sdk
# or
pnpm add @skillvector/sdk
# or
yarn add @skillvector/sdk
```

## Quick Start

```ts
import { SkillVectorClient } from "@skillvector/sdk";

const client = new SkillVectorClient({ baseUrl: "http://localhost:3000" });

(async () => {
  const results = await client.search("developers from europe", 10, 0);
  console.log(results.people);
})();
```

## API

- `new SkillVectorClient({ baseUrl, apiKey })` — create a client.
- `client.search(query, limit, offset)` — search for people.
- `client.getPeople(limit)` — list people.
 - `client.searchWithFilters(query, { skills, location, role }, limit, offset)` — search with additional filters.
 - `client.searchPaginated(query, pageSize)` — returns an async iterable that yields Person objects across all pages.

## Contributing

PRs welcome — please add more utility functions, types, and tests as needed.
