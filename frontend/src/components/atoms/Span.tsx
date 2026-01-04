import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SpanVariant = "default" | "code" | "badge" | "tag" | "muted";

interface SpanProps extends ComponentProps<"span"> {
	variant?: SpanVariant;
}

const variantClasses: Record<SpanVariant, string> = {
	default: "",
	code: "font-mono text-xs lg:text-sm",
	badge:
		"px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded text-sm font-medium",
	tag: "px-2 py-1 bg-muted/50 rounded text-xs",
	muted: "text-muted-foreground",
};

function Span({ className, variant = "default", ...props }: SpanProps) {
	return <span className={cn(variantClasses[variant], className)} {...props} />;
}

export { Span, type SpanProps, type SpanVariant };
