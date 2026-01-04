import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingVariant = "hero" | "section" | "subsection" | "card";

interface HeadingProps extends ComponentProps<HeadingLevel> {
	as?: HeadingLevel;
	variant?: HeadingVariant;
}

const variantClasses: Record<HeadingVariant, string> = {
	hero: "text-3xl lg:text-5xl font-bold mb-4",
	section: "text-2xl lg:text-3xl font-bold mb-4 lg:mb-6",
	subsection: "text-xl lg:text-2xl font-bold mb-3 lg:mb-4",
	card: "text-xl font-semibold mb-2",
};

function Heading({
	as: Component = "h1",
	className,
	variant,
	...props
}: HeadingProps) {
	const variantClass = variant ? variantClasses[variant] : "";

	return <Component className={cn(variantClass, className)} {...props} />;
}

export { Heading, type HeadingProps, type HeadingLevel, type HeadingVariant };
