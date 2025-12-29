import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SectionVariant = "default" | "hero" | "spaced" | "compact";

interface SectionProps extends ComponentProps<"section"> {
	variant?: SectionVariant;
}

const variantClasses: Record<SectionVariant, string> = {
	default: "",
	hero: "text-center mb-16",
	spaced: "mb-8 lg:mb-12",
	compact: "mb-4 lg:mb-6",
};

function Section({ className, variant = "default", ...props }: SectionProps) {
	return (
		<section className={cn(variantClasses[variant], className)} {...props} />
	);
}

export { Section, type SectionProps, type SectionVariant };
