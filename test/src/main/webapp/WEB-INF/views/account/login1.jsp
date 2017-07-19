<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page import="org.apache.shiro.web.filter.authc.FormAuthenticationFilter"%>
<%@ page import="org.apache.shiro.authc.ExcessiveAttemptsException"%>
<%@ page import="org.apache.shiro.authc.IncorrectCredentialsException"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<input id="ctx" type="hidden" value="${pageContext.request.contextPath}" />
<html>
  <head>
	<meta charset="UTF-8" /> 
    <title>登录页</title>
	<script type="text/javascript" src="${ctx}/static/base/jquery.min.js?v="></script>
	<script type="text/javascript" src="${ctx}/static/base/jquery.cookie.js?v="></script>
	<script>
		function checkUserName(){
			var username = $("#username").val();
			var uSpan = $("#usernameSpan");
			var errorInfo = $("#errorInfo");
			if(username == ""){
				uSpan.css("display","block");
			}else{
				uSpan.css("display","none");
			}
			errorInfo.css("display","none");
		}
		
		function checkPassWord(){
			var password = $("#password").val();
			var pwdSpan = $("#pwdSpan");
			var errorInfo = $("#errorInfo");
			if(password == ""){
				pwdSpan.css("display","block");
			}else{
				pwdSpan.css("display","none");
			}
			errorInfo.css("display","none");
		}
		
		function checkInputCode(){
			var inputCode = $("#inputCode").val();
			var codeSpan = $("#codeSpan");
			var errorInfo = $("#errorInfo");
			if(inputCode == ""){
				codeSpan.css("display","block");
			}else{
				codeSpan.css("display","none");
			}
			errorInfo.css("display","none");
		}
		
		function checkInfo(){
			var username = $("#username").val();
			var password = $("#password").val();
			var inputCode = $("#inputCode").val();
			var uSpan = $("#usernameSpan");
			var pwdSpan = $("#pwdSpan");
			var codeSpan = $("#codeSpan");
			uSpan.css("display","none");
			pwdSpan.css("display","none");
			codeSpan.css("display","none");
			
			if (username == "" && password == "") {
				uSpan.css("display","block");
				pwdSpan.css("display","block");
				return false;
			}
			if (username == "") {
				uSpan.css("display","block");
				return false;
			} else if (password == "") {
				pwdSpan.css("display","block");
				return false;
			}
			
			if ($("#checkCodeDiv").length > 0) {
				if (inputCode == "") {
					codeSpan.css("display","block");
					return false;
				}
				
			}
		}
	</script>
    <style type="text/css">
    	body,ul,li,div,span,p{padding:0;margin:0;}
    	ul,li{list-style:none;}
    	body{background:url(${ctx}/static/page/img/bodyBg.png);}
    	.hidden{display:none;}
    	.cross{height:400px;position:absolute;top:20%;left:0;right:0;background:url(${ctx}/static/page/img/blackBack.png);}
    	.mainBox{margin:0 auto;width:980px;height:400px;}
    	.mainLeft{width:538px;height:400px;float:left;background:url(${ctx}/static/page/img/jxhdImg.png) no-repeat 40px;}
    	.mainRight{width:442px;height:400px;float:left;background:url(${ctx}/static/page/img/whiteBack.png);}
    	.logo{width:364px;height:40px;padding:30px 0 0 78px;}
    	.title{width:442px;height:60px;line-height:60px;text-align:center;font-size:18px;font-family:"微软雅黑";color:#3c4258;}
    	.dataForm{width:442px;height:250px;}
    	.dataForm table{width:100%;}
    	.dataForm table .left{text-align:right;width:108px;font-size:18px;font-family:"微软雅黑";color:#3c4258;}
    	.dataForm table .right{text-align:left;font-family:"微软雅黑";color:#3c4258;}
    	.dataForm table tr td{height:45px;line-height:45px;}
    	.nobg{background:none;border:1px solid #626262;}
    	.loginInput{border-radius:5px;height:30px;padding-left:10px;width:200px;font-size:14px;color:#3c4258;}
    	.loginBtn{background:url(${ctx}/static/page/img/loginBtn.png);border:none;width:94px;height:39px;cursor:pointer;}
    	.Link{width:500px;height:40px;line-height:40px;position:fixed;bottom:0;}
    	.Link ul{width:500px;height:40px;line-height:40px;margin-left:30px;}
    	.Link ul li{height:40px;line-height:40px;padding:0 5px;float:left;color:white;}
    	.Link ul li a{height:30px;line-height:30px;color:white;font-size:12px;text-decoration:none;filter: Alpha(Opacity=50); opacity: 0.5;}
    	.Link ul li a:hover{filter: Alpha(Opacity=100); opacity: 1;}
    	.message{width:442px;height:30px;line-height:30px;text-align:center;font-size:14px;font-family:"微软雅黑";color:red;}
    	.errorInfo{width:280px;height:30px;padding:0 81px;}
    	.errorInfo span{font-size:12px;font-family:"微软雅黑";display:block;padding:5px 5px 5px 20px;background:#FFF2F2 url(${ctx}/static/page/img/error.png) no-repeat 2px 6px;border:1px solid #FF8080;}
    	.errorSpan{background:url(${ctx}/static/page/img/error.png) no-repeat 4px 10px;display:block;float:left;width:20px;height:30px;display:none;}
    </style>
  </head>
  <body>
  	<img id="login_bg" alt="" src="${ctx}/static/page/img/bodyBg.png" style="position:absolute;width:100%;height:100%;z-index:-1;">
	<div class="cross">
		<div class="mainBox">
			<div class="mainLeft"></div>
			<div class="mainRight">
				<div class="logo"><img id="login_logo" alt="" src=""></div>
				<div id="login_title" class="title"></div>
				<c:if test="${error != '' && error != null}">
					<div class="errorInfo" id="errorInfo">
						<span>${error}</span>
					</div>
				</c:if>
				<div class="dataForm">
					<form action="${ctx}/login" method="post" id="login-form" name="loginForm" onsubmit="return checkInfo()">
						<table border="0" cellspacing="5">
							<tr>
								<td class="left">账号:</td>
								<td class="right">
									<input class="loginInput nobg" id="username" name="username"
								type="text" autocomplete="off" tabindex="1"
								placeholder="请输入登录帐号" data-holder="z-placeholder"
								onblur="checkUserName()" value="" style="float:left;"  />
								<span id="usernameSpan" class="errorSpan"></span>
								</td>
							</tr>
							<tr>
								<td class="left">密码:</td>
								<td class="right">
									<input class="loginInput nobg" id="password" name="password"
								type="password" autocomplete="off" tabindex="2"
								placeholder="请输入登录密码" data-holder="z-placeholder"
								onblur="checkPassWord()" value="" style="float:left;" />
								<span id="pwdSpan" class="errorSpan"></span>
								</td>
							</tr>
							<c:if test="">
								<tr id="checkCodeDiv">
									<td class="left">验证码:</td>
									<td class="right">
										<input class="loginInput nobg" id="inputCode" name="inputCode"
									type="text" autocomplete="off" tabindex="2"
									placeholder="请输入验证码" data-holder="z-placeholder"
									onblur="checkInputCode()" value="" style="float:left;width:100px;vertical-align:middle;" />
									<img id="checkCodeImg" alt="" src="" onclick="getCheckCode();" style="float:left;height:34px;margin-left:6px;">
									<span id="codeSpan" class="errorSpan"></span>
									</td>
								</tr>
							</c:if>
							<!-- <tr>
								<td class="left"></td>
								<td class="right" style="font-size:14px;"><input type="checkbox" />记住密码</td>
	 						</tr> -->
							<tr>
								<td class="left"></td>
								<td class="right"><input class="loginBtn" type="submit" value="" /></td>
							</tr>
						</table>
					</form>
				</div>
			</div>
		</div>
	</div>
	<div id="login_link" class="Link" style="display:none;">
		<ul>
			<li><a href="http://www.weixiaotong.cn/" target="_blank">微校通首页</a></li>
			<li><a href="http://www.weixiaotong.com.cn/contact-us.html" target="_blank">关于我们</a></li>
			<li><a href="http://www.weixiaotong.com.cn/zsjm.html" target="_blank">联系我们</a></li>
			<li><a href="#">隐私保护</a></li>
			<li><a href="#">版权声明</a></li>
			<li><a href="#">相关帮助</a></li>
		</ul>
	</div>
  </body>
<!-- api参数 -->
<script>

/**
 * 获取网站配置信息
 */
function getWebConfig(){
	$.ajax({
		type: "GET",
		url: "${ctx}/static/page/js/webConfig.json",
		dataType: "json",
		async:false,
		success: function(datas){
			var host = document.domain;
			var webConfig;
			for(var i=0;i<datas.length;i++){
				var webHosts = ","+datas[i].host+",";
				if(new RegExp(","+host+",").test(webHosts)){
					webConfig = datas[i];
				}
			}
			if(typeof(webConfig) === "undefined"){
				webConfig = datas[0];
			}
			$("#login_title").text(webConfig.config.login_title);
			$("#login_bg").attr("alt",webConfig.config.login_bg.alt);
			$("#login_logo").attr("alt",webConfig.config.login_logo.alt);
			if(webConfig.config.login_logo.src===""){
				$("#login_logo").hide();
			}else{
				$("#login_logo").attr("src","${ctx}"+webConfig.config.login_logo.src);
			}
			if(webConfig.config.login_link)
				$("#login_link").show();
		}
	});
}
		$(document).ready(function() {
			getWebConfig();
			getOs();
		});
		function getOs()
		{
			var explorer = window.navigator.userAgent ;
			if(explorer.indexOf("Chrome") >= 0){
			}else{
				alert("您使用的不是Chrome浏览器，请下载最新的Chrome浏览器，以达到最佳体验！");
			}
		}
</script>
</html>
