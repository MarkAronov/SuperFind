import { SkillVectorClient } from "./index.js";

(async () => {
	const client = new SkillVectorClient({ baseUrl: "http://localhost:3000" });
	const results = await client.search("TypeScript developer", 10, 0);
	console.log(`Found ${results.people.length} people (total ${results.total})`);
	results.people.forEach((p) =>
		console.log(`${p.name} — ${p.location} — ${p.role}`),
	);
})();
