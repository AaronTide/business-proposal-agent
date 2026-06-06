import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  let body: { transcript?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.transcript?.trim()) {
    return NextResponse.json(
      { error: "Transcript is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/proposal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: body.transcript }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json(
        { error: detail || "Backend request failed" },
        { status: response.status },
      );
    }

    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not reach the proposal backend. Start it with: uvicorn main:app --reload --app-dir backend",
      },
      { status: 503 },
    );
  }
}
