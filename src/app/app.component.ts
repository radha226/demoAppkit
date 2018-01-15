import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import  {ContactUsPage} from '../pages/contact-us/contact-us';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {ProductDetailsPage}from '../pages/product-details/product-details';
import {ListproductPage} from '../pages/listproduct/listproduct';
import {SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../providers/database/database';
import { Events } from 'ionic-angular';

@Component({
  templateUrl: 'app.html',
  selector:'app-user'
})
export class MyApp {
   @ViewChild(Nav) nav: Nav;
   Db;
   rootPage:any;
   name:any;
   slughome;
   AppkitProducts:any;
   metadata:any;  
   AppkitPage=[];
   resultData:any;
   loading:any;
   homepage:any;
   database;
   constructor(public events: Events,public platform: Platform, public statusBar: StatusBar,public loadingctrl:LoadingController, public splashScreen: SplashScreen,public dbprovider:DatabaseProvider) {
      this.initializeApp();
      console.log('component ts app');
     
   }

   initializeApp() {
      this.platform.ready().then(() => {
         this.statusBar.styleDefault();
         this.splashScreen.hide();
      });
   }
   getData(){
      //this.selectData().then(result=>{ 
      //   this.resultData=result;
         this.rootPage = HomePage;
         this.loading.dismiss();
         this.events.subscribe('user:created', (user) => {
            this.homepage=user;
            console.log( this.homepage);
         });
            
      //});
   }
   // selectData(){
   //    return new Promise((resolve,reject)=>{
   //       let i;
   //       this.dbprovider.SelectPages('app_pages').then((resultpages:any)=>{

   //          // console.log('select papges in componet');
           
   //          this.loading.dismiss();
   //          // console.log(resultpages);
   //          for(i=0; i < resultpages.rows.length; i++){
   //             resultpages[i] = resultpages.rows.item(i);
   //             this.AppkitPage.push(resultpages[i]);   
   //          }
   //          resolve(this.AppkitPage);

   //       });
   //    })
   // }
   detailsPage(id){
      this.nav.setRoot(HomePage, {'id': id});
   }
   products(){
      this.nav.setRoot(ListproductPage);
   }

 
ngOnInit(){
  //console.log('app component');
   this.loading=this.loadingctrl.create({
            content:'wait..'
   });
   this.loading.present();
  this.dbprovider.connection().then((connection)=>{
     console.log(connection);
    this.dbprovider.createTable().then((ddd)=>{
      console.log(ddd);
      if(connection !=null){
         this.getData();
      }
     // this.getData();
    });
  });
}
  
}
