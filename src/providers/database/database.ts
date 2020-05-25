import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  public localDatabase : any;
  constructor(public http: HttpClient) {
    console.log('Hello DatabaseProvider Provider');
  }



//APPLICATION DOESN'T MAKE USE OF THESE FUNCTIONS AS I AM DIRECTLY ACCESSING FIREBASE TO FETCH THE DATA

   //..... Initialize the Database on the browser....
   initilizeDB(){
    return new Promise(() => {
        console.log("DB : initializeDB");
        this.localDatabase = window['openDatabase'] (
            "lastattempt",
            "1.0",
            "lastattempt DB",
            5000000
        );
        return this.localDatabase;
    });
  }


  //creating User table once the user has been logged in
  createUserTable(){
    this.localDatabase.transaction((txn) => {
        txn.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER  PRIMARY KEY AUTOINCREMENT ,  username TEXT,phoneNumber INTEGER,  profile TEXT,email  TEXT)",
            [], (txn, result) => {
                console.log(txn);
                console.log(result);
                console.log("Success creating Users Table ----->>>");
            },(txn,error)=>{
                console.log(error);
            })

    });
  }

  //DROP USER TABLE
  dropUserTable(){
    this.localDatabase.transaction((txn) => {
        txn.executeSql("DROP TABLE users", [], (txn, result) => {
            //console.log(txn);
            //console.log(result);
            console.log("Drop users Table ---@@@");
        })
    });
  }

  //INSERT VALUES INTO USER TABLE 
  insertUserTable(username,phoneNumber, profile,email){
    return new Promise (resolve =>{
        this.localDatabase.transaction((txn) => {
            console.log("entered insert table")

            txn.executeSql("INSERT OR REPLACE INTO users (username,phoneNumber, profile,email) VALUES (?,?,?,?)",
               
                [username,phoneNumber, profile,email], (txn, result) => {
                    console.log(txn);
                    console.log(result);
                    console.log("Success inserting into users Table ----->>>");
                    resolve('success');
                })
            });
        });
    }


//FETCHING USER VALUES
    getUserTable(){
    return new Promise (resolve => {
        this.localDatabase.transaction((txn) => {
            txn.executeSql("SELECT * FROM users",
                [], (txn, data) => {
                    console.log(data);
                    let currentRow, table_data = [];

                    for(let key in data.rows){
                        if(data.rows.hasOwnProperty(key)){
                            //console.log(key + " ==> " + data.rows[key]);
                            currentRow = data.rows[key];
                            table_data.push(currentRow);
                        }
                    }
                    resolve(table_data);
                })
        })
    })
    }

}
