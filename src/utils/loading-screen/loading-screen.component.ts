import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {LoadingService} from "../../app/shared/services/loading.service";

@Component({
  selector: 'app-loading-screen',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.scss'
})
export class LoadingScreenComponent {
  loadingStatus: false;
  @Input() status!: boolean;

  constructor(private loadingService: LoadingService) {

    // this.loadingService.show();
    // // Simulate a delay (e.g., API call)
    // setTimeout(() => {
    //   this.loadingService.hide();
    // }, 3000);
  }
}
