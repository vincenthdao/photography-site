interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pine">{eyebrow}</p> : null}
      <h2 className="mt-3 font-serif text-4xl leading-[0.95] text-ink sm:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-base text-ink/80 sm:text-lg">{subtitle}</p> : null}
    </div>
  );
}
