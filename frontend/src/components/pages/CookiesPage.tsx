import { Cookie, Info, Settings, Shield } from "lucide-react";
import type { ReactNode } from "react";
import { CONTACT } from "@/constants/site";
import { ActionButton } from "../atoms/ActionButton";
import { Card } from "../atoms/Card";
import { PageTemplate } from "../templates/PageTemplate";

type CookieCategory = {
	icon: ReactNode;
	title: string;
	description: string;
	cookies: {
		name: string;
		purpose: string;
		duration: string;
	}[];
};

const cookieCategories: CookieCategory[] = [
	{
		icon: <Shield className="h-6 w-6" />,
		title: "Essential Cookies",
		description:
			"These cookies are necessary for the website to function and cannot be disabled.",
		cookies: [
			{
				name: "skillvector-theme",
				purpose: "Stores your theme preference (light/dark/system)",
				duration: "Persistent",
			},
			{
				name: "session_id",
				purpose: "Maintains your session state",
				duration: "Session",
			},
		],
	},
	{
		icon: <Settings className="h-6 w-6" />,
		title: "Functional Cookies",
		description:
			"These cookies enable personalized features and remember your preferences.",
		cookies: [
			{
				name: "search_history",
				purpose: "Stores recent search queries for quick access",
				duration: "30 days",
			},
			{
				name: "ui_preferences",
				purpose: "Remembers UI settings like collapsed sections",
				duration: "1 year",
			},
		],
	},
	{
		icon: <Info className="h-6 w-6" />,
		title: "Analytics Cookies",
		description:
			"Help us understand how visitors interact with our website to improve the user experience.",
		cookies: [
			{
				name: "analytics_id",
				purpose: "Anonymous usage analytics",
				duration: "2 years",
			},
		],
	},
];

export const CookiesPage = () => {
	return (
		<PageTemplate className="bg-transparent">
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							Cookie Policy
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Learn how SkillVector uses cookies to enhance your experience
					</p>
					<p className="text-sm text-muted-foreground mt-4">
						Last updated: January 2025
					</p>
				</div>

				{/* Introduction */}
				<Card
					aria-label="Introduction"
					className="p-6 lg:p-8 mb-8 hover:shadow-lg transition-shadow"
				>
					<div className="flex items-center gap-3 mb-4">
						<Cookie className="h-6 w-6 text-primary" />
						<h2 className="text-xl lg:text-2xl font-bold">What Are Cookies?</h2>
					</div>
					<p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
						Cookies are small text files that are stored on your device when you
						visit a website. They help websites remember your preferences,
						understand how you use the site, and provide a better user
						experience. SkillVector uses cookies sparingly and only for
						essential functionality.
					</p>
				</Card>

				{/* Cookie Categories */}
				<div className="space-y-6 mb-16">
					{cookieCategories.map((category) => (
						<Card
							key={category.title}
							aria-label={category.title}
							className="p-6 lg:p-8 hover:shadow-lg transition-shadow"
						>
							<div className="flex items-center gap-3 mb-4">
								<div className="text-primary">{category.icon}</div>
								<h2 className="text-xl lg:text-2xl font-bold">
									{category.title}
								</h2>
							</div>
							<p className="text-sm lg:text-base text-muted-foreground mb-6">
								{category.description}
							</p>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b border-border">
											<th className="text-left py-3 px-4 font-semibold">
												Cookie Name
											</th>
											<th className="text-left py-3 px-4 font-semibold">
												Purpose
											</th>
											<th className="text-left py-3 px-4 font-semibold">
												Duration
											</th>
										</tr>
									</thead>
									<tbody>
										{category.cookies.map((cookie) => (
											<tr
												key={cookie.name}
												className="border-b border-border/50 last:border-0"
											>
												<td className="py-3 px-4 font-mono text-xs lg:text-sm">
													{cookie.name}
												</td>
												<td className="py-3 px-4 text-muted-foreground">
													{cookie.purpose}
												</td>
												<td className="py-3 px-4 text-muted-foreground">
													{cookie.duration}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</Card>
					))}
				</div>

				{/* Managing Cookies */}
				<Card
					aria-label="Managing cookies"
					className="p-6 lg:p-8 mb-8 hover:shadow-lg transition-shadow"
				>
					<h2 className="text-xl lg:text-2xl font-bold mb-4">
						Managing Your Cookie Preferences
					</h2>
					<div className="space-y-4 text-sm lg:text-base text-muted-foreground">
						<p>
							Most web browsers allow you to control cookies through their
							settings. You can usually find these options in the "Privacy" or
							"Security" section of your browser's settings menu.
						</p>
						<p>
							Please note that disabling essential cookies may affect the
							functionality of SkillVector. Some features may not work as
							expected without certain cookies.
						</p>
						<h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
							How to Manage Cookies in Popular Browsers:
						</h3>
						<ul className="list-disc list-inside space-y-2 ml-4">
							<li>
								<strong>Chrome:</strong> Settings → Privacy and security →
								Cookies
							</li>
							<li>
								<strong>Firefox:</strong> Settings → Privacy & Security →
								Cookies
							</li>
							<li>
								<strong>Safari:</strong> Preferences → Privacy → Manage Website
								Data
							</li>
							<li>
								<strong>Edge:</strong> Settings → Cookies and site permissions
							</li>
						</ul>
					</div>
				</Card>

				{/* Contact */}
				<Card
					aria-label="Questions"
					className="text-center p-8 lg:p-12 hover:shadow-lg transition-shadow"
				>
					<h2 className="text-2xl lg:text-3xl font-bold mb-4">
						Questions About Our Cookie Policy?
					</h2>
					<p className="text-base lg:text-xl text-muted-foreground mb-6">
						If you have any questions about how we use cookies, please contact
						us
					</p>
					<ActionButton href={`mailto:${CONTACT.privacyEmail}`}>
						Contact Privacy Team
					</ActionButton>
				</Card>
			</div>
		</PageTemplate>
	);
};
