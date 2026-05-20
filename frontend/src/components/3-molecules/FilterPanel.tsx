import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { MOTION } from "@/animations/0-tokens/tokens";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Badge } from "../2-atoms/Badge";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Input } from "../2-atoms/Input";
import { Link } from "../2-atoms/Link";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../2-atoms/Select";
import { Text } from "../2-atoms/Text";

export interface FilterOption {
	value: string;
	label: string;
	icon?: React.ReactNode;
}

export interface FilterConfig {
	label: string;
	value: string;
	options: FilterOption[];
	icon?: React.ReactNode;
}

export interface ActiveFilter {
	id: string;
	type: string;
	value: string | string[];
	label: string;
}

export interface FilterPanelProps {
	/** Icon to display in the header */
	icon?: React.ReactNode;
	/** Title of the panel */
	title?: string;
	/** Description text */
	description?: string;
	/** Search configuration */
	search?: {
		value: string;
		onChange: (value: string) => void;
		placeholder?: string;
		icon?: React.ReactNode;
	};
	/** Filter configurations */
	filters?: FilterConfig[];
	/** Current filter values */
	filterValues?: Record<string, string>;
	/** Filter change handler */
	onFilterChange?: (filterId: string, value: string) => void;
	/** Active filters to display */
	activeFilters?: ActiveFilter[];
	/** Clear all filters handler */
	onClearAll?: () => void;
	/** Remove specific filter handler */
	onRemoveFilter?: (type: string) => void;
	/** Primary action configuration */
	primaryAction?: {
		label: string;
		href: string;
		icon?: React.ReactNode;
	};
	/** Secondary action configuration */
	secondaryAction?: {
		label: string;
		href: string;
		icon?: React.ReactNode;
	};
	/** Results count */
	resultsCount?: number;
	/** Total items count */
	totalCount?: number;
	/** Additional CSS classes */
	className?: string;
	/** Layout variant */
	variant?: "compact" | "full";
}

/**
 * FilterPanel Component
 *
 * A feature-rich 2026 filtering panel with search, multi-select filters, active filter badges,
 * and clear all functionality. Supports both compact and full layouts.
 */
