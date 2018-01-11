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
import { NavController, LoadingController, ModalController, Platform, NavParams } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../../providers/database/database';
var HomePage = /** @class */ (function () {
    function HomePage(sqlite, platform, navParams, navCtrl, loadingctrl, modalctrl, dbprovider) {
        var _this = this;
        this.sqlite = sqlite;
        this.platform = platform;
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.loadingctrl = loadingctrl;
        this.modalctrl = modalctrl;
        this.dbprovider = dbprovider;
        this.AppkitPage = [];
        this.dbprovider.connection();
        this.dbprovider.connection().then(function (connection) {
            _this.Db = connection;
        });
        console.log('index page constructor');
    }
    HomePage.prototype.getData = function () {
        var _this = this;
        this.selectData().then(function (result) {
            _this.resultData = result;
            if (_this.resultData.apppages != undefined) {
                // console.log(this.resultData.apppages);
            }
            //console.log(this.resultData.AppkitPage);
            //console.log(this.resultData.metadata);
            _this.loading.dismiss();
        });
    };
    HomePage.prototype.selectData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var i;
            _this.dbprovider.SelectMeta('Meta').then(function (result) {
                console.log('index pages');
                _this.metadata = result;
                console.log(_this.metadata);
                _this.dbprovider.SelectPages('app_pages').then(function (resultpages) {
                    //console.log(resultpages);
                    _this.Pagesid = _this.navParams.get('id');
                    for (i = 0; i < resultpages.rows.length; i++) {
                        resultpages[i] = resultpages.rows.item(i);
                        _this.AppkitPage.push(resultpages[i]);
                        if (resultpages[i].slug == "home-page") {
                            _this.slughome = resultpages[i];
                        }
                        if (resultpages[i].id == _this.Pagesid) {
                            _this.apppages = resultpages[i];
                            //  console.log(this.apppages);
                        }
                    }
                    _this.AppkitPage = resultpages;
                    var collection = {};
                    collection['AppkitPage'] = _this.AppkitPage;
                    collection['slughome'] = _this.slughome;
                    collection['apppages'] = _this.apppages;
                    collection['metadata'] = _this.metadata;
                    resolve(collection);
                });
            });
        });
    };
    HomePage.prototype.refreshPage = function () {
        this.dbprovider.DeleteAll().then(function (result) {
        });
    };
    HomePage.prototype.ionViewDidLoad = function () {
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
    HomePage = __decorate([
        Component({
            templateUrl: 'home.html',
            selector: 'page-home',
        }),
        __metadata("design:paramtypes", [SQLite, Platform, NavParams, NavController, LoadingController, ModalController, DatabaseProvider])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map