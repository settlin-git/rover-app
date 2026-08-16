const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Length of a trip in days, counting both the first and last day.
 *
 * A trip that starts and ends on the same date lasts one day, not zero, which
 * is how a traveller would describe it.
 */
export function durationInDays(startsOn: string, endsOn: string): number {
  const start = Date.parse(startsOn);
  const end = Date.parse(endsOn);

  if (Number.isNaN(start) || Number.isNaN(end)) return 0;

  return Math.max(1, Math.round((end - start) / MS_PER_DAY) + 1);
}

/** "12 Sep 2016" — unambiguous between British and American readers. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Today, as the `YYYY-MM-DD` string the rest of the app stores dates in. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Adds days to a `YYYY-MM-DD` string, returning the same format. */
export function addDays(iso: string, days: number): string {
  const date = new Date(iso);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
