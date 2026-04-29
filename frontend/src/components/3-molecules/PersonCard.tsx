import { cn } from "@/lib/utils";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Avatar, AvatarFallback } from "../2-atoms/Avatar";
import { Badge } from "../2-atoms/Badge";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Link } from "../2-atoms/Link";
import { Text } from "../2-atoms/Text";
import { Tooltip, TooltipContent, TooltipTrigger } from "../2-atoms/Tooltip";
import { Card } from "./Card";
import type { PersonCardProps } from "./PersonCard.types";
import { SkillsTooltip } from "./SkillsTooltip";
import { TruncatedText } from "./TruncatedText";

export const PersonCard = ({ person, view = "grid" }: PersonCardProps) => {
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
			? "bg-success/10 text-success border-success/30 h-6 py-1"
			: person.score >= 0.33
				? "bg-warning/10 text-warning border-warning/30 h-6 py-1"
				: "bg-destructive/10 text-destructive border-destructive/30 h-6 py-1";

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
			<Card fill className="hover:shadow-md transition-shadow">
				{/* Header gradient background */}
				{/* No negative margin - Card has no built-in padding so -m-6 would push */}
				{/* the gradient completely outside the card bounds (the list mode bug). */}
				{/* rounded-t-2xl matches Card's own border radius so corners align cleanly. */}
				<Div
					className={cn(
						// Colors & Effects
						"bg-linear-to-r from-primary/5 to-primary/10",
						// Layout & Sizing
						"h-20",
						// Spacing
						"mb-2",
						// Round top corners to match Card's rounded-2xl
						"rounded-t-2xl",
					)}
				/>
				{/* Main content container */}
				<Div className={cn(SPACING.PADDING.lg, "-mt-16")}>
					{/* Avatar and content flex container */}
					<Div className={cn("flex", SPACING.GAP.md)}>
						{/* Avatar */}
						<Avatar variant="nonagon" className="w-16 h-16">
							<AvatarFallback
								className={cn(
									// Colors
									"bg-primary dark:bg-primary",
									"text-primary-foreground",
									// Typography
									"font-semibold",
								)}
							>
								{initials}
							</AvatarFallback>
						</Avatar>
						{/* Content wrapper */}
						<Div className="flex-1 min-w-0">
							{/* Header with name, role and relevance badge */}
							<Div
								className={cn(
									"flex items-start justify-between",
									SPACING.GAP.md,
								)}
							>
								{/* Name and role container */}
								<Div className="min-w-0 flex-1">
									{/* Person name */}
									<Heading
										as="h3"
										className={cn(
											TYPOGRAPHY.COMBINATIONS.cardHeading,
											"leading-tight truncate",
										)}
									>
										<TruncatedText text={p.name || "Unknown"} maxLength={25} />
									</Heading>
									{/* Person role */}
									<Text
										className={cn(
											TYPOGRAPHY.FONT_SIZE.sm,
											"text-muted-foreground truncate",
											"mt-1",
										)}
									>
										<TruncatedText
											text={p.role || "No role specified"}
											maxLength={30}
										/>
									</Text>
									{/* Location and experience */}
									{(p.location || expYears > 0) && (
										<Text
											className={cn(
												TYPOGRAPHY.FONT_SIZE.xs,
												"text-muted-foreground truncate",
												"mt-2",
											)}
										>
											<TruncatedText
												text={[
													p.location,
													expYears > 0 ? `${expYears} years experience` : null,
												]
													.filter(Boolean)
													.join(" · ")}
												maxLength={35}
											/>
										</Text>
									)}
								</Div>
								{/* Relevance score badge (desktop only) */}
								{person.score > 0 && (
									<Div className="hidden md:flex shrink-0">
										<Badge
											variant="default"
											className={cn(TYPOGRAPHY.FONT_SIZE.xs, relevanceClass)}
										>
											{(person.score * 100).toFixed(0)}%
										</Badge>
									</Div>
								)}
							</Div>

							{/* Skills section */}
							{skillsArray.length > 0 && (
								<Div
									className={cn(
										"mt-4",
										"flex flex-wrap items-center",
										SPACING.GAP.xs,
									)}
								>
									{skillsArray.slice(0, 5).map((skill: string) => {
										const isTruncated = skill.length > 10;
										const badgeContent = isTruncated
											? `${skill.substring(0, 10)}…`
											: skill;

										const badge = (
											<Badge
												variant="secondary"
												className={cn(
													// Typography
													TYPOGRAPHY.FONT_SIZE.xs,
													// Layout
													"truncate max-w-20",
													// Sizing
													"h-6 py-1",
													// States
													"select-none",
												)}
											>
												{badgeContent}
											</Badge>
										);

										if (isTruncated) {
											return (
												<Tooltip key={skill}>
													<TooltipTrigger asChild>{badge}</TooltipTrigger>
													<TooltipContent variant="badge">
														{skill}
													</TooltipContent>
												</Tooltip>
											);
										}

										// Individual skill badge wrapper
										return (
											<Div key={skill} className="leading-none flex">
												{badge}
											</Div>
										);
									})}
									{skillsArray.length > 5 && (
										<SkillsTooltip skills={skillsArray.slice(5)}>
											<Badge
												variant="secondary"
												className={cn(
													TYPOGRAPHY.FONT_SIZE.xs,
													"cursor-help h-6 py-1",
												)}
											>
												+{skillsArray.length - 5}
											</Badge>
										</SkillsTooltip>
									)}
								</Div>
							)}

							{/* Email section */}
							{p.email && (
								<Div className="mt-4">
									<Tooltip delayDuration={200}>
										<TooltipTrigger asChild>
											<Link
												to="/support#contact"
												className={`${TYPOGRAPHY.FONT_SIZE.xs} text-primary hover:underline truncate block`}
											>
												{p.email.length > 30
													? `${p.email.substring(0, 30)}…`
													: p.email}
											</Link>
										</TooltipTrigger>
										<TooltipContent>{p.email}</TooltipContent>
									</Tooltip>
								</Div>
							)}
						</Div>
					</Div>
					{/* Relevance score badge (mobile only) */}
					{person.score > 0 && (
						<Div className={cn("md:hidden", "mt-4")}>
							<Badge
								variant="default"
								className={cn(
									// Typography
									TYPOGRAPHY.FONT_SIZE.xs,
									// Custom
									relevanceClass,
								)}
							>
								{(person.score * 100).toFixed(0)}%
							</Badge>
						</Div>
					)}
				</Div>
			</Card>
		);
	}

	// Grid / default card
	return (
		<Card fill className="hover:shadow-md transition-shadow flex flex-col">
			{/* Header gradient background - rounded-t-2xl matches Card's border radius */}
			{/* Without this, the gradient corners bleed past the card's rounded corners */}
			<Div className="bg-linear-to-r from-primary/5 to-primary/10 h-12 rounded-t-2xl" />
			{/* Main content container */}
			<Div className={cn("px-6", "pb-6", "flex-1 flex flex-col")}>
				{/* Avatar overlapping header */}
				<Div className={cn("flex justify-center -mt-8", "mb-4")}>
					<Avatar variant="nonagon" className="w-16 h-16">
						<AvatarFallback
							className={cn(
								// Colors
								"bg-primary dark:bg-primary text-primary-foreground",
								// Typography
								TYPOGRAPHY.FONT_WEIGHT.semibold,
							)}
						>
							{initials}
						</AvatarFallback>
					</Avatar>
				</Div>

				{/* Info section */}
				<Div className={cn("text-center", "mb-6")}>
					{/* Person name */}
					<Heading
						as="h3"
						className={cn(
							// Typography
							TYPOGRAPHY.COMBINATIONS.cardHeading,
							// Layout
							"truncate",
						)}
					>
						<TruncatedText text={p.name || "Unknown"} maxLength={25} />
					</Heading>
					{/* Person role */}
					<Text
						className={cn(
							// Typography
							TYPOGRAPHY.FONT_SIZE.sm,
							// Colors
							"text-muted-foreground",
							// Spacing
							"mt-1",
							// Layout
							"truncate",
						)}
					>
						<TruncatedText
							text={p.role || "No role specified"}
							maxLength={30}
						/>
					</Text>
					{/* Location and experience */}
					{(p.location || expYears > 0) && (
						<Text
							className={cn(
								// Typography
								TYPOGRAPHY.FONT_SIZE.xs,
								// Colors
								"text-muted-foreground",
								// Spacing
								"mt-2",
								// Layout
								"truncate",
							)}
						>
							<TruncatedText
								text={[p.location, expYears > 0 ? `${expYears} years` : null]
									.filter(Boolean)
									.join(" · ")}
								maxLength={35}
							/>
						</Text>
					)}
				</Div>

				{/* Skills section */}
				{skillsArray.length > 0 && (
					<Div className="mb-4">
						{/* Skills flex container */}
						<Div
							className={cn(
								"flex flex-wrap justify-center items-center",
								SPACING.GAP.xs,
							)}
						>
							{skillsArray.slice(0, 4).map((skill: string) => {
								const isTruncated = skill.length > 10;
								const badgeContent = isTruncated
									? `${skill.substring(0, 10)}…`
									: skill;

								const badge = (
									<Badge
										variant="secondary"
										className="text-xs truncate max-w-20 h-6 py-1 select-none"
									>
										{badgeContent}
									</Badge>
								);

								if (isTruncated) {
									return (
										<Tooltip key={skill} delayDuration={200}>
											<TooltipTrigger asChild>{badge}</TooltipTrigger>
											<TooltipContent variant="badge">{skill}</TooltipContent>
										</Tooltip>
									);
								}
								return (
									<Div key={skill} className="leading-none flex">
										{badge}
									</Div>
								);
							})}
							{skillsArray.length > 4 && (
								<SkillsTooltip skills={skillsArray.slice(4)}>
									<Badge
										variant="secondary"
										className={cn(
											// Typography
											TYPOGRAPHY.FONT_SIZE.xs,
											// Sizing
											"h-6 py-1",
											// States
											"cursor-help",
										)}
									>
										+{skillsArray.length - 4}
									</Badge>
								</SkillsTooltip>
							)}
						</Div>
					</Div>
				)}

				{/* Email section */}
				{p.email && (
					<Div
						className={cn(
							// Typography
							TYPOGRAPHY.FONT_SIZE.xs,
							// Layout
							"text-center flex-1 flex items-end justify-center",
							// Spacing
							"mb-6",
						)}
					>
						<Tooltip delayDuration={200}>
							<TooltipTrigger asChild>
								<Link
									to="/support#contact"
									className="text-primary hover:underline truncate block"
								>
									{p.email.length > 25
										? `${p.email.substring(0, 25)}…`
										: p.email}
								</Link>
							</TooltipTrigger>
							<TooltipContent>{p.email}</TooltipContent>{" "}
						</Tooltip>
					</Div>
				)}
				{/* Relevance section */}
				<Div className={cn("flex justify-center border-t", "pt-2")}>
					<Badge
						variant="default"
						className={cn(
							// Typography
							TYPOGRAPHY.FONT_SIZE.xs,
							// Custom
							relevanceClass,
						)}
					>
						{(person.score * 100).toFixed(0)}% Match
					</Badge>
				</Div>
			</Div>
		</Card>
	);
};
