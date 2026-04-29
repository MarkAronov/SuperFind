import { Brain, Search, Upload, Zap } from "lucide-react";
import type { GridItem } from "../4-organisms/cards/card.types";

// Call-to-action section content
export const ctaContent = {
	title: "Ready to Try It?",
	description: "Experience semantic search in action with our live demo",
	primaryButton: {
		label: "Try Demo",
		to: "/search",
		ariaLabel: "Try Demo",
	},
	secondaryButton: {
		label: "View API Docs",
		to: "/documentation#api",
		variant: "secondary" as const,
		ariaLabel: "View API Docs",
	},
};

// Process steps
export const steps: GridItem[] = [
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
		items: [
			"Similarity scores (0-1 range)",
			"Source context and metadata",
			"Configurable result limits",
		],
	},
];
