import { Link as RouterLink, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "../../hooks/useTheme";
import { Glass } from "../1-ions/Glass";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Link } from "../2-atoms/Link";
import { Logo } from "../2-atoms/Logo";
import { Span } from "../2-atoms/Span";
import { MOTION } from "../animations/0-tokens/tokens.ts";
import { navigationItems, themeIcons, themeLabels } from "./Header.data.tsx";

export const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();
	const location = useLocation();

	const ThemeIcon = themeIcons[theme];
	const themeLabel = themeLabels[theme];

	const renderNavLink = (
		item: (typeof navigationItems)[0],
		isMobile = false,
	) => {
		const isActive =
			!item.external && (item.to ?? "").split("#")[0] === location.pathname;

		// Match footer link behavior — layout/typography differences per breakpoint only.
		// hover:text-* and transition-colors removed — the Link atom's MotionTextRipple handles the animation.
		const className = isMobile
			? cn(
					// Colors (rest state only; hover handled by MotionTextRipple inside Link)
					isActive ? "text-primary" : "text-muted-foreground",
					// Typography
					TYPOGRAPHY.FONT_WEIGHT.medium,
				)
			: cn(
					// Colors (rest state only; hover handled by MotionTextRipple inside Link)
					isActive ? "text-primary" : "text-foreground/90",
					// Typography
					TYPOGRAPHY.FONT_WEIGHT.medium,
					TYPOGRAPHY.FONT_SIZE.sm_base,
				);

		const onClick = isMobile ? () => setMobileMenuOpen(false) : undefined;

		// External link - use Link atom with shared hover behavior.
		if (item.external) {
			return (
				<Link
					key={item.label}
					href={item.href}
					external
					underline={false}
					className={className}
					onClick={onClick}
				>
					{item.label}
				</Link>
			);
		}

		// Internal link - use Link atom so header and footer share the same hover model.
		return (
			<Link
				key={item.label}
				to={item.to}
				variant={isActive ? "primary" : "default"}
				underline={false}
				className={className}
				onClick={onClick}
			>
				{item.label}
			</Link>
		);
	};

	return (
		<Div className="w-full sticky top-0 z-[999999999999] pointer-events-none pt-3">
			<Div
				className={cn(
					// Layout — relative so the absolute dropdown is anchored here
					"mx-auto pointer-events-auto relative",
					// Sizing
					"w-[calc(100%-2rem)] max-w-5xl",
				)}
			>
				<Glass
					asChild
					variant="panel"
					className={cn(
						// Effects
						"backdrop-blur-sm rounded-2xl",
						// Colors
						"bg-white/40 dark:bg-black/30",
						// Shadows
						"shadow-lg shadow-black/5 dark:shadow-black/20",
						// Border
						"border border-white/20 dark:border-white/10",
					)}
				>
					<header>
						<nav
							className={cn(
								// Layout
								"container mx-auto",
								// Spacing
								SPACING.PADDING_X.responsive.xs,
							)}
						>
							<Div className="flex items-center justify-between h-12 lg:h-14">
								{/* Logo and Brand */}
								<RouterLink
									to="/"
									className={cn(
										// Layout
										"flex items-center",
										// Spacing
										SPACING.GAP.sm,
										// States
										"hover:opacity-80 transition-opacity",
									)}
								>
									<Logo size="md" />
									<Span
										className={cn(
											// Typography
											TYPOGRAPHY.COMBINATIONS.brandText,
											// Effects
											"bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent",
										)}
									>
										SkillVector
									</Span>
								</RouterLink>

								{/* Desktop Navigation */}
								<Div
									className={cn(
										// Layout
										"hidden md:flex items-center",
										// Spacing
										SPACING.GAP_RESPONSIVE.lg,
									)}
								>
									{navigationItems.map((item) => renderNavLink(item))}
								</Div>
								{/* Theme Toggle */}
								<Div className="hidden md:flex items-center">
									<Button
										// Use link-like button styling so the icon behaves like footer social icons.
										variant="link"
										size={null}
										type="button"
										onClick={toggleTheme}
										className={cn(
											// Reset button box so it visually matches footer icon links.
											"h-auto p-0",
											// Match header navigation resting color while keeping link-style hover.
											"text-foreground/90",
										)}
										aria-label={`Current theme: ${theme}. Click to toggle.`}
										title={`Theme: ${theme}`}
									>
										{/* Match footer social icon sizes: 16px mobile-like baseline, 20px at desktop. */}
										<ThemeIcon className="h-4 w-4 lg:h-5 lg:w-5" />
									</Button>
								</Div>

								{/* Mobile Search and Menu */}
								<Div
									className={cn(
										// Layout
										"md:hidden flex items-center",
										// Spacing
										SPACING.GAP.sm,
									)}
								>
									{/* Mobile search icon - match footer-style icon hover behavior. */}
									<RouterLink
										to="/"
										className={cn(
											// Spacing
											SPACING.PADDING.sm,
											// Colors
											"text-muted-foreground",
											// States
											"hover:text-accent active:text-accent transition-colors",
										)}
										aria-label="Search"
									>
										{/* Match footer icon scale on mobile (16px). */}
										<Search className={SIZING.ICON.sm} />
									</RouterLink>

									{/* Mobile menu icon button - remove ghost background and use footer-like text hover states. */}
									<Button
										variant="link"
										size={null}
										type="button"
										onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
										className={cn(
											// Spacing
											SPACING.PADDING.sm,
											// Colors
											"text-muted-foreground",
										)}
										aria-label="Toggle menu"
									>
										{mobileMenuOpen ? (
											<X className={SIZING.ICON.sm} />
										) : (
											<Menu className={SIZING.ICON.sm} />
										)}
									</Button>
								</Div>
							</Div>
						</nav>
					</header>
				</Glass>

				{/* Mobile Navigation Dropdown
				    Positioned absolutely below the pill so the header height never changes.
				    AnimatePresence drives the slide-in / slide-out transition. */}
				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, y: -8, scale: 0.97 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -8, scale: 0.97 }}
							transition={MOTION.transition.base}
							// Float directly below the pill without pushing page content
							className="absolute top-full left-0 right-0 mt-2 md:hidden"
						>
							<Glass
								variant="panel"
								className={cn(
									// Effects
									"backdrop-blur-sm rounded-2xl",
									// Colors — match the main pill
									"bg-white/40 dark:bg-black/30",
									// Shadows
									"shadow-lg shadow-black/5 dark:shadow-black/20",
									// Border
									"border border-white/20 dark:border-white/10",
								)}
							>
								<nav>
									<Div
										className={cn(
											// Layout
											"flex flex-col",
											// Spacing — horizontal padding + vertical padding + gap between items
											"px-4 py-4",
											SPACING.GAP.md,
										)}
									>
										{navigationItems.map((item) => renderNavLink(item, true))}
										<Button
											variant="ghost"
											type="button"
											onClick={toggleTheme}
											className={cn(
												// Layout
												"flex items-center",
												// Spacing
												SPACING.GAP.sm,
												// Colors
												"text-muted-foreground",
												// States
												"hover:text-accent active:text-accent transition-colors",
												// Typography
												TYPOGRAPHY.COMBINATIONS.navLink,
											)}
										>
											{/* Mobile theme icon - align with footer icon baseline size (16px). */}
											<ThemeIcon className={SIZING.ICON.sm} />
											<Span>{themeLabel}</Span>
										</Button>
									</Div>
								</nav>
							</Glass>
						</motion.div>
					)}
				</AnimatePresence>
			</Div>
		</Div>
	);
};
