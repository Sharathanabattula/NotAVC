import { Wordmark } from "./Logo";

const LINKS = [
  { href: "#thesis", label: "Thesis" },
  { href: "#analyst", label: "Analyst" },
  { href: "#desks", label: "Desks" },
  { href: "#teardowns", label: "Teardowns" },
  { href: "#signal", label: "Signal" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="zone mx-auto flex max-w-7xl items-center justify-between border-b border-rule px-5 py-4 backdrop-blur-md sm:px-8">
        <a href="#top" aria-label="NotAVC — back to top">
          <Wordmark className="text-xl" />
        </a>
        <nav className="voice-kicker zone hidden items-center gap-7 text-muted sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="zone transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <span className="voice-kicker zone text-accent">EST. 2026</span>
      </div>
    </header>
  );
}
