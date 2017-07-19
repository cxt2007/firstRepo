var ctx = "";

var TablesDatatables = function() {
	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();
var deptIds = $("#deptIds").val();
var courseIds = $("#courseIds").val();

var defineGrilImage = "http://jeff-ye-1978.qiniudn.com/girlteacher.jpg";
var defineBoyImage = "http://jeff-ye-1978.qiniudn.com/boyteacher.jpg";

$(document).ready(function() {
	$(".usersex").change(function(){
		var $selectedvalue = $("input[name='usersex']:checked").val();
		if($("#userIconpath")[0].src==defineGrilImage||$("#userIconpath")[0].src==defineBoyImage){
			if ($selectedvalue == 1) {
				$("#userIconpath").attr('src',defineBoyImage); 
			} else {
				$("#userIconpath").attr('src',defineGrilImage);
			}
		}
	});
		$("#name").focus();
		$("#loginName").focus();
		// 验证编号是否重复
		$("#saveSubmit").click(function() { // 点击保存按钮

					$("#teacher_form").validate({
						errorClass : 'help-block animation-slideDown',
						errorElement : 'div',
						errorPlacement : function(
								error, e) {
							e
									.parents(
											'.form-group > div')
									.append(
											error);
						},
						highlight : function(
								e) {
							$(e)
									.closest(
											'.form-group')
									.removeClass(
											'has-success has-error')
									.addClass(
											'has-error');
							$(e)
									.closest(
											'.help-block')
									.remove();
						},
						success : function(
								e) {
							e
									.closest(
											'.form-group')
									.removeClass(
											'has-success has-error');
							e
									.closest(
											'.help-block')
									.remove();
						},
						rules : {
							loginName : {
								required : true
							},
							name : {
								required : true
							},
							plainPassword : {
								required : true
							},
							roles : {
								required : true
							},
							position : {
								required : true
							},
						},
						messages : {
							loginName : {
								required : '请填写用户名'
							},
							name : {
								required : '请填写教师姓名'
							},
							plainPassword : {
								required : '请填写登录密码'
							},
							roles : {
								required : '请选择用户角色'
							},
							position : {
								required : '请填写教师职位'
							},
						},
					});
					
					var name = $("#username").val();
					if(name == '' || name == null ){
						alert("请输入教师姓名！");
						activeTab("basicInfo-tab");
						return false;
					}
					var loginName = $("#loginName").val();
					if(loginName == '' || loginName == null ){
						alert("请输登录名！");
						activeTab("basicInfo-tab");
						return false;
					}
					var plainPassword = $("#plainPassword").val();
					if(plainPassword == '' || plainPassword == null ){
						alert("请输入密码！");
						activeTab("basicInfo-tab");
						return false;
					}
					
					var campusid = $("#campusid").val();
					if (campusid == undefined
							|| campusid == null
							|| campusid == "") {
						alert("校区不能为空，请选择校区!");
						return false;
					}
					
					var _position = $("#_position").val();
					if(_position == '' || _position == null ){
						alert("请输入职位！");
						activeTab("brief-tab");
						return false;
					}
					
				
					$("#saveServiceSubmit").attr("disabled",true);
					$("#saveBriefSubmit").attr("disabled",true);
					$("#name").val(name);
					$("#iconpath").val($("#userIconpath")[0].src);
					$("#birthday").val($("#userBirthday").val());
					$("#resume").val($("#_resume").val());
					$("#position").val($("#_position").val());
					$("#jobnumber").val($("#jobnumbertemp").val());
					
					
					$("#xb").val($("input[name='usersex']:checked").val());
					
					if($("input[name='userifshow']:checked").val() == 1 ){
						$("#ifshow").val($("input[name='userifshow']:checked").val());
					}else{
						$("#ifshow").val(0);
					}
					
					if($("input[name='userreview']:checked").val() == 1 ){
						$("#review").val($("input[name='userreview']:checked").val());
					}else{
						$("#review").val(0);
					}
					$("#isscqx").val(1);
//					if($("input[name='userisscqx']:checked").val() == 1 ){
//						$("#isscqx").val($("input[name='userisscqx']:checked").val());
//					}else{
//						$("#isscqx").val(0);
//					}

		});
		queryDeptList();
		queryCourse();
		$("#campusid").change(function() {
			queryDeptList();
			getSerchFormBjsjList();
			queryCourse();
		});

		$("#teacherDept").change(function() {
			$("#deptIds").val($("#teacherDept").val());
		});

		$("#courseList").change(function() {
			$("#courseIds").val($("#courseList").val());
		});
		
		$("#saveServiceSubmit").click(function(){
			$("#saveSubmit").click();
			$("#saveSubmit").submit();
		});
		
		$("#saveBriefSubmit").click(function(){
			$("#saveSubmit").click();
			$("#saveSubmit").submit();
		});
		
		$("#removeBinding").click(function(){
			if (confirm("确定解除教师绑定状态?")) {
				removeBinding();
			} else {
				return false;
			}
		});
		initWebUploader();
});


function activeTab(tabName){
	$(".nav-tabs").find("li").removeClass("active");
	var navTabs = $(".nav-tabs").find("a");
	navTabs.each(function(i){ 
		if($(this).attr("href") == ("#"+tabName)){
			$(this).parent().addClass("active"); 
		}
	});
	$(".tab-content").find(".tab-pane").removeClass("active");
	$("#"+tabName).addClass("active");
}

KindEditor.ready(function(K) {
	var folder = "jsgl";
	editor = K.create('textarea[name="_resume"]', {
		cssPath : ctx + '/static/kindeditor/plugins/code/prettify.css',
		uploadJson : ctx + '/filehandel/kindEditorUpload/' + folder + '/image',
		fileManagerJson : ctx + '/filehandel/kindEditorFileManager',
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

function getSerchFormBjsjList() {
	var url = ctx + "/xtgl/teacher/findBjsjByCampusid";
	var submitData = {
		campusid : $("#campusid").val() + "",
	};
	$.post(url, submitData, function(data) {
		var datas = eval(data);
		$("#bjids option").remove();// user为要绑定的select，先清除数据
		for (var i = 0; i < datas.length; i++) {
			$("#bjids").append(
					"<option value=" + datas[i].id + " >"
							+ datas[i].wxXxCampus.campus + "-" + datas[i].bj
							+ "</option>");
		}
		;
		$("#bjids").multiselect('refresh');
	});
}

function checkloginName() {
	if ($("#loginName").val() == "") {
		return;
	}
	var a = true;
	jQuery.ajax({
		type : "get",
		url : ctx + "/xtgl/teacher/checkloginName",
		async : false,
		cache : false,
		data : {
			loginName : $("#loginName").val(),
			id : $("#id").val(),
			method : "get"
		},
		dataType : "html",
		scriptCharset : "UTF-8",
		success : function(s) {
			if (s != "true") {
				a = false;
			}
		}
	});
	if (a != true) {
		pyjc = '该用户名已经被占用！';
		alert($("#loginName").val() + pyjc);
		$("#loginName").val('');
	}
}

/**
 * 验证工号唯一性
 */
function verifyjobnumber() {
	var jobnumber=$("#jobnumbertemp").val();

	if(jobnumber==undefined || jobnumber==null || jobnumber==''){
		return;
	}
	var campusid = $("#campusid").val();
	var param = {
		campusids :campusid.toString(),
		teacherid:$("#id").val(),
		jobnumber:jobnumber
	};
	var params={params:param,readonly:true};
	var submitData = {
		apiparams : JSON.stringify(params)
		
	};
	var result=true;
	$.ajax({
		cache:false,
		type: "POST",
		url: ctx+"/securityapi/user_verifyjobnumber",
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				if(result.data==false){
					activeTab("basicInfo-tab");
					alert("工号:"+jobnumber+"已存在,请修改!");
					$("#jobnumber").val("");
					$("#jobnumbertemp").val("");
					result= false;
				}else{
					result= true;
				}
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
				result= true;
			}
		}
	});
	return result;
}

function passwordClear() {
	var action = $("#action").val();

	if (action == 'create') {
		$("#plainPassword").val('');
	}

	// $("#loginName").attr('type','password');
}

$(function() {
	$("#bjids").multiselect({
		selectedList : 20
	});
	$("#campusid").multiselect({
		selectedList : 20
	});
	$("#courseList").multiselect({
		selectedList : 20
	});
});

document.addEventListener('DOMContentLoaded', init, false);
function init() {
	var u = new UploadPic();
	u
			.init({
				input : document.querySelector('.input'),
				callback : function(base64) {
					document.querySelector('.bigImg').innerHTML = "<img id='srcImg' src='"
							+ base64 + "'>";
					document.querySelector('.previewImg').innerHTML = "<img id='previewImg' src='"
							+ base64 + "' style='width:100px;height:100px;'>";
					$("#bigImage").val(base64);
					popupDiv('pop-div');
					cutImage();
				},
				loading : function() {
					// document.querySelector('.imgzip').innerHTML =
					// '读取中，请稍候...';
				}
			});
}

function UploadPic() {
	this.sw = 0;
	this.sh = 0;
	this.tw = 0;
	this.th = 0;
	this.scale = 0;
	this.maxWidth = 0;
	this.maxHeight = 0;
	this.maxSize = 0;
	this.fileSize = 0;
	this.fileDate = null;
	this.fileType = '';
	this.fileName = '';
	this.input = null;
	this.canvas = null;
	this.mime = {};
	this.type = '';
	this.callback = function() {
	};
	this.loading = function() {
	};
}

UploadPic.prototype.init = function(options) {
	/*
	 * var xScroll = (document.documentElement.scrollWidth >
	 * document.documentElement.clientWidth) ?
	 * document.documentElement.scrollWidth :
	 * document.documentElement.scrollWidth;
	 */
	var xScroll = 900;
	this.maxWidth = options.maxWidth || xScroll;
	this.maxHeight = options.maxHeight || xScroll;

	this.maxSize = options.maxSize || 8 * 1024 * 1024;
	this.input = options.input;
	this.mime = {
		'png' : 'image/png',
		'jpg' : 'image/jpeg',
		'jpeg' : 'image/jpeg',
		'bmp' : 'image/bmp'
	};
	this.callback = options.callback || function() {
	};
	this.loading = options.loading || function() {
	};

	this._addEvent();
};

/**
 * @description 绑定事件
 * @param {Object}
 *            elm 元素
 * @param {Function}
 *            fn 绑定函数
 */
UploadPic.prototype._addEvent = function() {
	var _this = this;

	function tmpSelectFile(ev) {
		_this._handelSelectFile(ev);
	}

	this.input.addEventListener('change', tmpSelectFile, false);
};

/**
 * @description 绑定事件
 * @param {Object}
 *            elm 元素
 * @param {Function}
 *            fn 绑定函数
 */
UploadPic.prototype._handelSelectFile = function(ev) {
	var file = ev.target.files[0];

	this.type = file.type;

	// 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题）
	if (!this.type) {
		this.type = this.mime[file.name.match(/\.([^\.]+)$/i)[1]];
	}

	if (!/image.(png|jpg|jpeg|bmp)/.test((this.type).toLowerCase())) {
		alert('对不起，您选择的文件类型不是图片！');
		return;
	}

	if (file.size > this.maxSize) {
		alert('对不起，您选择的文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择！');
		return;
	}

	this.fileName = file.name;
	this.fileSize = file.size;
	this.fileType = this.type;
	this.fileDate = file.lastModifiedDate;

	this._readImage(file);
};

/**
 * @description 读取图片文件
 * @param {Object}
 *            image 图片文件
 */
UploadPic.prototype._readImage = function(file) {
	var _this = this;

	function tmpCreateImage(uri) {
		_this._createImage(uri);
	}

	this.loading();

	this._getURI(file, tmpCreateImage);
};

/**
 * @description 通过文件获得URI
 * @param {Object}
 *            file 文件
 * @param {Function}
 *            callback 回调函数，返回文件对应URI return {Bool} 返回false
 */
UploadPic.prototype._getURI = function(file, callback) {
	var reader = new FileReader();
	var _this = this;

	function tmpLoad() {
		// 头不带图片格式，需填写格式
		var re = /^data:base64,/;
		var ret = this.result + '';

		if (re.test(ret))
			ret = ret.replace(re, 'data:' + _this.mime[_this.fileType]
					+ ';base64,');

		callback && callback(ret);
	}

	reader.onload = tmpLoad;

	reader.readAsDataURL(file);

	return false;
};

/**
 * @description 创建图片
 * @param {Object}
 *            image 图片文件
 */
UploadPic.prototype._createImage = function(uri) {
	var img = new Image();
	var _this = this;

	function tmpLoad() {
		_this._drawImage(this);
	}

	img.onload = tmpLoad;

	img.src = uri;
};

/**
 * @description 创建Canvas将图片画至其中，并获得压缩后的文件
 * @param {Object}
 *            img 图片文件
 * @param {Number}
 *            width 图片最大宽度
 * @param {Number}
 *            height 图片最大高度
 * @param {Function}
 *            callback 回调函数，参数为图片base64编码 return {Object} 返回压缩后的图片
 */
UploadPic.prototype._drawImage = function(img, callback) {
	this.sw = img.width;
	this.sh = img.height;
	this.tw = img.width;
	this.th = img.height;

	this.scale = (this.tw / this.th).toFixed(2);

	this.sw = this.maxWidth;
	this.sh = Math.round(this.sw / this.scale);

	if (this.sh > this.maxHeight) {
		this.sh = this.maxHeight;
		this.sw = Math.round(this.sh * this.scale);
	}

	this.canvas = document.createElement('canvas');
	var ctx = this.canvas.getContext('2d');

	this.canvas.width = this.sw;
	this.canvas.height = this.sh;

	ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.sw, this.sh);

	this.callback(this.canvas.toDataURL(this.type));

	ctx.clearRect(0, 0, this.tw, this.th);
	this.canvas.width = 0;
	this.canvas.height = 0;
	this.canvas = null;
};

function popupDiv(div_id) {
	var div_obj = $("#" + div_id);
	var windowWidth = document.body.scrollWidth;
	var windowHeight = document.body.scrollHeight;
	var popupHeight = div_obj.height();
	var popupWidth = div_obj.width();

	// 添加并显示遮罩层
	$("<div id='mask'></div>").addClass("mask").width(windowWidth).height(
			windowHeight).click(function() {
		// hideDiv(div_id);
	}).appendTo("body").fadeIn(200);

	div_obj.css({
		"position" : "absolute"
	}).animate({
		left : windowWidth / 2 - popupWidth / 2,
		top : 0,
		opacity : "show"
	}, "slow");
}

function hideDiv(div_id) {
	document.querySelector('.input').value = "";
	$("#mask").remove();
	$("#" + div_id).animate({
		left : 0,
		top : 0,
		opacity : "hide"
	}, "slow");
}

// 裁剪图像
function cutImage() {
	$("#srcImg").Jcrop({
		aspectRatio : 1,
		onChange : showCoords,
		onSelect : showCoords,
		setSelect : [ 0, 0, 400, 400 ]
	});

	// 简单的事件处理程序，响应自onChange,onSelect事件，按照上面的Jcrop调用
	function showCoords(obj) {
		$("#x").val(obj.x);
		$("#y").val(obj.y);
		$("#w").val(obj.w);
		$("#h").val(obj.h);
		if (parseInt(obj.w) > 0) {
			// 计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
			var rx = 80 / obj.w;
			var ry = 80 / obj.h;

			// 通过比例值控制图片的样式与显示
			$("#previewImg").css({
				width : Math.round(rx * $("#srcImg").width()) + "px",
				height : Math.round(rx * $("#srcImg").height()) + "px",
				marginLeft : "-" + Math.round(rx * obj.x) + "px",
				marginTop : "-" + Math.round(ry * obj.y) + "px"
			});
		}
	}
}

function crop_submit() {
	$("#crop_form").submit();
}

function saveConfirm() {
	$(".popUpBox,.popUpBoxBg").show();
}

function saveImage() {
	var url = ctx + "/xtgl/teacher/uploadImage";
	var submitData = {
		orgcode : $("#orgcode").val(),
		bigImage : $("#bigImage").val(),
		x : $("#x").val(),
		y : $("#y").val(),
		w : $("#w").val(),
		h : $("#h").val(),
		id : $("#id").val()
	};
	if ($("#id").val() != "") {
		$.post(url, submitData, function(data) {
			hideDiv('pop-div');
			alert("照片更新成功！");
			location.reload();
		});
	} else {
		$.post(url, submitData, function(data) {
			hideDiv('pop-div');
			alert("照片上传成功！");
			$("#idimg").attr("src",data);
			$("#iconpath").attr("value",data);
		});
	}
	
}

function isShowRecevieDiv(){
	var roles = $("#roles").val();
	if(roles == "leader"){
		$("#isreceiveDiv").css("display", "block");
	}else{
		$('#isreceive').find("option[value='0']")
		.attr("selected", true);
		$('#isreceive').trigger("chosen:updated");
		$("#isreceiveDiv").css("display","none");
	}
}

function uploadImg() {
	var namedItem = "uploadfileinfo";
	var oData = new FormData(document.forms.namedItem(namedItem));
	oData.append("CustomField", "This is some extra data");
	var oReq = new XMLHttpRequest();
	oReq.open("POST",
			ctx+"/xtgl/xsjb/picupload?isAjax=true&resType=json", true);
	
	oReq.onload = function(oEvent) {
		if (oReq.status == 200 && oReq.responseText != '') {
			$("#userIconpath").attr('src',oReq.responseText); 
		} 
	};
	oReq.send(oData);
} ;

function resetConfirm() {
	if (confirm("确定重置该教师密码?")) {
		return true;
	} else {
		return false;
	}
}

function removeBinding(){
	var url = ctx + "/xtgl/teacher/removeBinding";
	var submitData = {
		userid: $("#id").val(),
		campusid: main_campusid.split(",")[0]
	};
	$.post(url, submitData, function(data) {
		if(data == "success"){
			$("#bandingState").html("未绑定");
			$("#removeBinding").hide();
			$("#slaveuser").val('');
			PromptBox.alert("解除成功！");
		}else{
			PromptBox.alert(data);
		}
	});
}

function queryDeptList(){
	var deptIdsArry = deptIds.split(",");
	var param = {
		campusid : $("#campusid").val().toString(),
		type : "0"
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_DEPTLIST_BY_TYPE,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#teacherDept option").remove();
			for (var j = 0; j < result.data.length; j++) {
				var select = "";
				if($.inArray(result.data[j].id.toString(), deptIdsArry) != "-1"){
					select = "selected"
				}
				$("#teacherDept").append('<option value="' + result.data[j].id + '" ' + select + '>' 
						+ result.data[j].deptname + '</option>');
			}
			$("#teacherDept").trigger("chosen:updated");
		}
	});
}

