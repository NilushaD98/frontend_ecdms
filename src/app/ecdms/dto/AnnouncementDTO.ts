// UserDTO.ts
export class UserDTO {
    profilePhotoUrl: string; // URL to the user's profile picture
    name: string;
}

// CommentDTO.ts
export class CommentDTO {
    postCommentID: number;
    comment: string;
    commentDate: Date;
    userDTO: UserDTO; // Reference to the user who made the comment
}

// AnnouncementDTO.ts
export class AnnouncementDTO {
    announcementID: number;
    caption: string;
    pictureLink: string;
    postDate: Date;
    likeStatus: boolean;
    likeCount: number;
    commentCount: number;
    commentDTOList: CommentDTO[]; // List of comments
    commentShow:boolean = false;
    newComment:string = '';
}