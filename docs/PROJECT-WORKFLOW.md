# Project Workflow — From Zero to Live
Applies to every project in the portfolio. Follow in order.

---

## PHASE 0 — PROJECT SETUP
*Before writing a single line of code*

### Repository & Tooling
- [ ] Create GitHub repo (private) — `christianbayona07/project-name`
- [ ] Initialize Next.js + TypeScript + Tailwind
- [ ] Set up `.env.local` template with all required keys
- [ ] Configure ESLint + Prettier
- [ ] Add to Mission Control (project + tasks + agents)
- [ ] Create Supabase project — get DB URL and anon key
- [ ] Set up Vercel project linked to GitHub repo
- [ ] Set up Railway project for backend (if needed)

### Business Setup
- [ ] Register business name / LLC (if not already)
- [ ] Open dedicated business bank account
- [ ] Create Stripe account (or sub-account per product)
- [ ] Register domain name
- [ ] Set up business email (e.g. hello@projectname.com)

---

## PHASE 1 — DEMO / PROTOTYPE
*Goal: something clickable in 1-3 days*

### What to Build
- [ ] Core UI screens (no real backend needed)
- [ ] Hardcoded mock data — show the vision, not the plumbing
- [ ] Mobile-responsive from day one
- [ ] Deployed to Vercel with a real URL (not localhost)

### Definition of Done
- [ ] Can demo to a potential customer or investor in 5 minutes
- [ ] Covers the 2-3 core user flows end to end
- [ ] Looks production-quality (design matters here)

---

## PHASE 2 — MVP DEVELOPMENT
*Goal: real users can use it end to end*

### Backend
- [ ] Supabase schema designed and migrated
- [ ] Row Level Security (RLS) policies set
- [ ] API routes built and tested (REST or GraphQL)
- [ ] Authentication flow complete (Supabase Auth)
- [ ] File storage configured (Supabase Storage or Cloudinary)
- [ ] Error handling and input validation on all endpoints

### Frontend
- [ ] All MVP screens built and connected to real API
- [ ] Auth flow: sign up, log in, log out, password reset
- [ ] Loading states, error states, empty states on every screen
- [ ] Mobile-responsive tested on iOS and Android browsers
- [ ] Form validation on all user inputs

### Payments (Stripe)
- [ ] Stripe account connected to project
- [ ] Products and pricing created in Stripe dashboard
- [ ] Checkout flow implemented and tested
- [ ] Webhooks set up for payment events
- [ ] Test mode verified end-to-end before going live

### Notifications
- [ ] SendGrid configured — transactional emails (confirm, reset, receipt)
- [ ] Twilio configured — SMS alerts (if applicable)
- [ ] Email templates designed and tested
- [ ] Unsubscribe / opt-out flow in place

### Testing
- [ ] Core user flows manually tested end-to-end
- [ ] Edge cases covered (empty inputs, failed payments, expired sessions)
- [ ] Tested on Chrome, Safari, Firefox
- [ ] Tested on mobile (iOS Safari + Android Chrome)

---

## PHASE 3 — EXTERNAL INTEGRATIONS
*Project-specific — connect all third-party services*

### Per Project Checklist (add specifics)
- [ ] All API keys obtained and stored in environment variables
- [ ] OAuth apps registered (Google, LinkedIn, Meta, etc.)
- [ ] Webhooks registered and verified
- [ ] Rate limits documented and handled in code
- [ ] Fallback behavior when third-party APIs are down
- [ ] API costs estimated and within budget

---

## PHASE 4 — SECURITY & COMPLIANCE
*Non-negotiable before any real user touches it*

### Security
- [ ] All environment variables in `.env` — never in code
- [ ] HTTPS enforced (Vercel handles this automatically)
- [ ] Supabase RLS enabled on all tables
- [ ] Input sanitization on all user-facing fields
- [ ] File upload validation (type, size limits)
- [ ] Rate limiting on API routes
- [ ] CORS configured correctly
- [ ] Dependency audit — `npm audit` clean

### Data & Privacy (GDPR / CCPA basics)
- [ ] Only collect data you actually need
- [ ] User data deletion flow implemented
- [ ] Cookies: only set what's necessary
- [ ] Cookie consent banner (if using tracking/analytics)
- [ ] Data retention policy defined

---

## PHASE 5 — LEGAL & BUSINESS REQUIREMENTS
*Required before accepting real money or real users*

### Legal Documents (required)
- [ ] **Terms of Service** — defines rules, user responsibilities, liability limits
- [ ] **Privacy Policy** — what data you collect, how it's used, how it's stored
- [ ] **Cookie Policy** — if using cookies beyond strictly necessary ones
- [ ] **Refund Policy** — if selling subscriptions or products
- [ ] **Acceptable Use Policy** — for platforms with user-generated content

### Platform-Specific (add as needed)
- [ ] **Marketplace Terms** — for RentAnything, NestMatch (buyer/seller rules)
- [ ] **SaaS Agreement** — for B2B products (CompeteIQ, RentFlow, InspectPro)
- [ ] **White-label License Agreement** — for InspectPro, RentFlow clients
- [ ] **Data Processing Agreement (DPA)** — if handling EU user data

### Where to Get Them
- Use a lawyer for anything involving liability, IP, or complex marketplace rules
- TermsFeed / Termly for standard templates (Privacy Policy, ToS) — fast and affordable
- Store all legal docs at `/legal` route on the app and link in footer

### Business Requirements
- [ ] Stripe account fully verified (business details, bank account)
- [ ] Tax settings configured in Stripe (collect tax where required)
- [ ] Business entity registered (if accepting payments as a business)
- [ ] Domain email set up and linked to SendGrid
- [ ] Support channel ready (email or chat — before launch)

---

## PHASE 6 — PRE-LAUNCH CHECKLIST
*Final checks before flipping the switch*

### Performance
- [ ] Lighthouse score > 85 on mobile and desktop
- [ ] Images optimized (Next.js Image component)
- [ ] No console errors in production build
- [ ] Page load < 3 seconds on mobile

### SEO & Discoverability
- [ ] Title tags and meta descriptions on all pages
- [ ] OG image for social sharing
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Google Search Console connected

### Monitoring & Observability
- [ ] Sentry connected — error tracking live
- [ ] PostHog connected — user analytics live
- [ ] Uptime monitor set up (Better Uptime or UptimeRobot — free tier)
- [ ] PM2 or hosting auto-restart configured
- [ ] Alerts set up for downtime and error spikes

### Final QA
- [ ] Full end-to-end test with a real user account
- [ ] Payment flow tested with real card (small amount)
- [ ] All legal pages live and linked in footer
- [ ] Support email monitored
- [ ] 404 page exists and looks good
- [ ] All social/marketing links work

---

## PHASE 7 — LAUNCH
- [ ] Flip environment from staging to production
- [ ] Announce on chosen channels
- [ ] Monitor Sentry + PostHog for first 48 hours
- [ ] Be ready to hotfix same day if critical issues arise
- [ ] Gather first user feedback immediately

---

## PHASE 8 — POST-LAUNCH
- [ ] Review first week metrics (signups, activation, drop-off)
- [ ] Fix top 3 friction points from user feedback
- [ ] Set up weekly review cadence in Mission Control
- [ ] Begin planning next milestone

---

*This workflow lives in Mission Control docs. Update it as we learn.*
