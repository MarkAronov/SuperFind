<div align="center">

# SkillVector

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

## Deployment

### Free Tier Stack ($0/month + OpenAI usage)

| Service | Tier | Purpose |
|---------|------|---------|
| Qdrant Cloud | 1GB free | Vector database |
| Render | 750hrs/month | Backend API |
| Vercel | 100GB bandwidth | Frontend |

### Verification

```bash
curl https://<app>.onrender.com/health
curl "https://<app>.onrender.com/api/search?query=developer"
```

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

## Contributing
Contributions are welcome! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to contribute to SkillVector.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

</div>