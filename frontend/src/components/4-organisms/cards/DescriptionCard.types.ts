import type { GridItem } from "./card.types";

/**
 * DescriptionCardProps
 *
 * Props for the DescriptionCard organism.
 * DescriptionCard selects its layout automatically based on the item shape
 * (step → step layout, icon → icon layout, neither → standard layout).
 */
export interface DescriptionCardProps {
	/** Card data — determines layout and content */
	item: GridItem;

	/**
	 * When true, forces custom content into a responsive wrapper
	 * that normalises font sizes and icon sizes.
	 * Also suppresses the `noWrapper` behaviour.
	 */
	enforceCustomContent?: boolean;
}
