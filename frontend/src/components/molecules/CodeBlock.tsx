import { useState } from "react";

interface CodeBlockProps {
	language: string;
	code: string;
}

export const CodeBlock = ({ language, code }: CodeBlockProps) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="relative">
			<pre className="bg-muted p-4 rounded-md overflow-x-auto">
				<code className={`language-${language}`}>{code}</code>
			</pre>
			<button
				type="button"
				onClick={handleCopy}
				className="absolute top-2 right-2 px-2 py-1 text-xs bg-background border rounded hover:bg-muted"
			>
				{copied ? "Copied!" : "Copy"}
			</button>
		</div>
	);
};
