import { cn } from "@/lib/utils";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	hoverable?: boolean;
}

export function Card({ children, className, hoverable = false }: CardProps) {
	return (
		<div
			className={cn(
				"p-4 bg-white border rounded-lg shadow-sm",
				hoverable && "hover:shadow-md transition-shadow cursor-pointer",
				className,
			)}
		>
			{children}
		</div>
	);
}
