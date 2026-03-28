import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Target,
  MessageSquare,
  BarChart3,
  Zap,
  Link2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Autonomous Prospecting",
    description:
      "Identifies and engages ideal prospects based on your ICP. Personalized outreach at scale.",
  },
  {
    icon: MessageSquare,
    title: "Intelligent Follow-ups",
    description:
      "Context-aware follow-ups sent at optimal times. Never let a warm lead go cold.",
  },
  {
    icon: Zap,
    title: "Deal Intelligence",
    description:
      "Real-time insights on deal health, risk signals, and recommended next actions.",
  },
  {
    icon: BarChart3,
    title: "Pipeline Analytics",
    description:
      "Track pipeline velocity, conversion rates, and revenue forecasts in one dashboard.",
  },
  {
    icon: Link2,
    title: "CRM Integration",
    description:
      "Bi-directional sync with Salesforce, HubSpot, and all major CRMs out of the box.",
  },
  {
    icon: RefreshCw,
    title: "Continuous Learning",
    description:
      "Learns from your top performers and improves with every interaction.",
  },
];

const steps = [
  {
    number: "01",
    title: "Connect",
    description:
      "Link your CRM, email, and calendar. Selma integrates with your existing stack in minutes.",
  },
  {
    number: "02",
    title: "Configure",
    description:
      "Define your ideal customer profile, messaging tone, and engagement rules.",
  },
  {
    number: "03",
    title: "Activate",
    description:
      "Selma begins prospecting and nurturing leads autonomously. Your team focuses on closing.",
  },
];

const stats = [
  { value: "3x", label: "More qualified meetings booked per rep" },
  { value: "47%", label: "Faster average sales cycle" },
  { value: "12hrs", label: "Saved per rep every week" },
];

const tiers = [
  {
    name: "Starter",
    price: "$49",
    description: "For small teams getting started with AI sales",
    features: [
      "Up to 1,000 prospects/month",
      "Email sequences",
      "Basic analytics",
      "1 CRM integration",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "$99",
    description: "For scaling sales organizations",
    features: [
      "Up to 10,000 prospects/month",
      "Email + LinkedIn outreach",
      "Advanced analytics & reporting",
      "Unlimited CRM integrations",
      "Custom workflows",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large teams with custom needs",
    features: [
      "Unlimited prospects",
      "All outreach channels",
      "Custom integrations & API",
      "Dedicated success manager",
      "Enterprise SLA",
    ],
    popular: false,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div
        className="dot-grid fixed inset-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <span className="font-display text-xl italic text-amber-400">
              Selma
            </span>
            <div className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
              <a
                href="#features"
                className="transition-colors hover:text-zinc-100"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="transition-colors hover:text-zinc-100"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="transition-colors hover:text-zinc-100"
              >
                Pricing
              </a>
            </div>
          </div>
          <Link
            href="/session"
            className="inline-flex h-9 items-center justify-center rounded-full bg-amber-500 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-32 md:py-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.07] blur-[128px]"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="animate-fade-up border-amber-500/30 bg-amber-500/5 text-amber-400"
          >
            <Sparkles className="size-3" />
            Now in early access
          </Badge>
          <h1
            className="animate-fade-up mt-8 text-5xl font-medium leading-[1.08] tracking-tight text-zinc-100 md:text-7xl"
            style={{ animationDelay: "100ms" }}
          >
            Your AI Sales{" "}
            <span className="font-display italic text-amber-400">Agent</span>
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400"
            style={{ animationDelay: "200ms" }}
          >
            Selma handles prospecting, follow-ups, and deal intelligence so your
            team can focus on closing deals.
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/session"
              className="inline-flex h-12 items-center justify-center rounded-full bg-amber-500 px-8 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400"
            >
              Start Free Trial
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Button
              variant="outline"
              className="h-12 rounded-full px-8 text-sm"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/5 text-amber-400"
            >
              Features
            </Badge>
            <h2 className="mt-4 text-3xl font-medium tracking-tight text-zinc-100 md:text-4xl">
              Everything your sales team needs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Selma works around the clock to fill your pipeline, nurture
              prospects, and deliver actionable insights.
            </p>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-zinc-900/40 transition-colors hover:ring-amber-500/20"
              >
                <CardHeader>
                  <feature.icon className="mb-2 size-5 text-amber-400" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/5 text-amber-400"
            >
              How it works
            </Badge>
            <h2 className="mt-4 text-3xl font-medium tracking-tight text-zinc-100 md:text-4xl">
              Up and running in minutes
            </h2>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center md:text-left">
                <span className="font-mono text-sm text-amber-500/60">
                  {step.number}
                </span>
                <h3 className="mt-2 text-xl font-medium text-zinc-100">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="font-display text-5xl italic text-amber-400 md:text-6xl">
                {stat.value}
              </div>
              <p className="mt-2 text-sm text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/5 text-amber-400"
            >
              Pricing
            </Badge>
            <h2 className="mt-4 text-3xl font-medium tracking-tight text-zinc-100 md:text-4xl">
              Start closing more deals
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Simple, transparent pricing that scales with your team.
            </p>
          </div>
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={
                  tier.popular
                    ? "relative bg-zinc-900/60 ring-amber-500/30"
                    : "bg-zinc-900/40"
                }
              >
                {tier.popular && (
                  <Badge className="absolute -top-2.5 left-4 bg-amber-500 text-zinc-950">
                    Most popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div>
                    <span className="text-3xl font-semibold text-zinc-100">
                      {tier.price}
                    </span>
                    {tier.price !== "Custom" && (
                      <span className="text-sm text-zinc-500">/user/month</span>
                    )}
                  </div>
                  <Button
                    variant={tier.popular ? "default" : "outline"}
                    className={
                      tier.popular
                        ? "w-full bg-amber-500 text-zinc-950 hover:bg-amber-400"
                        : "w-full"
                    }
                  >
                    {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                  <Separator />
                  <ul className="space-y-3">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-sm text-zinc-300"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-amber-500/70" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:py-32">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/60 px-8 py-16 text-center md:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/[0.05] to-transparent"
          />
          <h2 className="relative text-3xl font-medium tracking-tight text-zinc-100 md:text-4xl">
            Ready to transform your pipeline?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-zinc-400">
            Join hundreds of sales teams already using Selma to close more
            deals, faster.
          </p>
          <div className="relative mt-8">
            <Link
              href="/session"
              className="inline-flex h-12 items-center justify-center rounded-full bg-amber-500 px-8 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400"
            >
              Start Free Trial
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <p className="mt-4 text-xs text-zinc-500">
              No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
          <div>
            <span className="font-display text-lg italic text-amber-400">
              Selma
            </span>
            <p className="mt-2 text-sm text-zinc-500">
              Your AI-powered sales agent.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-zinc-300">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-500">
              <li>
                <a href="#features" className="hover:text-zinc-300">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-zinc-300">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-300">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-300">
                  Changelog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-zinc-300">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-500">
              <li>
                <a href="#" className="hover:text-zinc-300">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-300">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-300">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-zinc-300">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-500">
              <li>
                <a href="#" className="hover:text-zinc-300">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-300">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-300">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="mx-auto mt-12 max-w-6xl" />
        <p className="mx-auto mt-8 max-w-6xl text-center text-xs text-zinc-600">
          &copy; 2026 Selma. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
