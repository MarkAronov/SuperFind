import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends ComponentProps<"label"> {}

function Label({ className, children, ...props }: LabelProps) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: This is a generic label component that forwards props like htmlFor
		<label
			className={cn("block text-sm font-medium mb-2", className)}
			{...props}
		>
			{children}
		</label>
	);
}

export { Label, type LabelProps };
