# Parser Services Documentation

This document explains SuperFind's comprehensive file parsing system that handles CSV, JSON, and Text files with AI-powered data extraction and validation.

## 🎯 **Overview**

The parser services provide intelligent file processing capabilities that convert various file formats into structured data and store them in the vector database for semantic search.

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   File Upload           │    │   Processing Pipeline  │    │   Vector Storage        │
│                         │────│                         │────│                         │
│ • Type Validation       │    │ • CSV → Structured Data │    │ • Individual Entities   │
│ • Content Verification  │    │ • JSON → Validation     │    │ • Embedding Generation  │
│ • Extension Matching    │    │ • Text → AI Extraction  │    │ • Qdrant Storage        │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

## 🏗️ **Core Components**

### **1. File Processing Pipeline (`parser.services.ts`)**
- **Multi-format Support**: CSV, JSON, and Text files
- **AI Integration**: Text-to-structured-data conversion using LangChain
- **Entity Extraction**: Individual people/objects stored separately
- **Validation**: Content and extension matching

### **2. Route Handler (`parser.routes.ts`)**
- **Single Upload Endpoint**: Unified handling for all file types
- **Query Parameter Type Selection**: `?type=csv|json|text`
- **Comprehensive Error Handling**: Detailed validation messages

### **3. Static Data Processing**
- **Automatic Scanning**: Processes files in `static-data/` folder on startup
- **Organized Structure**: Separate folders for CSV, JSON, and text files
- **Duplicate Prevention**: MD5 hash-based existence checking

## 📁 **Supported File Types**

### **CSV Files** 
```csv
name;location;role;skills;experience_years
Alice Chen;New York;ML Engineer;"PyTorch; NLP; TensorFlow";4
Bob Smith;San Diego;Frontend Developer;"React; TypeScript";5
```

**Processing:**
- Uses PapaParse library for robust CSV parsing
- Converts to JSON array with header-based keys
- Each row becomes a separate entity in vector database
- Supports various delimiters and encodings

**Output:**
```typescript
[
    {
        name: "Alice Chen",
        location: "New York", 
        role: "ML Engineer",
        skills: "PyTorch; NLP; TensorFlow",
        experience_years: "4"
    }
]
```

---

### **JSON Files**
```json
{
    "employees": [
        {
            "name": "John Doe",
            "department": "Engineering",
            "skills": ["JavaScript", "Python"]
        }
    ]
}
```

**Processing:**
- Native JSON.parse() with error handling
- Schema validation for structure verification
- Supports nested objects and arrays
- Direct storage if already structured

**Validation:**
- Syntax validation (proper JSON format)
- Content structure verification
- Type checking for expected fields

---

### **Text Files**
```text
Alice Johnson is a seasoned ML Engineer based in New York City. She specializes 
in PyTorch, TensorFlow, and NLP, with 6+ years of experience building scalable 
AI pipelines. Alice previously worked at OpenAI and developed several internal 
LLM tools for enterprise clients.
```

**AI-Powered Processing:**
- Converts unstructured text to structured JSON using AI
- Extracts person profiles, skills, experience, location
- Uses TypeScript interface definitions for consistent output
- LangChain integration with customizable prompts

**Interface-Driven Extraction:**
```typescript
interface Person {
    name: string;
    location: string; 
    role?: string;
    skills?: string[];
    experience?: string;
}
```

## 🔄 **Processing Workflow**

### **1. File Upload Flow**
```
File Upload Request
    ↓
[Extension Validation] - Check .csv/.json/.txt
    ↓
[Content Type Validation] - Verify content matches declared type
    ↓
[Content Processing] - Parse based on file type
    ↓
[Entity Extraction] - Create individual entities from data
    ↓
[Embedding Generation] - Convert to vectors for search
    ↓
[Vector Storage] - Store in Qdrant collections
    ↓
[Response] - Return processing results
```

### **2. Static Data Processing**
```
Application Startup
    ↓
[Directory Scanning] - Scan static-data/{csv,json,text}
    ↓
[File Discovery] - Identify processable files
    ↓
[Batch Processing] - Process multiple files in parallel
    ↓
[Duplicate Detection] - Skip files already processed (MD5)
    ↓
[Entity Storage] - Store new entities in vector database
    ↓
[Initialization Complete] - Server ready for requests
```

## 🛡️ **Validation System**

### **File Extension Validation**
```typescript
export function validateFileType(
    declaredType: "csv" | "json" | "text",
    fileExtension: string | undefined,
    fileName: string
): { isValid: boolean; message: string }
```

**Rules:**
- **CSV**: Must have `.csv` extension
- **JSON**: Must have `.json` extension  
- **Text**: Accepts `.txt`, `.md`, or `.text` extensions

### **Content Validation**
```typescript
export async function validateFileContent(
    declaredType: "csv" | "json" | "text",
    content: string
): Promise<{ isValid: boolean; message: string }>
```

**CSV Content Validation:**
- Checks for comma-separated structure
- Validates header row existence
- Ensures minimum content length

**JSON Content Validation:**
- Attempts JSON.parse() with error handling
- Provides specific parsing error messages
- Validates non-empty content

**Text Content Validation:**
- Ensures minimum content length
- Accepts any plain text format
- No strict structure requirements

## 🤖 **AI-Powered Text Extraction**

### **Dynamic Interface Processing**
The system uses TypeScript interface strings to guide AI extraction:

