import {User} from "./User";

export interface Comment {
  id: number; // Unique identifier for the comment
  user: User; // Information about the user who made the comment
  time: Date; // Timestamp of the comment
  text: string; // Text content of the comment
}