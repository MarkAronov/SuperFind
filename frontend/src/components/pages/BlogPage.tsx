import { ArrowRight, Calendar, Clock } from "lucide-react";
import { ActionButton } from "../atoms/ActionButton";
import { Card, CardContent } from "../atoms/Card";
import { Div } from "../atoms/Div";
import { Heading } from "../atoms/Heading";
import { Input } from "../atoms/Input";
import { List, ListItem } from "../atoms/List";
import { Span } from "../atoms/Span";
import { Text } from "../atoms/Text";
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
		<PageTemplate title="Blog">
			{/* Hero Section */}
			<Div className="text-center mb-16">
				<Heading variant="hero">
					<Span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
						Blog
					</Span>
				</Heading>
				<Text variant="lead" className="max-w-2xl mx-auto">
					Insights on AI, vector search, and the future of talent discovery
				</Text>
			</Div>

			{/* Blog Posts */}
			<List variant="spaced" className="mb-16">
				{posts.map((post) => (
					<ListItem key={post.date + post.title}>
						<Card
							variant="hover"
							aria-label={post.title}
							className="cursor-pointer group"
						>
							<CardContent>
								<Div className="flex flex-wrap items-center gap-3 mb-3">
									<Span variant="badge">{post.category}</Span>
									<Div className="flex items-center gap-4 text-sm text-muted-foreground">
										<Span className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											{new Date(post.date).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</Span>
										<Span className="flex items-center gap-1">
											<Clock className="h-4 w-4" />
											{post.readTime}
										</Span>
									</Div>
								</Div>
								<Heading
									as="h2"
									variant="card"
									className="mb-2 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors"
								>
									{post.title}
								</Heading>
								<Text variant="muted" className="mb-4">
									{post.excerpt}
								</Text>
								<Div className="flex items-center gap-2 text-primary dark:text-primary font-medium">
									Read More
									<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</Div>
							</CardContent>
						</Card>
					</ListItem>
				))}
			</List>

			{/* Newsletter CTA */}
			<Card variant="hover" aria-label="Newsletter subscription">
				<CardContent centered>
					<Heading variant="section" className="mb-4">
						Stay Updated
					</Heading>
					<Text variant="lead" className="mb-6">
						Subscribe to our newsletter for the latest updates on AI and vector
						search
					</Text>
					<Div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
						<Input
							type="email"
							placeholder="Enter your email"
							className="flex-1"
						/>
						<ActionButton
							onClick={() => {}}
							aria-label="Subscribe to newsletter"
						>
							Subscribe
						</ActionButton>
					</Div>
				</CardContent>
			</Card>
		</PageTemplate>
	);
};
