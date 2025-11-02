# Architecture Analysis: Parser vs AI Services Conflict

## Current State

### Responsibility Separation Issues

#### 1. **Duplicated Helper Function** ❌
- `extractKeysFromInterface()` defined identically in BOTH:
  - `src/ai/ai.services.ts` (line 284)
  - `src/parser/parser.services.ts` (line 519)
- **Impact**: Code duplication, maintenance burden, inconsistency risk

#### 2. **Unclear Task Boundary**
- **Parser Service** (`parser.services.ts`)
  - Responsibility: File parsing & data extraction (CSV/JSON/Text → structured data)
  - Dependencies: Calls `ai.services.convertTextToJson()` for text extraction
  - Also defines: `extractKeysFromInterface()` (for fallback logic)

- **AI Service** (`ai.services.ts`)
  - Responsibility: AI operations (text→JSON via LLM, search via vectors)
  - Defines: `convertTextToJson()`, `extractKeysFromInterface()`, `createZodSchemaFromKeys()`, `parseAndValidateJson()`

#### 3. **Problematic Flow**
```
Parser receives text file
    ↓
Parser calls AI.convertTextToJson()
    ↓
AI uses extractKeysFromInterface() (which Parser also defines!)
    ↓
Parser stores result via Qdrant service
    ↓
Parser defines fallback logic that also uses extractKeysFromInterface()
```

## Recommended Solutions

### Option A: Move Interface Utilities to Shared Utility Module (PREFERRED)
**Create `src/utils/interface-parser.ts`**
- Export: `extractKeysFromInterface()`, `createZodSchemaFromKeys()`, `parseAndValidateJson()`
- Import from both `ai.services.ts` and `parser.services.ts`
- Benefits:
  - Single source of truth
  - Cleaner separation of concerns
  - Easier testing and reuse

### Option B: Move to AI Service (AI owns text processing)
- Keep all interface/JSON utilities in `ai.services.ts`
- Parser imports only `convertTextToJson()`
- Parser removes its own `extractKeysFromInterface()` copy
- Benefits: Cleaner, but couples parser to AI more tightly

### Option C: Move to Parser (Parser owns extraction logic)
- Parser owns `extractKeysFromInterface()`, `createZodSchemaFromKeys()`, etc.
- AI imports these from parser
- Benefits: Parser is more self-contained, but mixes concerns

## Recommendation

**Option A** provides the best separation:
- ✅ Each service imports only what it needs
- ✅ Utilities are reusable and testable
- ✅ Clear responsibility boundaries
- ✅ Easy to extend with more interface utilities

## Files to Create/Modify

1. **Create**: `src/utils/interface-parser.ts`
   - `extractKeysFromInterface()`
   - `createZodSchemaFromKeys()`
   - `parseAndValidateJson()`

2. **Modify**: `src/ai/ai.services.ts`
   - Remove duplicate definitions
   - Import from `@utils/interface-parser`

3. **Modify**: `src/parser/parser.services.ts`
   - Remove duplicate definitions
   - Import from `@utils/interface-parser`

4. **Create/Update**: `src/utils/index.ts`
   - Export all utilities
