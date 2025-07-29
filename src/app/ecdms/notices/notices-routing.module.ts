import {RouterModule, Routes} from "@angular/router";
import {ManageStudentComponent} from "../student-management/manage-student/manage-student.component";
import {AddStudentComponent} from "../student-management/add-student/add-student.component";
import {AddTeacherComponent} from "../student-management/add-teacher/add-teacher.component";
import {ManageTeacherComponent} from "../student-management/manage-teacher/manage-teacher.component";
import {NgModule} from "@angular/core";
import {SpecialNoticeComponent} from "./special-notice/special-notice.component";
var routingAnimation = localStorage.getItem('animate')

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'notices',
                component: SpecialNoticeComponent,
                data: { animation: [routingAnimation] }
            }
            ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NoticesRoutingModule {
}