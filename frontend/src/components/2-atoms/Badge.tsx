import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { TYPOGRAPHY } from "../1-ions/typography";

/**
 * Badge Component
 *
 * Small status indicators and labels.
 * Based on shadcn/ui Badge with SkillVector customizations.
 * Uses rounded-md instead of rounded-full for consistency.
 */

/**
 * Badge variants
 * Each variant serves a different semantic purpose:
 * - default: Primary color badge for emphasis
 * - secondary: Neutral badge for secondary information
 * - destructive: Red badge for errors or warnings
 * - outline: Subtle outlined badge for less emphasis
 */
const badgeVariants = cva(
	// Base styles - shared by all variants (12px, medium weight)
	`inline-flex items-center justify-center ${BORDERS.RADIUS.md} border px-2 py-0.5 ${TYPOGRAPHY.COMBINATIONS.badge} w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden`,
	{
		variants: {
			variant: {
				// Primary badge - bold and prominent
				default:
					"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",

				// Secondary badge - neutral and subtle
				secondary:
					"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",

				// Destructive badge - for errors and warnings
				destructive:
					"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",

				// Outline badge - minimal and unobtrusive
				outline:
					"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const Badge = ({
	className,
	variant,
	asChild = false,
	...props
}: ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) => {
	// Use Slot for polymorphic behavior when asChild is true
	const Component = asChild ? Slot : "span";

	// Get variant styles and combine with custom classes
	const combinedClassName = cn(badgeVariants({ variant }), className);

	return (
		<Component data-slot="badge" className={combinedClassName} {...props} />
	);
};

export { Badge, badgeVariants };
