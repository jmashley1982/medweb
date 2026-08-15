/**
 * Sticky notice shown across the admin section of the public demo.
 *
 * The toast that fires on Save is deliberately transient; this bar sets
 * expectations before anyone clicks anything, so a prospective client is
 * never left wondering whether they broke something.
 */
export function DemoBanner() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-100 px-4 py-2.5 text-center text-[0.82rem] font-semibold leading-snug text-amber-900 shadow-sm md:text-sm">
      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500" />
      <span>
        Demo preview — browse and type freely, but changes aren&rsquo;t saved.
      </span>
    </div>
  );
}
