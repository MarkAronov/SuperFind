import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";
import {
	CONTACT,
	EXTERNAL_LINKS,
	SITE_CONFIG,
	SOCIAL_LINKS,
} from "@/constants/site";
import { Glass } from "../atoms/Glass";

const footerSections = [
	{
		title: "About",
		links: [
			{ to: "/about", label: "About Us" },
			{ to: "/how-it-works", label: "How It Works" },
		],
	},
	{
		title: "Product",
		links: [
			{ to: "/", label: "Search" },
			{ to: "/features", label: "Features" },
			{ to: "/api", label: "API Documentation" },
			{ to: "/integrations", label: "Integrations" },
		],
	},
	{
		title: "Resources",
		links: [
			{
				href: EXTERNAL_LINKS.documentation,
				label: "Documentation",
				external: true,
			},
			{ to: "/support", label: "Support" },
			{ to: "/changelog", label: "Changelog" },
		],
	},
	{
		title: "Legal",
		links: [
			{ to: "/privacy", label: "Privacy Policy" },
			{ to: "/terms", label: "Terms of Service" },
			{ to: "/cookies", label: "Cookie Policy" },
			{ to: "/contact", label: "Contact Us" },
		],
	},
];

const socialLinks = [
	{
		href: SOCIAL_LINKS.github,
		icon: Github,
		label: "GitHub",
	},
	{
		href: SOCIAL_LINKS.linkedin,
		icon: Linkedin,
		label: "LinkedIn",
	},
	{
		href: `mailto:${CONTACT.email}`,
		icon: Mail,
		label: "Email",
	},
];

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<Glass
			asChild
			variant="panel"
			className="mt-auto z-40 backdrop-blur-sm bg-white/40 dark:bg-black/30 rounded-none"
		>
			<footer>
				<div className="container mx-auto px-3 lg:px-4 py-6 lg:py-8">
					<div className="grid grid-cols-4 gap-4 lg:gap-8">
						{footerSections.map((section) => (
							<div key={section.title} className="space-y-2 lg:space-y-3">
								<h3 className="text-xs lg:text-sm font-semibold text-foreground/90">
									{section.title}
								</h3>
								<ul className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm">
									{section.links.map((link) => (
										<li key={link.label}>
											{link.external ? (
												<a
													href={link.href}
													target="_blank"
													rel="noopener noreferrer"
													className="text-foreground/80 hover:text-foreground/95 transition-colors"
												>
													{link.label}
												</a>
											) : (
												<Link
													to={link.to}
													className="text-foreground/80 hover:text-foreground/95 transition-colors"
												>
													{link.label}
												</Link>
											)}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

					{/* Bottom section */}
					<div className="mt-6 lg:mt-8 pt-6 lg:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
						<p className="text-xs lg:text-sm text-foreground/80">
							© {currentYear} {SITE_CONFIG.name}. All rights reserved.
						</p>

						{/* Social Links */}
						<div className="flex items-center gap-3 lg:gap-4">
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<a
										key={social.label}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
										aria-label={social.label}
									>
										<Icon className="h-4 w-4 lg:h-5 lg:w-5" />
									</a>
								);
							})}
						</div>
					</div>
				</div>
			</footer>
		</Glass>
	);
};
