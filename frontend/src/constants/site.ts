/**
 * Site-wide constants and configuration
 * Centralized place for all hardcoded values
 */

export const SITE_CONFIG = {
	name: "SkillVector",
	description: "AI-powered semantic search for professional talent discovery",
	version: "1.0.0",
} as const;

export const CONTACT = {
	email: "contact@markaronov.com",
	privacyEmail: "contact@markaronov.com",
	supportEmail: "contact@markaronov.com",
	enterpriseEmail: "contact@markaronov.com",
} as const;

export const SOCIAL_LINKS = {
	github: "https://github.com/MarkAronov/SkillVector",
	linkedin: "https://www.linkedin.com/in/mark-aronov/",
	figma: "https://www.figma.com/@markaronov",
} as const;

export const EXTERNAL_LINKS = {
	documentation: "https://github.com/MarkAronov/SkillVector",
	issues: "https://github.com/MarkAronov/SkillVector/issues",
	discussions: "https://github.com/MarkAronov/SkillVector/discussions",
	releases: "https://github.com/MarkAronov/SkillVector/releases",
	sdkTypescript:
		"https://github.com/MarkAronov/SkillVector/tree/main/sdk/typescript",
} as const;

// Helper to create mailto links
export const getMailtoLink = (email: string, subject?: string) => {
	if (subject) {
		return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
	}
	return `mailto:${email}`;
};
