import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonSegmentButton, IonLabel, IonSegment } from '@ionic/angular/standalone';
import { NavbarComponent } from "../core/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopBarFilterComponent } from "../core/components/top-bar-filter/top-bar-filter.component";
import { TaskComponent } from "./task/task.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NavbarComponent,
    IonIcon,
    IonSegmentButton,
    IonLabel,
    IonSegment,
    FormsModule,
    TopBarFilterComponent,
    TaskComponent
],
})
export class HomePage {


  filter: string = 'all';

  constructor() { }
}
