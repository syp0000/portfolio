import { shotImages, shotDims } from "@/lib/shots";
import { DeviceFrame, frameKind } from "./Frames";

function Shot({
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
    <DeviceFrame kind={frameKind(file)} className={className} style={style}>
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
    </DeviceFrame>
  );
}

/**
 * Three real product screenshots, overlapping, each in the device it came from.
 * Space is reserved with an aspect ratio box so nothing shifts on load.
 */
export function HeroCollage() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      <div className="relative aspect-[5/4.6] w-full">
        <Shot
          file="ec-01-insights.jpg"
          alt="Event Compass campus insights dashboard"
          className="collage-in absolute left-0 top-0 w-[82%] -rotate-3"
          style={{ animationDelay: "0ms" }}
        />
        <Shot
          file="pa-01-pantry.jpg"
          alt="Pantry AI pantry inventory screen"
          className="collage-in absolute bottom-[6%] right-0 w-[64%] rotate-[4deg]"
          style={{ animationDelay: "80ms" }}
        />
        <Shot
          file="ncr-01-form.jpg"
          alt="NCR Assistant reporting form on a phone"
          className="collage-in absolute bottom-0 left-[14%] z-10 w-[30%] rotate-[1.5deg]"
          style={{ animationDelay: "160ms" }}
        />
      </div>
    </div>
  );
}
