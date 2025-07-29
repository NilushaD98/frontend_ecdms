import {Injectable, PipeTransform} from '@angular/core';
import {SortColumn, SortDirection} from "../../../shared/directive/sortable.directive";
import {BehaviorSubject, delay, Observable, of, Subject, switchMap, tap} from "rxjs";
import {DecimalPipe} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {TestTypeDTO} from "../../dto/TestTypeDTO";
import {ExamResultDTO} from "../../dto/AddResultDTO";



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
  if (table.testName != undefined) {
    return table.testName.toLowerCase().includes(term.toLowerCase())
        ;
  }if (table.student != undefined) {
    return table.student.toLowerCase().includes(term.toLowerCase())
        ;
  }
}
@Injectable({
  providedIn: 'root'
})
export class AcademicMilestoneService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _tables$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _tableData$ = new BehaviorSubject<any[]>([]);
  private _sortDirection: SortDirection;
  public loadingStatus:boolean=false;

  private _state: State = {
    page: 1,
    pageSize: 6,
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

    // Get the current table data
    let basicTable = sort(this._tableData$.getValue(), sortColumn, sortDirection);

    // Filter the data
    basicTable = basicTable.filter(table => matches(table, searchTerm, this.pipe));

    const total = basicTable.length;

    // Paginate the data
    basicTable = basicTable.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ basicTable, total });
  }

  getAllTestTypes(){
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.get(
        'http://localhost:9090/test-type/get-all-test-type',
        { headers: headers }
    );
  }

  addTestType(testTypeDTO: TestTypeDTO) {
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.post(
        'http://localhost:9090/test-type/add-test-type',
        testTypeDTO,
        { headers: headers }
    );
  }

  getTestTypeByID(testTypeID:number){
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.get(
        'http://localhost:9090/test-type/get-test-type-by-id?testTypeID='+testTypeID,
        { headers: headers }
    );
  }
  removeTestTypeByID(testTypeID:number){
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.delete(
        'http://localhost:9090/test-type/remove-test-type-by-id?testTypeID='+testTypeID,
        { headers: headers }
    );
  }
  updateTestType(testTypeDTO: TestTypeDTO){
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.put(
        'http://localhost:9090/test-type/update-test-type',
        testTypeDTO,
        { headers: headers }
    );

  }

  getTestTypeAllDetailsByID(testTypeID:number){
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.get(
        'http://localhost:9090/test-type/get-test-type-all-details-by-id?testTypeID='+testTypeID,
        { headers: headers }
    );
  }

  addExamResult(examResultDTO:ExamResultDTO){
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.post(
        'http://localhost:9090/exam-result/add-exam-result',
        examResultDTO,
        { headers: headers }
    );
  }

  removeResult(resultID: number){
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    let headers = new HttpHeaders().append('Content-Type', 'application/json').append('Authorization','Bearer'+' '+token);
    console.log('Custom Headers:', headers);

    return this.http.delete(
        'http://localhost:9090/exam-result/remove-result?resultID='+resultID,
        { headers: headers }
    );
  }

}
