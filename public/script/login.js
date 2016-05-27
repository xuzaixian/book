(function(){
    var submitButton = document.getElementById("submitButton");
    submitButton.addEventListener('click',postHandler);
})()

function postHandler(event){
    event.preventDefault();
    var userid = document.getElementById("inputUserid").value,
        password = document.getElementById("inputPassword").value,
        remember = document.getElementById("ifremember").checked;
    password = md5(password);
    var data = {
        "userid":userid,
        "password":password,
        "remember":remember
    }
    postData(data);
}

function postData(data){
//    $.ajax({
//        type:"post",
//        url:"/login_handler",
//        data:data,
//        success:function(data){
//            location.href='book';
//        },error:function(data){
//            alert("false");
//        }
//        
//    })
    var xhr = new XMLHttpRequest();
    xhr.open("post","/login_handler",true);
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function(){
        var data = null;
        if(xhr.readyState === 4 && xhr.status === 200){
            location.href='book';
        }
    }
}