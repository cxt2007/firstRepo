var MAIN_MANAGE_PRODUCT_FIND_ADVISETYPE = $("#MAIN_MANAGE_PRODUCT_FIND_ADVISETYPE").val();
var MAIN_MANAGE_PRODUCT_SAVE_ADVISEINFO = $("#MAIN_MANAGE_PRODUCT_SAVE_ADVISEINFO").val();
var MAIN_MANAGE_PRODUCT_FIND_DLSINFO = $("#MAIN_MANAGE_PRODUCT_FIND_DLSINFO").val();
var COMMON_MESSAGE_FIND_UNREAD = $("#COMMON_MESSAGE_FIND_UNREAD").val();
var main_ctx = $("#main_ctx").val();
var commonUrl_ajax = $("#commonUrl_ajax").val();
var main_userid = $("#main_userid").val();
var main_orgcode = $("#main_orgcode").val();
var main_campusid = $("#main_campusid").val();
var main_editor;

/**
 * 获取网站配置信息
 */
function getWebConfig(){
	$.ajax({
		type: "GET",
		url: main_ctx + "/static/pixelcave/page/js/webConfig.json",
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
			$("#indexLogin_logo").css("backgroundImage","url("+main_ctx+webConfig.config.indexLogin_logo.src+")");
			$("#indexLogin_customer").css("backgroundImage","url("+main_ctx+webConfig.config.indexLogin_logo.src+")");
			$("#indexLogin_customer").css("backgroundRepeat","no-repeat");
			$("#contact_information").html(webConfig.config.contact_information);
			if(webConfig.config.indexLogin_webStatement)
			  $("#indexLogin_webStatement").show();
			$(".web-favicon-icon").attr("href",main_ctx+webConfig.config.web_favicon_icon);
			$(document).attr("title",webConfig.config.title);
		}
	});
}

$(document).ready(function() {
	getWebConfig();
	//$("iframe [src='static_1.htm']").remove();
	createUnreadMessageBox();
	$("#adviseSubmit").click(function(){
		saveAdviseInfo();
	});
});

function profileSet1() {
	var pwdReg=/^[A-Za-z0-9_]{6,12}$/;
	var pwd = $('#password-floatBox').val();
	if($('#password-floatBox').val() != $('#confirm-password-floatBox').val()) {
		alert("两次密码输入不一致，请重新输入");
		return ;
	}else if($('#password-floatBox').val().length == 0 || $('#confirm-password-floatBox').val().length == 0) {
		alert("请设置新密码");
		return ;
	}else if(!pwdReg.test(pwd)) {
		alert("密码由6-12位的英文、数字和下划线组成");
		return ;
	}else if(pwd.replace(/\d/g,"").length == 0 || pwd.replace(/[a-zA-z]/g,"").length == 0) {
		alert("密码必须同时包含英文和数字");
		return ;
	}else {
		if (confirm("是否确定继续操作？")) {
			var url = main_ctx+"/profile";
			var submitData = {
				id : main_userid,
				plainPassword : $("#confirm-password-floatBox").val()
			};
			$.post(url, submitData, function(data) {
				$("#pwdCoverBg").css("display","none");
				$("#pwdModifyBox").css("display","none");
				alert(data);
			});
		}
	}
}
function showAdvise(){
	getAdviseType();
	$('#modal-advise').modal('show');
}

function hideAdvise(){
	$('#modal-advise').modal('hide');
	$("#advisePersonName").val("");
	$("#phoneNumber").val("");
	$("#adviseType").find("option").remove();
	$("#adviseType").trigger("chosen:updated");
	$("#adviseContent").val("");
	main_editor.html("");
}

