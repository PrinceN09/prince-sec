import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Section labelledBy="nf-title" spacing="none">
      <Container className="flex min-h-svh flex-col justify-center pb-24 pt-[calc(var(--header-h)+2rem)]">
        <p className="font-mono text-[0.8125rem] uppercase tracking-[0.14em] text-fg-3">
          Error 404
        </p>
        <h1 id="nf-title" className="mt-6 text-display text-fg">
          Page not found<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-md text-lead text-fg-2">
          That address does not exist here, or the page is still being built.
        </p>
        <div className="mt-10">
          <Link href="/" className={buttonClasses("primary", "md", "btn")}>
            Back to home
            <ArrowIcon />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
