export interface Tag {
  id: string;
  name: string;
  nameLower: string;
  colorHex: string | null;
  createdAt: string;
}

export interface EventTag {
  eventId: string;
  tagId: string;
  position: number;
  tag: Tag;
}
