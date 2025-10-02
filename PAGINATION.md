# 📄 Pagination Guide

## **✨ New Pagination Features**

The search API now supports pagination with `limit` and `offset` parameters!

---

## **🔧 API Parameters**

### **Query Parameters:**

| Parameter | Type | Default | Min | Max | Description |
|-----------|------|---------|-----|-----|-------------|
| `query` | string | *required* | - | - | The search query |
| `limit` | number | `5` | `1` | `50` | Number of results per page |
| `offset` | number | `0` | `0` | - | Number of results to skip |

---

## **📊 Response Format**

```json
{
  "success": true,
  "query": "developers",
  "answer": "AI generated summary...",
  "sources": [...],
  "pagination": {
    "limit": 5,
    "offset": 0,
    "total": 10,
    "returned": 5
  },
  "timestamp": "2025-10-01T..."
}
```

### **Pagination Object:**
- `limit`: Results per page (what you requested)
- `offset`: Starting position (what you requested)
- `total`: Total results found
- `returned`: Actual number of results returned (may be less than limit)

---

## **🎯 Example Requests**

### **1. Get First Page (5 results)**
```bash
GET /ai/search?query=developers
# or explicitly
GET /ai/search?query=developers&limit=5&offset=0
```

Response:
```json
{
  "pagination": {
    "limit": 5,
    "offset": 0,
    "total": 20,
    "returned": 5
  }
}
```

### **2. Get Second Page (5 results)**
```bash
GET /ai/search?query=developers&limit=5&offset=5
```

Response:
```json
{
  "pagination": {
    "limit": 5,
    "offset": 5,
    "total": 20,
    "returned": 5
  }
}
```

### **3. Get 10 Results**
```bash
GET /ai/search?query=developers&limit=10
```

Response:
```json
{
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 20,
    "returned": 10
  }
}
```

### **4. Get Last Page**
```bash
# If total is 23 and limit is 10:
GET /ai/search?query=developers&limit=10&offset=20
```

Response:
```json
{
  "pagination": {
    "limit": 10,
    "offset": 20,
    "total": 23,
    "returned": 3
  }
}
```

---

## **💻 Frontend Implementation**

### **React Example with Pagination**

```tsx
import { useState, useEffect } from 'react';

function SearchWithPagination() {
  const [query, setQuery] = useState('developers');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      const offset = (page - 1) * limit;
      
      const response = await fetch(
        `http://localhost:3000/ai/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      
      setResults(data);
      setLoading(false);
    };

    search();
  }, [query, page, limit]);

  if (loading) return <div>Loading...</div>;
  if (!results) return null;

  const { pagination } = results;
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return (
    <div>
      {/* AI Answer */}
      <div className="ai-answer">
        <p>{results.answer}</p>
      </div>

      {/* Results Cards */}
      <div className="cards-grid">
        {results.sources.map((source, index) => (
          <div key={source.id} className="card">
            <p>{source.content}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button 
          onClick={() => setPage(p => p - 1)} 
          disabled={!hasPrev}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages} 
          ({pagination.returned} of {pagination.total} results)
        </span>

        <button 
          onClick={() => setPage(p => p + 1)} 
          disabled={!hasNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

### **Vue Example with Pagination**

```vue
<template>
  <div class="search-container">
    <!-- Results -->
    <div v-if="results">
      <div class="ai-answer">{{ results.answer }}</div>
      
      <div class="cards-grid">
        <div v-for="source in results.sources" :key="source.id" class="card">
          {{ source.content }}
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button @click="page--" :disabled="!hasPrev">Previous</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button @click="page++" :disabled="!hasNext">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const query = ref('developers');
const page = ref(1);
const limit = ref(5);
const results = ref(null);

const totalPages = computed(() => 
  Math.ceil((results.value?.pagination?.total || 0) / limit.value)
);

const hasNext = computed(() => page.value < totalPages.value);
const hasPrev = computed(() => page.value > 1);

watch([query, page], async () => {
  const offset = (page.value - 1) * limit.value;
  const response = await fetch(
    `http://localhost:3000/ai/search?query=${query.value}&limit=${limit.value}&offset=${offset}`
  );
  results.value = await response.json();
});
</script>
```

---

## **📈 Infinite Scroll Example**

```tsx
function InfiniteScrollSearch({ query }) {
  const [results, setResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const response = await fetch(
      `http://localhost:3000/ai/search?query=${query}&limit=${limit}&offset=${offset}`
    );
    const data = await response.json();
    
    setResults(prev => [...prev, ...data.sources]);
    setOffset(prev => prev + limit);
    setHasMore(data.pagination.offset + data.pagination.returned < data.pagination.total);
    setLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div>
      <div className="results">
        {results.map(source => (
          <div key={source.id}>{source.content}</div>
        ))}
      </div>
      
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

---

## **🎨 Calculate Pagination Info**

```typescript
function getPaginationInfo(pagination: {
  limit: number;
  offset: number;
  total: number;
  returned: number;
}) {
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startIndex = pagination.offset + 1;
  const endIndex = pagination.offset + pagination.returned;
  
  return {
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    startIndex,
    endIndex,
    displayText: `${startIndex}-${endIndex} of ${pagination.total}`
  };
}

// Usage:
const info = getPaginationInfo(results.pagination);
console.log(info.displayText); // "1-5 of 23"
```

---

## **⚡ Performance Notes**

1. **Max Limit**: 50 results per request (enforced by API)
2. **Vector Search**: Fetches `limit + offset` results from Qdrant
3. **AI Answer**: Generated from ALL fetched results (not just paginated subset)
4. **Recommended**: Use `limit=10` for optimal balance

---

## **🔍 Common Pagination Patterns**

### **Pattern 1: Traditional Numbered Pages**
```
[1] [2] [3] [4] [5]
```

### **Pattern 2: Previous/Next Only**
```
[← Previous] Page 2 of 10 [Next →]
```

### **Pattern 3: Infinite Scroll**
```
[Results...]
[Results...]
[Load More Button]
```

### **Pattern 4: Load All**
```
GET /ai/search?query=developers&limit=50
// Gets max 50 results in one request
```

---

## **✅ Best Practices**

1. ✅ **Default to 5-10 results** - Good balance of performance and UX
2. ✅ **Show total count** - Let users know how many results exist
3. ✅ **Disable buttons** - When no more pages available
4. ✅ **Loading states** - Show spinner during pagination
5. ✅ **URL params** - Sync page state with URL for shareable links
6. ✅ **Reset on new search** - Go back to page 1 when query changes

---

## **🚀 Summary**

**Before:**
```
GET /ai/search?query=developers
// Always returns 5 results
```

**After:**
```
GET /ai/search?query=developers&limit=10&offset=0
GET /ai/search?query=developers&limit=10&offset=10
GET /ai/search?query=developers&limit=10&offset=20
// Returns 10 results per page with full pagination control
```

Now you have full control over result pagination! 🎉
