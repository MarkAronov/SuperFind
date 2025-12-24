import { CONTACT } from "@/constants/site";
import { CardSection } from "../atoms/CardSection";
import { Grid } from "../atoms/Grid";
import { Heading } from "../atoms/Heading";
import { Hero } from "../atoms/Hero";
import { Text } from "../atoms/Text";
import { PageTemplate } from "../templates/PageTemplate";

type PrivacySection = {
	title: string;
	content?: string;
	subsections?: { title: string; content: string }[];
	items?: string[];
};

const privacySections: PrivacySection[] = [
	{
		title: "1. Introduction",
		content:
			'SkillVector ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our professional search platform. As an open-source project, transparency is core to our values.',
	},
	{
		title: "2. Information We Collect",
		subsections: [
			{
				title: "2.1 Profile Data",
				content:
					"When you upload professional profiles, we process names, roles, skills, experience, and other professional information. This data is converted into vector embeddings and stored in our Qdrant database.",
			},
			{
				title: "2.2 Usage Data",
				content:
					"We collect information about how you interact with our service, including search queries, API requests, and system logs for debugging and performance optimization.",
			},
			{
				title: "2.3 Technical Data",
				content:
					"We may collect IP addresses, browser types, and device information for security and analytics purposes.",
			},
		],
	},
	{
		title: "3. How We Use Your Information",
		items: [
			"To provide semantic search functionality and match professional profiles",
			"To improve our AI models and search algorithms",
			"To maintain and optimize system performance and security",
			"To communicate with you about service updates and support",
			"To comply with legal obligations and prevent misuse",
		],
	},
	{
		title: "4. Data Storage and Security",
		content: "Your data is stored securely using industry-standard practices:",
		items: [
			"Profile data is vectorized and stored in Qdrant with encryption at rest",
			"All API communications are encrypted using HTTPS/TLS",
			"Access controls and authentication protect your data from unauthorized access",
			"Regular security audits and updates maintain system integrity",
		],
	},
	{
		title: "5. Third-Party Services",
		content:
			"We integrate with third-party AI providers for embedding generation:",
		items: [
			"OpenAI, Anthropic, Google, HuggingFace, or Ollama (based on your configuration)",
			"Each provider has their own privacy policy and data handling practices",
			"Self-hosted deployments using Ollama keep all data on your infrastructure",
		],
	},
	{
		title: "6. Your Rights",
		content: "You have the right to:",
		items: [
			"Access, update, or delete your profile data at any time",
			"Export your data in a portable format",
			"Opt out of data collection (except as required)",
			"Request information about how your data is used",
			"Lodge a complaint with data protection authorities",
		],
	},
	{
		title: "7. Open Source Considerations",
		content:
			"SkillVector is open source under the MIT license. If you self-host SkillVector, you are responsible for compliance with applicable privacy laws and regulations. We provide the tools, but data handling practices are determined by each deployment.",
	},
	{
		title: "8. Changes to This Policy",
		content:
			"We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date. Continued use of SkillVector after changes constitutes acceptance of the updated policy.",
	},
];

export const PrivacyPage = () => {
	return (
		<PageTemplate className="bg-transparent">
			{/* Hero Section */}
			<Hero
				title="Privacy Policy"
				subtitle="How we collect, use, and protect your information"
			/>
			<Text variant="muted" className="text-center mt-4">
				Last updated: November 24, 2025
			</Text>

			{/* Privacy Sections */}
			<Grid variant="features">
				{privacySections.map((section) => (
					<CardSection key={section.title} aria-label={section.title}>
						<Heading variant="subsection" className="mb-3 lg:mb-4">
							{section.title}
						</Heading>

						{section.content && (
							<Text variant="small" className="mb-3">
								{section.content}
							</Text>
						)}

						{section.subsections && (
							<div className="space-y-3 lg:space-y-4">
								{section.subsections.map((sub) => (
									<div key={sub.title}>
										<Text variant="subheading" className="mb-2">
											{sub.title}
										</Text>
										<Text variant="small">{sub.content}</Text>
									</div>
								))}
							</div>
						)}

						{section.items && (
							<ul className="space-y-2 text-xs lg:text-sm text-muted-foreground">
								{section.items.map((item) => (
									<li key={item} className="flex gap-2">
										<span className="text-primary">•</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						)}
					</CardSection>
				))}

				{/* Contact Section */}
				<CardSection aria-label="Contact Us">
					<Heading variant="subsection" className="mb-3 lg:mb-4">
						9. Contact Us
					</Heading>
					<Text variant="small">
						If you have questions about this Privacy Policy or how we handle
						your data, please contact us at:{" "}
						<a
							href={`mailto:${CONTACT.email}`}
							className="text-primary hover:underline"
						>
							{CONTACT.email}
						</a>
					</Text>
				</CardSection>
			</Grid>
		</PageTemplate>
	);
};
