import type * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./Card";

interface CardSectionProps extends React.ComponentProps<typeof Card> {
	children: React.ReactNode;
}

function CardSection({ className, children, ...props }: CardSectionProps) {
	return (
		<Card
			className={cn("hover:shadow-lg transition-shadow", className)}
			{...props}
		>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

export { CardSection, type CardSectionProps };
