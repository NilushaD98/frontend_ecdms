import {Injectable, PipeTransform} from '@angular/core';
import {SortColumn, SortDirection} from "../../../shared/directive/sortable.directive";
import {BehaviorSubject, delay, Observable, of, Subject, switchMap, tap} from "rxjs";
import {DecimalPipe} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {AddTeacherDTO} from "../../dto/AddTeacherDTO";



interface SearchResult {
  basicTable: any[];
  total: number;
}
interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}
const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
function sort(basicTable: any[], column: SortColumn, direction: string): any[] {
  if (direction === '' || column === '') {
    return basicTable;
  } else {
    return [...basicTable].sort((a: any, b: any) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}
function matches(table: any, term: string, pipe: PipeTransform) {
  if (table.fullName != undefined) {
    return table.fullName.toLowerCase().includes(term.toLowerCase())
        ;
  }
}
@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _tables$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _tableData$ = new BehaviorSubject<any[]>([]);
  private _sortDirection: SortDirection;
  public loadingStatus:boolean=false;

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };
  constructor(private pipe: DecimalPipe,public http:HttpClient) {
    this._search$
        .pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()),
            delay(200),
            tap(() => this._loading$.next(false))
        )
        .subscribe(result => {
          this._tables$.next(result.basicTable);
          this._total$.next(result.total);
        });
    this._search$.next();
  }

  get basicTable$() { return this._tables$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  setTableData(tableData: any[]) {
    this._tableData$.next(tableData);
    this._search$.next();
  }
  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    let basicTable = sort(this._tableData$.getValue(), sortColumn, sortDirection);
    basicTable = basicTable.filter(table => matches(table, searchTerm, this.pipe));

    const total = basicTable.length;

    // Paginate correctly using the current page & pageSize
    basicTable = basicTable.slice((page - 1) * pageSize, page * pageSize);

    return of({ basicTable, total });
  }


  getAllTeachers(){
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.get(
        'http://localhost:9090/user/get-all-teachers',
        { headers: headers }
    );
  }

  getTeacherById(id: number| null) {
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.get(
        'http://localhost:9090/user/get-teacher-by-id?teacherID='+id,
        { headers: headers }
    );
  }

  updateTeacher(teacher: AddTeacherDTO) {
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.put(
        'http://localhost:9090/user/update-teacher',
        teacher,
        { headers: headers }
    );
  }

  addTeacher(teacher: AddTeacherDTO):any {
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.post(
        'http://localhost:9090/user/add-teacher',
        teacher,
        { headers: headers }
    );
  }

    removeTeacher(id: any) {
      const token = localStorage.getItem('token') || '';
      console.log('Token:', token);
      let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
      console.log('Custom Headers:', headers);

      return this.http.delete(
          'http://localhost:9090/user/remove-teacher-by-id?teacherID='+id,
          { headers: headers }
      );
    }
}
