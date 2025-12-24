import {
	ArrowRight,
	Cloud,
	Code,
	Search,
	Shield,
	Users,
	Zap,
} from "lucide-react";
import { ActionButton } from "../atoms/ActionButton";
import { CardSection } from "../atoms/CardSection";
import { Grid } from "../atoms/Grid";
import { Hero } from "../atoms/Hero";
import { PageContainer } from "../atoms/PageContainer";
import { Text } from "../atoms/Text";
import { FeatureCard } from "../molecules/FeatureCard";
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
		<PageTemplate className="bg-transparent" title="Features">
			<PageContainer>
				<Hero
					title="Powerful Features for"
					brand="Modern Talent Search"
					subtitle="Leverage cutting-edge AI and vector search technology to find the perfect candidates faster than ever."
				/>

				{/* Features Grid */}
				<Grid variant="cards">
					{features.map((feature) => (
						<li key={feature.title}>
							<FeatureCard
								icon={feature.icon}
								title={feature.title}
								description={feature.description}
								className="h-full"
							/>
						</li>
					))}
				</Grid>

				{/* CTA Section */}
				<CardSection aria-label="Call to action" className="text-center">
					<Text variant="heading" className="mb-4">
						Ready to get started?
					</Text>
					<Text variant="lead" className="mb-6">
						Try SkillVector today and experience the future of talent search.
					</Text>
					<div className="flex flex-wrap gap-4 justify-center">
						<ActionButton to="/" aria-label="Try Search">
							Try Search <ArrowRight className="h-4 w-4" />
						</ActionButton>
						<ActionButton
							to="/api"
							variant="outline"
							aria-label="View API Docs"
						>
							View API Docs
						</ActionButton>
					</div>
				</CardSection>
			</PageContainer>
		</PageTemplate>
	);
};
