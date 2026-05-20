import { cn } from "@/lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type {
	SelectContentProps,
	SelectGroupProps,
	SelectItemProps,
	SelectLabelProps,
	SelectProps,
	SelectScrollDownButtonProps,
	SelectScrollUpButtonProps,
	SelectSeparatorProps,
	SelectTriggerProps,
	SelectValueProps,
} from "./Select.types";

/**
 * Select Component
 *
 * Accessible dropdown select built directly on Radix UI Select primitives.
 * No shadcn/ui intermediary — full control with SkillVector design tokens.
 *
 * Sub-components:
 * - Select: Root state machine (open/close, value tracking)
 * - SelectTrigger: Clickable button that opens the dropdown
 * - SelectContent: Floating dropdown panel with Portal + scroll buttons
 * - SelectItem: Individual selectable option
 * - SelectGroup: Groups related items with an optional SelectLabel
 * - SelectLabel: Non-selectable group header
 * - SelectSeparator: Horizontal divider between groups
 * - SelectValue: Placeholder / selected value display inside trigger
 *
 * @example
 * ```tsx
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose an option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="a">Option A</SelectItem>
 *     <SelectItem value="b">Option B</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */

/**
 * Select Root
 * Manages open/close state and selected value
 */
const Select = ({ ...props }: SelectProps) => (
	<SelectPrimitive.Root data-slot="select" {...props} />
);

/**
 * SelectGroup
 * Groups related options; pair with SelectLabel for accessibility
 */
const SelectGroup = ({ ...props }: SelectGroupProps) => (
	<SelectPrimitive.Group data-slot="select-group" {...props} />
);

/**
 * SelectValue
 * Renders the currently selected value, or placeholder when nothing is selected
 */
const SelectValue = ({ ...props }: SelectValueProps) => (
	<SelectPrimitive.Value data-slot="select-value" {...props} />
);

/**
 * SelectScrollUpButton
 * Appears at top of content when scrollable — chevron to scroll up
 */
const SelectScrollUpButton = ({
	className,
	...props
}: SelectScrollUpButtonProps) => (
	<SelectPrimitive.ScrollUpButton
		data-slot="select-scroll-up-button"
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className,
		)}
		{...props}
	>
		<ChevronUpIcon className="size-4" />
	</SelectPrimitive.ScrollUpButton>
);

/**
 * SelectScrollDownButton
 * Appears at bottom of content when scrollable — chevron to scroll down
 */
const SelectScrollDownButton = ({
	className,
	...props
}: SelectScrollDownButtonProps) => (
	<SelectPrimitive.ScrollDownButton
		data-slot="select-scroll-down-button"
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className,
		)}
		{...props}
	>
		<ChevronDownIcon className="size-4" />
	</SelectPrimitive.ScrollDownButton>
);

/**
 * SelectTrigger
 * Button that opens the select dropdown
 * Size variants: default (36px height), sm (32px height)
 */
const SelectTrigger = ({
	className,
	size = "default",
	children,
	...props
}: SelectTriggerProps) => (
	<SelectPrimitive.Trigger
		data-slot="select-trigger"
		data-size={size}
		className={cn(
			// Layout — flex row, no wrap, fits content width
			"flex w-fit items-center justify-between gap-2 whitespace-nowrap",
			// Border and background
			"border-input rounded-md border bg-transparent dark:bg-input/30 dark:hover:bg-input/50",
			// Spacing and typography
			"px-3 py-2 text-sm",
			// Shadow and transitions
			"shadow-xs transition-[color,box-shadow] outline-none",
			// Placeholder and icon colors
			"data-[placeholder]:text-muted-foreground",
			"[&_svg:not([class*='text-'])]:text-muted-foreground",
			// Focus ring
			"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
			// Disabled state
			"disabled:cursor-not-allowed disabled:opacity-50",
			// Error state
			"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
			// Height variants via data-size attribute
			"data-[size=default]:h-9 data-[size=sm]:h-8",
			// SelectValue child styling
			"*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
			// SVG icon sizing and pointer events
			"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
			className,
		)}
		{...props}
	>
		{children}
		{/* Chevron icon — indicates the dropdown can be opened */}
		<SelectPrimitive.Icon asChild>
			<ChevronDownIcon className="size-4 opacity-50" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
);

/**
 * SelectContent
 * Floating dropdown panel — rendered in a Portal so it escapes overflow clipping.
 * Includes scroll up/down buttons when the list is taller than the viewport.
 *
 * position:
 * - "item-aligned" (default): lines up with the selected item
 * - "popper": floats below/above the trigger like a tooltip
 */
const SelectContent = ({
	className,
	children,
	position = "item-aligned",
	align = "center",
	...props
}: SelectContentProps & { align?: "start" | "center" | "end" }) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			data-slot="select-content"
			position={position}
			align={align}
			className={cn(
				// Background and text
				"bg-popover text-popover-foreground",
				// Enter/exit animations
				"data-[state=open]:animate-in data-[state=closed]:animate-out",
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
				"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
				"data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
				// Sizing and layout
				"relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem]",
				"origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto",
				// Visual
				"rounded-md border shadow-md",
				// Popper position offset
				position === "popper" &&
					"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
				className,
			)}
			{...props}
		>
			<SelectScrollUpButton />
			{/* Viewport — the scrollable inner list container */}
			<SelectPrimitive.Viewport
				className={cn(
					"p-1",
					// Popper mode: match trigger width so dropdown isn't narrower than trigger
					position === "popper" &&
						"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
				)}
			>
				{children}
			</SelectPrimitive.Viewport>
			<SelectScrollDownButton />
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
);

/**
 * SelectLabel
 * Non-selectable group header shown above a group of items
 */
const SelectLabel = ({ className, ...props }: SelectLabelProps) => (
	<SelectPrimitive.Label
		data-slot="select-label"
		className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
		{...props}
	/>
);

/**
 * SelectItem
 * Individual selectable option — shows a check icon on the right when selected
 */
const SelectItem = ({ className, children, ...props }: SelectItemProps) => (
	<SelectPrimitive.Item
		data-slot="select-item"
		className={cn(
			// Layout
			"relative flex w-full cursor-default items-center gap-2",
			// Spacing — extra right padding reserves space for the check indicator
			"py-1.5 pr-8 pl-2",
			// Typography
			"rounded-sm text-sm",
			// Behavior
			"outline-hidden select-none",
			// Disabled state
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			// Focus/hover highlight
			"focus:bg-accent focus:text-accent-foreground",
			// SVG icon sizing inside items
			"[&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
			// Last span (item text) alignment
			"*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
			className,
		)}
		{...props}
	>
		{/* Check indicator — absolutely positioned on the right, only visible when selected */}
		<span
			data-slot="select-item-indicator"
			className="absolute right-2 flex size-3.5 items-center justify-center"
		>
			<SelectPrimitive.ItemIndicator>
				<CheckIcon className="size-4" />
			</SelectPrimitive.ItemIndicator>
		</span>
		{/* Item text content */}
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
);

/**
 * SelectSeparator
 * Thin horizontal line to separate groups visually
 */
const SelectSeparator = ({ className, ...props }: SelectSeparatorProps) => (
	<SelectPrimitive.Separator
		data-slot="select-separator"
		className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
		{...props}
	/>
);

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
