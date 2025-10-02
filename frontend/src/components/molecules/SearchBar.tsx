import { useEffect, useState } from "react";
import { Input } from "../atoms/Input";

interface SearchBarProps {
	onSearch: (query: string) => void;
	placeholder?: string;
	debounceMs?: number;
}

export function SearchBar({
	onSearch,
	placeholder = "Search...",
	debounceMs = 800,
}: SearchBarProps) {
	const [value, setValue] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			onSearch(value);
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [value, debounceMs, onSearch]);

	return (
		<div className="w-full">
			<Input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="w-full text-lg p-6"
			/>
		</div>
	);
}
