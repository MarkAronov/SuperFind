import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { List, ListItem } from "../atoms/List";
import { Text } from "../atoms/Text";

interface FeatureListProps {
	features: string[];
	icon?: ReactNode;
	iconColor?: string;
	variant?: "spaced" | "default";
	className?: string;
}

export const FeatureList = ({
	features,
	icon,
	iconColor = "text-primary",
	variant = "spaced",
	className = "",
}: FeatureListProps) => {
	const IconComponent = icon || (
		<Check className={`h-5 w-5 ${iconColor} shrink-0 mt-0.5`} />
	);

	return (
		<List variant={variant} className={className}>
			{features.map((feature) => (
				<ListItem key={feature} variant="bullet">
					{IconComponent}
					<Text>{feature}</Text>
				</ListItem>
			))}
		</List>
	);
};
