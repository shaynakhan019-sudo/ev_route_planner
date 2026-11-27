export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">
        Placeholder page. Person 3 will replace this with the Route Planner.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">
          Primary
        </span>
        <span className="rounded-md bg-accent px-3 py-1 text-sm">Accent</span>
        <span className="rounded-md bg-muted px-3 py-1 text-sm text-muted-foreground">
          Muted
        </span>
      </div>
    </div>
  );
}