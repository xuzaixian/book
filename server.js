var koa = require('koa');
var router = require('koa-router');
var static = require('koa-static');
var logger = require('koa-logger');
var view = require('koa-view');
var koabody = require('koa-body')();
var session = require('koa-session');
var md5 = require('blueimp-md5');
var MongoClient = require('mongodb').MongoClient;

var app = koa();
var index = router(),
    login = router(),
    book = router(),
    login_handler = router(),
    getData = router(),
    addItem = router();

//app config

//logger
app.use(logger());
//config static files dir
app.use(static(__dirname+'/public'));
//config view folder
app.use(view(__dirname+'/views'));
//cookies key
app.keys = ['baobao','keai'];
//session 
app.use(session(app));
//app router

book.get('/book',function*(){
    if(!this.session.login){
        this.body = "login first";
    }else{
        yield this.render('index'); 
    }
});

login.get('/login',function *(){
    this.status = 200;
    yield this.render('login');
});

index.get('/',function *(){
    if(this.session.isNew){
        this.status = 304;
        this.redirect('/login'); 
    }else{
        if(this.session.login){
            this.redirect('/book');
        }
    }
});

login_handler.post('/login_handler',koabody,
    function *(next){
        this.status = 200;
        this.login_data = JSON.parse(this.request.body);
        yield next;
    },
    function *(next){
        var psw = yield this.mongo.db('book').collection('user').findOne({id:this.login_data.userid});
        if(this.login_data.password === md5(psw.password)){
            this.status = 304;
            this.session.login = true;
            this.session.id = this.login_data.userid;
            this.redirect('/book');
        }
    }
);

getData.post('/getdata',koabody,
    function *(next){
        this.status = 200;
        var db = yield MongoClient.connect("mongodb://115.28.81.27:27017/book");
        var collection = db.collection(this.session.id);
        var docs = yield collection.find().toArray();
        this.ary = docs;
        yield next;
        this.body = this.ary;
    },
    function *(next){
        var json = JSON.parse(this.request.body);
        var ary = this.ary,
            data = [],
            year = json.year,
            month = json.month;

        for(var i=0;i<ary.length;i++){
            if(ary[i].year!=year){
                continue;
            }
            if(ary[i].month!=month){
                continue;
            }
            var detail = {
                detail:ary[i].detail,
                count:ary[i].count,
                type:ary[i].type  
            };
            if(!data[ary[i].day]){
                data[ary[i].day] = {
                    day:null,
                    detail:[]
                };
                data[ary[i].day].day = ary[i].day;
                data[ary[i].day].detail = [];
                data[ary[i].day].detail.push(detail);                
            }else{
                data[ary[i].day].detail.push(detail);
            }
        }

        for(var j=0;j<data.length;j++){
            if(data[j]===undefined){
                data.splice(j,1);
                j--;
            }
        }
        this.ary = data.reverse();
    }
);

addItem.post('/addItem',koabody,function *(next){
    var item = JSON.parse(this.request.body);
    //connect DB
        var db = yield MongoClient.connect("mongodb://115.28.81.27:27017/book");
        var collection = db.collection(this.session.id);
        collection.insertOne(item);
  });
  
//regist router
app.use(index.routes())
   .use(index.allowedMethods());
app.use(login.routes())
   .use(login.allowedMethods());
app.use(login_handler.routes())
   .use(login_handler.allowedMethods());
app.use(book.routes())
   .use(book.allowedMethods());
app.use(getData.routes())
   .use(getData.allowedMethods());
app.use(addItem.routes())
   .use(addItem.allowedMethods());
 //create server
app.listen(3333);

/*
转账 rmb
娱乐  gamepad
购物 shopping-bag
交通 bus
餐饮 cutlery
*/