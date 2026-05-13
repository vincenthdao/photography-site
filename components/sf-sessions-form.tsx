"use client";

import { FormEvent, useState } from "react";

type SFFormState = {
  name: string;
  email: string;
  instagram: string;
  sessionType: "engagement" | "portrait" | "sf-city-hall" | "intimate-wedding";
  preferredDate: string;
  locationIdea: string;
  budgetRange: string;
  photoStyle: string;
  website: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const sessionTypeOptions = [
  { value: "engagement", label: "Engagement Session" },
  { value: "portrait", label: "Portrait Session" },
  { value: "sf-city-hall", label: "SF City Hall Elopement/Engagement" },
  { value: "intimate-wedding", label: "Intimate Wedding" }
] as const;

export function SFSessionsForm() {
  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [form, setForm] = useState<SFFormState>({
    name: "",
    email: "",
    instagram: "",
    sessionType: "engagement",
    preferredDate: "",
    locationIdea: "",
    budgetRange: "",
    photoStyle: "",
    website: ""
  });

  function setField<K extends keyof SFFormState>(key: K, value: SFFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    setFieldErrors([]);

    try {
      const response = await fetch("/api/sf-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const payload = (await response.json()) as {
        success: boolean;
        errors?: string[];
        error?: string;
      };

      if (!response.ok || !payload.success) {
        if (payload.errors) {
          setFieldErrors(payload.errors);
        }
        setErrorMessage(payload.error ?? "Unable to submit right now.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        instagram: "",
        sessionType: "engagement",
        preferredDate: "",
        locationIdea: "",
        budgetRange: "",
        photoStyle: "",
        website: ""
      });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-black/10 bg-white/95 p-5 shadow-soft sm:p-7" noValidate>
      <div aria-live="polite" className="min-h-6 text-sm">
        {status === "success" ? <p className="text-pine">Thank you, your request was sent.</p> : null}
        {status === "error" ? <p className="text-red-700">{errorMessage}</p> : null}
      </div>

      {fieldErrors.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-red-700" aria-live="assertive">
          {fieldErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}

      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        value={form.website}
        onChange={(event) => setField("website", event.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-ink">
          Name*
          <input
            required
            type="text"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
          />
        </label>
        <label className="text-sm text-ink">
          Email*
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-ink">
          Instagram handle*
          <input
            required
            type="text"
            placeholder="@yourhandle"
            value={form.instagram}
            onChange={(event) => setField("instagram", event.target.value)}
            className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
          />
        </label>
        <label className="text-sm text-ink">
          Type of session*
          <select
            required
            value={form.sessionType}
            onChange={(event) => setField("sessionType", event.target.value as SFFormState["sessionType"])}
            className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
          >
            {sessionTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-ink">
          Preferred month/date*
          <input
            required
            type="text"
            placeholder="Example: July 18 or mid-August"
            value={form.preferredDate}
            onChange={(event) => setField("preferredDate", event.target.value)}
            className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
          />
        </label>
        <label className="text-sm text-ink">
          Location idea
          <input
            type="text"
            placeholder="Example: SF City Hall, Marin Headlands"
            value={form.locationIdea}
            onChange={(event) => setField("locationIdea", event.target.value)}
            className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
          />
        </label>
      </div>

      <label className="block text-sm text-ink">
        Budget range
        <input
          type="text"
          placeholder="Example: $1,000-$2,000"
          value={form.budgetRange}
          onChange={(event) => setField("budgetRange", event.target.value)}
          className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
        />
      </label>

      <label className="block text-sm text-ink">
        What kind of photos are you drawn to?*
        <textarea
          required
          rows={5}
          value={form.photoStyle}
          onChange={(event) => setField("photoStyle", event.target.value)}
          className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-pine px-6 py-3 text-sm font-semibold text-oat transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
