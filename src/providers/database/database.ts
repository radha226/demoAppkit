 import { Http } from '@angular/http';
import { Injectable , ViewChild} from '@angular/core';
import { HomePage } from '../../pages/home/home';
import {ListproductPage} from '../../pages/listproduct/listproduct';
import {ProductDetailsPage}from '../../pages/product-details/product-details';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Nav, Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NavController } from "ionic-angular/index";
import { App } from "ionic-angular";
import { MyApp } from '../../app/app.component';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
	private navCtrl: NavController;
public database:any;
public query:any;
db:any;
Apidata:any;
slugs = [];
AppkitProducts=[];

	constructor(public http: Http,  private app:App,public platform:Platform, public sqlite:SQLite,public loadingctrl: LoadingController) {
		//console.log('Hello DatabaseProvider Provider');
		this.connection().then(()=>{
		});
		this.navCtrl = app.getActiveNav();

	}
	
	connection(){
		return new Promise((resolve,reject)=>{
			//console.log('connection refreshing');
			if(this.platform.is('cordova')){
			console.log('cordova platform');
				this.sqlite.create({name:'appkit', location:'default'}).then(( data: SQLiteObject) => { 
					console.log('sqlite platform');
					this.database = data;
					this.db=this.database;
					console.log(this.db);
					resolve(this.db);
					this.createTable().then(()=>{

					});
					},(error) => {
		            console.error("wrong database", error);
		    	});
			}else{
				this.database = (<any> window).openDatabase("tuteAppBrowser", '1', 'my', 1024 * 1024 * 100); 
				//console.log('on browser');
				//return this.db=this.database;
				this.db=this.database;
				resolve(this.db);
				this.createTable().then(()=>{
				//console.log('contstructor create');
			});
			}
		})
	}

	ExecuteRun(query, valesData){
		//console.log(this.database);
		return new Promise((resolve,reject)=>{
			if(query!=undefined){
				if(this.platform.is('cordova')){
					this.database.executeSql(query, valesData, (result:any) =>{
						resolve(result);
					},(error:any)=>{
						console.error(error);
					});
				}else{
					this.database.transaction((tx)=>{
						tx.executeSql(query, valesData, (tx,result:any)=>{
							resolve(result);
						},(error:any)=>{
							console.error(error);
						});
					})
				}
			}
		})
	}
	delall(){
		if(this.platform.is('cordova')){
			this.database.close();
		}else{
			
		}
	}
	
	createTable(){
		let columns=[];
		let columnsproduct=[];
		let columnMeta=[];
		let tableName:any;
		let tableNamepage:any;
		let tableNamepro;
		return new Promise((resolve,reject)=>{
		//console.log('before load');	
		this.load().then((result:any)=>{
			//console.log('after load');	
			this.Apidata=result;
			//for( let app in result){
				

					if("app_pages" in result){
						//console.log('pages');
						tableNamepage="app_pages";
						for(let app_keys in result.app_pages[0]){
							columns.push(app_keys+' TEXT');
						}
						this.query='CREATE TABLE IF NOT EXISTS '+tableNamepage+'('+columns.join(",")+')';
						this.ExecuteRun(this.query, []).then((resultpages:any)=>{
							//console.log(resultpages);
							this.insertPages(this.database, this.Apidata,tableNamepage).then((result)=>{
								console.log();
							});
						})
					}
					if("app_products" in result){
						//console.log('product');
						tableNamepro="app_products";
						for(let app_keys in result.app_products[0]){
	                		columnsproduct.push(app_keys+' TEXT');
	            		}
	            		this.query='CREATE TABLE IF NOT EXISTS '+tableNamepro+'('+columnsproduct.join(",")+')';
	            		this.ExecuteRun(this.query, []).then((resultproduct:any)=>{
	            			//console.log(resultproduct);
							this.insertProduct(this.database,result,tableNamepro).then(()=>{

							})
						});
	            	}
	            	if("app_name" in result){
	            		//console.log('meta');
		            	for(let app_keys in result){
		            		tableName="Meta";
			                if(typeof result[app_keys]!= "object"){
			                    columnMeta.push(app_keys + ' TEXT');
			                }
			            }
			            this.query='CREATE TABLE IF NOT EXISTS '+tableName+'('+columnMeta.join(",")+')';
		            	this.ExecuteRun(this.query, []).then((data:any)=>{
							this.metaQuery(this.database,result,tableName).then((resultappkit)=>{
								//console.log(resultappkit)
							})	
						});
	            	}
	            	resolve('true');
				
				
		})
		})
	}
	insertProduct(db,record,tableName){
		let columns = [];
	    let values =[];
	    let slugdata;
	    return new Promise((resolve,error)=>{
	    	if(record!=''){
	    		for(let tableColumns in record.app_products[0]){
	           		columns.push(tableColumns)
	        	}
	        	for(let productkey of record.app_products){
		            let v=[];
		            for(let key in productkey){
		              let json;
		                if(key=='product_attributes'){
		                  json=JSON.stringify(productkey[key]);
		                }else{
		                  json=productkey[key];
		                }
		               v.push(json);
		            }//console.log(v);
	          		values.push(v);
	        	}
	    	}
	    	if(db != undefined){
	    		this.query='SELECT slug FROM '+tableName;
	    		this.ExecuteRun(this.query, [] ).then((result1 : any)=>{
	    			if(result1.rows.length > 0){
	    				// this.update(values,db,tableName, columns);
	    				this.query='Delete  from '+tableName;
							this.ExecuteRun(this.query,[]).then((result:any)=>{	
								//console.log('deelteing app apges');
								this.insertData(values,db,tableName, columns).then((ll)=>{
        						//console.log(ll);
        						});
							});
	    			}else{
	    				this.insertData(values,db,tableName, columns);
	    			}
	    		})
	        }
	    });
	}

	metaQuery(db,record,tableName){
		let columnMeta=[];
	    let values =[];
	    let tablekeys;
	    return new Promise((resolve,error)=>{
	    	if(record != ''){
	    		for(let tablekeys in record){
			        if(typeof record[tablekeys]!= "object"){
			           columnMeta.push(tablekeys);
			           values.push(record[tablekeys]);
			        }
				}
	    		this.query='SELECT  app_domain FROM '+tableName;
	    		this.ExecuteRun('SELECT  app_domain FROM '+tableName, []).then((result : any)=>{
	    			//console.log(result);
	    			if(result.rows.length > 0){
	    				//console.log('update');
	    				let meta;
	    				//console.log(result);
                   		meta=result.rows.item(0).app_domain;
                   		//console.log(meta);
	                    let questionMarks=[];
	                    for(let j=0; j < values.length; j++){
	                       questionMarks.push("?");
	                    }
	                    values.push(meta);
	                    this.query='UPDATE '+tableName +' SET '+ columnMeta.join('=?, ')+' = ? where app_domain = ?';
	                    this.ExecuteRun(this.query, values).then((hh)=>{
	                    	let AppkitMeta;
	                    	//console.log(hh);
	                    	 if(result.rows.length>0){
	                       for(let i=0; i < result.rows.length; i++){
	                              AppkitMeta=result.rows[i];
	                       }
	                       
	                      	resolve(AppkitMeta);
	                   }
	                    });
	    			}else{
	    				//console.log('insert');
	    				let questionMarks=[];
	                    for(let j = 0; j < values.length; j++){
	                        questionMarks.push("?");
	                    }
	                    this.query='INSERT INTO '+tableName + '(' + columnMeta+ ') VALUES (' +questionMarks + ')';
	                    this.ExecuteRun(this.query, values).then((hh)=>{
	                    	//console.log(hh);
	                    	let AppkitMeta;
	                    	console.log(hh);
	                    	 if(result.rows.length>0){
	                       for(let i=0; i < result.rows.length; i++){
	                              AppkitMeta=result.rows.item(i);
	                       }
	                          
	                       resolve(AppkitMeta);
	                   }
	                    });
	    			}
	    		})
	    	}
		 })
	}
	insertPages(db,record,tableName){
		let columns = [];
	    let values = [];
	    let slugdata;
		return new Promise((resolve,reject)=>{
			if(record != ''){
               //process columns form record variable
                for(let tableColumns in record.app_pages[0]){
                    columns.push("'"+tableColumns+"'");
                }
               //process values from record variable
                if(record.app_pages.length > 0){
                    if(record.app_pages != undefined){
                        for(let appData of record.app_pages){

                            let v = [];
                             let w=[];
                            for(let keys in appData){
                                if(record.app_pages != undefined || appData != undefined){
                                    v.push(appData[keys]);
                                }
                            }
                        values.push(v);
                            }
                        //console.log(values);
                    }
                }      
        	}
        	if(db != undefined){
        		this.query='SELECT slug FROM '+tableName;
        		this.ExecuteRun(this.query,[]).then((result1 : any)=>{
        			//console.log(result1);
        			if(result1.rows.length > 0){
        				
        				for (var i = 0; i <= result1.rows.length ; i++) {
	                        if(result1.rows[i] != undefined){
	                            slugdata=this.slugs.push(result1.rows.item(i).slug);
	                        }
                   		}
                   		if(this.slugs.length > 0){
                    		// this.update(values,db,tableName, columns).then((update)=>{
                    		// 	//console.log(update);
                    		// });
                    		this.query='Delete  from '+tableName;
                    		//console.log('Delete  from '+tableName)
							this.ExecuteRun(this.query,[]).then((result:any)=>{	
								//console.log('deelteing app apges');
								this.insertData(values,db,tableName, columns).then((ll)=>{
        						//console.log(ll);
        						});
							});
                    	}
        			}else{
        				this.insertData(values,db,tableName, columns).then((ll)=>{
        					//console.log(ll);
        				});
        			}
        		});
        	}

		})
	}

	insertData(values,db, tableName, columns, i = 0){
		return new Promise((resolve,reject)=>{
			//console.log('insert');
			if(values[i] != undefined){
		        let questionMarks = [];
		        for(let j = 0; j< values[i].length; j++){
		           questionMarks.push('?');
		        }
		        this.query = 'INSERT INTO '+tableName+' ( '+columns.join(',')+' ) VALUES ('+questionMarks.join(',')+')';
		        this.ExecuteRun(this.query, values[i]).then((result)=>{
		        	//console.log(result)
		        	this.insertData(values,db,tableName,columns,i = i+1);
		        });
	   		 }
		});
	    
	}
	update(values,db, tableName, columns, i = 0){
		//console.log('update');
		return new Promise((resolve,reject)=>{
	    if(values[i] != undefined){
	        db.transaction((tx) => {
	            values[i].push(this.slugs[i]);
	            let questionMarks = [];
	            for(let j = 0; j< values[i].length; j++){
	              questionMarks.push('?');
	            }  
	            this.query = 'UPDATE '+tableName+' SET '+columns.join(' = ? ,')+' = ? where slug = ?';
		        this.ExecuteRun(this.query, values[i]).then((result)=>{
		        	resolve(result);
		        	this.update(values,db, tableName, columns, i = i+1);
		        });
	        })
	    }
	});
	}
	SelectPages(tableName){
		let AppkitPage=[];
		let slughome;
	    if(this.db!=undefined){
	    	 let i;
	        return new Promise((resolve,reject)=>{
	        	//console.log(tableName);
	        	this.query='Select * from '+tableName;
	        	this.ExecuteRun(this.query,[]).then((resultpages:any)=>{
	        		console.log(resultpages.rows);
	        		resolve(resultpages);
	        	})
	       
	      
	      }); 
	    }
	}
