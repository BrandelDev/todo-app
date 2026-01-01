import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-top-bar-filter',
  templateUrl: './top-bar-filter.component.html',
  styleUrls: ['./top-bar-filter.component.css'],
  imports: [
    IonSegment, 
    IonSegmentButton, 
    IonLabel,
    FormsModule
  ]
})
export class TopBarFilterComponent implements OnInit {

  filter:string = 'all';
  constructor() { }

  ngOnInit() {
  }

}
