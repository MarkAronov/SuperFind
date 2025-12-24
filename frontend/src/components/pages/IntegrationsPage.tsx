import { useNavigate } from "@tanstack/react-router";
import {
	Brain,
	Cloud,
	Code,
	Cpu,
	Database,
	FileJson,
	FileText,
	Globe,
	Layers,
	Server,
	Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { EXTERNAL_LINKS, SOCIAL_LINKS } from "@/constants/site";
import { ActionButton } from "../atoms/ActionButton";
import { CardSection } from "../atoms/CardSection";
import { Grid } from "../atoms/Grid";
import { Heading } from "../atoms/Heading";
import { Hero } from "../atoms/Hero";
import { StatusBadge } from "../atoms/StatusBadge";
import { Text } from "../atoms/Text";
import { PageTemplate } from "../templates/PageTemplate";

type Integration = {
	icon: ReactNode;
	title: string;
	description: string;
	status: "ready" | "soon" | "planned";
};

type IntegrationCategory = {
	icon: ReactNode;
	title: string;
	description: string;
	integrations: Integration[];
};

const categories: IntegrationCategory[] = [
	{
		icon: <Brain className="h-6 w-6" />,
		title: "AI Providers",
		description: "Multiple AI embedding models for flexible deployment",
		integrations: [
			{
				icon: <Sparkles className="h-6 w-6" />,
				title: "OpenAI",
				description: "Industry-leading embeddings with text-embedding-3 models",
				status: "ready",
			},
			{
				icon: <Sparkles className="h-6 w-6" />,
				title: "Anthropic",
				description:
					"High-quality Claude embeddings with semantic understanding",
				status: "ready",
			},
			{
				icon: <Sparkles className="h-6 w-6" />,
				title: "Google Gemini",
				description: "Google's latest embeddings with multimodal capabilities",
				status: "ready",
			},
			{
				icon: <Sparkles className="h-6 w-6" />,
				title: "HuggingFace",
				description: "Access thousands of open-source embedding models",
				status: "ready",
			},
			{
				icon: <Sparkles className="h-6 w-6" />,
				title: "Ollama",
				description: "Run models locally for complete data privacy",
				status: "ready",
			},
		],
	},
	{
		icon: <Database className="h-6 w-6" />,
		title: "Vector Database",
		description: "High-performance vector storage and similarity search",
		integrations: [
			{
				icon: <Database className="h-6 w-6" />,
				title: "Qdrant",
				description:
					"Advanced filtering, HNSW indexing, and scalable architecture",
				status: "ready",
			},
		],
	},
	{
		icon: <Code className="h-6 w-6" />,
		title: "Development Tools",
		description: "APIs and SDKs for seamless integration",
		integrations: [
			{
				icon: <Globe className="h-6 w-6" />,
				title: "RESTful API",
				description: "OpenAPI 3.0 spec with interactive documentation",
				status: "ready",
			},
			{
				icon: <Code className="h-6 w-6" />,
				title: "TypeScript SDK",
				description: "Type-safe SDK with full IntelliSense support",
				status: "ready",
			},
		],
	},
	{
		icon: <Cloud className="h-6 w-6" />,
		title: "Deployment Platforms",
		description: "Deploy SkillVector anywhere",
		integrations: [
			{
				icon: <Server className="h-6 w-6" />,
				title: "Docker",
				description: "Containerized deployment with Docker Compose",
				status: "ready",
			},
			{
				icon: <Cloud className="h-6 w-6" />,
				title: "Render",
				description: "One-click deployment with automatic scaling",
				status: "ready",
			},
			{
				icon: <Layers className="h-6 w-6" />,
				title: "Kubernetes",
				description: "Helm charts for cloud-native deployments",
				status: "soon",
			},
		],
	},
	{
		icon: <Layers className="h-6 w-6" />,
		title: "Data Formats",
		description: "Flexible profile data ingestion",
		integrations: [
			{
				icon: <FileText className="h-6 w-6" />,
				title: "CSV Import",
				description: "Upload profiles with automatic field mapping",
				status: "ready",
			},
			{
				icon: <FileJson className="h-6 w-6" />,
				title: "JSON Import",
				description: "Structured data with nested fields and custom schemas",
				status: "ready",
			},
			{
				icon: <FileText className="h-6 w-6" />,
				title: "Plain Text",
				description: "Intelligent parsing with AI extraction",
				status: "ready",
			},
		],
	},
	{
		icon: <Cpu className="h-6 w-6" />,
		title: "Future Integrations",
		description: "Upcoming integrations and features",
		integrations: [
			{
				icon: <Globe className="h-6 w-6" />,
				title: "LinkedIn API",
				description: "Direct integration for profile synchronization",
				status: "planned",
			},
			{
				icon: <Code className="h-6 w-6" />,
				title: "GitHub API",
				description: "Import developer profiles with contribution analysis",
				status: "planned",
			},
			{
				icon: <Layers className="h-6 w-6" />,
				title: "ATS Systems",
				description: "Greenhouse, Lever, and other ATS integrations",
				status: "planned",
			},
		],
	},
];

export const IntegrationsPage = () => {
	const navigate = useNavigate();
	return (
		<PageTemplate className="bg-transparent">
			{/* Hero Section */}
			<Hero
				title="Powerful Integrations"
				subtitle="Connect SkillVector with your favorite tools and services for seamless talent search."
			/>

			{/* Integration Categories */}
			{categories.map((category) => (
				<section key={category.title} className="mb-12 lg:mb-16">
					<div className="flex items-center gap-3 mb-6">
						<div className="text-primary">{category.icon}</div>
						<div>
							<Heading variant="section">{category.title}</Heading>
							<Text className="text-muted-foreground">
								{category.description}
							</Text>
						</div>
					</div>

					<Grid variant="cards">
						{category.integrations.map((integration) => (
							<CardSection
								key={integration.title}
								aria-label={integration.title}
							>
								<div className="flex gap-4 items-start">
									<div className="shrink-0 text-primary">
										{integration.icon}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2 flex-wrap">
											<Heading variant="subsection">
												{integration.title}
											</Heading>
											<StatusBadge status={integration.status} />
										</div>
										<Text variant="small">{integration.description}</Text>
										{integration.title === "TypeScript SDK" && (
											<div className="mt-4 flex gap-3">
												<ActionButton
													variant="primary"
													onClick={() => navigate({ to: "/sdk" })}
												>
													View SDK
												</ActionButton>
												<ActionButton
													variant="outline"
													href={EXTERNAL_LINKS.sdkTypescript}
													external
												>
													View on GitHub
												</ActionButton>
											</div>
										)}
									</div>
								</div>
							</CardSection>
						))}
					</Grid>
				</section>
			))}

			{/* CTA Section */}
			<CardSection
				aria-label="Request custom integration"
				className="text-center"
			>
				<Heading variant="section" className="mb-4">
					Need a Custom Integration?
				</Heading>
				<Text variant="lead" className="mb-6">
					SkillVector is open source and extensible. Build your own or request
					new integrations.
				</Text>
				<div className="flex gap-4 justify-center flex-wrap">
					<ActionButton
						variant="primary"
						href={SOCIAL_LINKS.github}
						external
						ariaLabel="View SkillVector on GitHub"
					>
						View on GitHub
					</ActionButton>
					<ActionButton
						variant="outline"
						href={EXTERNAL_LINKS.discussions}
						external
						ariaLabel="Request new integration"
					>
						Request Integration
					</ActionButton>
				</div>
			</CardSection>
		</PageTemplate>
	);
};
