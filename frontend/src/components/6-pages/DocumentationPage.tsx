import { Code, FileText } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { SPACING } from "../1-ions/spacing";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../2-atoms/Accordion";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Section } from "../2-atoms/Section";
import { Text } from "../2-atoms/Text";
import { Card, CardContent } from "../3-molecules/Card";
import { CodeBlock } from "../3-molecules/CodeBlock";
import { Hero } from "../3-molecules/Hero";
import { Scalar } from "../4-organisms/Scalar";
import { PageTemplate } from "../5-templates/PageTemplate";
import {
	packageManagers,
	quickStartCode,
	sdkExamples,
	sdkInfo,
} from "./DocumentationPage.data";

export const DocumentationPage = () => {
	const apiRef = useRef<HTMLDivElement | null>(null);
	const sdkRef = useRef<HTMLDivElement | null>(null);

	return (
		<PageTemplate title="Documentation">
			<Hero
				title=""
				brand="Documentation"
				subtitle="API reference, SDKs, and developer guides"
			/>
			<Section>
				{/* API Section */}
				<Div
					id="api"
					ref={
						apiRef as React.RefObject<HTMLDivElement> as React.RefObject<
							HTMLDivElement & { scrollIntoView: () => void }
						>
					}
				>
					<Div
						variant="flex"
						className={cn("items-start", SPACING.GAP.md, "mb-6")}
					>
						<Div className="text-primary shrink-0">
							<FileText size={24} />
						</Div>
						<Div className="min-w-0">
							<Heading variant="card" className="mb-1">
								API Reference
							</Heading>
							<Text variant="muted">
								Complete API documentation and interactive reference
							</Text>
						</Div>
					</Div>
					<Scalar />
				</Div>
			</Section>
			<Section>
				{/* SDK Section — unified card with installation at top, examples at bottom */}
				<Div
					id="sdk"
					ref={
						sdkRef as React.RefObject<HTMLDivElement> as React.RefObject<
							HTMLDivElement & { scrollIntoView: () => void }
						>
					}
				>
					<Div
						variant="flex"
						className={cn("items-start", SPACING.GAP.md, "mb-6")}
					>
						<Div className="text-primary shrink-0">
							<Code size={24} />
						</Div>
						<Div className="min-w-0">
							<Heading variant="card" className="mb-1">
								TypeScript SDK
							</Heading>
							<Text variant="muted">{sdkInfo.description}</Text>
						</Div>
					</Div>

					{/* Single unified card for all SDK content */}
					<Card variant="hover" fill>
						<CardContent>
							{/* ─── Installation ─── */}
							<Heading as="h2" variant="card" className="mb-3">
								Installation
							</Heading>
							<Text variant="small" className="mb-4">
								Choose your preferred package manager:
							</Text>

							{/* Package manager installation commands */}
							<Div className="flex flex-col gap-4 mb-8">
								{packageManagers.map((pm) => (
									<Div key={pm.id}>
										<Text variant="small" className="mb-2 font-medium">
											{pm.name}
										</Text>
										<CodeBlock language="bash" code={pm.command} />
									</Div>
								))}
							</Div>

							{/* ─── Quick Start ─── */}
							<Heading as="h3" variant="subsection" className="mb-3">
								Quick Start
							</Heading>
							<Text variant="small" className="mb-4">
								Get up and running in seconds:
							</Text>
							<Div className="mb-8">
								<CodeBlock language="ts" code={quickStartCode} />
							</Div>

							{/* ─── Requirements ─── */}
							<Text variant="small" className="mb-8 text-muted-foreground">
								<strong>Requirements:</strong> {sdkInfo.requirements}
							</Text>

							{/* ─── Usage Examples ─── */}
							<Heading as="h3" variant="subsection" className="mb-3">
								Usage Examples
							</Heading>
							<Text variant="small" className="mb-4">
								Explore common patterns and advanced usage:
							</Text>

							{/* Island-style accordion items — no dividing lines */}
							<Accordion type="multiple" className="flex flex-col gap-2">
								{sdkExamples.map((example) => (
									<AccordionItem
										key={example.id}
										value={example.id}
										className="border rounded-lg border-border px-3 last:border-b"
									>
										<AccordionTrigger>{example.title}</AccordionTrigger>
										<AccordionContent>
											<Text variant="small" className="mb-3">
												{example.description}
											</Text>
											<CodeBlock language="ts" code={example.code} />
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</CardContent>
					</Card>
				</Div>
			</Section>
		</PageTemplate>
	);
};

export default DocumentationPage;
