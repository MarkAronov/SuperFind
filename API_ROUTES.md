# API Routes Documentation

This document provides comprehensive documentation for all SuperFind API endpoints, including request/response formats, examples, and usage patterns.

## 🎯 **Overview**

SuperFind provides a RESTful API built with Hono framework, offering endpoints for file processing, AI-powered search, and system health monitoring.

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   API Gateway (Hono)    │    │   Route Handlers        │    │   Service Integration   │
│                         │────│                         │────│                         │
│ • Request Validation    │    │ • File Processing       │    │ • AI Services           │
│ • Error Handling        │    │ • Search Operations     │    │ • Vector Database       │
│ • Response Formatting   │    │ • Health Monitoring     │    │ • External Providers    │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

## 🚀 **Base Configuration**

### **Server Information**
- **Base URL**: `http://localhost:3000` (development)
- **Framework**: Hono (lightweight, fast)
- **Content-Type**: `application/json` (unless specified)
- **CORS**: Enabled for frontend integration

### **Common Response Format**
```typescript
interface APIResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    timestamp?: string;
}
```

## 📋 **Core Endpoints**

### **1. Root Endpoint**
```http
GET /
```

**Purpose**: Basic API information and server status

**Response:**
```json
{
    "message": "SuperFind API",
    "status": "running", 
    "version": "1.0.0",
    "initialized": true
}
```

**Response Fields:**
- `message`: API identifier
- `status`: Server operational status
- `version`: Current API version
- `initialized`: Whether initialization completed successfully

---

### **2. Health Check**
```http
GET /health
```

**Purpose**: Comprehensive system health monitoring

**Response (Healthy):**
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

**Response (Degraded):**
```json
{
    "status": "degraded",
    "services": {
        "qdrant": {
            "healthy": false,
            "responseTime": 5000,
            "error": "Connection timeout"
        },
        "dataStore": {
            "healthy": true,
            "responseTime": 2
        }
    },
    "timestamp": "2025-09-29T10:30:15.123Z",
    "uptime": 300000,
    "initialized": true
}
```

**Status Levels:**
- `healthy`: All services operational
- `degraded`: Some services down, core functionality available
- `unhealthy`: Critical services unavailable

---

## 📂 **File Processing Routes**

### **File Upload**
```http
POST /parser/upload?type={file_type}
Content-Type: multipart/form-data
```

**Parameters:**
- `type` (query, required): File type (`csv`, `json`, or `text`)
- `file` (form data, required): The file to upload

#### **CSV File Upload**
```http
POST /parser/upload?type=csv
Content-Type: multipart/form-data

{
    "file": employees.csv
}
```

**Request Body (Form Data):**
```
file: <binary_file_content>
```

**Response (Success):**
```json
{
    "success": true,
    "message": "CSV file processed successfully",
    "data": {
        "fileName": "employees.csv",
        "dataType": "csv",
        "md5Hash": "abc123def456...",
        "alreadyExists": false,
        "storedInQdrant": true,
        "processedData": [
            {
                "name": "Alice Chen",
                "location": "New York",
                "role": "ML Engineer",
                "skills": "PyTorch; NLP; TensorFlow",
                "experience_years": "4"
            },
            {
                "name": "Bob Smith", 
                "location": "San Diego",
                "role": "Frontend Developer",
                "skills": "React; TypeScript",
                "experience_years": "5"
            }
        ]
    }
}
```

#### **JSON File Upload**
```http
POST /parser/upload?type=json
Content-Type: multipart/form-data

{
    "file": company_data.json
}
```

**Response (Success):**
```json
{
    "success": true,
    "message": "JSON file processed successfully",
    "data": {
        "fileName": "company_data.json",
        "dataType": "json",
        "md5Hash": "def456abc789...",
        "alreadyExists": false,
        "storedInQdrant": true,
        "processedData": {
            "company": "TechCorp",
            "employees": [
                {"name": "John Doe", "department": "Engineering"}
            ]
        }
    }
}
```

#### **Text File Upload**
```http
POST /parser/upload?type=text
Content-Type: multipart/form-data

{
    "file": person_profile.txt
}
```

