import { type ChangeEvent, type FormEvent, useId, useState } from "react";
import { SITE_CONFIG } from "@/constants/site";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Input } from "../2-atoms/Input";
import { Label } from "../2-atoms/Label";
import { Span } from "../2-atoms/Span";
import { Text } from "../2-atoms/Text";
import { Textarea } from "../2-atoms/Textarea";
import type {
	ContactFormData,
	FormStatus,
	ValidationErrors,
} from "./ContactForm.types";

/**
 * ContactForm Component
 *
 * Full-featured contact form with inline validation, submission, and status feedback.
 * Handles form state management and API communication.
 *
 * Form Fields:
 * - Name: Required text input with placeholder
 * - Email: Required email input with validation
 * - Message: Required textarea (6 rows, non-resizable)
 *
 * Status States:
 * - idle: Initial state, ready for input
 * - sending: Submitting to API, button disabled with spinner
 * - success: Message sent successfully, green feedback banner
 * - error: Submission failed, red feedback banner with error message
 *
 * Layout:
 * - Responsive grid: 1 column mobile, 2 columns desktop (md:grid-cols-2)
 * - Spacing: 24px between fields (space-y-6)
 * - Field labels: Medium font weight with required asterisk
 * - Input height: 44px (h-11) for comfortable interaction
 *
 * Validation:
 * - Custom inline validation (no browser popups)
 * - Real-time error clearing when user types
 * - Red border highlight on invalid fields using destructive color
 * - Inline error messages below each field in red text
 * - Email format validation with regex
 * - Trim check for all required fields
 *
 * API Integration:
 * - POST to /contact endpoint
 * - JSON Content-Type header
 * - Error handling with user-friendly messages
 * - Auto-clears form on success
 *
 * Accessibility:
 * - Unique IDs via useId() for label-input association
 * - Required field indicators (red asterisk)
 * - Descriptive placeholders
 * - Submit button aria-label
 * - Error/success announcements via colored feedback
 */

