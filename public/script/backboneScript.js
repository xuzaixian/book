var itemView = Backbone.View.extend({
    el : $(".main-item"),
    
    render : function(context){
        var template : _.template($("#date-temple").html());
        $(this.el).html(template(context));
    }
    events : {
        "click .delete-btn" : "delete-item"
    }
});

var itemModel = Backbone.Model.extend({
    url : '/item',
    
    defaults : {
      icon : "",
      detail : "something",
      count : 10
    },
    initialize : function(){
        this.bind("change:detail",function(){
            
        });
        this.bind("change:count",function(){
            
        });
    },
    validate:function(attributes){
        if(attributes.detail == ""){
            return "detail不能为空";
        }
        if(attributes.count == ""){
            return "count不能为空";
        }
    }

                                    
    //event handller
    delete-item : function(){
        
    }
});

var itemList = Backbone.Collection.extend({
    url : "/items",
    model : itemModel,
    this.fetch({
        reset:true,
        success:function(collection, response, options){
            collection.each(function(book){
                alert(book.get('title'));
            });
        },error:function(collection, response, options){
            alert('error');
        }
    }),
        
})