**Response (Success):**
```json
{
    "success": true,
    "message": "TEXT file processed successfully", 
    "data": {
        "fileName": "person_profile.txt",
        "dataType": "text",
        "md5Hash": "ghi789jkl012...",
        "alreadyExists": false,
        "storedInQdrant": true,
        "processedData": {
            "name": "Alice Johnson",
            "location": "New York City",
            "role": "ML Engineer",
            "skills": ["PyTorch", "TensorFlow", "NLP"],
            "experience": "6+ years"
        }
    }
}
```

### **File Processing Error Responses**

#### **Missing File**
```json
{
    "success": false,
    "error": "No file uploaded"
}
```
**HTTP Status**: `400 Bad Request`

#### **Invalid File Type**
```json
{
    "success": false,
    "error": "Invalid or missing file type. Use ?type=csv, ?type=json, or ?type=text"
}
```
**HTTP Status**: `400 Bad Request`

#### **File Type Mismatch**
```json
{
    "success": false,
    "message": "File type mismatch",
    "error": "File extension '.pdf' does not match declared type 'csv'. Expected: .csv"
}
```
**HTTP Status**: `400 Bad Request`

#### **Content Validation Error**
```json
{
    "success": false,
    "message": "File content validation failed",
    "error": "Invalid JSON format: Unexpected token '}' at position 15"
}
```
**HTTP Status**: `400 Bad Request`

#### **Processing Error**
```json
{
    "success": false,
    "error": "Internal server error",
    "details": "Failed to generate embeddings for document"
}
```
**HTTP Status**: `500 Internal Server Error`

---

## 🔍 **AI Search Routes**

### **Semantic Search**
```http
GET /ai/search?query={search_query}
```

**Parameters:**
- `query` (query string, required): Natural language search query

**Example Request:**
```http
GET /ai/search?query=Find ML engineers with NLP experience
```

**Response (Success):**
```json
{
    "success": true,
    "query": "Find ML engineers with NLP experience",
    "answer": "Based on the available data, I found several ML engineers with NLP experience:\n\n1. **Alice Johnson** - A seasoned ML Engineer based in New York City who specializes in PyTorch, TensorFlow, and NLP, with 6+ years of experience. She previously worked at OpenAI and developed several internal LLM tools for enterprise clients.\n\n2. **Alice Chen** - An ML Engineer from New York with 4 years of experience, skilled in PyTorch, NLP, and TensorFlow.\n\nBoth candidates have strong backgrounds in NLP and machine learning frameworks.",
    "sources": [
        {
            "id": "person_alice_johnson",
            "content": "Alice Johnson is a seasoned ML Engineer based in New York City. She specializes in PyTorch, TensorFlow, and NLP, with 6+ years of experience building scalable AI pipelines...",
            "metadata": {
                "personName": "Alice Johnson",
                "role": "ML Engineer",
                "location": "New York City",
                "skills": ["PyTorch", "TensorFlow", "NLP"],
                "experience": "6+ years"
            },
            "relevanceScore": 0.95
        },
        {
            "id": "person_alice_chen", 
            "content": "Alice Chen is a ML Engineer from New York. Skills: PyTorch; NLP; TensorFlow. Experience: 4 years.",
            "metadata": {
                "personName": "Alice Chen",
                "role": "ML Engineer", 
                "location": "New York",
                "skills": "PyTorch; NLP; TensorFlow",
                "experience": "4"
            },
            "relevanceScore": 0.87
        }
    ],
    "timestamp": "2025-09-29T10:30:45.678Z"
}
```

**Response Fields:**
- `success`: Operation success status
- `query`: Original search query
- `answer`: AI-generated response based on found documents
- `sources`: Array of relevant documents with metadata
- `timestamp`: Query processing timestamp

#### **No Results Found**
```json
{
    "success": true,
    "query": "Find blockchain developers",
    "answer": "I couldn't find any relevant information for your query.",
    "sources": [],
    "timestamp": "2025-09-29T10:30:45.678Z"
}
```

### **Search Error Responses**

#### **Missing Query**
```json
{
    "error": "Query parameter is required"
}
```
**HTTP Status**: `400 Bad Request`

#### **Search Processing Error**
```json
{
    "success": false,
    "query": "Find developers",
    "error": "Failed to process search request",
    "details": "Vector store not configured"
}
```
**HTTP Status**: `500 Internal Server Error`

---

## 📊 **Usage Examples**

### **Complete File Processing Workflow**

#### **1. Upload CSV File**
```bash
curl -X POST "http://localhost:3000/parser/upload?type=csv" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@employees.csv"
```

