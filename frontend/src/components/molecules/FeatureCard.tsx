import type { ReactNode } from "react";
import { Card } from "../atoms/Card";

interface FeatureCardProps {
	icon: ReactNode;
	title: string;
	description: string;
	iconColor?: string;
	children?: ReactNode;
	className?: string;
}

export function FeatureCard({
	icon,
	title,
	description,
	iconColor = "text-primary",
	children,
	className,
}: FeatureCardProps) {
	return (
		<Card
			aria-label={title}
			className={`p-6 hover:shadow-lg transition-shadow ${className || ""}`}
		>
			<div className="flex gap-4 items-start">
				<div className={`shrink-0 ${iconColor}`}>{icon}</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-lg lg:text-xl font-semibold mb-2">{title}</h3>
					<p className="text-sm lg:text-base text-muted-foreground">
						{description}
					</p>
					{children}
				</div>
			</div>
		</Card>
	);
}
