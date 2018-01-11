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
    database;
  // pages: Array<{title: string, component: any}>;
  constructor(public platform: Platform, public statusBar: StatusBar,public loadingctrl:LoadingController, public splashScreen: SplashScreen,public dbprovider:DatabaseProvider) {
    this.initializeApp();
    console.log('component ts app');
     this.loading = loadingctrl.create({
       content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"></div>
      </div>`,
    });
     this.loading.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     // console.log('intialize app');
    });
  }
  getData(){
    this.selectData().then(result=>{ 
      //templateUrl: 'app.html'
      this.resultData=result;
      console.log(this.AppkitPage[1].title)
    });
  }
  selectData(){
    return new Promise((resolve,reject)=>{
        let i;
        this.dbprovider.SelectPages('app_pages').then((resultpages:any)=>{

         console.log('select papges in componet');
        this.rootPage = HomePage;
        this.loading.dismiss();
         console.log(resultpages);
          for(i=0; i < resultpages.rows.length; i++){
              resultpages[i] = resultpages.rows.item(i);
                   this.AppkitPage.push(resultpages[i]);   
                }
            resolve(this.AppkitPage);

        });
    })
  }
detailsPage(id){
  this.nav.setRoot(HomePage, {'id': id});
}
products(){
  this.nav.setRoot(ListproductPage);
  //console.log('products clicked');
}

 
ngOnInit(){
  //console.log('app component');
  this.dbprovider.connection().then((connection)=>{
    this.dbprovider.createTable().then((ddd)=>{
      console.log(ddd);
      this.getData();
    });
  });
}
  
}
