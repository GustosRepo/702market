type ApplicationConfirmationEmail = {
  to: string;
  firstName: string;
  businessName: string;
  eventTitle: string;
  eventDate: string;
  applicationType: "vendor" | "food";
  referenceCode: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendApplicationConfirmationEmail(
  confirmation: ApplicationConfirmationEmail,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.APPLICATION_FROM_EMAIL;

  if (!apiKey || !from) {
    return { sent: false, reason: "not_configured" as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [confirmation.to],
      subject: `MarketElla application received · ${confirmation.referenceCode}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#050304">
          <h1>Application received</h1>
          <p>Hi ${escapeHtml(confirmation.firstName)},</p>
          <p>We received the ${confirmation.applicationType === "food" ? "food vendor" : "general vendor"} application for <strong>${escapeHtml(confirmation.businessName)}</strong>.</p>
          <p><strong>Event:</strong> ${escapeHtml(confirmation.eventTitle)}<br />
          <strong>Date:</strong> ${escapeHtml(confirmation.eventDate)}<br />
          <strong>Reference:</strong> ${escapeHtml(confirmation.referenceCode)}</p>
          <p>Submitting an application does not automatically mean acceptance. The MarketElla team will review it and follow up.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`Confirmation email failed with status ${response.status}.`);
  }

  return { sent: true as const };
}
