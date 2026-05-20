import { cn } from "@/lib/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import "./Avatar.css";
import type { AvatarProps } from "./Avatar.types";

/**
 * Avatar Component
 *
 * User profile picture with shape variants.
 * Wraps shadcn/ui Avatar with SkillVector-specific customizations.
 */

/**
 * Variant styles
 * - default: Standard circular avatar (most common)
 * - nonagon: 9-sided polygon matching the site logo (unique!)
 */

const Avatar = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Root>,
	AvatarProps
>(({ className, variant = "default", ...props }, ref) => {
	// Apply nonagon styling if requested
	const variantClassName =
		variant === "nonagon" ? "avatar-nonagon rounded-none" : "";

	// Combine variant styling with custom classes
	const combinedClassName = cn(
		// Base Radix avatar styles — circular crop, overflow hidden
		"relative flex size-8 shrink-0 overflow-hidden rounded-full",
		variantClassName,
		className,
	);

	return (
		<AvatarPrimitive.Root
			ref={ref}
			data-slot="avatar"
			className={combinedClassName}
			{...props}
		/>
	);
});

Avatar.displayName = "Avatar";

// Wrap Radix Image primitive — renders the actual image, falls back to AvatarFallback on error
const AvatarImage = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Image>,
	React.ComponentProps<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image
		ref={ref}
		data-slot="avatar-image"
		className={cn("aspect-square size-full", className)}
		{...props}
	/>
));
AvatarImage.displayName = "AvatarImage";

// Wrap Radix Fallback primitive — shown when image fails to load or hasn't loaded yet
const AvatarFallback = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Fallback>,
	React.ComponentProps<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		data-slot="avatar-fallback"
		className={cn(
			"bg-muted flex size-full items-center justify-center rounded-full",
			className,
		)}
		{...props}
	/>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarFallback, AvatarImage, type AvatarProps };
