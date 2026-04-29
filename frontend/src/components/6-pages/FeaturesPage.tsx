import { ArrowRight } from "lucide-react";
import { SIZING } from "../1-ions/sizing";
import { Section } from "../2-atoms/Section";
import { CTACard } from "../3-molecules/CTACard";
import { Hero } from "../3-molecules/Hero";
import { Grid } from "../4-organisms/Grid";
import { PageTemplate } from "../5-templates/PageTemplate";
import { features } from "./FeaturesPage.data.tsx";

export const FeaturesPage = () => {
	return (
		<PageTemplate title="Features">
			{/* Hero Section */}
			<Hero
				title=""
				brand="Features"
				subtitle="Leverage cutting-edge AI and vector search technology to find the perfect candidates faster than ever."
			/>

			{/* Features Grid */}
			<Section>
				<Grid items={features} maxColumns={2} centerIncompleteRows />
			</Section>

			<CTACard
				title="Ready to get started?"
				description="Try SkillVector today and experience the future of talent search."
				primaryAction={{
					label: (
						<>
							{/* CTA icon - 16px size */}
							Try Search <ArrowRight className={SIZING.ICON.sm} />
						</>
					) as unknown as string,
					to: "/search",
					ariaLabel: "Try Search",
				}}
				secondaryAction={{
					label: "View API Docs",
					to: "/documentation#api",
					variant: "outline",
					ariaLabel: "View API Docs",
				}}
			/>
		</PageTemplate>
	);
};
