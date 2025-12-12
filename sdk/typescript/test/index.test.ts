import { describe, expect, it } from "vitest";
import { SkillVectorClient } from "../src/index";

describe("SkillVectorClient", () => {
	it("uses default baseUrl when none provided", () => {
		const client = new SkillVectorClient();
		// internal property is private, so we infer by calling the build of URL via search
		const url = (client as unknown as { baseUrl: string }).baseUrl;
		expect(url).toBe("http://localhost:3000");
	});

	it("accepts override of baseUrl and options", () => {
		const client = new SkillVectorClient({
			baseUrl: "https://example.com",
			apiKey: "abc",
		});
		const url = (client as unknown as { baseUrl: string }).baseUrl;
		expect(url).toBe("https://example.com");
	});
});
