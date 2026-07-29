/*
  Transactional email via Resend.

  Chosen over Mailchimp because its free tier is capped on volume
  (3,000/month) rather than on contacts, so a growing list does not force an
  upgrade — and it does not expire.

  Every function fails soft and reports it. A signup must never 500 because
  the mail provider is down; the address is already saved by then.
*/

const API = "https://api.resend.com/emails";

function config() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM;
  return key && !key.startsWith("PASTE_") && from ? { key, from } : null;
}

export function emailConfigured() {
  return config() !== null;
}

async function send(to: string, subject: string, html: string, text: string) {
  const cfg = config();
  if (!cfg) return { ok: false, reason: "RESEND_API_KEY or NEWSLETTER_FROM not set" };

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: cfg.from, to, subject, html, text }),
    });
    if (!res.ok) return { ok: false, reason: `Resend ${res.status}: ${await res.text()}` };
    return { ok: true, reason: "" };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}

/* Wrapped in the brand's light canvas. Inline styles only — mail clients
   strip <style> blocks and have no support for custom properties. */
function shell(body: string) {
  return `<!doctype html><html><body style="margin:0;padding:32px 16px;background:#F2F1ED;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0B0B0B">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:520px;background:#FFFFFF;border:1px solid rgba(0,0,0,.12);border-radius:12px;padding:36px">
<tr><td>
<div style="font-size:20px;font-weight:800;letter-spacing:-0.5px;margin-bottom:28px">
<span style="opacity:.35">Not</span>AVC<span style="color:#710014">.</span>
</div>
${body}
</td></tr></table>
<div style="max-width:520px;margin-top:20px;font-size:12px;color:#888888;text-align:left">
NotAVC — not investment advice. Obviously.
</div>
</td></tr></table>
</body></html>`;
}

export function confirmEmail(confirmUrl: string) {
  const html = shell(`
<div style="font-size:24px;font-weight:700;line-height:1.3;margin-bottom:16px">One click and you're in.</div>
<p style="font-size:15px;line-height:1.6;color:#333;margin:0 0 28px">
You asked for The Wire — one startup torn down every Sunday. Confirm below and the first issue will land this weekend.
</p>
<a href="${confirmUrl}" style="display:inline-block;background:#710014;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:15px;font-weight:600">Confirm subscription</a>
<p style="font-size:13px;line-height:1.6;color:#888;margin:28px 0 0">
If you didn't sign up, ignore this — nothing happens without that click, and we won't email you again.
</p>`);

  const text = `One click and you're in.

You asked for The Wire — one startup torn down every Sunday.

Confirm: ${confirmUrl}

If you didn't sign up, ignore this. Nothing happens without that click.`;

  return { subject: "Confirm your subscription to The Wire", html, text };
}

export async function sendConfirmation(to: string, confirmUrl: string) {
  const { subject, html, text } = confirmEmail(confirmUrl);
  return send(to, subject, html, text);
}
