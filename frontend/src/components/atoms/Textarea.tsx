import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends ComponentProps<"textarea"> {}

function Textarea({ className, ...props }: TextareaProps) {
	return (
		<textarea
			className={cn(
				"w-full px-4 py-2 border border-border bg-background rounded-lg",
				"focus:ring-2 focus:ring-primary focus:border-transparent",
				"min-h-20 resize-y",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea, type TextareaProps };
