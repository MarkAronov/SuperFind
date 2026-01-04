import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface ActionButtonProps {
	variant?: "primary" | "outline";
	children: ReactNode;
	href?: string;
	to?: string;
	onClick?: () => void;
	className?: string;
	external?: boolean;
	type?: "button" | "submit";
	disabled?: boolean;
	ariaLabel?: string;
}

const baseStyles =
	"inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-lg transition-colors font-medium text-sm lg:text-base max-w-xs justify-center";

const variantStyles = {
	primary: "bg-primary text-white hover:bg-primary/90 disabled:opacity-50",
	outline: "border border-border hover:bg-white/10",
};

export function ActionButton({
	variant = "primary",
	children,
	href,
	to,
	onClick,
	className = "",
	external = false,
	type = "button",
	disabled = false,
	ariaLabel,
}: ActionButtonProps) {
	const styles = `${baseStyles} ${variantStyles[variant]} ${className}`;

	// External link
	if (href && external) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={styles}
				aria-label={ariaLabel}
			>
				{children}
			</a>
		);
	}

	// Regular link
	if (href) {
		return (
			<a href={href} className={styles} aria-label={ariaLabel}>
				{children}
			</a>
		);
	}

	// Router link
	if (to) {
		return (
			<Link to={to} className={styles} aria-label={ariaLabel}>
				{children}
			</Link>
		);
	}

	// Button
	return (
		<button
			type={type}
			onClick={onClick}
			className={styles}
			disabled={disabled}
			aria-label={ariaLabel}
		>
			{children}
		</button>
	);
}
