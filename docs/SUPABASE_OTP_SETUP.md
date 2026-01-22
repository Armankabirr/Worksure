# Supabase OTP Setup (6-Digit Code Instead of Magic Link)

The app uses **signInWithOtp** for signup (email + OTP → set password → profile). Supabase sends that email via the **Magic Link** template. By default it contains a link; to send a **6-digit OTP** instead, update that template.

## Steps

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Authentication** → **Email Templates**.
3. Select **Magic Link**.
4. Replace the template body so it uses `{{ .Token }}` (the 6-digit OTP) instead of a link.

### Example (OTP only)

**Subject:** `Your login code`

**Body:**

```html
<h2>Your verification code</h2>
<p>Enter this 6-digit code in the app:</p>
<p style="font-size:24px;font-weight:bold;letter-spacing:4px;">{{ .Token }}</p>
<p>This code expires in 1 hour.</p>
```

- **Do not** use `{{ .ConfirmationURL }}` or `{{ .TokenHash }}` in the body if you want OTP-only (no link).
- **Do** use `{{ .Token }}` for the 6-digit code.

5. Save the template.

## Resend / rate limits

- Users can request a new code about once every 60 seconds (configurable under **Auth** → **Rate Limits**).
- OTP expiry is typically 1 hour (configurable under **Auth** → **Email**).

## After updating

Signup will send the 6-digit OTP to the user’s email. They enter it in the app to verify; no magic link is used.
