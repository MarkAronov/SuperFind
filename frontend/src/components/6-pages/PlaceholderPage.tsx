import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Glassmorphism as Glass } from "../1-ions/designs/Glassmorphism";
import { SIZING } from "../1-ions/sizing";
import { Button } from "../2-atoms/Button";
import { Heading } from "../2-atoms/Heading";
import { Link } from "../2-atoms/Link";
import { Section } from "../2-atoms/Section";
import { Text } from "../2-atoms/Text";
import { Card, CardContent } from "../3-molecules/Card";
import { PageTemplate } from "../5-templates/PageTemplate";
import type { PlaceholderPageProps } from "./PlaceholderPage.types";

export const PlaceholderPage = ({
	title,
	description,
}: PlaceholderPageProps) => {
	return (
		<PageTemplate title={title}>
			<Section className="py-12 lg:py-16">
				<Glass
					variant="pronounced"
					className={cn(
						// Layout
						"text-center",
						// Spacing
						"p-8 lg:p-12",
						// Border
						"border border-white/20 dark:border-white/10",
						// Effects
						"shadow-lg",
					)}
				>
					<Heading variant="hero" className="mb-4">
						{title}
					</Heading>
					{description && (
						<Text variant="lead" className="mb-8">
							{description}
						</Text>
					)}
				</Glass>
			</Section>

			<Section className="py-8 lg:py-12">
				<Card variant="hover" aria-label="Under Construction">
					<CardContent centered>
						<Text className="mb-6">
							This page is currently under construction. Check back soon for
							updates!
						</Text>
						<Button asChild aria-label="Back to Search">
							<Link to="/search">
								<ArrowLeft className={SIZING.ICON.sm} />
								Back to Search
							</Link>
						</Button>
					</CardContent>
				</Card>
			</Section>
		</PageTemplate>
	);
};
