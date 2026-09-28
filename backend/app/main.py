from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .agent import analyze_fault
from .schemas import FaultRequest, FaultResponse


app = FastAPI(
    title="FieldOps AI",
    description="AI-powered field troubleshooting assistant",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://fieldops-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": "FieldOps AI",
        "version": "0.1.0",
        "status": "online",
    }


@app.post("/analyze", response_model=FaultResponse)
def analyze(request: FaultRequest):
    return analyze_fault(request)