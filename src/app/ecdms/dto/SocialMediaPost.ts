import {User} from "./User";
import {Comment} from "./Comment";

export interface SocialMediaPost {
    id: number; // Unique identifier for the post
    user: User; // Information about the user who created the post
    time: Date; // Timestamp of the post
    content: string; // Main text content of the post
    likedStatus: boolean; // Whether the post is liked by the current user
    likes: number; // Total number of likes
    contentIMG?: string; // Optional image URL for the post
    commentCount: number; // Total number of comments
    commentShow: boolean; // Whether the comments section is visible
    comments: Comment[]; // Array of comments
    newComment:string;
}