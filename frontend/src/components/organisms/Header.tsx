import { Link } from "@tanstack/react-router";
import { Menu, Monitor, Moon, Search, Sun, X } from "lucide-react";
import { useState } from "react";
import { SOCIAL_LINKS } from "@/constants/site";
import { useTheme } from "../../hooks/useTheme";
import { Glass } from "../atoms/Glass";
import { Logo } from "../atoms/Logo";

const navigationItems = [
	{ to: "/", label: "Search" },
	{ to: "/features", label: "Features" },
	{ to: "/api", label: "API" },
	{ to: "/sdk", label: "SDK" },
	{ href: SOCIAL_LINKS.github, label: "GitHub", external: true },
];

const themeIcons = {
	system: Monitor,
	light: Sun,
	dark: Moon,
};

const themeLabels = {
	system: "System Theme",
	light: "Light Theme",
	dark: "Dark Theme",
};

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();

	const ThemeIcon = themeIcons[theme];
	const themeLabel = themeLabels[theme];

	const renderNavLink = (
		item: (typeof navigationItems)[0],
		isMobile = false,
	) => {
		const className = isMobile
			? "text-muted-foreground hover:text-primary transition-colors font-medium"
			: "text-foreground/90 hover:text-primary transition-colors font-medium text-sm lg:text-base";

		const onClick = isMobile ? () => setMobileMenuOpen(false) : undefined;

		if (item.external) {
			return (
				<a
					key={item.label}
					href={item.href}
					target="_blank"
					rel="noopener noreferrer"
					className={className}
					onClick={onClick}
				>
					{item.label}
				</a>
			);
		}

		return (
			<Link
				key={item.label}
				to={item.to}
				className={className}
				onClick={onClick}
			>
				{item.label}
			</Link>
		);
	};

	return (
		<div className="w-full sticky top-0 z-50 pointer-events-none">
			<div className="mx-auto pointer-events-auto w-[calc(100%-2rem)] max-w-5xl mt-3">
				<Glass
					asChild
					variant="panel"
					className="backdrop-blur-sm bg-white/40 dark:bg-black/30 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20"
				>
					<header>
						<nav className="container mx-auto px-3 lg:px-4">
							<div className="flex items-center justify-between h-14 lg:h-16">
								{/* Logo and Brand */}
								<Link
									to="/"
									className="flex items-center gap-3 hover:opacity-80 transition-opacity"
								>
									<Logo size="md" />
									<span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
										SkillVector
									</span>
								</Link>

								{/* Desktop Navigation */}
								<div className="hidden md:flex items-center gap-4 lg:gap-6">
									{navigationItems.map((item) => renderNavLink(item))}
								</div>

								{/* Theme Toggle */}
								<div className="hidden md:flex items-center">
									<button
										type="button"
										onClick={toggleTheme}
										className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
										aria-label={`Current theme: ${theme}. Click to toggle.`}
										title={`Theme: ${theme}`}
									>
										<ThemeIcon className="h-5 w-5" />
									</button>
								</div>

								{/* Mobile Search and Menu */}
								<div className="md:hidden flex items-center gap-2">
									<Link
										to="/"
										className="p-2 text-muted-foreground hover:text-primary transition-colors"
										aria-label="Search"
									>
										<Search className="h-6 w-6" />
									</Link>
									<button
										type="button"
										onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
										className="p-2 text-muted-foreground"
										aria-label="Toggle menu"
									>
										{mobileMenuOpen ? (
											<X className="h-6 w-6" />
										) : (
											<Menu className="h-6 w-6" />
										)}
									</button>
								</div>
							</div>

							{/* Mobile Navigation */}
							{mobileMenuOpen && (
								<div className="md:hidden py-4">
									<div className="flex flex-col gap-4">
										{navigationItems.map((item) => renderNavLink(item, true))}
										<button
											type="button"
											onClick={toggleTheme}
											className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
										>
											<ThemeIcon className="h-5 w-5" />
											<span>{themeLabel}</span>
										</button>
									</div>
								</div>
							)}
						</nav>
					</header>
				</Glass>
			</div>
		</div>
	);
}
