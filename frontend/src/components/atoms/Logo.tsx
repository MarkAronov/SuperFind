import { useId } from "react";

interface LogoProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}

const sizes = {
	sm: "h-6 w-6",
	md: "h-8 w-8",
	lg: "h-12 w-12",
};

export const Logo = ({ className = "", size = "md" }: LogoProps) => {
	const id = useId();
	const hexGradientId = `${id}-hexGradient`;
	const gradABId = `${id}-gradAB`;
	const gradACId = `${id}-gradAC`;
	const gradBDId = `${id}-gradBD`;
	const gradCEId = `${id}-gradCE`;
	const gradEGId = `${id}-gradEG`;
	const gradCFId = `${id}-gradCF`;
	const gradGHId = `${id}-gradGH`;

	return (
		<svg
			className={`${sizes[size]} ${className}`}
			style={{ filter: "none", mixBlendMode: "normal" }}
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>SkillVector Logo</title>
			{/* Define gradient from deep purple (bottom-left) to bright pink (top-right) */}
			<defs>
				<linearGradient id={hexGradientId} x1="0%" y1="100%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="#7c3aed" />
					<stop offset="50%" stopColor="#c026d3" />
					<stop offset="100%" stopColor="#ec4899" />
				</linearGradient>

				{/* Per-edge gradients to match vertex colors (userSpaceOnUse so gradient aligns with the edge) */}
				<linearGradient
					id={gradABId}
					x1="50"
					y1="20"
					x2="30"
					y2="38"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#ff9800" />
					<stop offset="100%" stopColor="#ffa726" />
				</linearGradient>
				<linearGradient
					id={gradACId}
					x1="50"
					y1="20"
					x2="68"
					y2="35"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#ff9800" />
					<stop offset="100%" stopColor="#ffc107" />
				</linearGradient>
				<linearGradient
					id={gradBDId}
					x1="30"
					y1="38"
					x2="22"
					y2="58"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#ffa726" />
					<stop offset="100%" stopColor="#ffc107" />
				</linearGradient>
				{/* gradBE removed to avoid cycle (edge removed) */}
				<linearGradient
					id={gradCEId}
					x1="68"
					y1="35"
					x2="45"
					y2="52"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#ffc107" />
					<stop offset="100%" stopColor="#ffeb3b" />
				</linearGradient>
				<linearGradient
					id={gradEGId}
					x1="45"
					y1="52"
					x2="55"
					y2="70"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#ffeb3b" />
					<stop offset="100%" stopColor="#ffc107" />
				</linearGradient>
				<linearGradient
					id={gradCFId}
					x1="68"
					y1="35"
					x2="78"
					y2="55"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#ffc107" />
					<stop offset="100%" stopColor="#ff8a00" />
				</linearGradient>
				<linearGradient
					id={gradGHId}
					x1="55"
					y1="70"
					x2="38"
					y2="75"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#ffc107" />
					<stop offset="100%" stopColor="#ffeb3b" />
				</linearGradient>
			</defs>{" "}
			{/* Outer nonagon (9-sided) with gradient fill */}
			<path
				d="M50 3 L80.195 13.998 L96.248 41.842 L90.702 73.5 L66.07 94.167 L33.926 94.167 L9.298 73.5 L3.752 41.842 L19.805 13.998 Z"
				fill={`url(#${hexGradientId})`}
			/>
			<path
				d="M50 3 L80.195 13.998 L96.248 41.842 L90.702 73.5 L66.07 94.167 L33.926 94.167 L9.298 73.5 L3.752 41.842 L19.805 13.998 Z"
				stroke={`url(#${hexGradientId})`}
				strokeWidth="2"
			/>
			{/* 8-node MST graph */}
			{/* Edges of the MST */}
			<line
				x1="50"
				y1="20"
				x2="30"
				y2="38"
				stroke={`url(#${gradABId})`}
				strokeWidth="2"
			/>
			<line
				x1="50"
				y1="20"
				x2="68"
				y2="35"
				stroke={`url(#${gradACId})`}
				strokeWidth="2"
			/>
			<line
				x1="30"
				y1="38"
				x2="22"
				y2="58"
				stroke={`url(#${gradBDId})`}
				strokeWidth="2"
			/>
			{/* BE edge removed to break cycle */}
			<line
				x1="68"
				y1="35"
				x2="45"
				y2="52"
				stroke={`url(#${gradCEId})`}
				strokeWidth="2"
			/>
			<line
				x1="45"
				y1="52"
				x2="55"
				y2="70"
				stroke={`url(#${gradEGId})`}
				strokeWidth="2"
			/>
			<line
				x1="68"
				y1="35"
				x2="78"
				y2="55"
				stroke={`url(#${gradCFId})`}
				strokeWidth="2"
			/>
			<line
				x1="55"
				y1="70"
				x2="38"
				y2="75"
				stroke={`url(#${gradGHId})`}
				strokeWidth="2"
			/>
			{/* Nodes (dots) of the MST */}
			{/* Nodes with size reflecting importance/weights (larger = more important) */}
			<circle cx="50" cy="20" r="6" fill="#ff9800" />
			<circle cx="30" cy="38" r="5" fill="#ffa726" />
			<circle cx="68" cy="35" r="4.5" fill="#ffc107" />
			<circle cx="22" cy="58" r="3.5" fill="#ffeb3b" />
			<circle cx="45" cy="52" r="4" fill="#ffeb3b" />
			<circle cx="78" cy="55" r="3.5" fill="#ffa726" />
			<circle cx="55" cy="70" r="5" fill="#ffc107" />
			<circle cx="38" cy="75" r="3" fill="#ffeb3b" />
		</svg>
	);
};
