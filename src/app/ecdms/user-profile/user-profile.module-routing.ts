import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {StudentProfileComponent} from "./student-profile/student-profile.component";
import {TeacherProfileComponent} from "./teacher-profile/teacher-profile.component";
import {ResultsComponent} from "./results/results.component";
import {AttendanceComponent} from "./attendance/attendance.component";
import {PaymentsComponent} from "./payments/payments.component";
import {NoticesComponent} from "./notices/notices.component";
var routingAnimation = localStorage.getItem('animate')

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'student',
                component: StudentProfileComponent,
                data: { animation: [routingAnimation] }
            },
            {
                path: 'teacher',
                component: TeacherProfileComponent,
                data: { animation: [routingAnimation] }
            },
            {
                path: 'results',
                component: ResultsComponent,
                data: { animation: [routingAnimation] }
            },
            {
                path: 'attendance',
                component: AttendanceComponent,
                data: { animation: [routingAnimation] }
            },
            {
                path: 'payments',
                component: PaymentsComponent,
                data: { animation: [routingAnimation] }
            },
            {
                path: 'notices',
                component: NoticesComponent,
                data: { animation: [routingAnimation] }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserProfileModuleRouting {
}