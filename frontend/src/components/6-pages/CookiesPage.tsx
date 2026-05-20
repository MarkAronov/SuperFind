import { Fragment } from "react";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { List, ListItem } from "../2-atoms/List";
import { Section } from "../2-atoms/Section";
import { Span } from "../2-atoms/Span";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../2-atoms/Table";
import { Text } from "../2-atoms/Text";
import { Card, CardContent } from "../3-molecules/Card";
import { Hero } from "../3-molecules/Hero";
import { Grid } from "../4-organisms/Grid";
import { PageTemplate } from "../5-templates/PageTemplate";
import { heroContent, policySections } from "./CookiesPage.data.tsx";
import type { ContentBlock } from "./CookiesPage.types";

// Renders a single content block based on its discriminated 'kind' property
const renderBlock = (block: ContentBlock) => {
	switch (block.kind) {
		// Plain text paragraph
		case "paragraph":
			return (
				<Text key={block.text.slice(0, 40)} variant="muted">
					{block.text}
				</Text>
			);

		// Sub-section with heading, body text, and an optional browser list
		case "subsection":
			return (
				<Fragment key={block.heading}>
					<Heading as="h3" variant="card" className="mt-6 mb-2">
						{block.heading}
					</Heading>
					<Text variant="muted">{block.body}</Text>
					{block.list && (
						<List variant="disc">
							{block.list.map((item) => (
								<ListItem key={item.name}>
									<Span>
										<strong>{item.name}:</strong> {item.instructions}
									</Span>
								</ListItem>
							))}
						</List>
					)}
				</Fragment>
			);

		// Cookie data table — columns and rows both come from the data file
		case "cookie-table":
			return (
				<Table key="cookie-table">
					<TableHeader>
						<TableRow>
							{block.columns.map((col) => (
								<TableHead key={col}>{col}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{block.cookies.map((cookie) => (
							<TableRow key={cookie.name}>
								<TableCell variant="code">{cookie.name}</TableCell>
								<TableCell variant="muted">{cookie.purpose}</TableCell>
								<TableCell variant="muted">{cookie.duration}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			);
	}
};

export const CookiesPage = () => (
	<PageTemplate title="Cookie Policy">
		{/* Hero Section */}
		<Hero
			title={heroContent.title}
			brand={heroContent.brand}
			subtitle={heroContent.subtitle}
		/>

		{/* Cookie Policy Content — every card rendered from policySections data */}
		<Section>
			<Grid maxColumns={1}>
				{policySections.map((card) => (
					<Card
						variant="hover"
						key={card.ariaLabel}
						aria-label={card.ariaLabel}
						fill
					>
						<CardContent>
							{/* Header — icon + heading when icon exists, plain heading otherwise */}
							{card.icon ? (
								<Div variant="flex" className="mb-4">
									<Div className="text-primary">{card.icon}</Div>
									<Heading variant="subsection">{card.heading}</Heading>
								</Div>
							) : (
								<Heading variant="subsection" className="mb-4">
									{card.heading}
								</Heading>
							)}

							{/* Content blocks — paragraph, subsection, or cookie-table */}
							<Div variant="stack">{card.blocks.map(renderBlock)}</Div>
						</CardContent>
					</Card>
				))}
			</Grid>
		</Section>
	</PageTemplate>
);
