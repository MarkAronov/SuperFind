import { Mail, MapPin, Phone } from "lucide-react";
import { type ChangeEvent, type FormEvent, useId, useState } from "react";
import { CONTACT, SITE_CONFIG } from "@/constants/site";
import { Button } from "../atoms/Button";
import { Card, CardContent } from "../atoms/Card";
import { Div } from "../atoms/Div";
import { Grid } from "../atoms/Grid";
import { Heading } from "../atoms/Heading";
import { Hero } from "../atoms/Hero";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";
import { Link } from "../atoms/Link";
import { Text } from "../atoms/Text";
import { Textarea } from "../atoms/Textarea";
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
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
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
		<PageTemplate title="Contact">
			{/* Hero Section */}
			<Hero
				title="Get in"
				brand="Touch"
				subtitle="Have questions? We'd love to hear from you."
			/>

			{/* Contact Form and Information */}
			<Grid variant="responsive" className="grid-cols-1 md:grid-cols-1">
				{/* Contact Form */}
				<Card variant="hover" aria-label="Contact form">
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<Div>
								<Label htmlFor={nameId}>Name</Label>
								<Input
									type="text"
									id={nameId}
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
									placeholder="Your name"
								/>
							</Div>
							<Div>
								<Label htmlFor={emailId}>Email</Label>
								<Input
									type="email"
									id={emailId}
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									required
									placeholder="your@email.com"
								/>
							</Div>
							<Div>
								<Label htmlFor={messageId}>Message</Label>
								<Textarea
									id={messageId}
									name="message"
									value={formData.message}
									onChange={handleInputChange}
									required
									rows={5}
									placeholder="How can we help?"
								/>
							</Div>
							{status === "error" && (
								<Text className="text-red-500">{errorMessage}</Text>
							)}
							{status === "success" && (
								<Text className="text-green-500">
									Message sent successfully!
								</Text>
							)}
							<Button
								type="submit"
								disabled={status === "sending"}
								aria-label="Send Message"
								className="w-full lg:w-auto lg:max-w-xs lg:mx-auto"
							>
								{status === "sending" ? "Sending..." : "Send Message"}
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Contact Information */}
				<Card variant="hover" aria-label="Contact information">
					<CardContent>
						<Heading as="h2" variant="card" className="mb-6">
							Contact Information
						</Heading>
						<Div variant="spacer">
							<Div variant="flex">
								<Mail className="h-6 w-6 text-primary mt-1" />
								<Div>
									<Heading as="h3" variant="card">
										Email
									</Heading>
									<Link href={`mailto:${CONTACT.email}`} variant="muted">
										{CONTACT.email}
									</Link>
								</Div>
							</Div>
							<Div variant="flex">
								<MapPin className="h-6 w-6 text-primary mt-1" />
								<Div>
									<Heading as="h3" variant="card">
										Location
									</Heading>
									<Text variant="muted">Israel</Text>
								</Div>
							</Div>
							<Div variant="flex">
								<Phone className="h-6 w-6 text-primary mt-1" />
								<Div>
									<Heading as="h3" variant="card">
										Phone
									</Heading>
									<Link href="tel:+1234567890" variant="muted">
										N/A
									</Link>
								</Div>
							</Div>
						</Div>
					</CardContent>
				</Card>
			</Grid>
		</PageTemplate>
	);
};
