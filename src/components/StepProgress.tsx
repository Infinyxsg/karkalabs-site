/**
 * Step dots for a board scene on the ink ground — adopted from handoff/components/board/StepProgress.jsx:
 * reached steps are 20px teal-on-ink pills, upcoming ones 6px on-ink/25 dots.
 * `holdAt` is a site addition for the Schools classroom variant: an olive ring (the design system's
 * pending/held colour) on the step where the teacher holds the board.
 */
export function StepProgress({ current = 0, total = 6, holdAt }: { current?: number; total?: number; holdAt?: number }) {
  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const reached = i < current;
        const hold = holdAt === i + 1;
        return (
          <span
            key={i}
            data-hold={hold || undefined}
            className={`h-1.5 rounded-pill transition-all duration-(--dur-base) ease-karka-out ${
              reached ? 'w-5 bg-teal-on-ink' : 'w-1.5 bg-on-ink/25'
            } ${hold ? 'outline-2 outline-offset-2 outline-olive' : ''}`}
          />
        );
      })}
    </div>
  );
}
