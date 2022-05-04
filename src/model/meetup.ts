export interface MeetupExcerpt {
    id: string; // Arweave transaction id
    title: string;
    date: string; // ISO 8601 format (es: 2022-04-29T14:30:44.660Z)
}
export interface Meetup extends MeetupExcerpt{
    desc: string;
}