KindEditor.ready(function(K) {
	var folder = "adviseContent";
	main_editor = K.create('textarea[name="adviseContent"]', {
		cssPath : main_ctx + '/static/kindeditor/plugins/code/prettify.css',
		uploadJson : main_ctx + '/filehandel/kindEditorUpload/' + folder + '/image',
		fileManagerJson : main_ctx + '/filehandel/kindEditorFileManager',
		allowFileManager : true,
		afterCreate : function() {
			var self = this;
			K.ctrl(document, 13, function() {
				self.sync();
				document.forms['inputForm'].submit();
			});
			K.ctrl(self.edit.doc, 13, function() {
				self.sync();
				document.forms['inputForm'].submit();
			});
		},
		afterBlur : function() {
			this.sync();
		}
	});
	// prettyPrint();
});

function getAdviseType(){
	var param = {}
	var submitData = {
		api : MAIN_MANAGE_PRODUCT_FIND_ADVISETYPE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result != null && result != "" && result.ret.code == "200"){
			for (var i = 0; i < result.data.adviseTypeList.length; i++) {
				$("#adviseType").append('<option value='+result.data.adviseTypeList[i].id+'>'+result.data.adviseTypeList[i].value+'</option>');
				$("#adviseType").trigger("chosen:updated");
			}
		}else{
			$("#adviseType").append('<option value="0">'+result.ret.msg+'</option>');
			$("#adviseType").trigger("chosen:updated");
		}
	});
}

function saveAdviseInfo(){
	var adviseContent = $("#adviseContent").val();
	var adviseType = $("#adviseType").val();
	var advisePersonName = $("#advisePersonName").val();
	var phoneNumber = $("#phoneNumber").val();
	var param = {
		content 			: adviseContent,
		phoneNumber			: phoneNumber,
		advisePersonName	: advisePersonName,
		adviseType			: adviseType
	}
	if(adviseContent == ""){
		alert("请填写反馈内容");
		return;
	}
	var submitData = {
		api : MAIN_MANAGE_PRODUCT_SAVE_ADVISEINFO,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result != null && result != "" && result.ret.code == "200"){
			hideAdvise();
			alert("感谢您的意见和建议，我们一直在努力！");
		}else{
			alert(result.ret.msg);
		}
	});
}

function createUnreadMessageBox(){
		var submitData = {
			api:COMMON_MESSAGE_FIND_UNREAD,
			param:JSON.stringify({
				userid:main_userid,
				orgcode:main_orgcode,
				messagelimit:3
			})
		};
		$.post(commonUrl_ajax, submitData,function(datas) {
			var result = typeof datas === "object" ? datas : JsonsUtil.parse(jsonTrim(datas));
			if(result.ret.code==="200"){
				var unreadMessageBox = new Array();
				if(result.data.messageList.length===0){
					unreadMessageBox.push('<li class="dropdown-header text-center">没有未读消息</li>');
				}else{
					for(var i=0;i<result.data.messageList.length;i++){
						unreadMessageBox.push('<li class="navbar-default border-bottom"><a href="'+main_ctx+'/jyhd/tz/1?appid=23&tabType=receivedMsg&viewMessageId='+result.data.messageList[i].id+'&viewMessageSerialNumber='+result.data.messageList[i].serialnumber+'&viewMessageContentType='+result.data.messageList[i].contenttype+'" class="messageBox">'+result.data.messageList[i].addresser+'：'+result.data.messageList[i].title+'</a></li>');
					}
				}
				unreadMessageBox.push('<li class="text-center">');
				unreadMessageBox.push('<a href="'+main_ctx+'/jyhd/tz/1?appid=23&tabType=receivedMsg"><i class="fa fa-search pull-right"></i>查看全部</a>');
				unreadMessageBox.push('</li>');
				unreadMessageBox.push('<li class="divider"></li>');
				unreadMessageBox.push('<li class="text-center">');
				unreadMessageBox.push('<a href="'+main_ctx+'/jyhd/tz/1?appid=23"><i class="fa fa-paper-plane pull-right"></i>发送消息</a>');
				unreadMessageBox.push('</li>');
				$("#unreadMessageBox").html(unreadMessageBox.join(""));
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		});
	}

/**
 * 过滤json不能识别特殊字符
 * @param str
 * @returns
 */
function jsonTrim(str){
	str = str.replace(/\t/g,'');
	return str;
}