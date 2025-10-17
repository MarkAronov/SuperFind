<div align="center">

# SuperFind

### Intelligent Semantic Search API with Vector Database & RAG

**A production-ready semantic search engine powered by vector embeddings, multiple AI providers, and RAG (Retrieval Augmented Generation) pattern.**

[![Bun](https://img.shields.io/badge/Bun-1.0+-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/Hono-4.9+-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-DC244C?style=for-the-badge&logo=qdrant&logoColor=white)](https://qdrant.tech/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)](https://js.langchain.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

[Features](#-features) • [Quick Start](#-quick-start) • [API Usage](#-api-usage) • [Architecture](#-architecture) • [Roadmap](#-roadmap-future-enhancements)

</div>

---

## Features

### Core Capabilities

- **Semantic Search**: Find relevant results based on meaning, not just keywords
- **Complex Query Support**: Handles multi-criteria queries (experience + location, skills + role)
- **Multi-AI Provider Support**: OpenAI, Anthropic, Google Gemini, Ollama, HuggingFace
- **Vector Database Integration**: Qdrant for high-performance similarity search
- **RAG Pattern**: Retrieval Augmented Generation for context-aware AI responses
- **Multi-Format Data Parsing**: CSV, JSON, and TXT file support
- **Pagination**: Efficient result pagination with metadata
- **Lightning Fast**: Built on Bun runtime for maximum performance

### Technical Features

- **Type-Safe**: Full TypeScript implementation
- **RESTful API**: Clean and intuitive Hono-based endpoints
- **Flexible Embeddings**: Support for multiple embedding models
- **Vector Similarity**: Cosine similarity search with 3072-dimensional vectors
- **Health Monitoring**: Built-in health check endpoints
- **Environment Config**: Secure credential management

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) 1.0+
- [Qdrant](https://qdrant.tech/) running locally or remote instance
- API keys for AI providers (OpenAI, Anthropic, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/MarkAronov/SuperFind.git
cd SuperFind

# Install dependencies
bun install

# Configure environment variables
cp .env.example .env
# Add your API keys to .env

# Start Qdrant (if running locally)
docker run -p 6333:6333 qdrant/qdrant

# Start the development server
bun run dev

# In a new terminal, start the frontend (optional)
cd frontend
bun install
bun run dev
```

Access the app at `http://localhost:5173`

---

## API Usage- [Bun](https://bun.sh) 1.0+

### Search Endpoint

```http
GET /api/search?query=<search_term>&limit=<num>&offset=<num>&provider=<ai_provider>
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | *required* | Search query (semantic search) |
| `limit` | number | `5` | Results per page (1-50) |
| `offset` | number | `0` | Skip N results (pagination) |
| `provider` | string | `openai` | AI provider for answer generation |

#### Example Request

```bash
curl "http://localhost:3000/api/search?query=senior+backend+developer&limit=10&offset=0&provider=openai"
```

#### Example Response

```json
{
  "answer": "Based on the search results, here are the senior backend developers...",
  "sources": [
    {
      "pageContent": "John Doe - Senior Backend Engineer with 8 years of experience...",
      "metadata": {
        "name": "John Doe",
        "skills": "Node.js, TypeScript, PostgreSQL",
        "location": "USA"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "returned": 10,
    "limit": 10,
    "offset": 0
  }
}
```

### Health Check

```http
GET /health
```

---

## Architecture

### Tech Stack

- **Runtime**: Bun (faster Node.js alternative)
- **Framework**: Hono (lightweight web framework)
- **Vector DB**: Qdrant (similarity search)
- **AI Orchestration**: LangChain.js
- **Embeddings**: OpenAI text-embedding-3-large (3072 dimensions)
- **LLM Providers**: OpenAI, Anthropic, Gemini, Ollama, HuggingFace

### How It Works

1. **User Query** → Converted to vector embedding (3072 dimensions)
2. **Vector Search** → Qdrant finds similar documents via cosine similarity
3. **Context Retrieval** → Top K relevant documents retrieved
4. **AI Generation** → LLM generates answer using retrieved context (RAG)
5. **Response** → JSON with answer, sources, and pagination metadata

### Project Structure

```
SuperFind/
├── src/
│   ├── ai/                    # AI routes and services
│   │   ├── ai.routes.ts       # Search endpoints
│   │   ├── ai.services.ts     # RAG logic
│   │   └── providers/         # AI provider implementations
│   ├── vector/                # Vector database services
│   │   ├── qdrant.services.ts # Qdrant integration
│   │   └── embedding-factory.ts
│   ├── parser/                # Data parsing services
│   └── config/                # Environment configuration
├── static-data/               # Sample datasets
│   ├── csv/                   # CSV files
│   ├── json/                  # JSON files
│   └── text/                  # Text files
└── frontend/                  # React frontend (optional)
```

---

## Configuration

### Backend (.env)

```bash
OPENAI_API_KEY=<key>
QDRANT_HOST=localhost              # or <cluster>.qdrant.io
QDRANT_API_KEY=                    # only for cloud
QDRANT_PROTOCOL=http               # or https
PORT=3000
OPENAI_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-large
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:3000  # or production URL
```

---

## Deployment

### Free Tier Stack ($0/month + OpenAI usage)

| Service | Tier | Purpose |
|---------|------|---------|
| Qdrant Cloud | 1GB free | Vector database |
| Render | 750hrs/month | Backend API |
| Vercel | 100GB bandwidth | Frontend |

### Steps

**1. Qdrant Cloud**
```bash
# https://cloud.qdrant.io/ - Create cluster
# Get: Cluster URL + API Key
# Upload data locally with cloud credentials
```

**2. Render Backend**
```bash
# https://render.com/ - New Blueprint
# Connect GitHub repo, select render.yaml
# Add env vars:
#   OPENAI_API_KEY
#   QDRANT_HOST
#   QDRANT_API_KEY
#   FRONTEND_URL
```

**3. Vercel Frontend**
```bash
# Update frontend/.env.production with Render URL
git push

# https://vercel.com/ - Import repo
# Root: frontend
# Framework: Vite
# Env: VITE_API_URL=<render-url>
```

**4. Update CORS**
```typescript
// src/index.ts - Add Vercel URL to CORS origins
git push  // Render auto-redeploys
```

### Verification

```bash
curl https://<app>.onrender.com/health
curl "https://<app>.onrender.com/api/search?query=developer"
```

---

## Search Examples

```
"python developer"
"backend engineer from Europe"
"senior developer with 10 years experience"
"AI researcher with machine learning skills"
```

---

## Limitations

**Render Free Tier**
- Hibernates after 15min inactivity
- Cold start: ~30s
- Mitigation: UptimeRobot (ping every 14min)

**Qdrant Free Tier**
- 1GB RAM (~100k-500k vectors)
- Single node

**Costs**
- Hosting: $0/month
- OpenAI API: ~$1-5/month (usage-based)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Verify env vars, check Qdrant connection |
| CORS errors | Add frontend URL to CORS config |
| No search results | Confirm data uploaded, check Qdrant dashboard |
| Slow first request | Normal (Render hibernation), ~30s cold start |

---

## Roadmap & Future Enhancements

### High Priority

- [ ] **Authentication & Authorization**
  - JWT-based authentication
| No search results | Confirm data uploaded, check Qdrant dashboard |
| Slow first request | Normal (Render hibernation), ~30s cold start |

---

## Development

```bash
# Backend
bun run dev           # Start with hot reload
bun run lint          # Run linter
bun run check         # Type check

# Frontend
cd frontend
bun run dev           # Start dev server
bun run build         # Production build
bun run lint          # Run linter
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with hot reload |
| `bun start` | Start production server |
| `bun run lint` | Lint code with Biome |
| `bun run format` | Format code with Biome |
| `bun run check` | Check code quality |
| `bun run check:fix` | Auto-fix code quality issues |

---

## Roadmap & Future Enhancements (Full List)

### High Priority

- [ ] **Authentication & Authorization**
  - JWT-based authentication
  - API key management
  - Rate limiting per user
  - Role-based access control (RBAC)

- [ ] **Advanced Search Features**
  - Hybrid search (vector + keyword/BM25)
  - Metadata filtering (location, skills, experience level)
  - Faceted search with filters
  - Search suggestions/autocomplete
  - Search history tracking

- [ ] **Performance Optimizations**
  - Response caching (Redis)
  - Query result caching
  - Embedding caching for common queries
  - Database connection pooling
  - CDN integration for static assets

### Medium Priority

- [ ] **Frontend Enhancements**

MIT  - Advanced search UI with filters

  - Real-time search (debounced)

## Acknowledgments  - Infinite scroll pagination

  - Search result highlighting

OpenAI · Qdrant · Bun · React · shadcn/ui · Vercel · Render  - Export results (CSV, JSON, PDF)

  - Dark mode support

- [ ] **Data Management**
  - Admin dashboard for data management
  - Bulk upload/import (CSV, JSON, Excel)
  - Data deduplication
  - Automated data refresh/sync
  - Data versioning and rollback

- [ ] **Analytics & Monitoring**
  - Search analytics dashboard
  - Query performance metrics
  - User behavior tracking
  - Error logging and alerting (Sentry)
  - Prometheus + Grafana integration

### Advanced Features
- [ ] **Multi-Modal Search**
  - Image-based search
  - Voice search integration
  - PDF/document search
  - Code search capabilities

- [ ] **Machine Learning Enhancements**
  - Custom fine-tuned embeddings
  - Personalized search ranking
  - A/B testing for search algorithms
  - Semantic clustering/categorization
  - Query intent classification

- [ ] **Scalability**
  - Kubernetes deployment configs
  - Load balancing
  - Multi-region Qdrant clusters
  - Horizontal scaling support
  - Microservices architecture

### Experimental
- [ ] **Conversational Search**
  - Multi-turn conversations
  - Context-aware follow-up queries
  - Chat history persistence
  - Streaming responses (SSE)

- [ ] **Integration Ecosystem**
  - Slack/Discord bot integration
  - Chrome extension
  - VS Code extension
  - REST API SDK libraries (Python, JS, Go)
  - Webhooks for events

- [ ] **Enterprise Features**
  - Multi-tenancy support
  - Custom embedding models per tenant
  - SLA monitoring
  - Audit logs
  - Data residency compliance

### Developer Experience

- [ ] **Testing & Quality**
  - Unit test coverage (Jest/Vitest)
  - Integration tests
  - E2E tests (Playwright)
  - Performance benchmarks
  - Load testing scripts

- [ ] **Documentation**
  - Interactive API documentation (Swagger/OpenAPI)
  - Video tutorials
  - Blog post series
  - Code examples repository
  - Contribution guidelines

- [ ] **DevOps**
  - CI/CD pipeline (GitHub Actions)
  - Automated deployments
  - Database migration scripts
  - Docker Compose for local dev
  - Infrastructure as Code (Terraform)

---

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Qdrant](https://qdrant.tech/) - High-performance vector database
- [LangChain](https://js.langchain.com/) - LLM orchestration framework
- [OpenAI](https://openai.com/) - Embeddings and language models
- [Hono](https://hono.dev/) - Ultrafast web framework
- [Bun](https://bun.sh/) - JavaScript runtime

</div>