SelectProducts(tableName){
	  let key;
	  let i;
   let data = [];
    if(this.db!=undefined){
    	//console.log('databasde product');
        return new Promise((resolve,reject)=>{
        	this.query='Select * from '+tableName;
	        this.ExecuteRun(this.query,[]).then((resultproduct:any)=>{
		        		//console.log(resultproduct);
		        		this.AppkitProducts=[];
                 
                  for(i = 0; i < resultproduct.rows.length; i++){
                     let temp = resultproduct.rows.item(i);
                     temp.product_attributes = JSON.parse(temp.product_attributes);
                     this.AppkitProducts.push(temp)
                  }  
                  //console.log(this.AppkitProducts); 
                 resolve(this.AppkitProducts);
		    })
            
        })
        
    }
}
ProductDetail(tableName,id){
	 let productDetail;
    if(this.db!=undefined){
        return new Promise((resolve,reject)=>{
        	this.query='Select * from '+tableName + ' where id = '+ id;
        	console.log('Select * from '+tableName + ' where id = '+ id);
	        this.ExecuteRun(this.query,[]).then((result:any)=>{
	        	  productDetail=result.rows.item(0);
           productDetail.product_attributes=JSON.parse(productDetail.product_attributes);
           console.log(productDetail);
          resolve(productDetail);
		    })
            
        })
        
    }
}

	SelectMeta(tableName){
		let AppkitMeta;
	    if(this.db!=null){
	        return new Promise((resolve,reject)=>{
	            	//console.log('here 1');
	            	this.query='Select * from '+tableName;
	               this.ExecuteRun(this.query,[]).then((result:any)=>{
	                	//console.log(result.rows);
	                	//resolve(result.rows);
	                   if(result.rows.length>0){
	                       for(let i=0; i < result.rows.length; i++){
	                              AppkitMeta=result.rows.item(i);
	                       }
	                          	//console.log(AppkitMeta);
	                       resolve(AppkitMeta);
	                   }
	                });

	           
	        });
	    }
	}
	DeleteAll(){	 
		return new Promise((resolve,reject)=>{
			let i;
			let data=[];
		    let hh=[ 'app_pages', 'app_products', 'Meta'];
		    console.log(hh.length);
			for( i=0; i < hh.length; i++){
				data.push(hh[i]);
				this.query='Delete  from '+hh[i];
				//console.log('Delete  from '+hh[i]);
				this.ExecuteRun(this.query,[]).then((result:any)=>{	
					resolve(result);
				});
			}
			// window.location.reload();
			// t
	  	});
	}

	load(){
		return new Promise ((resolve,reject)=>{
			this.http.get('http://aione.oxosolutions.com/api/android/').subscribe(data=>{
				this.Apidata=data.json().data;
				//console.log(this.Apidata);
				resolve(this.Apidata);
				
			},error=>{
				console.error(error);
			})
		})
	}
	ionViewDidLoad(){
   console.log('database ionview did load')
   }



}
