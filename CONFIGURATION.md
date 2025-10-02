# Configuration & Environment Guide

This document explains SuperFind's comprehensive configuration system, environment variable management, and deployment setup options.

## 🎯 **Overview**

SuperFind uses environment-driven configuration to support multiple AI providers, embedding models, and deployment scenarios. All models and services are configurable via environment variables without code changes.

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   Environment Config    │    │   Model Selection       │    │   Service Configuration │
│                         │────│                         │────│                         │
│ • API Keys              │    │ • AI Providers          │    │ • Vector Database       │
│ • Model Selection       │    │ • Embedding Models      │    │ • Application Settings  │
│ • Service URLs          │    │ • Auto-Selection        │    │ • Development/Production│
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

## 🔧 **Environment Configuration**

### **Environment File (`.env`)**
Create a `.env` file in the project root based on the provided `.env.example`:

```bash
# Copy the example file
cp .env.example .env

# Edit with your specific configuration
# API keys, model preferences, service URLs
```

### **Configuration Categories**

1. **🤖 AI Provider API Keys** - Authentication for language models
2. **🧠 Model Selection** - Specific model versions to use
3. **📊 Embedding Configuration** - Vector embedding providers
4. **🗃️ Vector Database** - Qdrant connection settings
5. **⚙️ Application Settings** - Runtime configuration

## 🤖 **AI Provider Configuration**

### **API Keys**
```bash
# Choose your preferred AI providers (at least one required)

# OpenAI (Recommended for production)
OPENAI_API_KEY=sk-your_openai_api_key_here

# Anthropic Claude (High-quality alternative)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google Gemini (Google's AI models)
GOOGLE_API_KEY=your_google_api_key_here

# Hugging Face (Open source models)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Ollama (Local models - no API key needed)
# Just ensure Ollama is installed and running
```

### **Model Selection**
```bash
# OpenAI Models (if OPENAI_API_KEY is set)
OPENAI_MODEL=gpt-4o-mini
# Available: gpt-4o, gpt-4o-mini, gpt-4, gpt-3.5-turbo

# Anthropic Models (if ANTHROPIC_API_KEY is set)
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
# Available: claude-3-5-sonnet-20241022, claude-3-opus-20240229, claude-3-sonnet-20240229

# Google Gemini Models (if GOOGLE_API_KEY is set)
GEMINI_MODEL=gemini-1.5-pro
# Available: gemini-1.5-pro, gemini-1.5-flash, gemini-pro

# Hugging Face Models (if HUGGINGFACE_API_KEY is set)
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.1
# Available: Any Hugging Face model ID

# Ollama Models (local installation)
OLLAMA_MODEL=llama3.2
OLLAMA_BASE_URL=http://localhost:11434
# Available: llama3.2, qwen2.5, codellama, mistral, deepseek-coder
```

### **Provider Auto-Selection Logic**
```typescript
// Priority order for automatic provider selection
export const createBestAvailable = async (): Promise<AIProvider> => {
    // 1. OpenAI (highest quality, requires API key)
    if (process.env.OPENAI_API_KEY) return createOpenAI();
    
    // 2. Anthropic Claude (excellent alternative)
    if (process.env.ANTHROPIC_API_KEY) return createAnthropic();
    
    // 3. Google Gemini (good integration)
    if (process.env.GOOGLE_API_KEY) return createGemini();
    
    // 4. Hugging Face (budget-friendly)
    if (process.env.HUGGINGFACE_API_KEY) return createHuggingFace();
    
    // 5. Ollama (free local fallback)
    return createOllama();
};
```

## 📊 **Embedding Model Configuration**

### **Embedding Provider Selection**
```bash
# OpenAI Embeddings (highest quality)
OPENAI_SMALL_EMBEDDING_MODEL=text-embedding-3-small    # 1536 dimensions
OPENAI_LARGE_EMBEDDING_MODEL=text-embedding-3-large    # 3072 dimensions

# Ollama Embeddings (free, local)
OLLAMA_EMBEDDING_MODEL=mxbai-embed-large               # 1024 dimensions
OLLAMA_MXBAI_EMBEDDING_MODEL=mxbai-embed-large         # Alternative name

# Hugging Face Embeddings (cost-effective)
HUGGINGFACE_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2  # 384 dims
HUGGINGFACE_BGE_EMBEDDING_MODEL=BAAI/bge-large-en-v1.5              # 1024 dims

# Google Embeddings
GOOGLE_EMBEDDING_MODEL=text-embedding-004              # 768 dimensions
```

