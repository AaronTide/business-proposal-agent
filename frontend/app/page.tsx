"use client";

import { useState } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero, { HowItWorks } from "@/components/Hero";
import ProposalWorkspace from "@/components/ProposalWorkspace";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [proposal, setProposal] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);

  const generateProposal = async () => {
    try {
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

      setRequirements(
        JSON.stringify(
          data.requirements,
          null,
          2
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,_#ecfdf5_0%,_#fafafa_45%,_#ffffff_100%)]">
      <Header />

      <main className="flex-1">
        <Hero />

        {/* TEST AGENT SECTION */}

        <section className="max-w-5xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-6">
            DealPilot MVP
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

          {requirements && (
            <div className="mt-8 border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                Extracted Requirements
              </h2>

              <pre className="whitespace-pre-wrap">
                {requirements}
              </pre>
            </div>
          )}
        </section>

        {/* EXISTING COMPONENTS */}

        <ProposalWorkspace />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}