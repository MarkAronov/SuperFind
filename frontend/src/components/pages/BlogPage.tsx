import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Card } from "../atoms/Card";
import { PageTemplate } from "../templates/PageTemplate";

export const BlogPage = () => {
	const posts = [
		{
			title: "Introducing SkillVector: AI-Powered Professional Search",
			excerpt:
				"Learn how we're revolutionizing talent discovery with vector embeddings and semantic search technology.",
			date: "2024-11-15",
			readTime: "5 min read",
			category: "Product",
		},
		{
			title: "Understanding Vector Embeddings for Skills Matching",
			excerpt:
				"A deep dive into how AI embeddings capture the semantic relationships between skills and experience.",
			date: "2024-11-10",
			readTime: "8 min read",
			category: "Technical",
		},
		{
			title: "Choosing the Right AI Provider for Your Use Case",
			excerpt:
				"Comparing OpenAI, Anthropic, Gemini, and other embedding models for professional search.",
			date: "2024-11-05",
			readTime: "6 min read",
			category: "Guide",
		},
		{
			title: "Scaling Vector Search with Qdrant",
			excerpt:
				"Best practices for deploying high-performance vector databases in production environments.",
			date: "2024-10-28",
			readTime: "7 min read",
			category: "Technical",
		},
	];

	return (
		<PageTemplate className="bg-transparent">
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							Blog
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Insights on AI, vector search, and the future of talent discovery
					</p>
				</div>

				{/* Blog Posts */}
				<ul className="space-y-6 mb-16">
					{posts.map((post) => (
						<li key={post.date + post.title}>
							<Card
								aria-label={post.title}
								className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
							>
								<div className="flex flex-wrap items-center gap-3 mb-3">
									<span className="px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded text-sm font-medium">
										{post.category}
									</span>
									<div className="flex items-center gap-4 text-sm text-muted-foreground">
										<span className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											{new Date(post.date).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</span>
										<span className="flex items-center gap-1">
											<Clock className="h-4 w-4" />
											{post.readTime}
										</span>
									</div>
								</div>
								<h2 className="text-xl font-semibold mb-2 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
									{post.title}
								</h2>
								<p className="text-muted-foreground mb-4">{post.excerpt}</p>
								<div className="flex items-center gap-2 text-primary dark:text-primary font-medium">
									Read More
									<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</div>
							</Card>
						</li>
					))}
				</ul>

				{/* Newsletter CTA */}
				<Card
					aria-label="Newsletter subscription"
					className="text-center p-8 lg:p-12 hover:shadow-lg transition-shadow"
				>
					<h2 className="text-2xl lg:text-3xl font-bold mb-4">Stay Updated</h2>
					<p className="text-base lg:text-xl text-muted-foreground mb-6">
						Subscribe to our newsletter for the latest updates on AI and vector
						search
					</p>
					<div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
						/>
						<button
							type="button"
							aria-label="Subscribe to newsletter"
							className="px-5 lg:px-6 py-2.5 lg:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
						>
							Subscribe
						</button>
					</div>
				</Card>
			</div>
		</PageTemplate>
	);
};
