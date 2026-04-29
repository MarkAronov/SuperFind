import {
	Bug,
	ChevronLeft,
	ChevronRight,
	Code2,
	ExternalLink,
	Eye,
	GitBranch,
	GitCommit,
	GitFork,
	Package,
	Shield,
	Star,
	Tag,
	TrendingUp,
	Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EXTERNAL_LINKS } from "@/constants/site";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { CHART_COLORS } from "../1-ions/colors";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Badge } from "../2-atoms/Badge";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Link } from "../2-atoms/Link";
import { Section } from "../2-atoms/Section";
import { Span } from "../2-atoms/Span";
import { Text } from "../2-atoms/Text";
import { Card, CardContent } from "../3-molecules/Card";
import { FilterPanel } from "../3-molecules/FilterPanel";
import { ReleaseCard } from "../3-molecules/ReleaseCard";
import { StatCard } from "../3-molecules/StatCard";
import type {
	ProductUpdatesCommit,
	ProductUpdatesOverviewProps,
} from "./ProductUpdatesOverview.types";

const GITHUB_API = "https://api.github.com/repos/MarkAronov/SkillVector";

const RELEASES_PER_PAGE = 3;
const BRANCHES_PER_PAGE = 3;
const COMMITS_PER_PAGE = 3;

// Format repository size from KB to readable units.
const formatRepoSize = (sizeKB: number): string => {
	if (sizeKB >= 1024 * 1024) return `${(sizeKB / (1024 * 1024)).toFixed(1)} GB`;
	if (sizeKB >= 1024) return `${(sizeKB / 1024).toFixed(1)} MB`;
	return `${sizeKB} KB`;
};

// Convert language byte totals to sorted percentages.
const formatLanguages = (
	languages: Record<string, number>,
): { name: string; percentage: number; bytes: number }[] => {
	const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
	if (total === 0) return [];

	return Object.entries(languages)
		.map(([name, bytes]) => ({
			name,
			// Keep full precision for stable bar width math on small screens.
			percentage: (bytes / total) * 100,
			bytes,
		}))
		.sort((a, b) => b.bytes - a.bytes);
};

// Format percentage display while keeping bar calculations precise.
const formatLanguagePercentage = (value: number): string => {
	const rounded = Math.round(value * 10) / 10;
	return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
};

// Cycle chart colors for language bars and legend dots.
const getChartColor = (index: number): string =>
	CHART_COLORS[index % CHART_COLORS.length];

interface PagerControlsProps {
	currentPage: number;
	totalPages: number;
	onPrevious: () => void;
	onNext: () => void;
}

