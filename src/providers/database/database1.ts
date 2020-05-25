
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";
import { Platform } from "ionic-angular";

@Injectable()
export class DatabaseProvider {

  public db : SQLiteObject;

  constructor(public http: HttpClient,
              public sqlite : SQLite,
              public platform : Platform) {
    console.log('Hello DatabaseProvider Provider');
    //db = new SQLite();
   
  }

  //DATABASE FOR IOS APPLICATION

    initilizeDB() {
      return new Promise(resolve => {
        console.log("initializeDB");
        this.sqlite = new SQLite();
        this.platform.ready().then(() => {
          console.log("platform entered");
              this.sqlite.create({
                name: 'lastattempt.db',
                location: 'default'
              })
                .then((db: SQLiteObject) => {
                  console.log("sql entered");
                  this.db = db;
                  console.log("DB initialization successful");
                  resolve('success');
                })
                .catch(e => {
                  console.log('Initialize Error - ' + e);
                  resolve('error');
                });
        })
      });
  
  }

    createUserTable(){
        let db = this.db;
        db.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER  PRIMARY KEY AUTOINCREMENT ,  username TEXT,phoneNumber INTEGER,  profile TEXT,email  TEXT)", [])
          .then((result) => {
            console.log("Success creating users IOS Table ----->>>");
          })
          .catch((error) =>{
            console.log(error);
          })
      }

    insertUserTable(username,phoneNumber, profile,email){
        let db = this.db;
        return new Promise (resolve =>{
          db.executeSql("INSERT OR REPLACE INTO users (username,phoneNumber, profile,email) VALUES (?,?,?,?)",
            [username,phoneNumber, profile,email]).then((result) => {
            console.log("Success inserting users IOS Table ----->>>");
            resolve('success');
          }).catch(( error) =>{
            console.log(error);
          })
        });
      }

      dropUserTable(){
        let db = this.db;
        db.executeSql("DROP TABLE users", [])
          .then((result) => {
            console.log("Drop users Table ---@@@");
          })
          .catch((e) => {console.log(e)})
      }


      getUserTable(){
        let db = this.db;
        return new Promise(resolve => {
          db.executeSql("SELECT * FROM users",
            []).then((data) => {
            console.log(data);
            let table_data = [];
            if (data.rows.length > 0) {
              for (let i = 0; i < data.rows.length; i++) {
                table_data.push(data.rows.item(i));
              }
            }
            resolve(table_data);
          })
        })
      }
}
