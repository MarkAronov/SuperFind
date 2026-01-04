import {
	ArrowRight,
	Cloud,
	Code,
	Search,
	Shield,
	Users,
	Zap,
} from "lucide-react";
import { Grid } from "../atoms/Grid";
import { Hero } from "../atoms/Hero";
import { ListItem } from "../atoms/List";
import { CTACard } from "../molecules/CTACard";
import { IconCard } from "../molecules/IconCard";
import { PageTemplate } from "../templates/PageTemplate";

export const FeaturesPage = () => {
	const features = [
		{
			icon: <Search className="h-6 w-6" />,
			title: "Semantic Search",
			description:
				"Find talent based on meaning, not just keywords. Our AI understands context and intent.",
		},
		{
			icon: <Zap className="h-6 w-6" />,
			title: "Lightning Fast",
			description:
				"Built on Bun runtime and Qdrant vector database for sub-second search results.",
		},
		{
			icon: <Code className="h-6 w-6" />,
			title: "Multi-AI Provider",
			description:
				"Choose from OpenAI, Anthropic, Google Gemini, Ollama, or HuggingFace.",
		},
		{
			icon: <Shield className="h-6 w-6" />,
			title: "Type-Safe API",
			description:
				"Full TypeScript implementation with comprehensive type safety and validation.",
		},
		{
			icon: <Cloud className="h-6 w-6" />,
			title: "Scalable Architecture",
			description:
				"Vector database-backed architecture that scales with your needs.",
		},
		{
			icon: <Users className="h-6 w-6" />,
			title: "Multi-Format Support",
			description:
				"Parse and index data from CSV, JSON, and TXT files automatically.",
		},
	];

	return (
		<PageTemplate title="Features">
			{/* Hero Section */}
			<Hero
				title="Powerful "
				brand="Features"
				subtitle="Leverage cutting-edge AI and vector search technology to find the perfect candidates faster than ever."
			/>

			{/* Features Grid */}
			<Grid variant="cards">
				{features.map((feature) => (
					<ListItem key={feature.title}>
						<IconCard
							icon={feature.icon}
							title={feature.title}
							description={feature.description}
						/>
					</ListItem>
				))}
			</Grid>

			{/* Call to Action */}
			<CTACard
				title="Ready to get started?"
				description="Try SkillVector today and experience the future of talent search."
				primaryAction={{
					label: (
						<>
							Try Search <ArrowRight className="h-4 w-4" />
						</>
					) as unknown as string,
					to: "/",
					ariaLabel: "Try Search",
				}}
				secondaryAction={{
					label: "View API Docs",
					to: "/api",
					variant: "outline",
					ariaLabel: "View API Docs",
				}}
			/>
		</PageTemplate>
	);
};
