export interface Meetup {
  id: string; // Arweave transaction id
  title: string;
  date: string; // ISO 8601 format (es: 2022-04-29T14:30:44.660Z)
  desc: string;
}

export type MeetupExcerpt = Pick<Meetup, "id" | "title" | "date">;
