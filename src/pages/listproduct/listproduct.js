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
import { IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { ProductDetailsPage } from '../../pages/product-details/product-details';
import { SQLite } from '@ionic-native/sqlite';
var ListproductPage = /** @class */ (function () {
    function ListproductPage(sqlite, navCtrl, navParams, loadingctrl, dbprovider) {
        var _this = this;
        this.sqlite = sqlite;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingctrl = loadingctrl;
        this.dbprovider = dbprovider;
        this.AppkitPage = [];
        this.dbprovider.connection().then(function (connection) {
            _this.Db = connection;
        });
    }
    ListproductPage.prototype.getData = function () {
        var _this = this;
        this.selectData().then(function (result) {
            _this.AppkitProducts = result;
            console.log(_this.AppkitProducts.resultpro);
            console.log(_this.AppkitProducts.metadata);
            _this.loading.dismiss();
        });
    };
    ListproductPage.prototype.selectData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var i;
            _this.dbprovider.SelectMeta('Meta').then(function (result) {
                _this.metadata = result;
                _this.dbprovider.SelectProducts('app_products').then(function (resultpro) {
                    console.log(resultpro);
                    //resolve(resultpro);
                    var collection = {};
                    collection['metadata'] = _this.metadata;
                    collection['resultpro'] = resultpro;
                    resolve(collection);
                });
            });
        });
    };
    ListproductPage.prototype.detailProduct = function (id) {
        console.log(id);
        this.navCtrl.push(ProductDetailsPage, { 'id': id });
    };
    ListproductPage.prototype.ionViewDidLoad = function () {
        console.log('data on index');
        this.loading = this.loadingctrl.create({
            content: 'index page..'
        });
        //this.loading.present();
        //this.dbprovider.createTable().then((ddd)=>{
        //console.log(this.Db);
        //console.log('index page get function');
        this.getData();
        //});
    };
    ListproductPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-listproduct',
            templateUrl: 'listproduct.html',
        }),
        __metadata("design:paramtypes", [SQLite, NavController, NavParams, LoadingController, DatabaseProvider])
    ], ListproductPage);
    return ListproductPage;
}());
export { ListproductPage };
//# sourceMappingURL=listproduct.js.map