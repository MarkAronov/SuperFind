import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";
import {
	CONTACT,
	EXTERNAL_LINKS,
	SITE_CONFIG,
	SOCIAL_LINKS,
} from "@/constants/site";
import { Glass } from "../atoms/Glass";

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
					<div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-4">
						{/* About Section */}
						<div className="space-y-2 lg:space-y-3">
							<h3 className="text-xs lg:text-sm font-semibold text-foreground/90">
								About
							</h3>
							<ul className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm">
								<li>
									<Link
										to="/about"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										About Us
									</Link>
								</li>
								<li>
									<Link
										to="/how-it-works"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										How It Works
									</Link>
								</li>
							</ul>
						</div>

						{/* Product Section */}
						<div className="space-y-2 lg:space-y-3">
							<h3 className="text-xs lg:text-sm font-semibold text-foreground/90">
								Product
							</h3>
							<ul className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm">
								<li>
									<Link
										to="/"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										Search
									</Link>
								</li>
								<li>
									<Link
										to="/features"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										Features
									</Link>
								</li>
								<li>
									<Link
										to="/api"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										API Documentation
									</Link>
								</li>
								<li>
									<Link
										to="/integrations"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										Integrations
									</Link>
								</li>
							</ul>
						</div>

						{/* Resources Section */}
						<div className="space-y-2 lg:space-y-3">
							<h3 className="text-xs lg:text-sm font-semibold text-foreground/90">
								Resources
							</h3>
							<ul className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm">
								<li>
									<a
										href={EXTERNAL_LINKS.documentation}
										target="_blank"
										rel="noopener noreferrer"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										Documentation
									</a>
								</li>
								<li>
									<Link
										to="/support"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										Support
									</Link>
								</li>
								<li>
									<Link
										to="/changelog"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										Changelog
									</Link>
								</li>
							</ul>
						</div>

						{/* Legal Section */}
						<div className="space-y-2 lg:space-y-3">
							<h3 className="text-xs lg:text-sm font-semibold text-foreground/90">
								Legal
							</h3>
							<ul className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm">
								<li>
									<Link
										to="/privacy"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link
										to="/terms"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										Terms of Service
									</Link>
								</li>
								<li>
									<Link
										to="/cookies"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										Cookie Policy
									</Link>
								</li>
								<li>
									<Link
										to="/contact"
										className="text-foreground/80 hover:text-foreground/95 transition-colors"
									>
										Contact Us
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Bottom section */}
					<div className="mt-6 lg:mt-8 pt-6 lg:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
						<p className="text-xs lg:text-sm text-foreground/80">
							© {currentYear} {SITE_CONFIG.name}. All rights reserved.
						</p>

						{/* Social Links */}
						<div className="flex items-center gap-3 lg:gap-4">
							<a
								href={SOCIAL_LINKS.github}
								target="_blank"
								rel="noopener noreferrer"
								className="text-foreground/80 hover:text-foreground/95 transition-colors"
								aria-label="GitHub"
							>
								<Github className="h-4 w-4 lg:h-5 lg:w-5" />
							</a>
							<a
								href={SOCIAL_LINKS.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="text-foreground/80 hover:text-foreground/95 transition-colors"
								aria-label="LinkedIn"
							>
								<Linkedin className="h-4 w-4 lg:h-5 lg:w-5" />
							</a>
							<a
								href={`mailto:${CONTACT.email}`}
								className="text-foreground/80 hover:text-foreground/95 transition-colors"
								aria-label="Email"
							>
								<Mail className="h-4 w-4 lg:h-5 lg:w-5" />
							</a>
						</div>
					</div>
				</div>
			</footer>
		</Glass>
	);
};
