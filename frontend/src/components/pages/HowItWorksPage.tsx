import { Brain, Search, Upload, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { ActionButton } from "../atoms/ActionButton";
import { Card } from "../atoms/Card";
import { Div } from "../atoms/Div";
import { Heading } from "../atoms/Heading";
import { Hero } from "../atoms/Hero";
import { List, ListItem } from "../atoms/List";
import { Span } from "../atoms/Span";
import { Text } from "../atoms/Text";
import { PageTemplate } from "../templates/PageTemplate";

type Step = {
	step: number;
	icon: ReactNode;
	title: string;
	description: string;
	color: string;
	codeExample?: { label: string; code: string; note?: string };
	listItems?: string[];
	tags?: string[];
};

const steps: Step[] = [
	{
		step: 1,
		icon: <Upload className="h-6 w-6" />,
		title: "Data Upload",
		description:
			"Upload professional profiles in multiple formats (CSV, JSON, TXT). Our intelligent parser automatically extracts key information including names, roles, skills, and experience.",
		color: "text-primary",
		codeExample: {
			label: "POST /parser/upload",
			code: "POST /parser/upload",
			note: "Supports CSV, JSON, and plain text formats",
		},
	},
	{
		step: 2,
		icon: <Brain className="h-6 w-6" />,
		title: "AI Embedding Generation",
		description:
			"Each profile is processed by advanced AI models to create high-dimensional vector embeddings. These embeddings capture the semantic meaning of skills and experience, not just keywords.",
		color: "text-secondary",
		tags: ["OpenAI", "Anthropic", "Google Gemini", "HuggingFace", "Ollama"],
	},
	{
		step: 3,
		icon: <Search className="h-6 w-6" />,
		title: "Semantic Search",
		description:
			"When you search, your query is converted into a vector embedding using the same AI model. The vector database finds the most similar profiles using cosine similarity.",
		color: "text-success",
		codeExample: {
			label: "POST /ai/search",
			code: "POST /ai/search",
			note: "Returns ranked results by semantic similarity",
		},
	},
	{
		step: 4,
		icon: <Zap className="h-6 w-6" />,
		title: "Instant Results",
		description:
			"Qdrant's high-performance vector search engine returns results in milliseconds, even across millions of profiles. Results include similarity scores and can be filtered by various criteria.",
		color: "text-orange-600",
		listItems: [
			"Similarity scores (0-1 range)",
			"Source context and metadata",
			"Configurable result limits",
		],
	},
];

export const HowItWorksPage = () => {
	return (
		<PageTemplate title="How It Works">
			{/* Hero Section */}
			<Hero
				title="How It"
				brand="Works"
				subtitle="Understanding the technology that powers intelligent professional search"
			/>

			{/* Process Steps */}
			<List variant="spaced" className="mb-16">
				{steps.map((step) => (
					<ListItem key={step.step}>
						<Card
							aria-label={step.title}
							className="p-6 hover:shadow-lg transition-shadow"
						>
							<Div className="flex flex-col md:flex-row gap-6 items-start">
								<Div className={`shrink-0 ${step.color}`}>{step.icon}</Div>
								<Div className="flex-1">
									<Div className="flex items-center gap-3 mb-3">
										<Span className={`text-sm font-bold ${step.color}`}>
											STEP {step.step}
										</Span>
										<Heading as="h3" variant="card">
											{step.title}
										</Heading>
									</Div>
									<Text variant="muted" className="mb-4">
										{step.description}
									</Text>

									{step.codeExample && (
										<Div variant="code" className="mb-4">
											<Text variant="small" className="font-mono">
												{step.codeExample.code}
											</Text>
											{step.codeExample.note && (
												<Text
													variant="small"
													className="mt-1 text-muted-foreground"
												>
													{step.codeExample.note}
												</Text>
											)}
										</Div>
									)}

									{step.tags && (
										<Div variant="code" className="space-y-2">
											<Text variant="small" className="font-semibold">
												Supported AI Providers:
											</Text>
											<Div className="flex flex-wrap gap-2">
												{step.tags.map((tag) => (
													<Span
														key={tag}
														className="px-2 py-1 bg-background rounded text-sm"
													>
														{tag}
													</Span>
												))}
											</Div>
										</Div>
									)}

									{step.listItems && (
										<Div variant="code">
											<Text variant="small" className="font-semibold mb-2">
												Result Quality Metrics:
											</Text>
											<List variant="spaced">
												{step.listItems.map((item) => (
													<ListItem key={item} variant="bullet">
														<Span className="text-primary">•</Span>
														<Text variant="small">{item}</Text>
													</ListItem>
												))}
											</List>
										</Div>
									)}
								</Div>
							</Div>
						</Card>
					</ListItem>
				))}
			</List>

			{/* CTA Section */}
			<Card
				aria-label="Try the demo"
				className="text-center p-8 lg:p-12 hover:shadow-lg transition-shadow"
			>
				<Heading variant="section" className="mb-4">
					Ready to Try It?
				</Heading>
				<Text variant="lead" className="mb-6">
					Experience semantic search in action with our live demo
				</Text>
				<Div className="flex gap-4 justify-center flex-wrap">
					<ActionButton to="/" aria-label="Try Demo">
						Try Demo
					</ActionButton>
					<ActionButton to="/api" variant="outline" aria-label="View API Docs">
						View API Docs
					</ActionButton>
				</Div>
			</Card>
		</PageTemplate>
	);
};
