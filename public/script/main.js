/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	//var Vue = require('vue');//webpack does work 
	(function(window){
	    Vue.config.debug = true;
	    Vue.config.delimiters = ['${','}'];
	    var dateVue = new Vue({
	        el: "#infor",
	        data:{
	            year:"",
	            month:"",
	            spend:0,
	            earn:0,
	            count:null
	        },
	        created:function(){
	            this.year = this.getPresentYear();
	            this.month = this.getPresentMonth();
	        },
	        methods:{
	             getPresentMonth : function(){
	                return new Date().getMonth();
	             },
	             getPresentYear : function(){
	                return new Date().getFullYear();
	             },
	        }
	    });
	    var vue = new Vue({
	        el: "#main",
	        replace:false,
	        data:{
	            items:null,
	            classes:{
	                "transfer":"fa-jpy",
	                "entertainment":"fa-gamepad",
	                "shopping":"fa-shopping-bag",
	                "food":"fa-cutlery",
	                "traffic":"fa-bus"
	            }
	        },
	        created:function(){
	            this.getData();
	        },
	        methods:{
	            getData:function(month){
	                var xhr = new XMLHttpRequest(),
	                    date = {
	                        "year" : dateVue.year,
	                        "month" : dateVue.month
	                    },
	                    method = "post",
	                    url = "/getdata";
	                    data = JSON.stringify(date);
	                xhr.open(method,url,true);
	                xhr.setRequestHeader("Accept","application/json");
	                xhr.onreadystatechange = function(){
	                    var data = null;
	                    if(xhr.readyState === 4 && xhr.status === 200){
	                        data = xhr.responseText;
	                        data = JSON.parse(data);
	                        vue.items = data;
	                    }
	                    vue.calculateTotal();
	                }
	                xhr.send(data);
	            },
	            calculateTotal:function(){
	                var data = this.items,
	                    earn = 0,
	                    spend = 0,
	                    count = {
	                        transfer:0,
	                        entertainment:0,
	                        shopping:0,
	                        traffic:0,
	                        food:0
	                    };
	                data.forEach(function(item,index){
	                    item.detail.forEach(function(item,index){
	                        if(item.count<0){
	                            spend += item.count;
	                        }else{
	                            earn += item.count;
	                        }
	                        count[item.type] += item.count;
	                    });
	                });
	                dateVue.spend = spend;
	                dateVue.earn = earn;
	                dateVue.count = count;
	            }
	        }
	    });
	    
	    //draw echarts

	})(window)

/***/ }
/******/ ]);