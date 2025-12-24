import { Heart, Target, Users, Zap } from "lucide-react";
import { CardSection } from "../atoms/CardSection";
import { Grid } from "../atoms/Grid";
import { Heading } from "../atoms/Heading";
import { Hero } from "../atoms/Hero";
import { PageContainer } from "../atoms/PageContainer";
import { Text } from "../atoms/Text";
import { FeatureCard } from "../molecules/FeatureCard";
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
		<PageTemplate className="bg-transparent">
			<PageContainer>
				<Hero
					title="About"
					brand="SkillVector"
					subtitle="Revolutionizing professional search with AI-powered semantic matching that understands skills, not just keywords."
				/>

				{/* Mission Section */}
				<CardSection aria-label="Our Mission" className="mb-8 lg:mb-12">
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
				</CardSection>

				{/* Values Grid */}
				<Grid variant="features">
					{values.map(({ icon, title, description }) => (
						<li key={title}>
							<FeatureCard
								icon={icon}
								title={title}
								description={description}
								className="h-full"
							/>
						</li>
					))}
				</Grid>

				{/* Technology Stack Section */}
				<CardSection aria-label="Technology Stack">
					<Heading variant="section">Technology Stack</Heading>
					<ul className="space-y-4">
						{techStack.map(({ title, description }) => (
							<li key={title}>
								<Text variant="subheading" className="mb-2">
									{title}
								</Text>
								<Text variant="small">{description}</Text>
							</li>
						))}
					</ul>
				</CardSection>
			</PageContainer>
		</PageTemplate>
	);
};
