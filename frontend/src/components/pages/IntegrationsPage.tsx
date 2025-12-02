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
import { Card } from "../atoms/Card";
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

const StatusBadge = ({ status }: { status: Integration["status"] }) => {
	const styles = {
		ready: "bg-success/10 dark:bg-success/20 text-success dark:text-success",
		soon: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
		planned:
			"bg-gray-100 dark:bg-foreground/30 text-muted-foreground dark:text-gray-300",
	};
	const labels = {
		ready: "Production Ready",
		soon: "Coming Soon",
		planned: "Planned",
	};
	return (
		<span
			className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}
		>
			{labels[status]}
		</span>
	);
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
				status: "soon",
			},
			{
				icon: <Code className="h-6 w-6" />,
				title: "Python SDK",
				description: "Pythonic interface for data science workflows",
				status: "planned",
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
	return (
		<PageTemplate className="bg-transparent">
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						Powerful{" "}
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							Integrations
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Connect SkillVector with your favorite tools and services for
						seamless talent search.
					</p>
				</div>

				{/* Integration Categories */}
				{categories.map((category) => (
					<section key={category.title} className="mb-12 lg:mb-16">
						<div className="flex items-center gap-3 mb-6">
							<div className="text-primary">{category.icon}</div>
							<div>
								<h2 className="text-xl lg:text-2xl font-bold">
									{category.title}
								</h2>
								<p className="text-muted-foreground">{category.description}</p>
							</div>
						</div>

						<ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{category.integrations.map((integration) => (
								<li key={integration.title}>
									<Card
										aria-label={integration.title}
										className="p-6 hover:shadow-lg transition-shadow h-full"
									>
										<div className="flex gap-4 items-start">
											<div className="shrink-0 text-primary">
												{integration.icon}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-2 flex-wrap">
													<h3 className="text-lg lg:text-xl font-semibold">
														{integration.title}
													</h3>
													<StatusBadge status={integration.status} />
												</div>
												<p className="text-sm lg:text-base text-muted-foreground">
													{integration.description}
												</p>
											</div>
										</div>
									</Card>
								</li>
							))}
						</ul>
					</section>
				))}

				{/* CTA Section */}
				<Card
					aria-label="Request custom integration"
					className="text-center p-8 lg:p-12 hover:shadow-lg transition-shadow"
				>
					<h2 className="text-2xl lg:text-3xl font-bold mb-4">
						Need a Custom Integration?
					</h2>
					<p className="text-base lg:text-xl text-muted-foreground mb-6">
						SkillVector is open source and extensible. Build your own or request
						new integrations.
					</p>
					<div className="flex gap-4 justify-center flex-wrap">
						<a
							href={SOCIAL_LINKS.github}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="View SkillVector on GitHub"
							className="px-5 lg:px-6 py-2.5 lg:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
						>
							View on GitHub
						</a>
						<a
							href={EXTERNAL_LINKS.discussions}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Request new integration"
							className="px-5 lg:px-6 py-2.5 lg:py-3 border border-border rounded-lg hover:bg-white/10 transition-colors font-medium"
						>
							Request Integration
						</a>
					</div>
				</Card>
			</div>
		</PageTemplate>
	);
};
