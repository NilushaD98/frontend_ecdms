import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AnnouncementDTO, CommentDTO} from "../dto/AnnouncementDTO";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class  AnnouncementService {

  constructor(public http:HttpClient) {
  }

  addAnnouncement(addAnnouncementDTO: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.post(
        'http://localhost:9090/announcement/add-announcement',
        addAnnouncementDTO,
        { headers: headers }
    );
  }

  getAllAnnouncements(): Observable<any> {
    // const token = localStorage.getItem('token') || '';
    // console.log(token)
    // const customHeaders = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(
        'http://localhost:9090/announcement/get-all-announcements',
        // { headers: customHeaders }
    );
  }

  likeAnnouncement(id:number): Observable<any> {
    // const token = localStorage.getItem('token') || '';
    // console.log(token)
    // const customHeaders = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(
        'http://localhost:9090/announcement/like-announcement?announcementID='+id,{}
        // { headers: customHeaders }
    );
  }

  unlikeAnnouncement(id:number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    console.log(token)
    const customHeaders = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(
        'http://localhost:9090/announcement/unlike-announcement?announcementID='+id,
        { headers: customHeaders }
    );
  }

  addComment(id:number,commentDTO:CommentDTO){
    const token = localStorage.getItem('token') || '';
    console.log(token)
    const customHeaders = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(
        'http://localhost:9090/announcement/add-comment?announcementID='+id,
        commentDTO,
        { headers: customHeaders }
    );
  }
}
