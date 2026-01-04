import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "../atoms/Card";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";

interface IconCardProps {
	icon: ReactNode;
	title: string;
	description: string;
	className?: string;
	badge?: ReactNode;
	actions?: ReactNode;
	children?: ReactNode;
	"aria-label"?: string;
}

export const IconCard = ({
	icon,
	title,
	description,
	className = "",
	badge,
	actions,
	children,
	"aria-label": ariaLabel,
}: IconCardProps) => {
	return (
		<Card
			variant="hover"
			aria-label={ariaLabel || title}
			className={`h-full ${className}`}
		>
			<CardHeader icon={icon}>
				<Heading as="h3" variant="card" className="mb-2">
					{title}
				</Heading>
				{badge && <div className="mb-2">{badge}</div>}
				<Text variant="muted">{description}</Text>
				{children}
				{actions && <div className="mt-4">{actions}</div>}
			</CardHeader>
		</Card>
	);
};

export const IconCardWithContent = ({
	icon,
	title,
	description,
	className = "",
	badge,
	actions,
	children,
	"aria-label": ariaLabel,
}: IconCardProps) => {
	return (
		<Card
			variant="hover"
			aria-label={ariaLabel || title}
			className={`h-full ${className}`}
		>
			<CardContent>
				<div className="flex items-start gap-4 mb-4">
					<div className="shrink-0 text-primary">{icon}</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2 flex-wrap">
							<Heading variant="subsection">{title}</Heading>
							{badge}
						</div>
						<Text variant="small">{description}</Text>
					</div>
				</div>
				{children}
				{actions}
			</CardContent>
		</Card>
	);
};
