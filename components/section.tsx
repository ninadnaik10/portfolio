export function Section({
  children,
  id,
  index,
  title,
}: {
  children: React.ReactNode;
  id: string;
  index: string;
  title: string;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="scroll-mt-32 xl:scroll-mt-24" id={id}>
      <header className="mb-10">
        <span className="eyebrow">
          {index} <span className="text-separator mx-1">/</span> {title}
        </span>
        <h2 className="section-title mt-3" id={`${id}-title`}>
          {title}
        </h2>
        <div aria-hidden className="rule-fade mt-6 h-px w-full" />
      </header>
      {children}
    </section>
  );
}
