import { useEffect, useState } from "react";
import { usePeople } from "@/hooks/usePeople";
import { Div } from "../atoms/Div";
import { Hero } from "../atoms/Hero";
import { Text } from "../atoms/Text";
import { ErrorMessage } from "../molecules/ErrorMessage";
import { LoadingState } from "../molecules/LoadingState";
import { PersonCard } from "../molecules/PersonCard";
import { ViewToggle } from "../molecules/ViewToggle";
import { PageTemplate } from "../templates/PageTemplate";

export function BrowsePage() {
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
		} catch {}
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
					<div className="flex items-center justify-between mb-6">
						<Text variant="muted">
							Found <strong>{data.count}</strong> people
						</Text>
						<ViewToggle view={view} onViewChange={setView} />
					</div>

					<Div
						className={
							view === "grid"
								? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
								: "space-y-4"
						}
					>
						{data.people.map((person) => {
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

							return (
								<PersonCard key={person.id} person={personData} view={view} />
							);
						})}
					</Div>
				</>
			)}
		</PageTemplate>
	);
}
