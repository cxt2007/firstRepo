<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="renderer" content="webkit">
<title>测试平台</title>
<link rel="shortcut icon" href="/resource/images/favicon.ico" type="image/x-icon"/>
<link type="text/css" href="/resource/css/reset.css" rel="stylesheet" />
<link type="text/css" href="/resource/css/tips.css" rel="stylesheet" />
<link type="text/css" href="/resource/css/login.css" rel="stylesheet" />
</head>

<body onload="loadImag()">
<div class="dcd-login" id="productLogin">
  <div class="dcd-logCon">
    <div class="dcd-logo">运营管理后台</div>
    <div class="dcd-loginC">
      <div class="dcd-logform">
        <form method="post" action="/login" id="loginForm" onsubmit=''>
        <input id="uuid" name="uuid" type="hidden" value="${uuid}"/>
          <div class="inputSearch inputSearchTxt" for="username">
            <div class="searchT username">
              <label>用户名</label>
              <input id="username" type="text" placeholder="请输入用户名" class="inputText" name="username" value="${username}"/>
            </div>
          </div>
          <div class="inputSearch inputSearchPwd" for="password">
            <div class="searchT password">
              <label>密&nbsp;&nbsp;码</label>
              <input id="password" type="password" placeholder="请输入密码" class="inputText" name="password"/>
            </div>
          </div>
          <!-- 
          <div for="validateCode" class="validateCode">
            <div class="codeInputDiv" >
                <input  placeholder="请输入验证码" id="validateCode" type="text" class="inputText codeInput" name="validateCode" />
            </div>
            
            <div id="validate" class="codeImgDiv" >
                <img  class='saveimg' id="vcode" src='' alt='' onclick="loadImag()" />
            </div>
           
        </div>-->
          <div class="inputBtn"><a href="javascript:;" class="dcd-login" id="submithref" name="submithref">登&nbsp;&nbsp;录</a></div>
          <div class="inputSearchCheckbox">
            <label>
              <input type="checkbox" id="rememberMe" name="rememberMe" value="true" <#if rememberMe == true>checked="checked"</#if>/>
           <!--   <a href="javascript:;" class="fn-right">&nbsp;忘记登录密码？</a> --> 
              <span>&nbsp;记住用户名</span> 
            </label>
          </div>
          <div id="loginInfo"> </div>
        </form>
      </div>
    </div>
  </div>
  <div class="copyright">
  	<span class="fn-right hidden">
  		<a href="javascript:;">关于我们 </a>|
  		<a href="javascript:;">帮助中心</a>|
  		<a href="javascript:;">法律声明</a>
  	</span>
  	<span id="frontpageBottomPage">技术支持：测试</span>
  </div>
</div>
<script src="/resource/js/base/jquery.base.js"></script>
<script src="/resource/js/base/validate.js"></script>
<script src="/resource/js/libs/formValidate.js"></script>
<script type="text/javascript" src="/resource/js/base/jQuery.md5.js?ver=1.0"></script>
<script src="/resource/js/base/uuid.js"></script>
<script>
$.fn.extend({
	dialogtip:function(option){
		var defaultOption={
			className: 'tip-error',
			showOn: 'none',
			alignTo: 'target',
			hideTimeout:0,
			showTimeout:0,
			alignX: 'center',
			alignY: 'bottom',
			offsetX: 0,
			offsetY: 5
		}
		$.extend(defaultOption,option);
		$(this).poshytip(defaultOption);
	}
})

function loadImag(){
		$("#uuid").val(uuid());
		$("#vcode").attr("src","/code/image?uuid=" + codeKey);
}
function formOnsubmit(){
	
}
$(function(){
	$("#username").focus();
   
	//表单提交
	$("#submithref").click(function(){
        $('#loginForm').submit();
    });

    $("#username,#password").bind("keydown",function(evt){
        var evt = window.event?window.event:evt;
        if(evt.keyCode==13){
            $('#loginForm').submit();
        }
    });
    
    $("#loginForm").formValidate({
    	/*
        submitHandler: function(form) {
        	var flg = validateCode();
    		if(!flg){
        		$("#loginInfo").text("验证码错误！");
        		loadImag();
        		return;
        	}
    		$("#loginInfo").text("系统登录中...");
        	$("#submithref").attr('disabled', true);
        	var p = $("#password").val();
        	if(p!=$.cookie("password")){
        		$("#password").val($.md5(p));
        	}
            return true;
        },*/
        rules: {
            username:{
                required:true
            },
            password:{
                required:true
            },
            validateCode:{
                required:true
            }
        },
        messages: {
            username:{
                required:"用户名不能为空！"
            },
            password:{
                required:"密码不能为空！"
            },
            validateCode:{
                required:"验证码不能为空！"
            }
        }
    });
    
    function validateCode(){
	  	var flg;
	 	$.ajax({
	 		url:'/code/volidatecode',
	 		type:'post',
	 		async: false,
	 		data:{"uuid":$("#uuid").val(),"code":$("#validateCode").val()},
	 		success:function(data){
	 			flg =  data;
	 		}
	 	})
	 	return true;
	 }
    function downBrowser(){
        var down = $("#downBrowser"),
            innerBox = down.find('.innerBox'),
            curtain = down.find('.curtain'),
            bg  = down.find('.bgShadow');
        
        innerBox.hover(function(){
            bg.css({'opacity':'0'}).stop().animate({'opacity':'0.5'},function(){
                bg.css({'height':'132px'});
                curtain.slideDown(300);
            })
        },function(){
            curtain.slideUp('300',function(){
                bg.css({'height':'inherit'}).stop().animate({'opacity':'0'});
            })
        })
        
    }
    downBrowser();
});
</script> 
</body>
</html>
