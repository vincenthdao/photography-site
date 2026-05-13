import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendInquiryEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const sfInquirySchema = z.object({
  name: z.string().min(1, "Name is required.").max(120),
  email: z.string().email("A valid email is required."),
  instagram: z.string().min(1, "Instagram handle is required.").max(120),
  sessionType: z.enum(["engagement", "portrait", "sf-city-hall", "intimate-wedding"]),
  preferredDate: z.string().min(1, "Preferred month/date is required.").max(120),
  locationIdea: z.string().max(160).optional().or(z.literal("")),
  budgetRange: z.string().max(120).optional().or(z.literal("")),
  photoStyle: z.string().min(8, "Please share a bit about the photos you are drawn to.").max(2500),
  website: z.string().optional().or(z.literal(""))
});

function getIpKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return "unknown";
}

const sessionTypeLabel: Record<z.infer<typeof sfInquirySchema>["sessionType"], string> = {
  engagement: "Engagement Session",
  portrait: "Portrait Session",
  "sf-city-hall": "SF City Hall Elopement/Engagement",
  "intimate-wedding": "Intimate Wedding"
};

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

  const parsed = sfInquirySchema.safeParse(payload);
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

  const subject = `New SF Session inquiry from ${parsed.data.name}`;
  const text = [
    "San Francisco Engagement & Portrait Sessions Lead",
    "",
    `Name: ${parsed.data.name}`,
    `Email: ${parsed.data.email}`,
    `Instagram: ${parsed.data.instagram}`,
    `Session Type: ${sessionTypeLabel[parsed.data.sessionType]}`,
    `Preferred Month/Date: ${parsed.data.preferredDate}`,
    `Location Idea: ${parsed.data.locationIdea || "N/A"}`,
    `Budget Range: ${parsed.data.budgetRange || "N/A"}`,
    "",
    "What they are drawn to:",
    parsed.data.photoStyle
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
