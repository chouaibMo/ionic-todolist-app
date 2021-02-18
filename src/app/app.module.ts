import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {AngularFireAnalyticsModule} from "@angular/fire/analytics";
import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire";
import { AngularFireStorageModule } from '@angular/fire/storage';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      BrowserModule,
      IonicModule.forRoot({
          scrollPadding: false,
          scrollAssist: false
      }),
      AppRoutingModule,
      AngularFirestoreModule,
      AngularFireStorageModule,
      AngularFireAnalyticsModule,
      AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [
      StatusBar,
      SplashScreen,
     { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
