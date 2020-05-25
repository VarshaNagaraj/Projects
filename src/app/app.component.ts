import { Component,ViewChild } from '@angular/core';
import { Platform,Nav,AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import {FCM} from '@ionic-native/fcm';
import { DatabaseProvider } from '../providers/database/database';
import {Events} from 'ionic-angular';
import { FactoryProvider } from '../providers/factory/factory';
import { ChatPage } from '../pages/chat/chat';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any= SignupPage;
  rider_lat:any;
  rider_long:any;
  public result : any = {};
  @ViewChild(Nav) nav: Nav;
  constructor(private location: Geolocation,public alertCtrl: AlertController,public platform: Platform,public settings: FactoryProvider, public events: Events, public db: DatabaseProvider,public statusBar: StatusBar,public  splashScreen: SplashScreen, public LocalStorage: Storage, public fcm : FCM) {
    this.initializeapp();
  }

  initializeapp(){
        this.platform.ready().then(() => 
        {
          this.statusBar.styleDefault();
          this.splashScreen.hide();
        });
  }
    
  checkLeaveActive(){
    this.db.initilizeDB();
    console.log("entered check leave");
    this.db.getUserTable().then((user_list)=>{
      console.log(user_list);
      if(user_list){
          if(user_list[0].profile=="helper"){
            this.nav.setRoot(ChatPage,{userDetail:user_list}); 
          }else if(user_list[0].profile=="blind"){
            this.nav.setRoot(HomePage); 
          }
      }
      else{
        console.log("else loop");
        this.rootpage();
      }
    }).catch(e => console.log(e));
    this.token_generate();
  
        
  }

  //generating token for Firebase cloud messaging 
  token_generate(){
   //Receiving FCM ID
   this.fcm.subscribeToTopic('all');
   this.fcm.getToken().then((token)=>{
     console.log(token);
       localStorage.setItem("token",token);     
   }, (err)=>{
       console.log(JSON.stringify(err));
   });

   //Receiving Notification
   this.fcm.onNotification().subscribe((data)=>{
       if(data.wasTapped){
         console.log(JSON.stringify(data));
         this.rootPage='ChatPage'; 
         this.nav.setRoot(this.rootPage);
       }else{
         this.rootPage='LoginPage'; 
         this.nav.push(this.rootPage);
       }
   });

   //Updating Token
   this.fcm.onTokenRefresh().subscribe((token)=>{
     localStorage.setItem("token",token);
   });     
  }

//Rootpage after logging in based on the role
  rootpage(){
    this.LocalStorage.get('root').then((rootPage) => {
      console.log(rootPage);
      if(!rootPage){
        console.log("Create an account");
         this.LocalStorage.set('root', 'SignupPage');              //New User
         this.rootPage='SignupPage'; 
         this.nav.setRoot(this.rootPage);                           
       }
       else{
         //Check whether the user is BVI or Helper using two different UI
         if(rootPage=='HomePage'){
           this.rootPage= 'HomePage';      // BVI UI
           this.nav.setRoot(this.rootPage) ;   
         }       
         else if(rootPage=='ChatPage'){
           console.log("i am here");
           this.rootPage='ChatPage';   // Helper UI
           this.nav.setRoot(this.rootPage) ;  
         }
       }
    });

  }

}

