<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%> 
<!DOCTYPE html>
<html>
<head>
     <meta name="renderer" content="webkit">
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
     <link rel="shortcut icon" href="resource/images/favicon.ico" type="image/x-icon"/>
     <title>智慧养老综合运营平台</title>
	<%@ include file="common/css.ftl" %>
	<link rel="stylesheet" type="text/css" href="/resource/css/callInfo.css">
</head>
<body>
<div class="ui-layout-wrapper">
<%@ include file="common/utils.ftl" %>
	<!-- center -->
	<div class="ui-layout-center">	   
        <div id="contentDiv">
            <div class ="commonView" id="indexCommonView">	            	
				<!-- 右侧的内容展示 都放在这里 -->
			</div>
        </div>	    
	</div>
</div>
<%@ include file="common/js.ftl" %>
<script>
$(function(){
	<c:if test="${change_password}">
		//修改密码dialog
		$("#setDialog").createDialog({
			width:360,
			height:395,
			title:'修改密码<em class="redTit">（为了你的账户安全，请及时修改密码）</em>',
			url:'/common/updatePwd',
			buttons:{
				"保存":function(event){
					$("#settingForm").submit();
				},
				"取消":function(){
					$(this).dialog("close");
				}
			}
		});
	</c:if>
	
	//左侧导航高度设置
	heightResize();
	function heightResize(){
		var hzHeight = document.documentElement.clientHeight-$(".ui-layout-north").height();
		$(".ui-layout-wrapper").height(hzHeight);
		//$(".ui-layout-west").height($(".ui-layout-wrapper").height());
		console.log(hzHeight);
	}
	$("window").resize(function(){
		heightResize();
	});
});
</script>

</body>
</html>