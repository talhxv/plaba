from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AbstractInput(BaseModel):
    abstract: str

@app.post("/simplify/")
async def simplify_abstract(input: AbstractInput):
    # Make some obvious changes to the text
    text = input.abstract
    simplified = f"""
    🔬 ORIGINAL LENGTH: {len(text)} characters
    
    🎯 SIMPLIFIED VERSION:
    {text.upper()}
    
    ✨ WITH SOME CHANGES:
    - Added emojis
    - Made text uppercase
    - Added this bullet list
    - Original text was: "{text[:50]}..."
    """

    return {"simplified_abstract": simplified}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)