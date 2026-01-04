import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Glass } from "./Glass";

type CardVariant = "default" | "hover" | "feature";

interface CardProps extends ComponentProps<"div"> {
	variant?: CardVariant;
	/** Pass `constrain` to center and limit max width via Glass */
	constrain?: boolean;
	/** Make the card stretch to fill available height (useful in grids) */
	fill?: boolean;
	/** Apply a min-height class to standardize heights (e.g., 'min-h-[160px]') */
	minHeightClass?: string;
	/** Optional width constraint override to pass to Glass */
	maxWidthClass?: string;
}

const variantClasses: Record<CardVariant, string> = {
	default: "",
	hover: "",
	feature: "",
};

function Card({
	className,
	variant = "default",
	children,
	fill = false,
	minHeightClass,
	...props
}: CardProps) {
	const fillClass = fill ? "h-full" : "";
	const minHClass = minHeightClass ?? "";

	return (
		<Glass
			variant="card"
			data-slot="card"
			className={cn(
				"text-card-foreground flex flex-col",
				"border-2 border-white/20 dark:border-white/10",
				// Main depth shadows
				"shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.08),0_20px_40px_rgba(0,0,0,0.12)]",
				"dark:shadow-[0_2px_4px_rgba(0,0,0,0.3),0_8px_16px_rgba(0,0,0,0.4),0_20px_40px_rgba(0,0,0,0.5)]",
				"relative overflow-hidden z-10",
				// Side edges for thickness
				"*:relative *:z-10",
				"transform-gpu",
				variantClasses[variant],
				fillClass,
				minHClass,
				className,
			)}
			style={{
				boxShadow: `
					0 2px 4px rgba(0, 0, 0, 0.05),
					0 8px 16px rgba(0, 0, 0, 0.08),
					0 20px 40px rgba(0, 0, 0, 0.12),
					inset 0 1px 0 rgba(255, 255, 255, 0.3),
					inset 0 -1px 0 rgba(0, 0, 0, 0.15),
					inset 2px 0 0 rgba(255, 255, 255, 0.1),
					inset -2px 0 0 rgba(0, 0, 0, 0.1)
				`,
			}}
			{...props}
		>
			{children}
		</Glass>
	);
}

interface CardHeaderProps extends ComponentProps<"div"> {
	icon?: ReactNode;
	iconColor?: string;
}

function CardHeader({
	className,
	icon,
	iconColor = "text-primary",
	children,
	...props
}: CardHeaderProps) {
	if (icon) {
		return (
			<div data-slot="card-header" className={cn("p-6", className)} {...props}>
				<div className="flex flex-col items-center text-center gap-4">
					<div className={cn("shrink-0", iconColor)}>{icon}</div>
					<div className="w-full">{children}</div>
				</div>
			</div>
		);
	}

	return (
		<div
			data-slot="card-header"
			className={cn("px-6 pt-6", className)}
			{...props}
		>
			{children}
		</div>
	);
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn("leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
	return (
		<div data-slot="card-action" className={cn("mt-2", className)} {...props} />
	);
}

function CardContent({
	className,
	centered = false,
	...props
}: ComponentProps<"div"> & { centered?: boolean }) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-6 pb-6", centered && "text-center", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center px-6 pb-6", className)}
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
	type CardProps,
	type CardVariant,
	type CardHeaderProps,
};
