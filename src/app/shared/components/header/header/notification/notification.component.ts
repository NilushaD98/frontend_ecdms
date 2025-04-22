import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  intervalId: NodeJS.Timeout;
  message: string;
  size: string;

  constructor() { }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.loadNotifications();
    }, 30000);
  }

  loadNotifications() {


    /*$.ajax({
      url: "ModelCommon",
      type: "POST",
      data: {command: 'loadNotifications'},
      success: function (res) {
        var data = JSON.parse(res);
        if (data.TOT != "0") {
          $("#notify_badge_details").text(data.TOT + " entries are pending");
          $("#notify_badge_main").text(data.TOT);
        } else {
          $("#notify_badge_details").text("");
          $("#notify_badge_main").text("");
        }
      },
      error: function () {

      }
    });*/
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to avoid memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
