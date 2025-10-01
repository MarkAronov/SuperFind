<div align="center">

# SuperFind

### Intelligent Semantic Search API with Vector Database & RAG

[![Bun](https://img.shields.io/badge/Bun-1.0+-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/Hono-4.9+-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-DC244C?style=for-the-badge&logo=qdrant&logoColor=white)](https://qdrant.tech/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)](https://js.langchain.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

**A production-ready semantic search engine powered by vector embeddings, multiple AI providers, and RAG (Retrieval Augmented Generation) pattern.**

[Features](#-features) • [Quick Start](#-quick-start) • [API Usage](#-api-usage) • [Architecture](#-architecture) • [Roadmap](#-roadmap-future-enhancements)

</div>

---

## Features

### Core Capabilities
- **Semantic Search**: Find relevant results based on meaning, not just keywords
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

1. **Clone the repository**
   ```bash
   git clone https://github.com/MarkAronov/SuperFind.git
   cd SuperFind
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file with your API keys
   OPENAI_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   # ... add other providers as needed
   ```

4. **Start Qdrant** (if running locally)
   ```bash
   docker run -p 6333:6333 qdrant/qdrant
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

6. **Test the API**
   ```bash
   curl "http://localhost:3000/api/search?query=devops+engineer&limit=5"
   ```

---

## API Usage

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
├── frontend/                  # React frontend (optional)
└── docs/                      # Documentation
```

---

## Documentation

- [API Routes](./API_ROUTES.md) - Complete API reference
- [Architecture](./ARCHITECTURE.md) - System design and patterns
- [AI Providers](./AI_PROVIDERS.md) - Supported AI providers
- [Vector Database](./VECTOR_DATABASE.md) - Qdrant integration details
- [Pagination](./PAGINATION.md) - Pagination implementation
- [Implementation Guide](./IMPLEMENTATION.md) - Learning path for developers

---

## Roadmap & Future Enhancements

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
  - Advanced search UI with filters
  - Real-time search (debounced)
  - Infinite scroll pagination
  - Search result highlighting
  - Export results (CSV, JSON, PDF)
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

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Qdrant](https://qdrant.tech/) - High-performance vector database
- [LangChain](https://js.langchain.com/) - LLM orchestration framework
- [OpenAI](https://openai.com/) - Embeddings and language models
- [Hono](https://hono.dev/) - Ultrafast web framework
- [Bun](https://bun.sh/) - JavaScript runtime

---

<div align="center">

**Built by [MarkAronov](https://github.com/MarkAronov)**

Star this repo if you find it helpful!

</div>
