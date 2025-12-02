import { Link } from "@tanstack/react-router";
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
import { Card } from "../atoms/Card";
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

const getLevelColor = (level: Tutorial["level"]) => {
	switch (level) {
		case "Beginner":
			return "bg-success/10 text-success";
		case "Intermediate":
			return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
		case "Advanced":
			return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
	}
};

export const TutorialsPage = () => {
	return (
		<PageTemplate className="bg-transparent">
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							Tutorials
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Step-by-step guides to help you get the most out of SkillVector
					</p>
				</div>

				{/* Tutorials Grid */}
				<ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
					{tutorials.map((tutorial) => (
						<li key={tutorial.title}>
							<Card
								aria-label={tutorial.title}
								className="p-6 hover:shadow-lg transition-shadow h-full cursor-pointer group"
							>
								<div className="flex items-start justify-between mb-4">
									<div className="text-primary">{tutorial.icon}</div>
									<span
										className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(tutorial.level)}`}
									>
										{tutorial.level}
									</span>
								</div>
								<h3 className="text-lg lg:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
									{tutorial.title}
								</h3>
								<p className="text-sm lg:text-base text-muted-foreground mb-4">
									{tutorial.description}
								</p>
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
							</Card>
						</li>
					))}
				</ul>

				{/* CTA Section */}
				<Card
					aria-label="Request a tutorial"
					className="text-center p-8 lg:p-12 hover:shadow-lg transition-shadow"
				>
					<h2 className="text-2xl lg:text-3xl font-bold mb-4">
						Need Help With Something Specific?
					</h2>
					<p className="text-base lg:text-xl text-muted-foreground mb-6">
						Check our documentation or reach out to the community for support
					</p>
					<div className="flex gap-4 justify-center flex-wrap">
						<Link
							to="/api"
							aria-label="View API Docs"
							className="px-5 lg:px-6 py-2.5 lg:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
						>
							API Documentation
						</Link>
						<Link
							to="/support"
							aria-label="Get Support"
							className="px-5 lg:px-6 py-2.5 lg:py-3 border border-border rounded-lg hover:bg-white/10 transition-colors font-medium"
						>
							Get Support
						</Link>
					</div>
				</Card>
			</div>
		</PageTemplate>
	);
};
