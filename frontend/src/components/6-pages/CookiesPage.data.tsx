import {
	BarChart3,
	Cookie,
	Info,
	Lock,
	Settings,
	Shield,
	Zap,
} from "lucide-react";
import type { PolicyCard } from "./CookiesPage.types";

// Shared column headers — reused across every cookie-table block
const COOKIE_TABLE_COLUMNS = ["Cookie Name", "Purpose", "Duration"];

// Hero section data
export const heroContent = {
	title: "Cookie",
	brand: "Policy",
	subtitle: "Learn how SkillVector uses cookies to enhance your experience",
};

// All policy page cards in display order — drives the full page via a single map
export const policySections: PolicyCard[] = [
	// Introduction — what cookies are and how SkillVector uses them
	{
		ariaLabel: "Introduction",
		heading: "What Are Cookies and Why We Use Them",
		icon: <Cookie className="h-6 w-6" />,
		blocks: [
			{
				kind: "paragraph",
				text: "Cookies are small text files (typically containing a string of letters and numbers) that are placed on your device — computer, tablet, or mobile phone — when you visit a website. Cookies are widely used by website operators to make their sites work efficiently, provide analytics data, and remember your preferences. They are stored locally on your device and read by the server on subsequent visits.",
			},
			{
				kind: "paragraph",
				text: "SkillVector uses cookies and similar client-side storage technologies (including localStorage and sessionStorage) sparingly and only where they serve a clear purpose. We categorize our cookies according to their function: strictly necessary, functional, performance, analytics, security, and third-party. This policy explains what each category does, what specific cookies are set, how long they persist, and how you can manage your preferences.",
			},
			{
				kind: "paragraph",
				text: 'This Cookie Policy should be read together with our Privacy Policy and Terms of Service, which provide additional context on how we handle your data. By continuing to use the Service after being presented with the cookie consent banner, you consent to the use of cookies as described in this Policy. You may withdraw your consent at any time — see the "Managing Your Cookie Preferences" section below.',
			},
		],
	},

	// Strictly Necessary Cookies — required for core functionality, cannot be disabled
	{
		ariaLabel: "Strictly Necessary Cookies",
		heading: "Strictly Necessary Cookies",
		icon: <Shield className="h-6 w-6" />,
		blocks: [
			{
				kind: "paragraph",
				text: "These cookies are essential for the operation of the Service and cannot be disabled in our systems. They are set in response to actions you take that amount to a request for services, such as setting your privacy preferences, logging in, or maintaining your session. Without these cookies, core functionality of SkillVector — including authentication, session management, and security protections — would not be available. These cookies do not store any personally identifiable information and are exempt from consent requirements under the ePrivacy Directive (2002/58/EC) and GDPR.",
			},
			{
				kind: "cookie-table",
				columns: COOKIE_TABLE_COLUMNS,
				cookies: [
					{
						name: "skillvector-theme",
						purpose:
							"Stores your display theme preference (light, dark, or system) to maintain a consistent visual experience across sessions and page navigations",
						duration: "1 year",
					},
					{
						name: "session_id",
						purpose:
							"Maintains your authenticated session state and associates your browser with a server-side session. This cookie is encrypted and includes a CSRF token to prevent cross-site request forgery attacks",
						duration: "Session (deleted when browser closes)",
					},
					{
						name: "__csrf_token",
						purpose:
							"Cross-Site Request Forgery (CSRF) protection token — validates that form submissions and API requests originate from the authentic SkillVector application interface",
						duration: "Session",
					},
					{
						name: "cookie_consent",
						purpose:
							"Records your cookie consent preferences so we do not repeatedly prompt you with the cookie consent banner and can honor your choices across visits",
						duration: "1 year",
					},
				],
			},
		],
	},

	// Functional Cookies — enhanced features and personalization
	{
		ariaLabel: "Functional Cookies",
		heading: "Functional Cookies",
		icon: <Settings className="h-6 w-6" />,
		blocks: [
			{
				kind: "paragraph",
				text: "These cookies enable enhanced functionality and personalization features that are not strictly necessary but significantly improve your experience with the Service. They allow the platform to remember your preferences, settings, and previous interactions so you do not have to reconfigure them on each visit. If you do not allow these cookies, some or all of these features may not function correctly. You may disable these cookies through your browser settings or the cookie consent manager, but doing so may degrade your experience.",
			},
			{
				kind: "cookie-table",
				columns: COOKIE_TABLE_COLUMNS,
				cookies: [
					{
						name: "search_history",
						purpose:
							"Stores your recent search queries locally to provide quick access to previous searches and enable autocomplete suggestions. Data is stored client-side only and is never transmitted to our servers",
						duration: "30 days",
					},
					{
						name: "ui_preferences",
						purpose:
							"Remembers your UI configuration choices, including sidebar collapse state, preferred results layout (grid or list view), table column widths, and pagination size preferences",
						duration: "1 year",
					},
					{
						name: "locale_preference",
						purpose:
							"Stores your language and regional formatting preferences (date format, number format) to deliver localized content and formatting across the application",
						duration: "1 year",
					},
					{
						name: "api_config_cache",
						purpose:
							"Caches your API configuration settings (selected AI provider, model preferences, endpoint URLs) in an encrypted local storage entry to avoid re-entering configuration on each visit",
						duration: "90 days",
					},
				],
			},
		],
	},

	// Performance Cookies — system performance and diagnostics
	{
		ariaLabel: "Performance Cookies",
		heading: "Performance Cookies",
		icon: <Zap className="h-6 w-6" />,
		blocks: [
			{
				kind: "paragraph",
				text: "These cookies collect information about how you use the Service — which pages you visit most often, how long you spend on each page, and whether you encounter any error messages. All information collected by these cookies is aggregated and therefore anonymous. They help us understand how the Service performs under real-world conditions, identify bottlenecks, and prioritize performance optimizations. These cookies do not collect information that individually identifies you.",
			},
			{
				kind: "cookie-table",
				columns: COOKIE_TABLE_COLUMNS,
				cookies: [
					{
						name: "perf_metrics",
						purpose:
							"Collects anonymous performance metrics including page load times, API response latencies, time-to-first-byte (TTFB), largest contentful paint (LCP), and cumulative layout shift (CLS) measurements to help us identify and resolve performance issues",
						duration: "Session",
					},
					{
						name: "error_tracking_id",
						purpose:
							"Assigns a random, anonymous identifier for error tracking and diagnostics. When an error occurs, this ID links the error report to the session context (but not to your identity) so our engineering team can reproduce and debug the issue",
						duration: "7 days",
					},
				],
			},
		],
	},

	// Analytics Cookies — usage insights and improvement
	{
		ariaLabel: "Analytics Cookies",
		heading: "Analytics Cookies",
		icon: <BarChart3 className="h-6 w-6" />,
		blocks: [
			{
				kind: "paragraph",
				text: "Analytics cookies help us understand how visitors interact with the Service by collecting and reporting information anonymously. This data enables us to measure traffic patterns, identify the most popular features, understand navigation flows, and make data-driven decisions to improve the user experience. We use privacy-focused analytics that do not track individuals across websites, do not use fingerprinting, and fully comply with GDPR and ePrivacy requirements. You can opt out of analytics cookies at any time without affecting the core functionality of the Service.",
			},
			{
				kind: "cookie-table",
				columns: COOKIE_TABLE_COLUMNS,
				cookies: [
					{
						name: "analytics_id",
						purpose:
							"Assigns a pseudonymous, randomly generated identifier for anonymous usage analytics. Used to distinguish unique visitors and calculate aggregate metrics such as total page views, unique sessions, and feature adoption rates. This ID cannot be used to identify you personally",
						duration: "2 years",
					},
					{
						name: "analytics_session",
						purpose:
							"Groups page views and interactions into a single browsing session for analytics purposes. A new session is started after 30 minutes of inactivity. Used to calculate session duration, pages per session, and bounce rate",
						duration: "30 minutes (rolling)",
					},
					{
						name: "analytics_referrer",
						purpose:
							"Records the website or campaign that referred you to SkillVector on your first visit. Used to understand which channels drive traffic to the Service and measure the effectiveness of outreach efforts. No personally identifiable information is stored",
						duration: "30 days",
					},
				],
			},
		],
	},

	// Security Cookies — protection and access control
	{
		ariaLabel: "Security Cookies",
		heading: "Security Cookies",
		icon: <Lock className="h-6 w-6" />,
		blocks: [
			{
				kind: "paragraph",
				text: "These cookies are used to enhance the security of the Service and protect against unauthorized access, fraudulent activity, and abuse. They support authentication workflows, rate limiting, and bot detection mechanisms. Security cookies are considered strictly necessary for the safe operation of the platform and cannot be disabled without compromising the security posture of your account.",
			},
			{
				kind: "cookie-table",
				columns: COOKIE_TABLE_COLUMNS,
				cookies: [
					{
						name: "rate_limit_token",
						purpose:
							"Implements client-side rate limiting to prevent excessive API requests and protect the Service from denial-of-service and brute-force attacks. Tracks request counts within a sliding time window",
						duration: "1 hour (rolling)",
					},
					{
						name: "device_fingerprint",
						purpose:
							"Stores a hashed device fingerprint (derived from non-identifying browser characteristics) used to detect suspicious login attempts from unrecognized devices and trigger step-up authentication when necessary",
						duration: "90 days",
					},
					{
						name: "auth_remember",
						purpose:
							"When you select 'Remember this device' during login, this secure, encrypted cookie enables persistent authentication so you remain logged in across browser sessions. You can revoke this at any time from your account security settings",
						duration: "30 days",
					},
				],
			},
		],
	},

	// Third-Party Cookies — external service integrations
	{
		ariaLabel: "Third-Party Cookies",
		heading: "Third-Party Cookies",
		icon: <Info className="h-6 w-6" />,
		blocks: [
			{
				kind: "paragraph",
				text: "Some features of the Service may involve cookies set by third-party services that we integrate with. These cookies are governed by the respective third party's privacy and cookie policies, not by this Cookie Policy. We do not control the information collected by third-party cookies. We integrate with the following categories of third-party services, each of which may set cookies on your device:",
			},
			{
				kind: "cookie-table",
				columns: COOKIE_TABLE_COLUMNS,
				cookies: [
					{
						name: "ai_provider_session",
						purpose:
							"Set by integrated AI providers (OpenAI, Anthropic, Google AI, etc.) when you interact with their APIs through SkillVector. These cookies are subject to the respective provider's cookie policy. Not applicable to self-hosted deployments using Ollama or other local models",
						duration: "Varies by provider",
					},
					{
						name: "cdn_cache_token",
						purpose:
							"Set by our content delivery network (CDN) provider to optimize the delivery of static assets (JavaScript bundles, CSS files, fonts, images) and reduce page load times by routing requests to the nearest edge server",
						duration: "Session",
					},
				],
			},
		],
	},

	// Managing Cookies — instructions for controlling cookie preferences
	{
		ariaLabel: "Managing cookies",
		heading: "Managing Your Cookie Preferences",
		blocks: [
			{
				kind: "paragraph",
				text: "You have the right to decide whether to accept or reject cookies (except for strictly necessary cookies, which are required for the Service to function). You can set or amend your cookie preferences at any time using the methods described below.",
			},
			{
				kind: "subsection",
				heading: "Browser Cookie Settings",
				body: 'Most modern web browsers allow you to control cookies through their settings. You can typically find these options in the "Privacy", "Security", or "Cookies" section of your browser\'s settings or preferences menu. You can configure your browser to block all cookies, block only third-party cookies, or notify you when a cookie is being set so you can decide whether to accept it on a case-by-case basis.',
				list: [
					{
						name: "Google Chrome",
						instructions:
							"Settings → Privacy and security → Cookies and other site data → Choose your preferred cookie blocking level",
					},
					{
						name: "Mozilla Firefox",
						instructions:
							"Settings → Privacy & Security → Enhanced Tracking Protection → Custom → Cookies",
					},
					{
						name: "Apple Safari",
						instructions:
							"Preferences → Privacy → Block all cookies, or Manage Website Data for site-specific control",
					},
					{
						name: "Microsoft Edge",
						instructions:
							"Settings → Cookies and site permissions → Manage and delete cookies and site data",
					},
				],
			},
			{
				kind: "subsection",
				heading: "Impact of Disabling Cookies",
				body: "Please be aware that disabling or blocking certain cookies may affect the functionality of SkillVector. In particular: if you disable strictly necessary cookies, you may be unable to log in, maintain a session, or access authenticated features. If you disable functional cookies, the Service may not remember your preferences, search history, or UI settings. If you disable performance and analytics cookies, we will be unable to collect data to improve the Service, but this will not affect core functionality.",
			},
			{
				kind: "subsection",
				heading: "Do Not Track (DNT) Signals",
				body: 'Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not wish to be tracked. SkillVector honors DNT signals — when a DNT signal is detected, we will disable all non-essential cookies and analytics tracking for that session. Please note that there is currently no uniform standard for how DNT signals should be interpreted, and not all browsers support or enable DNT by default.',
			},
			{
				kind: "subsection",
				heading: "Questions About This Cookie Policy",
				body: "If you have questions or concerns about our use of cookies, or if you would like to exercise your data protection rights in relation to cookie data, please open an issue on the SkillVector GitHub repository (label it 'privacy') or consult the project's README for guidance. We will respond to your inquiry within five (5) business days.",
			},
		],
	},

	// Legal Basis and Updates — regulatory compliance and change notifications
	{
		ariaLabel: "Legal basis and updates",
		heading: "Legal Basis and Policy Updates",
		blocks: [
			{
				kind: "paragraph",
				text: "Our use of cookies is governed by applicable privacy and electronic communications legislation, including the EU ePrivacy Directive (2002/58/EC, as amended by 2009/136/EC), the General Data Protection Regulation (EU 2016/679), the UK GDPR and Privacy and Electronic Communications Regulations (PECR), the California Consumer Privacy Act (CCPA) as amended by the CPRA, and other applicable national and state-level privacy laws.",
			},
			{
				kind: "paragraph",
				text: 'We may update this Cookie Policy from time to time to reflect changes in technology, legislation, our business operations, or our cookie practices. When we make material changes, we will notify you by posting a prominent notice on the Service and updating the "Last Updated" date. We encourage you to review this Cookie Policy periodically to stay informed about our use of cookies.',
			},
			{
				kind: "paragraph",
				text: "This Cookie Policy was last updated on February 1, 2026.",
			},
		],
	},
];
