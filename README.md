# SuperFind<div align="center">



AI-powered semantic search engine for finding people by skills, experience, and location.# SuperFind



## Stack### Intelligent Semantic Search API with Vector Database & RAG



**Backend:** Bun · Hono · OpenAI · Qdrant · LangChain · TypeScript  [![Bun](https://img.shields.io/badge/Bun-1.0+-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)

**Frontend:** React 19 · Vite 7 · TailwindCSS 4 · TanStack Query · Axios[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![Hono](https://img.shields.io/badge/Hono-4.9+-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)

## Features[![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-DC244C?style=for-the-badge&logo=qdrant&logoColor=white)](https://qdrant.tech/)

[![LangChain](https://img.shields.io/badge/LangChain-0.3-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)](https://js.langchain.com/)

- Semantic vector search with natural language[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

- AI-generated contextual answers (GPT-4o-mini)

- Structured person data extraction[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

- Multi-format data parsing (CSV, JSON, TXT)[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

- Atomic Design component architecture

- Full TypeScript support**A production-ready semantic search engine powered by vector embeddings, multiple AI providers, and RAG (Retrieval Augmented Generation) pattern.**



## Quick Start[Features](#-features) • [Quick Start](#-quick-start) • [API Usage](#-api-usage) • [Architecture](#-architecture) • [Roadmap](#-roadmap-future-enhancements)



### Prerequisites</div>

- Bun ([bun.sh](https://bun.sh))

- OpenAI API key---

- Docker (for local Qdrant)

## Features

### Installation

### Core Capabilities

```bash- **Semantic Search**: Find relevant results based on meaning, not just keywords

# Clone and install- **Complex Query Support**: Handles multi-criteria queries (experience + location, skills + role)

git clone https://github.com/MarkAronov/SuperFind.git- **Multi-AI Provider Support**: OpenAI, Anthropic, Google Gemini, Ollama, HuggingFace

cd SuperFind- **Vector Database Integration**: Qdrant for high-performance similarity search

bun install- **RAG Pattern**: Retrieval Augmented Generation for context-aware AI responses

cd frontend && bun install && cd ..- **Multi-Format Data Parsing**: CSV, JSON, and TXT file support

- **Pagination**: Efficient result pagination with metadata

# Configure- **Lightning Fast**: Built on Bun runtime for maximum performance

cp .env.example .env

# Add OPENAI_API_KEY to .env### Technical Features

- **Type-Safe**: Full TypeScript implementation

# Start Qdrant- **RESTful API**: Clean and intuitive Hono-based endpoints

docker run -p 6333:6333 qdrant/qdrant- **Flexible Embeddings**: Support for multiple embedding models

- **Vector Similarity**: Cosine similarity search with 3072-dimensional vectors

# Start backend- **Health Monitoring**: Built-in health check endpoints

bun run dev- **Environment Config**: Secure credential management



# Upload data (in browser)---

# http://localhost:3000/parser/upload

## Quick Start

# Start frontend (new terminal)

cd frontend && bun run dev### Prerequisites

```- [Bun](https://bun.sh) 1.0+

- [Qdrant](https://qdrant.tech/) running locally or remote instance

Access: `http://localhost:5173`- API keys for AI providers (OpenAI, Anthropic, etc.)



## API### Installation



### Search1. **Clone the repository**

```bash   ```bash

GET /ai/search?query=backend+developer+from+US   git clone https://github.com/MarkAronov/SuperFind.git

```   cd SuperFind

   ```

**Response:**

```json2. **Install dependencies**

{   ```bash

  "success": true,   bun install

  "answer": "AI summary...",   ```

  "people": [{

    "name": "John Doe",3. **Configure environment variables**

    "role": "Backend Developer",   ```bash

    "location": "San Francisco",   # Create .env file with your API keys

    "skills": "Python; Django; PostgreSQL",   OPENAI_API_KEY=your_key_here

    "experience_years": 5,   ANTHROPIC_API_KEY=your_key_here

    "email": "john@example.com",   GEMINI_API_KEY=your_key_here

    "relevanceScore": 0.92   # ... add other providers as needed

  }]   ```

}

```4. **Start Qdrant** (if running locally)

   ```bash

### Health   docker run -p 6333:6333 qdrant/qdrant

```bash   ```

GET /health

```5. **Start the development server**

   ```bash

## Deployment   bun run dev

   ```

### Free Tier Stack ($0/month + OpenAI usage)

6. **Test the API**

| Service | Tier | Purpose |   ```bash

|---------|------|---------|   curl "http://localhost:3000/api/search?query=devops+engineer&limit=5"

| Qdrant Cloud | 1GB free | Vector database |   ```

| Render | 750hrs/month | Backend API |

| Vercel | 100GB bandwidth | Frontend |---



### Steps## API Usage



**1. Qdrant Cloud**### Search Endpoint

```bash```http

# https://cloud.qdrant.io/ - Create clusterGET /api/search?query=<search_term>&limit=<num>&offset=<num>&provider=<ai_provider>

# Get: Cluster URL + API Key```

# Upload data locally with cloud credentials

```#### Parameters

| Parameter | Type | Default | Description |

**2. Render Backend**|-----------|------|---------|-------------|

```bash| `query` | string | *required* | Search query (semantic search) |

# https://render.com/ - New Blueprint| `limit` | number | `5` | Results per page (1-50) |

# Connect GitHub repo, select render.yaml| `offset` | number | `0` | Skip N results (pagination) |

# Add env vars:| `provider` | string | `openai` | AI provider for answer generation |

#   OPENAI_API_KEY

#   QDRANT_HOST#### Example Request

#   QDRANT_API_KEY```bash

#   FRONTEND_URLcurl "http://localhost:3000/api/search?query=senior+backend+developer&limit=10&offset=0&provider=openai"

``````



**3. Vercel Frontend**#### Example Response

```bash```json

# Update frontend/.env.production with Render URL{

git push  "answer": "Based on the search results, here are the senior backend developers...",

  "sources": [

# https://vercel.com/ - Import repo    {

# Root: frontend      "pageContent": "John Doe - Senior Backend Engineer with 8 years of experience...",

# Framework: Vite      "metadata": {

# Env: VITE_API_URL=<render-url>        "name": "John Doe",

```        "skills": "Node.js, TypeScript, PostgreSQL",

        "location": "USA"

**4. Update CORS**      }

```typescript    }

// src/index.ts - Add Vercel URL to CORS origins  ],

git push  // Render auto-redeploys  "pagination": {

```    "total": 25,

    "returned": 10,

### Verification    "limit": 10,

```bash    "offset": 0

curl https://<app>.onrender.com/health  }

curl "https://<app>.onrender.com/ai/search?query=developer"}

``````



## Configuration### Health Check

```http

### Backend (.env)GET /health

```bash```

OPENAI_API_KEY=<key>

QDRANT_HOST=localhost              # or <cluster>.qdrant.io---

QDRANT_API_KEY=                    # only for cloud

QDRANT_PROTOCOL=http               # or https## Architecture

PORT=3000

OPENAI_MODEL=gpt-4o-mini### Tech Stack

EMBEDDING_MODEL=text-embedding-3-large- **Runtime**: Bun (faster Node.js alternative)

```- **Framework**: Hono (lightweight web framework)

- **Vector DB**: Qdrant (similarity search)

### Frontend (.env)- **AI Orchestration**: LangChain.js

```bash- **Embeddings**: OpenAI text-embedding-3-large (3072 dimensions)

VITE_API_URL=http://localhost:3000  # or production URL- **LLM Providers**: OpenAI, Anthropic, Gemini, Ollama, HuggingFace

```

### How It Works

## Project Structure1. **User Query** → Converted to vector embedding (3072 dimensions)

2. **Vector Search** → Qdrant finds similar documents via cosine similarity

```3. **Context Retrieval** → Top K relevant documents retrieved

SuperFind/4. **AI Generation** → LLM generates answer using retrieved context (RAG)

├── src/                  # Backend5. **Response** → JSON with answer, sources, and pagination metadata

│   ├── ai/              # AI services, providers, routes

│   ├── parser/          # Data processing### Project Structure

│   ├── vector/          # Qdrant integration```

│   └── config/          # Environment configSuperFind/

├── frontend/            # React app├── src/

│   └── src/│   ├── ai/                    # AI routes and services

│       ├── components/  # Atomic Design (atoms/molecules/organisms/pages)│   │   ├── ai.routes.ts       # Search endpoints

│       ├── hooks/       # useSearch│   │   ├── ai.services.ts     # RAG logic

│       └── types/       # TypeScript types│   │   └── providers/         # AI provider implementations

└── static-data/         # Sample data (CSV/JSON/TXT)│   ├── vector/                # Vector database services

```│   │   ├── qdrant.services.ts # Qdrant integration

│   │   └── embedding-factory.ts

## Search Examples│   ├── parser/                # Data parsing services

│   └── config/                # Environment configuration

```├── static-data/               # Sample datasets

"python developer"│   ├── csv/                   # CSV files

"backend engineer from Europe"│   ├── json/                  # JSON files

"senior developer with 10 years experience"│   └── text/                  # Text files

"AI researcher with machine learning skills"├── frontend/                  # React frontend (optional)

```└── docs/                      # Documentation

```

## Limitations

---

**Render Free Tier**

- Hibernates after 15min inactivity## Documentation

- Cold start: ~30s

- Mitigation: UptimeRobot (ping every 14min)- [API Routes](./API_ROUTES.md) - Complete API reference

- [Architecture](./ARCHITECTURE.md) - System design and patterns

**Qdrant Free Tier**- [AI Providers](./AI_PROVIDERS.md) - Supported AI providers

- 1GB RAM (~100k-500k vectors)- [Vector Database](./VECTOR_DATABASE.md) - Qdrant integration details

- Single node- [Pagination](./PAGINATION.md) - Pagination implementation

- [Implementation Guide](./IMPLEMENTATION.md) - Learning path for developers

**Costs**- [Search Tests](./SEARCH_TESTS.md) - Comprehensive test scenarios and examples

- Hosting: $0/month- [Test Results](./TEST_RESULTS.md) - Validation results with 100% accuracy

- OpenAI API: ~$1-5/month (usage-based)

---

## Troubleshooting

## Roadmap & Future Enhancements

| Issue | Solution |

|-------|----------|### High Priority

| Backend won't start | Verify env vars, check Qdrant connection |- [ ] **Authentication & Authorization**

| CORS errors | Add frontend URL to CORS config |  - JWT-based authentication

| No search results | Confirm data uploaded, check Qdrant dashboard |  - API key management

| Slow first request | Normal (Render hibernation), ~30s cold start |  - Rate limiting per user

  - Role-based access control (RBAC)

## Development

- [ ] **Advanced Search Features**

```bash  - Hybrid search (vector + keyword/BM25)

# Backend  - Metadata filtering (location, skills, experience level)

bun run dev           # Start with hot reload  - Faceted search with filters

bun run lint          # Run linter  - Search suggestions/autocomplete

bun run check         # Type check  - Search history tracking



# Frontend- [ ] **Performance Optimizations**

cd frontend  - Response caching (Redis)

bun run dev           # Start dev server  - Query result caching

bun run build         # Production build  - Embedding caching for common queries

bun run lint          # Run linter  - Database connection pooling

```  - CDN integration for static assets



## License### Medium Priority

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
