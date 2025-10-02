import type { Person } from "@/types/api";
import { Badge } from "../atoms/Badge";
import { Card } from "../atoms/Card";

interface PersonCardProps {
	person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
	return (
		<Card hoverable>
			<div className="space-y-3">
				{/* Name and Role */}
				<div>
					<h3 className="text-lg font-semibold text-gray-900">
						{person.name || "Unknown"}
					</h3>
					<p className="text-sm text-gray-600">
						{person.role || "No role specified"}
					</p>
				</div>

				{/* Location and Experience */}
				<div className="flex items-center gap-4 text-sm">
					{person.location && (
						<div className="flex items-center gap-1">
							<span className="text-gray-500">📍</span>
							<span>{person.location}</span>
						</div>
					)}
					{person.experience_years > 0 && (
						<div className="flex items-center gap-1">
							<span className="text-gray-500">💼</span>
							<span>{person.experience_years} years</span>
						</div>
					)}
				</div>

				{/* Skills */}
				{person.skills && (
					<div>
						<p className="text-xs text-gray-500 mb-1">Skills:</p>
						<div className="flex flex-wrap gap-1">
							{typeof person.skills === "string"
								? person.skills.split(/[;,]/).map((skill) => (
										<Badge
											key={skill.trim()}
											variant="default"
											className="text-xs"
										>
											{skill.trim()}
										</Badge>
									))
								: person.skills.map((skill) => (
										<Badge key={skill} variant="default" className="text-xs">
											{skill}
										</Badge>
									))}
						</div>
					</div>
				)}

				{/* Email */}
				{person.email && (
					<div className="text-sm">
						<a
							href={`mailto:${person.email}`}
							className="text-blue-600 hover:text-blue-800 hover:underline"
						>
							{person.email}
						</a>
					</div>
				)}
			</div>

			{/* Relevance Score */}
			<div className="flex items-center justify-between mt-4 pt-3 border-t">
				<Badge variant="success">
					Relevance: {(person.relevanceScore * 100).toFixed(1)}%
				</Badge>
			</div>
		</Card>
	);
}
