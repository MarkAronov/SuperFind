import { cn } from "@/lib/utils";
import { CURSOR } from "../1-ions/cursor";
import { Span } from "../2-atoms/Span";
import { Tooltip, TooltipContent, TooltipTrigger } from "../2-atoms/Tooltip";

/**
 * TruncatedText Component
 *
 * Displays text with ellipsis truncation and full text on hover.
 * Automatically shows tooltip when text exceeds max length.
 *
 * Truncation Behavior:
 * - Checks if text length exceeds maxLength
 * - Truncates text and adds ellipsis (…) character
 * - Original: "This is a very long text string"
 * - Truncated: "This is a very long tex…" (maxLength=23)
 *
 * Tooltip Display:
 * - showTooltip={true}: Shows full text in tooltip when truncated (default)
 * - showTooltip={false}: Only displays truncated text, no tooltip
 * - Delay: 200ms hover delay before tooltip appears
 * - Cursor: Help cursor (cursor-help) indicates tooltip availability
 *
 * Not Truncated:
 * - Returns plain span (no tooltip wrapper)
 * - Displays full text normally
 * - No interactive cursor change
 *
 * Accessibility:
 * - Full text always available via tooltip
 * - Help cursor indicates additional information
 * - Keyboard accessible (tooltip on focus)
 *
 * Use Cases:
 * - Long names in compact tables
 * - Descriptions in card grids
 * - File names in lists
 * - User-generated content previews
 */

interface TruncatedTextProps {
	text: string;
	maxLength?: number;
	className?: string;
	showTooltip?: boolean;
}

export const TruncatedText = ({
	text,
	maxLength = 30,
	className,
	showTooltip = true,
}: TruncatedTextProps) => {
	const isTruncated = text.length > maxLength;
	const displayText = isTruncated ? `${text.substring(0, maxLength)}…` : text;

	// Not truncated - display plain text using Span atom
	if (!showTooltip || !isTruncated) {
		return <Span className={className}>{displayText}</Span>;
	}

	// Truncated - display with tooltip using Span atom
	return (
		<Tooltip delayDuration={200}>
			<TooltipTrigger asChild>
				<Span className={cn(CURSOR.help, className)}>{displayText}</Span>
			</TooltipTrigger>
			<TooltipContent>{text}</TooltipContent>
		</Tooltip>
	);
};
