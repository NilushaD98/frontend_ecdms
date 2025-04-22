import {Component, QueryList, ViewChildren} from '@angular/core';
import {BreadcrumbComponent} from "../../../shared/components/breadcrumb/breadcrumb.component";
import {Observable} from "rxjs";
import {Table} from "../../../shared/interface/table";
import {
  NgbdSortableHeader as NgbdSortableHeader_1,
  NgbdSortableHeader,
  SortEvent
} from "../../../shared/directive/sortable.directive";
import {TablesService} from "../../../shared/services/tables/tables.service";
import {NgbHighlight, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {AsyncPipe, CommonModule, DecimalPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FeatherIconComponent} from "../../../shared/components/feather-icon/feather-icon.component";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {TABLEDATA} from "../../../shared/data/table/tableData";
import {UserServiceService} from "../../service/user-service/user-service.service";

@Component({
  selector: 'app-manage-student',
  providers: [TablesService, DecimalPipe],
  templateUrl: './manage-student.component.html',
  styleUrl: './manage-student.component.scss'
})
export class ManageStudentComponent {

  basicTable$: Observable<any>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  programMapping:any = {
    ecd: 'ECD Center',
    dc: 'Daycare Center',
    ecddc: 'ECD & Daycare Center'
  };
  categoryMapping:any = {
    1: '2.5 - 3 years',
    2: '3 - 4 years',
    3: '4 - 5 years'
  };
  constructor(
      public service: TablesService,
      public route:Router,
      public userService:UserServiceService,
      public activatedRoute: ActivatedRoute,

      ) {

    userService.getAllStudents().subscribe(
        (res:any)=>{
          console.log(res)
          userService.setTableData(res.data);
          this.basicTable$ = userService.basicTable$;
          this.total$ = userService.total$;
        }
    )
  }

  // Method to get the display name
  getProgramDisplayName(programCode: string): string {
    return this.programMapping[programCode] || '';
  }
  getCategory(category: string): string {
    return this.categoryMapping[category] || '';
  }
  navigateAddStdent(){
    this.route.navigate(['/student-management/add-student']);
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

  viewStudent(stuID: any) {
      this.route.navigate(['/student-management/add-student'],{ queryParams: { stuID: stuID } });
  }
}
