import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Card } from "../atoms/Card";
import { PageTemplate } from "../templates/PageTemplate";

export const PricingPage = () => {
	const plans = [
		{
			name: "Free",
			price: "$0",
			period: "forever",
			description: "Perfect for trying out SkillVector",
			features: [
				"Up to 100 searches per month",
				"Basic semantic search",
				"1 AI provider (OpenAI)",
				"Community support",
				"API access",
			],
			cta: "Get Started",
			popular: false,
		},
		{
			name: "Professional",
			price: "$49",
			period: "per month",
			description: "For growing teams and businesses",
			features: [
				"Unlimited searches",
				"All AI providers",
				"Advanced filtering",
				"Priority support",
				"Custom integrations",
				"API rate limit: 1000/hour",
				"Team collaboration",
			],
			cta: "Start Free Trial",
			popular: true,
		},
		{
			name: "Enterprise",
			price: "Custom",
			period: "contact us",
			description: "For large organizations",
			features: [
				"Everything in Professional",
				"Dedicated infrastructure",
				"SLA guarantee",
				"Custom AI model training",
				"On-premise deployment option",
				"Dedicated support team",
				"Custom contract terms",
			],
			cta: "Contact Sales",
			popular: false,
		},
	];

	return (
		<PageTemplate>
			{/* Hero Section */}
			<div className="text-center mb-16">
				<h1 className="text-3xl lg:text-5xl font-bold mb-4">
					Simple,{" "}
					<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						Transparent Pricing
					</span>
				</h1>
				<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
					Choose the plan that fits your needs. All plans include core features.
				</p>
			</div>

			{/* Pricing Cards */}
			<ul className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
				{plans.map((plan) => (
					<li key={plan.name}>
						<Card
							aria-label={`${plan.name} plan`}
							className={`relative p-8 hover:shadow-lg transition-shadow h-full ${
								plan.popular
									? "border-primary shadow-xl scale-105"
									: "border-gray-200"
							}`}
						>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-semibold rounded-full">
									Most Popular
								</div>
							)}
							<div className="text-center mb-6">
								<h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
								<div className="mb-2">
									<span className="text-4xl font-bold">{plan.price}</span>
									{plan.price !== "Custom" && (
										<span className="text-muted-foreground">
											{" "}
											/ {plan.period}
										</span>
									)}
								</div>
								<p className="text-muted-foreground">{plan.description}</p>
							</div>
							<ul className="space-y-3 mb-8">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-start gap-2">
										<Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
										<span className="text-foreground">{feature}</span>
									</li>
								))}
							</ul>
							<Link
								to="/contact"
								aria-label={`${plan.cta} for ${plan.name} plan`}
								className={`block w-full py-3 px-4 rounded-lg text-center font-semibold transition-colors ${
									plan.popular
										? "bg-primary text-white hover:bg-primary/90"
										: "border border-border hover:bg-white/10"
								}`}
							>
								{plan.cta}
							</Link>
						</Card>
					</li>
				))}
			</ul>

			{/* FAQ Section */}
			<section className="max-w-3xl mx-auto mb-16">
				<h2 className="text-3xl font-bold text-center mb-8">
					Frequently Asked Questions
				</h2>
				<ul className="space-y-6">
					<li>
						<Card
							aria-label="Can I change plans later?"
							className="p-6 hover:shadow-lg transition-shadow"
						>
							<h3 className="text-xl font-semibold mb-2">
								Can I change plans later?
							</h3>
							<p className="text-muted-foreground">
								Yes! You can upgrade or downgrade your plan at any time. Changes
								take effect immediately.
							</p>
						</Card>
					</li>
					<li>
						<Card
							aria-label="What payment methods do you accept?"
							className="p-6 hover:shadow-lg transition-shadow"
						>
							<h3 className="text-xl font-semibold mb-2">
								What payment methods do you accept?
							</h3>
							<p className="text-muted-foreground">
								We accept all major credit cards, PayPal, and wire transfers for
								enterprise plans.
							</p>
						</Card>
					</li>
					<li>
						<Card
							aria-label="Is there a free trial?"
							className="p-6 hover:shadow-lg transition-shadow"
						>
							<h3 className="text-xl font-semibold mb-2">
								Is there a free trial?
							</h3>
							<p className="text-muted-foreground">
								Yes! The Professional plan includes a 14-day free trial with no
								credit card required.
							</p>
						</Card>
					</li>
				</ul>
			</section>
		</PageTemplate>
	);
};
