from fastapi import FastAPI

from graph.workflow import graph
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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

    return {
    "proposal": result["proposal"],
    "requirements": result["requirements"],
    "projects": result["similar_projects"]
}

