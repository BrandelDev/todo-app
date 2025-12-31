import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({ projectId: "todo-mobile-app-7ad8a",
       appId: "1:935753410244:web:dc496076907697f25a8b91", 
       storageBucket: "todo-mobile-app-7ad8a.firebasestorage.app", 
       apiKey: "AIzaSyBgMXkj-KlvYmxWlsQBYmr2pPqF5EcCDY8", 
       authDomain: "todo-mobile-app-7ad8a.firebaseapp.com", 
       messagingSenderId: "935753410244", 
       measurementId: "G-HLG67LL3N6", 
       projectNumber: "935753410244", 
       version: "2" 
      })), 
      provideFirestore(() => getFirestore()), 
      provideRemoteConfig(() => getRemoteConfig())
  ],
});
