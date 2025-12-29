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
	hover: "hover:shadow-lg transition-shadow",
	feature: "hover:shadow-lg transition-shadow",
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
				"text-card-foreground flex flex-col border",
				variantClasses[variant],
				fillClass,
				minHClass,
				className,
			)}
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
			<div
				data-slot="card-header"
				className={cn("px-6 pt-6", className)}
				{...props}
			>
				<div className="flex gap-4 items-start">
					<div className={cn("shrink-0", iconColor)}>{icon}</div>
					<div className="flex-1 min-w-0">{children}</div>
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
