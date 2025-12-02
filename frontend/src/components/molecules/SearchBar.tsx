import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Glass } from "../atoms/Glass";

interface SearchBarProps {
	onSearch: (query: string, forceRefetch?: boolean) => void;
	placeholder?: string;
	isLoading?: boolean;
	initialValue?: string;
}

export function SearchBar({
	onSearch,
	placeholder = "Search...",
	isLoading = false,
	initialValue = "",
}: SearchBarProps) {
	const [value, setValue] = useState(initialValue);

	// Sync with initialValue when it changes (e.g., from URL)
	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const handleSearch = () => {
		if (value.trim() && !isLoading) {
			onSearch(value, true);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !isLoading) {
			handleSearch();
		}
	};

	return (
		<Glass
			variant="card"
			className="w-full flex items-center rounded-full overflow-hidden p-0"
		>
			<input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyPress={handleKeyPress}
				className="flex-1 h-12 px-5 bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={isLoading}
			/>
			<div className="h-8 w-px bg-border" />
			<button
				type="button"
				onClick={handleSearch}
				disabled={!value.trim() || isLoading}
				className="h-12 px-5 flex items-center justify-center bg-transparent hover:bg-white/10 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Search"
			>
				{isLoading ? (
					<div className="h-5 w-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
				) : (
					<Search className="h-5 w-5 text-muted-foreground" aria-hidden />
				)}
			</button>
		</Glass>
	);
}
