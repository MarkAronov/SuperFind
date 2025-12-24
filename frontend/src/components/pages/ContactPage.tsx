import { Mail, MapPin, Phone } from "lucide-react";
import { useId, useState } from "react";
import { CONTACT, SITE_CONFIG } from "@/constants/site";
import { CardSection } from "../atoms/CardSection";
import { Grid } from "../atoms/Grid";
import { Hero } from "../atoms/Hero";
import { PageTemplate } from "../templates/PageTemplate";

export const ContactPage = () => {
	const nameId = useId();
	const emailId = useId();
	const messageId = useId();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [status, setStatus] = useState<
		"idle" | "sending" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("sending");
		setErrorMessage("");

		try {
			const response = await fetch(`${SITE_CONFIG.apiBaseUrl}/contact`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setStatus("success");
				setFormData({ name: "", email: "", message: "" });
			} else {
				const error = await response.json();
				setStatus("error");
				setErrorMessage(error.error || "Failed to send message");
			}
		} catch (_error) {
			setStatus("error");
			setErrorMessage("Network error. Please try again.");
		}
	};

	return (
		<PageTemplate className="bg-transparent">
			<Hero
				title="Get in"
				brand="Touch"
				subtitle="Have questions? We'd love to hear from you."
			/>

			<Grid variant="responsive">
				{/* Contact Form */}
				<CardSection aria-label="Contact form">
					<form onSubmit={handleSubmit} className="space-y-6">
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
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								required
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
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								required
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
								name="message"
								value={formData.message}
								onChange={handleInputChange}
								required
								rows={5}
								className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
								placeholder="How can we help?"
							/>
						</div>
						{status === "error" && (
							<p className="text-red-500 text-sm">{errorMessage}</p>
						)}
						{status === "success" && (
							<p className="text-green-500 text-sm">
								Message sent successfully!
							</p>
						)}
						<button
							type="submit"
							disabled={status === "sending"}
							aria-label="Send Message"
							className="w-full px-5 lg:px-6 py-2.5 lg:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
						>
							{status === "sending" ? "Sending..." : "Send Message"}
						</button>
					</form>
				</CardSection>

				{/* Contact Information */}
				<CardSection aria-label="Contact information">
					<h2 className="text-xl font-semibold mb-6">Contact Information</h2>
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
								<p className="text-muted-foreground">Israel</p>
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
									N/A
								</a>
							</div>
						</div>
					</div>
				</CardSection>
			</Grid>
		</PageTemplate>
	);
};
