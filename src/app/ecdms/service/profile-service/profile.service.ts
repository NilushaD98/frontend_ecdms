import { Injectable } from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AddStudentDTO} from "../../dto/AddStudentDTO";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private pipe: DecimalPipe,public http:HttpClient) {

  }

  getStudentFullDetailsByID(userID:number|null|string){
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.get(
        'http://localhost:9090/user/get-student-full-details-by-id?userID='+userID,
        { headers: headers }
    );
  }
}