#### **2. Search for Specific Skills**
```bash
curl -X GET "http://localhost:3000/ai/search?query=Frontend%20developers%20with%20React%20experience"
```

#### **3. Check System Health**
```bash
curl -X GET "http://localhost:3000/health"
```

### **JavaScript/TypeScript Integration**

#### **File Upload Function**
```typescript
async function uploadFile(file: File, type: 'csv' | 'json' | 'text') {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`/parser/upload?type=${type}`, {
        method: 'POST',
        body: formData,
    });
    
    return await response.json();
}

// Usage
const csvFile = new File([csvContent], 'employees.csv', { type: 'text/csv' });
const result = await uploadFile(csvFile, 'csv');
console.log(result);
```

#### **Search Function**
```typescript
async function searchDocuments(query: string) {
    const response = await fetch(`/ai/search?query=${encodeURIComponent(query)}`);
    return await response.json();
}

// Usage
const results = await searchDocuments('Find ML engineers with NLP experience');
console.log(results.answer);
console.log(results.sources);
```

#### **Health Check Function**
```typescript
async function checkHealth() {
    const response = await fetch('/health');
    const health = await response.json();
    
    return {
        isHealthy: health.status === 'healthy',
        details: health.services,
        uptime: health.uptime
    };
}

// Usage
const { isHealthy, details } = await checkHealth();
if (!isHealthy) {
    console.warn('System health degraded:', details);
}
```

## 🔒 **Error Handling Patterns**

### **Common HTTP Status Codes**
- `200 OK`: Successful operation
- `400 Bad Request`: Invalid request parameters or data
- `500 Internal Server Error`: Server-side processing error

### **Error Response Structure**
```typescript
interface ErrorResponse {
    success: false;
    error: string;          // User-friendly error message
    message?: string;       // Additional context
    details?: string;       // Technical details for debugging
}
```

### **Error Handling Best Practices**
```typescript
// Always check success field
const response = await fetch('/ai/search?query=test');
const data = await response.json();

if (data.success) {
    // Handle successful response
    console.log(data.answer);
} else {
    // Handle error
    console.error('Search failed:', data.error);
    if (data.details) {
        console.debug('Technical details:', data.details);
    }
}
```

## 🚀 **Performance Considerations**

### **Rate Limiting**
Currently, no rate limiting is implemented, but consider:
- File upload size limits
- Search query frequency limits
- Health check polling intervals

### **Response Times**
- **Health Check**: < 100ms
- **File Upload**: 200ms - 5s (depends on file size and AI processing)
- **Search**: 100ms - 2s (depends on vector database size)

### **Caching Strategies**
- File uploads use MD5 hashing for duplicate detection
- Embeddings are cached to avoid recomputation
- Health status can be cached for high-frequency polling

## 🔧 **Development & Testing**

### **API Testing with curl**
```bash
# Test all endpoints
curl http://localhost:3000/
curl http://localhost:3000/health
curl -X POST -F "file=@test.csv" "http://localhost:3000/parser/upload?type=csv"
curl "http://localhost:3000/ai/search?query=test"
```

### **Postman Collection**
Create a Postman collection with these requests for easy API testing:

1. **GET Root** - `http://localhost:3000/`
2. **GET Health** - `http://localhost:3000/health`
3. **POST CSV Upload** - `http://localhost:3000/parser/upload?type=csv`
4. **POST JSON Upload** - `http://localhost:3000/parser/upload?type=json`
5. **POST Text Upload** - `http://localhost:3000/parser/upload?type=text`
6. **GET Search** - `http://localhost:3000/ai/search?query=ML engineers`

### **Response Validation**
```typescript
// TypeScript interfaces for response validation
interface HealthResponse {
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, ServiceHealth>;
    timestamp: string;
    uptime: number;
    initialized: boolean;
}

interface SearchResponse {
    success: boolean;
    query: string;
    answer: string;
    sources: SearchSource[];
    timestamp: string;
}

interface UploadResponse {
    success: boolean;
    message: string;
    data: {
        fileName: string;
        dataType: 'csv' | 'json' | 'text';
        md5Hash: string;
        alreadyExists: boolean;
        storedInQdrant: boolean;
        processedData: any;
    };
}
```

This API documentation provides comprehensive coverage of all SuperFind endpoints, enabling developers to integrate with the system effectively and handle all response scenarios appropriately.