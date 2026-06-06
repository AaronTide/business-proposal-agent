from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from graph.workflow import graph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/proposal")
def create_proposal(data: dict):

    result = graph.invoke(
        {
            "transcript":
            data["transcript"]
        }
    )

    return result