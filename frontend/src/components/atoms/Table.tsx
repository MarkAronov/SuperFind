import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface TableProps extends ComponentProps<"table"> {}

function Table({ className, ...props }: TableProps) {
	return (
		<div className="overflow-x-auto">
			<table
				className={cn("w-full text-sm border-collapse", className)}
				{...props}
			/>
		</div>
	);
}

interface TableHeaderProps extends ComponentProps<"thead"> {}

function TableHeader({ className, ...props }: TableHeaderProps) {
	return <thead className={cn(className)} {...props} />;
}

interface TableBodyProps extends ComponentProps<"tbody"> {}

function TableBody({ className, ...props }: TableBodyProps) {
	return <tbody className={cn(className)} {...props} />;
}

interface TableRowProps extends ComponentProps<"tr"> {}

function TableRow({ className, ...props }: TableRowProps) {
	return (
		<tr
			className={cn("border-b border-border/50 last:border-0", className)}
			{...props}
		/>
	);
}

interface TableHeadProps extends ComponentProps<"th"> {}

function TableHead({ className, ...props }: TableHeadProps) {
	return (
		<th
			className={cn(
				"text-left py-3 px-4 font-semibold border-b border-border",
				className,
			)}
			{...props}
		/>
	);
}

interface TableCellProps extends ComponentProps<"td"> {
	variant?: "default" | "code" | "muted";
}

const cellVariants = {
	default: "py-3 px-4",
	code: "py-3 px-4 font-mono text-xs lg:text-sm",
	muted: "py-3 px-4 text-muted-foreground",
};

function TableCell({
	className,
	variant = "default",
	...props
}: TableCellProps) {
	return <td className={cn(cellVariants[variant], className)} {...props} />;
}

export {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	type TableProps,
	type TableHeaderProps,
	type TableBodyProps,
	type TableRowProps,
	type TableHeadProps,
	type TableCellProps,
};
