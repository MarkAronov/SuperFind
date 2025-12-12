import { Link } from "@tanstack/react-router";
import { Menu, Monitor, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { SOCIAL_LINKS } from "@/constants/site";
import { useTheme } from "../../hooks/useTheme";
import { Glass } from "../atoms/Glass";
import { Logo } from "../atoms/Logo";

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();

	return (
		<Glass
			asChild
			variant="panel"
			className="w-full sticky top-0 z-50 backdrop-blur-sm bg-white/40 dark:bg-black/30 rounded-none"
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
							<Link
								to="/"
								className="text-foreground/90 hover:text-primary transition-colors font-medium text-sm lg:text-base"
							>
								Search
							</Link>
							<Link
								to="/features"
								className="text-foreground/90 hover:text-primary transition-colors font-medium text-sm lg:text-base"
							>
								Features
							</Link>
							<Link
								to="/api"
								className="text-foreground/90 hover:text-primary transition-colors font-medium"
							>
								API
							</Link>
							<Link
								to="/sdk"
								className="text-foreground/90 hover:text-primary transition-colors font-medium"
							>
								SDK
							</Link>
							<a
								href={SOCIAL_LINKS.github}
								target="_blank"
								rel="noopener noreferrer"
								className="text-foreground/90 hover:text-primary transition-colors font-medium"
							>
								GitHub
							</a>
						</div>{" "}
						{/* Theme Toggle */}
						<div className="hidden md:flex items-center">
							<button
								type="button"
								onClick={toggleTheme}
								className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
								aria-label={`Current theme: ${theme}. Click to toggle.`}
								title={`Theme: ${theme}`}
							>
								{theme === "system" && <Monitor className="h-5 w-5" />}
								{theme === "light" && <Sun className="h-5 w-5" />}
								{theme === "dark" && <Moon className="h-5 w-5" />}
							</button>
						</div>
						{/* Mobile Menu Button */}
						<button
							type="button"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="md:hidden p-2 text-muted-foreground"
							aria-label="Toggle menu"
						>
							{mobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>

					{/* Mobile Navigation */}
					{mobileMenuOpen && (
						<div className="md:hidden py-4">
							<div className="flex flex-col gap-4">
								<Link
									to="/"
									className="text-muted-foreground hover:text-primary transition-colors font-medium"
									onClick={() => setMobileMenuOpen(false)}
								>
									Search
								</Link>
								<Link
									to="/features"
									className="text-muted-foreground hover:text-primary transition-colors font-medium"
									onClick={() => setMobileMenuOpen(false)}
								>
									Features
								</Link>
								<Link
									to="/api"
									className="text-muted-foreground hover:text-primary transition-colors font-medium"
									onClick={() => setMobileMenuOpen(false)}
								>
									API
								</Link>
								<Link
									to="/sdk"
									className="text-muted-foreground hover:text-primary transition-colors font-medium"
									onClick={() => setMobileMenuOpen(false)}
								>
									SDK
								</Link>
								<a
									href={SOCIAL_LINKS.github}
									target="_blank"
									rel="noopener noreferrer"
									className="text-muted-foreground hover:text-primary transition-colors font-medium"
								>
									GitHub
								</a>
								<button
									type="button"
									onClick={toggleTheme}
									className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
								>
									{theme === "system" && (
										<>
											<Monitor className="h-5 w-5" />
											<span>System Theme</span>
										</>
									)}
									{theme === "light" && (
										<>
											<Sun className="h-5 w-5" />
											<span>Light Theme</span>
										</>
									)}
									{theme === "dark" && (
										<>
											<Moon className="h-5 w-5" />
											<span>Dark Theme</span>
										</>
									)}
								</button>
							</div>
						</div>
					)}
				</nav>
			</header>
		</Glass>
	);
}
