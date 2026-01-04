import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type DivVariant = "default" | "flex" | "center" | "code" | "spacer";

interface DivProps extends ComponentProps<"div"> {
	variant?: DivVariant;
	/** When true, constrains width and centers element (defaults to `max-w-2xl mx-auto`) */
	constrain?: boolean;
	maxWidthClass?: string;
}

const variantClasses: Record<DivVariant, string> = {
	default: "",
	flex: "flex gap-4 items-start",
	center: "flex justify-center items-center",
	code: "bg-muted/50 rounded-lg p-4",
	spacer: "space-y-4",
};

function Div({
	className,
	variant = "default",
	constrain = false,
	maxWidthClass,
	...props
}: DivProps) {
	const constraintClass = constrain
		? (maxWidthClass ?? "max-w-2xl mx-auto")
		: "";
	return (
		<div
			className={cn(variantClasses[variant], constraintClass, className)}
			{...props}
		/>
	);
}

export { Div, type DivProps, type DivVariant };
