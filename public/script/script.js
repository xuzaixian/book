//var Vue = require('vue');//webpack does work 
(function(window){
    function ajax(type,url,data,callback){
        if(!xhr){
            var xhr = new XMLHttpRequest();
        }
        xhr.open(type,url,true);
        xhr.setRequestHeader("Accept","application/json");
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                callback(JSON.parse(xhr.responseText));
            }
        }
        xhr.send(JSON.stringify(data));
    }
    function initVue(){
        Vue.config.debug = true;
        Vue.config.delimiters = ['${','}'];
        dateVue = new Vue({
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
                 onChangHandler : function(){
                     vue.getData();
                 }
            }
        });
        vue = new Vue({
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
            getData:function(){
                var xhr = new XMLHttpRequest(),
                    date = {
                        "year" : parseInt(dateVue.year),
                        "month" : parseInt(dateVue.month)
                    },
                    method = "post",
                    url = "/getdata",
                    data = date;
                ajax(method,url,data,function(msg){
                    vue.items = msg;
                    vue.calculateTotal();
                });
                
//                xhr.open(method,url,true);
//                xhr.setRequestHeader("Accept","application/json");
//                xhr.onreadystatechange = function(){
//                    var data = null;
//                    if(xhr.readyState === 4 && xhr.status === 200){
//                        data = xhr.responseText;
//                        data = JSON.parse(data);
//                        vue.items = data;
//                        vue.calculateTotal();
//                    }
//                }
//                xhr.send(data);
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
                    subtext: 'x',
                    x:'center'
                },
                textStyle:{
                    fontSize:20
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:['转账','交通','娱乐','饮食','购物']
                },
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
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
        btns.style.display = "block";
    }
    function btn2_handler(){
        vueUl.style.display = "none";
        chart1.style.display = "block";
        btns.style.display = "none";
        echart1.resize();
    }
    function addPanel_handler(){
        addPanel.className = "add-panel-transition";
    }
    function addPanel_add_handler(){
        var date = document.getElementById("panel-date").valueAsDate,
            data = {
                "year":date.getFullYear(),
                "month":date.getMonth()+1,
                "day":date.getDate(),
                "type":document.getElementById("panel-type").value,
                "detail":document.getElementById("panel-detail").value,
                "count":document.getElementById("panel-count").value
            },
            radios = document.querySelector(".radio-input");
            if(radios.checked){
                data.count = data.count * -1;
            }
        ajax("post","/addItem",data,function(msg){
            console.log(msg);
        });
        vue.getData();
        addPanel_cancle_handler();
    }
    function addPanel_cancle_handler(){
        addPanel.className = "";
    }
    function initListener(){
        btn1.addEventListener('click',btn1_handler);
        btn2.addEventListener('click',btn2_handler);
        addbtn.addEventListener('click',addPanel_handler);
        addPanel_add.addEventListener('click',addPanel_add_handler);
        addPanel_cancle.addEventListener('click',addPanel_cancle_handler);
    }
    function init(){
        initVue();
        initEchart(echart1);
        initListener();
    }

    //定义两个图标的容器并且实例化
    var chart1 = document.getElementById("chart1"),
        echart1 = echarts.init(chart1),
        vueUl = document.getElementById("main"),
        btns = document.getElementById("btns"),//最下面的记一笔
        addbtn = document.getElementById("add-btn"),
        deletedbtn = document.getElementById("delete-btn"),
        addPanel_add = document.getElementById("add-submit"),
        addPanel_cancle = document.getElementById("add-cancle"),
        addPanel = document.getElementById("add-panel"),
        btn1 = document.getElementById("btn1"),
        btn2 = document.getElementById("btn2"),
        vue,
        dateVue;
    
    init();
})(window)