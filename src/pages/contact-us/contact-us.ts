import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',

})
export class ContactUsPage {
	modaldata:any;
	 i;
  constructor(public navCtrl: NavController, public viewctrl:ViewController, public navParams: NavParams) {
  		

  }
  CloseModal(){
  	this.viewctrl.dismiss();
  }
  ionViewWillLoad() {
     this.modaldata=this.navParams.get('ModelData');    
    console.log(this.modaldata);
    for(let i=0; i<this.modaldata.product.length; i++) {
    let product=this.modaldata.product;
    console.log(product[i]);
    }
   // console.log(this.modaldata.product[1]);



  }

}
