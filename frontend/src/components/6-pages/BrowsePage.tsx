import { useEffect, useState } from "react";
import { usePeople } from "@/hooks/usePeople";
import { Div } from "../2-atoms/Div";
import { Text } from "../2-atoms/Text";
import { ErrorMessage } from "../3-molecules/ErrorMessage";
import { Hero } from "../3-molecules/Hero";
import { LoadingState } from "../3-molecules/LoadingState";
import { PersonCard } from "../3-molecules/PersonCard";
import { ViewToggle } from "../3-molecules/ViewToggle";
import { Grid } from "../4-organisms/Grid";
import { PageTemplate } from "../5-templates/PageTemplate";

export const BrowsePage = () => {
	const { data, isLoading, error } = usePeople(100);

	const [view, setView] = useState<"grid" | "row">(() => {
		try {
			const v = localStorage.getItem("resultsView");
			return v === "row" ? "row" : "grid";
		} catch {
			return "grid";
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem("resultsView", view);
		} catch {
			/* Ignore localStorage errors - not critical */
		}
	}, [view]);

	return (
		<PageTemplate title="Browse People">
			{/* Hero Section */}
			<Hero
				title="All"
				brand="People"
				subtitle="Browse all professionals in our database"
			/>

			{isLoading && <LoadingState message="Loading people..." />}

			{error && <ErrorMessage message={error.message} />}

			{/* People List */}
			{data && (
				<>
					{/* Desktop: count and view toggle */}
					<Div className="hidden md:flex items-center justify-between mb-6">
						<Text variant="muted">
							Found <strong>{data.count}</strong> people
						</Text>
						<ViewToggle view={view} onViewChange={setView} />
					</Div>

					{/* Mobile: count only */}
					<Div className="md:hidden mb-6">
						<Text variant="muted">
							Found <strong>{data.count}</strong> people
						</Text>
					</Div>

					<Grid
						maxColumns={view === "grid" ? 3 : 1}
						items={data.people.map((person) => {
							const personData = {
								id: String(person.id),
								score: 0,
								person: {
									id: String(person.id),
									name: person.metadata.data_name || "Unknown",
									role: person.metadata.data_role || "N/A",
									location: person.metadata.data_location || "N/A",
									skills:
										typeof person.metadata.data_skills === "string"
											? person.metadata.data_skills
													.split(",")
													.map((s) => s.trim())
											: [],
									experience: String(
										person.metadata.data_experience_years ||
											person.metadata.data_experience ||
											"N/A",
									),
									description: person.metadata.data_description || "",
									email: person.metadata.data_email || "",
								},
							};

							const mobileView = window.innerWidth < 768 ? "grid" : view;

							return {
								id: String(person.id),
								noWrapper: true,
								customContent: (
									<PersonCard
										key={person.id}
										person={personData}
										view={mobileView}
									/>
								),
							};
						})}
					/>
				</>
			)}
		</PageTemplate>
	);
};
