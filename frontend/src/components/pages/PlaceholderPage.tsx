import { ArrowLeft } from "lucide-react";
import { ActionButton } from "../atoms/ActionButton";
import { Card, CardContent } from "../atoms/Card";
import { Glass } from "../atoms/Glass";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";
import { PageTemplate } from "../templates/PageTemplate";

interface PlaceholderPageProps {
	title: string;
	description?: string;
}

export const PlaceholderPage = ({
	title,
	description,
}: PlaceholderPageProps) => {
	return (
		<PageTemplate title={title}>
			<section className="py-12 lg:py-16">
				<Glass
					variant="pronounced"
					constrain
					maxWidthClass="max-w-3xl"
					className="text-center"
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
			</section>

			<section className="py-8 lg:py-12">
				<Card variant="hover" aria-label="Under Construction">
					<CardContent centered>
						<Text className="mb-6">
							This page is currently under construction. Check back soon for
							updates!
						</Text>
						<ActionButton to="/" aria-label="Back to Search">
							<ArrowLeft className="h-4 w-4" />
							Back to Search
						</ActionButton>
					</CardContent>
				</Card>
			</section>
		</PageTemplate>
	);
};
