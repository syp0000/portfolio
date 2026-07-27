import { shotImages, shotDims } from "@/lib/shots";

function BrowserFrame({
  file,
  alt,
  className = "",
  style,
}: {
  file: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const dims = shotDims[file];
  return (
    <div
      className={`overflow-hidden rounded-lg border border-hairline bg-card shadow-[0_28px_60px_-30px_color-mix(in_oklab,var(--color-foreground)_45%,transparent)] ${className}`}
      style={style}
    >
      <div className="flex items-center gap-1.5 border-b border-hairline bg-surface px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
      </div>
      <img
        src={shotImages[file]}
        alt={alt}
        width={dims?.w}
        height={dims?.h}
        loading="eager"
        
        fetchPriority="high"
        decoding="async"
        className="block h-auto w-full object-cover"
      />
    </div>
  );
}

function PhoneFrame({
  file,
  alt,
  className = "",
  style,
}: {
  file: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const dims = shotDims[file];
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-hairline bg-card p-1.5 shadow-[0_30px_70px_-30px_color-mix(in_oklab,var(--color-foreground)_55%,transparent)] ${className}`}
      style={style}
    >
      <img
        src={shotImages[file]}
        alt={alt}
        width={dims?.w}
        height={dims?.h}
        loading="eager"
        
        fetchPriority="high"
        decoding="async"
        className="block h-auto w-full rounded-xl object-cover"
      />
    </div>
  );
}

/**
 * Three real product screenshots, overlapping, in minimal frames.
 * Space is reserved with an aspect ratio box so nothing shifts on load.
 */
export function HeroCollage() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      <div className="relative aspect-[5/4.6] w-full">
        <BrowserFrame
          file="ec-01-insights.jpg"
          alt="Event Compass campus insights dashboard"
          className="collage-in absolute left-0 top-0 w-[82%] -rotate-3"
          style={{ animationDelay: "0ms" }}
        />
        <BrowserFrame
          file="pa-01-pantry.jpg"
          alt="Pantry AI pantry inventory screen"
          className="collage-in absolute bottom-[6%] right-0 w-[64%] rotate-[4deg]"
          style={{ animationDelay: "80ms" }}
        />
        <PhoneFrame
          file="ncr-01-form.jpg"
          alt="NCR Assistant reporting form on a phone"
          className="collage-in absolute bottom-0 left-[14%] z-10 w-[30%] rotate-[1.5deg]"
          style={{ animationDelay: "160ms" }}
        />
      </div>
    </div>
  );
}
