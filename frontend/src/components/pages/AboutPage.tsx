import { Heart, Target, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "../atoms/Card";
import { Grid } from "../atoms/Grid";
import { Heading } from "../atoms/Heading";
import { Hero } from "../atoms/Hero";
import { List, ListItem } from "../atoms/List";
import { Text } from "../atoms/Text";
import { PageTemplate } from "../templates/PageTemplate";

const values = [
	{
		icon: <Target className="h-6 w-6" />,
		title: "Precision",
		description:
			"Semantic search that understands context and relationships between skills.",
	},
	{
		icon: <Zap className="h-6 w-6" />,
		title: "Speed",
		description:
			"Lightning-fast vector search powered by Qdrant for instant results.",
	},
	{
		icon: <Users className="h-6 w-6" />,
		title: "Scalability",
		description:
			"Built to handle millions of profiles with consistent performance.",
	},
	{
		icon: <Heart className="h-6 w-6" />,
		title: "Open Source",
		description: "Transparent, community-driven development under MIT license.",
	},
];

const techStack = [
	{
		title: "AI & Embeddings",
		description:
			"Support for multiple AI providers (OpenAI, Anthropic, Google Gemini, HuggingFace, Ollama) with flexible embedding model selection.",
	},
	{
		title: "Vector Database",
		description:
			"Qdrant vector database for high-performance similarity search and scalable storage.",
	},
	{
		title: "Modern Web Stack",
		description:
			"React 19 frontend with TanStack Router, Tailwind CSS, and a robust Node.js backend with TypeScript.",
	},
];

export const AboutPage = () => {
	return (
		<PageTemplate title="About">
			{/* Hero Section */}
			<Hero
				title="About"
				brand="SkillVector"
				subtitle="Revolutionizing professional search with AI-powered semantic matching that understands skills, not just keywords."
			/>

			{/* Mission Section */}
			<Card variant="hover" aria-label="Our Mission" className="mb-8 lg:mb-12">
				<CardContent>
					<Heading variant="section">Our Mission</Heading>
					<Text className="mb-4">
						SkillVector was built to solve a fundamental problem in talent
						discovery: traditional keyword-based search fails to capture the
						nuanced relationships between skills, experiences, and expertise.
					</Text>
					<Text>
						By leveraging advanced AI embeddings and vector similarity search,
						we enable organizations to find the right professionals based on
						what they can do, not just what keywords appear in their profiles.
					</Text>
				</CardContent>
			</Card>
			{/* Values Grid */}
			<Grid variant="features">
				{values.map(({ icon, title, description }) => (
					<ListItem key={title}>
						<Card variant="hover" aria-label={title} className="h-full">
							<CardHeader icon={icon}>
								<Heading as="h3" variant="card" className="mb-2">
									{title}
								</Heading>
								<Text variant="muted">{description}</Text>
							</CardHeader>
						</Card>
					</ListItem>
				))}
			</Grid>

			{/* Technology Stack Section */}
			<Card variant="hover" aria-label="Technology Stack">
				<CardContent>
					<Heading variant="section">Technology Stack</Heading>
					<List variant="spaced">
						{techStack.map(({ title, description }) => (
							<ListItem key={title}>
								<Text variant="subheading" className="mb-2">
									{title}
								</Text>
								<Text variant="small">{description}</Text>
							</ListItem>
						))}
					</List>
				</CardContent>
			</Card>
		</PageTemplate>
	);
};
