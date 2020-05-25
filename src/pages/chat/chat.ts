import { Component ,ViewChild} from '@angular/core';
import { Nav,IonicPage, NavController, AlertController,NavParams ,ModalController} from 'ionic-angular';
import {Events} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
//import { AngularFireModule } from "angularfire2";
//import { AngularFireDatabaseModule } from "angularfire2/database";
import { Observable } from 'rxjs';
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';
import { DatabaseProvider } from '../../providers/database/database';
import {ModalPage} from '../modal/modal';
import * as firebase from 'firebase/app';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Nav) nav: Nav;
   user={};
   chatuser=[];
   userDetail:any;
   messageDetail:any;
  userProfile:any;
  _userSubscription;
  users: any = [{}];
  username: string = '';
  message: string = '';
  _chatSubscription;
  messages:any=[{}];
  countries: Observable<any[]>;
  constructor(public events: Events,
    public modalCtrl: ModalController,
    public navCtrl: NavController, 
    private alertCtrl: AlertController,
    public navParams: NavParams,
    public afDatabase: AngularFireDatabase,
    public toastController: ToastController,
    public db: DatabaseProvider,) {
     this.user= this.navParams.get('userDetail');
     this.chatuser.push(this.user);
      console.log(this.chatuser);
      if(this.chatuser){
        this.loggedIn();
      }
      else{
        this.databasereload();
      }
  }

  //function for facetime call feature
  async callFunction(id){
    console.log(id);
    for (var i = 0; i < this.users.length; i++) {
      if(id==this.users[i].username){
        for(var j=0; j < this.messages.length; j++){
          if(id==this.messages[j].username){
            console.log(this.messages[j].username);
            this.userDetail = this.users[i];
            this.messageDetail=this.messages[j];
          }
        }
      }
    }
      if(this.userDetail&&this.messageDetail){
        try{
          let modal = this.modalCtrl.create(ModalPage,{id:this.userDetail,message:this.messageDetail});
          modal.present();
        }
        catch(e){
          console.log(e);
        }
      }
  }
    
  //alert function
    showAlert(title: string) {
      let alertBox = this.alertCtrl.create({
        title: title,
        buttons: [  {
          text: 'Call',
          role: 'Call',
          handler: () => {
            this.callUser(this.userDetail.phoneNumber);
          }
        }]
      });
      alertBox.present();
    }

    //Call the selected user based on id
    callUser(id){
      console.log(id);
      return 'facetime:'+id;
    }

  
  databasereload(){
    this.user= this.navParams.get('userDetail');
    this.chatuser.push(this.user);
    console.log(this.user);
  }

  //function to display chat feature
  loggedIn(){
    this._userSubscription = this.afDatabase.list('/users').valueChanges();
    this._userSubscription.subscribe(data=>{
      this.users=data;
      console.log(this.users);
    });
    this._chatSubscription = this.afDatabase.list('/chat').valueChanges();
    this._chatSubscription.subscribe( data => {
      this.messages = data;
      console.log(this.messages);
    });
  }

//on leave, chat is refreshed again.
  ionViewWillLeave(){
    this._chatSubscription.unsubscribe();
    this.afDatabase.list('/chat').push({
      specialMessage: true,
      message: `${this.user[0].username} has left the room`
    });
  }

// sending messages on chatPage
  sendMessage() {
    this.afDatabase.list('/chat').push({
      username: this.chatuser[0].username,
      message: this.message,
      latitude:'',
      longitude:''
    }).then( () => {
        }).catch( () => {
      });
      this.message = '';
  }

}
