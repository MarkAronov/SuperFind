import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { useEffect, useMemo } from "react";
import { useTheme } from "../../hooks/useTheme";
import { Div } from "../atoms/Div";
import { Hero } from "../atoms/Hero";
import { PageTemplate } from "../templates/PageTemplate";

export const ApiPage = () => {
	const { effectiveTheme } = useTheme();
	const isDark = effectiveTheme === "dark";

	// Clear Scalar's localStorage theme preference on mount to force app theme
	useEffect(() => {
		localStorage.removeItem("colorMode");
	}, []);

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
			hideThemeToggle: true,
		}),
		[isDark],
	);

	return (
		<PageTemplate title="API Reference" contained={false}>
			<Div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
				<Hero
					title="API"
					brand="Reference"
					subtitle="Explore the SkillVector REST API endpoints for semantic search and data ingestion"
				/>
			</Div>
			<Div className="max-w-5xl mx-auto px-4 mb-8">
				<Div className="scalar-wrapper rounded-xl overflow-hidden border border-border">
					<ApiReferenceReact
						key={`scalar-${isDark}`}
						configuration={configuration}
					/>
				</Div>
			</Div>
		</PageTemplate>
	);
};

export default ApiPage;
