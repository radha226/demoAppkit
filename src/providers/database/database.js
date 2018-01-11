var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var DatabaseProvider = /** @class */ (function () {
    function DatabaseProvider(http, platform, sqlite, loadingctrl) {
        this.http = http;
        this.platform = platform;
        this.sqlite = sqlite;
        this.loadingctrl = loadingctrl;
        this.slugs = [];
        this.AppkitProducts = [];
        console.log('Hello DatabaseProvider Provider');
        this.connection().then(function () {
        });
        //console.log('database provider');
    }
    DatabaseProvider.prototype.connection = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.platform.is('cordova')) {
                _this.sqlite.create({ name: 'appkit', location: 'default' }).then(function (data) {
                    //console.log(data)
                    _this.database = data;
                    //console.log(this.database);
                    //console.log( 'on mobile');
                    _this.db = _this.database;
                    resolve(_this.db);
                    _this.createTable().then(function () {
                        //console.log('contstructor create');
                    });
                }, function (error) {
                    console.error("wrong database", error);
                });
            }
            else {
                _this.database = window.openDatabase("tuteAppBrowser", '1', 'my', 1024 * 1024 * 100);
                console.log('on browser');
                //return this.db=this.database;
                _this.db = _this.database;
                resolve(_this.db);
                _this.createTable().then(function () {
                    //console.log('contstructor create');
                });
            }
        });
    };
    DatabaseProvider.prototype.ExecuteRun = function (query, valesData) {
        var _this = this;
        //console.log(this.database);
        return new Promise(function (resolve, reject) {
            if (query != undefined) {
                if (_this.platform.is('cordova')) {
                    _this.database.executeSql(query, valesData, function (result) {
                        resolve(result);
                    }, function (error) {
                        console.error(error);
                    });
                }
                else {
                    _this.database.transaction(function (tx) {
                        tx.executeSql(query, valesData, function (tx, result) {
                            resolve(result);
                        }, function (error) {
                            console.error(error);
                        });
                    });
                }
            }
        });
    };
    DatabaseProvider.prototype.createTable = function () {
        var _this = this;
        var columns = [];
        var columnsproduct = [];
        var columnMeta = [];
        var tableName;
        var tableNamepage;
        var tableNamepro;
        return new Promise(function (resolve, reject) {
            //console.log('before load');	
            _this.load().then(function (result) {
                //console.log('after load');	
                _this.Apidata = result;
                //for( let app in result){
                if ("app_pages" in result) {
                    //console.log('pages');
                    tableNamepage = "app_pages";
                    for (var app_keys in result.app_pages[0]) {
                        columns.push(app_keys + ' TEXT');
                    }
                    _this.query = 'CREATE TABLE IF NOT EXISTS ' + tableNamepage + '(' + columns.join(",") + ')';
                    _this.ExecuteRun(_this.query, []).then(function (resultpages) {
                        //console.log(resultpages);
                        _this.insertPages(_this.database, _this.Apidata, tableNamepage).then(function (result) {
                            //console.log();
                        });
                    });
                }
                if ("app_products" in result) {
                    //console.log('product');
                    tableNamepro = "app_products";
                    for (var app_keys in result.app_products[0]) {
                        columnsproduct.push(app_keys + ' TEXT');
                    }
                    _this.query = 'CREATE TABLE IF NOT EXISTS ' + tableNamepro + '(' + columnsproduct.join(",") + ')';
                    _this.ExecuteRun(_this.query, []).then(function (resultproduct) {
                        //console.log(resultproduct);
                        _this.insertProduct(_this.database, result, tableNamepro).then(function () {
                        });
                    });
                }
                if ("app_name" in result) {
                    //console.log('meta');
                    for (var app_keys in result) {
                        tableName = "Meta";
                        if (typeof result[app_keys] != "object") {
                            columnMeta.push(app_keys + ' TEXT');
                        }
                    }
                    _this.query = 'CREATE TABLE IF NOT EXISTS ' + tableName + '(' + columnMeta.join(",") + ')';
                    _this.ExecuteRun(_this.query, []).then(function (data) {
                        _this.metaQuery(_this.database, result, tableName).then(function (resultappkit) {
                            //console.log(resultappkit)
                        });
                    });
                }
                resolve('true');
            });
        });
    };
    DatabaseProvider.prototype.insertProduct = function (db, record, tableName) {
        var _this = this;
        var columns = [];
        var values = [];
        var slugdata;
        return new Promise(function (resolve, error) {
            if (record != '') {
                for (var tableColumns in record.app_products[0]) {
                    columns.push(tableColumns);
                }
                for (var _i = 0, _a = record.app_products; _i < _a.length; _i++) {
                    var productkey = _a[_i];
                    var v = [];
                    for (var key in productkey) {
                        var json = void 0;
                        if (key == 'product_attributes') {
                            json = JSON.stringify(productkey[key]);
                        }
                        else {
                            json = productkey[key];
                        }
                        v.push(json);
                    } //console.log(v);
                    values.push(v);
                }
            }
            if (db != undefined) {
                _this.query = 'SELECT slug FROM ' + tableName;
                _this.ExecuteRun(_this.query, []).then(function (result1) {
                    if (result1.rows.length > 0) {
                        _this.update(values, db, tableName, columns);
                    }
                    else {
                        _this.insertData(values, db, tableName, columns);
                    }
                });
            }
        });
    };
    DatabaseProvider.prototype.metaQuery = function (db, record, tableName) {
        var _this = this;
        var columnMeta = [];
        var values = [];
        var tablekeys;
        return new Promise(function (resolve, error) {
            if (record != '') {
                for (var tablekeys_1 in record) {
                    if (typeof record[tablekeys_1] != "object") {
                        columnMeta.push(tablekeys_1);
                        values.push(record[tablekeys_1]);
                    }
                }
                _this.query = 'SELECT  app_domain FROM ' + tableName;
                _this.ExecuteRun('SELECT  app_domain FROM ' + tableName, []).then(function (result) {
                    //console.log(result);
                    if (result.rows.length > 0) {
                        //console.log('update');
                        var meta = void 0;
                        //console.log(result);
                        meta = result.rows.item(0).app_domain;
                        //console.log(meta);
                        var questionMarks = [];
                        for (var j = 0; j < values.length; j++) {
                            questionMarks.push("?");
                        }
                        values.push(meta);
                        _this.query = 'UPDATE ' + tableName + ' SET ' + columnMeta.join('=?, ') + ' = ? where app_domain = ?';
                        _this.ExecuteRun(_this.query, values).then(function (hh) {
                            var AppkitMeta;
                            //console.log(hh);
                            if (result.rows.length > 0) {
                                for (var i = 0; i < result.rows.length; i++) {
                                    AppkitMeta = result.rows[i];
                                }
                                resolve(AppkitMeta);
                            }
                        });
                    }
                    else {
                        //console.log('insert');
                        var questionMarks = [];
                        for (var j = 0; j < values.length; j++) {
                            questionMarks.push("?");
                        }
                        _this.query = 'INSERT INTO ' + tableName + '(' + columnMeta + ') VALUES (' + questionMarks + ')';
                        _this.ExecuteRun(_this.query, values).then(function (hh) {
                            //console.log(hh);
                            var AppkitMeta;
                            console.log(hh);
                            if (result.rows.length > 0) {
                                for (var i = 0; i < result.rows.length; i++) {
                                    AppkitMeta = result.rows.item(i);
                                }
                                resolve(AppkitMeta);
                            }
                        });
                    }
                });
            }
        });
    };
    DatabaseProvider.prototype.insertPages = function (db, record, tableName) {
        var _this = this;
        var columns = [];
        var values = [];
        var slugdata;
        return new Promise(function (resolve, reject) {
            if (record != '') {
                //process columns form record variable
                for (var tableColumns in record.app_pages[0]) {
                    columns.push("'" + tableColumns + "'");
                }
                //process values from record variable
                if (record.app_pages.length > 0) {
                    if (record.app_pages != undefined) {
                        for (var _i = 0, _a = record.app_pages; _i < _a.length; _i++) {
                            var appData = _a[_i];
                            var v = [];
                            var w = [];
                            for (var keys in appData) {
                                if (record.app_pages != undefined || appData != undefined) {
                                    v.push(appData[keys]);
                                }
                            }
                            values.push(v);
                        }
                        //console.log(values);
                    }
                }
            }
            if (db != undefined) {
                _this.query = 'SELECT slug FROM ' + tableName;
                _this.ExecuteRun(_this.query, []).then(function (result1) {
                    //console.log(result1);
                    if (result1.rows.length > 0) {
                        for (var i = 0; i <= result1.rows.length; i++) {
                            if (result1.rows[i] != undefined) {
                                slugdata = _this.slugs.push(result1.rows[i].slug);
                            }
                        }
                        if (_this.slugs.length > 0) {
                            _this.update(values, db, tableName, columns).then(function (update) {
                                //console.log(update);
                            });
                        }
                    }
                    else {
                        _this.insertData(values, db, tableName, columns).then(function (ll) {
                            //console.log(ll);
                        });
                    }
                });
            }
        });
    };
    DatabaseProvider.prototype.insertData = function (values, db, tableName, columns, i) {
        var _this = this;
        if (i === void 0) { i = 0; }
        return new Promise(function (resolve, reject) {
            //console.log('insert');
            if (values[i] != undefined) {
                var questionMarks = [];
                for (var j = 0; j < values[i].length; j++) {
                    questionMarks.push('?');
                }
                _this.query = 'INSERT INTO ' + tableName + ' ( ' + columns.join(',') + ' ) VALUES (' + questionMarks.join(',') + ')';
                _this.ExecuteRun(_this.query, values[i]).then(function (result) {
                    //console.log(result)
                    _this.insertData(values, db, tableName, columns, i = i + 1);
                });
            }
        });
    };
    DatabaseProvider.prototype.update = function (values, db, tableName, columns, i) {
        var _this = this;
        if (i === void 0) { i = 0; }
        //console.log('update');
        return new Promise(function (resolve, reject) {
            if (values[i] != undefined) {
                db.transaction(function (tx) {
                    values[i].push(_this.slugs[i]);
                    var questionMarks = [];
                    for (var j = 0; j < values[i].length; j++) {
                        questionMarks.push('?');
                    }
                    _this.query = 'UPDATE ' + tableName + ' SET ' + columns.join(' = ? ,') + ' = ? where slug = ?';
                    _this.ExecuteRun(_this.query, values[i]).then(function (result) {
                        resolve(result);
                        _this.update(values, db, tableName, columns, i = i + 1);
                    });
                });
            }
        });
    };
    DatabaseProvider.prototype.SelectPages = function (tableName) {
        var _this = this;
        var AppkitPage = [];
        var slughome;
        if (this.db != undefined) {
            var i = void 0;
            return new Promise(function (resolve, reject) {
                //console.log(tableName);
                _this.query = 'Select * from ' + tableName;
                _this.ExecuteRun(_this.query, []).then(function (resultpages) {
                    //console.log(resultpages);
                    resolve(resultpages);
                });
            });
        }
    };
    DatabaseProvider.prototype.SelectProducts = function (tableName) {
        var _this = this;
        var key;
        var i;
        var data = [];
        if (this.db != undefined) {
            console.log('databasde product');
            return new Promise(function (resolve, reject) {
                _this.query = 'Select * from ' + tableName;
                _this.ExecuteRun(_this.query, []).then(function (resultproduct) {
                    console.log(resultproduct);
                    _this.AppkitProducts = [];
                    for (i = 0; i < resultproduct.rows.length; i++) {
                        var temp = resultproduct.rows.item(i);
                        temp.product_attributes = JSON.parse(temp.product_attributes);
                        _this.AppkitProducts.push(temp);
                    }
                    console.log(_this.AppkitProducts);
                    resolve(_this.AppkitProducts);
                });
            });
        }
    };
    DatabaseProvider.prototype.ProductDetail = function (tableName, id) {
        var _this = this;
        var productDetail;
        if (this.db != undefined) {
            return new Promise(function (resolve, reject) {
                _this.query = 'Select * from ' + tableName + ' where id = ' + id;
                console.log('Select * from ' + tableName + ' where id = ' + id);
                _this.ExecuteRun(_this.query, []).then(function (result) {
                    productDetail = result.rows.item(0);
                    productDetail.product_attributes = JSON.parse(productDetail.product_attributes);
                    console.log(productDetail);
                    resolve(productDetail);
                });
            });
        }
    };
    DatabaseProvider.prototype.SelectMeta = function (tableName) {
        var _this = this;
        var AppkitMeta;
        if (this.db != null) {
            return new Promise(function (resolve, reject) {
                //console.log('here 1');
                _this.query = 'Select * from ' + tableName;
                _this.ExecuteRun(_this.query, []).then(function (result) {
                    //console.log(result.rows);
                    //resolve(result.rows);
                    if (result.rows.length > 0) {
                        for (var i = 0; i < result.rows.length; i++) {
                            AppkitMeta = result.rows.item(i);
                        }
                        //console.log(AppkitMeta);
                        resolve(AppkitMeta);
                    }
                });
            });
        }
    };
    DatabaseProvider.prototype.DeleteAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var i;
            var data = [];
            var hh = ['app_pages', 'app_products', 'Meta'];
            console.log(hh.length);
            for (i = 0; i < hh.length; i++) {
                console.log(hh[i]);
                data.push(hh[i]);
                _this.query = 'Delete  from ' + hh[i];
                _this.ExecuteRun(_this.query, []).then(function (result) {
                });
            }
            console.log(data);
            _this.navCtrl.setRoot();
            // this.connection().then((jj)=>{
            // 	resolve('refreshed');
            // 		// window.location.reload();
            // });
        });
    };
    DatabaseProvider.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get('http://aione.oxosolutions.com/api/android/').subscribe(function (data) {
                _this.Apidata = data.json().data;
                //console.log(this.Apidata);
                resolve(_this.Apidata);
            }, function (error) {
                console.error(error);
            });
        });
    };
    DatabaseProvider.prototype.ionViewDidLoad = function () {
        console.log('database ionview did load');
    };
    DatabaseProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, Platform, SQLite, LoadingController])
    ], DatabaseProvider);
    return DatabaseProvider;
}());
export { DatabaseProvider };
//# sourceMappingURL=database.js.map