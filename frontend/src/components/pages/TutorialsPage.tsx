import {
	ArrowRight,
	BookOpen,
	Clock,
	Code,
	Database,
	Rocket,
	Settings,
} from "lucide-react";
import type { ReactNode } from "react";
import { ActionButton } from "../atoms/ActionButton";
import { CardSection } from "../atoms/CardSection";
import { Grid } from "../atoms/Grid";
import { Heading } from "../atoms/Heading";
import { Hero } from "../atoms/Hero";
import { StatusBadge } from "../atoms/StatusBadge";
import { Text } from "../atoms/Text";
import { PageTemplate } from "../templates/PageTemplate";

type Tutorial = {
	icon: ReactNode;
	title: string;
	description: string;
	duration: string;
	level: "Beginner" | "Intermediate" | "Advanced";
	topics: string[];
};

const tutorials: Tutorial[] = [
	{
		icon: <Rocket className="h-6 w-6" />,
		title: "Getting Started with SkillVector",
		description:
			"Learn how to set up SkillVector locally and perform your first semantic search.",
		duration: "15 min",
		level: "Beginner",
		topics: ["Installation", "Configuration", "First Search"],
	},
	{
		icon: <Database className="h-6 w-6" />,
		title: "Uploading and Parsing Data",
		description:
			"Master the data ingestion process with CSV, JSON, and TXT file uploads.",
		duration: "20 min",
		level: "Beginner",
		topics: ["File Formats", "Data Validation", "Bulk Upload"],
	},
	{
		icon: <Settings className="h-6 w-6" />,
		title: "Configuring AI Providers",
		description:
			"Set up and switch between different AI embedding providers for optimal results.",
		duration: "25 min",
		level: "Intermediate",
		topics: ["OpenAI", "Anthropic", "Ollama", "API Keys"],
	},
	{
		icon: <Code className="h-6 w-6" />,
		title: "API Integration Guide",
		description:
			"Integrate SkillVector's REST API into your applications with code examples.",
		duration: "30 min",
		level: "Intermediate",
		topics: ["REST API", "Authentication", "Error Handling"],
	},
	{
		icon: <Database className="h-6 w-6" />,
		title: "Advanced Qdrant Configuration",
		description:
			"Optimize your vector database for performance and scalability.",
		duration: "35 min",
		level: "Advanced",
		topics: ["Indexing", "Sharding", "Performance Tuning"],
	},
	{
		icon: <BookOpen className="h-6 w-6" />,
		title: "Building Custom Embedding Pipelines",
		description: "Create custom embedding workflows for specialized use cases.",
		duration: "40 min",
		level: "Advanced",
		topics: ["Custom Models", "Preprocessing", "Fine-tuning"],
	},
];

const levelToStatus = (
	level: Tutorial["level"],
): "beginner" | "intermediate" | "advanced" => {
	return level.toLowerCase() as "beginner" | "intermediate" | "advanced";
};

export const TutorialsPage = () => {
	return (
		<PageTemplate className="bg-transparent">
			{/* Hero Section */}
			<Hero
				title="Tutorials"
				subtitle="Step-by-step guides to help you get the most out of SkillVector"
			/>

			{/* Tutorials Grid */}
			<Grid variant="cards">
				{tutorials.map((tutorial) => (
					<CardSection key={tutorial.title} aria-label={tutorial.title}>
						<div className="flex items-start justify-between mb-4">
							<div className="text-primary">{tutorial.icon}</div>
							<StatusBadge status={levelToStatus(tutorial.level)} />
						</div>
						<Heading
							variant="subsection"
							className="mb-2 group-hover:text-primary transition-colors"
						>
							{tutorial.title}
						</Heading>
						<Text className="mb-4">{tutorial.description}</Text>
						<div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
							<span className="flex items-center gap-1">
								<Clock className="h-4 w-4" />
								{tutorial.duration}
							</span>
						</div>
						<div className="flex flex-wrap gap-2">
							{tutorial.topics.map((topic) => (
								<span
									key={topic}
									className="px-2 py-1 bg-muted/50 rounded text-xs"
								>
									{topic}
								</span>
							))}
						</div>
						<div className="flex items-center gap-2 text-primary font-medium mt-4">
							Start Tutorial
							<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</div>
					</CardSection>
				))}
			</Grid>

			{/* CTA Section */}
			<CardSection aria-label="Request a tutorial" className="text-center">
				<Heading variant="section" className="mb-4">
					Need Help With Something Specific?
				</Heading>
				<Text variant="lead" className="mb-6">
					Check our documentation or reach out to the community for support
				</Text>
				<div className="flex gap-4 justify-center flex-wrap">
					<ActionButton variant="primary" to="/api" ariaLabel="View API Docs">
						API Documentation
					</ActionButton>
					<ActionButton variant="outline" to="/support" ariaLabel="Get Support">
						Get Support
					</ActionButton>
				</div>
			</CardSection>
		</PageTemplate>
	);
};
