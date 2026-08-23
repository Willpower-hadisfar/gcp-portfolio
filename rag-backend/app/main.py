# app/main.py
import traceback
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.engine import get_rag_engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://axiomatic-spark-505611-t0.web.app", "http://localhost:4321"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    prompt: str

@app.get("/")
async def root():
    return {"status": "ok", "message": "RAG Backend is running"}

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {"status": "healthy", "service": "portfolio-rag-backend"}

@app.post("/api/v1/query")
async def query_endpoint(request: QueryRequest):
    try:
        engine = get_rag_engine()
        answer = engine.query(request.prompt)
        return {"answer": answer}
    except Exception as e:
        print("=== RAG BACKEND ERROR TRACEBACK ===")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Error executing query: {str(e)}"
        )