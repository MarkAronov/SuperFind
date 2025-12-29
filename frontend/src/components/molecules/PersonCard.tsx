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
import { Div } from "../atoms/Div";
import { Link } from "../atoms/Link";
import { Span } from "../atoms/Span";
import { Text } from "../atoms/Text";

interface PersonCardProps {
	person: PersonSearchResult;
	view?: "grid" | "row";
}

export function PersonCard({ person, view = "grid" }: PersonCardProps) {
	const p = person.person;

	// Helper to display experience
	const expYears =
		(p.experience_years as unknown as number) ||
		(p.experience as unknown as number) ||
		0;

	// Normalize skills into a flat array regardless of incoming shape
	const skillsArray: string[] = (() => {
		const raw = p.skills as unknown;
		if (!raw) return [];
		if (typeof raw === "string") {
			return raw
				.split(/[;,]/)
				.map((s) => s.trim())
				.filter(Boolean);
		}
		if (Array.isArray(raw)) {
			return raw
				.flatMap((s) => (typeof s === "string" ? s.split(/[;,]/) : []))
				.map((s) => s.trim())
				.filter(Boolean);
		}
		return [];
	})();

	// Relevance badge classes based on score (low: red, mid: orange, high: green)
	const relevanceClass =
		person.score >= 0.66
			? "bg-success/10 text-success border-success/30"
			: person.score >= 0.33
				? "bg-warning/10 text-warning border-warning/30"
				: "bg-destructive/10 text-destructive border-destructive/30";

	// derive initials for avatar (used in both grid and row views)
	const initials = (p.name || "U")
		.split(" ")
		.map((s) => s?.[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();

	if (view === "row") {
		return (
			<Card className="transition-shadow hover:shadow-md">
				<div className="md:flex items-center gap-4 p-4">
					{/* Main */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between gap-4">
							<div className="min-w-0">
								<div className="flex items-center gap-3">
									<div className="w-9 h-9 shrink-0 avatar-nonagon bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
										{initials}
									</div>
									<Text className="text-lg font-semibold truncate">
										{p.name || "Unknown"}
									</Text>
								</div>
								<Text variant="muted" className="truncate">
									{p.role || "No role specified"}
								</Text>
							</div>
							<div className="hidden md:flex items-center">
								<Badge
									variant="default"
									className={`${relevanceClass} text-xs`}
								>
									Relevance: {(person.score * 100).toFixed(1)}%
								</Badge>
							</div>
						</div>

						<div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-4">
							{p.location && (
								<span className="flex items-center gap-1">
									📍 <span>{p.location}</span>
								</span>
							)}
							{expYears > 0 && (
								<span className="flex items-center gap-1">
									💼 <span>{expYears} years</span>
								</span>
							)}
						</div>

						{skillsArray.length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1">
								{skillsArray.map((skill: string) => (
									<Badge key={skill} variant="secondary" className="text-xs">
										{skill}
									</Badge>
								))}
							</div>
						)}

						{p.email && (
							<div className="mt-2">
								<Link
									href={`mailto:${p.email}`}
									variant="primary"
									external
									className="text-sm"
								>
									{p.email}
								</Link>
							</div>
						)}
					</div>

					{/* Mobile relevance */}
					<div className="md:hidden mt-3">
						<Badge variant="default" className={`${relevanceClass} text-xs`}>
							Relevance: {(person.score * 100).toFixed(1)}%
						</Badge>
					</div>
				</div>
			</Card>
		);
	}

	// Grid / default card
	return (
		<Card className="transition-shadow hover:shadow-md">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 shrink-0 avatar-nonagon bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
						{initials}
					</div>
					<div className="min-w-0">
						<CardTitle className="text-lg truncate">
							{p.name || "Unknown"}
						</CardTitle>
						<CardDescription className="text-sm truncate">
							{p.role || "No role specified"}
						</CardDescription>
					</div>
				</div>{" "}
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Location and Experience */}
				{(p.location ||
					(p.experience_years && Number(p.experience_years) > 0)) && (
					<Div variant="flex" className="gap-4 text-sm">
						{p.location && (
							<Div variant="flex" className="items-center gap-2">
								<Span variant="muted">📍</Span>
								<Span>{p.location}</Span>
							</Div>
						)}
						{p.experience_years && Number(p.experience_years) > 0 && (
							<Div variant="flex" className="items-center gap-2">
								<Span variant="muted">💼</Span>
								<Span>{p.experience_years} years</Span>
							</Div>
						)}
					</Div>
				)}

				{/* Skills */}
				{skillsArray.length > 0 && (
					<Div>
						<Text variant="caption" className="mb-2">
							Skills:
						</Text>
						<Div className="flex flex-wrap gap-1">
							{skillsArray.map((skill: string) => (
								<Badge key={skill} variant="secondary" className="text-xs">
									{skill}
								</Badge>
							))}
						</Div>
					</Div>
				)}

				{/* Email */}
				{p.email && (
					<Div>
						<Link
							href={`mailto:${p.email}`}
							variant="primary"
							external
							className="text-sm"
						>
							{p.email}
						</Link>
					</Div>
				)}
			</CardContent>

			<CardFooter className="border-t pt-4">
				<Badge variant="default" className={`${relevanceClass} text-xs`}>
					Relevance: {(person.score * 100).toFixed(1)}%
				</Badge>
			</CardFooter>
		</Card>
	);
}
