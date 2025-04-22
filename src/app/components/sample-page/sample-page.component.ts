import {Component,  OnInit, QueryList, ViewChildren} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from "rxjs";
import {Table} from "../../shared/interface/table";
import {NgbdSortableHeader, SortEvent} from "../../shared/directive/sortable.directive";
import {TablesService} from "../../shared/services/tables/tables.service";

@Component({
  selector: 'app-sample-page',
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export class SamplePageComponent implements OnInit {

  public validate = false;
  public tooltipValidation = false;
  model: NgbDateStruct;
  placement = 'bottom';
  ngOnInit(): void {
  }
  public submit() {
    this.validate = !this.validate;
  }
  public tooltipSubmit() {
    this.tooltipValidation = !this.tooltipValidation;
  }


  basicTable$: Observable<Table[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(public service: TablesService) {
    this.basicTable$ = service.basicTable$;
    this.total$ = service.total$;
  }


  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  deleteData(id: number){
    this.basicTable$.subscribe((data: any)=> {
      data.map((elem: any,i: any)=>{elem.id == id && data.splice(i,1)})

    })
  }
}
