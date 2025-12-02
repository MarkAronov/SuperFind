import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
	asChild?: boolean;
	variant?: "card" | "panel" | "default" | "pronounced";
}

export const Glass = ({
	className = "",
	asChild = false,
	variant = "default",
	children,
	...props
}: GlassProps) => {
	const Comp = asChild ? Slot : "div";
	const base = "glass";
	const variantClass =
		variant === "card"
			? "glass-card"
			: variant === "pronounced"
				? "glass-pronounced"
				: "";

	return (
		<Comp className={cn(base, variantClass, className)} {...props}>
			{children}
		</Comp>
	);
};

export default Glass;
