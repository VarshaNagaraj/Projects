import { Component } from '@angular/core';
import { IonicPage, NavController,AlertController,  Platform,NavParams,Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
//import {AngularFire} from 'angularfire2';
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { HomePage } from '../home/home';
import { ChatPage } from '../chat/chat';
import {Storage} from '@ionic/storage';
import { DatabaseProvider } from '../../providers/database/database';
import { FactoryProvider } from '../../providers/factory/factory';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  user:any={
              username:"",
              phoneNumber:"",
              email:"",
              profile:""
            };
            rider_lat:any;
            rider_long:any;
            public result : any = {};
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              public LocalStorage: Storage,
              public alertCtrl: AlertController,
              public event: Events,
              private location: Geolocation,
              public afAuth: AngularFireAuth,
              public db :DatabaseProvider,
              public settings: FactoryProvider,
              public afDatabase: AngularFireDatabase) {

                //get the current location of the person and display it on the maps 
                this.platform.ready().then(() =>{
                  var optionsnum={
                    timeout : 5000
                };
                this.location.getCurrentPosition(optionsnum)
                .then((location) => 
                {
                              //alert(location.coords.latitude + " - " + location.coords.latitude + "\n" + JSON.stringify(location));
                    this.rider_lat = location.coords.latitude;
                    this.rider_long = Math.abs(location.coords.longitude);
                    console.log(this.rider_lat);
                    console.log(this.rider_long);
                })
                .catch((error) => 
                {
                              //******************if user clicks cancel for apps location   ************
                              //alert("getCurrentPosition Error \n" + JSON.stringify(error));
                    let prompt = this.alertCtrl.create({
                        title: 'GPS Error. Phone was unable to fetch Geolocation Data',
                        message: ' Please Turn ON the GPS.',
                        buttons: [
                                    {
                                        text: 'Cancel',
                                        handler: data =>
                                        {
                                            console.log('Cancel clicked');
                                            //resolve('cancel');
                                        }
                                    },
                                    {
                                        text: 'OK',
                                        handler: data =>
                                        {
                                            console.log('OK clicked');
                                            //resolve(this.result);
                                        }
                                    }
                                ]
                            });
                            prompt.present();
                });

              });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    
  }

//Create new user after collecting email and username on Firebase Database and Push them to respective Pages according to their roles.
  createNewUser(username,phoneNumber,email,profile){
    this.user.profile=profile;
    let dateCreated= new Date();
    try{
        const result =  this.afAuth.auth.createUserWithEmailAndPassword(this.user.email,this.user.phoneNumber);
        console.log(result);
        this.afDatabase.list('/users').push(this.user);
        if(this.user.profile=="blind"){
          this.LocalStorage.set('root', 'HomePage');
          this.settings.set_profile("blind");
          this.settings.set_username(this.user.username);
          this.settings.set_email(this.user.email);
          this.settings.set_phoneNumber(this.user.phoneNumber);
          this.navCtrl.setRoot(HomePage,{userDetail:this.user});
        }
        else if (this.user.profile=="helper"){
            this.settings.set_profile("helper");
            this.settings.set_username(this.user.username);
            this.settings.set_email(this.user.email);
            this.settings.set_phoneNumber(this.user.phoneNumber);
            this.LocalStorage.set('root', 'ChatPage');
            this.navCtrl.setRoot(ChatPage,{userDetail:this.user});
        }
        else{
          console.log("Error");
        }
    }
    catch(e){
      console.error(e);
    }
  }
}

