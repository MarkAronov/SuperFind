import { ChevronLeft, ChevronRight, GitCommit, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { EXTERNAL_LINKS } from "@/constants/site";
import { Card, CardContent } from "../atoms/Card";
import { Div } from "../atoms/Div";
import { Heading } from "../atoms/Heading";
import { Hero } from "../atoms/Hero";
import { Link } from "../atoms/Link";
import { List, ListItem } from "../atoms/List";
import { Span } from "../atoms/Span";
import { Text } from "../atoms/Text";
import { ErrorMessage } from "../molecules/ErrorMessage";
import { LoadingState } from "../molecules/LoadingState";
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
		<PageTemplate title="Changelog">
			{/* Hero Section */}
			<Hero
				title="Version"
				brand="Changelog"
				subtitle="Track the evolution of SkillVector with our version history"
			/>

			{/* Loading State */}
			{loading && <LoadingState message="Loading releases..." />}

			{/* Error State */}
			{error && (
				<ErrorMessage
					message={`Failed to load releases: ${error}`}
					className="mb-6"
				>
					<Text variant="small" className="mt-2">
						You can view releases directly on{" "}
						<Link href={EXTERNAL_LINKS.releases} external variant="primary">
							GitHub
						</Link>
					</Text>
				</ErrorMessage>
			)}

			{/* Releases */}
			{!loading && !error && (
				<>
					<List variant="spaced" className="mb-8">
						{currentReleases.length === 0 ? (
							<Card variant="hover">
								<CardContent centered>
									<Text variant="muted">No releases available yet.</Text>
								</CardContent>
							</Card>
						) : (
							currentReleases.map((release) => (
								<ListItem key={release.version}>
									<Card
										variant="hover"
										aria-label={`Version ${release.version}`}
									>
										<CardContent>
											<Div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
												<Div variant="flex">
													<Div className="text-primary">
														<Tag className="h-6 w-6" />
													</Div>
													<Div>
														<Heading
															as="h2"
															variant="card"
															className="flex items-center gap-2"
														>
															<Link
																href={release.url}
																external
																variant="default"
																className="hover:text-primary transition-colors"
															>
																v{release.version}
															</Link>
															{release.isPrerelease && (
																<Span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded">
																	Pre-release
																</Span>
															)}
														</Heading>
														<Text variant="small">
															{new Date(release.date).toLocaleDateString(
																"en-US",
																{
																	month: "long",
																	day: "numeric",
																	year: "numeric",
																},
															)}
														</Text>
													</Div>
												</Div>
											</Div>

											<List variant="spaced">
												{release.changes.map((change, idx) => (
													<ListItem
														variant="bullet"
														key={`${release.version}-${idx}`}
													>
														<GitCommit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
														<Text variant="muted">{change}</Text>
													</ListItem>
												))}
											</List>
										</CardContent>
									</Card>
								</ListItem>
							))
						)}
					</List>

					{/* Pagination */}
					{totalPages > 1 && (
						<Div className="flex items-center justify-center gap-2 mb-16">
							<button
								type="button"
								onClick={() => goToPage(currentPage - 1)}
								disabled={currentPage === 1}
								className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								aria-label="Previous page"
							>
								<ChevronLeft className="h-5 w-5" />
							</button>

							<Div className="flex items-center gap-1">
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
													<Span
														key={page}
														className="px-2 text-muted-foreground"
													>
														...
													</Span>
												);
											}
											return null;
										}

										return (
											<button
												key={page}
												type="button"
												onClick={() => goToPage(page)}
												className={`min-w-10 h-10 rounded-lg border transition-colors ${
													page === currentPage
														? "bg-primary text-primary-foreground border-primary"
														: "border-border hover:bg-muted"
												}`}
												aria-label={`Go to page ${page}`}
												aria-current={page === currentPage ? "page" : undefined}
											>
												{page}
											</button>
										);
									},
								)}
							</Div>

							<button
								type="button"
								onClick={() => goToPage(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								aria-label="Next page"
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</Div>
					)}
				</>
			)}

			{/* CTA Section */}
			<Card
				aria-label="View releases on GitHub"
				className="text-center p-8 lg:p-12"
			>
				<Heading variant="section" className="mb-4">
					Stay Updated
				</Heading>
				<Text variant="lead" className="text-muted-foreground mb-6">
					Follow our GitHub repository for the latest updates and releases
				</Text>
			</Card>
		</PageTemplate>
	);
};
