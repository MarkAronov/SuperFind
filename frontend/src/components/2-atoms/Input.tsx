import * as React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";

/**
 * Input Component
 *
 * Text input field for forms and user data entry.
 * Wraps shadcn/ui Input with SkillVector customizations.
 *
 * Features:
 * - Pinkish accent border and ring on focus (overrides default)
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
	React.ComponentProps<typeof ShadcnInput>
>(({ className, ...props }, ref) => {
	return (
		<ShadcnInput
			ref={ref}
			className={cn(
				// Use ion token: accent border on focus, suppress ring glow (clean look)
				BORDERS.INTERACTIVE.inputFocus,
				className,
			)}
			{...props}
		/>
	);
});

Input.displayName = "Input";
