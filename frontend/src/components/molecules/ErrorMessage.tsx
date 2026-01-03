import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent } from "../atoms/Card";
import { Text } from "../atoms/Text";

interface ErrorMessageProps {
	message: string;
	title?: string;
	variant?: "error" | "warning" | "info";
	className?: string;
	children?: React.ReactNode;
}

const variantStyles = {
	error:
		"bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
	warning:
		"bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",
	info: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
};

const variantIcons = {
	error: <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />,
	warning: <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />,
	info: <Info className="h-5 w-5 shrink-0 mt-0.5" />,
};

export const ErrorMessage = ({
	message,
	title,
	variant = "error",
	className = "",
	children,
}: ErrorMessageProps) => {
	const defaultTitle =
		variant === "error" ? "Error" : variant === "warning" ? "Warning" : "Info";

	return (
		<Card variant="hover" className={`${variantStyles[variant]} ${className}`}>
			<CardContent>
				<div className="flex gap-3">
					{variantIcons[variant]}
					<div className="flex-1">
						<Text className="font-semibold">{title || defaultTitle}:</Text>
						<Text className="mt-1">{message}</Text>
						{children}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
