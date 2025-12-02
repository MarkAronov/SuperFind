import { GitCommit, Tag } from "lucide-react";
import { EXTERNAL_LINKS } from "@/constants/site";
import { Card } from "../atoms/Card";
import { PageTemplate } from "../templates/PageTemplate";

export const ChangelogPage = () => {
	const releases = [
		{
			version: "1.0.0",
			date: "2024-11-20",
			changes: [
				"Initial public release of SkillVector",
				"Semantic search with multiple AI provider support",
				"CSV, JSON, and TXT profile upload capabilities",
				"Qdrant vector database integration",
				"RESTful API with comprehensive OpenAPI documentation",
				"React 19 frontend with modern Glass UI design",
			],
		},
		{
			version: "0.9.0-beta",
			date: "2024-11-10",
			changes: [
				"Added support for Ollama (local AI models)",
				"Improved embedding generation performance",
				"Enhanced error handling and validation",
				"Added Docker support for easy deployment",
				"Responsive design optimizations",
			],
		},
		{
			version: "0.8.0-beta",
			date: "2024-11-01",
			changes: [
				"Integrated Google Gemini and Anthropic Claude",
				"Added similarity score filtering",
				"Improved search result ranking algorithm",
				"Enhanced API documentation with Redoc",
				"Added comprehensive test coverage",
			],
		},
		{
			version: "0.7.0-alpha",
			date: "2024-10-20",
			changes: [
				"Initial vector search implementation",
				"OpenAI and HuggingFace embedding support",
				"Basic profile upload and parsing",
				"Qdrant database setup and configuration",
				"Foundation for frontend architecture",
			],
		},
	];

	return (
		<PageTemplate className="bg-transparent">
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							Changelog
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Track the evolution of SkillVector with our version history
					</p>
				</div>

				{/* Releases */}
				<ul className="space-y-6 mb-16">
					{releases.map((release) => (
						<li key={release.version}>
							<Card
								aria-label={`Version ${release.version}`}
								className="p-6 hover:shadow-lg transition-shadow"
							>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
									<div className="flex items-center gap-3">
										<div className="text-primary">
											<Tag className="h-6 w-6" />
										</div>
										<div>
											<h2 className="text-xl font-semibold">
												v{release.version}
											</h2>
											<p className="text-sm text-muted-foreground">
												{new Date(release.date).toLocaleDateString("en-US", {
													month: "long",
													day: "numeric",
													year: "numeric",
												})}
											</p>
										</div>
									</div>
								</div>

								<ul className="space-y-3">
									{release.changes.map((change) => (
										<li
											key={change}
											className="flex gap-3 text-muted-foreground"
										>
											<GitCommit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
											<span>{change}</span>
										</li>
									))}
								</ul>
							</Card>
						</li>
					))}
				</ul>

				{/* CTA Section */}
				<Card
					aria-label="View releases on GitHub"
					className="text-center p-8 lg:p-12 hover:shadow-lg transition-shadow"
				>
					<h2 className="text-2xl lg:text-3xl font-bold mb-4">Stay Updated</h2>
					<p className="text-base lg:text-xl text-muted-foreground mb-6">
						Follow our GitHub repository for the latest updates and releases
					</p>
					<a
						href={EXTERNAL_LINKS.releases}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="View Changelog on GitHub"
						className="px-5 lg:px-6 py-2.5 lg:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium inline-block"
					>
						View on GitHub
					</a>
				</Card>
			</div>
		</PageTemplate>
	);
};
