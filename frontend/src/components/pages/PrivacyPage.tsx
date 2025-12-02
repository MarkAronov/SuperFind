import { CONTACT } from "@/constants/site";
import { Card } from "../atoms/Card";
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
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							Privacy Policy
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						How we collect, use, and protect your information
					</p>
					<p className="text-sm text-muted-foreground mt-4">
						Last updated: November 24, 2025
					</p>
				</div>

				{/* Privacy Sections */}
				<ul className="space-y-6 lg:space-y-8 mb-16">
					{privacySections.map((section) => (
						<li key={section.title}>
							<Card
								aria-label={section.title}
								className="p-6 hover:shadow-lg transition-shadow"
							>
								<h2 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">
									{section.title}
								</h2>

								{section.content && (
									<p className="text-xs lg:text-sm text-muted-foreground leading-relaxed mb-3">
										{section.content}
									</p>
								)}

								{section.subsections && (
									<div className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-muted-foreground">
										{section.subsections.map((sub) => (
											<div key={sub.title}>
												<h3 className="font-semibold text-foreground mb-2">
													{sub.title}
												</h3>
												<p className="leading-relaxed">{sub.content}</p>
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
							</Card>
						</li>
					))}

					{/* Contact Section */}
					<li>
						<Card
							aria-label="Contact Us"
							className="p-6 hover:shadow-lg transition-shadow"
						>
							<h2 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">
								9. Contact Us
							</h2>
							<p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
								If you have questions about this Privacy Policy or how we handle
								your data, please contact us at:{" "}
								<a
									href={`mailto:${CONTACT.email}`}
									className="text-primary hover:underline"
								>
									{CONTACT.email}
								</a>
							</p>
						</Card>
					</li>
				</ul>
			</div>
		</PageTemplate>
	);
};
