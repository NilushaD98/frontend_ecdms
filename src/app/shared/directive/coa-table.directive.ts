import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { supportDB } from '../data/support-ticket/support-ticket';
export type SortColumnCoa = keyof any | '';
export type SortDirectionCoa = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirectionCoa} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEvent {
  column: SortColumnCoa;
  direction: SortDirectionCoa;
}
@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'directionCoa === "asc"',
    '[class.desc]': 'directionCoa === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeaderCoa {

  constructor() { }
  @Input() sortableCoa: SortColumnCoa = '';
  @Input() directionCoa: SortDirectionCoa = '';
  @Output() sortCoa = new EventEmitter<SortEvent>();

  rotate() {
    this.directionCoa = rotate[this.directionCoa];
    this.sortCoa.emit({column: this.sortableCoa, direction: this.directionCoa});
  }
}
