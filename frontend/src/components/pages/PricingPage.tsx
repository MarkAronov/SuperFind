import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { CardSection } from "../atoms/CardSection";
import { Grid } from "../atoms/Grid";
import { Heading } from "../atoms/Heading";
import { Hero } from "../atoms/Hero";
import { Text } from "../atoms/Text";
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
		<PageTemplate className="bg-transparent">
			{/* Hero Section */}
			<Hero
				title="Simple, Transparent Pricing"
				subtitle="Choose the plan that fits your needs. All plans include core features."
			/>

			{/* Pricing Cards */}
			<Grid variant="responsive">
				{plans.map((plan) => (
					<CardSection
						key={plan.name}
						aria-label={`${plan.name} plan`}
						className={`relative p-8 h-full ${
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
							<Heading variant="subsection" className="mb-2">
								{plan.name}
							</Heading>
							<div className="mb-2">
								<span className="text-4xl font-bold">{plan.price}</span>
								{plan.price !== "Custom" && (
									<span className="text-muted-foreground">
										{" "}
										/ {plan.period}
									</span>
								)}
							</div>
							<Text className="text-muted-foreground">{plan.description}</Text>
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
					</CardSection>
				))}
			</Grid>

			{/* FAQ Section */}
			<section>
				<Heading variant="section" className="text-center mb-8">
					Frequently Asked Questions
				</Heading>
				<Grid variant="features">
					<CardSection aria-label="Can I change plans later?">
						<Heading variant="subsection" className="mb-2">
							Can I change plans later?
						</Heading>
						<Text className="text-muted-foreground">
							Yes! You can upgrade or downgrade your plan at any time. Changes
							take effect immediately.
						</Text>
					</CardSection>
					<CardSection aria-label="What payment methods do you accept?">
						<Heading variant="subsection" className="mb-2">
							What payment methods do you accept?
						</Heading>
						<Text className="text-muted-foreground">
							We accept all major credit cards, PayPal, and wire transfers for
							enterprise plans.
						</Text>
					</CardSection>
					<CardSection aria-label="Is there a free trial?">
						<Heading variant="subsection" className="mb-2">
							Is there a free trial?
						</Heading>
						<Text className="text-muted-foreground">
							Yes! The Professional plan includes a 14-day free trial with no
							credit card required.
						</Text>
					</CardSection>
				</Grid>
			</section>
		</PageTemplate>
	);
};
