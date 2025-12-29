import { Card, CardContent } from "../atoms/Card";
import { Div } from "../atoms/Div";
import { Heading } from "../atoms/Heading";
import { List, ListItem } from "../atoms/List";
import { Text } from "../atoms/Text";
import { CodeBlock } from "../molecules/CodeBlock";
import { PageTemplate } from "../templates/PageTemplate";

export const SdkDocsPage = () => {
	const install = `npm install @skillvector/sdk`;
	const quickUse = `import { SkillVectorClient } from '@skillvector/sdk';

(async () => {
  const client = new SkillVectorClient({ baseUrl: 'http://localhost:3000' });
  const results = await client.search('TypeScript developer', 10, 0);
  console.log(results);
})();`;

	return (
		<PageTemplate title="SDK">
			<Div className="mb-8">
				<Heading variant="section" className="mb-2">
					SDKs
				</Heading>
				<Text variant="muted">
					TypeScript SDK for SkillVector — quick-start and examples
				</Text>
			</Div>
			<Div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card variant="hover" fill>
					<CardContent>
						<Heading as="h2" variant="card" className="mb-2">
							Install
						</Heading>
						<CodeBlock language="bash" code={install} />
					</CardContent>
				</Card>

				<Card variant="hover" fill>
					<CardContent>
						<Heading as="h2" variant="card" className="mb-2">
							Quick Start
						</Heading>
						<CodeBlock language="ts" code={quickUse} />
					</CardContent>
				</Card>

				<Card variant="hover" fill>
					<CardContent>
						<Heading as="h2" variant="card" className="mb-2">
							Features
						</Heading>
						<List variant="disc">
							<ListItem>Search & pagination helpers</ListItem>
							<ListItem>Filters support with `searchWithFilters`</ListItem>
							<ListItem>Retries and exponential backoff</ListItem>
							<ListItem>TypeScript types for strict typing</ListItem>
						</List>
					</CardContent>
				</Card>
			</Div>
		</PageTemplate>
	);
};
