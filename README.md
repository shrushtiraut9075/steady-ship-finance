# Ballast Capital Guard

# Lovable Build Prompt — "Ballast"



Copy everything below into Lovable as your project prompt (or split into a few messages if it's long — start with Part 1, then send Parts 2-4 as follow-ups so Lovable builds it in layers).



---



## Project Name & Concept



**Ballast** — as in the weight that keeps a ship stable in rough water. That's the metaphor: an automated capital allocation and risk-control engine that keeps a financial institution's balance sheet steady when markets get volatile.



Tagline options (pick one):

- "Stability, automated."

- "Balance your capital. Control your risk. In real time."

- "The ballast for volatile markets."



---



## Part 1 — Tech Stack & Foundation



Build a full-stack web app called **Ballast**:

- Frontend: React + Tailwind CSS, fully responsive

- Auth + Database: **Supabase** (email/password + Google OAuth sign-in, `users`, `portfolios`, `allocations`, `risk_alerts`, `scenarios` tables)

- Routing: public landing page at `/`, auth pages at `/signin` and `/signup`, protected `/dashboard` and its sub-routes, accessible only to authenticated users (redirect unauthenticated users back to `/signin`)

- State: persist Supabase session so refresh doesn't log the user out



---



## Part 2 — Design System (NOT purple — avoid generic AI-generated look)



**Color Palette — "Deep Ink & Signal Teal"**

- Background: near-black navy `#0B1120` (primary), `#111827` (secondary surfaces)

- Glass panels: `rgba(255,255,255,0.05)` with `backdrop-filter: blur(16px)` and a 1px `rgba(255,255,255,0.1)` border

- Primary accent: signal teal `#14E8B4` (used for CTAs, active states, positive metrics)

- Secondary accent: warm amber `#F5A623` (used for alerts, warnings, risk-threshold indicators)

- Danger: coral red `#FF5C5C` (breach alerts only)

- Text: off-white `#F5F7FA` for headings, `#94A3B8` slate-gray for body/secondary text



**Typography**

- Headings: "Space Grotesk" or "Sora" (geometric, modern, financial-tech feel)

- Body: "Inter"

- Numbers/data (dashboard metrics): "JetBrains Mono" or "IBM Plex Mono" for that terminal/trading-desk precision look



**Visual language**

- Glassmorphism cards throughout (frosted panels over a subtle animated gradient mesh background in navy/teal)

- Thin glowing teal line-charts and radial gauges as decorative motifs, not stock icons

- Avoid: purple/violet gradients, generic rocket/lightbulb icons, default shadcn purple accent



---



## Part 3 — Landing Page



**Navbar** (sticky, glassmorphism, shrinks slightly on scroll)

- Logo: "Ballast" wordmark with a small ballast/anchor-line glyph

- Links: Product, How It Works, Dashboard Preview, Pricing (optional), Docs

- Right side: **Sign In** (ghost button) + **Sign Up Free** (solid teal button)



**Hero Section**

- Large animated headline (staggered fade/slide-in on load): "Automated Capital Control for Volatile Markets"

- Subheadline explaining the product in one sentence

- Two CTAs: "Get Started" (→ signup) and "See Live Dashboard" (scrolls to preview section)

- Animated background: slow-moving gradient mesh + a subtle live-looking line chart animating across the hero



**Problem → Solution Section**

- Short block explaining the real problem: manual rebalancing and static risk controls break down in volatile markets

- Then Ballast's answer: real-time optimization + automated safeguards + a decision dashboard



**Features Section** (glass cards, scroll-triggered fade/slide-up, staggered)

1. **Optimization Engine** — risk-adjusted capital allocation across asset classes under liquidity constraints

2. **Real-Time Risk Controls** — automatic detection and response to threshold breaches and market shocks

3. **Decision Dashboard** — visualize exposure, understand system decisions, run scenario simulations

4. **Dynamic Rebalancing** — adjusts allocations without incurring unnecessary transaction penalties



**How It Works** (3–4 step horizontal timeline, animates in as you scroll, connected by an animated teal line)

1. Connect/define your portfolio

2. Set risk thresholds & constraints

3. Ballast monitors and rebalances automatically

4. Review decisions and run "what-if" scenarios on the dashboard



**Dashboard Preview Section**

- A mocked-up screenshot/illustration of the dashboard inside a glass browser-frame, gently parallax on scroll



**Stats / Trust Section**

- 3–4 animated counters (count-up on scroll into view), e.g. "Sub-second rebalancing," "Real-time alerting," "Zero-penalty rebalancing logic"



**Final CTA Section**

- Bold repeat of the value prop + Sign Up button, glass panel over the gradient mesh



**Footer**

- Columns: Product (Features, Dashboard, Pricing) · Company (About, Contact) · Resources (Docs, GitHub repo) · Legal (Privacy, Terms)

- Bottom bar: "© 2026 Ballast. Built for [Hackathon Name]." + social icons

- Keep it on the same dark navy with a thin teal top border, not a separate white block



**Motion requirements**

- Smooth scrolling (`scroll-behavior: smooth` + easing on anchor links)

- Scroll-triggered reveal animations (fade + slight translate-Y) on every section using an intersection observer

- Micro-interactions: buttons scale slightly on hover with a soft teal glow shadow, nav links underline-animate on hover



---



## Part 4 — Auth Flow & Dashboard



**Sign Up (`/signup`)**

- Glass card, centered on the gradient background

- Fields: Full name, Email, Password, Confirm Password

- "Sign up with Google" via Supabase OAuth

- On success → insert user profile row → redirect to `/dashboard`



**Sign In (`/signin`)**

- Glass card: Email, Password, "Forgot password?" link, Google OAuth

- On success → redirect to `/dashboard`



**Dashboard (`/dashboard`, protected)**

- Sidebar nav (glass, collapsible): Overview, Allocations, Risk Alerts, Scenario Simulator, Settings

- **Overview**: portfolio value, current allocation breakdown (donut chart, teal/amber/coral segments), risk-exposure gauge, recent automated actions log

- **Allocations**: table/chart of asset classes vs. target vs. current weights, rebalance history

- **Risk Alerts**: live list of threshold breaches/warnings with severity color coding (teal=ok, amber=warning, coral=breach), timestamp, and what action the system took

- **Scenario Simulator**: form to input a hypothetical market shock (e.g. "-15% equities") and see a simulated impact on allocation and triggered controls

- Top bar: user avatar/name (pulled from Supabase), logout button



--

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://steady-ship-finance.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e06aaad6-8c5f-4ce7-9dcf-3b00054fc903).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
