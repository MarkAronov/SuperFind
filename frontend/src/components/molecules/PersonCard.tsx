import type { PersonSearchResult } from "@/types/search.types";
import { Badge } from "../atoms/Badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../atoms/Card";

interface PersonCardProps {
	person: PersonSearchResult;
}

export function PersonCard({ person }: PersonCardProps) {
	const p = person.person;
	return (
		<Card className="hover:shadow-lg transition-shadow cursor-pointer">
			<CardHeader>
				<CardTitle className="text-lg">{p.name || "Unknown"}</CardTitle>
				<CardDescription className="text-sm">
					{p.role || "No role specified"}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-3">
				{/* Location and Experience */}
				<div className="flex items-center gap-4 text-sm">
					{p.location && (
						<div className="flex items-center gap-1">
							<span className="text-gray-500">📍</span>
							<span>{p.location}</span>
						</div>
					)}
					{p.experience_years && Number(p.experience_years) > 0 && (
						<div className="flex items-center gap-1">
							<span className="text-gray-500">💼</span>
							<span>{p.experience_years} years</span>
						</div>
					)}
				</div>{" "}
				{/* Skills */}
				{p.skills && (
					<div>
						<p className="text-xs text-gray-500 mb-1">Skills:</p>
						<div className="flex flex-wrap gap-1">
							{typeof p.skills === "string"
								? p.skills.split(/[;,]/).map((skill: string) => (
										<Badge
											key={skill.trim()}
											variant="secondary"
											className="text-xs"
										>
											{skill.trim()}
										</Badge>
									))
								: p.skills.map((skill: string) => (
										<Badge key={skill} variant="secondary" className="text-xs">
											{skill}
										</Badge>
									))}
						</div>
					</div>
				)}
				{/* Email */}
				{p.email && (
					<div className="text-sm">
						<a
							href={`mailto:${p.email}`}
							className="text-blue-600 hover:text-blue-800 hover:underline"
						>
							{p.email}
						</a>
					</div>
				)}
			</CardContent>

			<CardFooter className="border-t">
				<Badge
					variant="default"
					className="bg-green-100 text-green-800 border-green-200"
				>
					Relevance: {(person.score * 100).toFixed(1)}%
				</Badge>
			</CardFooter>
		</Card>
	);
}
