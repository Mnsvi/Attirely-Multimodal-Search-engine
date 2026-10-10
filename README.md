![alt text](image.png)
# Attirely — AI-Powered Fashion Discovery

Discover fashion through intelligent visual and semantic search. **Attirely** combines multimodal fashion embeddings, vector retrieval, metadata filtering, and relevance-based reranking to help users find products that match their style and preferences.

## Overview

Attirely is a full-stack fashion discovery application built to make product search more intelligent than traditional keyword-based filtering. It uses a fashion-specific CLIP model to represent text and images as embeddings, retrieves relevant products from Qdrant, and optionally improves ranking with a cross-encoder.

The project also integrates Gemini for AI-assisted fashion insights.

## Key Features

- **Semantic fashion search:** Retrieve relevant products based on the meaning of a search query.
- **Fashion-specific embeddings:** Uses Marqo Fashion-CLIP through OpenCLIP.
- **Vector database retrieval:** Uses Qdrant to search indexed product embeddings.
- **Hybrid search:** Combines dense-vector retrieval with BM25 sparse retrieval and reciprocal rank fusion.
- **Metadata filtering:** Supports attributes such as brand, gender, category, colour, fabric, season, occasion, and price.
- **Optional reranking:** Applies fashion-aware category and material scoring, with a cross-encoder available for ranking optimization.
- **AI-assisted fashion insights:** Integrates Gemini for supported AI-powered fashion functionality.
- **Full-stack architecture:** React frontend and FastAPI backend.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| Backend | Python, FastAPI, Uvicorn |
| Embedding model | Marqo Fashion-CLIP, OpenCLIP, PyTorch |
| Vector database | Qdrant |
| Hybrid retrieval | Dense vectors, BM25, Reciprocal Rank Fusion |
| Reranking | Sentence Transformers, CrossEncoder |
| AI integration | Google Gemini API |
| Image processing | Pillow |
| Deployment | Railway for the backend; frontend hosting configured separately |

## Architecture

```text
                  USER
                    |
                    v
          React + Vite Frontend
                    |
                    v
             FastAPI Backend
                    |
          +---------+----------+
          |                    |
          v                    v
   Fashion-CLIP            Gemini API
   Embeddings              AI Insights
          |
          v
      Qdrant DB
          |
          v
   Product Retrieval
          |
          v
   Hybrid Search
  Dense + Sparse/BM25
          |
          v
  Optional Reranking
          |
          v
    Ranked Results
          |
          v
     React UI
```

## Project Structure

```text
ATTIRELY/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config/
│   │   │   └── settings.py
│   │   ├── services/
│   │   │   └── search_engine.py
│   │   └── ...
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── data/
├── infra/
└── README.md
```

*Some files and directories are omitted for readability.*

## Prerequisites

Before running Attirely locally, install:

- Git
- Python 3.12 or a compatible version supported by the project dependencies
- Node.js and npm
- A Qdrant instance containing the indexed product collection
- A Google Gemini API key for features that use Gemini

Fashion-CLIP and the cross-encoder may download model files during their first initialization. Ensure you have sufficient disk space, memory, and network access.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mnsvi/attirely-phase1.git
cd attirely-phase1
```

### 2. Configure the backend

```bash
cd backend
python -m venv .venv
```

Activate the environment.

**Windows PowerShell:**

```powershell
.venv\Scripts\Activate.ps1
```

**macOS/Linux:**

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file inside `backend/` using `.env.example` as a reference.

Configure the credentials required by the application:

```dotenv
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Use the exact variable names expected by `backend/app/config/settings.py`. If the project uses additional settings, configure those as well.

**Security:** Never commit `.env` files, API keys, or other secrets to GitHub.

### 4. Start the backend

From the `backend/` directory, run:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API should be available at:

- API base URL: `http://127.0.0.1:8000`
- Interactive API documentation: `http://127.0.0.1:8000/docs`
- OpenAPI schema: `http://127.0.0.1:8000/openapi.json`

These documentation URLs are available when FastAPI's default documentation settings are enabled.

**Note:** The backend initializes its search engine during startup. The first startup may take longer while the machine downloads and loads the embedding and reranking models.

### 5. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, commonly `http://localhost:5173`.

Configure the frontend's API base URL using the environment variable or configuration mechanism already supported by the project. Ensure the frontend points to the running backend.

## Search Pipeline

Attirely's search engine follows this workflow:

1. **Query processing:** Receives the user's search criteria.
2. **Embedding generation:** Encodes text or an image using Fashion-CLIP.
3. **Candidate retrieval:** Retrieves product candidates from Qdrant.
4. **Hybrid retrieval:** Combines dense-vector results and BM25 sparse retrieval when performing text-based hybrid search.
5. **Filtering:** Applies supported product metadata and price constraints.
6. **Optional reranking:** Reorders candidates using category and material matching heuristics. A cross-encoder model is initialized for ranking-related functionality.
7. **Result delivery:** Returns ranked product records with their payloads and available relevance scores.

The Qdrant collection currently selected by the backend must contain compatible vectors and payload fields for the search pipeline to work correctly.

## API

The frontend's search client uses the `POST /search` endpoint.

**Endpoint**

```http
POST /search
Content-Type: application/json
```

**Request format**

```json
{
  "query_text": "black cotton shirt",
  "top_k": 10,
  "notes_top_k": 5
}
```

The fields above reflect the known frontend search-client request format. Confirm the backend's Pydantic request model and response schema in `/docs` before integrating additional clients.

For the complete request and response definitions, start the backend and open:

`http://127.0.0.1:8000/docs`

## Product Data and Qdrant

Attirely relies on an existing Qdrant collection for product retrieval. The backend automatically selects the first collection returned by Qdrant rather than selecting a collection by a fixed name.

For predictable production deployments:

- Ensure the intended product collection exists.
- Confirm that stored dense vectors use the same embedding model and dimensionality as query embeddings.
- Verify the sparse-vector configuration used for BM25 retrieval.
- Confirm that metadata fields used in filters exist in product payloads.
- Ensure the indexed collection contains product records with the fields expected by the frontend.

A successful database connection does not, by itself, guarantee that the collection's vector configuration is compatible with the search engine.

---

**Attirely — Making fashion discovery more intelligent, semantic, and personalized.**
