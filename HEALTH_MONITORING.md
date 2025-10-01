# Health Monitoring System

This document explains SuperFind's comprehensive health monitoring system that tracks the status of all services, databases, and external dependencies.

## 🏥 **Overview**

The health monitoring system provides real-time visibility into system status, enabling proactive issue detection and debugging. It monitors Qdrant vector database, data processing services, and external AI provider connectivity.

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   Health Services       │    │   Status Aggregation    │    │   External Monitoring   │
│                         │────│                         │────│                         │
│ • Service Checks        │    │ • Overall Status        │    │ • AI Provider Health    │
│ • Response Time Metrics │    │ • Individual Services   │    │ • Database Connectivity │
│ • Error Detection       │    │ • Health Degradation   │    │ • Network Dependencies  │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

## 🏗️ **Health Architecture**

### **Health Status Levels**
```typescript
type HealthStatus = "healthy" | "degraded" | "unhealthy";

// healthy: All services operational
// degraded: Some services down, core functionality available  
// unhealthy: Critical services unavailable
```

### **Service Health Interface**
```typescript
interface ServiceHealth {
    healthy: boolean;
    responseTime?: number;    // Milliseconds
    error?: string;          // Error message if unhealthy
    metadata?: Record<string, unknown>; // Additional service info
}
```

### **Complete Health Response**
```typescript
interface HealthStatus {
    status: "healthy" | "degraded" | "unhealthy";
    services: Record<string, ServiceHealth>;
    timestamp: string;
    uptime: number;         // Application uptime in milliseconds
}
```

## 🔍 **Monitored Services**

### **1. Qdrant Vector Database**
```typescript
async function checkQdrantHealth(): Promise<ServiceHealth> {
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
}
```

**What's Monitored:**
- ✅ Database connectivity
- ✅ Collection availability
- ✅ Response time performance
- ✅ Collection count and status

**Typical Healthy Response:**
```json
{
    "healthy": true,
    "responseTime": 45,
    "metadata": {
        "collections": 2
    }
}
```

**Unhealthy Example:**
```json
{
    "healthy": false,
    "responseTime": 5000,
    "error": "Connection timeout to localhost:6333"
}
```

---

### **2. Data Store Service**
```typescript
function checkDataStoreHealth(): ServiceHealth {
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
}
```

**What's Monitored:**
- ✅ In-memory data store accessibility
- ✅ File processing statistics
- ✅ Data integrity validation
- ✅ Storage size estimation

**Healthy Response:**
```json
{
    "healthy": true,
    "responseTime": 2,
    "metadata": {
        "totalFiles": 3,
        "filesByType": {
            "csv": 1,
            "text": 2
        },
        "sizeEstimate": 2048
    }
}
```

## 📊 **Health Aggregation Logic**

### **Overall Status Calculation**
```typescript
// Count healthy vs total services
const healthyServices = Object.values(services).filter(s => s.healthy).length;
const totalServices = Object.values(services).length;

let status: "healthy" | "degraded" | "unhealthy";
if (healthyServices === totalServices) {
    status = "healthy";      // All services operational
} else if (healthyServices > 0) {
    status = "degraded";     // Some services down
} else {
    status = "unhealthy";    // All services down
}
```

### **Health Check Execution**
```typescript
export async function checkApplicationHealth(): Promise<HealthStatus> {
    const services: Record<string, ServiceHealth> = {};
    
    // Check all monitored services
    services.qdrant = await checkQdrantHealth();
    services.dataStore = checkDataStoreHealth();
    
    // Calculate overall status
    const status = calculateOverallStatus(services);
    
    return {
        status,
        services,
        timestamp: new Date().toISOString(),
        uptime: Date.now() - startTime,
    };
}
```

## 🔗 **API Endpoints**

### **Main Health Check**
```http
GET /health
```

**Response Example:**
```json
{
    "status": "healthy",
    "services": {
        "qdrant": {
            "healthy": true,
            "responseTime": 34,
            "metadata": {
                "collections": 2
            }
        },
        "dataStore": {
            "healthy": true, 
            "responseTime": 1,
            "metadata": {
                "totalFiles": 3,
                "filesByType": {
                    "csv": 1,
                    "text": 2
                },
                "sizeEstimate": 2048
            }
        }
    },
    "timestamp": "2025-09-29T10:30:15.123Z",
    "uptime": 45000,
    "initialized": true
}
```

### **Quick Boolean Health Check**
```typescript
export async function isApplicationHealthy(): Promise<boolean> {
    const health = await checkApplicationHealth();
    return health.status === "healthy";
}
```

### **Service-Specific Health Check**
```typescript
export async function getServiceHealth(
    serviceName: string
): Promise<ServiceHealth | null> {
    const health = await checkApplicationHealth();
    return health.services[serviceName] || null;
}
```

