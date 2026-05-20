import * as React from "react";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";

/**
 * Input Component
 *
 * Text input field for forms and user data entry.
 * Wraps native <input> directly — no shadcn intermediary.
 *
 * Features:
 * - Pinkish accent border and ring on focus (overrides default via BORDERS.INTERACTIVE.inputFocus)
 * - Consistent border and focus states
 * - Disabled state styling
 * - Error state with aria-invalid support
 * - File input variant support
 *
 * Usage:
 * ```tsx
 * <Input type="text" placeholder="Enter name" />
 * <Input type="email" aria-invalid={hasError} />
 * ```
 */

export const Input = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
	return (
		<input
			ref={ref}
			type={type}
			data-slot="input"
			className={cn(
				// Base layout and sizing — full width, standard height (36px)
				"h-9 w-full min-w-0",
				// Background and border
				"border-input rounded-md border bg-transparent dark:bg-input/30",
				// Typography and spacing
				"px-3 py-1 text-base md:text-sm",
				// Transitions
				"shadow-xs transition-[color,box-shadow] outline-none",
				// Placeholder and selection colors
				"placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
				// File input styles
				"file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
				// Disabled state
				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
				// Focus styles — accent border (overrides default ring with ion token)
				BORDERS.INTERACTIVE.inputFocus,
				// Error state styles
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				className,
			)}
			{...props}
		/>
	);
});

Input.displayName = "Input";
