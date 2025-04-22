import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ManageStudentComponent} from "./manage-student/manage-student.component";
import {AddStudentComponent} from "./add-student/add-student.component";
import {AddTeacherComponent} from "./add-teacher/add-teacher.component";
import {ManageTeacherComponent} from "./manage-teacher/manage-teacher.component";
var routingAnimation = localStorage.getItem('animate')

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'manage-student',
                component: ManageStudentComponent,
                data: { animation: [routingAnimation] }
            },
            {
                path: 'add-student',
                component: AddStudentComponent,
                data: { animation: [routingAnimation] }
            },
            {
                path: 'add-teacher',
                component: AddTeacherComponent,
                data: { animation: [routingAnimation] }
            }, {
                path: 'manage-teacher',
                component: ManageTeacherComponent,
                data: { animation: [routingAnimation] }
            },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentManagementRoutingModule {
}