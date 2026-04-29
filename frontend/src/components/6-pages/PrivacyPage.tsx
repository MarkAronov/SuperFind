import { Section } from "../2-atoms/Section";
import { Hero } from "../3-molecules/Hero";
import { Grid } from "../4-organisms/Grid";
import { PageTemplate } from "../5-templates/PageTemplate";
import { privacySections } from "./PrivacyPage.data.tsx";

export const PrivacyPage = () => {
	return (
		<PageTemplate title="Privacy Policy">
			{/* Hero Section */}
			<Hero
				title="Privacy"
				brand="Policy"
				subtitle="How we collect, use, and protect your information"
			/>

			{/* Privacy Sections */}
			<Section>
				<Grid items={privacySections} maxColumns={1} />
			</Section>
		</PageTemplate>
	);
};
