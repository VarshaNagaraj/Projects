import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

//----plugins added----//
import { ChatPage } from '../pages/chat/chat';
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { IonicStorageModule } from '@ionic/storage';
import { SignupPageModule } from '../pages/signup/signup.module';
import {FCM} from '@ionic-native/fcm';
import {HttpClientModule} from '@angular/common/http';
import { DatabaseProvider } from '../providers/database/database';
import { FactoryProvider } from '../providers/factory/factory';
import { ModalPage } from '../pages/modal/modal';
import { ModalPageModule } from '../pages/modal/modal.module';
import { SafeUrlPipe } from '../pipes/safe-url/safe-url';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Geolocation } from '@ionic-native/geolocation';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChatPage,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp({

      //Values from Firebase-CONFIDENTIAL
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: ""
    }),


    AngularFireDatabaseModule,
    SignupPageModule,
    AngularFireAuthModule,
    ModalPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChatPage,
    LoginPage,
    SignupPage,
    ModalPage
  ],
  providers: [
    StatusBar,
    SafeUrlPipe,
    SplashScreen,
    Storage,
    SQLite,
    Geolocation,
    FCM,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    FactoryProvider
  ]
})
export class AppModule {}
