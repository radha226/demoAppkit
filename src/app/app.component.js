var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ListproductPage } from '../pages/listproduct/listproduct';
import { DatabaseProvider } from '../providers/database/database';
var MyApp = /** @class */ (function () {
    // pages: Array<{title: string, component: any}>;
    function MyApp(platform, statusBar, loadingctrl, splashScreen, dbprovider) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.loadingctrl = loadingctrl;
        this.splashScreen = splashScreen;
        this.dbprovider = dbprovider;
        this.AppkitPage = [];
        this.initializeApp();
        console.log('component ts app');
        this.loading = loadingctrl.create({
            content: "\n      <div class=\"custom-spinner-container\">\n        <div class=\"custom-spinner-box\"></div>\n      </div>",
        });
        this.loading.present();
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
            // console.log('intialize app');
        });
    };
    MyApp.prototype.getData = function () {
        var _this = this;
        this.selectData().then(function (result) {
            _this.resultData = result;
            console.log(_this.AppkitPage);
        });
    };
    MyApp.prototype.selectData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var i;
            _this.dbprovider.SelectPages('app_pages').then(function (resultpages) {
                _this.rootPage = HomePage;
                _this.loading.dismiss();
                //console.log(resultpages);
                for (i = 0; i < resultpages.rows.length; i++) {
                    resultpages[i] = resultpages.rows.item(i);
                    _this.AppkitPage.push(resultpages[i]);
                }
                resolve(_this.AppkitPage);
            });
        });
    };
    MyApp.prototype.detailsPage = function (id) {
        this.nav.setRoot(HomePage, { 'id': id });
    };
    MyApp.prototype.products = function () {
        this.nav.setRoot(ListproductPage);
        //console.log('products clicked');
    };
    MyApp.prototype.ngOnInit = function () {
        var _this = this;
        //console.log('app component');
        this.dbprovider.connection().then(function (connection) {
            _this.dbprovider.createTable().then(function (ddd) {
                console.log(ddd);
                _this.getData();
            });
        });
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform, StatusBar, LoadingController, SplashScreen, DatabaseProvider])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map