export function SectionHeading({
  index,
  title,
  detail,
  intro = false,
  homeMotion = false,
}: {
  index: string;
  title: string;
  detail?: string;
  intro?: boolean;
  homeMotion?: boolean;
}) {
  const motion = intro ? { "data-page-intro": true } : {};
  return (
    <div className="section-heading" data-reveal={intro || homeMotion ? undefined : true}>
      <div className="text-reveal">
        <p className="eyebrow" {...motion} data-home-reveal={homeMotion ? true : undefined}>
          {index}
        </p>
      </div>
      <div className="text-reveal">
        <h2 {...motion} data-home-reveal={homeMotion ? true : undefined}>
          {title}
        </h2>
      </div>
      {detail ? (
        <div className="text-reveal text-reveal-detail">
          <p
            className="section-detail"
            {...motion}
            data-home-reveal={homeMotion ? true : undefined}
          >
            {detail}
          </p>
        </div>
      ) : null}
    </div>
  );
}
