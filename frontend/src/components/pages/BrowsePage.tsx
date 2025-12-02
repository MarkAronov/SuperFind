import { usePeople } from "@/hooks/usePeople";
import { Card } from "../atoms/Card";
import { PersonCard } from "../molecules/PersonCard";
import { PageTemplate } from "../templates/PageTemplate";

export function BrowsePage() {
	const { data, isLoading, error } = usePeople(100);

	return (
		<PageTemplate className="bg-transparent">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						All{" "}
						<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							People
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Browse all professionals in our database
					</p>
				</div>

				{isLoading && (
					<div className="text-center py-12">
						<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
						<p className="mt-4 text-muted-foreground">Loading people...</p>
					</div>
				)}

				{error && (
					<Card className="mt-4 p-4 bg-red-100 text-red-700">
						<strong>Error:</strong> {error.message}
					</Card>
				)}

				{data && (
					<>
						<div className="mb-6 text-center">
							<p className="text-muted-foreground">
								Found <strong>{data.count}</strong> people
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

								return <PersonCard key={person.id} person={personData} />;
							})}
						</div>
					</>
				)}
			</div>
		</PageTemplate>
	);
}
