import { useId } from "react";
import { SIZING } from "../1-ions/sizing";
import type { LogoProps } from "./Logo.types";

/**
 * Logo Component
 *
 * SkillVector's brand logo featuring a nonagon (9-sided polygon) with an
 * internal graph structure representing skill connections.
 *
 * Visual Design:
 * - Outer nonagon: 9-sided polygon with gradient fill (deep purple → pink)
 * - Inner graph: 8-node Minimum Spanning Tree (MST) showing skill relationships
 * - Gradient system: Each edge has unique gradient matching connected node colors
 *
 * Size options:
 * - sm: 32px (lg icon size) - For compact UI elements
 * - md: 40px (xl icon size) - Default, standard navbar/header size
 * - lg: 48px (2xl icon size) - For prominent placements like landing pages
 *
 * Graph Structure:
 * - 8 nodes (circles) representing skill categories/points
 * - 7 edges (lines) forming MST (minimum spanning tree, no cycles)
 * - Node sizes vary to show relative importance (r="3" to r="6")
 * - Edge BE intentionally removed to prevent cycle in MST
 *
 * Color System:
 * - Nodes: Orange (#ff9800) → Yellow (#ffeb3b) spectrum
 * - Edges: Gradients matching connected node colors (userSpaceOnUse)
 * - Outer polygon: Purple (#7c3aed) → Pink (#ec4899) diagonal gradient
 */

/**
 * Size mapping from semantic names to pixel values
 * Uses ion sizing tokens for consistency across UI
 */
const sizes = {
	sm: SIZING.ICON.lg, // 32px
	md: SIZING.ICON.xl, // 40px (default)
	lg: SIZING.ICON["2xl"], // 48px
};

