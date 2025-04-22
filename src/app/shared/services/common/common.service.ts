import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as http from "http";
import {HttpService} from "../../../../utils/HttpService";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private httpClient:HttpClient) {
  }

  getActivatedDates(compID:number):any{
    return this.httpClient.get<any>(HttpService.COMMON_LOAD_ACTIVE_DATES,{headers:HttpService.getDefaultHeaders(),params:{compId:compID}});
  }
  getCurrencyList():any{
      return this.httpClient.get(HttpService.COMMON_LOAD_CURRENCY,{headers:HttpService.getDefaultHeaders()});
  }

  getProjectList():any{
      return this.httpClient.get(HttpService.GET_PROJECT_LIST,{headers:HttpService.getDefaultHeaders()});
  }
}
