import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Cloud,
	Code,
	Search,
	Shield,
	Users,
	Zap,
} from "lucide-react";
import { Card } from "../atoms/Card";
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
		<PageTemplate className="bg-transparent">
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						Powerful Features for{" "}
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							Modern Talent Search
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Leverage cutting-edge AI and vector search technology to find the
						perfect candidates faster than ever.
					</p>
				</div>

				{/* Features Grid */}
				<ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
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
				</ul>

				{/* CTA Section */}
				<Card
					aria-label="Call to action"
					className="text-center p-8 lg:p-12 hover:shadow-lg transition-shadow"
				>
					<h2 className="text-2xl lg:text-3xl font-bold mb-4">
						Ready to get started?
					</h2>
					<p className="text-base lg:text-xl text-muted-foreground mb-6">
						Try SkillVector today and experience the future of talent search.
					</p>
					<div className="flex flex-wrap gap-4 justify-center">
						<Link
							to="/"
							aria-label="Try Search"
							className="px-5 lg:px-6 py-2.5 lg:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium inline-flex items-center gap-2 text-sm lg:text-base"
						>
							Try Search <ArrowRight className="h-4 w-4" />
						</Link>
						<Link
							to="/api"
							aria-label="View API Docs"
							className="px-5 lg:px-6 py-2.5 lg:py-3 border border-border rounded-lg hover:bg-white/10 transition-colors font-medium text-sm lg:text-base"
						>
							View API Docs
						</Link>
					</div>
				</Card>
			</div>
		</PageTemplate>
	);
};
