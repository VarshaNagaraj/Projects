import { Component} from '@angular/core';
import { NavController,NavParams,Platform,AlertController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';
import { DatabaseProvider } from '../../providers/database/database';
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username: string = '';
  fcmToken:any;
  user:any;
  chatuser=[];
  rider_lat:any;
  rider_long:any;
public result : any = {};
  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    public platform: Platform,
    private location: Geolocation,
    public toastController: ToastController,
    public db: DatabaseProvider,
    public navParams: NavParams,
    public afDatabase: AngularFireDatabase,
    private http: HttpClient) {
      this.user= this.navParams.get('userDetail');
     this.chatuser.push(this.user);
    }

  showAlert(title: string, message: string) {
    let alertBox = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alertBox.present();
  }


  loginUser() {
      if(/^[a-zA-Z0-9]+$/.test(this.username)) {
          // all cool
          this.navCtrl.push(ChatPage, {
              username: this.username
          });
      } else {
          this.showAlert('Error', 'Invalid Username');
      }
  }

  //fetching token for FCM feature -Firebase
  getToken(){
    this.fcmToken = localStorage.getItem("token");
    console.log(this.fcmToken);
      alert(this.fcmToken);
  }

  //Notification part from FCM after token is generated-Firebase
  sendNotification(){
     console.log("hi varsha");
        console.log(this.chatuser[0].username);
        this.afDatabase.list('/chat').push({
          username: this.chatuser[0].username,
          message: 'Help needed',
          latitude: this.rider_lat,
          longitude:this.rider_long
        }).then( () => {
          // message is sent
        }).catch( () => {
          // some error. maybe firebase is unreachable
        });
  }


  help(){
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
          this.helpneeded()
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

  //Body of the notification sent to all the users, once BVI clicks on HELP button- Firebase
  helpneeded(){
    let body = {
      "notification":{
        "title":"Guide Call Notification",
        "body":"Help needed",
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "param1":"value1",
        "param2":"value2"
      },
        "to":"/topics/all",
        "priority":"high",
        "restricted_package_name":""
    }
    let options = new HttpHeaders().set('Content-Type','application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send",body,{
      headers: options.set('Authorization', 'key=AAAAUpeDIGY:APA91bHR_TDHVE7Lrd6q_Xj6X1YcfEqQLHn7VYHlD4iFyt_M08mPTIt6H7dOlNGqNOOiAZFov39Rg--K1YGhKcTFnGpmNEZvgX6ySeDTdMY5SbZFBAlcAtF7g-GDWLs1Ojpsa6pEkJQt'),
    })
      .subscribe();
    console.log("help needed, send the notification");
    this.sendNotification();
    this.presentToast();
  }

  //Toast just to confirm that tyhe notification has been sent.
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Notification has been sent',
      duration: 2000
    });
    toast.onDidDismiss(() => {
      this.platform.exitApp();
    });
    toast.present();
  }

}
