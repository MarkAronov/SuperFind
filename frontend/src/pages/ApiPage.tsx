import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { useMemo } from "react";
import { PageTemplate } from "../components/templates/PageTemplate";
import { useTheme } from "../hooks/useTheme";

export const ApiPage = () => {
	const { effectiveTheme } = useTheme();
	const isDark = effectiveTheme === "dark";

	// Always use the local OpenAPI spec (bundled with frontend)
	const specUrl = "/openapi.json";

	// Create a fresh configuration object when dark mode changes
	const configuration = useMemo(
		() => ({
			spec: {
				url: specUrl,
			},
			darkMode: isDark,
			hideModels: false,
			hideDownloadButton: false,
			hiddenClients: [] as string[],
			defaultHttpClient: {
				targetKey: "js" as const,
				clientKey: "fetch" as const,
			},
			theme: "purple" as const,
		}),
		[isDark],
	);

	return (
		<PageTemplate contained={false}>
			<div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
				<div className="text-center mb-12">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							API Reference
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Explore the SkillVector REST API endpoints for semantic search and
						data ingestion
					</p>
				</div>
			</div>
			<div className="max-w-5xl mx-auto px-4 mb-8">
				<div className="scalar-wrapper rounded-xl overflow-hidden border border-border">
					<ApiReferenceReact
						key={`scalar-${isDark}`}
						configuration={configuration}
					/>
				</div>
			</div>
		</PageTemplate>
	);
};

export default ApiPage;
