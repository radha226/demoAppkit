import { Component } from '@angular/core';
import { IonicPage, NavController,LoadingController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import {ProductDetailsPage}from '../../pages/product-details/product-details';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HomePage } from '../../pages/home/home';
import { MyApp } from '../../app/app.component';


@IonicPage()
@Component({
  selector: 'page-listproduct',
  templateUrl: 'listproduct.html',
})
export class ListproductPage {
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
	apppages;
	constructor(public sqlite: SQLite,public navCtrl: NavController, public navParams: NavParams, public loadingctrl:LoadingController , public dbprovider:DatabaseProvider) {
		this.dbprovider.connection().then((connection)=>{
			this.Db=connection;
		});
	}
  	getData(){
		this.selectData().then(result=>{
			this.AppkitProducts=result;
			//console.log(this.AppkitProducts.resultpro);
			//console.log(this.AppkitProducts.metadata);
			this.loading.dismiss();

		});
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
	
	selectData(){
		return new Promise((resolve,reject)=>{
		    let i;
		    this.dbprovider.SelectMeta('Meta').then((result)=>{
		    	this.metadata=result;
		    	this.dbprovider.SelectProducts('app_products').then(resultpro=>{
		    	console.log(resultpro);
		    	//resolve(resultpro);
		    	 let collection = {};  
			        collection['metadata'] = this.metadata;
			        collection['resultpro']=resultpro;
			        resolve(collection);
      		    });
		    });
		    
		})
	}
	detailProduct(id){
		console.log(id);
		this.navCtrl.push(ProductDetailsPage, {'id': id});
	}

	ionViewDidLoad() {
		console.log('data on index');
		 	this.loading=this.loadingctrl.create({
    			content:'index page..'
		  	});
		  	//this.loading.present();
   				//this.dbprovider.createTable().then((ddd)=>{
					//console.log(this.Db);
			
				
					//console.log('index page get function');
					this.getData();

				
			
			  //});
	}
	

}
