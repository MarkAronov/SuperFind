import type { Person } from "../types/person";
import { normalizePerson, validatePerson } from "../types/person";

/**
 * Person extractor service - handles extraction and enhancement of person data
 * from various text sources and formats
 */

/**
 * Extract location from various text patterns
 */
export const extractLocationFromText = (text: string): string | null => {
	// Pattern 1: "from City, Country"
	let match = text.match(/from\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z][a-zA-Z\s]+)?)/i);
	if (match) return match[1].trim();

	// Pattern 2: "in City, Country"
	match = text.match(/\bin\s+([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)/i);
	if (match) return match[1].trim();

	// Pattern 3: "career in City, Country" or "career in Country"
	match = text.match(
		/career\s+in\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z][a-zA-Z\s]+)?)/i,
	);
	if (match) return match[1].trim();

	// Pattern 4: "Location: City, Country"
	match = text.match(/location:\s*([A-Z][a-zA-Z\s,]+?)(?:\.|;|\n|$)/i);
	if (match) return match[1].trim();

	// Pattern 5: "based in City/Country"
	match = text.match(/based\s+in\s+([A-Z][a-zA-Z\s,]+?)(?:\.|;|\n|$)/i);
	if (match) return match[1].trim();

	// Pattern 6: "lives in City/Country"
	match = text.match(/lives?\s+in\s+([A-Z][a-zA-Z\s,]+?)(?:\.|;|\n|$)/i);
	if (match) return match[1].trim();

	// Pattern 7: "works in City/Country"
	match = text.match(/works?\s+in\s+([A-Z][a-zA-Z\s,]+?)(?:\.|;|\n|$)/i);
	if (match) return match[1].trim();

	return null;
};

/**
 * Extract skills from text patterns
 */
export const extractSkillsFromText = (text: string): string | null => {
	// Pattern 1: "Skills: ..."
	let match = text.match(/skills?:\s*([^.\n]+)/i);
	if (match) return match[1].trim();

	// Pattern 2: "specializes in ..."
	match = text.match(
		/specializes?\s+in\s+([^.\n]+?)(?:\s+with|\s+and has|\.|$)/i,
	);
	if (match) return match[1].trim();

	// Pattern 3: "expertise in ..."
	match = text.match(/expertise\s+in\s+([^.\n]+?)(?:\s+and|\.|$)/i);
	if (match) return match[1].trim();

	return null;
};

/**
 * Extract experience years from text
 */
export const extractExperienceFromText = (text: string): number | null => {
	// Pattern 1: "X years of experience"
	let match = text.match(
		/(\d+)\s+years?\s+of\s+(?:professional\s+)?experience/i,
	);
	if (match) return Number.parseInt(match[1], 10);

	// Pattern 2: "Experience: X years"
	match = text.match(/experience:\s*(\d+)\s*years?/i);
	if (match) return Number.parseInt(match[1], 10);

	// Pattern 3: "with X years"
	match = text.match(/with\s+(\d+)\s+years/i);
	if (match) return Number.parseInt(match[1], 10);

	return null;
};

/**
 * Enhance person data with better extraction from text
 */
export const enhancePersonData = (
	person: Record<string, unknown>,
	originalText: string,
): Person => {
	// Normalize the person data first
	const enhanced: Person = normalizePerson({
		...(person as unknown as Person),
	});

	// Extract location if missing or generic
	if (
		!enhanced.location ||
		enhanced.location === "Unknown" ||
		enhanced.location === "Unknown location" ||
		enhanced.location === ""
	) {
		const extractedLocation = extractLocationFromText(originalText);
		if (extractedLocation) {
			enhanced.location = extractedLocation;
		}
	}

	// Extract skills if missing
	if (
		!enhanced.skills ||
		enhanced.skills === "No skills listed" ||
		enhanced.skills === ""
	) {
		const extractedSkills = extractSkillsFromText(originalText);
		if (extractedSkills) {
			enhanced.skills = extractedSkills;
		}
	}

	// Extract experience if missing
	if (
		!enhanced.experience ||
		(typeof enhanced.experience === "number" && enhanced.experience === 0)
	) {
		const extractedExp = extractExperienceFromText(originalText);
		if (extractedExp !== null) {
			enhanced.experience = extractedExp;
		}
	}

	// Extract email if missing
	if (!enhanced.email) {
		const emailMatch = originalText.match(
			/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/,
		);
		if (emailMatch) {
			enhanced.email = emailMatch[1];
		}
	}

	return enhanced;
};

