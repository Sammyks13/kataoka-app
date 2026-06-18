// Vercel serverless function — handles Google OAuth2 token exchange server-side
// so the client secret never reaches the browser. Deployed automatically by
// Vercel because it lives in /api.
//
// Required Vercel env var: GHEALTH_CLIENT_SECRET
// (Project Settings -> Environment Variables -> Production/Preview/Development)

const CLIENT_ID = "1096396435654-e21c0p9eqor0nmb62qn6r3g6j7pd4lgu.apps.googleusercontent.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const clientSecret = process.env.GHEALTH_CLIENT_SECRET;
  if (!clientSecret) {
    res.status(500).json({ error: "Server misconfigured: GHEALTH_CLIENT_SECRET not set" });
    return;
  }

  const { grant_type, code, code_verifier, redirect_uri, refresh_token } = req.body || {};

  let body;
  if (grant_type === "authorization_code") {
    if (!code || !code_verifier || !redirect_uri) {
      res.status(400).json({ error: "Missing required fields for authorization_code grant" });
      return;
    }
    body = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: clientSecret,
      code,
      code_verifier,
      grant_type: "authorization_code",
      redirect_uri,
    });
  } else if (grant_type === "refresh_token") {
    if (!refresh_token) {
      res.status(400).json({ error: "Missing refresh_token" });
      return;
    }
    body = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: clientSecret,
      refresh_token,
      grant_type: "refresh_token",
    });
  } else {
    res.status(400).json({ error: "Unsupported grant_type" });
    return;
  }

  try {
    const googleRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const data = await googleRes.json();
    if (!googleRes.ok) {
      res.status(googleRes.status).json(data);
      return;
    }
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: "Failed to reach Google token endpoint", detail: String(e) });
  }
}
