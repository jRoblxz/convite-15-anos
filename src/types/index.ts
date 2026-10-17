export interface EventInfo {
  celebrantName: string;
  dateISO: string;
  rsvpDeadline: string;
  location: { name: string; address: string; lat: number; lng: number };
  sizes: { top: string; bottom: string; shoe: string };
}
export interface RsvpPayload { name: string }
