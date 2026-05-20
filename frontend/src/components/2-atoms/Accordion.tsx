import { MOTION } from "@/animations/0-tokens/tokens";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { useHoverRipple } from "../../hooks/animations/useHoverRipple";
import type {
	AccordionContentProps,
	AccordionItemProps,
	AccordionProps,
	AccordionTriggerProps,
} from "./Accordion.types";

/**
 * Accordion component
 * A collapsible content section with customizable expand/collapse behavior.
 * Supports both single and multiple item expansion.
 *
 * @example
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>Content here</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 */
export const Accordion = ({ ...props }: AccordionProps) => {
	return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
};

/**
 * AccordionItem component
 * Individual collapsible item within an Accordion.
 * Use island styling (border + rounded) for separated items, or default for connected items.
 *
 * Features:
 * - Hover effect: Framer Motion animates borderColor (no CSS hover — motion owns it)
 * - Island style: separated items with rounded borders
 * - Default style: connected items with dividing lines
 *
 * @example
 * // Island style (separated)
 * <AccordionItem className="border rounded-lg border-border px-3">
 *
 * // Default style (connected with dividing lines)
 * <AccordionItem>
 */
export const AccordionItem = ({ className, ...props }: AccordionItemProps) => {
	// Track hover state so Framer Motion can animate the border color
	const { isHovering, onMouseEnter, onMouseLeave } = useHoverRipple();

	return (
		<motion.div
			// Animate borderColor via Framer Motion; replaces hover:border-accent CSS class
			animate={{
				borderColor: isHovering ? MOTION.hover.border : "oklch(var(--border))",
			}}
			transition={MOTION.ripple.borderHover}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className={cn("border-b last:border-b-0", className)}
		>
			<AccordionPrimitive.Item data-slot="accordion-item" {...props} />
		</motion.div>
	);
};

/**
 * AccordionTrigger component
 * Clickable header that expands/collapses accordion content.
 * Includes chevron icon that rotates based on open/closed state.
 *
 * Features:
 * - Keyboard accessible (Enter/Space to toggle)
 * - Focus ring for keyboard navigation
 * - Smooth chevron rotation animation
 * - No underline on hover (more polished appearance)
 */
export const AccordionTrigger = ({
	className,
	children,
	...props
}: AccordionTriggerProps) => {
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				data-slot="accordion-trigger"
				className={cn(
					// Layout & Structure
					"flex flex-1 items-start justify-between gap-4",
					// Spacing
					"py-4",
					// Typography
					"text-left text-sm font-medium",
					// Interactive States (no underline for cleaner look)
					"transition-all outline-none",
					// Focus States
					"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-md",
					// Disabled States
					"disabled:pointer-events-none disabled:opacity-50",
					// Chevron Rotation
					"[&[data-state=open]>svg]:rotate-180",
					className,
				)}
				{...props}
			>
				{children}
				{/* Chevron Icon */}
				<ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
};

/**
 * AccordionContent component
 * Collapsible content area with smooth Framer Motion expand/collapse animation.
 * Content is always mounted (forceMount) so Framer Motion can animate height to/from 0.
 *
 * Animation behavior:
 * - Height animates from 0 → "auto" on open, "auto" → 0 on close
 * - Inner content fades + slides up (expandContent variants)
 * - MutationObserver syncs React state with Radix data-state attribute changes
 */
export const AccordionContent = ({
	className,
	children,
	...props
}: AccordionContentProps) => {
	// Ref to the Radix Content element so we can read its data-state attribute
	const contentRef = useRef<HTMLDivElement>(null);

	// Local open state — synced from Radix via MutationObserver
	const [isOpen, setIsOpen] = useState(false);

	// Watch the data-state attribute set by Radix to drive Framer Motion
	useLayoutEffect(() => {
		const el = contentRef.current;
		if (!el) return;

		// Sync initial state from Radix (runs before first paint — no flash)
		setIsOpen(el.getAttribute("data-state") === "open");

		// Track subsequent Radix state machine transitions
		const observer = new MutationObserver(() => {
			setIsOpen(el.getAttribute("data-state") === "open");
		});
		observer.observe(el, { attributes: true, attributeFilter: ["data-state"] });

		// Cleanup observer on unmount
		return () => observer.disconnect();
	}, []);

	return (
		<AccordionPrimitive.Content
			ref={contentRef}
			// forceMount keeps the element in DOM so the close animation can play
			forceMount
			data-slot="accordion-content"
			className="text-sm"
			{...props}
		>
			{/* Outer div animates the height: 0 ↔ "auto" with a springy feel (overflow clips content) */}
			<motion.div
				initial={false}
				animate={
					isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
				}
				transition={MOTION.expand.transitionSpring}
				style={{ overflow: "hidden" }}
			>
				{/* Inner div fades + slides down as content reveals */}
				<motion.div
					initial={false}
					variants={MOTION.expand.content}
					animate={isOpen ? "visible" : "hidden"}
					className={cn("pt-0 pb-4", className)}
				>
					{children}
				</motion.div>
			</motion.div>
		</AccordionPrimitive.Content>
	);
};
