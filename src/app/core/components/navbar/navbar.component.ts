import { Component, OnInit } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [IonIcon]
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
