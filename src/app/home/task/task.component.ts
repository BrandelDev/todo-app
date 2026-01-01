import { Component, OnInit } from '@angular/core';
import { IonIcon, IonLabel, IonCheckbox, IonItem, IonList } from "@ionic/angular/standalone";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  imports: [IonIcon, IonLabel, IonCheckbox, IonItem, IonList]
})
export class TaskComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