function queryCourse(){
	var courseidsArry = courseIds.split(",");
	var param = {
		campusid : $("#campusid").val().toString()
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#courseList option").remove();// user为要绑定的select，先清除数据
			for (var i = 0; i < result.data.courseList.length; i++) {
				var select = "";
				if($.inArray(result.data.courseList[i].courseid.toString(), courseidsArry) != "-1"){
					select = "selected"
				}
				$("#courseList").append(
						"<option value=" + result.data.courseList[i].courseid + " " + select + " >"
								+ result.data.courseList[i].campusname+"-"+result.data.courseList[i].coursename + "</option>");
			};
			$("#courseList").multiselect('refresh');
		}
	});
}

function addClassSelect(){
	var deptIdsArry = deptIds.split(",");
	var param = {
		campusid : $("#campusid").val().toString()
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_CLASS,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			var option = "";
			for (var i = 0; i < result.data.bjList.length; i++) {
				if($("#campusid").val() != null && $("#campusid").val().toString().indexOf(",") == -1){
					option += '<option value="'+result.data.bjList[i].id+'">'+result.data.bjList[i].bj+"--"+result.data.bjList[i].wxXxCampus.campus+'</option>';
				}else{
					option += '<option value="'+result.data.bjList[i].id+'">'+result.data.bjList[i].bj+'</option>';
				}
			}
			var classSelect = '<select name="classSelect">'+option+'</select>';
			if(result.data.bjList.length > 0){
				addCourseSelect(result.data.bjList[0].campusid,classSelect);
			}
		}
	});
}

