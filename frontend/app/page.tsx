"use client";

import { useState } from "react";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);

  const generateProposal = async () => {
    setLoading(true);

    const response = await fetch(
      "http://localhost:8000/proposal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
        }),
      }
    );

    const data = await response.json();

    setProposal(data.proposal);

    setLoading(false);
  };

  return (
    <main className="max-w-5xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-6">
        DealPilot
      </h1>

      <textarea
        className="w-full border p-4 rounded-lg h-64"
        placeholder="Paste discovery call transcript..."
        value={transcript}
        onChange={(e) =>
          setTranscript(e.target.value)
        }
      />

      <button
        className="bg-black text-white px-6 py-3 rounded mt-4"
        onClick={generateProposal}
      >
        Generate Proposal
      </button>

      {loading && (
        <p className="mt-4">
          Analyzing...
        </p>
      )}

      {proposal && (
        <div className="mt-8 border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            Generated Proposal
          </h2>

          <pre className="whitespace-pre-wrap">
            {proposal}
          </pre>
        </div>
      )}
    </main>
  );
}
