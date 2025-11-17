/**
 * Health service - centralized health monitoring for all services
 * Following best practices for service health checks
 */

import { qdrantStatus } from "../database";
import { getDataStoreStats } from "../parser";

export interface HealthStatus {
	status: "healthy" | "degraded" | "unhealthy";
	services: Record<string, ServiceHealth>;
	timestamp: string;
	uptime: number;
}

export interface ServiceHealth {
	healthy: boolean;
	responseTime?: number;
	error?: string;
	metadata?: Record<string, unknown>;
}

const startTime = Date.now();

/**
 * Comprehensive health check for all services
 */
export const checkApplicationHealth = async (): Promise<HealthStatus> => {
	const services: Record<string, ServiceHealth> = {};

	// Check Qdrant vector database
	services.qdrant = await checkQdrantHealth();

	// Check data store
	services.dataStore = checkDataStoreHealth();

	const healthyServices = Object.values(services).filter(
		(s) => s.healthy,
	).length;
	const totalServices = Object.values(services).length;

	let status: "healthy" | "degraded" | "unhealthy";
	if (healthyServices === totalServices) {
		status = "healthy";
	} else if (healthyServices > 0) {
		status = "degraded";
	} else {
		status = "unhealthy";
	}

	return {
		status,
		services,
		timestamp: new Date().toISOString(),
		uptime: Date.now() - startTime,
	};
};

/**
 * Check Qdrant vector database health
 */
const checkQdrantHealth = async (): Promise<ServiceHealth> => {
	const start = Date.now();

	try {
		const result = await qdrantStatus();
		const responseTime = Date.now() - start;

		return {
			healthy: result.success,
			responseTime,
			error: result.success ? undefined : result.error,
			metadata: {
				collections: result.data?.collections || 0,
			},
		};
	} catch (error) {
		return {
			healthy: false,
			responseTime: Date.now() - start,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

/**
 * Check data store health
 */
const checkDataStoreHealth = (): ServiceHealth => {
	const start = Date.now();

	try {
		const stats = getDataStoreStats();
		const responseTime = Date.now() - start;

		return {
			healthy: true,
			responseTime,
			metadata: {
				totalFiles: stats.totalFiles,
				filesByType: stats.filesByType,
				sizeEstimate: stats.totalSizeEstimate,
			},
		};
	} catch (error) {
		return {
			healthy: false,
			responseTime: Date.now() - start,
			error: error instanceof Error ? error.message : "Data store error",
		};
	}
};

/**
 * Quick health check - just returns boolean status
 */
export const isApplicationHealthy = async (): Promise<boolean> => {
	const health = await checkApplicationHealth();
	return health.status === "healthy";
};

/**
 * Get service-specific health
 */
export const getServiceHealth = async (
	serviceName: string,
): Promise<ServiceHealth | null> => {
	const health = await checkApplicationHealth();
	return health.services[serviceName] || null;
};
