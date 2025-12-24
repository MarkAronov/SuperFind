type BadgeStatus =
	| "ready"
	| "soon"
	| "planned"
	| "beginner"
	| "intermediate"
	| "advanced";

interface StatusBadgeProps {
	status: BadgeStatus;
	label?: string;
}

const statusConfig: Record<BadgeStatus, { style: string; label: string }> = {
	ready: {
		style: "bg-success/10 dark:bg-success/20 text-success dark:text-success",
		label: "Production Ready",
	},
	soon: {
		style: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
		label: "Coming Soon",
	},
	planned: {
		style:
			"bg-gray-100 dark:bg-foreground/30 text-muted-foreground dark:text-gray-300",
		label: "Planned",
	},
	beginner: {
		style: "bg-success/10 text-success",
		label: "Beginner",
	},
	intermediate: {
		style: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
		label: "Intermediate",
	},
	advanced: {
		style:
			"bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
		label: "Advanced",
	},
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
	const config = statusConfig[status];
	const displayLabel = label || config.label;

	return (
		<span
			className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${config.style}`}
		>
			{displayLabel}
		</span>
	);
}
