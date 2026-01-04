import { LayoutGrid, List as ListIcon } from "lucide-react";
import { Button } from "../atoms/Button";

interface ViewToggleProps {
	view: "grid" | "row";
	onViewChange: (view: "grid" | "row") => void;
	className?: string;
}

export const ViewToggle = ({
	view,
	onViewChange,
	className = "",
}: ViewToggleProps) => {
	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<Button
				size="sm"
				variant="ghost"
				className={
					view === "grid"
						? "bg-primary/20 text-primary"
						: "text-muted-foreground"
				}
				onClick={() => onViewChange("grid")}
				aria-pressed={view === "grid"}
				title="Grid view"
			>
				<LayoutGrid className="h-4 w-4" />
				<span className="sr-only">Grid</span>
			</Button>
			<Button
				size="sm"
				variant="ghost"
				className={
					view === "row"
						? "bg-primary/20 text-primary"
						: "text-muted-foreground"
				}
				onClick={() => onViewChange("row")}
				aria-pressed={view === "row"}
				title="List view"
			>
				<ListIcon className="h-4 w-4" />
				<span className="sr-only">List</span>
			</Button>
		</div>
	);
};
