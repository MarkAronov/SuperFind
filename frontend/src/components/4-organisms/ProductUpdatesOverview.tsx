import { ExternalLink, GitBranch, Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EXTERNAL_LINKS } from "@/constants/site";
import { formatRepoSize, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Link } from "../2-atoms/Link";
import { Section } from "../2-atoms/Section";
import { Span } from "../2-atoms/Span";
import { Text } from "../2-atoms/Text";
import { Card, CardContent } from "../3-molecules/Card";
import { PaginationButtons } from "../3-molecules/PaginationButtons";
import { ReleaseCard } from "../3-molecules/ReleaseCard";
import { StatCard } from "../3-molecules/StatCard";
import { Grid } from "../4-organisms/Grid";
import { primaryStats, secondaryStats } from "./ProductUpdatesOverview.data";
import type { ProductUpdatesOverviewProps } from "./ProductUpdatesOverview.types";

// Pagination constants
const RELEASES_PER_PAGE = 3;

/**
 * ProductUpdatesOverview Organism
 *
 * Responsive repository overview panel for product updates insights.
 * Uses wrapping, truncation, and min-width safeguards to avoid mobile overflow.
 */
export const ProductUpdatesOverview = ({
	stats,
	repoStats,
	releases,
	className,
}: ProductUpdatesOverviewProps) => {
	// Releases paging state.
	const [releasePage, setReleasePage] = useState(1);

	// Build one unified stats list so we can control final-row layout precisely.
	const combinedStats = useMemo(() => {
		// Primary stats values derived from overview + repository aggregates.
		const primaryStatsWithValues = primaryStats.map((stat) => {
			let value: string | number;

			switch (stat.valueKey) {
				case "latestVersion":
					value = `v${stats.latestVersion}`;
					break;
				case "totalReleases":
					value = stats.totalReleases;
					break;
				case "stableReleases":
					value = stats.stableReleases;
					break;
				case "totalCommits":
					value = repoStats.totalCommits || stats.prereleases;
					break;
				case "branches":
					value = repoStats.branches.length;
					break;
				case "contributors":
					value = repoStats.contributors.length;
					break;
				default:
					value = 0;
			}

			return {
				...stat,
				value,
			};
		});

		// Secondary stats values are only available when repository metadata exists.
		const secondaryStatsWithValues = repoStats.repo
			? secondaryStats.map((stat) => {
					const value =
						stat.valueKey === "license"
							? repoStats.repo?.license?.spdx_id || "N/A"
							: repoStats.repo?.[stat.valueKey as keyof typeof repoStats.repo];

					return {
						...stat,
						value: value as string | number,
					};
				})
			: [];

		return [...primaryStatsWithValues, ...secondaryStatsWithValues];
	}, [
		repoStats,
		stats.latestVersion,
		stats.prereleases,
		stats.stableReleases,
		stats.totalReleases,
	]);

	// Calculate releases pagination metrics.
	const releasesTotalPages = Math.max(
		1,
		Math.ceil(releases.length / RELEASES_PER_PAGE),
	);

	// Slice releases for current page (3 per page).
	const visibleReleases = useMemo(() => {
		const startIndex = (releasePage - 1) * RELEASES_PER_PAGE;
		return releases.slice(startIndex, startIndex + RELEASES_PER_PAGE);
	}, [releasePage, releases]);

	// Keep release page in a valid range when release count changes.
	useEffect(() => {
		if (releasePage > releasesTotalPages) {
			setReleasePage(releasesTotalPages);
		}
	}, [releasePage, releasesTotalPages]);

	return (
		<Section className={cn("min-w-0", className)}>
			<Card className="overflow-hidden min-w-0">
				<CardContent className="p-0 min-w-0">
					{/* Header section */}
					<Div className={cn("text-center", SPACING.PADDING.md, "sm:p-6")}>
						{/* Title */}
						<Div
							className={cn(
								"flex items-baseline justify-center",
								SPACING.GAP.sm,
								"mb-4",
							)}
						>
							<GitBranch className={cn(SIZING.ICON.lg, "text-primary")} />
							<Heading variant="section">Repository Overview</Heading>
						</Div>

						{/* Description */}
						<Text variant="lead" className="text-muted-foreground mb-6">
							Live data from GitHub — releases, commits, branches, and
							contributor activity
						</Text>

						{/* Action buttons */}
						<Div
							className={cn(
								"flex flex-wrap items-center justify-center",
								SPACING.GAP.sm,
							)}
						>
							<Button asChild>
								<Link href={EXTERNAL_LINKS.documentation} external>
									<ExternalLink className={SIZING.ICON.sm} />
									GitHub Repository
								</Link>
							</Button>
							<Button asChild variant="outline">
								<Link href={EXTERNAL_LINKS.releases} external>
									<Package className={SIZING.ICON.sm} />
									View All Releases
								</Link>
							</Button>
						</Div>
					</Div>

					{/* Repository stats grid */}
					<Grid
						columns={{ base: 2, md: 3, lg: 6 }}
						gap="md"
						stretchCards
						centerIncompleteRows
						containerClassName={cn(
							// Spacing
							SPACING.PADDING.md,
							"sm:p-6",
							// Safety
							"min-w-0",
						)}
					>
						{combinedStats.map((stat, index) => (
							<Div
								key={`stats-item-${stat.label}-${index}`}
								className="contents"
							>
								<StatCard
									icon={stat.icon}
									variant={stat.variant}
									label={stat.label}
									value={stat.value}
								/>
							</Div>
						))}
					</Grid>

					{/* Releases panel: 3 releases per page */}
					{releases.length > 0 && (
						<Div className={cn(SPACING.PADDING.md, "sm:p-6 min-w-0")}>
							{/* Releases header and pagination */}
							<Div
								className={cn(
									"flex flex-wrap items-center justify-between",
									SPACING.GAP.sm,
									"mb-3",
								)}
							>
								{/* Section title */}
								<Text className="font-semibold text-foreground">Releases</Text>

								{/* Pagination controls */}
								<Div
									className={cn(
										"flex items-center flex-wrap justify-end",
										SPACING.GAP.sm,
									)}
								>
									<PaginationButtons
										currentPage={releasePage}
										totalPages={releasesTotalPages}
										onPrevious={() =>
											setReleasePage((prev) => Math.max(1, prev - 1))
										}
										onNext={() =>
											setReleasePage((prev) =>
												Math.min(releasesTotalPages, prev + 1),
											)
										}
									/>
								</Div>
							</Div>

							{/* Release list */}
							<Div className="space-y-2 min-w-0">
								{visibleReleases.map((release, index) => (
									<ReleaseCard
										key={`${release.version}-${release.date}`}
										version={release.version}
										date={release.date}
										// Keep panel cards compact — expand/collapse handled inside the card
										changes={release.changes}
										url={release.url}
										isPrerelease={release.isPrerelease}
										isLatest={
											releasePage === 1 && index === 0 && !release.isPrerelease
										}
										compact
									/>
								))}
							</Div>
						</Div>
					)}

					{/* Repository metadata */}
					{repoStats.repo && (
						<Div className={cn(SPACING.PADDING.md, "sm:p-6 min-w-0")}>
							{/* Repository metadata */}
							<Div
								className={cn(
									"flex flex-wrap items-center",
									SPACING.GAP.sm,
									"pt-3",
								)}
							>
								<Text variant="small" className="text-muted-foreground">
									Size: {formatRepoSize(repoStats.repo.size)}
								</Text>
								<Span className="text-muted-foreground/40">·</Span>
								<Text variant="small" className="text-muted-foreground">
									Created: {formatShortDate(repoStats.repo.created_at)}
								</Text>
								<Span className="text-muted-foreground/40">·</Span>
								<Text variant="small" className="text-muted-foreground">
									Last push: {formatShortDate(repoStats.repo.pushed_at)}
								</Text>
							</Div>
						</Div>
					)}
				</CardContent>
			</Card>
		</Section>
	);
};

export type { ProductUpdatesOverviewProps };
