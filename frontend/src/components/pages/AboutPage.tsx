import { Heart, Target, Users, Zap } from "lucide-react";
import { Card } from "../atoms/Card";
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
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						About{" "}
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							SkillVector
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Revolutionizing professional search with AI-powered semantic
						matching that understands skills, not just keywords.
					</p>
				</div>

				{/* Mission Section */}
				<Card
					aria-label="Our Mission"
					className="p-6 hover:shadow-lg transition-shadow mb-8 lg:mb-12"
				>
					<h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
						Our Mission
					</h2>
					<p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-4">
						SkillVector was built to solve a fundamental problem in talent
						discovery: traditional keyword-based search fails to capture the
						nuanced relationships between skills, experiences, and expertise.
					</p>
					<p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
						By leveraging advanced AI embeddings and vector similarity search,
						we enable organizations to find the right professionals based on
						what they can do, not just what keywords appear in their profiles.
					</p>
				</Card>

				{/* Values Grid */}
				<ul className="grid sm:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-12">
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
				</ul>

				{/* Technology Stack Section */}
				<Card
					aria-label="Technology Stack"
					className="p-6 hover:shadow-lg transition-shadow"
				>
					<h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
						Technology Stack
					</h2>
					<ul className="space-y-4">
						{techStack.map(({ title, description }) => (
							<li key={title}>
								<h3 className="text-base lg:text-lg font-semibold mb-2">
									{title}
								</h3>
								<p className="text-xs lg:text-sm text-muted-foreground">
									{description}
								</p>
							</li>
						))}
					</ul>
				</Card>
			</div>
		</PageTemplate>
	);
};
