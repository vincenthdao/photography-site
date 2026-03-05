import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { serviceTypes } from "@/data/types";
import { sendInquiryEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required.").max(120),
  email: z.string().email("A valid email is required."),
  phone: z.string().max(50).optional().or(z.literal("")),
  serviceType: z.enum(serviceTypes),
  eventDate: z.string().max(50).optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  budget: z.string().max(120).optional().or(z.literal("")),
  howDidYouHear: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(10, "Please provide at least a short message.").max(3000),
  website: z.string().optional().or(z.literal(""))
});

function getIpKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return "unknown";
}

export async function POST(request: NextRequest) {
  const ipKey = getIpKey(request);

  if (!checkRateLimit(ipKey, 5, 60_000)) {
    return NextResponse.json({ success: false, error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => issue.message);
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const inquiryTo = process.env.INQUIRY_TO_EMAIL;
  if (!inquiryTo) {
    return NextResponse.json({ success: false, error: "Missing INQUIRY_TO_EMAIL environment variable." }, { status: 500 });
  }
  const inquiryFrom = process.env.INQUIRY_FROM_EMAIL || "onboarding@resend.dev";

  const subject = `New ${parsed.data.serviceType} inquiry from ${parsed.data.name}`;
  const text = [
    `Name: ${parsed.data.name}`,
    `Email: ${parsed.data.email}`,
    `Phone: ${parsed.data.phone || "N/A"}`,
    `Service Type: ${parsed.data.serviceType}`,
    `Event Date: ${parsed.data.eventDate || "N/A"}`,
    `Location: ${parsed.data.location || "N/A"}`,
    `Budget: ${parsed.data.budget || "N/A"}`,
    `How Did They Hear About You: ${parsed.data.howDidYouHear || "N/A"}`,
    "",
    "Message:",
    parsed.data.message
  ].join("\n");

  try {
    await sendInquiryEmail({
      to: inquiryTo,
      from: inquiryFrom,
      subject,
      text
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send inquiry email.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
