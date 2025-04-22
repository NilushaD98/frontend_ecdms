import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements OnInit {
  green: string;
  greenQua: string;

  constructor() { }

  ngOnInit(): void {
    this.greetUser();
  }

  greetUser() {
    let currentHour = new Date().getHours();
    if (currentHour < 12) {
      this.green =  "Good morning " + sessionStorage.getItem('activatedUser') +'!';
      this.greenQua = this.getRandomQuote();
    } else if (currentHour < 18) {
      this.green =  "Good afternoon " + sessionStorage.getItem('activatedUser') +'!';
      this.greenQua = this.getRandomQuote();
    } else {
      this.green =  "Good evening " + sessionStorage.getItem('activatedUser') +'!';
      this.greenQua = this.getRandomQuote();
    }
  }

  getRandomQuote() {
    var quotes = [
      "The only way to do great work is to love what you do. - Steve Jobs",
      "Don't worry about failure; you only have to be right once. - Drew Houston",
      "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
      "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
      "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
      "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
      "Try and fail,but don't fail to try. - John Quincy Adams",
      "If you can dream it, you can do it. - Walt Disney",
      "If opportunity doesn't knock, build a door. - Milton Berle",
      "Live as if you were to die tomorrow. Learn as if you were to live forever. - Mahatma Gandhi"
    ];

    var randomIndex = Math.floor(Math.random() * quotes.length);

    return quotes[randomIndex];
  }

}
