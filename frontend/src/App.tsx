import { useState } from "react";
import { Input } from "./components/ui/input";

function App() {
	const [inputValue, setInputValue] = useState("");

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Input
				type="text"
				placeholder="Enter something..."
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				className="w-64"
			/>
		</div>
	);
}

export default App;
