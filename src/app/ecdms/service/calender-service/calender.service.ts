import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CalendarEvent} from "angular-calendar";
import {CalendarDTO} from "../../dto/Calendar";

@Injectable({
  providedIn: 'root'
})
export class CalenderService {

  private apiUrl = 'http://localhost:9090/events';

  constructor(private http: HttpClient) {}

  getEvents(): any {
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);

    return this.http.get<CalendarEvent[]>(this.apiUrl,{ headers: headers });
  }

  addEvent(calendar:CalendarDTO): any {
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);

    return this.http.post("http://localhost:9090/events/save", calendar,{ headers: headers });
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);

    return this.http.put<CalendarEvent>(`${this.apiUrl}/${event.id}`, event,{ headers: headers });
  }

  deleteEvent(id?: number |string | undefined): any {
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);

    return this.http.delete<void>(`${this.apiUrl}/${id}`,{ headers: headers });
  }
}
