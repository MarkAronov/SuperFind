import type { ReactNode } from "react";

interface SearchTemplateProps {
	header: ReactNode;
	searchBar: ReactNode;
	results?: ReactNode;
	error?: ReactNode;
}

export function SearchTemplate({
	header,
	searchBar,
	results,
	error,
}: SearchTemplateProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8">
			<div className="w-full max-w-2xl">
				{header}
				{searchBar}
				{error}
				{results}
			</div>
		</div>
	);
}