### **Embedding Auto-Selection**
```typescript
export function getBestAvailableEmbedding(): EmbeddingConfig {
    // Priority: Quality > Cost-effectiveness > Local availability
    
    if (process.env.OPENAI_API_KEY) {
        return EMBEDDING_PRESETS["openai-large"];  // Best quality
    }
    
    if (process.env.HUGGINGFACE_API_KEY) {
        return EMBEDDING_PRESETS["hf-bge-large"];  // Good alternative
    }
    
    // Fallback to local Ollama (free but requires setup)
    return EMBEDDING_PRESETS["ollama-mxbai"];
}
```

## 🗃️ **Vector Database Configuration**

### **Qdrant Settings**
```bash
# Qdrant Connection
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_PROTOCOL=http
QDRANT_API_KEY=your_qdrant_api_key_here  # Optional for local development

# Batch Processing Settings
QDRANT_MAX_BATCH_SIZE=100
QDRANT_RETRY_ATTEMPTS=3
QDRANT_RETRY_DELAY=1000

# Embedding Configuration for Qdrant
EMBEDDING_PROVIDER=openai
EMBEDDING_MODEL=text-embedding-ada-002
EMBEDDING_DIMENSION=1536
EMBEDDING_BASE_URL=  # Optional custom endpoint
```

### **Qdrant Deployment Options**

#### **Option 1: Local Docker**
```bash
# Start Qdrant locally
docker run -p 6333:6333 qdrant/qdrant

# Configuration
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_PROTOCOL=http
# QDRANT_API_KEY not needed for local
```

#### **Option 2: Qdrant Cloud**
```bash
# Use Qdrant Cloud service
QDRANT_HOST=your-cluster.qdrant.io
QDRANT_PORT=6333
QDRANT_PROTOCOL=https
QDRANT_API_KEY=your_cloud_api_key
```

#### **Option 3: Self-hosted Production**
```bash
# Your own Qdrant server
QDRANT_HOST=qdrant.yourcompany.com
QDRANT_PORT=6333
QDRANT_PROTOCOL=https
QDRANT_API_KEY=your_production_key
```

## ⚙️ **Application Settings**

### **Core Configuration**
```bash
# Application Runtime
PORT=3000
NODE_ENV=development  # or production

# Logging Level
LOG_LEVEL=info  # debug, info, warn, error
```

### **Development vs Production**

#### **Development Settings**
```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Use local services
QDRANT_HOST=localhost
OLLAMA_BASE_URL=http://localhost:11434

# Fast, cheap models for testing
OPENAI_MODEL=gpt-4o-mini
OPENAI_SMALL_EMBEDDING_MODEL=text-embedding-3-small
```

#### **Production Settings**
```bash
NODE_ENV=production
PORT=8080
LOG_LEVEL=warn

# Production Qdrant
QDRANT_HOST=prod-qdrant.company.com
QDRANT_PROTOCOL=https
QDRANT_API_KEY=prod_api_key

# High-quality models
OPENAI_MODEL=gpt-4o
OPENAI_LARGE_EMBEDDING_MODEL=text-embedding-3-large
```

## 🔍 **Configuration Validation**

### **Environment Validation Function**
```typescript
export function validateEnvironment(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check if at least one AI provider is configured
    const hasAnyProvider = Object.values(config.api_keys).some(Boolean);
    if (!hasAnyProvider) {
        errors.push("No AI provider API keys configured");
    }
    
    // Validate Ollama URL if no cloud providers
    if (!hasAnyProvider && !process.env.OLLAMA_BASE_URL) {
        errors.push("No AI providers configured");
    }
    
    return { valid: errors.length === 0, errors };
}
```

### **Configuration Logging**
```typescript
export function logCurrentConfiguration() {
    console.log("📋 Current Model Configuration:");
    console.log("🤖 Available AI Providers:");
    
    Object.entries(config.api_keys).forEach(([provider, available]) => {
        const model = config.ai_models[provider];
        const status = available ? "✅" : "❌";
        console.log(`    ${status} ${provider.toUpperCase()}: ${model}`);
    });
    
    console.log("🔍 Embedding Models:");
    console.log(`    OpenAI: ${config.embedding_models.openai_large}`);
    console.log(`    Ollama: ${config.embedding_models.ollama}`);
    
    console.log("🗃️ Vector Database:");
    console.log(`    Qdrant: ${config.qdrant.protocol}://${config.qdrant.host}:${config.qdrant.port}`);
}
```

## 🚀 **Deployment Scenarios**

### **Scenario 1: Cloud-Only (Recommended for Production)**
```bash
# Use only cloud providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=...
QDRANT_HOST=cloud-cluster.qdrant.io
QDRANT_API_KEY=...

