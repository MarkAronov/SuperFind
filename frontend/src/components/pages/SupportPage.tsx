import { Link } from "@tanstack/react-router";
import { Book, Github, Mail, MessageCircle } from "lucide-react";
import { CONTACT, EXTERNAL_LINKS } from "@/constants/site";
import { Card } from "../atoms/Card";
import { PageTemplate } from "../templates/PageTemplate";

const supportOptions = [
	{
		icon: <Book className="h-6 w-6" />,
		title: "Documentation",
		description: "Browse our comprehensive guides and API reference",
		linkText: "View Docs",
		href: "/api",
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
		linkText: "Send Email",
		href: `mailto:${CONTACT.email}`,
		isInternal: false,
	},
];

const faqs = [
	{
		question: "What file formats are supported for profile uploads?",
		answer:
			"SkillVector supports CSV, JSON, and plain text (TXT) formats. Each format has specific requirements for field naming and structure, which you can find in our API documentation.",
	},
	{
		question: "Which AI providers can I use for embeddings?",
		answer:
			"We support OpenAI, Anthropic (Claude), Google Gemini, HuggingFace models, and Ollama for local deployments. You can configure your preferred provider via environment variables.",
	},
	{
		question: "How does semantic search differ from keyword search?",
		answer:
			'Semantic search understands the meaning and context of your query, not just exact word matches. For example, searching for "machine learning expert" will also find profiles mentioning "AI researcher" or "deep learning engineer" because these concepts are semantically related.',
	},
	{
		question: "Is SkillVector open source?",
		answer:
			"Yes! SkillVector is open source under the MIT license. You can view the source code, contribute, and deploy your own instance on GitHub.",
	},
	{
		question: "How do I deploy SkillVector in production?",
		answer:
			"We provide Docker support and deployment guides for various platforms. Check our documentation for detailed setup instructions, including Qdrant configuration and environment variable setup.",
	},
];

export const SupportPage = () => {
	return (
		<PageTemplate>
			{/* Hero Section */}
			<div className="text-center mb-16">
				<h1 className="text-3xl lg:text-5xl font-bold mb-4">
					<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						Support
					</span>
				</h1>
				<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
					Get help with SkillVector and find answers to common questions
				</p>
			</div>

			{/* Support Options */}
			<ul className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8 mb-16">
				{supportOptions.map((option) => (
					<li key={option.title}>
						<Card
							aria-label={option.title}
							className="p-6 hover:shadow-lg transition-shadow text-center h-full"
						>
							<div className="mb-4 text-primary flex justify-center">
								{option.icon}
							</div>
							<h3 className="text-xl font-semibold mb-2">{option.title}</h3>
							<p className="text-muted-foreground mb-4">{option.description}</p>
							{option.isInternal ? (
								<Link
									to={option.href}
									aria-label={option.linkText}
									className="inline-flex items-center gap-2 text-primary dark:text-primary font-medium hover:underline"
								>
									{option.linkText}
								</Link>
							) : (
								<a
									href={option.href}
									target={
										option.href.startsWith("mailto:") ? undefined : "_blank"
									}
									rel={
										option.href.startsWith("mailto:")
											? undefined
											: "noopener noreferrer"
									}
									aria-label={option.linkText}
									className="inline-flex items-center gap-2 text-primary dark:text-primary font-medium hover:underline"
								>
									{option.linkText}
								</a>
							)}
						</Card>
					</li>
				))}
			</ul>

			{/* FAQ Section */}
			<section className="max-w-4xl mx-auto mb-16">
				<h2 className="text-2xl font-bold mb-8 text-center">
					Frequently Asked Questions
				</h2>
				<ul className="space-y-6">
					{faqs.map((faq) => (
						<li key={faq.question}>
							<Card
								aria-label={faq.question}
								className="p-6 hover:shadow-lg transition-shadow"
							>
								<h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
								<p className="text-muted-foreground">{faq.answer}</p>
							</Card>
						</li>
					))}
				</ul>
			</section>

			{/* CTA Section */}
			<Card
				aria-label="Contact support"
				className="text-center p-12 max-w-4xl mx-auto hover:shadow-lg transition-shadow"
			>
				<h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
				<p className="text-xl text-muted-foreground mb-6">
					Our team is ready to assist you with any questions or issues.
				</p>
				<a
					href={`mailto:${CONTACT.email}`}
					aria-label="Contact our support team"
					className="px-5 lg:px-6 py-2.5 lg:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium inline-block"
				>
					Contact Support
				</a>
			</Card>
		</PageTemplate>
	);
};