export const ContactForm = () => {
	// Generate unique IDs for accessibility (label-input association)
	const nameId = useId();
	const emailId = useId();
	const messageId = useId();

	// Form data state
	const [formData, setFormData] = useState<ContactFormData>({
		name: "",
		email: "",
		message: "",
	});

	// Submission status state
	const [status, setStatus] = useState<FormStatus>("idle");

	// Error message state
	const [errorMessage, setErrorMessage] = useState("");

	// Validation errors state - inline field-level errors
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{},
	);

	/**
	 * Validate form fields
	 * Returns true if valid, false if errors found
	 * Updates validationErrors state with specific field errors
	 */
	const validateForm = (): boolean => {
		const errors: ValidationErrors = {};

		// Validate name - required, trimmed
		if (!formData.name.trim()) {
			errors.name = "Name is required";
		}

		// Validate email - required, basic email format
		if (!formData.email.trim()) {
			errors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = "Please enter a valid email address";
		}

		// Validate message - required, trimmed
		if (!formData.message.trim()) {
			errors.message = "Message is required";
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	/**
	 * Handle input/textarea changes
	 * Updates formData state with new values
	 * Clears validation error for the field being edited
	 */
	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear validation error for this field when user starts typing
		if (validationErrors[name as keyof ValidationErrors]) {
			setValidationErrors((prev) => {
				const updated = { ...prev };
				delete updated[name as keyof ValidationErrors];
				return updated;
			});
		}
	};

	/**
	 * Handle form submission
	 * Validates form, then sends data to contact API endpoint
	 */
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// Validate form before submission
		if (!validateForm()) {
			return; // Stop if validation fails
		}

		setStatus("sending");
		setErrorMessage("");

		try {
			// POST form data to contact endpoint
			const response = await fetch(`${SITE_CONFIG.apiBaseUrl}/contact`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				// Success: Clear form and show success message
				setStatus("success");
				setFormData({ name: "", email: "", message: "" });
				setValidationErrors({});
			} else {
				// Error: Parse error message and display
				const error = await response.json();
				setStatus("error");
				setErrorMessage(error.error || "Failed to send message");
			}
		} catch (_error) {
			// Network error: Display generic error message
			setStatus("error");
			setErrorMessage("Network error. Please try again.");
		}
	};

	return (
		// Form semantic HTML - noValidate to use custom validation instead of browser popups
		<form onSubmit={handleSubmit} noValidate className="space-y-6">
			<Div
				className={cn(
					// Layout
					"grid grid-cols-1 md:grid-cols-2",
					// Spacing
					SPACING.GAP.xl,
				)}
			>
				<Div className="space-y-2">
					<Label htmlFor={nameId} className={TYPOGRAPHY.FONT_WEIGHT.medium}>
						Name <Span className="text-destructive">*</Span>
					</Label>
					{/* Name input - 44px height */}
					<Input
						type="text"
						id={nameId}
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						placeholder="John Doe"
						className={cn(
							SIZING.INPUT.lg,
							// Red border if validation error
							validationErrors.name &&
								"border-destructive focus:ring-destructive",
						)}
					/>
					{/* Inline validation error message */}
					{validationErrors.name && (
						<Text
							variant="small"
							className={cn(
								// Destructive color from ions
								"text-destructive",
								TYPOGRAPHY.FONT_WEIGHT.medium,
							)}
						>
							{validationErrors.name}
						</Text>
					)}
				</Div>
				<Div className="space-y-2">
					<Label htmlFor={emailId} className={TYPOGRAPHY.FONT_WEIGHT.medium}>
						Email <Span className="text-destructive">*</Span>
					</Label>
					{/* Email input - 44px height */}
					<Input
						type="email"
						id={emailId}
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						placeholder="john@example.com"
						className={cn(
							SIZING.INPUT.lg,
							// Red border if validation error
							validationErrors.email &&
								"border-destructive focus:ring-destructive",
						)}
					/>
					{/* Inline validation error message */}
					{validationErrors.email && (
						<Text
							variant="small"
							className={cn(
								// Destructive color from ions
								"text-destructive",
								TYPOGRAPHY.FONT_WEIGHT.medium,
							)}
						>
							{validationErrors.email}
						</Text>
					)}
				</Div>
			</Div>
			<Div className="space-y-2">
				<Label htmlFor={messageId} className="font-medium">
					Message <Span className="text-destructive">*</Span>
				</Label>
				<Textarea
					id={messageId}
					name="message"
					value={formData.message}
					onChange={handleInputChange}
					rows={6}
					placeholder="Tell us how we can help you..."
					className={cn(
						"resize-none",
						// Red border if validation error
						validationErrors.message &&
							"border-destructive focus:ring-destructive",
					)}
				/>
				{/* Inline validation error message */}
				{validationErrors.message && (
					<Text
						variant="small"
						className={cn(
							// Destructive color from ions
							"text-destructive",
							TYPOGRAPHY.FONT_WEIGHT.medium,
						)}
					>
						{validationErrors.message}
					</Text>
				)}
			</Div>
			{status === "error" && (
				<Div
					className={cn(
						// Spacing
						SPACING.PADDING.md,
						// Borders
						BORDERS.RADIUS.lg,
						// Colors
						"bg-destructive/10 border border-destructive/20",
					)}
				>
					<Text
						variant="small"
						className={cn(
							// Colors
							"text-destructive",
							// Typography
							TYPOGRAPHY.FONT_WEIGHT.medium,
						)}
					>
						{errorMessage}
					</Text>
				</Div>
			)}
			{status === "success" && (
				<Div
					className={cn(
						// Spacing
						SPACING.PADDING.md,
						// Borders
						BORDERS.RADIUS.lg,
						// Colors
						"bg-green-500/10 border border-green-500/20",
					)}
				>
					<Text
						variant="small"
						className="text-green-600 dark:text-green-400 font-medium"
					>
						✓ Message sent successfully! We'll get back to you soon.
					</Text>
				</Div>
			)}
			<Div className="flex justify-end">
				<Button
					type="submit"
					disabled={status === "sending"}
					aria-label="Send Message"
					className="min-w-[150px]"
				>
					{status === "sending" ? (
						<>
							<Span className="inline-block animate-spin mr-2">⏳</Span>
							Sending...
						</>
					) : (
						"Send Message"
					)}
				</Button>
			</Div>
		</form>
	);
};
