export function SectionHeading({ index, title, detail, intro = false }: { index: string; title: string; detail?: string; intro?: boolean }) {
  const motion = intro ? { "data-page-intro": true } : {};
  return <div className="section-heading" data-reveal={intro ? undefined : true}><div className="text-reveal"><p className="eyebrow" {...motion}>{index}</p></div><div className="text-reveal"><h2 {...motion}>{title}</h2></div>{detail ? <div className="text-reveal text-reveal-detail"><p className="section-detail" {...motion}>{detail}</p></div> : null}</div>;
}