export const FilterPanel = ({
	icon,
	title,
	description,
	search,
	filters = [],
	filterValues = {},
	onFilterChange,
	activeFilters = [],
	onClearAll,
	onRemoveFilter,
	primaryAction,
	secondaryAction,
	resultsCount,
	totalCount,
	className = "",
	variant = "full",
}: FilterPanelProps) => {
	const hasActiveFilters = activeFilters.length > 0 || search?.value;

	return (
		<Div
			className={cn(
				// Spacing
				"px-4 py-4 sm:px-6 sm:py-6",
				// Custom
				className,
			)}
		>
			{/* Header Section */}
			{variant === "full" && (title || description) && (
				<Div className="text-center mb-6">
					{title && (
						<Div
							className={cn(
								// Layout
								"flex items-baseline justify-center",
								// Spacing
								SPACING.GAP.sm,
								"mb-4",
							)}
						>
							{icon}
							<Heading variant="section">{title}</Heading>
						</Div>
					)}
					{description && (
						<Text variant="lead" className="text-muted-foreground mb-6">
							{description}
						</Text>
					)}
					{(primaryAction || secondaryAction) && (
						<Div
							className={cn(
								// Layout
								"flex flex-wrap items-center justify-center",
								// Spacing
								SPACING.GAP.sm,
								"mb-6",
							)}
						>
							{/* Primary action button */}
							{primaryAction && (
								<Button asChild>
									<Link
										href={primaryAction.href}
										external
										className="inline-flex items-center gap-2"
									>
										{primaryAction.icon}
										{primaryAction.label}
									</Link>
								</Button>
							)}

							{/* Secondary action button (optional) */}
							{secondaryAction && (
								<Button asChild variant="secondary">
									<Link
										href={secondaryAction.href}
										external
										className="inline-flex items-center gap-2"
									>
										{secondaryAction.icon}
										{secondaryAction.label}
									</Link>
								</Button>
							)}
						</Div>
					)}
				</Div>
			)}

			{/* Filter Controls */}
			<Div
				className={cn(
					// Layout
					"flex flex-col lg:flex-row min-w-0",
					// Spacing
					SPACING.GAP.md,
				)}
			>
				{/* Search Input */}
				{search && (
					<Div className="flex-1 min-w-0">
						<Div className="relative">
							{search.icon && (
								<Div
									className={cn(
										// Positioning
										"absolute left-3 top-1/2 -translate-y-1/2",
										// Colors
										"text-muted-foreground",
									)}
								>
									{search.icon}
								</Div>
							)}
							<Input
								value={search.value}
								onChange={(e) => search.onChange(e.target.value)}
								placeholder={search.placeholder}
								// Shift text right when icon is present so it doesn't overlap
								className={search.icon ? "pl-9" : undefined}
							/>
						</Div>
					</Div>
				)}

				{/* Filter Dropdowns */}
				{filters.length > 0 && (
					<Div
						className={cn(
							// Layout
							"flex w-full flex-wrap lg:w-auto",
							// Spacing
							SPACING.GAP.sm,
						)}
					>
						{filters.map((filter) => (
							<Select
								key={filter.value}
								value={filterValues[filter.value] || filter.options[0]?.value}
								onValueChange={(value) => onFilterChange?.(filter.value, value)}
							>
								{/* Full-width on small screens, fixed token width on larger screens */}
								<SelectTrigger
									className={cn(
										"w-full sm:w-40",
										// Echo the same accent-border hover as other interactive controls
										"transition-colors",
										BORDERS.INTERACTIVE.hoverAccent,
									)}
								>
									{filter.icon}
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{filter.options.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						))}
					</Div>
				)}
			</Div>

			{/* Active Filters & Results Count */}
			{(hasActiveFilters || resultsCount !== undefined) && (
				<Div
					className={cn(
						// Layout
						"flex flex-wrap items-center",
						// Spacing
						SPACING.GAP.sm,
						"mt-4 pt-4",
					)}
				>
					{/* Results Count */}
					{resultsCount !== undefined && (
						<Text variant="small" className="text-muted-foreground">
							{resultsCount} {resultsCount === 1 ? "result" : "results"}
							{totalCount !== undefined && ` of ${totalCount}`}
						</Text>
					)}

					{/* Active Filters */}
					{hasActiveFilters && (
						<>
							{resultsCount !== undefined && (
								<Div className="h-4 w-px bg-border" />
							)}
							<Text variant="small" className="text-muted-foreground">
								Active filters:
							</Text>
							<Div
								className={cn(
									// Layout
									"flex flex-wrap",
									// Spacing
									SPACING.GAP.sm,
								)}
							>
								{/* Animate each badge in/out for smooth filter feedback */}
								<AnimatePresence mode="popLayout">
									{activeFilters.map((filter) => (
										<motion.div
											key={filter.type}
											initial={{ opacity: 0, scale: 0.85 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.85 }}
											transition={MOTION.transition.fast}
										>
											<Badge
												variant="secondary"
												className={cn(
													// Spacing
													SPACING.GAP.xs,
													// States
													"cursor-pointer hover:bg-secondary/80 transition-colors",
												)}
												onClick={() => onRemoveFilter?.(filter.type)}
											>
												{filter.label}
												<X className="h-3 w-3" />
											</Badge>
										</motion.div>
									))}
								</AnimatePresence>
							</Div>
							{onClearAll && (
								<Button
									variant="ghost"
									size="sm"
									onClick={onClearAll}
									className={cn("h-7", TYPOGRAPHY.FONT_SIZE.xs)}
								>
									Clear all
								</Button>
							)}
						</>
					)}
				</Div>
			)}
		</Div>
	);
};
