var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://115.28.81.27:27017/book",function(err,db){
    if(err){
        console.error(err);
    }
    var mycollection = db.collection("xzx");
    mycollection.insert({a:"a"});
    
    
    mycollection.find().toArray(function(err,docs){
            if(err){
                console.error(err);
            }
        console.log("Found the following records");
        console.dir(docs);
    });
    
    
    db.close();
});