function addCourseSelect(currentCampusid,classSelect){
	var param = {
		campusid : currentCampusid
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			var option = "";
			for (var i = 0; i < result.data.courseList.length; i++) {
				option += '<option value="'+result.data.courseList[i].courseid+'">'+result.data.courseList[i].coursename+'</option>';
			}
			var courseSelect = '<select name="courseSelect">'+option+'</select>';
			var li = '<li>'
				   + '	<span class="l">'+ classSelect +'</span>'
				   + '	<span class="r">'+ courseSelect +'</span>'
				   + '</li>';
			$("#classCorseBox").append(li);
		}
	});
}

function initWebUploader(){
	// 初始化Web Uploader
	var uploader = WebUploader.create({
	    // 选完文件后，是否自动上传。
	    auto: true,
	    // swf文件路径
	    swf: ctx + '/static/js/webuploader/Uploader.swf',
	    // 文件接收服务端。
	    server: ctx+"/klxx/wlzy/swfupload",
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    pick: {
	    	id :'#filePicker',
	    	multiple : false
	    },
	    // 只允许选择图片文件。
	    accept: {
	        title: 'Images',
	        extensions: 'gif,jpg,jpeg,bmp,png',
	        mimeTypes: 'image/*'
	    }
	});
	
	// 当有文件添加进来的时候
	uploader.on( 'fileQueued', function( file ) {
        $('#userIconpath').attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
	    $('#userIconpath').attr( 'src', response.picUrl );
	});
	
	// 文件上传失败，显示上传出错。
	uploader.on( 'uploadError', function( file ) {
	    var $li = $( '#'+file.id ),
	        $error = $li.find('div.error');

	    // 避免重复创建
	    if ( !$error.length ) {
	        $error = $('<div class="error"></div>').appendTo( $li );
	    }

	    $error.text('上传失败');
	});
	
	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on( 'uploadComplete', function( file ) {
	    $( '#'+file.id ).find('.progress').remove();
	});
}