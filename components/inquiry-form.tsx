"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { serviceTypes, ServiceType } from "@/data/types";

type FormState = {
  name: string;
  email: string;
  phone: string;
  serviceType: ServiceType;
  eventDate: string;
  location: string;
  howDidYouHear: string;
  message: string;
  website: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const serviceLabels: Record<ServiceType, string> = {
  weddings: "Weddings",
  engagements: "Engagements",
  adventure: "Adventure Sessions",
  portraits: "Portraits",
  events: "Events",
  travel: "Travel Stories",
  street: "Street",
  landscape: "Landscape"
};

export function InquiryForm() {
  const searchParams = useSearchParams();
  const defaultService = useMemo(() => {
    const value = searchParams.get("service");
    if (value && serviceTypes.includes(value as ServiceType)) {
      return value as ServiceType;
    }
    return "weddings" as ServiceType;
  }, [searchParams]);

  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    serviceType: defaultService,
    eventDate: "",
    location: "",
    howDidYouHear: "",
    message: "",
    website: ""
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, serviceType: defaultService }));
  }, [defaultService]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    setFieldErrors([]);

    try {
      const response = await fetch("/api/inquiry", {
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
        setErrorMessage(payload.error ?? "Unable to submit inquiry right now.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        serviceType: defaultService,
        eventDate: "",
        location: "",
        howDidYouHear: "",
        message: "",
        website: ""
      });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again or email directly.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-black/10 bg-white p-6 shadow-soft sm:p-8" noValidate>
      <div aria-live="polite" className="min-h-6 text-sm">
        {status === "success" ? <p className="text-pine">Thanks, your inquiry was sent successfully.</p> : null}
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

      <div className="grid gap-5 sm:grid-cols-2">
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

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-ink">
          Phone
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => setField("phone", event.target.value)}
            className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
          />
        </label>
        <label className="text-sm text-ink">
          Service Type*
          <select
            required
            value={form.serviceType}
            onChange={(event) => setField("serviceType", event.target.value as ServiceType)}
            className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
          >
            {serviceTypes.map((service) => (
              <option key={service} value={service}>
                {serviceLabels[service]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-ink">
          Event Date
          <input
            type="date"
            value={form.eventDate}
            onChange={(event) => setField("eventDate", event.target.value)}
            className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
          />
        </label>
        <label className="text-sm text-ink">
          Location
          <input
            type="text"
            value={form.location}
            onChange={(event) => setField("location", event.target.value)}
            className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
          />
        </label>
      </div>

      <label className="block text-sm text-ink">
        How did you hear about me?
        <input
          type="text"
          value={form.howDidYouHear}
          onChange={(event) => setField("howDidYouHear", event.target.value)}
          className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
        />
      </label>

      <label className="block text-sm text-ink">
        Tell me about your vision*
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(event) => setField("message", event.target.value)}
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
