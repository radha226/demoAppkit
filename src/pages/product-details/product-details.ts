import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController} from 'ionic-angular';
import  {ContactUsPage} from '../contact-us/contact-us';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the ProductDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
	name:any;
		Db;	
		resultData:any;
		loading:any;
database;
Object = Object;
public productDetail:any = [];
public productAttributes:any = [];
public objectkey='';
obj;


  constructor(public sqlite: SQLite,public navCtrl: NavController, public navParams: NavParams,public loadingctrl:LoadingController ,  public dbprovider:DatabaseProvider) {
  	this.Db=this.dbprovider.connection();
		
		this.dbprovider.connection().then((connection)=>{
			this.Db=connection;
	//	console.log(this.Db);
		});
  }
  	getData(){

  
			this.selectData().then((result:any)=>{
	 this.resultData=result;
    this.productAttributes = result.product_attributes;
    console.log(this.productAttributes);
    for ( this.obj of Object.keys(this.productAttributes!=undefined)) {
    	console.log(this.obj);
	      for (this.objectkey in this.productAttributes) {
	          console.log("key:",this.objectkey, "value:", this.productAttributes[this.objectkey].value   );
	      }  
    }
			});
	}
	selectData(){
		return new Promise((resolve,reject)=>{
		    let i;
    let id=this.navParams.get('id');
		     this.dbprovider.ProductDetail('app_products',id).then((result:any)=>{
		    	 this.productDetail=result;
       // console.log(this.productDetail); 
        resolve(this.productDetail);
        });
		})
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
    this.loading=this.loadingctrl.create({
    			content:'index page..'
		  	});
		  	//this.loading.present();
			
				// this.dbprovider.createTable().then((jj)=>{
					this.getData();
				// })			
  }

}