## 🚨 **Health Status Scenarios**

### **✅ Healthy System**
```json
{
    "status": "healthy",
    "services": {
        "qdrant": { "healthy": true, "responseTime": 25 },
        "dataStore": { "healthy": true, "responseTime": 1 }
    },
    "uptime": 120000
}
```
**Meaning:** All services operational, system fully functional

---

### **⚠️ Degraded System**
```json
{
    "status": "degraded", 
    "services": {
        "qdrant": { 
            "healthy": false, 
            "responseTime": 5000,
            "error": "Connection timeout"
        },
        "dataStore": { "healthy": true, "responseTime": 1 }
    },
    "uptime": 300000
}
```
**Meaning:** Vector search unavailable, but file processing works

---

### **❌ Unhealthy System**
```json
{
    "status": "unhealthy",
    "services": {
        "qdrant": { 
            "healthy": false,
            "error": "Service unavailable"
        },
        "dataStore": { 
            "healthy": false,
            "error": "Memory corruption detected" 
        }
    },
    "uptime": 600000
}
```
**Meaning:** Critical system failure, manual intervention required

## 📈 **Performance Monitoring**

### **Response Time Tracking**
- **Qdrant Health Check**: Typically < 50ms
- **Data Store Check**: Typically < 5ms  
- **Overall Health Check**: < 100ms

### **Performance Thresholds**
```typescript
const PERFORMANCE_THRESHOLDS = {
    qdrant: 1000,      // 1 second max for database
    dataStore: 100,    // 100ms max for memory operations
    overall: 2000      // 2 seconds max for complete check
};
```

### **Uptime Tracking**
```typescript
const startTime = Date.now();

// Calculate uptime in health response
uptime: Date.now() - startTime
```

## 🛡️ **Error Handling**

### **Service-Level Error Handling**
```typescript
try {
    const result = await externalServiceCall();
    return { healthy: true, responseTime, data: result };
} catch (error) {
    return {
        healthy: false,
        responseTime: Date.now() - start,
        error: error instanceof Error ? error.message : "Unknown error"
    };
}
```

### **Graceful Degradation**
- Health checks never throw exceptions
- Failed services return detailed error information
- System continues operating with reduced functionality

### **Error Classification**
- **Network Errors**: Connectivity issues with external services
- **Timeout Errors**: Services responding too slowly
- **Service Errors**: Application logic failures
- **Resource Errors**: Memory/disk space issues

## 🔧 **Integration Points**

### **Startup Health Verification**
```typescript
// During application initialization
const health = await checkApplicationHealth();
if (health.status === "unhealthy") {
    console.warn("⚠️ Application started with degraded health");
    // Log specific service issues
}
```

### **Middleware Integration**
```typescript
// Optional: Add health checks to request pipeline
app.use(async (c, next) => {
    if (shouldCheckHealth(c.req)) {
        const healthy = await isApplicationHealthy();
        if (!healthy) {
            return c.json({ error: "Service temporarily unavailable" }, 503);
        }
    }
    await next();
});
```

### **Load Balancer Integration**
```http
# Use for load balancer health checks
GET /health
Accept: application/json

# Expected: 200 OK if status is "healthy" or "degraded"
# Expected: 503 Service Unavailable if status is "unhealthy"
```

## 📊 **Monitoring & Alerting**

### **Health Check Automation**
```typescript
// Periodic health monitoring
setInterval(async () => {
    const health = await checkApplicationHealth();
    if (health.status !== "healthy") {
        console.warn("Health degraded:", health);
        // Send alerts, log to monitoring system
    }
}, 30000); // Check every 30 seconds
```

### **Key Metrics to Monitor**
- Overall health status changes
- Service response time trends
- Error frequency and patterns
- System uptime and availability

### **Alert Conditions**
- ❗ **Critical**: Status changes to "unhealthy"
- ⚠️ **Warning**: Status changes to "degraded" 
- 📈 **Performance**: Response times exceed thresholds
- 🔄 **Recovery**: Status returns to "healthy"

## 🚀 **Best Practices**

### **1. Health Check Design**
- Keep checks lightweight and fast
- Avoid cascading failures in health checks
- Include relevant metadata for debugging

### **2. Response Time Optimization**
- Set reasonable timeouts for external services
- Cache health status for high-frequency checks
- Use parallel health checks where possible

### **3. Error Information**
- Provide actionable error messages
- Include timing information for performance issues
- Log detailed errors while returning sanitized messages

### **4. Monitoring Integration**
- Set up automated alerts for health status changes
- Track health check metrics over time
- Use health data for capacity planning

The health monitoring system provides comprehensive visibility into SuperFind's operational status, enabling proactive maintenance and reliable service delivery.