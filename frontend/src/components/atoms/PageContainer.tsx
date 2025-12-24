import type * as React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps extends React.ComponentProps<"div"> {}

function PageContainer({ className, ...props }: PageContainerProps) {
	return <div className={cn("max-w-5xl mx-auto", className)} {...props} />;
}

export { PageContainer, type PageContainerProps };
