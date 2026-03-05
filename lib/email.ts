interface InquiryEmailInput {
  to: string;
  from: string;
  subject: string;
  text: string;
}

export async function sendInquiryEmail(input: InquiryEmailInput): Promise<void> {
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing EMAIL_PROVIDER_API_KEY.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: input.from,
      to: [input.to],
      subject: input.subject,
      text: input.text
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Email provider failed: ${text}`);
  }
}
