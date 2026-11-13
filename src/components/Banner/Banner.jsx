import React from "react";

const VIDEO_URL =
  "https://res.cloudinary.com/fhsrf5ps/video/upload/v1791397402/vdofile.mp4";

const GOLD = "#c9a45c";
const CREAM = "#f1e6d3";

const icon = {
  width: 44,
  height: 44,
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: GOLD,
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const FEATURES = [
  {
    title: "Premium Quality",
    text: "Finest materials & exceptional craftsmanship",
    svg: (
      <svg {...icon}>
        <path d="M14 8h20l8 11-18 22L6 19z" />
        <path d="M6 19h36M18 8l-4 11 10 22 10-22-4-11M24 41 14 19M24 41l10-22" />
      </svg>
    ),
  },
  {
    title: "Manufacturing Excellence",
    text: "Advanced technology & skilled expertise",
    svg: (
      <svg {...icon}>
        <path d="M6 12h28a4 4 0 0 1 4 4v4h4v18H12a6 6 0 0 1-6-6z" />
        <path d="M6 20h22v8H6M16 12V8h8M30 38v-6M38 20v10" />
        <circle cx="34" cy="26" r="2" />
      </svg>
    ),
  },
  {
    title: "Global Standards",
    text: "International quality & ethical production",
    svg: (
      <svg {...icon}>
        <circle cx="24" cy="24" r="17" />
        <ellipse cx="24" cy="24" rx="7" ry="17" />
        <path d="M7 24h34M10 14h28M10 34h28" />
      </svg>
    ),
  },
  {
    title: "Sustainable Future",
    text: "Responsible practices for a better tomorrow",
    svg: (
      <svg {...icon}>
        <path d="M10 38C8 22 18 8 40 8c0 22-12 32-26 30" />
        <path d="M8 42 28 22M20 30h-8M26 24h-6M30 18v-6" />
      </svg>
    ),
  },
];

export default function Banner() {
  return (
    <section
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-black text-white"
      aria-label="Luxury fashion house hero"
    >
      {/* Background video */}
      <video
        className="absolute inset-0 -z-30 h-full w-full object-cover object-[72%_center] md:object-center"
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Overlays: left darkening, bottom fade, top fade */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,.92) 0%, rgba(0,0,0,.7) 32%, rgba(0,0,0,.2) 60%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div
        className="absolute inset-0 -z-20 md:hidden"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,.96) 0%, rgba(0,0,0,.85) 40%, rgba(0,0,0,.2) 70%, rgba(0,0,0,.35) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-20 h-1/3"
        style={{
          background: "linear-gradient(0deg, rgba(0,0,0,.95), rgba(0,0,0,0))",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 -z-20 h-1/5"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,.7), rgba(0,0,0,0))",
        }}
      />

      {/* Hero copy */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-end px-6 pb-10 pt-[42vh] sm:px-10 md:items-center md:pb-0 md:pt-28 lg:px-16">
        <div className="max-w-[640px]">
          <p
            className="text-xs font-medium uppercase tracking-[0.28em] sm:text-sm"
            style={{ color: GOLD }}
          >
            Luxury Fashion House
          </p>
          <span
            className="mt-4 block h-px w-20"
            style={{ backgroundColor: GOLD }}
          />

          <h1
            className="mt-6 text-[2.6rem] font-normal leading-[1.05] sm:text-6xl lg:text-7xl xl:text-[5.2rem]"
            style={{
              color: CREAM,
              fontFamily:
                '"Cormorant Garamond","Playfair Display",Georgia,"Times New Roman",serif',
            }}
          >
            Crafting Timeless
            <br />
            Elegance
          </h1>

          <span
            className="mt-6 block h-px w-20"
            style={{ backgroundColor: GOLD }}
          />

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
            Premium garment manufacturing for global brands with exceptional
            craftsmanship.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#collection"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-black transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              style={{ backgroundColor: CREAM }}
            >
              Explore Collection
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12h16M14 6l6 6-6 6" />
              </svg>
            </a>
            <a
              href="#capabilities"
              className="inline-flex items-center justify-center border px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              style={{ borderColor: GOLD, color: CREAM }}
            >
              Our Capabilities
            </a>
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-8 sm:px-10 lg:px-16">
        <ul className="grid grid-cols-1 gap-6 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:border-t-0 lg:pt-0">
          {FEATURES.map((f, i) => (
            <li
              key={f.title}
              className={`flex items-start gap-4 lg:px-8 ${
                i > 0 ? "lg:border-l lg:border-white/10" : "lg:pl-0"
              }`}
            >
              <span className="mt-1 shrink-0">{f.svg}</span>
              <div>
                <h3
                  className="text-xs font-medium uppercase tracking-[0.14em] sm:text-sm"
                  style={{ color: GOLD }}
                >
                  {f.title}
                </h3>
                <p className="mt-1 text-sm leading-snug text-white/65">
                  {f.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}