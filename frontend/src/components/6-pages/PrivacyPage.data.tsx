import type { GridItem } from "../4-organisms/cards/card.types";

// Last updated date for display in the Privacy Policy page
export const privacyLastUpdated = "February 1, 2026";

export const privacySections: GridItem[] = [
	// Section 1 — Introduction and scope
	{
		title: "1. Introduction",
		content:
			'SkillVector ("we", "our", "us", or the "Company") is committed to protecting your privacy and the security of your personal information. This Privacy Policy ("Policy") describes how we collect, use, store, share, and protect information when you access or use the SkillVector platform, including the web application, REST API, vector search engine, and all related services (collectively, the "Service"). This Policy applies to all users of the Service, whether you access it through a hosted deployment or a self-hosted instance. As an open-source project licensed under the MIT License, transparency is a core value — we believe you have the right to understand exactly how your data is handled.',
		centered: false,
	},

	// Section 2 — Information we collect
	{
		title: "2. Information We Collect",
		subsections: [
			{
				title: "2.1 Profile Data (User-Uploaded Content)",
				content:
					"When you upload professional profiles to SkillVector, we process the data contained within those files, which may include full names, job titles, roles, professional skills, years of experience, educational history, certifications, employment history, and other professional attributes. This data is parsed, normalized, and converted into high-dimensional vector embeddings using AI models, then stored in our Qdrant vector database for semantic search functionality.",
			},
			{
				title: "2.2 Account Information",
				content:
					"If you create an account or authenticate via API, we may collect your name, email address, organization name, API keys, and authentication credentials. This information is used to provision your account, manage access control, and communicate with you regarding the Service.",
			},
			{
				title: "2.3 Usage and Interaction Data",
				content:
					"We automatically collect information about how you interact with the Service, including search queries submitted, API endpoints accessed, request timestamps, response times, error logs, feature usage patterns, and session duration. This data is used for debugging, performance optimization, capacity planning, and improving the quality of search results.",
			},
			{
				title: "2.4 Technical and Device Data",
				content:
					"When you access the Service, we may automatically collect your IP address, browser type and version, operating system, device identifiers, screen resolution, referring URL, and language preferences. This data is collected through standard web server logs and is used for security monitoring, fraud prevention, and statistical analytics.",
			},
			{
				title: "2.5 Cookies and Similar Technologies",
				content:
					"We use cookies, local storage, and similar technologies to maintain session state, remember your preferences (such as theme selection), and collect anonymous usage analytics. For detailed information about cookies, please refer to our Cookie Policy.",
			},
		],
		centered: false,
	},

	// Section 3 — Legal bases for processing (GDPR)
	{
		title: "3. Legal Basis for Processing",
		content:
			"Under the General Data Protection Regulation (GDPR) and other applicable data protection legislation, we process personal data on the following legal bases:",
		items: [
			"Contractual Necessity (Art. 6(1)(b) GDPR): Processing that is necessary for the performance of our contract with you, including providing the search functionality, processing uploaded profiles, and managing your account.",
			"Legitimate Interests (Art. 6(1)(f) GDPR): Processing that is necessary for our legitimate business interests, such as improving the Service, ensuring security, preventing fraud, and conducting analytics, provided such interests are not overridden by your fundamental rights and freedoms.",
			"Consent (Art. 6(1)(a) GDPR): Where you have given explicit consent for specific processing activities, such as receiving marketing communications or enabling optional analytics cookies. You may withdraw consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.",
			"Legal Obligation (Art. 6(1)(c) GDPR): Processing that is necessary for compliance with a legal obligation to which we are subject, such as tax reporting, responding to lawful government requests, or complying with court orders.",
		],
		centered: false,
	},

	// Section 4 — How we use information
	{
		title: "4. How We Use Your Information",
		content: "We use the information we collect for the following purposes:",
		subsections: [
			{
				title: "4.1 Core Service Delivery",
				content:
					"To provide the semantic search functionality that is the core of SkillVector — including parsing uploaded profile data, generating vector embeddings through AI models, indexing data in the Qdrant database, executing similarity searches, ranking and returning search results, and delivering API responses. Without this processing, we cannot provide the Service to you.",
			},
			{
				title: "4.2 Service Improvement and Analytics",
				content:
					"To analyze usage patterns, identify trends, monitor system performance, diagnose technical issues, optimize search algorithms, improve the accuracy and relevance of search results, and develop new features. We use aggregated and anonymized data wherever possible for these purposes.",
			},
			{
				title: "4.3 Security and Fraud Prevention",
				content:
					"To detect, investigate, and prevent security incidents, unauthorized access attempts, abuse of the API, denial-of-service attacks, and other malicious or fraudulent activity. This includes monitoring API usage patterns, implementing rate limiting, and maintaining audit logs.",
			},
			{
				title: "4.4 Communications",
				content:
					"To send you service-related notices, including security alerts, system updates, maintenance notifications, changes to our Terms or this Policy, and responses to your support requests. We will not send marketing communications unless you have opted in to receive them.",
			},
			{
				title: "4.5 Legal Compliance",
				content:
					"To comply with applicable laws, regulations, legal processes, and government requests, including responding to subpoenas, court orders, or regulatory inquiries; enforcing our Terms of Service; and protecting our legal rights and those of our users.",
			},
		],
		centered: false,
	},

	// Section 5 — Data storage and security
	{
		title: "5. Data Storage and Security",
		content:
			"We implement industry-standard technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.",
		subsections: [
			{
				title: "5.1 Encryption",
				content:
					"All data transmitted between your device and the Service is encrypted in transit using TLS 1.2 or higher. Profile data and vector embeddings stored in the Qdrant database are encrypted at rest using AES-256 encryption. API keys and authentication credentials are stored using bcrypt hashing with appropriate salt rounds and are never stored in plaintext.",
			},
			{
				title: "5.2 Access Controls",
				content:
					"We implement role-based access controls (RBAC) to restrict access to personal data to authorized personnel who require access to perform their duties. All access to production systems is logged and audited. Administrative access requires multi-factor authentication (MFA).",
			},
			{
				title: "5.3 Infrastructure Security",
				content:
					"Our hosted infrastructure is deployed on enterprise-grade cloud platforms with SOC 2 Type II, ISO 27001, and other relevant security certifications. We conduct regular vulnerability assessments, penetration testing, and security code reviews. We maintain an incident response plan and conduct regular security drills.",
			},
			{
				title: "5.4 Data Breach Notification",
				content:
					"In the event of a data breach that affects your personal data, we will notify you and the relevant supervisory authorities without undue delay and, where feasible, within 72 hours of becoming aware of the breach, as required by Article 33 of the GDPR. Notification will include the nature of the breach, categories and approximate number of data subjects affected, likely consequences, and measures taken to address and mitigate the breach.",
			},
		],
		centered: false,
	},

	// Section 6 — Third-party services and data sharing
	{
		title: "6. Third-Party Services and Data Sharing",
		content:
			"We integrate with third-party AI providers for embedding generation and model inference. We may also share data with service providers who assist in operating the Service.",
		subsections: [
			{
				title: "6.1 AI Embedding Providers",
				content:
					"When you use the hosted Service, your profile text data may be transmitted to a Third-Party AI Provider (such as OpenAI, Anthropic, Google AI, HuggingFace, or Cohere) for the purpose of generating vector embeddings. Each provider has its own privacy policy, data retention practices, and terms of service. We recommend reviewing the privacy policies of the provider configured for your deployment. If you use a self-hosted instance with a local model (e.g., Ollama), no data is transmitted to external providers.",
			},
			{
				title: "6.2 Infrastructure and Service Providers",
				content:
					"We may use third-party service providers for hosting, database management, analytics, monitoring, email delivery, and other operational functions. These providers are contractually obligated to process data only on our behalf and in accordance with our instructions, and are subject to appropriate data protection agreements.",
			},
			{
				title: "6.3 Legal and Regulatory Disclosure",
				content:
					"We may disclose your information if required to do so by law, or if we believe in good faith that such action is necessary to comply with a legal obligation, protect and defend the rights or property of SkillVector, prevent or investigate possible wrongdoing, protect the personal safety of users or the public, or protect against legal liability.",
			},
			{
				title: "6.4 No Sale of Personal Data",
				content:
					'We do not sell, rent, trade, or otherwise make available your personal data to third parties for their own marketing purposes. We have not sold personal data in the preceding twelve (12) months. As defined under the CCPA, we do not "sell" or "share" personal information.',
			},
		],
		centered: false,
	},

	// Section 7 — International data transfers
	{
		title: "7. International Data Transfers",
		content:
			"If you access the Service from outside the United States, your data may be transferred to and processed in the United States or other jurisdictions where our servers, AI providers, or service providers are located. These jurisdictions may have data protection laws that are different from those in your country.",
		subsections: [
			{
				title: "7.1 Transfer Safeguards",
				content:
					"Where we transfer personal data outside the European Economic Area (EEA), United Kingdom, or Switzerland, we implement appropriate safeguards, including Standard Contractual Clauses (SCCs) approved by the European Commission, adequacy decisions, or other legally recognized transfer mechanisms, to ensure that your personal data receives an adequate level of protection.",
			},
			{
				title: "7.2 Self-Hosted Deployments",
				content:
					"If you deploy SkillVector on your own infrastructure, data remains within your chosen jurisdiction. You are responsible for ensuring that your deployment complies with applicable data transfer regulations. We encourage self-hosted deployments for organizations with strict data residency requirements.",
			},
		],
		centered: false,
	},

	// Section 8 — Data retention
	{
		title: "8. Data Retention",
		content:
			"We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements.",
		items: [
			"Profile Data and Embeddings: Retained for the duration of your account. Deleted within thirty (30) days of account termination or upon your request, whichever occurs first.",
			"Account Information: Retained for the duration of your account plus twelve (12) months following termination for legitimate business and legal purposes.",
			"Usage and Interaction Logs: Aggregated and anonymized after ninety (90) days. Raw logs are deleted after one hundred eighty (180) days.",
			"Technical and Security Logs: Retained for up to twelve (12) months for security monitoring and incident investigation purposes.",
			"Backup Copies: Encrypted backup copies may persist for up to ninety (90) days following deletion of the primary data before permanent destruction.",
			"Legal Holds: Data subject to a legal hold, active investigation, or pending litigation will be retained until the hold is lifted, regardless of the standard retention schedule.",
		],
		centered: false,
	},

	// Section 9 — Your rights under GDPR, CCPA, and other laws
	{
		title: "9. Your Privacy Rights",
		content:
			"Depending on your jurisdiction, you may have the following rights regarding your personal data. To exercise any of these rights, please open an issue on the SkillVector GitHub repository (label it 'privacy') or follow the data subject request procedures described in the project's README.",
		subsections: [
			{
				title: "9.1 Rights Under the GDPR (EEA, UK, Switzerland)",
				content:
					'Right of access (Art. 15) — obtain a copy of your personal data and information about how it is processed. Right to rectification (Art. 16) — correct inaccurate or incomplete personal data. Right to erasure (Art. 17) — request deletion of your personal data ("right to be forgotten"). Right to restriction of processing (Art. 18) — restrict how we process your data in certain circumstances. Right to data portability (Art. 20) — receive your data in a structured, commonly used, machine-readable format. Right to object (Art. 21) — object to processing based on legitimate interests or for direct marketing. Right to withdraw consent — withdraw previously given consent at any time. Right to lodge a complaint with a supervisory authority.',
			},
			{
				title: "9.2 Rights Under the CCPA/CPRA (California Residents)",
				content:
					"Right to Know — the categories and specific pieces of personal information we have collected about you. Right to Delete — request deletion of your personal information, subject to certain exceptions. Right to Correct — request correction of inaccurate personal information. Right to Opt-Out — opt out of the sale or sharing of personal information (note: we do not sell your data). Right to Non-Discrimination — we will not discriminate against you for exercising your privacy rights.",
			},
			{
				title: "9.3 Response Timeframe",
				content:
					"We will acknowledge your request within five (5) business days and respond substantively within thirty (30) days. If we require additional time (up to ninety (90) days for complex requests), we will notify you of the extension and the reasons for the delay. We may need to verify your identity before fulfilling your request to prevent unauthorized access to personal data.",
			},
		],
		centered: false,
	},

	// Section 10 — Children's privacy
	{
		title: "10. Children's Privacy",
		content:
			"The Service is not directed to individuals under the age of sixteen (16), and we do not knowingly collect personal information from children under 16. If we become aware that we have collected personal data from a child under 16 without verification of parental consent, we will take steps to delete that information promptly. If you believe that we may have collected information from a child under 16, please open an issue on the SkillVector GitHub repository labeled 'privacy' or follow the procedures in the project's README.",
		centered: false,
	},

	// Section 11 — Open-source considerations
	{
		title: "11. Open-Source and Self-Hosted Deployments",
		content:
			"SkillVector is open-source software distributed under the MIT License. This Privacy Policy applies to the hosted SkillVector service operated by us.",
		subsections: [
			{
				title: "11.1 Self-Hosted Responsibility",
				content:
					"If you deploy SkillVector on your own infrastructure, you are the data controller and are solely responsible for compliance with all applicable data protection and privacy laws. This includes implementing appropriate privacy policies, obtaining necessary consents, ensuring data security, handling data subject requests, and conducting data protection impact assessments. We provide the software tools, but the data handling practices are determined by each individual deployment.",
			},
			{
				title: "11.2 Community Contributions",
				content:
					"If you contribute to the SkillVector open-source project (e.g., pull requests, issues, discussions), your GitHub username, email address, and contribution history will be publicly visible as part of the open-source development process. This data is processed by GitHub in accordance with GitHub's privacy policy.",
			},
		],
		centered: false,
	},

	// Section 12 — Changes to this policy
	{
		title: "12. Changes to This Policy",
		content:
			'We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. If we make material changes, we will notify you by posting a prominent notice on the Service, sending you an email (if we have your email address), or by other appropriate means. The "Last Updated" date at the top of this page indicates when the Policy was last revised. We encourage you to review this Policy periodically. Your continued use of the Service after the effective date of any changes constitutes your acceptance of the updated Policy.',
		centered: false,
	},

	// Section 13 — Contact information
	{
		title: "13. Contact Us",
		content:
			"If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us using the following information:",
		items: [
			"General Privacy Inquiries: Open an issue on the SkillVector GitHub repository and label it 'privacy'.",
			"Data Subject Access Requests: Open an issue labeled 'data-request' or follow the DSR procedure in the project's README.",
			"Security Concerns: Use GitHub's private security advisory or open an issue labeled 'security' for initial triage.",
			"Legal Inquiries: Open an issue labeled 'legal' on the project's GitHub repository.",
			"Data Protection Officer (DPO): See the project's README for DPO contact procedures.",
		],
		centered: false,
	},
];
