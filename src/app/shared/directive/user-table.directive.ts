import {Directive, EventEmitter, Input, Output} from '@angular/core';
export type SortDirectionUser = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirectionUser} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEvent {
  direction: SortDirectionUser;
}
@Directive({
  selector: '[appUserTable]',
  host: {
    '[class.asc]': 'directionUser === "asc"',
    '[class.desc]': 'directionUser === "desc"',
    '(click)': 'rotate()'
  }
})
export class UserTableDirective {

  constructor() { }

  @Input() directionUser: SortDirectionUser = '';
  @Output() sortUser = new EventEmitter<SortEvent>();

  rotate() {
    this.directionUser = rotate[this.directionUser];
  }
}
