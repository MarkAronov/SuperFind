import { Heading } from "../2-atoms/Heading";
import { Section } from "../2-atoms/Section";
import { Text } from "../2-atoms/Text";
import { Hero } from "../3-molecules/Hero";
import { Grid } from "../4-organisms/Grid";
import { PageTemplate } from "../5-templates/PageTemplate";
import { capabilities, missionContent } from "./AboutUsPage.data.tsx";

export const AboutPage = () => {
	return (
		<PageTemplate title="About">
			{/* Hero Section */}
			<Hero title="About" brand="Us" subtitle="" />

			{/* Mission Section */}
			<Section>
				<Grid
					items={[
						{
							title: missionContent.title,
							customContent: (
								<>
									<Heading variant="section" className="mb-4">
										{missionContent.title}
									</Heading>
									{missionContent.paragraphs.map((paragraph, index) => (
										<Text
											key={paragraph.substring(0, 50)}
											variant="body"
											className={
												index < missionContent.paragraphs.length - 1
													? "mb-4"
													: ""
											}
										>
											{paragraph}
										</Text>
									))}
								</>
							),
						},
					]}
					maxColumns={1}
				/>
			</Section>

			<Section>
				<Grid
					items={capabilities}
					maxColumns={2}
					gap="lg"
					centerIncompleteRows
				/>
			</Section>
		</PageTemplate>
	);
};
