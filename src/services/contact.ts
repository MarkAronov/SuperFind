import {
	TransactionalEmailsApi,
	TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { z } from "zod";

// Initialize Brevo with API key
const apiInstance = new TransactionalEmailsApi();
const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) {
	console.error("BREVO_API_KEY not set!");
} else {
	console.log("Brevo API key configured:", `${apiKey.substring(0, 10)}...`);
	apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
}

// Email configuration from environment variables
const _CONTACT_FROM_EMAIL =
	process.env.CONTACT_FROM_EMAIL || "SkillVector <test@test.com>";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "test@test.com";
const CONTACT_SUBJECT_PREFIX =
	process.env.CONTACT_SUBJECT_PREFIX || "Contact Form:";
const CONTACT_HTML_TEMPLATE =
	process.env.CONTACT_HTML_TEMPLATE ||
	"<h2>New Contact Form Submission</h2><p><strong>From:</strong> {{name}} ({{email}})</p><p><strong>Message:</strong></p><p>{{message}}</p>";
const CONTACT_TEXT_TEMPLATE =
	process.env.CONTACT_TEXT_TEMPLATE ||
	"From: {{name}} ({{email}})\n\n{{message}}";

const contactSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	message: z.string().min(1, "Message is required"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const sendContactEmail = async (
	data: ContactFormData,
): Promise<{ success: boolean; error?: string }> => {
	try {
		// Validate input
		const validatedData = contactSchema.parse(data);

		// Replace placeholders in templates
		const htmlContent = CONTACT_HTML_TEMPLATE.replace(
			/\{\{name\}\}/g,
			validatedData.name,
		)
			.replace(/\{\{email\}\}/g, validatedData.email)
			.replace(
				/\{\{message\}\}/g,
				validatedData.message.replace(/\n/g, "<br>"),
			);

		const textContent = CONTACT_TEXT_TEMPLATE.replace(
			/\{\{name\}\}/g,
			validatedData.name,
		)
			.replace(/\{\{email\}\}/g, validatedData.email)
			.replace(/\{\{message\}\}/g, validatedData.message);

		const sendSmtpEmail = {
			to: [{ email: CONTACT_TO_EMAIL }],
			templateId: undefined,
			params: undefined,
			headers: undefined,
			sender: { email: _CONTACT_FROM_EMAIL, name: "SkillVector" },
			subject: `${CONTACT_SUBJECT_PREFIX} ${validatedData.name}`,
			htmlContent: htmlContent,
			textContent: textContent,
		};

		try {
			console.log("Sending email via Brevo:", {
				to: CONTACT_TO_EMAIL,
				from: _CONTACT_FROM_EMAIL,
				subject: `${CONTACT_SUBJECT_PREFIX} ${validatedData.name}`,
			});
			await apiInstance.sendTransacEmail(sendSmtpEmail);
			console.log("Brevo email sent successfully:");
		} catch (brevoError: any) {
			console.error("Brevo API error:", {
				message: brevoError.message,
				status: brevoError.status,
				response: brevoError.response?.data,
			});
			return {
				success: false,
				error: `Email service error: ${brevoError.message || "Unknown error"}`,
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Error sending contact email:", error);
		if (error instanceof z.ZodError) {
			return { success: false, error: error.issues[0].message };
		}
		return { success: false, error: "Failed to send email" };
	}
};
