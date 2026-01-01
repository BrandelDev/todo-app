import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonSegmentButton, IonLabel, IonSegment, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { NavbarComponent } from "../core/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopBarFilterComponent } from "../core/components/top-bar-filter/top-bar-filter.component";
import { RouterLink } from '@angular/router';
import { TaskComponent } from './components/tasks/tasks.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NavbarComponent,
    IonIcon,
    FormsModule,
    TopBarFilterComponent,
    TaskComponent,
    IonFab,
    IonFabButton,
    RouterLink
],
})
export class HomePage {


  filter: string = 'all';

  constructor() { }
}
