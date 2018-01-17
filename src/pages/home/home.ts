 import { Component } from '@angular/core';
   import { NavController,LoadingController , ModalController,Platform ,NavParams} from 'ionic-angular';
   import  {ContactUsPage} from '../contact-us/contact-us';
   import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
   import { DatabaseProvider } from '../../providers/database/database';
   import { MyApp } from '../../app/app.component';
   import { Events } from 'ionic-angular';


   @Component({
     templateUrl: 'home.html',
     selector: 'page-home',
   })
   export class HomePage {
      name:any;
      Db;
      slughome;
      AppkitProducts:any;
      metadata:any;  
      AppkitPage=[];
      resultData:any;
      loading:any;
      database;
      Pagesid:any;
      apppages:any;
      content:any;


   constructor(public events: Events,public sqlite: SQLite,public platform:Platform,public navParams: NavParams,public navCtrl: NavController, public loadingctrl:LoadingController , private modalctrl:ModalController, public dbprovider:DatabaseProvider) {
      // this.dbprovider.connection();
      // this.dbprovider.connection().then((connection)=>{
      //    this.Db=connection;
      // });
     
      
   }  
   createUser() {
  console.log('User created!')
  // this.events.publish('user:created', 'peoperles');
}

   getData(){
      this.selectData().then(result=>{
         this.resultData=result;
         if(this.resultData.apppages!=undefined){
         }
        // console.log(this.resultData.apppages);
         this.events.publish('user:created', this.resultData.AppkitPage);
        
         this.content=this.resultData.slughome.content;
        
        // console.log(this.content);
         //this.inject=this.resultData.slughome;
         

      },);
   }
   selectData(){
   	//console.log('select page call from  home')
      return new Promise((resolve,reject)=>{
          let i;
         // console.log('event select');
          this.dbprovider.SelectMeta('Meta').then((result)=>{
           this.metadata=result;
          // console.log(this.metadata);
            this.dbprovider.SelectPages('app_pages').then((resultpages:any)=>{
               console.log(resultpages);
               this.Pagesid=this.navParams.get('id');

               for(i=0; i < resultpages.rows.length; i++){

                  resultpages[i] = resultpages.rows.item(i);
                   
                    for(let keypages in resultpages[i]){
                      let json:any;
                       if(keypages=='id' || keypages =='show_in_menu'){                           
                              resultpages[i][keypages]=resultpages[i][keypages];
                              //console.log(json);
                        }else{
                          resultpages[i][keypages]=resultpages[i][keypages].replace(/&lt;/g, "<")
                          .replace(/&gt;/g, ">")
                          .replace(/&quot;/g, '"')
                          .replace(/&#039;/g, "'");
                        }
                    }
                     console.log(resultpages[i]);
                     this.AppkitPage.push(resultpages[i]);
                     if(resultpages[i].slug=="home-page"){
                         this.slughome=resultpages[i];
                     }
                     if(resultpages[i].id==this.Pagesid){
                          this.apppages=resultpages[i];
                        //  console.log(this.apppages);
                     } 
                  }
                //  console.log('ddkjfdfj');
                 //this.AppkitPage=resultpages;
                 let collection = [];
                 collection['slughome']=this.slughome;
                 collection['apppages']=this.apppages; 
                 collection['AppkitPage']=this.AppkitPage; 
                 collection['metadata']=this.metadata;
                
                resolve(collection);
                resolve(this.slughome);
           });
         });
         
      })
   }

   refreshPage(){
       //window.location.reload();
       // this.dbprovider.delall().then((result)=>{

       // });
    //   this.loading=this.loadingctrl.create({
  //           content:'index page..'
      //    });
      // this.loading.present();
       this.dbprovider.DeleteAll().then(result=>{       
          this.navCtrl.setRoot(MyApp);
          //this.datacall();
         
       });
   }
   // datacall(){
   //    console.log('data on index');
   //       this.loading=this.loadingctrl.create({
 //            content:'index page..'
   //       });
   //       //this.loading.present();
 //               this.dbprovider.connection().then((ddd)=>{
   //             console.log(this.Db);
         
            
   //             //console.log('index page get function');
   //             this.getData();

            
         
   //         });
   // }
   ionViewDidLoad(){
       //this.dbprovider.connection().then((connection)=>{
        // console.log(connection);
        // this.dbprovider.createTable().then((ddd)=>{
            //console.log(ddd);
           // this.dbprovider.SelectPages('app_pages').then((resultpages:any)=>{
               this.getData();
            // });
         //});
      //});

   }
   
}

