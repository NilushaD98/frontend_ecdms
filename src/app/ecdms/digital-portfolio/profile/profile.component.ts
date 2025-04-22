import { Component } from '@angular/core';
import * as data from "../../../shared/data/social-app/social-app";
import {CommonModule} from "@angular/common";
import {BreadcrumbComponent} from "../../../shared/components/breadcrumb/breadcrumb.component";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SocialMediaPost} from "../../dto/SocialMediaPost";
import {AnnouncementService} from "../../service/announcement.service";
import {AnnouncementDTO, CommentDTO, UserDTO} from "../../dto/AnnouncementDTO";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  replyMassage:any
  public massages = data.massages
  posts:AnnouncementDTO[];
  constructor(public announcementService:AnnouncementService) {

    announcementService.getAllAnnouncements().subscribe(
        (res:any)=>{
          this.posts = res;
        }
    );

  }
  socialMediaPosts: SocialMediaPost[] = [
    {
      id: 1,
      user: {
        profile_photo_url: 'https://res.cloudinary.com/dsc7devgs/image/upload/v1743877994/samples/upscale-face-1.jpg',
        name: 'Jason Borne',
      },
      time:new Date('2022-01-12'),
      content: 'Test content',
      likedStatus: true,
      likes: 45,
      contentIMG: 'https://res.cloudinary.com/dsc7devgs/image/upload/v1743877994/cld-sample-4.jpg',
      commentCount: 54,
      commentShow: false,
      newComment:'',
      comments: [
        {
          id: 1,
          user: {
            profile_photo_url: 'https://res.cloudinary.com/dsc7devgs/image/upload/v1743877994/samples/upscale-face-1.jpg',
            name: 'ELANA',
          },
          time:  new Date('2023-10-01T10:05:00Z'),
          text: 'Great post! Keep it up!',
        },
      ],
    },
  ];

  changeLikeStatus(item: AnnouncementDTO) {
    item.likeStatus = !item.likeStatus
    if(item.likeStatus){
      this.announcementService.likeAnnouncement(item.announcementID).pipe().subscribe(
          (res:any)=>{
            if(res.success){
              item.likeCount +=1;
            }else {
              item.likeStatus = !item.likeStatus
            }
          }
      );
    }else {
      this.announcementService.unlikeAnnouncement(item.announcementID).pipe().subscribe(
          (res:any)=>{
            if(res.success){
              item.likeCount -=1;
            }else {
              item.likeStatus = !item.likeStatus
            }
          }
      );
    }
  }

  addComment(post: AnnouncementDTO) {
    if (post.newComment.trim()) {
      let u = new UserDTO();
      u.name = localStorage.getItem('username') || '';
      let c = new CommentDTO();
      c.comment = post.newComment;
      c.userDTO =u;
      c.commentDate = new Date();

      this.announcementService.addComment(post.announcementID,c)
          .pipe()
          .subscribe(
              (res:any)=>{
                if(res.success){
                  post.commentDTOList.push(c);
                  post.commentCount++;
                  post.newComment = '';
                }
              }
          );
    }
  }
}

