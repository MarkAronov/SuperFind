import { cn } from "@/lib/utils";
import { SPACING } from "../1-ions/spacing";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Link } from "../2-atoms/Link";
import { Section } from "../2-atoms/Section";
import { Text } from "../2-atoms/Text";
import { Hero } from "../3-molecules/Hero";
import { Grid } from "../4-organisms/Grid";
import { PageTemplate } from "../5-templates/PageTemplate";
import { ctaContent, steps } from "./HowItWorksPage.data.tsx";

export const HowItWorksPage = () => {
	return (
		<PageTemplate title="How It Works">
			{/* Hero Section */}
			<Hero title="How It" brand="Works" subtitle="" />

			{/* Process Steps */}
			<Section>
				<Grid items={steps} maxColumns={1} centerIncompleteRows />
			</Section>

			{/* Call to Action */}
			<Section>
				<Grid
					items={[
						{
							title: ctaContent.title,
							centered: true,
							customContent: (
								<>
									<Heading variant="section" className="mb-4">
										{ctaContent.title}
									</Heading>
									<Text variant="lead" className="mb-6">
										{ctaContent.description}
									</Text>
									<Div
										className={cn(
											// Layout
											"flex justify-center flex-wrap",
											// Spacing
											SPACING.GAP.md,
										)}
									>
										<Button
											asChild
											aria-label={ctaContent.primaryButton.ariaLabel}
										>
											<Link to={ctaContent.primaryButton.to}>
												{ctaContent.primaryButton.label}
											</Link>
										</Button>
										<Button
											asChild
											variant={ctaContent.secondaryButton.variant}
											aria-label={ctaContent.secondaryButton.ariaLabel}
										>
											<Link to={ctaContent.secondaryButton.to}>
												{ctaContent.secondaryButton.label}
											</Link>
										</Button>
									</Div>
								</>
							),
						},
					]}
					maxColumns={1}
				/>
			</Section>
		</PageTemplate>
	);
};
