from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Import your model
from model import simplify_abstract  # Replace 'simplify_abstract' with the actual function name in your model

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input structure
class AbstractInput(BaseModel):
    abstract: str

# Endpoint that uses your model
@app.post("/simplify/")
async def simplify_endpoint(input: AbstractInput):
    try:
        # Use your model's function to simplify the abstract
        simplified = simplify_abstract(input.abstract)
        return {"simplified_abstract": simplified}
    except Exception as e:
        return {"error": str(e)}

# Allow running the server directly
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)