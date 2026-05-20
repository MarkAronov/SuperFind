import { ANIMATION } from "@/animations/0-tokens/tailwind";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { type KeyboardEvent, useEffect, useState } from "react";
import { BORDERS } from "../1-ions/borders";
import { CURSOR } from "../1-ions/cursor";
import { Glassmorphism as Glass } from "../1-ions/designs/Glassmorphism";
import { OPACITY } from "../1-ions/opacity";
import { SIZING } from "../1-ions/sizing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Input } from "../2-atoms/Input";
import type { SearchBarProps } from "./SearchBar.types";

/**
 * SearchBar Component
 *
 * Glassmorphism search input with integrated search button and loading state.
 * Syncs with URL/external state via initialValue prop.
 *
 * Features:
 * - Glassmorphism card styling (frosted glass effect)
 * - Rounded-full pill shape with constrained width
 * - Enter key support for search submission
 * - Loading state with spinner animation
 * - Disabled state when loading (prevents duplicate searches)
 * - Visual separator between input and button
 *
 * Input Behavior:
 * - Auto-syncs with initialValue changes (e.g., from URL params)
 * - Trimmed value validation (prevents empty searches)
 * - Responsive text size (sm on mobile, base on desktop)
 * - Transparent background with foreground text
 *
 * Button States:
 * - Default: Search icon (muted foreground)
 * - Loading: Spinning border animation (muted foreground)
 * - Hover: Subtle white background (10% opacity)
 * - Disabled: Reduced opacity, not-allowed cursor
 *
 * Layout:
 * - Glass card container (constrained width, centered)
 * - Flex layout: input (flex-1) | divider | button
 * - Height: 48px (h-12) for comfortable touch targets
 * - Border: Subtle white border with glassmorphism
 */

export const SearchBar = ({
	onSearch,
	placeholder = "Search...",
	isLoading = false,
	initialValue = "",
}: SearchBarProps) => {
	// Local search input state
	const [value, setValue] = useState(initialValue);

	/**
	 * Sync with initialValue when it changes (e.g., from URL)
	 * Allows external state to control input value
	 */
	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	/**
	 * Execute search with current value
	 * Only triggers if value is non-empty and not loading
	 */
	const handleSearch = () => {
		if (value.trim() && !isLoading) {
			onSearch(value, true);
		}
	};

	/**
	 * Handle Enter key press for search submission
	 */
	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !isLoading) {
			handleSearch();
		}
	};

	return (
		<Glass
			variant="card"
			constrain
			className={cn(
				// Layout & Sizing
				"w-full flex items-center",
				// Effects & Borders
				"rounded-full overflow-hidden",
				"border border-white/20 dark:border-white/10",
				// Shadows
				"shadow-md",
				// Spacing
				"p-0",
				// Focus ring - highlight the whole bar when input is focused
				// Matches Button atom focus style (ring-[3px] ring-ring/50)
				"focus-within:ring-[3px] focus-within:ring-ring/50",
			)}
		>
			{/* Search input field */}
			<Input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyPress={handleKeyPress}
				className={cn(
					// Layout & Sizing
					"flex-1 h-12",
					// Spacing
					"px-5",
					// Colors & Effects
					// Force transparent bg in both modes - overrides shadcn's dark:bg-input/30
					"bg-transparent dark:!bg-transparent border-none outline-none",
					// Typography
					TYPOGRAPHY.FONT_SIZE.sm_base,
					"text-foreground placeholder:text-muted-foreground",
					// States
					`disabled:${OPACITY.muted} disabled:${CURSOR.notAllowed}`,
				)}
				disabled={isLoading}
			/>

			{/* Visual separator between input and button */}
			<Div className="h-8 w-px bg-border" />

			{/* Search submit button - follows footer/header icon pattern */}
			{/* variant="link" + size={null} removes all background/padding defaults */}
			<Button
				type="button"
				variant="link"
				size={null}
				onClick={handleSearch}
				disabled={!value.trim() || isLoading}
				className={cn(
					// Layout & Sizing
					"h-12 px-5",
					"flex items-center justify-center",
					// Colors - muted at rest, accent on hover/active (matches footer/header icons)
					"text-muted-foreground hover:text-accent active:text-accent",
					// Transitions
					"transition-colors",
					// States
					`disabled:${OPACITY.muted} disabled:${CURSOR.notAllowed}`,
				)}
				aria-label="Search"
			>
				{/* Loading state - spinning border animation */}
				{isLoading ? (
					<Div
						className={cn(
							// Sizing
							SIZING.ICON.md,
							// Border
							BORDERS.WIDTH.thin,
							"border-muted-foreground border-t-transparent",
							BORDERS.RADIUS.full,
							// Animation
							ANIMATION.KEYFRAME.spin,
						)}
					/>
				) : (
					<Search
						className={cn(
							// Sizing only - color inherited from parent Button via currentColor
							// This lets hover:text-accent on the button propagate to the icon
							SIZING.ICON.md,
						)}
						aria-hidden
					/>
				)}
			</Button>
		</Glass>
	);
};
