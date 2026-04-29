import { Book, Github, Mail, MessageCircle } from "lucide-react";
import { EXTERNAL_LINKS } from "@/constants/site";
import type { GridItem } from "../4-organisms/cards/card.types";
import type { SupportOption } from "./SupportPage.types";

// Page section headers and content
export const pageContent = {
	faqSection: {
		title: "Frequently Asked Questions",
	},
	contactSection: {
		title: "Get in Touch",
		description:
			"Have a question or need assistance? Send us a message and we'll respond as soon as possible.",
	},
};

// Support options grid
export const supportOptions: SupportOption[] = [
	{
		icon: <Book className="h-6 w-6" />,
		title: "Documentation",
		description: "Browse our comprehensive guides and API reference",
		linkText: "View Docs",
		href: "/documentation",
		isInternal: true,
	},
	{
		icon: <Github className="h-6 w-6" />,
		title: "GitHub Issues",
		description: "Report bugs or request features on GitHub",
		linkText: "Open Issue",
		href: EXTERNAL_LINKS.issues,
		isInternal: false,
	},
	{
		icon: <MessageCircle className="h-6 w-6" />,
		title: "Community",
		description: "Join our community discussions and get help from other users",
		linkText: "Join Discussion",
		href: EXTERNAL_LINKS.discussions,
		isInternal: false,
	},
	{
		icon: <Mail className="h-6 w-6" />,
		title: "Email Support",
		description: "Contact us directly for personalized assistance",
		linkText: "Contact Us",
		href: "/support#contact",
		isInternal: true,
	},
];

export const faqs: GridItem[] = [
	{
		title: "What file formats are supported for profile uploads?",
		description:
			"SkillVector supports CSV, JSON, and plain text (TXT) formats. Each format has specific requirements for field naming and structure, which you can find in our API documentation.",
		centered: false,
	},
	{
		title: "Which AI providers can I use for embeddings?",
		description:
			"We support OpenAI, Anthropic (Claude), Google Gemini, HuggingFace models, and Ollama for local deployments. You can configure your preferred provider via environment variables.",
		centered: false,
	},
	{
		title: "How does semantic search differ from keyword search?",
		description:
			'Semantic search understands the meaning and context of your query, not just exact word matches. For example, searching for "machine learning expert" will also find profiles mentioning "AI researcher" or "deep learning engineer" because these concepts are semantically related.',
		centered: false,
	},
	{
		title: "Is SkillVector open source?",
		description:
			"Yes! SkillVector is open source under the MIT license. You can view the source code, contribute, and deploy your own instance on GitHub.",
		centered: false,
	},
	{
		title: "How do I deploy SkillVector in production?",
		description:
			"We provide Docker support and deployment guides for various platforms. Check our documentation for detailed setup instructions, including Qdrant configuration and environment variable setup.",
		centered: false,
	},
];