// Reusable pager controls for branches, commits, and releases sections.
const PagerControls = ({
	currentPage,
	totalPages,
	onPrevious,
	onNext,
}: PagerControlsProps) => {
	return (
		<Div className={cn("flex items-center", SPACING.GAP.xs)}>
			<Button
				type="button"
				variant="outline"
				size="icon"
				onClick={onPrevious}
				disabled={currentPage === 1}
			>
				<ChevronLeft className={SIZING.ICON.sm} />
			</Button>
			<Text variant="small" className="text-muted-foreground">
				{currentPage}/{totalPages}
			</Text>
			<Button
				type="button"
				variant="outline"
				size="icon"
				onClick={onNext}
				disabled={currentPage === totalPages}
			>
				<ChevronRight className={SIZING.ICON.sm} />
			</Button>
		</Div>
	);
};

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
	// Panel mode toggle state (Branches or Releases).
	const [panelView, setPanelView] = useState<"branches" | "releases">(
		"branches",
	);

	// Branch paging state.
	const [branchPage, setBranchPage] = useState(1);

	// Releases paging state.
	const [releasePage, setReleasePage] = useState(1);

	// Branch-specific commits state.
	const [selectedBranch, setSelectedBranch] = useState(
		repoStats.repo?.default_branch || repoStats.branches[0]?.name || "",
	);
	const [branchCommits, setBranchCommits] = useState<ProductUpdatesCommit[]>(
		[],
	);
	const [commitsPage, setCommitsPage] = useState(1);
	const [commitsLoading, setCommitsLoading] = useState(false);

	// Precompute languages once for reuse in bar and legend.
	const languages = formatLanguages(repoStats.languages);

	// Limit the visualization to top languages so segment widths remain readable on mobile.
	const topLanguages = languages.slice(0, 6);

	// Normalize visible segments to 100% to avoid any cutoff from percentage rounding drift.
	const topLanguagesTotalBytes = topLanguages.reduce(
		(sum, language) => sum + language.bytes,
		0,
	);

	// Calculate branches pagination metrics.
	const branchesTotalPages = Math.max(
		1,
		Math.ceil(repoStats.branches.length / BRANCHES_PER_PAGE),
	);

	// Slice branches for current page (3 per page).
	const visibleBranches = useMemo(() => {
		const startIndex = (branchPage - 1) * BRANCHES_PER_PAGE;
		return repoStats.branches.slice(startIndex, startIndex + BRANCHES_PER_PAGE);
	}, [branchPage, repoStats.branches]);

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

	// Calculate branch commit pagination metrics.
	const commitsTotalPages = Math.max(
		1,
		Math.ceil(branchCommits.length / COMMITS_PER_PAGE),
	);

	// Slice commits for current page (3 per page).
	const visibleCommits = useMemo(() => {
		const startIndex = (commitsPage - 1) * COMMITS_PER_PAGE;
		return branchCommits.slice(startIndex, startIndex + COMMITS_PER_PAGE);
	}, [branchCommits, commitsPage]);

	// Keep selected branch synced when repo branch data changes.
	useEffect(() => {
		if (!selectedBranch && repoStats.branches.length > 0) {
			setSelectedBranch(
				repoStats.repo?.default_branch || repoStats.branches[0].name,
			);
		}
	}, [repoStats.branches, repoStats.repo?.default_branch, selectedBranch]);

	// Keep branch page in a valid range when branch count changes.
	useEffect(() => {
		if (branchPage > branchesTotalPages) {
			setBranchPage(branchesTotalPages);
		}
	}, [branchPage, branchesTotalPages]);

	// Keep release page in a valid range when release count changes.
	useEffect(() => {
		if (releasePage > releasesTotalPages) {
			setReleasePage(releasesTotalPages);
		}
	}, [releasePage, releasesTotalPages]);

	// Keep commit page in a valid range when commit count changes.
	useEffect(() => {
		if (commitsPage > commitsTotalPages) {
			setCommitsPage(commitsTotalPages);
		}
	}, [commitsPage, commitsTotalPages]);

	// Fetch commits for the selected branch and reset commit paging.
	useEffect(() => {
		const loadBranchCommits = async () => {
			if (!selectedBranch) {
				setBranchCommits(repoStats.recentCommits);
				return;
			}

			setCommitsLoading(true);

			try {
				const response = await fetch(
					`${GITHUB_API}/commits?sha=${encodeURIComponent(selectedBranch)}&per_page=30`,
				);

				if (!response.ok) {
					setBranchCommits(repoStats.recentCommits);
					return;
				}

				const commits = (await response.json()) as ProductUpdatesCommit[];
				setBranchCommits(commits);
			} catch {
				// Fallback to preloaded recent commits if branch-specific fetch fails.
				setBranchCommits(repoStats.recentCommits);
			} finally {
				setCommitsLoading(false);
				setCommitsPage(1);
			}
		};

		loadBranchCommits();
	}, [repoStats.recentCommits, selectedBranch]);

	return (
		<Section className={cn("min-w-0", className)}>
			<Card className="overflow-hidden min-w-0">
				<CardContent className="p-0 min-w-0">
					{/* Top panel with title + actions */}
					<FilterPanel
						icon={<GitBranch className={cn(SIZING.ICON.lg, "text-primary")} />}
						title="Repository Overview"
						description="Live data from GitHub — releases, commits, branches, and contributor activity"
						primaryAction={{
							label: "GitHub Repository",
							href: EXTERNAL_LINKS.documentation,
							icon: <ExternalLink className={SIZING.ICON.sm} />,
						}}
						secondaryAction={{
							label: "View All Releases",
							href: EXTERNAL_LINKS.releases,
							icon: <Package className={SIZING.ICON.sm} />,
						}}
					/>

					{/* Primary release/repo stats */}
					<Div
						className={cn(
							"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
							SPACING.PADDING.md,
							"sm:p-6",
							SPACING.GAP.md,
							"border-b border-border/50 min-w-0",
						)}
					>
						<StatCard
							icon={Tag}
							variant="primary"
							label="Latest Version"
							value={`v${stats.latestVersion}`}
						/>
						<StatCard
							icon={Package}
							variant="secondary"
							label="Total Releases"
							value={stats.totalReleases}
						/>
						<StatCard
							icon={TrendingUp}
							variant="success"
							label="Stable Releases"
							value={stats.stableReleases}
						/>
						<StatCard
							icon={GitCommit}
							variant="warning"
							label="Total Commits"
							value={repoStats.totalCommits || stats.prereleases}
						/>
						<StatCard
							icon={GitBranch}
							variant="accent"
							label="Branches"
							value={repoStats.branches.length}
						/>
						<StatCard
							icon={Users}
							variant="muted"
							label="Contributors"
							value={repoStats.contributors.length}
						/>
					</Div>

					{/* Secondary GitHub metadata stats */}
					{repoStats.repo && (
						<Div
							className={cn(
								"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
								SPACING.PADDING.md,
								"sm:p-6",
								SPACING.GAP.md,
								"border-b border-border/50 min-w-0",
							)}
						>
							<StatCard
								icon={Star}
								variant="warning"
								label="Stars"
								value={repoStats.repo.stargazers_count}
							/>
							<StatCard
								icon={GitFork}
								variant="secondary"
								label="Forks"
								value={repoStats.repo.forks_count}
							/>
							<StatCard
								icon={Eye}
								variant="primary"
								label="Watchers"
								value={repoStats.repo.watchers_count}
							/>
							<StatCard
								icon={Bug}
								variant="destructive"
								label="Open Issues"
								value={repoStats.repo.open_issues_count}
							/>
							<StatCard
								icon={Shield}
								variant="success"
								label="License"
								value={repoStats.repo.license?.spdx_id || "N/A"}
							/>
						</Div>
					)}

					{/* Language usage section */}
					{topLanguages.length > 0 && (
						<Div
							className={cn(
								SPACING.PADDING.md,
								"sm:p-6 border-b border-border/50 min-w-0",
							)}
						>
							<Div className={cn("flex items-center", SPACING.GAP.sm, "mb-3")}>
								<Code2 className={cn(SIZING.ICON.md, "text-primary")} />
								<Text className={cn(TYPOGRAPHY.FONT_WEIGHT.semibold)}>
									Languages
								</Text>
							</Div>

							<Div
								className={cn(
									"flex w-full overflow-hidden",
									BORDERS.RADIUS.full,
									"h-3",
								)}
							>
								{topLanguages.map((lang, index) => (
									<Div
										key={lang.name}
										className="transition-all duration-300"
										style={{
											// Bar width uses normalized values so total width is exactly 100%.
											width: `${(lang.bytes / topLanguagesTotalBytes) * 100}%`,
											backgroundColor: getChartColor(index),
										}}
										title={`${lang.name}: ${formatLanguagePercentage(lang.percentage)}%`}
									/>
								))}
							</Div>

							<Div
								className={cn(
									// Use stacked full-width legend rows on mobile to prevent cutoff.
									"grid grid-cols-1 sm:flex sm:flex-wrap items-start sm:items-center min-w-0",
									SPACING.GAP.sm,
									"mt-3",
								)}
							>
								{topLanguages.map((lang, index) => (
									<Div
										key={lang.name}
										className={cn(
											"flex w-full min-w-0 items-center",
											SPACING.GAP.xs,
											// Keep compact inline chips from small breakpoint and above.
											"sm:w-auto",
										)}
									>
										<Div
											className="h-2.5 w-2.5 rounded-full shrink-0"
											style={{ backgroundColor: getChartColor(index) }}
										/>
										<Text
											variant="small"
											className="text-muted-foreground min-w-0 wrap-break-word"
										>
											{lang.name}
										</Text>
										<Text
											variant="small"
											className={cn(
												"text-foreground shrink-0",
												TYPOGRAPHY.FONT_WEIGHT.medium,
											)}
										>
											{formatLanguagePercentage(lang.percentage)}%
										</Text>
									</Div>
								))}
							</Div>
						</Div>
					)}

					{/* Branches panel: 3 rows per page + branch-select-driven commits */}
					{panelView === "branches" && repoStats.branches.length > 0 && (
						<>
							<Div
								className={cn(
									SPACING.PADDING.md,
									"sm:p-6 border-b border-border/50 min-w-0",
								)}
							>
								<Div
									className={cn(
										"flex flex-wrap items-center justify-between",
										SPACING.GAP.sm,
										"mb-3",
									)}
								>
									<Div
										className={cn(
											"flex items-center flex-wrap",
											SPACING.GAP.sm,
										)}
									>
										{/* Left-aligned toggle replaces standalone title and includes counts */}
										<Button
											type="button"
											variant="default"
											className={cn("h-8 px-3", BORDERS.RADIUS.full)}
										>
											<GitBranch className={cn(SIZING.ICON.xs, "mr-1")} />
											Branches ({repoStats.branches.length})
										</Button>
										<Button
											type="button"
											variant="ghost"
											onClick={() => setPanelView("releases")}
											className={cn("h-8 px-3", BORDERS.RADIUS.full)}
										>
											<Package className={cn(SIZING.ICON.xs, "mr-1")} />
											Releases ({releases.length})
										</Button>
									</Div>

									{/* Keep paging controls on the right */}
									<Div
										className={cn(
											"flex items-center flex-wrap justify-end",
											SPACING.GAP.sm,
										)}
									>
										{/* Shared pager controls */}
										<PagerControls
											currentPage={branchPage}
											totalPages={branchesTotalPages}
											onPrevious={() =>
												setBranchPage((prev) => Math.max(1, prev - 1))
											}
											onNext={() =>
												setBranchPage((prev) =>
													Math.min(branchesTotalPages, prev + 1),
												)
											}
										/>
									</Div>
								</Div>

								<Div className={cn("grid grid-cols-1 min-w-0", SPACING.GAP.sm)}>
									{visibleBranches.map((branch) => {
										// Highlight selected branch for commit filtering context.
										const isSelected = branch.name === selectedBranch;
										const isDefault =
											branch.name === repoStats.repo?.default_branch;

										return (
											<Div
												key={branch.name}
												className={cn(
													// SearchBar-like shell: pill container with stronger height and balanced spacing.
													"flex w-full min-w-0 items-center overflow-hidden",
													"h-12",
													BORDERS.RADIUS.full,
													isSelected
														? "bg-primary/12 border border-primary/30"
														: "bg-muted/35 border border-border/50",
													// Add subtle depth similar to the search field treatment.
													"shadow-sm",
												)}
											>
												{/* Selection action to load commits for this branch */}
												<Button
													type="button"
													variant="ghost"
													onClick={() => setSelectedBranch(branch.name)}
													className={cn(
														// Keep branch label area roomy and tappable, like SearchBar input zone.
														"h-12 min-w-0 flex-1 justify-start rounded-none px-4 py-0",
														TYPOGRAPHY.FONT_SIZE.xs,
														TYPOGRAPHY.FONT_WEIGHT.medium,
														"hover:bg-transparent",
													)}
												>
													<GitBranch
														className={cn(SIZING.ICON.xs, "shrink-0 mr-2")}
													/>
													<Span className="min-w-0 flex-1 break-all sm:break-normal">
														{branch.name}
													</Span>
												</Button>

												{/* Divider mirrors SearchBar's input/action separator for clearer visual structure. */}
												<Div className="h-8 w-px bg-border/70" />

												<Div
													className={cn(
														// Right-side controls are grouped as a compact action zone.
														"flex h-12 items-center px-3",
														SPACING.GAP.xs,
													)}
												>
													{isDefault && (
														<Badge
															variant="outline"
															className="text-[10px] h-5 px-1.5"
														>
															default
														</Badge>
													)}
													{branch.protected && (
														<Shield
															className={cn(
																SIZING.ICON.xs,
																"text-success shrink-0",
															)}
														/>
													)}
													{/* Keep branch row clickable externally to GitHub */}
													<Link
														href={`${EXTERNAL_LINKS.documentation}/tree/${branch.name}`}
														external
														className={cn(
															// Keep action button-like styling without over-thinning the row.
															TYPOGRAPHY.FONT_SIZE.xs,
															"rounded-md px-2 py-1 text-primary hover:bg-primary/10 no-underline",
														)}
													>
														Open
													</Link>
												</Div>
											</Div>
										);
									})}
								</Div>
							</Div>

							{/* Commits for selected branch: 3 per page */}
							<Div
								className={cn(
									SPACING.PADDING.md,
									"sm:p-6 border-b border-border/50 min-w-0",
								)}
							>
								<Div
									className={cn(
										"flex flex-wrap items-center justify-between",
										SPACING.GAP.sm,
										"mb-3",
									)}
								>
									<Div className={cn("flex items-center", SPACING.GAP.sm)}>
										<GitCommit className={cn(SIZING.ICON.md, "text-primary")} />
										<Text className={cn(TYPOGRAPHY.FONT_WEIGHT.semibold)}>
											Commits: {selectedBranch || "Selected Branch"}
										</Text>
									</Div>

									{/* Shared pager controls */}
									<PagerControls
										currentPage={commitsPage}
										totalPages={commitsTotalPages}
										onPrevious={() =>
											setCommitsPage((prev) => Math.max(1, prev - 1))
										}
										onNext={() =>
											setCommitsPage((prev) =>
												Math.min(commitsTotalPages, prev + 1),
											)
										}
									/>
								</Div>

								{commitsLoading ? (
									<Text variant="small" className="text-muted-foreground">
										Loading commits for selected branch...
									</Text>
								) : (
									<Div className="space-y-2 min-w-0">
										{/* Empty state for selected branch commit list */}
										{visibleCommits.length === 0 && (
											<Text variant="small" className="text-muted-foreground">
												No commits found for this branch.
											</Text>
										)}

										{visibleCommits.map((commit) => {
											const message = commit.commit.message.split("\n")[0];
											const shortSha = commit.sha.substring(0, 7);

											return (
												<Link
													key={commit.sha}
													href={commit.html_url}
													external
													className={cn(
														// Card-like commit rows improve scanability and visual hierarchy.
														"flex w-full items-start min-w-0 border border-border/50 bg-muted/25",
														SPACING.GAP.sm,
														"p-2.5",
														BORDERS.RADIUS.lg,
														"hover:bg-muted/50 hover:border-primary/30 transition-colors group",
													)}
												>
													{/* Commit author avatar */}
													{commit.author ? (
														<img
															src={commit.author.avatar_url}
															alt={commit.author.login}
															className={cn(
																SIZING.ICON.lg,
																"rounded-full shrink-0 mt-0.5",
															)}
														/>
													) : (
														<Div
															className={cn(
																SIZING.ICON.lg,
																"rounded-full bg-muted shrink-0 mt-0.5 flex items-center justify-center",
															)}
														>
															<GitCommit
																className={cn(
																	SIZING.ICON.xs,
																	"text-muted-foreground",
																)}
															/>
														</Div>
													)}

													<Div className="flex-1 min-w-0">
														<Text
															variant="small"
															className={cn(
																"text-foreground block min-w-0 wrap-break-word sm:truncate",
																TYPOGRAPHY.FONT_WEIGHT.medium,
																"group-hover:text-primary transition-colors",
															)}
														>
															{message}
														</Text>

														<Div
															className={cn(
																"flex flex-col sm:flex-row sm:items-center",
																SPACING.GAP.xs,
																"mt-0.5 min-w-0",
															)}
														>
															<Text
																variant="small"
																className="text-muted-foreground min-w-0 wrap-break-word"
															>
																{commit.author?.login ||
																	commit.commit.author.name}
															</Text>
															<Span className="text-muted-foreground/40 hidden sm:inline">
																·
															</Span>
															<Text
																variant="small"
																className={cn(
																	"text-muted-foreground font-mono shrink-0",
																	TYPOGRAPHY.FONT_SIZE.xs,
																)}
															>
																{shortSha}
															</Text>
															<Span className="text-muted-foreground/40 hidden sm:inline">
																·
															</Span>
															<Text
																variant="small"
																className="text-muted-foreground"
															>
																{new Date(
																	commit.commit.author.date,
																).toLocaleDateString("en-US", {
																	month: "short",
																	day: "numeric",
																})}
															</Text>
														</Div>
													</Div>
												</Link>
											);
										})}
									</Div>
								)}
							</Div>
						</>
					)}

					{/* Releases panel: 3 releases per page and 3 lines per release */}
					{panelView === "releases" && releases.length > 0 && (
						<Div
							className={cn(
								SPACING.PADDING.md,
								"sm:p-6 border-b border-border/50 min-w-0",
							)}
						>
							<Div
								className={cn(
									"flex flex-wrap items-center justify-between",
									SPACING.GAP.sm,
									"mb-3",
								)}
							>
								<Div
									className={cn("flex items-center flex-wrap", SPACING.GAP.sm)}
								>
									{/* Left-aligned toggle replaces standalone title and includes counts */}
									<Button
										type="button"
										variant="ghost"
										onClick={() => setPanelView("branches")}
										className={cn("h-8 px-3", BORDERS.RADIUS.full)}
									>
										<GitBranch className={cn(SIZING.ICON.xs, "mr-1")} />
										Branches ({repoStats.branches.length})
									</Button>
									<Button
										type="button"
										variant="default"
										className={cn("h-8 px-3", BORDERS.RADIUS.full)}
									>
										<Package className={cn(SIZING.ICON.xs, "mr-1")} />
										Releases ({releases.length})
									</Button>
								</Div>

								{/* Keep paging controls on the right */}
								<Div
									className={cn(
										"flex items-center flex-wrap justify-end",
										SPACING.GAP.sm,
									)}
								>
									{/* Shared pager controls */}
									<PagerControls
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

							<Div className="space-y-2 min-w-0">
								{visibleReleases.map((release, index) => (
									<ReleaseCard
										key={`${release.version}-${release.date}`}
										version={release.version}
										date={release.date}
										// Keep panel cards compact by limiting to 3 lines.
										changes={release.changes.slice(0, 3)}
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

					{/* Contributors + repo metadata */}
					{repoStats.contributors.length > 0 && (
						<Div className={cn(SPACING.PADDING.md, "sm:p-6 min-w-0")}>
							<Div className={cn("flex items-center", SPACING.GAP.sm, "mb-3")}>
								<Users className={cn(SIZING.ICON.md, "text-primary")} />
								<Text className={cn(TYPOGRAPHY.FONT_WEIGHT.semibold)}>
									Top Contributors
								</Text>
							</Div>

							<Div className={cn("flex flex-wrap min-w-0", SPACING.GAP.sm)}>
								{repoStats.contributors.slice(0, 12).map((contributor) => (
									<Link
										key={contributor.login}
										href={contributor.html_url}
										external
										className={cn(
											"inline-flex max-w-full items-center",
											SPACING.GAP.xs,
											"pl-1 pr-3 py-1",
											BORDERS.RADIUS.full,
											"bg-muted/40 hover:bg-muted border border-border/50",
											"transition-colors group",
										)}
									>
										<img
											src={contributor.avatar_url}
											alt={contributor.login}
											className={cn(SIZING.ICON.lg, "rounded-full")}
										/>
										<Span className="max-w-32 truncate sm:max-w-48">
											<Text
												variant="small"
												className={cn(
													TYPOGRAPHY.FONT_WEIGHT.medium,
													"group-hover:text-primary transition-colors",
												)}
											>
												{contributor.login}
											</Text>
										</Span>
										<Badge
											variant="secondary"
											className="text-[10px] px-1.5 py-0 h-4"
										>
											{contributor.contributions}
										</Badge>
									</Link>
								))}
							</Div>

							{repoStats.repo && (
								<Div
									className={cn(
										"flex flex-wrap items-center",
										SPACING.GAP.sm,
										"mt-4 pt-3 border-t border-border/30",
									)}
								>
									<Text variant="small" className="text-muted-foreground">
										Size: {formatRepoSize(repoStats.repo.size)}
									</Text>
									<Span className="text-muted-foreground/40">·</Span>
									<Text variant="small" className="text-muted-foreground">
										Created:{" "}
										{new Date(repoStats.repo.created_at).toLocaleDateString(
											"en-US",
											{
												month: "short",
												day: "numeric",
												year: "numeric",
											},
										)}
									</Text>
									<Span className="text-muted-foreground/40">·</Span>
									<Text variant="small" className="text-muted-foreground">
										Last push:{" "}
										{new Date(repoStats.repo.pushed_at).toLocaleDateString(
											"en-US",
											{
												month: "short",
												day: "numeric",
												year: "numeric",
											},
										)}
									</Text>
								</Div>
							)}
						</Div>
					)}
				</CardContent>
			</Card>
		</Section>
	);
};

export type { ProductUpdatesOverviewProps };
