import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * Textarea Component
 *
 * Multi-line text input for longer form content.
 * Wraps native <textarea> directly — no shadcn intermediary.
 *
 * Features:
 * - Pinkish accent border on focus (matches Input theming via !important override)
 * - Automatic resize disabled by default (add resize class to enable)
 * - Consistent border and focus states with Input component
 * - Disabled state styling
 * - Error state with aria-invalid support
 * - Minimum height of 64px for comfortable input (field-sizing-content auto-grows)
 *
 * Usage:
 * ```tsx
 * <Textarea placeholder="Enter your message" rows={5} />
 * <Textarea aria-invalid={hasError} className="resize" />
 * ```
 */

export const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
	return (
		<textarea
			ref={ref}
			data-slot="textarea"
			className={cn(
				// Layout — full width, auto-grows with content (field-sizing-content)
				"flex field-sizing-content min-h-16 w-full",
				// Background and border
				"border-input rounded-md border bg-transparent dark:bg-input/30",
				// Spacing and typography
				"px-3 py-2 text-base md:text-sm",
				// Transitions
				"shadow-xs transition-[color,box-shadow] outline-none",
				// Placeholder
				"placeholder:text-muted-foreground",
				// Disabled state
				"disabled:cursor-not-allowed disabled:opacity-50",
				// Default focus styles (overridden below with accent color)
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				// Error state
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				// Accent override — pink border on focus, no ring glow (matches Input)
				"focus-visible:!border-accent focus-visible:!ring-0",
				className,
			)}
			{...props}
		/>
	);
});

Textarea.displayName = "Textarea";
