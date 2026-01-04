import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface PageContainerProps extends ComponentProps<"div"> {
	/** Controls the maximum width of the container. Default is 'lg' (max-w-5xl) */
	maxWidth?: MaxWidth;
}

const maxWidthClasses: Record<MaxWidth, string> = {
	sm: "max-w-3xl",
	md: "max-w-4xl",
	lg: "max-w-5xl",
	xl: "max-w-6xl",
	"2xl": "max-w-7xl",
	full: "w-full",
};

function PageContainer({
	className,
	maxWidth = "lg",
	...props
}: PageContainerProps) {
	const widthClass = maxWidthClasses[maxWidth];
	return <div className={cn(widthClass, "mx-auto", className)} {...props} />;
}

export { PageContainer, type PageContainerProps };