export const Logo = ({ className = "", size = "md" }: LogoProps) => {
	// Generate unique IDs for gradients to avoid conflicts when multiple logos render
	const id = useId();
	const hexGradientId = `${id}-hexGradient`; // Main polygon background gradient
	const gradABId = `${id}-gradAB`; // Edge A→B gradient (top center → left)
	const gradACId = `${id}-gradAC`; // Edge A→C gradient (top center → right)
	const gradBDId = `${id}-gradBD`; // Edge B→D gradient (left → bottom-left)
	const gradCEId = `${id}-gradCE`; // Edge C→E gradient (right → center)
	const gradEGId = `${id}-gradEG`; // Edge E→G gradient (center → bottom)
	const gradCFId = `${id}-gradCF`; // Edge C→F gradient (right → far-right)
	const gradGHId = `${id}-gradGH`; // Edge G→H gradient (bottom → bottom-left)

	// Get size class based on size prop
	const sizeClass = sizes[size];

	// Combine size with custom className
	const combinedClassName = `${sizeClass} ${className}`;

	return (
		<svg
			className={combinedClassName}
			style={{ filter: "none", mixBlendMode: "normal" }}
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>SkillVector Logo</title>

			{/* ===== GRADIENT DEFINITIONS ===== */}
			<defs>
				{/* Main polygon gradient: Deep purple (bottom-left) → Bright pink (top-right) */}
				<linearGradient id={hexGradientId} x1="0%" y1="100%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="#7c3aed" /> {/* Violet-600 */}
					<stop offset="50%" stopColor="#c026d3" /> {/* Fuchsia-600 */}
					<stop offset="100%" stopColor="#ec4899" /> {/* Pink-500 */}
				</linearGradient>

				{/* Edge gradients: Match vertex colors using userSpaceOnUse for alignment
				    Each gradient flows from start node color to end node color */}

				{/* A→B: Orange (#ff9800) → Light orange (#ffa726) */}
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

				{/* A→C: Orange (#ff9800) → Amber (#ffc107) */}
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

				{/* B→D: Light orange (#ffa726) → Amber (#ffc107) */}
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

				{/* Note: B→E edge removed to prevent cycle in MST structure */}

				{/* C→E: Amber (#ffc107) → Yellow (#ffeb3b) */}
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

				{/* E→G: Yellow (#ffeb3b) → Amber (#ffc107) */}
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

				{/* C→F: Amber (#ffc107) → Dark orange (#ff8a00) */}
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

				{/* G→H: Amber (#ffc107) → Yellow (#ffeb3b) */}
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
			</defs>

			{/* ===== OUTER NONAGON (9-SIDED POLYGON) ===== */}
			{/* Background fill with purple→pink gradient */}
			<path
				d="M50 3 L80.195 13.998 L96.248 41.842 L90.702 73.5 L66.07 94.167 L33.926 94.167 L9.298 73.5 L3.752 41.842 L19.805 13.998 Z"
				fill={`url(#${hexGradientId})`}
			/>

			{/* Border stroke with same gradient (2px width) */}
			<path
				d="M50 3 L80.195 13.998 L96.248 41.842 L90.702 73.5 L66.07 94.167 L33.926 94.167 L9.298 73.5 L3.752 41.842 L19.805 13.998 Z"
				stroke={`url(#${hexGradientId})`}
				strokeWidth="2"
			/>

			{/* ===== GRAPH STRUCTURE: 8-NODE MST ===== */}
			{/* Minimum Spanning Tree showing skill relationship network */}

			{/* Edge A→B: Top center (50,20) to left (30,38) */}
			<line
				x1="50"
				y1="20"
				x2="30"
				y2="38"
				stroke={`url(#${gradABId})`}
				strokeWidth="2"
			/>

			{/* Edge A→C: Top center (50,20) to right (68,35) */}
			<line
				x1="50"
				y1="20"
				x2="68"
				y2="35"
				stroke={`url(#${gradACId})`}
				strokeWidth="2"
			/>

			{/* Edge B→D: Left (30,38) to bottom-left (22,58) */}
			<line
				x1="30"
				y1="38"
				x2="22"
				y2="58"
				stroke={`url(#${gradBDId})`}
				strokeWidth="2"
			/>

			{/* Note: B→E edge intentionally omitted to break cycle */}

			{/* Edge C→E: Right (68,35) to center (45,52) */}
			<line
				x1="68"
				y1="35"
				x2="45"
				y2="52"
				stroke={`url(#${gradCEId})`}
				strokeWidth="2"
			/>

			{/* Edge E→G: Center (45,52) to bottom (55,70) */}
			<line
				x1="45"
				y1="52"
				x2="55"
				y2="70"
				stroke={`url(#${gradEGId})`}
				strokeWidth="2"
			/>

			{/* Edge C→F: Right (68,35) to far-right (78,55) */}
			<line
				x1="68"
				y1="35"
				x2="78"
				y2="55"
				stroke={`url(#${gradCFId})`}
				strokeWidth="2"
			/>

			{/* Edge G→H: Bottom (55,70) to bottom-left (38,75) */}
			<line
				x1="55"
				y1="70"
				x2="38"
				y2="75"
				stroke={`url(#${gradGHId})`}
				strokeWidth="2"
			/>

			{/* ===== NODES (GRAPH VERTICES) ===== */}
			{/* Node sizes reflect importance: r=3 (least) to r=6 (most) */}

			{/* Node A: Top center - Primary hub (largest, r=6) */}
			<circle cx="50" cy="20" r="6" fill="#ff9800" />

			{/* Node B: Left - Secondary hub (r=5) */}
			<circle cx="30" cy="38" r="5" fill="#ffa726" />

			{/* Node C: Right - Secondary hub (r=4.5) */}
			<circle cx="68" cy="35" r="4.5" fill="#ffc107" />

			{/* Node D: Bottom-left - Tertiary (r=3.5) */}
			<circle cx="22" cy="58" r="3.5" fill="#ffeb3b" />

			{/* Node E: Center - Mid-level hub (r=4) */}
			<circle cx="45" cy="52" r="4" fill="#ffeb3b" />

			{/* Node F: Far-right - Tertiary (r=3.5) */}
			<circle cx="78" cy="55" r="3.5" fill="#ffa726" />

			{/* Node G: Bottom - Secondary hub (r=5) */}
			<circle cx="55" cy="70" r="5" fill="#ffc107" />

			{/* Node H: Bottom-left - Smallest node (r=3) */}
			<circle cx="38" cy="75" r="3" fill="#ffeb3b" />
		</svg>
	);
};
