import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { useState } from "react";
import ShikiHighlighter from "react-shiki";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { ScrollAreaScrollbar } from "../2-atoms/ScrollArea";
import type { CodeBlockProps } from "./CodeBlock.types";

/**
 * CodeBlock Component
 *
 * Displays formatted code with syntax highlighting via react-shiki.
 *
 * Features:
 * - Syntax highlighting: react-shiki lazily loads language grammars for minimal initial bundle
 * - Dual themes: github-light / github-dark switch automatically with the site's dark mode
 * - Horizontal scroll: Available when needed for long lines
 * - Copy button: Positioned top-right, shows feedback on click
 *
 * Theme switching uses CSS light-dark() — works because index.css sets
 * `color-scheme: light` on `html` and `color-scheme: dark` on `html.dark`.
 *
 * Copy Behavior:
 * - Copies full code to clipboard
 * - Shows "Copied!" feedback for 3 seconds
 * - Automatically resets to "Copy" text
 */

/**
 * Strips the common leading whitespace from a multi-line code string.
 * Allows template literals to be indented naturally in source files without
 * that indentation leaking into the rendered code block.
 */
const dedent = (code: string): string => {
	// Split into lines and strip leading/trailing empty lines
	const lines = code.split("\n");
	const trimmed = lines.slice(
		// Skip empty first line (from template literal opening backtick)
		lines[0].trim() === "" ? 1 : 0,
		// Skip empty last line (from template literal closing indent)
		lines[lines.length - 1].trim() === "" ? -1 : undefined,
	);

	// Find the minimum indentation among non-empty lines
	const minIndent = trimmed.reduce((min, line) => {
		if (line.trim() === "") return min;
		const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
		return Math.min(min, indent);
	}, Number.POSITIVE_INFINITY);

	// Strip the common leading whitespace from every line
	const indentToStrip = minIndent === Number.POSITIVE_INFINITY ? 0 : minIndent;
	return trimmed.map((line) => line.slice(indentToStrip)).join("\n");
};

export const CodeBlock = ({ language, code }: CodeBlockProps) => {
	// Strip any common leading indentation introduced by template literal formatting
	const normalizedCode = dedent(code);

	// Track copy state for user feedback
	const [copied, setCopied] = useState(false);

	/**
	 * Copy code to clipboard and show feedback.
	 * Uses navigator.clipboard with an execCommand fallback for mobile browsers
	 * that don't support the async clipboard API.
	 */
	const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
		try {
			// Modern clipboard API — works on HTTPS desktop & most mobile browsers
			await navigator.clipboard.writeText(normalizedCode);
		} catch {
			// Fallback for mobile browsers that block navigator.clipboard
			const textarea = document.createElement("textarea");
			textarea.value = normalizedCode;
			// Keep off-screen so it doesn't cause a layout shift
			textarea.style.cssText =
				"position:fixed;top:-9999px;left:-9999px;opacity:0";
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();
			document.execCommand("copy");
			document.body.removeChild(textarea);
		}

		setCopied(true);

		// Blur the button to release the stuck :hover state on touch devices
		(e.currentTarget as HTMLButtonElement).blur();

		// Reset copy feedback after 3 seconds
		setTimeout(() => setCopied(false), 3000);
	};

	return (
		// Outer grid div: display:grid constrains the block to parent width (grid tracks are
		// sized by the parent, not by children) and provides the positioning context for the
		// Copy button. It must NOT have overflow-hidden so the button is never clipped.
		<Div className="relative grid">
			{/* ScrollAreaPrimitive.Root: overflow-hidden clips the pre inside the
			    grid-constrained track so it cannot push the layout wider */}
			<ScrollAreaPrimitive.Root
				className={cn("overflow-hidden", BORDERS.RADIUS.md)}
			>
				{/* Viewport: Radix sets overflow:scroll here; whitespace-pre lets long lines
				    overflow horizontally so the horizontal scrollbar actually activates */}
				<ScrollAreaPrimitive.Viewport className="w-full rounded-[inherit]">
					{/* react-shiki handles async grammar loading and React rendering internally.
					    defaultColor="light-dark()" uses the CSS light-dark() function to switch
					    themes automatically based on html { color-scheme } — set in index.css.
					    addDefaultStyles={false}: we supply all styling via the shiki-wrapper CSS
					    block in index.css so we have full control over padding and font. */}
					<ShikiHighlighter
						language={language}
						// Dual themes — light-dark() CSS function switches automatically with html { color-scheme }
						theme={{ light: "github-light", dark: "github-dark" }}
						defaultColor="light-dark()"
						addDefaultStyles={false}
						showLanguage={false}
						as="div"
						className="shiki-wrapper"
					>
						{normalizedCode}
					</ShikiHighlighter>
				</ScrollAreaPrimitive.Viewport>

				{/* Horizontal scrollbar — atom's auto-fade thumb, positioned bottom of Root */}
				<ScrollAreaScrollbar orientation="horizontal" />

				<ScrollAreaPrimitive.Corner />
			</ScrollAreaPrimitive.Root>

			{/* Copy button — sibling of Root, not inside overflow-hidden, so it is never clipped.
			    Positioned absolute relative to the outer grid div. */}
			<Button
				type="button"
				variant="default"
				size="sm"
				// touch-manipulation removes the 300ms tap delay on mobile
				className={cn(
					"touch-manipulation",
					// Position
					"absolute top-2 right-2 z-10",
					// Typography
					TYPOGRAPHY.FONT_SIZE.xs,
				)}
				onClick={handleCopy}
			>
				{copied ? "Copied!" : "Copy"}
			</Button>
		</Div>
	);
};
