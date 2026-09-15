/**
 * Visible placeholder for copy that hasn't been written — adopted from
 * handoff/components/content/TodoCopy.jsx. Grep `TODO:VB` to find them all.
 */
export function TodoCopy({ what, owner = 'TODO' }: { what: string; owner?: string }) {
  return (
    <p className="rounded-card border border-dashed border-olive bg-olive-tint px-4 py-3 text-body text-ink">
      <strong className="font-semibold">{owner}</strong> · {what}
    </p>
  );
}
