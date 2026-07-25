# Get your API keys (one-time, ~20 minutes total)

These are **official Meta and LinkedIn APIs** on your own accounts — the durable path, not a free-tier trick. Do this once; the tokens then power automated posting.

---

## Instagram (Meta Graph API) — ~15 min

**Prerequisites:** your Instagram (@notavc.co) must be a **Professional account** (free: Instagram app → Settings → Account type → switch to Creator or Business).

1. Go to https://developers.facebook.com → **Create App** → type "Business" → name it `NotAVC Publisher`.
2. In the app dashboard, add the product **"Instagram"** → choose **"API setup with Instagram login"**.
3. Under **Generate access tokens**, click **Add account** → log in with @notavc.co → approve. Copy the **access token** shown (this is a long-lived token, ~60 days).
4. Copy your **Instagram account ID** shown next to the account (a long number).
5. Save both — that's it. Your app works in "development mode" for your own account without any Meta review.

```
IG_USER_ID = <the long number>
IG_TOKEN   = <the access token>
```

**Test it** (from `NotAVC-HQ/automation/`):
```
set IG_USER_ID=... && set IG_TOKEN=... && node instagram-publish.mjs image "https://<public-image-url>.jpg" "Test post #NotAVC"
```

**Two things to know**
- Image/video URLs must be **public https URLs**. Once the site is on Vercel, drop slide images into `site/public/posts/` and push — they're instantly hosted at `https://<your-site>/posts/...`. (Google Drive links do NOT work here.)
- Token expires ~every 60 days — refresh from the same dashboard page. Tell Claude "refresh my IG token flow" if you want this automated.

## LinkedIn (Share on LinkedIn API) — ~10 min

1. Go to https://developer.linkedin.com → **Create app** (needs a LinkedIn Page — create a free "NotAVC" company page if you don't have one).
2. In the app → **Products** tab → request **"Share on LinkedIn"** and **"Sign In with LinkedIn using OpenID Connect"** (both are instant self-serve approvals).
3. **Auth** tab → OAuth 2.0 tools (top right: "OAuth token generator") → generate a token with scopes `openid profile w_member_social`.
4. Get your person ID: `curl -H "Authorization: Bearer <token>" https://api.linkedin.com/v2/userinfo` → copy the `"sub"` value.

```
LI_TOKEN     = <the token>
LI_PERSON_ID = <the sub value>
```

**Test it:**
```
set LI_TOKEN=... && set LI_PERSON_ID=... && node linkedin-publish.mjs "Testing the NotAVC pipeline. #NotAVC"
```

## After you have the keys

Tell Claude: **"keys are ready, wire up scheduled posting."** Then the plan is:
1. Store keys as environment secrets (never in git — `automation/.env` is gitignored).
2. Extend the daily routine (or a second routine at your posting windows) to call these scripts: LinkedIn text post at ~9:00 AM IST, Instagram carousel/reel at ~1:00 PM IST.
3. Keep the human gate as long as you want it: the routine can post only platters you've marked "Approved" in the Drive doc — or go fully automatic when you trust it.

Until then, everything works manually: the platter arrives daily, you paste and post.
