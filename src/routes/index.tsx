import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, GaugeCircle, Layers, Repeat } from "lucide-react";

import dashboardPreview from "@/assets/dashboard-preview.jpg";
import { HeroLine } from "@/components/BallastMarks";
import { CountUp, Reveal } from "@/components/Reveal";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ballast — Automated Capital Control for Volatile Markets" },
      {
        name: "description",
        content:
          "Ballast keeps a balance sheet steady: real-time capital allocation, automated risk controls and a decision dashboard for volatile markets.",
      },
      { property: "og:title", content: "Ballast — Automated Capital Control" },
      {
        property: "og:description",
        content:
          "Real-time capital allocation, automated risk controls and scenario simulation for financial institutions.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Layers,
    title: "Optimization Engine",
    body: "Risk-adjusted capital allocation across asset classes under live liquidity constraints.",
  },
  {
    icon: GaugeCircle,
    title: "Real-Time Risk Controls",
    body: "Automatic detection and response to threshold breaches and sudden market shocks.",
  },
  {
    icon: Activity,
    title: "Decision Dashboard",
    body: "Visualize exposure, understand every system decision and run scenario simulations.",
  },
  {
    icon: Repeat,
    title: "Dynamic Rebalancing",
    body: "Adjusts allocations continuously without incurring unnecessary transaction penalties.",
  },
];

const steps = [
  { n: "01", title: "Define your portfolio", body: "Connect or describe positions and asset classes." },
  { n: "02", title: "Set thresholds", body: "Risk limits, liquidity floors and rebalancing constraints." },
  { n: "03", title: "Ballast takes the helm", body: "Continuous monitoring and automatic rebalancing." },
  { n: "04", title: "Review and simulate", body: "Audit decisions and run what-if market shocks." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      <main>
        <section className="mesh-bg relative overflow-hidden px-5 pb-28 pt-40">
          <HeroLine />
          <div className="relative mx-auto max-w-4xl text-center">
            <Reveal>
              <span className="glass num rounded-full px-3 py-1 text-xs tracking-wide text-primary">
                Stability, automated.
              </span>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-6xl">
                Automated Capital Control for{" "}
                <span className="text-primary">Volatile Markets</span>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
                Ballast continuously reallocates capital and enforces risk limits in real time, so
                your balance sheet stays steady when markets don't.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="glow-hover">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#preview">See Live Dashboard</a>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="product" className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="glass h-full rounded-2xl p-7">
                <h2 className="text-xl font-semibold text-warning">The problem</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Manual rebalancing runs on a calendar, not on the market. Static risk controls are
                  set once and reviewed quarterly. When volatility spikes, exposure drifts past its
                  limits for hours or days before anyone reacts — and the corrections are expensive.
                </p>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className="glass h-full rounded-2xl p-7">
                <h2 className="text-xl font-semibold text-primary">The Ballast answer</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  A continuous optimization loop that reallocates capital under live constraints,
                  automated safeguards that act the moment a threshold breaks, and a decision
                  dashboard that shows exactly what the system did and why.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 110}>
                <div className="glass glow-hover h-full rounded-2xl p-6">
                  <f.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold">How it works</h2>
          </Reveal>
          <div className="relative mt-14">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent lg:block" />
            <div className="grid gap-8 lg:grid-cols-4">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 150}>
                  <div className="relative">
                    <div className="num flex h-12 w-12 items-center justify-center rounded-full border border-primary/50 bg-background text-sm text-primary">
                      {s.n}
                    </div>
                    <h3 className="mt-5 text-base font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="preview" className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold">Your decision dashboard</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
              Exposure, alerts and automated actions in one control surface.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="glass mt-10 overflow-hidden rounded-2xl p-3">
              <div className="flex items-center gap-2 px-3 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
              </div>
              <img
                src={dashboardPreview}
                alt="Ballast dashboard showing portfolio exposure, risk alerts and allocation charts"
                width={1536}
                height={960}
                loading="lazy"
                className="w-full rounded-xl"
              />
            </div>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { v: 0.4, suffix: "s", label: "Median rebalance latency", decimals: 1 },
              { v: 100, suffix: "%", label: "Alerts raised in real time", decimals: 0 },
              { v: 0, suffix: "", label: "Penalty-driven trades", decimals: 0 },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 140}>
                <div className="glass rounded-2xl p-7 text-center">
                  <div className="text-4xl font-semibold text-primary">
                    <CountUp to={s.v} suffix={s.suffix} decimals={s.decimals} />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mesh-bg px-5 py-24">
          <Reveal>
            <div className="glass mx-auto max-w-3xl rounded-3xl p-12 text-center">
              <h2 className="text-3xl font-semibold">Balance your capital. Control your risk.</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Bring the ballast to your balance sheet — in real time.
              </p>
              <Button asChild size="lg" className="glow-hover mt-8">
                <Link to="/signup">Sign Up Free</Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
