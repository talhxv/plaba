from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import os

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define paths with debug prints
current_dir = os.path.dirname(os.path.abspath(__file__))
model_dir = os.path.join(current_dir, "models")
print(f"Current directory: {current_dir}")
print(f"Model directory: {model_dir}")

# Define max length
max_len_complex = 100

try:
    # Load the model
    model_path = os.path.join(model_dir, "simplification_model.h5")
    print(f"Loading model from: {model_path}")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    model = load_model(model_path)
    print("Model loaded successfully")

    # Load tokenizers
    complex_tokenizer_path = os.path.join(model_dir, "complex_tokenizer.pkl")
    simple_tokenizer_path = os.path.join(model_dir, "simple_tokenizer.pkl")

    print(f"Loading tokenizers from: \n{complex_tokenizer_path}\n{simple_tokenizer_path}")

    if not os.path.exists(complex_tokenizer_path):
        raise FileNotFoundError(f"Complex tokenizer not found at {complex_tokenizer_path}")
    if not os.path.exists(simple_tokenizer_path):
        raise FileNotFoundError(f"Simple tokenizer not found at {simple_tokenizer_path}")

    with open(complex_tokenizer_path, 'rb') as f:
        complex_tokenizer = pickle.load(f)
    with open(simple_tokenizer_path, 'rb') as f:
        simple_tokenizer = pickle.load(f)
    print("Tokenizers loaded successfully")

except Exception as e:
    print(f"Error during initialization: {str(e)}")
    raise

# Helper functions
def preprocess_input(sentence, tokenizer, max_len):
    try:
        # Add validation for token indices
        sequence = tokenizer.texts_to_sequences([sentence])
        # Limit indices to vocab size
        sequence = [[idx if idx < len(tokenizer.word_index) + 1 else 0 for idx in seq]
                    for seq in sequence]
        padded_sequence = pad_sequences(sequence, maxlen=max_len, padding='post')
        return padded_sequence
    except Exception as e:
        print(f"Error in preprocess_input: {str(e)}")
        raise

def decode_sequence(sequence, tokenizer):
    try:
        reverse_word_index = {index: word for word, index in tokenizer.word_index.items()}
        decoded_sentence = ' '.join([reverse_word_index.get(i, '<UNK>') for i in sequence])
        return decoded_sentence
    except Exception as e:
        print(f"Error in decode_sequence: {str(e)}")
        raise

# Define input model
class AbstractInput(BaseModel):
    abstract: str

# Define simplification endpoint
@app.post("/simplify/")
async def simplify_abstract(input: AbstractInput):
    try:
        print(f"Received input text: {input.abstract[:100]}...")  # Print first 100 chars

        if not input.abstract:
            raise HTTPException(status_code=400, detail="No input text provided")

        # Preprocess
        complex_padded = preprocess_input(input.abstract, complex_tokenizer, max_len_complex)
        print("Input preprocessed successfully")

        decoder_input_data = complex_padded[:, :-1]

        # Generate prediction
        print("Generating prediction...")
        predicted_sequence = model.predict([complex_padded, decoder_input_data])
        predicted_indices = np.argmax(predicted_sequence, axis=-1)

        # Decode
        simplified_sentence = decode_sequence(predicted_indices[0], simple_tokenizer)
        print(f"Generated simplified text: {simplified_sentence[:100]}...")  # Print first 100 chars

        return {"simplified_abstract": simplified_sentence}

    except Exception as e:
        print(f"Error in simplify_abstract: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Test endpoint to verify server is running
@app.get("/")
async def root():
    return {"message": "Text Simplification API is running"}

# Run the server
if __name__ == "_main_":
    import uvicorn
    print("Starting server...")
    uvicorn.run(app, host="0.0.0.0",port=8000)