/**
 * Helper function to safely get string values from objects
 */
export const getString = (
	obj: Record<string, unknown>,
	key: string,
	fallback: string,
): string => {
	const v = obj[key];
	return typeof v === "string" && v.trim().length > 0 ? v : fallback;
};

/**
 * Parse minimal person data from a raw content string
 */
export const parsePersonFromContent = (
	content: string,
): Record<string, unknown> => {
	const person: Record<string, unknown> = {
		name: "",
		location: "",
		role: "",
		skills: "",
		experience_years: 0,
		email: "",
	};

	const nameMatch =
		content.match(/^([A-Z][a-zA-Z\s.'-]+)(?:\s+is|\s+from|,)/i) ||
		content.match(/name[:\s]+([A-Z][a-zA-Z\s.'-]+)/i);
	if (nameMatch) person.name = nameMatch[1].trim();

	const locationMatch =
		content.match(/location[:\s]+([^,\n]+)/i) ||
		content.match(/from\s+([A-Z][a-zA-Z\s,]+?)(?:\.|,|\s+is|\s+role)/i);
	if (locationMatch) person.location = locationMatch[1].trim();

	const roleMatch =
		content.match(/role[:\s]+([^,\n]+)/i) ||
		content.match(/is\s+a[n]?\s+([A-Z][a-zA-Z\s]+?)(?:\.|,|\s+from|\s+with)/i);
	if (roleMatch) person.role = roleMatch[1].trim();

	const skillsMatch = content.match(/skills?[:\s]+([^,\n]+(?:;[^,\n]+)*)/i);
	if (skillsMatch) person.skills = skillsMatch[1].trim();

	const expMatch =
		content.match(/experience[_\s]*years?[:\s]+(\d+)/i) ||
		content.match(/(\d+)\s+years?\s+(?:of\s+)?experience/i);
	if (expMatch) person.experience_years = Number.parseInt(expMatch[1], 10);

	const emailMatch =
		content.match(
			/email[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
		) ||
		content.match(
			/contact[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
		) ||
		content.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
	if (emailMatch) person.email = emailMatch[1].trim();

	return person;
};

/**
 * Create human-readable content for a person entity
 */
export const createPersonContent = (
	person: Record<string, unknown>,
): string => {
	const name = getString(person, "name", "Unknown");
	const role = getString(person, "role", "Unknown role");
	const location = getString(person, "location", "Unknown location");
	const skillsVal = person.skills;
	const skills = Array.isArray(skillsVal)
		? skillsVal.join(", ")
		: typeof skillsVal === "string" && skillsVal.trim().length > 0
			? skillsVal
			: "No skills listed";
	const expVal = person.experience ?? person.experience_years;
	const experience =
		typeof expVal === "number" || typeof expVal === "string"
			? expVal
			: "Unknown experience";
	const email = getString(person, "email", "");

	let content = `${name} is a ${role} from ${location}. Skills: ${skills}. Experience: ${experience} years.`;
	if (email) {
		content += ` Email: ${email}`;
	}
	return content;
};

/**
 * Validate person data has required fields using shared type validation
 */
export const validatePersonData = (
	person: Record<string, unknown>,
): {
	isValid: boolean;
	missingFields: string[];
	errors: string[];
} => {
	// Use the shared validation function
	const result = validatePerson(person);
	return {
		isValid: result.isValid,
		missingFields: result.missingFields,
		errors: result.errors,
	};
};
