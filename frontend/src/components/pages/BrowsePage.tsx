import { useEffect, useState } from "react";
import { usePeople } from "@/hooks/usePeople";
import { Button } from "../atoms/Button";
import { Card, CardContent } from "../atoms/Card";
import { Div } from "../atoms/Div";
import { Hero } from "../atoms/Hero";
import { Text } from "../atoms/Text";
import { PersonCard } from "../molecules/PersonCard";
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

			{isLoading && (
				<Div variant="center" className="py-12">
					<Div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
					<Text variant="muted" className="mt-4">
						Loading people...
					</Text>
				</Div>
			)}

			{error && (
				<Card variant="hover" className="mt-4 bg-red-100 text-red-700">
					<CardContent>
						<Text>
							<strong>Error:</strong> {error.message}
						</Text>
					</CardContent>
				</Card>
			)}

			{/* People List */}
			{data && (
				<>
					<div className="flex items-center justify-between mb-6">
						<Text variant="muted">
							Found <strong>{data.count}</strong> people
						</Text>
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant={view === "grid" ? "outline" : "default"}
								onClick={() => setView("grid")}
								aria-pressed={view === "grid"}
								title="Grid view"
							>
								Grid
							</Button>
							<Button
								size="sm"
								variant={view === "row" ? "outline" : "default"}
								onClick={() => setView("row")}
								aria-pressed={view === "row"}
								title="List view"
							>
								List
							</Button>
						</div>
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
