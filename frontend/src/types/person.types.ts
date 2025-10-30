/**
 * Frontend Person types - imports from backend for consistency
 */

// Re-export Person types from backend
export type {
	Person,
	PersonMetadata,
	PersonValidationResult,
	QdrantPayload,
	QdrantPerson,
	ValidatedPerson,
} from "../../../src/types/person.types";

// Re-export validation functions
export {
	isValidPerson,
	validatePerson,
} from "../../../src/types/person.types";

// Import Person type for use in functions below
import type { Person } from "../../../src/types/person.types";

/**
 * Person data as retrieved from API search results
 * Includes both the person data and metadata about storage
 */
export interface PersonSearchResult {
	id: string | number;
	score: number;
	person: Person;
	metadata: {
		md5?: string;
		stored_at?: string;
		fileName?: string;
		fileType?: string;
		entityType?: string;
		entityId?: string;
	};
}

/**
 * Format skills for display - always return as comma-separated string
 */
export function formatSkills(skills?: string | string[]): string {
	if (!skills) return "No skills listed";
	if (Array.isArray(skills)) return skills.join(", ");
	return skills;
}

/**
 * Format experience for display
 */
export function formatExperience(experience?: string | number): string {
	if (!experience) return "Experience not specified";
	if (typeof experience === "number") return `${experience} years`;
	return experience;
}

/**
 * Get display name - fallback to "Unknown"
 */
export function getDisplayName(person: Person): string {
	return person.name || "Unknown";
}

/**
 * Get display role - fallback to "Role not specified"
 */
export function getDisplayRole(person: Person): string {
	return person.role || "Role not specified";
}

/**
 * Get display location - fallback to "Location not specified"
 */
export function getDisplayLocation(person: Person): string {
	return (
		person.location || person.city || person.country || "Location not specified"
	);
}
