import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams } from 'ionic-angular';
import {DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl} from '@angular/platform-browser';
import { SafeUrlPipe } from '../../pipes/safe-url/safe-url';


/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  user={};
  userDetail:any;
  messageDetail:any;
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    private sanitizer: DomSanitizer,
    public pipe:SafeUrlPipe,
     public navParams: NavParams) {

      this.userDetail= this.navParams.get('id');
      this.messageDetail=this.navParams.get('message');
      console.log(this.userDetail);
      console.log(this.messageDetail);
      this.userDetail.phoneNumber = ('1'+this.userDetail.phoneNumber);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }

  //close the modal
  dismiss(){
    this.viewCtrl.dismiss();
  }

}
