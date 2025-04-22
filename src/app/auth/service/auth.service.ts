import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginRequestDTO, StandardResponse} from "../dto/auth-dto";
import {Observable} from "rxjs";
import {HttpService} from "../util/HttpService";
import * as moment from 'moment';
import {LoginDTO} from "../dto/LoginDTO";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient) { }

  login(loginDTO:LoginDTO):any{
    return this.httpClient.post('http://localhost:9090/auth/login',loginDTO);
  }

  whoAmI():any{
    return this.httpClient.get(HttpService.AUTH_SERVICE_CONTEXT_URL_AUTH+'whoAmI',{headers:HttpService.getDefaultHeaders()})
  }

  idUserLoggedIn(){
    return(localStorage.getItem('token') != null)
  }

  loadPermissions():any{
    return ['Developer'];
  }

  getValidity(loginRequestDTO:LoginRequestDTO,token:any):any{

    // Add the Bearer token to the headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.post(HttpService.AUTH_SERVICE_CONTEXT_URL_AUTH+'validity',loginRequestDTO,{ headers });
  }

  pwReset(loginRequestDTO:any): Observable<any> {
    return this.httpClient.post(HttpService.AUTH_SERVICE_CONTEXT_URL_AUTH+'changepwd',loginRequestDTO);
  }

    static isCredentialsValid() {
      console.log('Access Token');
      console.log(sessionStorage.getItem('accessToken'));
      console.log('------------------------------------');
      console.log(sessionStorage.getItem('expire_date'))
      console.log(moment().isBefore(moment(sessionStorage.getItem('expire_date'))))
      return true;
    }
}
