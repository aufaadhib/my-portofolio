"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";

type Certificate = {
  title: string;
  image: string;
  document: string;
};

/** Renders an accessible native horizontal gallery for certificate documents. */
export function CertificateSlider({
  certificates,
  locale,
  homeMotion = true,
}: {
  certificates: Certificate[];
  locale: "id" | "en";
  homeMotion?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, scrollLeft: 0, moved: false });
  const move = (direction: -1 | 1) =>
    track.current?.scrollBy({
      left: direction * track.current.clientWidth * 0.78,
      behavior: "smooth",
    });
  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const element = track.current;
    if (!element) return;
    drag.current = { startX: event.clientX, scrollLeft: element.scrollLeft, moved: false };
    element.setPointerCapture(event.pointerId);
    element.classList.add("is-dragging");
  };
  const updateDrag = (event: PointerEvent<HTMLDivElement>) => {
    const element = track.current;
    if (!element?.hasPointerCapture(event.pointerId)) return;
    const distance = event.clientX - drag.current.startX;
    drag.current.moved ||= Math.abs(distance) > 6;
    element.scrollLeft = drag.current.scrollLeft - distance;
  };
  const stopDrag = (event: PointerEvent<HTMLDivElement>) => {
    const element = track.current;
    if (!element?.hasPointerCapture(event.pointerId)) return;
    element.releasePointerCapture(event.pointerId);
    element.classList.remove("is-dragging");
    setTimeout(() => {
      drag.current.moved = false;
    });
  };

  return (
    <section
      className="certificate-gallery"
      aria-label={locale === "en" ? "Certificates" : "Sertifikat"}
      data-home-certificates={homeMotion ? true : undefined}
      data-reveal={homeMotion ? undefined : true}
    >
      <div className="certificate-toolbar">
        <p className="eyebrow">{locale === "en" ? "Certificates" : "Sertifikat"}</p>
        <div className="certificate-controls">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={locale === "en" ? "Previous certificates" : "Sertifikat sebelumnya"}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={locale === "en" ? "Next certificates" : "Sertifikat berikutnya"}
          >
            →
          </button>
        </div>
      </div>
      <div
        className="certificate-track"
        ref={track}
        tabIndex={0}
        onPointerDown={startDrag}
        onPointerMove={updateDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onClickCapture={(event) => {
          if (drag.current.moved) event.preventDefault();
        }}
      >
        {certificates.map((certificate) => (
          <a
            key={certificate.document}
            className="certificate-card"
            href={certificate.document}
            target="_blank"
            rel="noreferrer"
            aria-label={`${certificate.title} (${locale === "en" ? "open PDF" : "buka PDF"})`}
            data-home-certificate={homeMotion ? true : undefined}
          >
            <Image
              src={certificate.image}
              alt={certificate.title}
              fill
              sizes="(max-width: 800px) 82vw, (max-width: 1200px) 46vw, 520px"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
