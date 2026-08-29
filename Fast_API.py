# Run with : python Fast_API.py
# link : http://localhost:8000
# Swagger UI : http://localhost:8000/docs
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime
import logging
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO, # Set the logging level
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s' # Terminal log message format
    # asctime - timestamps of logs
    # name - logger name from which the log is generated
    # levelname - log level of the file
    # message - the actual log message
)
logger = logging.getLogger(__name__)


app = FastAPI(
    title="LLaVA-MedRAG",
    description="RESTful API for managing chats",
    version="1.0.0"
)

# Add CORS middleware to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://192.248.10.121:5173",
        "https://llava-medrag.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class MessageData(BaseModel):
    text: str
    image: Optional[str] = None
    timestamp: str

class HistoryMessage(BaseModel):
    type: Literal["text", "image"]
    content: str
    sender: Literal["user", "bot"]
    timestamp: str

class ImageData(BaseModel):
    content: str
    timestamp: str

class History(BaseModel):
    messages: List[HistoryMessage]
    images: List[ImageData]

class ChatRequest(BaseModel):
    mode: Literal["Auto", "BrainMRI", "ChestX-ray", "Histopathology"]
    message: MessageData
    history: History
    chat_id: str

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    mode_used: str

llm_groq = ChatGroq(
    model="llama-3.1-8b-instant",  # or other Groq models
    groq_api_key=os.environ.get("GROQ_API_KEY"),  # Load from environment variable
    temperature=0
)

@app.get("/")
def root():
    return {"message": "Hello, Med!"}

# Different routes to handle different interactions
@app.get("/status")
def check_status():
    """Health check endpoint - called every 5 seconds by frontend"""
    return {"status": "ok"}

@app.post("/chat")
def reply(request: ChatRequest):
    """Main chat endpoint - processes user messages and returns AI responses"""
    logger.info(f"Received chat request for mode: {request.mode}, chat_id: {request.chat_id}")
    
    # Build context from conversation history
    context = ""
    if request.history.messages:
        context = "\n".join([
            f"{msg.sender}: {msg.content}" 
            for msg in request.history.messages[-5:]  # Last 5 messages for context
        ])
    
    # Build the prompt based on mode
    mode_prompts = {
        "BrainMRI": "You are a medical AI assistant specializing in Brain MRI analysis. ",
        "ChestX-ray": "You are a medical AI assistant specializing in Chest X-ray analysis. ",
        "Histopathology": "You are a medical AI assistant specializing in Histopathology. ",
        "Auto": "You are a medical AI assistant. "
    }
    
    system_prompt = mode_prompts.get(request.mode, mode_prompts["Auto"])
    
    # Build full prompt
    if request.message.image:
        prompt = f"{system_prompt}The user has shared an image and asks: {request.message.text}"
    else:
        prompt = f"{system_prompt}{request.message.text}"
    
    if context:
        prompt = f"Conversation history:\n{context}\n\n{prompt}"
    
    logger.info(f"Sending prompt to LLM: {prompt[:100]}...")
    
    # Get response from Groq
    response = llm_groq.invoke(prompt)
    
    return ChatResponse(
        response=response.content,
        timestamp=datetime.now().isoformat(),
        mode_used=request.mode
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000)) # Get port from environment variable (Render sets this) or default to 8000
    logger.info(f"Starting the API server on port {port}...")
    uvicorn.run(
        app,
        host="0.0.0.0",  # Bind to all network interfaces
        port=port,       # Default port
        log_level="info" # Log level
    )
    