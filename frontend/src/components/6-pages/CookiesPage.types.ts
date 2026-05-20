import type { ReactNode } from "react";

// Individual cookie row in a data table
export type CookieEntry = {
	name: string;
	purpose: string;
	duration: string;
};

// Browser item in the browser settings list
export type BrowserEntry = {
	name: string;
	instructions: string;
};

// Content block — plain paragraph text
export type ParagraphBlock = {
	kind: "paragraph";
	text: string;
};

// Content block — sub-section with heading, body text, and optional list
export type SubSectionBlock = {
	kind: "subsection";
	heading: string;
	body: string;
	list?: BrowserEntry[];
};

// Content block — cookie data table with column headers and rows
export type CookieTableBlock = {
	kind: "cookie-table";
	columns: string[];
	cookies: CookieEntry[];
};

// Union of all possible content block types — discriminated by 'kind'
export type ContentBlock = ParagraphBlock | SubSectionBlock | CookieTableBlock;

// Unified policy card — every card on the page shares this structure
export type PolicyCard = {
	ariaLabel: string;
	heading: string;
	icon?: ReactNode;
	blocks: ContentBlock[];
};
