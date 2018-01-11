import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
	modaldata:any;
  i;
  constructor(public navCtrl: NavController,public viewctrl:ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
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
