from fastapi import FastAPI

from graph.workflow import graph

app = FastAPI()

@app.post("/proposal")
def create_proposal(data: dict):

    result = graph.invoke(
        {
            "transcript":
            data["transcript"]
        }
    )

    return result