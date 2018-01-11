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
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../../providers/database/database';
/**
 * Generated class for the ProductDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ProductDetailsPage = /** @class */ (function () {
    function ProductDetailsPage(sqlite, navCtrl, navParams, loadingctrl, dbprovider) {
        var _this = this;
        this.sqlite = sqlite;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingctrl = loadingctrl;
        this.dbprovider = dbprovider;
        this.Object = Object;
        this.productDetail = [];
        this.productAttributes = [];
        this.objectkey = '';
        this.Db = this.dbprovider.connection();
        this.dbprovider.connection().then(function (connection) {
            _this.Db = connection;
            //	console.log(this.Db);
        });
    }
    ProductDetailsPage.prototype.getData = function () {
        var _this = this;
        this.selectData().then(function (result) {
            _this.resultData = result;
            _this.productAttributes = result.product_attributes;
            console.log(_this.productAttributes);
            for (var _i = 0, _a = Object.keys(_this.productAttributes != undefined); _i < _a.length; _i++) {
                _this.obj = _a[_i];
                console.log(_this.obj);
                for (_this.objectkey in _this.productAttributes) {
                    console.log("key:", _this.objectkey, "value:", _this.productAttributes[_this.objectkey].value);
                }
            }
        });
    };
    ProductDetailsPage.prototype.selectData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var i;
            var id = _this.navParams.get('id');
            _this.dbprovider.ProductDetail('app_products', id).then(function (result) {
                _this.productDetail = result;
                // console.log(this.productDetail); 
                resolve(_this.productDetail);
            });
        });
    };
    ProductDetailsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ProductDetailsPage');
        this.loading = this.loadingctrl.create({
            content: 'index page..'
        });
        //this.loading.present();
        // this.dbprovider.createTable().then((jj)=>{
        this.getData();
        // })			
    };
    ProductDetailsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-product-details',
            templateUrl: 'product-details.html',
        }),
        __metadata("design:paramtypes", [SQLite, NavController, NavParams, LoadingController, DatabaseProvider])
    ], ProductDetailsPage);
    return ProductDetailsPage;
}());
export { ProductDetailsPage };
//# sourceMappingURL=product-details.js.map