import { Cloud, Code, Search, Shield, Users, Zap } from "lucide-react";
import type { GridItem } from "../4-organisms/cards/card.types";

export const features: GridItem[] = [
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
