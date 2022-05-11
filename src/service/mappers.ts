import { MeetupExcerpt } from "../model/meetup";

export const mapTransactionsToMeetupExcerpt = (data): MeetupExcerpt[] =>
  data.transactions.edges.map((edge) => ({
    id: edge.node.id,
    title: edge.node.tags.find((tag) => tag.name === "Title").value,
    date: edge.node.tags.find((tag) => tag.name === "Date").value,
  }));
