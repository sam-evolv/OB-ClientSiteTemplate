# Empire Gym - coaching purchase → onboarding flow (static)

These are the bespoke, Empire-only pages behind the "Train with Stephen"
purchase flow. They are plain static files (served from `/empire-gym/...`) so
they reproduce the design pack exactly and touch no other tenant.

## Files
- `onboarding.html` - SS Coaching client onboarding form. On submit it opens
  WhatsApp to Stephen (`wa.me/353879943270`) pre-filled, then redirects to
  `welcome.html`. Has email / copy fallbacks for clients without WhatsApp.
- `welcome.html` - "Welcome to SS Coaching"; downloads for both PDF packs +
  WhatsApp button.
- `media/ss-coaching-info-pack.pdf`, `media/ss-coaching-startup-pack.pdf` -
  the two coaching packs the welcome page serves.

The Empire logo is loaded from the `business-assets` bucket (same URL as the
marketing row), so no logo binary is duplicated here.

## The live flow
1. On the marketing site, the **Train with Stephen → "Start coaching"** service
   card links to the Stripe coaching checkout
   (`https://buy.stripe.com/14A7sL82N7Tr9Mb75r8IU0u`).
2. After payment, Stripe redirects the buyer to this onboarding form (see the
   one-time setup below).
3. The form hands off to WhatsApp and lands the client on `welcome.html` with
   the coaching packs.

The **"Already signed up? → Complete onboarding"** card links straight to
`/empire-gym/onboarding.html`, so the form is also reachable without going
through checkout.

## ⚠ One-time external setup (Stripe dashboard - cannot be done from code)
In the Stripe dashboard, open the **coaching** payment link
(`https://buy.stripe.com/14A7sL82N7Tr9Mb75r8IU0u`) → **After payment** →
**Redirect customers to your website**, and set the URL to:

```
https://www.empiregym.ie/empire-gym/onboarding.html
```

(The generic **membership** link needs no redirect.) Until this is set, buyers
still reach the form via the "Already signed up?" card; setting it makes the
hand-off automatic, exactly as designed.

## Optional later wiring (left as the design pack shipped it)
In `onboarding.html` `<script>` dev-config block:
- `SUBMIT_ENDPOINT` - set to an API URL to also email Stephen / save the
  submission (the form already POSTs `{coach, product, submittedAt, answers}`).
- `COACH_EMAIL` - Stephen's email for the "Email my answers" fallback.
