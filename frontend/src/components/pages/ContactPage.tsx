import { Mail, MapPin, Phone } from "lucide-react";
import { useId } from "react";
import { CONTACT } from "@/constants/site";
import { Card } from "../atoms/Card";
import { PageTemplate } from "../templates/PageTemplate";

export const ContactPage = () => {
	const nameId = useId();
	const emailId = useId();
	const messageId = useId();

	return (
		<PageTemplate className="bg-transparent">
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						Get in{" "}
						<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							Touch
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Have questions? We'd love to hear from you.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
					{/* Contact Form */}
					<Card
						aria-label="Contact form"
						className="p-6 hover:shadow-lg transition-shadow"
					>
						<form className="space-y-6">
							<div>
								<label
									htmlFor={nameId}
									className="block text-sm font-medium mb-2"
								>
									Name
								</label>
								<input
									type="text"
									id={nameId}
									className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
									placeholder="Your name"
								/>
							</div>
							<div>
								<label
									htmlFor={emailId}
									className="block text-sm font-medium mb-2"
								>
									Email
								</label>
								<input
									type="email"
									id={emailId}
									className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
									placeholder="your@email.com"
								/>
							</div>
							<div>
								<label
									htmlFor={messageId}
									className="block text-sm font-medium mb-2"
								>
									Message
								</label>
								<textarea
									id={messageId}
									rows={5}
									className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
									placeholder="How can we help?"
								/>
							</div>
							<button
								type="submit"
								aria-label="Send Message"
								className="w-full px-5 lg:px-6 py-2.5 lg:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
							>
								Send Message
							</button>
						</form>
					</Card>

					{/* Contact Information */}
					<div className="space-y-6">
						<Card
							aria-label="Contact information"
							className="p-6 hover:shadow-lg transition-shadow"
						>
							<h2 className="text-xl font-semibold mb-6">
								Contact Information
							</h2>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<Mail className="h-6 w-6 text-primary mt-1" />
									<div>
										<h3 className="font-semibold">Email</h3>
										<a
											href={`mailto:${CONTACT.email}`}
											className="text-muted-foreground hover:text-primary"
										>
											{CONTACT.email}
										</a>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<MapPin className="h-6 w-6 text-primary mt-1" />
									<div>
										<h3 className="font-semibold">Location</h3>
										<p className="text-muted-foreground">
											San Francisco, CA
											<br />
											United States
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Phone className="h-6 w-6 text-primary mt-1" />
									<div>
										<h3 className="font-semibold">Phone</h3>
										<a
											href="tel:+1234567890"
											className="text-muted-foreground hover:text-primary"
										>
											+1 (234) 567-890
										</a>
									</div>
								</div>
							</div>
						</Card>

						<Card
							aria-label="Enterprise support"
							className="p-6 hover:shadow-lg transition-shadow"
						>
							<h3 className="font-semibold mb-2">Enterprise Support</h3>
							<p className="text-muted-foreground mb-4">
								Need dedicated support or custom solutions? Contact our
								enterprise team.
							</p>
							<a
								href={`mailto:${CONTACT.enterpriseEmail}`}
								className="text-primary hover:underline font-medium"
							>
								{CONTACT.enterpriseEmail}
							</a>
						</Card>
					</div>
				</div>
			</div>
		</PageTemplate>
	);
};
