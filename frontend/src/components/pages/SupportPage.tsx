import { Link } from "@tanstack/react-router";
import { Book, Github, Mail, MessageCircle } from "lucide-react";
import { CONTACT, EXTERNAL_LINKS } from "@/constants/site";
import { ActionButton } from "../atoms/ActionButton";
import { CardSection } from "../atoms/CardSection";
import { Grid } from "../atoms/Grid";
import { Heading } from "../atoms/Heading";
import { Hero } from "../atoms/Hero";
import { Text } from "../atoms/Text";
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
		<PageTemplate className="bg-transparent">
			{/* Hero Section */}
			<Hero
				title="Support"
				subtitle="Get help with SkillVector and find answers to common questions"
			/>

			{/* Support Options */}
			<Grid variant="cards">
				{supportOptions.map((option) => (
					<CardSection
						key={option.title}
						aria-label={option.title}
						className="text-center"
					>
						<div className="mb-4 text-primary flex justify-center">
							{option.icon}
						</div>
						<Heading variant="subsection" className="mb-2">
							{option.title}
						</Heading>
						<Text className="mb-4">{option.description}</Text>
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
					</CardSection>
				))}
			</Grid>

			{/* FAQ Section */}
			<section>
				<Heading variant="section" className="mb-8 text-center">
					Frequently Asked Questions
				</Heading>
				<Grid variant="features">
					{faqs.map((faq) => (
						<CardSection key={faq.question} aria-label={faq.question}>
							<Heading variant="subsection" className="mb-2">
								{faq.question}
							</Heading>
							<Text>{faq.answer}</Text>
						</CardSection>
					))}
				</Grid>
			</section>

			{/* CTA Section */}
			<CardSection aria-label="Contact support" className="text-center">
				<Heading variant="section" className="mb-4">
					Still Need Help?
				</Heading>
				<Text variant="lead" className="mb-6">
					Our team is ready to assist you with any questions or issues.
				</Text>
				<ActionButton
					href={`mailto:${CONTACT.email}`}
					aria-label="Contact our support team"
				>
					Contact Support
				</ActionButton>
			</CardSection>
		</PageTemplate>
	);
};
