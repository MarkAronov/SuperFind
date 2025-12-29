import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type GridVariant = "features" | "cards" | "responsive";

interface GridProps extends ComponentProps<"ul"> {
	variant?: GridVariant;
	as?: "ul" | "div";
}

const variantClasses: Record<GridVariant, string> = {
	features: "grid sm:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-12",
	cards: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-16",
	responsive: "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12",
};

function Grid({ className, variant = "features", ...props }: GridProps) {
	return <ul className={cn(variantClasses[variant], className)} {...props} />;
}

export { Grid, type GridProps, type GridVariant };
