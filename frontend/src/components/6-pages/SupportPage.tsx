import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Link } from "../2-atoms/Link";
import { Section } from "../2-atoms/Section";
import { Text } from "../2-atoms/Text";
import { ContactForm } from "../3-molecules/ContactForm";
import { Hero } from "../3-molecules/Hero";
import { Grid } from "../4-organisms/Grid";
import { PageTemplate } from "../5-templates/PageTemplate";
import { faqs, pageContent, supportOptions } from "./SupportPage.data.tsx";

export const SupportPage = () => {
	return (
		<PageTemplate title="Support">
			{/* Hero Section */}
			<Hero
				title="Support"
				brand="Center"
				subtitle="Get help with SkillVector and find answers to common questions"
			/>

			{/* Support Options */}
			<Section>
				<Grid
					items={supportOptions.map((opt) => ({
						id: opt.title,
						icon: opt.icon,
						title: opt.title,
						description: opt.description,
						centered: true,
						customContent: (
							<Div className="flex flex-col h-full text-center">
								<Div>
									<Div className="mb-4 text-primary flex justify-center">
										{opt.icon}
									</Div>
									<Heading variant="subsection" className="mb-2">
										{opt.title}
									</Heading>
									<Text variant="body" className="mb-4">
										{opt.description}
									</Text>
								</Div>
								<Div className="mt-auto">
									{opt.isInternal ? (
										<Button asChild aria-label={opt.linkText}>
											<Link to={opt.href}>{opt.linkText}</Link>
										</Button>
									) : (
										<Button asChild aria-label={opt.linkText}>
											<Link
												href={opt.href}
												external={!opt.href.startsWith("mailto:")}
											>
												{opt.linkText}
											</Link>
										</Button>
									)}
								</Div>
							</Div>
						),
					}))}
					maxColumns={2}
				/>
			</Section>

			{/* FAQ Section */}
			<Section>
				<Heading variant="section" className="mb-8 text-center">
					{pageContent.faqSection.title}
				</Heading>
				<Grid items={faqs} maxColumns={1} />
			</Section>

			{/* Contact Form Section */}
			<Section id="contact">
				<Heading variant="section" className="mb-4 text-center">
					{pageContent.contactSection.title}
				</Heading>
				<Text variant="lead" className="text-center mb-8 text-muted-foreground">
					{pageContent.contactSection.description}
				</Text>
				<Grid
					items={[
						{
							title: "",
							centered: false,
							customContent: <ContactForm />,
						},
					]}
					maxColumns={1}
				/>
			</Section>
		</PageTemplate>
	);
};
