import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TestsComponent} from "./tests/tests.component";
import {ResultsComponent} from "./results/results.component";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TablesModule} from "../../components/tables/tables.module";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [TestsComponent,ResultsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    TablesModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class AcademicMilestonesModule { }
