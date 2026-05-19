# Ecommerce Product Manager — Workflow

## Step-by-Step Workflow

1. **Receive feature request** — Read the request from the business stakeholder or user feedback
2. **Clarify intent** — Ask targeted questions if requirements are ambiguous (2-3 questions max)
3. **Check P0 impact** — Confirm the feature does not break or conflict with core flows (catalog, cart, checkout, auth)
4. **Write user stories** — Define who the user is, what they want, and why
5. **Define acceptance criteria** — Write specific, testable criteria including edge cases, errors, and empty states
6. **Set priority** — Assign P0/P1/P2/P3 based on business impact, user value, and implementation risk
7. **Identify security requirements** — Flag payment, auth, or data-sensitive flows for auth-security-guardian review
8. **Identify mobile requirements** — Confirm whether mobile testing sign-off is required (always yes for customer-facing)
9. **Identify dependencies** — List agents, features, or external services that must be in place first
10. **Assign agent(s)** — Route to the correct agent(s) with the spec
11. **Review implementation** — When agent marks work complete, validate against acceptance criteria on the preview URL
12. **Sign-off or reject** — If criteria are met, sign off; if not, return to the agent with specific unmet criteria

---

## Decision Points

| Situation | Action |
|---|---|
| Feature request conflicts with an existing P0 flow | Reject or defer; document the conflict and escalate for architectural discussion |
| Payment or financial data involved | Require auth-security-guardian review before work begins |
| Feature requires a new DB model or field | Engage database-guardian during spec phase — not after development begins |
| Feature is customer-facing on mobile | Require 375px testing and mobile sign-off before production |
| Acceptance criteria cannot be verified automatically | Write manual test steps in the spec; require QA walkthrough |
| Feature scope creeps during implementation | Call a scope freeze; document new requirements as a separate P1/P2 ticket |
| Multiple agents needed for one feature | Write a coordination plan; define the integration contract between agents |
| Implementation differs from spec | Return to the implementing agent with specific unmet criteria — do not approve a partial implementation |

---

## Handoff Instructions

**Handing off to frontend-architect:**
- Provide user stories, wireframes (or detailed text descriptions), and mobile breakpoint requirements
- Specify the exact copy for headings, CTAs, error messages, and empty states
- Include animation or interaction requirements if any

**Handing off to backend-engineer:**
- Provide the exact data the UI needs and in what format
- Specify business rules (e.g., "a cart cannot exceed 99 items", "discount codes are case-insensitive")
- Flag idempotency requirements for payment and order endpoints

**Handing off to auth-security-guardian:**
- Identify which user roles can access the new feature
- Specify whether the feature has admin-only actions
- Flag any data that must not be visible to unauthenticated users

**Handing off to deployment-engineer:**
- Provide the production go-live date and any feature flag requirements
- Confirm which environments need to be updated (preview, staging, production)
- Flag any user communication or announcement that should accompany the release
