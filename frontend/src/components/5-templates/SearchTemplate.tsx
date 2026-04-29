import { cn } from "@/lib/utils";
import { SPACING } from "../1-ions/spacing";
import type { SearchTemplateProps } from "./SearchTemplate.types";

export const SearchTemplate = ({
	header,
	searchBar,
	results,
	error,
}: SearchTemplateProps) => {
	return (
		<div
			className={cn(
				// Layout
				"flex flex-col",
				"items-center justify-center",
				"min-h-screen",
				// Spacing
				SPACING.PADDING.xl,
			)}
		>
			{header}
			{searchBar}
			{error}
			{results}
		</div>
	);
};
