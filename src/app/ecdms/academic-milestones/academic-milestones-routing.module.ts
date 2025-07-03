import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AttendanceStudentComponent} from "../attendance-summery/attendance-student/attendance-student.component";
import {AttendanceTeacherComponent} from "../attendance-summery/attendance-teacher/attendance-teacher.component";
import {TestsComponent} from "./tests/tests.component";
import {ResultsComponent} from "./results/results.component";
var routingAnimation = localStorage.getItem('animate')

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'tests',
                component: TestsComponent,
                data: { animation: [routingAnimation] }
            },
            {
                path: 'exam-results',
                component: ResultsComponent,
                data: { animation: [routingAnimation] }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AcademicMilestonesRoutingModule { }
