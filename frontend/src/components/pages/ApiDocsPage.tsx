import { Card } from "../atoms/Card";
import { Glass } from "../atoms/Glass";
import { PageTemplate } from "../templates/PageTemplate";

const searchParams = [
	{
		name: "query",
		type: "string",
		required: true,
		description: "Search query",
	},
	{
		name: "limit",
		type: "number",
		required: false,
		description: "Results per page (default: 5)",
	},
	{
		name: "offset",
		type: "number",
		required: false,
		description: "Pagination offset (default: 0)",
	},
];

const parseParams = [
	{
		name: "file",
		type: "File",
		required: true,
		description: "File to parse (JSON, CSV, or TXT)",
	},
];

export const ApiDocsPage = () => {
	return (
		<PageTemplate contained={false}>
			{/* Hero Section */}
			<section className="container mx-auto px-3 lg:px-4 py-12 lg:py-16">
				<Glass variant="pronounced" className="max-w-4xl mx-auto text-center">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">
						API{" "}
						<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							Documentation
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Complete API reference for integrating SkillVector into your
						applications.
					</p>
				</Glass>
			</section>

			{/* API Endpoints */}
			<section className="container mx-auto px-3 lg:px-4 py-8 lg:py-12">
				<ul className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
					{/* Search Endpoint */}
					<li>
						<Card
							aria-label="Search Endpoint"
							className="p-6 hover:shadow-lg transition-shadow"
						>
							<h2 className="text-2xl lg:text-3xl font-bold mb-4">
								Search Endpoint
							</h2>
							<div className="bg-foreground text-background p-4 rounded-lg mb-4 font-mono text-sm">
								<code>GET /api/search</code>
							</div>

							<h3 className="text-xl font-semibold mt-6 mb-3">Parameters</h3>
							<div className="overflow-x-auto">
								<table className="w-full border-collapse border border-border rounded-lg">
									<thead>
										<tr className="bg-muted/50">
											<th className="border border-border p-2 text-left text-sm font-semibold">
												Parameter
											</th>
											<th className="border border-border p-2 text-left text-sm font-semibold">
												Type
											</th>
											<th className="border border-border p-2 text-left text-sm font-semibold">
												Required
											</th>
											<th className="border border-border p-2 text-left text-sm font-semibold">
												Description
											</th>
										</tr>
									</thead>
									<tbody>
										{searchParams.map((param) => (
											<tr key={param.name}>
												<td className="border border-border p-2">
													<code className="text-sm bg-muted px-1 py-0.5 rounded">
														{param.name}
													</code>
												</td>
												<td className="border border-border p-2 text-sm">
													{param.type}
												</td>
												<td className="border border-border p-2 text-sm">
													{param.required ? "Yes" : "No"}
												</td>
												<td className="border border-border p-2 text-sm text-muted-foreground">
													{param.description}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							<h3 className="text-xl font-semibold mt-6 mb-3">Example</h3>
							<div className="bg-foreground text-background p-4 rounded-lg font-mono text-sm overflow-x-auto">
								<code>GET /api/search?query=python developer&limit=10</code>
							</div>
						</Card>
					</li>

					{/* Parse Endpoint */}
					<li>
						<Card
							aria-label="Parse Endpoint"
							className="p-6 hover:shadow-lg transition-shadow"
						>
							<h2 className="text-2xl lg:text-3xl font-bold mb-4">
								Parse Endpoint
							</h2>
							<div className="bg-foreground text-background p-4 rounded-lg mb-4 font-mono text-sm">
								<code>POST /api/parse</code>
							</div>

							<h3 className="text-xl font-semibold mt-6 mb-3">Parameters</h3>
							<div className="overflow-x-auto">
								<table className="w-full border-collapse border border-border rounded-lg">
									<thead>
										<tr className="bg-muted/50">
											<th className="border border-border p-2 text-left text-sm font-semibold">
												Parameter
											</th>
											<th className="border border-border p-2 text-left text-sm font-semibold">
												Type
											</th>
											<th className="border border-border p-2 text-left text-sm font-semibold">
												Required
											</th>
											<th className="border border-border p-2 text-left text-sm font-semibold">
												Description
											</th>
										</tr>
									</thead>
									<tbody>
										{parseParams.map((param) => (
											<tr key={param.name}>
												<td className="border border-border p-2">
													<code className="text-sm bg-muted px-1 py-0.5 rounded">
														{param.name}
													</code>
												</td>
												<td className="border border-border p-2 text-sm">
													{param.type}
												</td>
												<td className="border border-border p-2 text-sm">
													{param.required ? "Yes" : "No"}
												</td>
												<td className="border border-border p-2 text-sm text-muted-foreground">
													{param.description}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							<h3 className="text-xl font-semibold mt-6 mb-3">
								Supported Formats
							</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li className="flex gap-2">
									<span className="text-primary">•</span>
									<span>
										<strong>JSON:</strong> Array of person objects or single
										person object
									</span>
								</li>
								<li className="flex gap-2">
									<span className="text-primary">•</span>
									<span>
										<strong>CSV:</strong> Headers with name, role, skills
										columns
									</span>
								</li>
								<li className="flex gap-2">
									<span className="text-primary">•</span>
									<span>
										<strong>TXT:</strong> Free-form text with professional
										information
									</span>
								</li>
							</ul>
						</Card>
					</li>

					{/* Health Endpoint */}
					<li>
						<Card
							aria-label="Health Endpoint"
							className="p-6 hover:shadow-lg transition-shadow"
						>
							<h2 className="text-2xl lg:text-3xl font-bold mb-4">
								Health Endpoint
							</h2>
							<div className="bg-foreground text-background p-4 rounded-lg mb-4 font-mono text-sm">
								<code>GET /api/health</code>
							</div>
							<p className="text-sm text-muted-foreground">
								Returns the current health status of the API and its
								dependencies.
							</p>
						</Card>
					</li>
				</ul>
			</section>
		</PageTemplate>
	);
};
