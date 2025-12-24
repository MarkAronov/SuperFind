import { Brain, Search, Upload, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { ActionButton } from "../atoms/ActionButton";
import { Card } from "../atoms/Card";
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
		<PageTemplate className="bg-transparent">
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						How{" "}
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							It Works
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Understanding the technology that powers intelligent professional
						search
					</p>
				</div>

				{/* Process Steps */}
				<ul className="space-y-6 mb-16">
					{steps.map((step) => (
						<li key={step.step}>
							<Card
								aria-label={step.title}
								className="p-6 hover:shadow-lg transition-shadow"
							>
								<div className="flex flex-col md:flex-row gap-6 items-start">
									<div className={`shrink-0 ${step.color}`}>{step.icon}</div>
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-3">
											<span className={`text-sm font-bold ${step.color}`}>
												STEP {step.step}
											</span>
											<h3 className="text-xl font-semibold">{step.title}</h3>
										</div>
										<p className="text-muted-foreground mb-4">
											{step.description}
										</p>

										{step.codeExample && (
											<div className="bg-muted/50 rounded-lg p-4">
												<p className="text-sm font-mono">
													{step.codeExample.code}
												</p>
												{step.codeExample.note && (
													<p className="text-sm text-muted-foreground mt-1">
														{step.codeExample.note}
													</p>
												)}
											</div>
										)}

										{step.tags && (
											<div className="bg-muted/50 rounded-lg p-4 space-y-2">
												<p className="text-sm font-semibold">
													Supported AI Providers:
												</p>
												<div className="flex flex-wrap gap-2">
													{step.tags.map((tag) => (
														<span
															key={tag}
															className="px-2 py-1 bg-background rounded text-sm"
														>
															{tag}
														</span>
													))}
												</div>
											</div>
										)}

										{step.listItems && (
											<div className="bg-muted/50 rounded-lg p-4">
												<p className="text-sm font-semibold mb-2">
													Result Quality Metrics:
												</p>
												<ul className="text-sm space-y-1 text-muted-foreground">
													{step.listItems.map((item) => (
														<li key={item}>• {item}</li>
													))}
												</ul>
											</div>
										)}
									</div>
								</div>
							</Card>
						</li>
					))}
				</ul>

				{/* CTA Section */}
				<Card
					aria-label="Try the demo"
					className="text-center p-8 lg:p-12 hover:shadow-lg transition-shadow"
				>
					<h2 className="text-2xl lg:text-3xl font-bold mb-4">
						Ready to Try It?
					</h2>
					<p className="text-base lg:text-xl text-muted-foreground mb-6">
						Experience semantic search in action with our live demo
					</p>
					<div className="flex gap-4 justify-center flex-wrap">
						<ActionButton to="/" aria-label="Try Demo">
							Try Demo
						</ActionButton>
						<ActionButton
							to="/api"
							variant="outline"
							aria-label="View API Docs"
						>
							View API Docs
						</ActionButton>
					</div>
				</Card>
			</div>
		</PageTemplate>
	);
};
