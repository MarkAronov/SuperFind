import { useState } from "react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

interface SearchBarProps {
	onSearch: (query: string) => void;
	placeholder?: string;
	isLoading?: boolean;
}

export function SearchBar({
	onSearch,
	placeholder = "Search...",
	isLoading = false,
}: SearchBarProps) {
	const [value, setValue] = useState("");

	const handleSearch = () => {
		if (value.trim() && !isLoading) {
			onSearch(value);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !isLoading) {
			handleSearch();
		}
	};

	return (
		<div className="w-full flex gap-2">
			<Input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyPress={handleKeyPress}
				className="w-full text-lg p-6"
				disabled={isLoading}
			/>
			<Button
				type="button"
				onClick={handleSearch}
				className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
				disabled={!value.trim() || isLoading}
			>
				{isLoading ? "Searching..." : "Search"}
			</Button>
		</div>
	);
}
