import { ChevronLeft, ChevronRight, GitCommit, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { EXTERNAL_LINKS } from "@/constants/site";
import { ActionButton } from "../atoms/ActionButton";
import { Card } from "../atoms/Card";
import { PageTemplate } from "../templates/PageTemplate";

interface GitHubRelease {
	id: number;
	tag_name: string;
	name: string;
	body: string;
	published_at: string;
	html_url: string;
	draft: boolean;
	prerelease: boolean;
}

interface ParsedRelease {
	version: string;
	date: string;
	changes: string[];
	url: string;
	isPrerelease: boolean;
}

const RELEASES_PER_PAGE = 10;

export const ChangelogPage = () => {
	const [releases, setReleases] = useState<ParsedRelease[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const fetchReleases = async () => {
			try {
				const response = await fetch(
					"https://api.github.com/repos/MarkAronov/SkillVector/releases",
				);
				if (!response.ok) {
					throw new Error("Failed to fetch releases");
				}
				const data = (await response.json()) as GitHubRelease[];

				// Parse releases
				const parsed: ParsedRelease[] = data
					.filter((r) => !r.draft)
					.map((release) => {
						// Parse body for bullet points
						const changes = release.body
							.split("\n")
							.filter((line) => {
								const trimmed = line.trim();
								return (
									trimmed.startsWith("-") ||
									trimmed.startsWith("*") ||
									trimmed.startsWith("•")
								);
							})
							.map((line) =>
								line
									.trim()
									.replace(/^[-*•]\s*/, "")
									.trim(),
							)
							.filter((line) => line.length > 0);

						return {
							version: release.tag_name.replace(/^v/, ""),
							date: release.published_at.split("T")[0],
							changes:
								changes.length > 0 ? changes : ["Release notes not available"],
							url: release.html_url,
							isPrerelease: release.prerelease,
						};
					});

				setReleases(parsed);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
			}
		};

		fetchReleases();
	}, []);

	// Calculate pagination
	const totalPages = Math.ceil(releases.length / RELEASES_PER_PAGE);
	const startIndex = (currentPage - 1) * RELEASES_PER_PAGE;
	const endIndex = startIndex + RELEASES_PER_PAGE;
	const currentReleases = releases.slice(startIndex, endIndex);

	const goToPage = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<PageTemplate className="bg-transparent" title="Changelog">
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							Changelog
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Track the evolution of SkillVector with our version history
					</p>
				</div>

				{/* Loading State */}
				{loading && (
					<div className="text-center py-12">
						<p className="text-muted-foreground">Loading releases...</p>
					</div>
				)}

				{/* Error State */}
				{error && (
					<Card className="p-6 mb-6 border-destructive">
						<p className="text-destructive">Failed to load releases: {error}</p>
						<p className="text-muted-foreground text-sm mt-2">
							You can view releases directly on{" "}
							<a
								href={EXTERNAL_LINKS.releases}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								GitHub
							</a>
						</p>
					</Card>
				)}

				{/* Releases */}
				{!loading && !error && (
					<>
						<ul className="space-y-6 mb-8">
							{currentReleases.length === 0 ? (
								<Card className="p-6 text-center">
									<p className="text-muted-foreground">
										No releases available yet.
									</p>
								</Card>
							) : (
								currentReleases.map((release) => (
									<li key={release.version}>
										<Card
											aria-label={`Version ${release.version}`}
											className="p-6 hover:shadow-lg transition-shadow"
										>
											<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
												<div className="flex items-center gap-3">
													<div className="text-primary">
														<Tag className="h-6 w-6" />
													</div>
													<div>
														<h2 className="text-xl font-semibold flex items-center gap-2">
															<a
																href={release.url}
																target="_blank"
																rel="noopener noreferrer"
																className="hover:text-primary transition-colors"
															>
																v{release.version}
															</a>
															{release.isPrerelease && (
																<span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded">
																	Pre-release
																</span>
															)}
														</h2>
														<p className="text-sm text-muted-foreground">
															{new Date(release.date).toLocaleDateString(
																"en-US",
																{
																	month: "long",
																	day: "numeric",
																	year: "numeric",
																},
															)}
														</p>
													</div>
												</div>
											</div>

											<ul className="space-y-3">
												{release.changes.map((change, idx) => (
													<li
														key={`${release.version}-${idx}`}
														className="flex gap-3 text-muted-foreground"
													>
														<GitCommit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
														<span>{change}</span>
													</li>
												))}
											</ul>
										</Card>
									</li>
								))
							)}
						</ul>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-center gap-2 mb-16">
								<button
									type="button"
									onClick={() => goToPage(currentPage - 1)}
									disabled={currentPage === 1}
									className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									aria-label="Previous page"
								>
									<ChevronLeft className="h-5 w-5" />
								</button>

								<div className="flex items-center gap-1">
									{Array.from({ length: totalPages }, (_, i) => i + 1).map(
										(page) => {
											// Show first page, last page, current page, and pages around current
											const showPage =
												page === 1 ||
												page === totalPages ||
												Math.abs(page - currentPage) <= 1;

											if (!showPage) {
												// Show ellipsis for skipped pages
												if (
													page === currentPage - 2 ||
													page === currentPage + 2
												) {
													return (
														<span
															key={page}
															className="px-2 text-muted-foreground"
														>
															...
														</span>
													);
												}
												return null;
											}

											return (
												<button
													key={page}
													type="button"
													onClick={() => goToPage(page)}
													className={`min-w-[2.5rem] h-10 rounded-lg border transition-colors ${
														page === currentPage
															? "bg-primary text-primary-foreground border-primary"
															: "border-border hover:bg-muted"
													}`}
													aria-label={`Go to page ${page}`}
													aria-current={
														page === currentPage ? "page" : undefined
													}
												>
													{page}
												</button>
											);
										},
									)}
								</div>

								<button
									type="button"
									onClick={() => goToPage(currentPage + 1)}
									disabled={currentPage === totalPages}
									className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									aria-label="Next page"
								>
									<ChevronRight className="h-5 w-5" />
								</button>
							</div>
						)}
					</>
				)}

				{/* CTA Section */}
				<Card
					aria-label="View releases on GitHub"
					className="text-center p-8 lg:p-12 hover:shadow-lg transition-shadow"
				>
					<h2 className="text-2xl lg:text-3xl font-bold mb-4">Stay Updated</h2>
					<p className="text-base lg:text-xl text-muted-foreground mb-6">
						Follow our GitHub repository for the latest updates and releases
					</p>
					<ActionButton
						href={EXTERNAL_LINKS.releases}
						aria-label="View Changelog on GitHub"
					>
						View on GitHub
					</ActionButton>
				</Card>
			</div>
		</PageTemplate>
	);
};
