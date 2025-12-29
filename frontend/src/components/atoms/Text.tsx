import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type TextVariant =
	| "body"
	| "lead"
	| "muted"
	| "small"
	| "caption"
	| "heading"
	| "subheading";

interface TextProps extends ComponentProps<"p"> {
	variant?: TextVariant;
}

const variantClasses: Record<TextVariant, string> = {
	body: "text-sm lg:text-base text-foreground leading-relaxed",
	lead: "text-base lg:text-xl text-muted-foreground leading-relaxed",
	muted: "text-sm lg:text-base text-muted-foreground leading-relaxed",
	small: "text-xs lg:text-sm text-muted-foreground leading-relaxed",
	caption: "text-xs text-muted-foreground",
	heading: "text-2xl lg:text-3xl font-bold",
	subheading: "text-base lg:text-lg font-semibold",
};

function Text({ className, variant = "body", ...props }: TextProps) {
	return <p className={cn(variantClasses[variant], className)} {...props} />;
}

export { Text, type TextProps, type TextVariant };
