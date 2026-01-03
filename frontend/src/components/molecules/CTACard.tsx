import { ActionButton } from "../atoms/ActionButton";
import { Card, CardContent } from "../atoms/Card";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";

interface CTAAction {
	label: string;
	onClick?: () => void;
	href?: string;
	to?: string;
	variant?: "primary" | "outline";
	external?: boolean;
	ariaLabel?: string;
}

interface CTACardProps {
	title: string;
	description: string;
	primaryAction?: CTAAction;
	secondaryAction?: CTAAction;
	className?: string;
	"aria-label"?: string;
}

export const CTACard = ({
	title,
	description,
	primaryAction,
	secondaryAction,
	className = "",
	"aria-label": ariaLabel,
}: CTACardProps) => {
	return (
		<Card variant="hover" aria-label={ariaLabel || title} className={className}>
			<CardContent centered>
				<Heading variant="section" className="mb-4">
					{title}
				</Heading>
				<Text variant="lead" className="mb-6">
					{description}
				</Text>
				{(primaryAction || secondaryAction) && (
					<div className="flex gap-4 justify-center flex-wrap">
						{primaryAction && (
							<ActionButton
								onClick={primaryAction.onClick}
								href={primaryAction.href}
								to={primaryAction.to}
								variant={primaryAction.variant || "primary"}
								external={primaryAction.external}
								aria-label={primaryAction.ariaLabel}
							>
								{primaryAction.label}
							</ActionButton>
						)}
						{secondaryAction && (
							<ActionButton
								onClick={secondaryAction.onClick}
								href={secondaryAction.href}
								to={secondaryAction.to}
								variant={secondaryAction.variant || "outline"}
								external={secondaryAction.external}
								aria-label={secondaryAction.ariaLabel}
							>
								{secondaryAction.label}
							</ActionButton>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};
