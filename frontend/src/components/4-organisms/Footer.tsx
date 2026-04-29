import { useLocation } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SITE_CONFIG } from "@/constants/site";
import { cn } from "@/lib/utils";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Link } from "../2-atoms/Link";
import { List, ListItem } from "../2-atoms/List";
import { Text } from "../2-atoms/Text";
import { footerSections, socialLinks } from "./Footer.data.tsx";

export const Footer = () => {
	const currentYear = new Date().getFullYear();
	const [scrollOpacity, setScrollOpacity] = useState(0);
	const footerRef = useRef<HTMLElement | null>(null);
	const location = useLocation();

	useEffect(() => {
		let rafId: number;

		const handleScroll = () => {
			if (rafId) return;

			rafId = requestAnimationFrame(() => {
				if (!footerRef.current) {
					setScrollOpacity(0);
					rafId = 0;
					return;
				}

				const rect = footerRef.current.getBoundingClientRect();
				const windowHeight = window.innerHeight;
				const footerHeight = rect.height || 1;
				const footerTop = rect.top;

				// When footer top is below viewport bottom (footerTop >= windowHeight): not visible
				// When footer begins to enter, visibleAmount = windowHeight - footerTop
				const visibleAmount = Math.min(
					Math.max(windowHeight - footerTop, 0),
					footerHeight,
				);
				const opacity = Math.min(Math.max(visibleAmount / footerHeight, 0), 1);

				setScrollOpacity(opacity);
				rafId = 0;
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", handleScroll);
		handleScroll(); // Check initial state

		return () => {
			if (rafId) cancelAnimationFrame(rafId);
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, []);

	return (
		<>
			{/* Background tint overlay - fades in gradually when approaching bottom */}
			<Div
				className={cn(
					// Positioning
					"fixed inset-0",
					// Layout
					"pointer-events-none z-0",
					// Effects
					"transition-opacity duration-700 ease-out",
					// Gradient
					"bg-linear-to-t from-white/40 via-transparent to-transparent",
					"dark:from-black/40 dark:via-transparent dark:to-transparent",
				)}
				style={{ opacity: scrollOpacity }}
				aria-hidden="true"
			/>
			{/* Footer semantic HTML - acceptable at organism level */}
			<footer ref={footerRef} className="mt-auto z-40 relative">
				<Div
					className={cn(
						// Layout
						"max-w-5xl mx-auto",
						// Spacing
						SPACING.PADDING_X.responsive.xs,
						SPACING.PADDING_Y.responsive.xs,
					)}
				>
					<Div
						className={cn(
							// Layout - grid enforces strict 2 or 4 column layout (never 3)
							"grid grid-cols-2 lg:grid-cols-4 justify-items-center",
							// Spacing
							SPACING.GAP_RESPONSIVE.xl,
						)}
					>
						{footerSections.map((section) => (
							<Div
								key={section.title}
								className={cn(
									// Spacing - responsive vertical stack
									"space-y-2 lg:space-y-3",
									// Sizing - fixed width for perfect centering within grid cell
									"w-[80px] lg:w-[160px]",
								)}
							>
								<Heading
									as="h3"
									className={cn(
										// Typography
										TYPOGRAPHY.COMBINATIONS.footerHeading,
										// Colors
										"text-foreground/90",
									)}
								>
									{section.title}
								</Heading>
								<List
									className={cn(
										// Spacing
										"space-y-1.5 lg:space-y-2",
										// Typography
										TYPOGRAPHY.COMBINATIONS.footerLink,
									)}
								>
									{section.links.map((link) => (
										<ListItem key={link.label}>
											{"href" in link ? (
												<Link
													href={(link as { href: string; label: string }).href}
													external
													className={cn(
														// Layout
														"inline-flex items-center",
														// Spacing
														SPACING.GAP.xs,
													)}
												>
													{link.label}
													<ExternalLink className="h-3 w-3" />
												</Link>
											) : (
												<Link
													to={link.to}
													variant={
														(link.to ?? "").split("#")[0] === location.pathname
															? "primary"
															: "default"
													}
												>
													{link.label}
												</Link>
											)}
										</ListItem>
									))}
								</List>
							</Div>
						))}
					</Div>

					{/* Bottom section */}
					<Div
						className={cn(
							// Spacing
							"mt-6 lg:mt-8 pt-6 lg:pt-8",
							// Layout
							"flex flex-col md:flex-row justify-between items-center",
							// Spacing
							SPACING.GAP_RESPONSIVE.md,
						)}
					>
						<Text
							className={cn(
								// Typography
								TYPOGRAPHY.COMBINATIONS.footerCopyright,
							)}
						>
							© {currentYear} {SITE_CONFIG.name}. All rights reserved.
						</Text>

						{/* Social Links */}
						<Div
							className={cn(
								// Layout
								"flex items-center",
								// Spacing
								SPACING.GAP_RESPONSIVE.md,
							)}
						>
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return social.isInternal ? (
									<Link
										key={social.label}
										to={social.href}
										aria-label={social.label}
									>
										<Icon className="h-4 w-4 lg:h-5 lg:w-5" />
									</Link>
								) : (
									<Link
										key={social.label}
										href={social.href}
										external
										aria-label={social.label}
									>
										<Icon className="h-4 w-4 lg:h-5 lg:w-5" />
									</Link>
								);
							})}
						</Div>
					</Div>
				</Div>
			</footer>
		</>
	);
};
