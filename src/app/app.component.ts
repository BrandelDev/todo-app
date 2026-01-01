import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {
  addOutline,
  calendarOutline,
  buildOutline,
  barChartOutline,
  bluetoothOutline,
  homeOutline,
  personOutline,
  logOutOutline,
  mailOutline,
  shieldCheckmarkOutline,
  createOutline,
  searchOutline,
  notificationsOutline,
  personCircleOutline,
  settingsOutline,
  moonOutline,
  sunnyOutline,
  checkmarkDoneOutline,
  chevronForwardOutline,
  trashOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
        addIcons({
      'calendar-outline': calendarOutline,
      'build-outline': buildOutline,
      'bar-chart-outline': barChartOutline,
      'bluetooth-outline': bluetoothOutline,
      'home-outline': homeOutline,
      'person-outline': personOutline,
      'log-out-outline': logOutOutline,
      'mail-outline': mailOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'create-outline': createOutline,
      'search-outline': searchOutline,
      'notifications-outline': notificationsOutline,
      'person-circle-outline': personCircleOutline,
      'add-outline': addOutline,
      'settings-outline': settingsOutline,
      'moon-outline': moonOutline,
      'sunny-outline': sunnyOutline,
      'checkmark-done-outline':checkmarkDoneOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'trash-outline': trashOutline
    });
  }
}
