import datetime
import os
from typing import Any

from mcp.server.fastmcp import FastMCP
from pymongo import MongoClient
from pymongo.errors import PyMongoError

mcp = FastMCP("DealPilot-MongoDB-MCP")

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
DB_NAME = "proposaldb"


def get_db_client():
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
        return client
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None


@mcp.tool()
def search_similar_projects(industry: str) -> list[dict[str, Any]]:
    """
    Search the 'projects' collection in 'proposaldb' for similar past projects
    matching an industry. Returns up to 3 most relevant matches.
    """
    client = get_db_client()
    if not client:
        return []

    try:
        collection = client[DB_NAME]["projects"]
        query = {"industry": {"$regex": f"^{industry}$", "$options": "i"}}
        cursor = collection.find(query).limit(3)

        results = []
        for doc in cursor:
            results.append(
                {
                    "name": doc.get("name"),
                    "industry": doc.get("industry"),
                    "description": doc.get("description"),
                    "outcome": doc.get("outcome"),
                    "budget_range": doc.get("budget_range"),
                }
            )
        return results
    except PyMongoError as e:
        print(f"Database query failed: {e}")
        return []
    finally:
        client.close()


@mcp.tool()
def save_proposal(
    transcript: str, requirements: dict[str, Any], proposal_text: str
) -> dict[str, Any]:
    """Save a generated proposal to the 'proposals' collection."""
    client = get_db_client()
    if not client:
        return {"success": False, "error": "Database connection unavailable."}

    try:
        collection = client[DB_NAME]["proposals"]
        proposal_doc = {
            "transcript_summary": (
                transcript[:500] + "..." if len(transcript) > 500 else transcript
            ),
            "requirements": requirements,
            "proposal_text": proposal_text,
            "created_at": datetime.datetime.utcnow().isoformat(),
        }
        result = collection.insert_one(proposal_doc)
        return {
            "success": True,
            "proposal_id": str(result.inserted_id),
            "message": "Proposal saved successfully to MongoDB.",
        }
    except PyMongoError as e:
        return {"success": False, "error": str(e)}
    finally:
        client.close()


@mcp.tool()
def list_recent_proposals(limit: int = 5) -> list[dict[str, Any]]:
    """Retrieve the most recently saved proposals."""
    client = get_db_client()
    if not client:
        return []

    try:
        collection = client[DB_NAME]["proposals"]
        cursor = collection.find().sort("created_at", -1).limit(limit)

        results = []
        for doc in cursor:
            results.append(
                {
                    "id": str(doc.get("_id")),
                    "requirements": doc.get("requirements"),
                    "created_at": doc.get("created_at"),
                    "proposal_snippet": doc.get("proposal_text", "")[:200] + "...",
                }
            )
        return results
    except PyMongoError as e:
        print(f"Failed to list proposals: {e}")
        return []
    finally:
        client.close()


if __name__ == "__main__":
    mcp.run()