# High-quality models
OPENAI_MODEL=gpt-4o
OPENAI_LARGE_EMBEDDING_MODEL=text-embedding-3-large
```

**Pros:** Highest quality, reliable, scalable  
**Cons:** Costs money, network dependent

---

### **Scenario 2: Hybrid (Cloud AI + Local Vector DB)**
```bash
# Cloud AI providers
OPENAI_API_KEY=sk-...

# Local Qdrant
QDRANT_HOST=localhost
QDRANT_PORT=6333

# Mix of cloud embeddings with local storage
```

**Pros:** Good quality, data stays local  
**Cons:** Requires local Qdrant setup

---

### **Scenario 3: Fully Local (Privacy-First)**
```bash
# Local Ollama only
OLLAMA_MODEL=llama3.2
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_EMBEDDING_MODEL=mxbai-embed-large

# Local Qdrant
QDRANT_HOST=localhost
QDRANT_PORT=6333

# No API keys needed
```

**Pros:** Free, private, offline capable  
**Cons:** Requires local setup, lower quality

---

### **Scenario 4: Development (Fast & Cheap)**
```bash
# Cheap models for testing
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_SMALL_EMBEDDING_MODEL=text-embedding-3-small

# Local services
QDRANT_HOST=localhost
```

**Pros:** Fast development, low costs  
**Cons:** Not production quality

## 🛠️ **Setup Instructions**

### **1. Basic Setup**
```bash
# Clone repository
git clone https://github.com/MarkAronov/SuperFind.git
cd SuperFind

# Install dependencies
bun install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

### **2. AI Provider Setup**

#### **OpenAI Setup**
```bash
# 1. Get API key from https://platform.openai.com/
# 2. Add to .env
OPENAI_API_KEY=sk-your_key_here
OPENAI_MODEL=gpt-4o-mini  # Start with cheaper model

# 3. Test connection
bun run dev
# Look for: "✅ Using OpenAI with model: gpt-4o-mini"
```

#### **Ollama Setup (Local)**
```bash
# 1. Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Start Ollama service
ollama serve

# 3. Pull a model
ollama pull llama3.2
ollama pull mxbai-embed-large  # For embeddings

# 4. Configure .env
OLLAMA_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=mxbai-embed-large
OLLAMA_BASE_URL=http://localhost:11434
```

### **3. Qdrant Setup**

#### **Local Docker Setup**
```bash
# 1. Start Qdrant container
docker run -d -p 6333:6333 -v qdrant_storage:/qdrant/storage qdrant/qdrant

# 2. Configure .env
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_PROTOCOL=http

# 3. Test connection
bun run dev
# Look for: "✅ Connected to Qdrant at localhost:6333"
```

### **4. Start Development**
```bash
# Start backend
bun run dev

# Start frontend (in another terminal)
cd frontend
bun run dev

# Visit http://localhost:5173 for frontend
# API available at http://localhost:3000
```

## 🔧 **Configuration Best Practices**

### **1. API Key Management**
- **Never commit API keys to version control**
- Use separate keys for development/production
- Rotate keys regularly
- Use environment-specific key names if needed

### **2. Model Selection Strategy**
- **Development**: Use faster, cheaper models (gpt-4o-mini)
- **Production**: Use highest quality models (gpt-4o)
- **Testing**: Use local models when possible (Ollama)
- **Budget**: Use Hugging Face or smaller OpenAI models

### **3. Embedding Strategy**  
- **High accuracy needed**: OpenAI text-embedding-3-large
- **Balanced**: OpenAI text-embedding-3-small  
- **Budget-conscious**: Hugging Face BGE-large
- **Privacy-first**: Ollama local embeddings

### **4. Environment Organization**
```bash
# Use descriptive variable names
PROD_OPENAI_API_KEY=...
DEV_OPENAI_API_KEY=...

# Group related settings
# AI PROVIDERS
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...

# EMBEDDING MODELS
OPENAI_LARGE_EMBEDDING_MODEL=...
HUGGINGFACE_EMBEDDING_MODEL=...

# VECTOR DATABASE
QDRANT_HOST=...
QDRANT_PORT=...
```

This configuration system provides maximum flexibility while maintaining simplicity and security for SuperFind deployments across different environments and requirements.