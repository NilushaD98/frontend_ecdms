import {CalendarEvent} from "angular-calendar";

export class CalendarDTO{
    events:CalendarEvent[];

    constructor(events:CalendarEvent[]) {
        this.events = events;
    }
}