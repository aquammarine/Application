interface Tag {
  id: string;
  name: string;
  colorHex: string | null;
}

interface EventTag {
  position: number;
  eventId: string;
  tagId: string;
  tag: Tag;
}

export type { Tag, EventTag };
