// The bundled copy of the Oral / Poster schedule is remote-data/presentations.json itself, so the
// app works offline with whatever was in the repo at build time. At runtime the screen fetches the
// same file from GitHub and swaps it in if it validates (see use-remote-data / remote-data/README).
import presentationsJson from '../../remote-data/presentations.json';

export type PresentationDay = 'Day 1' | 'Day 2';

interface PresentationBase {
  /** Abstract code, e.g. 'O-PT-2' (oral) or 'P-PC-10' (poster). Not guaranteed unique in the source. */
  code: string;
  author: string;
  title: string;
  affiliation: string;
  subject: string;
  day: PresentationDay;
  /** Display date, e.g. '24 Oct 2026'. */
  date: string;
  /** Display time range, e.g. '2:30 PM – 3:30 PM'. */
  time: string;
}

export interface OralPresentation extends PresentationBase {
  /** e.g. 'Slot 1'. */
  slot: string;
  /** e.g. 'Oral Hall 1'. */
  hall: string;
  isOnline: boolean;
}

export type PosterPresentation = PresentationBase;

export const PRESENTATIONS = presentationsJson as {
  oral: OralPresentation[];
  poster: PosterPresentation[];
};
