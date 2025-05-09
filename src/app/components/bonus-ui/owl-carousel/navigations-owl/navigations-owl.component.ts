import { Component, OnInit } from "@angular/core";
import * as data from "../../../../shared/data/owl";

@Component({
  selector: "app-navigations-owl",
  templateUrl: "./navigations-owl.component.html",
  styleUrls: ["./navigations-owl.component.scss"],
})
export class NavigationsOwlComponent implements OnInit {
  public owlcarousel6ptions = data?.owlcarousel6ptions;
  public owlcarousel1 = data?.owlcarousel1;

  constructor() {}

  ngOnInit(): void {}
}
