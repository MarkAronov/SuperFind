import type { ReactNode } from "react";

/**
 * GridItem
 *
 * The data shape consumed by DescriptionCard and Grid.
 * Describes all structured content a card can contain.
 *
 * Supports three rendering modes (selected automatically by DescriptionCard):
 * - Step layout:     when `step` is set — numbered process step with code, tags, lists
 * - Icon layout:     when `icon` is set (no step) — centered icon + title + description
 * - Standard layout: no step, no icon — heading + content + description + subsections
 *
 * Custom content escape hatches:
 * - `customContent` alone: replaces default rendering, keeps Card wrapper
 * - `noWrapper + customContent`: renders raw — consumer is responsible for providing a Card
 */
export interface GridItem {
	/** Unique identifier */
	id?: string | number;

	/** Optional icon element */
	icon?: ReactNode;

	/** Card title/heading (required unless using customContent) */
	title?: string;

	/** Main description text */
	description?: string;

	/** Additional content text or React element */
	content?: string | ReactNode;

	/** List of items to display */
	items?: string[];

	/** List of subsections with title and content */
	subsections?: { title: string; content: string }[];

	/** Tags/badges to display */
	tags?: string[];

	/** Code example with optional note */
	codeExample?: { label: string; code: string; note?: string };

	/** Action button */
	action?: {
		text: string;
		href: string;
		isInternal?: boolean;
	};

	/** Icon/step color class */
	color?: string;

	/** Step number (for step-based designs) */
	step?: number;

	/** Custom aria-label */
	ariaLabel?: string;

	/** Custom content that completely replaces default rendering (keeps Card wrapper) */
	customContent?: ReactNode;

	/** When true, customContent is rendered without Card wrapper */
	noWrapper?: boolean;

	/** Whether card content should be centered */
	centered?: boolean;
}
