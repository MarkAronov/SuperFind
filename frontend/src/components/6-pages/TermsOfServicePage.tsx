import { Section } from "../2-atoms/Section";
import { Hero } from "../3-molecules/Hero";
import { Grid } from "../4-organisms/Grid";
import { PageTemplate } from "../5-templates/PageTemplate";
import { termsSections } from "./TermsOfServicePage.data.tsx";

export const TermsPage = () => {
	return (
		<PageTemplate title="Terms of Service">
			{/* Hero Section */}
			<Hero title="Terms" brand="of Service" subtitle="" />

			{/* Terms Sections */}
			<Section>
				<Grid items={termsSections} maxColumns={1} />
			</Section>
		</PageTemplate>
	);
};
