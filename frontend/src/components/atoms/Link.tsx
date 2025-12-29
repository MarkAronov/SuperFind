import { Link as RouterLink } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type LinkVariant = "default" | "primary" | "muted" | "underline";

interface LinkProps
	extends Omit<ComponentProps<typeof RouterLink>, "className"> {
	className?: string;
	variant?: LinkVariant;
	external?: boolean;
	href?: string;
}

const variantClasses: Record<LinkVariant, string> = {
	default: "hover:underline transition-colors",
	primary: "text-primary hover:underline transition-colors",
	muted: "text-muted-foreground hover:text-primary transition-colors",
	underline: "underline hover:text-muted-foreground/70 transition-colors",
};

function Link({
	className,
	variant = "default",
	external = false,
	href,
	...props
}: LinkProps) {
	if (external || href) {
		const children = props.children;
		return (
			<a
				href={href}
				className={cn(variantClasses[variant], className)}
				{...(external && {
					target: "_blank",
					rel: "noopener noreferrer",
				})}
			>
				{typeof children === "function"
					? children({ isActive: false, isTransitioning: false })
					: children}
			</a>
		);
	}

	return (
		<RouterLink className={cn(variantClasses[variant], className)} {...props} />
	);
}

export { Link, type LinkProps, type LinkVariant };
