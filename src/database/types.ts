/**
 * Qdrant collection configuration
 */
export interface QdrantCollectionConfig {
	name: string;
	vectorSize: number;
	distance: "Cosine" | "Euclidean" | "Dot";
}

/**
 * Qdrant service response wrapper
 */
export interface QdrantResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

/**
 * Collection status information
 */
export interface CollectionStatus {
	exists: boolean;
	vectorCount: number;
	config?: QdrantCollectionConfig;
}
