import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Card } from "../atoms/Card";
import { Glass } from "../atoms/Glass";
import { PageTemplate } from "../templates/PageTemplate";

interface PlaceholderPageProps {
	title: string;
	description?: string;
}

export const PlaceholderPage = ({
	title,
	description,
}: PlaceholderPageProps) => {
	return (
		<PageTemplate contained={false}>
			<section className="container mx-auto px-3 lg:px-4 py-12 lg:py-16">
				<Glass variant="pronounced" className="max-w-3xl mx-auto text-center">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">{title}</h1>
					{description && (
						<p className="text-base lg:text-xl text-muted-foreground mb-8">
							{description}
						</p>
					)}
				</Glass>
			</section>

			<section className="container mx-auto px-3 lg:px-4 py-8 lg:py-12">
				<div className="max-w-3xl mx-auto">
					<Card
						aria-label="Under Construction"
						className="p-6 hover:shadow-lg transition-shadow text-center"
					>
						<p className="text-sm lg:text-base text-muted-foreground mb-6">
							This page is currently under construction. Check back soon for
							updates!
						</p>
						<Link
							to="/"
							aria-label="Back to Search"
							className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm lg:text-base"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Search
						</Link>
					</Card>
				</div>
			</section>
		</PageTemplate>
	);
};
