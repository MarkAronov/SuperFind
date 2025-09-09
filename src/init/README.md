# Init Service

This3. **Startup Integration**: Automatically runs initialization when the server startsservice handles the initialization of the SuperFind application by scanning the `static-data` folder and processing all CSV, JSON, and text files into vector memory.

## Structure Created

```
src/init/
├── init.interfaces.ts     # TypeScript interfaces and types
├── init.service.ts        # Main service logic
└── index.ts              # Module exports
```

## What's Implemented

### ✅ Completed Features

1. **File Scanning**: Automatically scans `static-data/csv`, `static-data/json`, and `static-data/text` folders
2. **CSV Processing**: Uses Papa Parse to convert CSV files into structured data with headers, rows, and metadata
3. **JSON Processing**: Parses JSON files and extracts metadata including keys and data types
4. **Startup Integration**: Automatically runs initialization when the server starts
5. **Error Handling**: Comprehensive error handling throughout the service
6. **TypeScript Types**: Full type safety with proper interfaces
7. **Functional Architecture**: Uses pure functions instead of classes, following Hono best practices

### CSV Processing
- Parses CSV files with headers
- Handles dynamic typing (strings, numbers, booleans)
- Provides metadata (row count, column count)
- Skips empty lines

### JSON Processing  
- Handles both object and array JSON structures
- Extracts keys and metadata
- Identifies data type (array vs object)
- Counts items for arrays

## What You Need to Implement

### 🚧 Your Tasks

#### 1. Text File Processing (`processTextFile` function)
Located in `src/init/init.service.ts` around line 185

```typescript
function processTextFile(file: FileInfo): ProcessedFileData {
    // TODO: Implement your text processing logic here
    // Suggestions:
    // - Split text into meaningful chunks
    // - Extract key information/entities
    // - Clean and normalize text
    // - Create searchable content segments
}
```

#### 2. Vector Memory Storage (`addToVectorMemory` function)
Located in `src/init/init.service.ts` around line 205

```typescript
async function addToVectorMemory(processedData: ProcessedFileData): Promise<void> {
    // TODO: Implement your vector storage logic here
    // Suggestions:
    // - Convert processed data to embeddings/vectors
    // - Store in your vector database
    // - Index for fast retrieval
    // - Update the vectorData property
}
```

## Startup Behavior

The init service now runs automatically when the server starts up. You can check the initialization status by calling the root endpoint:

### GET /
Returns the server status including initialization state.

**Response:**
```json
{
  "message": "SuperFind API",
  "status": "running",
  "version": "1.0.0",
  "initialized": true
}
```

## Usage

1. **Start the server** - Initialization runs automatically
2. **Check status:**
   ```bash
   curl http://localhost:3000/
   ```
3. **Monitor logs** - Initialization progress is logged to console

## Current Static Data Files

The service will process these existing files:
- `static-data/csv/employees.csv`
- `static-data/text/Alice Johnson.txt`
- `static-data/text/Maria Gonzalez.txt`

## Next Steps

1. Implement the `processTextFile` method for text processing
2. Implement the `addToVectorMemory` method for vector storage
3. Test the initialization process
4. Optionally add automatic initialization on server startup
