import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { RsvpPayload } from "../types";

export async function saveRsvp({ name }: RsvpPayload): Promise<void> {
  await addDoc(collection(db, "rsvps"), { name: name.trim(), createdAt: serverTimestamp() });
}
