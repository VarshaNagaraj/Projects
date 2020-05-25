import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
//import {AngularFire} from 'angularfire2';
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user:any={
    username:"",
    phoneNumber:"",
    email:""
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public afDatabase: AngularFireDatabase
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

//creating a new user on firebase database
  createNewUser(username,phoneNumber,email){
    let dateCreated= new Date();
    console.log(this.user);
    try{
      const result =  this.afAuth.auth.createUserWithEmailAndPassword(this.user.email,this.user.phoneNumber);
      console.log(result);
      this.afDatabase.list('/users').push(this.user)
    }
    catch(e){
      console.error(e);
    }
  }
}
