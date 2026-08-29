import type { AnyApiReferenceConfiguration } from "@scalar/api-reference-react";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import { cn } from "@/lib/utils";
import "@scalar/api-reference-react/style.css";
import { useEffect, useMemo } from "react";
import { useTheme } from "../../hooks/useTheme";
import { BORDERS } from "../1-ions/borders";
import { LAYOUT } from "../1-ions/layout";
import { Div } from "../2-atoms/Div";
import "./Scalar.css";

/**
 * Scalar Organism
 *
 * Encapsulates Scalar API reference rendering, theme synchronization,
 * width constraints, and scroll behavior in a single level-4 component.
 */
export interface ScalarProps {
	/** OpenAPI spec url served by the frontend */
	specUrl?: string;

	/** Optional wrapper class overrides */
	className?: string;

	/** Optional pre-built scalar configuration override */
	configurationOverride?: AnyApiReferenceConfiguration;
}

export const Scalar = ({
	specUrl = "/openapi.json",
	className,
	configurationOverride,
}: ScalarProps) => {
	// Resolve effective app theme so Scalar always matches the site.
	const { effectiveTheme } = useTheme();
	const isDark = effectiveTheme === "dark";

	// Clear Scalar's stored color mode preference and keep app theme as source of truth.
	useEffect(() => {
		localStorage.removeItem("colorMode");
	}, []);

	// Build Scalar configuration inside this organism to keep page-level code lightweight.
	const configuration = useMemo<AnyApiReferenceConfiguration>(() => {
		if (configurationOverride) {
			return configurationOverride;
		}

		return {
			spec: {
				url: specUrl,
			},
			darkMode: isDark,
			hideTestRequestButton: false,
			hideSearch: true,
			hideModels: false,
			hideDarkModeToggle: true,
			hideClientButton: true,
			showSidebar: true,
			showDeveloperTools: "never",
			operationTitleSource: "summary",
			theme: "alternate",
			persistAuth: false,
			layout: "modern",
			documentDownloadType: "both",
			showOperationId: false,
			withDefaultFonts: true,
			defaultOpenAllTags: false,
			expandAllModelSections: false,
			expandAllResponses: false,
			orderSchemaPropertiesBy: "alpha",
			orderRequiredPropertiesFirst: true,
			hideDownloadButton: false,
			hiddenClients: [],
			defaultHttpClient: {
				targetKey: "js",
				clientKey: "fetch",
			},
		};
	}, [configurationOverride, isDark, specUrl]);

	// Keep ScrollArea + width controls colocated with Scalar to avoid page-level interference.
	const scalarWrapperClassName = cn(
		BORDERS.RADIUS.xl,
		LAYOUT.SCALAR_API,
		className,
	);

	return (
		<Div className={cn(scalarWrapperClassName, "overflow-auto")}>
			<ApiReferenceReact
				key={`scalar-${isDark}`}
				configuration={configuration}
			/>
		</Div>
	);
};
