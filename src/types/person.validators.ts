/**
 * Person validation and normalization functions
 * Separate from types to keep the types file clean and focused on type definitions
 */

import type {
	Person,
	PersonValidationResult,
	ValidatedPerson,
} from "./person.types";

/**
 * Type guard to check if data has minimum required person fields
 */
export function isValidPerson(data: unknown): data is ValidatedPerson {
	if (!data || typeof data !== "object") {
		return false;
	}

	const person = data as Record<string, unknown>;

	// Check all required fields
	const hasName =
		typeof person.name === "string" && person.name.trim().length > 0;
	const hasRole =
		typeof person.role === "string" && person.role.trim().length > 0;
	const hasLocation =
		typeof person.location === "string" && person.location.trim().length > 0;
	const hasSkills = Boolean(
		person.skills &&
			((typeof person.skills === "string" && person.skills.trim().length > 0) ||
				(Array.isArray(person.skills) && person.skills.length > 0)),
	);
	const hasExperience =
		person.experience !== undefined &&
		person.experience !== null &&
		person.experience !== "";
	const hasDescription =
		typeof person.description === "string" &&
		person.description.trim().length > 0;

	return (
		hasName &&
		hasRole &&
		hasLocation &&
		hasSkills &&
		hasExperience &&
		hasDescription
	);
}

/**
 * Validate person data and return validation result
 */
export function validatePerson(data: unknown): PersonValidationResult {
	const result: PersonValidationResult = {
		isValid: false,
		missingFields: [],
		errors: [],
	};

	// Check if data is an object
	if (!data || typeof data !== "object") {
		result.errors.push("Data must be an object");
		return result;
	}

	const person = data as Record<string, unknown>;

	// Check required fields
	if (
		!person.name ||
		typeof person.name !== "string" ||
		person.name.trim().length === 0
	) {
		result.missingFields.push("name");
		result.errors.push("Name is required and must be a non-empty string");
	}

	if (
		!person.role ||
		typeof person.role !== "string" ||
		person.role.trim().length === 0
	) {
		result.missingFields.push("role");
		result.errors.push("Role is required and must be a non-empty string");
	}

	if (
		!person.location ||
		typeof person.location !== "string" ||
		person.location.trim().length === 0
	) {
		result.missingFields.push("location");
		result.errors.push("Location is required and must be a non-empty string");
	}

	if (!person.skills) {
		result.missingFields.push("skills");
		result.errors.push("Skills is required");
	}

	if (
		person.experience === undefined ||
		person.experience === null ||
		person.experience === ""
	) {
		result.missingFields.push("experience");
		result.errors.push("Experience is required");
	}

	if (
		!person.description ||
		typeof person.description !== "string" ||
		person.description.trim().length === 0
	) {
		result.missingFields.push("description");
		result.errors.push(
			"Description is required and must be a non-empty string",
		);
	}

	// If validation passed, create validated person
	if (result.missingFields.length === 0 && result.errors.length === 0) {
		result.isValid = true;
		result.person = {
			...person,
			name: person.name as string,
			role: person.role as string,
			location: person.location as string,
			skills: person.skills as string | string[],
			experience: person.experience as string | number,
			description: person.description as string,
		} as ValidatedPerson;
	}

	return result;
}

/**
 * Normalize person data to ensure consistent field names
 * Handles variations like "experience_years" vs "experience"
 */
export function normalizePerson(data: Person): Person {
	const normalized: Person = { ...data };

	// Normalize experience fields
	const exp = (normalized as Record<string, unknown>).experience_years;
	if (exp && !normalized.experience) {
		normalized.experience = exp as string | number;
	}

	// Normalize array fields - convert comma-separated strings to arrays
	const arrayFields: (keyof Person)[] = [
		"skills",
		"certifications",
		"achievements",
		"languages",
		"interests",
	];
	for (const field of arrayFields) {
		const value = normalized[field];
		if (typeof value === "string" && value.includes(",")) {
			normalized[field] = value
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
		}
	}

	// Trim all string fields
	for (const [key, value] of Object.entries(normalized)) {
		if (typeof value === "string") {
			normalized[key] = value.trim();
		}
	}

	return normalized;
}
