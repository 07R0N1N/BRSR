"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SECTIONS = ["A", "B", "C"];
const PRINCIPLES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

type Role = { id: string; name: string; slug: string };

export function VisibilityForm({ roles }: { roles: Role[] }) {
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "");
  const [section, setSection] = useState("A");
  const [principleNo, setPrincipleNo] = useState("1");
  const [questionCode, setQuestionCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const code = questionCode.trim() || "default";
    setLoading(true);
    const res = await fetch("/api/visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role_id: roleId,
        section,
        principle_no: principleNo,
        question_code: code,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to add visibility");
      return;
    }
    setQuestionCode("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap items-end gap-4">
      <div>
        <label htmlFor="vis-role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="vis-role"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          required
          className="mt-1 block w-40 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="vis-section" className="block text-sm font-medium text-gray-700">
          Section
        </label>
        <select
          id="vis-section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="mt-1 block w-24 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {SECTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="vis-principle" className="block text-sm font-medium text-gray-700">
          Principle
        </label>
        <select
          id="vis-principle"
          value={principleNo}
          onChange={(e) => setPrincipleNo(e.target.value)}
          className="mt-1 block w-24 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {PRINCIPLES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="vis-code" className="block text-sm font-medium text-gray-700">
          Question code (optional)
        </label>
        <input
          id="vis-code"
          type="text"
          value={questionCode}
          onChange={(e) => setQuestionCode(e.target.value)}
          className="mt-1 block w-48 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. 1.1"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Adding…" : "Add visibility"}
      </button>
      {error && (
        <p className="w-full text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
