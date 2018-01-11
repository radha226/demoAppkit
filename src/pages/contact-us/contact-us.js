var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ContactUsPage = /** @class */ (function () {
    function ContactUsPage(navCtrl, viewctrl, navParams) {
        this.navCtrl = navCtrl;
        this.viewctrl = viewctrl;
        this.navParams = navParams;
    }
    ContactUsPage.prototype.CloseModal = function () {
        this.viewctrl.dismiss();
    };
    ContactUsPage.prototype.ionViewWillLoad = function () {
        this.modaldata = this.navParams.get('ModelData');
        console.log(this.modaldata);
        for (var i = 0; i < this.modaldata.product.length; i++) {
            var product = this.modaldata.product;
            console.log(product[i]);
        }
        // console.log(this.modaldata.product[1]);
    };
    ContactUsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-contact-us',
            templateUrl: 'contact-us.html',
        }),
        __metadata("design:paramtypes", [NavController, ViewController, NavParams])
    ], ContactUsPage);
    return ContactUsPage;
}());
export { ContactUsPage };
//# sourceMappingURL=contact-us.js.map