```typescript
const personInterface = `
    interface Person {
        name: string;
        location: string;
        role?: string;
        skills?: string[];
        experience?: string;
    }
`;

const result = await convertTextToJSON(
    textContent,
    personInterface, 
    "person profile information"
);
```

### **LangChain Integration**
```typescript
// Structured prompt template
const prompt = ChatPromptTemplate.fromTemplate(`
Extract information from the following text and return a valid JSON object with these exact keys: {keys}

Text to analyze: {text}

Instructions:
- Return ONLY a valid JSON object, no explanations
- Use the exact key names provided
- If a key's value is not found, use empty string ""
- Ensure all required keys are present
`);
```

### **Zod Schema Validation**
```typescript
// Generate validation schema from interface keys
const zodSchema = createZodSchemaFromKeys(interfaceKeys);
const validated = schema.parse(parsed);
```

## 📊 **Entity Extraction & Storage**

### **Individual Entity Processing**
Instead of storing entire files, the system extracts individual entities:

```typescript
// CSV file with 3 people → 3 separate vector entries
// Text file about 1 person → 1 vector entry  
// JSON array with 5 items → 5 separate vector entries
```

### **Entity Metadata**
```typescript
const entityMetadata = {
    entityType: "person",
    entityId: "person_alice_johnson", 
    personName: "Alice Johnson",
    role: "ML Engineer",
    location: "New York",
    skills: ["PyTorch", "NLP", "TensorFlow"],
    experience: "6+ years",
    // File metadata
    fileName: "alice_profile.txt",
    filePath: "/static-data/text/alice_profile.txt",
    dataType: "text",
    processedAt: "2025-09-29T10:30:00.000Z"
};
```

### **Content Generation**
For vector storage, human-readable content is generated:
```typescript
function createPersonContent(person: Record<string, unknown>): string {
    return `${person.name} is a ${person.role} from ${person.location}. 
            Skills: ${person.skills}. Experience: ${person.experience} years.`;
}
```

## 🚫 **Error Handling**

### **File Processing Errors**
```typescript
interface ProcessedFile {
    fileName: string;
    filePath: string; 
    dataType: "csv" | "json" | "text";
    md5Hash: string;
    alreadyExists: boolean;
    storedInQdrant: boolean;
    processedData?: object;
}
```

### **Validation Error Responses**
```json
{
    "success": false,
    "message": "File type mismatch",
    "error": "File extension '.pdf' does not match declared type 'csv'. Expected: .csv"
}
```

### **AI Processing Fallbacks**
If AI extraction fails, the system provides graceful fallbacks:
```typescript
// Create empty object with expected keys
const fallback: Record<string, unknown> = {};
for (const key of interfaceKeys) {
    fallback[key] = "";
}
return fallback;
```

## 📈 **Performance Optimizations**

### **Parallel Processing**
```typescript
// Process multiple files concurrently
for (const file of files) {
    const result = await processFile(file);
    if (result) {
        processedFiles.push(result);
    }
}
```

### **Duplicate Prevention**
```typescript
// MD5-based duplicate detection
const md5Hash = generateMD5(fileContent);
const existsResult = await documentExistsByMD5(md5Hash);

if (existsResult.success && existsResult.data) {
    return { alreadyExists: true };
}
```

### **Batch Vector Storage**
Individual entities are processed and stored efficiently in the vector database.

## 🔧 **Configuration & Usage**

### **API Endpoint**
```http
POST /parser/upload?type=csv
Content-Type: multipart/form-data

{
    "file": <uploaded-file>
}
```

### **Response Format**
```json
{
    "success": true,
    "message": "CSV file processed successfully",
    "data": {
        "fileName": "employees.csv",
        "dataType": "csv", 
        "md5Hash": "abc123...",
        "alreadyExists": false,
        "storedInQdrant": true,
        "processedData": [...]
    }
}
```

### **Static Data Structure**
```
static-data/
├── csv/
│   └── employees.csv
├── json/
│   └── company_data.json
└── text/
    ├── Alice Johnson.txt
    └── Maria Gonzalez.txt
```

## 🧪 **Testing & Validation**

### **File Type Testing**
```typescript
// Test various file extensions
validateFileType("csv", "csv", "test.csv"); // ✅ Valid
validateFileType("csv", "txt", "test.txt"); // ❌ Invalid
```

### **Content Processing Testing**
```typescript
// Test CSV parsing
const csvResult = parseCSV("name,role\nAlice,Engineer");
// Expected: [{ name: "Alice", role: "Engineer" }]

// Test AI extraction
const textResult = await convertTextToJSON(
    "John Doe is a developer in SF",
    personInterface
);
// Expected: { name: "John Doe", location: "SF", role: "developer" }
```

## 🚀 **Best Practices**

### **1. File Preparation**
- Use consistent CSV delimiters
- Ensure JSON files are well-formatted
- Write descriptive text content for better AI extraction

### **2. Schema Design**  
- Define clear TypeScript interfaces for AI extraction
- Use optional fields for uncertain data
- Keep interfaces simple and focused

### **3. Error Handling**
- Always validate file types before processing
- Provide clear error messages for validation failures
- Implement graceful fallbacks for AI processing errors

### **4. Performance**
- Process files in reasonable batch sizes
- Use MD5 hashing to prevent duplicate processing
- Monitor vector database storage efficiency

This parser service provides robust, intelligent file processing with comprehensive validation and AI-powered extraction capabilities, making it easy to convert various file formats into searchable, structured data.