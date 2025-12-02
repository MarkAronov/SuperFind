import { CONTACT } from "@/constants/site";
import { Card } from "../atoms/Card";
import { PageTemplate } from "../templates/PageTemplate";

type TermsSection = {
	title: string;
	content?: string;
	items?: string[];
};

const termsSections: TermsSection[] = [
	{
		title: "1. Acceptance of Terms",
		content:
			"By accessing or using SkillVector, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.",
	},
	{
		title: "2. Use License",
		content:
			"SkillVector is open-source software licensed under the MIT License. You are granted permission to:",
		items: [
			"Use, copy, modify, and distribute the software",
			"Use the software for commercial purposes",
			"Sublicense and sell copies of the software, subject to MIT License terms",
		],
	},
	{
		title: "3. Disclaimer",
		content:
			'The software is provided "AS IS", without warranty of any kind, express or implied, including but not limited to:',
		items: [
			"Warranties of merchantability or fitness for purpose",
			"Accuracy or reliability of search results",
			"Continuous, uninterrupted, or error-free operation",
		],
	},
	{
		title: "4. Acceptable Use",
		content: "You agree not to:",
		items: [
			"Upload malicious code, viruses, or harmful content",
			"Violate any applicable laws or regulations",
			"Interfere with the proper functioning of the service",
			"Attempt unauthorized access to systems or data",
			"Upload personal data without proper consent and legal basis",
		],
	},
	{
		title: "5. Data Responsibility",
		content:
			"You are responsible for ensuring that any profile data you upload complies with applicable privacy laws (GDPR, CCPA, etc.). You must have appropriate consent and legal basis for processing personal information through SkillVector.",
	},
	{
		title: "6. Third-Party Services",
		content:
			"SkillVector integrates with third-party AI providers (OpenAI, Anthropic, Google, etc.). Your use of these services is subject to their respective terms and conditions. We are not responsible for third-party service availability or actions.",
	},
	{
		title: "7. Limitation of Liability",
		content:
			"In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from the use of SkillVector, including but not limited to data loss, business interruption, or AI model inaccuracies.",
	},
	{
		title: "8. Modifications",
		content:
			"We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of SkillVector after changes constitutes acceptance of the modified terms.",
	},
	{
		title: "9. Governing Law",
		content:
			"These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved in accordance with the MIT License terms.",
	},
];

export const TermsPage = () => {
	return (
		<PageTemplate className="bg-transparent">
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							Terms of Service
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						The rules and guidelines for using SkillVector
					</p>
					<p className="text-sm text-muted-foreground mt-4">
						Last updated: November 24, 2025
					</p>
				</div>

				{/* Terms Sections */}
				<ul className="space-y-6 lg:space-y-8 mb-16">
					{termsSections.map((section) => (
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
							aria-label="Contact Information"
							className="p-6 hover:shadow-lg transition-shadow"
						>
							<h2 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">
								10. Contact Information
							</h2>
							<p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
								For questions about these Terms of Service, please contact:{" "}
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
