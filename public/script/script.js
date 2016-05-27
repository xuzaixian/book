//var Vue = require('vue');//webpack does work 
(function(window){
    function initVue(){
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
                        vue.calculateTotal();
                    }
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
    }

    function initEchart(echart1,echart2){
        //draw echarts
        var option1 = {
                title : {
                    text: '每月财务情况概览',
                    x:'center'
                },
                textStyle:{
                    fontSize:40
                },
                series : [
                    {
                        name:'面积模式',
                        type:'pie',
                        roseType : 'area',
                        data:[
                            {value:10, name:'转账'},
                            {value:5, name:'交通'},
                            {value:15, name:'娱乐'},
                            {value:25, name:'饮食'},
                            {value:20, name:'购物'},
                        ]
                    }
                ]
        };
        echart1.setOption(option1);
    }
    
    function btn1_handler(){
        vueUl.style.display = "block";
        chart1.style.display = "none";
        chart2.style.display = "none";
        btns.style.display = "block";
    }

    function btn2_handler(){
        vueUl.style.display = "none";
        chart1.style.display = "block";
        chart2.style.display = "none";
        btns.style.display = "none";
        echart1.resize();
    }

    function btn3_handler(){
        vueUl.style.display = "none";
        chart1.style.display = "none";
        chart2.style.display = "block";
        btns.style.display = "none";
        echart2.resize();
    }
    
    function addPanel_handler(){
        addPanel.className = "add-panel-transition";
    }
    
    function addPanel_add(){
        
        vue.getData();
        
    }
    
    function addPanel_cancle(){
        addPanel.className = "";
    }
    
    function initListener(){
        var btn1 = document.getElementById("btn1"),
            btn2 = document.getElementById("btn2"),
            btn3 = document.getElementById("btn3");
        btn1.addEventListener('click',btn1_handler);
        btn2.addEventListener('click',btn2_handler);
        btn3.addEventListener('click',btn3_handler);
        addbtn.addEventListener('click',addPanel_handler);
        addPanel_add.addEventListener('click',addPanel_add);
        addPanel_cancle.addEventListener('click',addPanel_cancle);
    }
    
    function init(){
        initVue();
        initEchart(echart1,echart2);
        initListener();
    }

    //定义两个图标的容器并且实例化
    var chart1 = document.getElementById("chart1"),
        chart2 = document.getElementById("chart2"),
        echart1 = echarts.init(chart1),
        echart2 = echarts.init(chart2),
        vueUl = document.getElementById("main"),
        btns = document.getElementById("btns"),
        addbtn = document.getElementById("add-btn"),
        deletedbtn = document.getElementById("delete-btn"),
        addPanel_add = document.getElementById("add-submit"),
        addPanel_cancle = document.getElementById("add-cancle"),
        addPanel = document.getElementById("add-panel");
    
    init();
})(window)