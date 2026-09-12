# app/main.py
import traceback
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.engine import get_rag_engine

limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://axiomatic-spark-505611-t0.web.app",
        "https://william-power.com",
        "https://www.william-power.com",
        "http://localhost:4321",
    ],
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
@limiter.limit("10/minute")
async def query_endpoint(request: Request, body: QueryRequest):
    try:
        engine = get_rag_engine()
        answer = engine.query(body.prompt)
        return {"answer": answer}
    except Exception as e:
        print("=== RAG BACKEND ERROR TRACEBACK ===")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Error executing query: {str(e)}"
        )