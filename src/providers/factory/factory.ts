import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the FactoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FactoryProvider {


  username:"";
  phoneNumber:"";
  email:"";
  profile:"";
  constructor(public http: HttpClient) {
    console.log('Hello FactoryProvider Provider');
  }


  set_username(i)
  {
    this.username = i;
  }

  set_phoneNumber(i)
  {
    this.phoneNumber = i;
  }
  set_profile(i)
  {
    this.profile = i;
  }
  set_email(i)
  {
    this.email = i;
  }
  get_username()
  {
    return this.username;
  }

  get_phoneNumber()
  {
    return this.phoneNumber;
  }
  get_profile()
  {
    return this.profile;
  }
  get_email()
  {
    return this.email;
  }
}
