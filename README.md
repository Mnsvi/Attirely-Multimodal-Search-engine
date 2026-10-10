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
- **Optional reranking:** Applies