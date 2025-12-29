import { Slot } from "@radix-ui/react-slot";
import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface GlassProps extends HTMLAttributes<HTMLDivElement> {
	asChild?: boolean;
	variant?: "card" | "panel" | "default" | "pronounced";
	/**
	 * When true, constrains the width and centers the element.
	 * Defaults to `max-w-2xl mx-auto` unless `maxWidthClass` is provided.
	 */
	constrain?: boolean;
	maxWidthClass?: string;
}

export const Glass = ({
	className = "",
	asChild = false,
	variant = "default",
	constrain = false,
	maxWidthClass,
	children,
	...props
}: GlassProps) => {
	const Comp = asChild ? Slot : "div";
	const base = "glass";
	const variantClass =
		variant === "card"
			? "glass-card"
			: variant === "pronounced"
				? "glass-pronounced"
				: "";
	const constraintClass = constrain
		? (maxWidthClass ?? "max-w-2xl mx-auto")
		: "";

	// Randomize noise background offset per-instance on client to avoid visible tiling
	const [noiseVars, setNoiseVars] = useState<Record<string, string> | null>(
		null,
	);

	useEffect(() => {
		// Only run on client
		const size = 800; // should match default noise-size in CSS
		const x = Math.floor(Math.random() * size);
		const y = Math.floor(Math.random() * size);
		setNoiseVars({
			"--noise-x": `${x}px`,
			"--noise-y": `${y}px`,
			"--noise-size": `${size}px ${size}px`,
		});
	}, []);

	return (
		<Comp
			className={cn(base, variantClass, constraintClass, className)}
			style={{
				...(props.style as CSSProperties),
				...(noiseVars as unknown as CSSProperties),
			}}
			{...props}
		>
			{children}
		</Comp>
	);
};

export default Glass;
