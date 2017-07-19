var ctx = $("#ctx").val();
var saveDraft = "1"; //保存草稿
var saveComplete = "2"; //完成
var templatetype = $("#templatetype").val();

cloudLibrary = {domainName:"static.weixiaotong.com.cn",defaultImageConfig:["@",480,"w_",480,"h_",1,"e_",0,"c_",0,"i_",70,"Q_",1,"x_",1,"o","png"]};

var previewwNum = 0;
var photoArr = new Array();
var previewStuid;
var previewTotal = 0;
var previewList;

var growthRecord = {
	nowpage : 0,
	iDisplayLength : "2",
	defaultBgimage: ""
}

$(document).ready(function() {
	initTemplateList();
	$(".itemList li[templatetype='" + templatetype + "']").trigger("click");
	$("#back-btn").click(function(){
		location.href = ctx + "/base/func/" + ApiParamUtil.GROWTH_PC_JUMP +"?appid=1155";
	});
	queryStudentBaseInfo();
	
	$("#recordTitle").click(function(){
		if($("#recordTitle").find("input").length>0){
			return;
		}else{
			$(this).html('<input type="text" class="title" placeholder="请输入标题" maxlength="10" value="'+$(this).text()+'" />');
			$(this).find("input").blur(function(){
				if($(this).val().length>10){
					PromptBox.alert("标题小于10个字符哦");
					return;
				}
				if($(this).val().length==0|| !$(this).val().replace(/(^\s*)|(\s*$)/g, "")){
					PromptBox.alert("标题别忘了填");
					return;
				}
				$("#recordTitle").text($(this).val());
			}).focus().select();
		}
	});
	
	
});

function changePage(obj) {
	$(".active").removeClass("active");
	$(obj).addClass("active");
	
	templatetype = $(obj).attr("templatetype");
	$("#templatetype").val(templatetype);
	$(".itemContent .current").removeClass("current");
	$("#page_" + templatetype).addClass("current");
	
	if (templatetype != 0 && templatetype != -1) {
		$("#page_" + templatetype + " .record-title").html($(obj).html());
	}
	
	if(templatetype == 0) { //封面
		queryStudentInfo();
	} else if(templatetype == WxXxGrowthTemplate.TYPE_WHO_I_AM) { //瞧！这就是我
		initUploader();
		queryStudentInfo();
		$("#save-student-btn").click(function() {
			saveStuInfo();
		});
	} else if(templatetype == WxXxGrowthTemplate.TYPE_HAPPY_FAMILY) { //幸福一家人
		initUploader();
		queryFamilyInfo();
		$("#save-family-btn").click(function() {
			saveFamilyInfo();
		});
	} else if(templatetype == WxXxGrowthTemplate.TYPE_HAPPY_KINDERGARTEN) { //快乐幼儿园
		initUploader();
		queryRecordInfo(templatetype);
		$("#save-kindergarten-btn").click(function() {
			saveRecordInfo();
		});
	} else if(templatetype == WxXxGrowthTemplate.TYPE_TEACHER_IN_ME_EYES) { //我眼中的老师
		initUploader();
		queryRecordInfo(templatetype);
		$("#save-teacher-btn").click(function() {
			saveRecordInfo();
		});
	} else if(templatetype == WxXxGrowthTemplate.TYPE_ME_IN_TEACHER_EYES) { //老师眼中的我
		initUploader();
		queryRecordInfo(templatetype);
		$("#save-me-btn").click(function() {
			saveRecordInfo();
		});
	} else if(templatetype == WxXxGrowthTemplate.TYPE_MY_BUDDY) { //我的小伙伴
		initUploader();
		queryRecordInfo(templatetype);
		$("#save-friend-btn").click(function() {
			saveRecordInfo();
		});
	} else if(templatetype == WxXxGrowthTemplate.TYPE_LOOK_FUTRUE) { //展望未来
		initUploader();
		queryRecordInfo(templatetype);
		$("#save-future-btn").click(function() {
			saveRecordInfo();
		});
	} else if(templatetype == WxXxGrowthTemplate.TYPE_GROWTH_FOOTMARK 
			|| templatetype == WxXxGrowthTemplate.TYPE_THEME_ACTIVITY 
			|| templatetype == WxXxGrowthTemplate.TYPE_CLASS_DYNAMIC 
			|| templatetype == WxXxGrowthTemplate.TYPE_MY_ARTICLE) {
		$("#growthRecord").addClass("current");
		initUploader();
		setGrowthRecord();
		queryGrowthRecord();
	}
	setLeftHeight();
}

function setLeftHeight() {
	var minHeight = $("#growthMain .itemList .active").height()*13 + 20;
	var currentHeight = $("#growthMain .itemContent").height();
	if (minHeight > currentHeight) {
		$("#growthMain .itemList ul").css("height", minHeight);
		$("#growthMain .itemContent .current").css("height", minHeight);
	} else {
		$("#growthMain .itemList ul").css("height", currentHeight);
	}
}

function initUploader(){
	var filePickers = $("div[name='filePicker']");
	for ( var i = 0; i < filePickers.length; i++) {
		var filePicker = filePickers.eq(i);
		initWebUploader(filePicker.attr("id"));
	}
}

function initTemplateList() {
	var param = {
		campusid: $("#campusid").val(),
		xqbm: $("#xqbm").val()
	};
	var submitData = {
		api : ApiParamUtil.GROWTH_QUERY_TEMPLATE_LIST,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		async: false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				var html = '<li templatetype="0" class="itemTitle active" onclick="changePage(this);">封面</li>';
				if (result.data != null && result.data.length > 0) {
					for (var i = 0; i < result.data.length; i++) {
						html += '<li templatetype="' + result.data[i].templatetype + '" class="itemTitle" onclick="changePage(this);">' + result.data[i].templatename + '</li>';
					}
				}
				html += '<li templatetype="-1" class="itemTitle" onclick="changePage(this);">封底</li>';
				$("#templateList").html(html);
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}


function queryStudentBaseInfo() {
	var param = {
		stuid: $("#growthstuid").val()
	};
	var submitData = {
		api : ApiParamUtil.USER_CENTER_QUERY_STU_INFO,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		async: false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				$("#stuname").html(result.data.stuInfo.xm);
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

/** 瞧！这就是我 start **/
function queryStudentInfo(){
	var param = {
		campusid: $("#campusid").val(),
		growthstuid: $("#growthstuid").val(),
		xqbm: $("#xqbm").val()
	};
	var submitData = {
		api : ApiParamUtil.GROWTH_QUERY_STUDENT_INFO,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		async: false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				setStuInfo(result.data);
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function setStuInfo(data){
	if(data != null){
//		$("#growthstuid").val(data.id);
		if (templatetype == 0) {
			$("#page_0 #campusname").html(data.campusname);
			$("#page_0 #classname").html(data.classname);
			$("#page_0 #stuname").html(data.stuname);
		} else if (templatetype == WxXxGrowthTemplate.TYPE_WHO_I_AM) {
			$("#recordid").val(data.id);
			$("#name").val(data.stuname);
			$("#birthday").val(data.birthday);
			$("#weight").val(data.weight);
			$("#height").val(data.height);
			$("#age").val(data.age);
			if(data.iconpath != null && data.iconpath != ""){
				$("#_iconpath").css("background-image","url("+setOSSImageSize(data.iconpath)+")");
				$("#iconpath").val(data.iconpath);
			}
			
			$("#recordusertype").val(WxXxUser.USER_TYPE_PARENT);
			
			// 是否已完成
			$("#recordstate").val(data.state);
			if(data.state == saveComplete) {
				$("#notice_" + templatetype + " button").attr("disabled", "disabled");
				$("#notice_" + templatetype).attr("onclick", "");
				$("#page_" + templatetype + " .itemTag").removeClass("tagNotCompleted");
				$("#page_" + templatetype + " .itemTag").addClass("tagCompleted");
			} else {
				$("#notice_" + templatetype + " button").removeAttr("disabled");
				$("#notice_" + templatetype).attr("onclick", "promptWindow()");
				$("#page_" + templatetype + " .itemTag").removeClass("tagCompleted");
				$("#page_" + templatetype + " .itemTag").addClass("tagNotCompleted");
			}
			querySex(data.sex);
			queryAnimalSigns(data.animal_signs);
			queryConstellation(data.constellation);
		}
		
	}

}

function querySex(code){
	var param = {
		type: DICTTYPE.DICT_TYPE_SEX
	};
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_DICT,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				$("#sex option").remove();
				for (var i = 0; i < result.data.dictList.length; i++) {
					var selected = "";
					if(result.data.dictList[i].key == code){
						selected = "selected";
					}
					$("#sex").append("<option value=" + result.data.dictList[i].key + " " + selected + ">" + result.data.dictList[i].value + "</option>");
				}
				$("#sex").trigger("chosen:updated");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function queryAnimalSigns(code){
	var param = {
		type: DICTTYPE.DICT_TYPE_ZODIAC
	};
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_DICT,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				$("#animalSigns option").remove();
				for (var i = 0; i < result.data.dictList.length; i++) {
					var selected = "";
					if(result.data.dictList[i].key == code){
						selected = "selected";
					}
					$("#animalSigns").append("<option value=" + result.data.dictList[i].key + " " + selected + ">" + result.data.dictList[i].value + "</option>");
				}
				$("#animalSigns").trigger("chosen:updated");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function queryConstellation(code){
	var param = {
		type: DICTTYPE.DICT_TYPE_CONSTELLATION
	};
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_DICT,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache:false,
		type: "POST",
		async:false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				$("#constellation option").remove();
				for (var i = 0; i < result.data.dictList.length; i++) {
					var selected = "";
					if(result.data.dictList[i].key == code){
						selected = "selected";
					}
					$("#constellation").append("<option value=" + result.data.dictList[i].key + " " + selected + ">" + result.data.dictList[i].value + "</option>");
				}
				$("#constellation").trigger("chosen:updated");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function saveStuInfo(){
	if ($("#recordusertype").val() == WxXxUser.USER_TYPE_TEACHER) {
		$("#recordstate").val(saveComplete);
	}
	
	var param = {
		recordid:$("#recordid").val(),
		stuname : $("#name").val(),
		birthday : $("#birthday").val(),
		sex : $("#sex").val(),
		height : $("#height").val(),
		weight : $("#weight").val(),
		constellation : $("#constellation").val(),
		animal_signs : $("#animalSigns").val(),
		iconpath : $("#iconpath").val(),
		state : $("#recordstate").val()
	};
	var submitData = {
		api : ApiParamUtil.GROWTH_SAVE_STUDENT_INFO,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				PromptBox.alert("保存成功！");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function countAge(obj){
	$("#age").val(jsGetAge($(obj).val()));
}
/** 瞧！这就是我 end **/

/** 幸福一家人 start **/
function queryFamilyInfo(){
	var param = {
		campusid: $("#campusid").val(),
		growthstuid: $("#growthstuid").val(),
		xqbm: $("#xqbm").val(),
		templatetype: templatetype,
	};
	var submitData = {
		api : ApiParamUtil.GROWTH_QUERY_FAMILY,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				setFamilyInfo(result.data);
			}
		}
	});
}

function setFamilyInfo(dataList){
	if(dataList != null && dataList.length > 0){
		var data = dataList[0];
//		$("#growthfamilyid").val(data.id);
		$("#recordid").val(data.id);	
		$("#content").val(data.content);
		$("#familyphoto").val(data.picpath);
		if(data.picpath != null && data.picpath != ""){
			$("#_familyphoto").css("background-image","url("+setOSSImageSize(data.picpath)+")");
			checkPicurl($("#_familyphoto"),data.picpath,(4/3));
		}
		$("#handprint").val(data.handprint);
		if(data.handprint != null && data.handprint != ""){
			$("#_handprint").css("background-image","url("+setOSSImageSize(data.handprint)+")");
			checkPicurl($("#_handprint"),data.handprint);
		}
		$("#footprint").val(data.footprint);
		if(data.footprint != null && data.footprint != ""){
			$("#_footprint").css("background-image","url("+setOSSImageSize(data.footprint)+")");
			checkPicurl($("#_footprint"),data.footprint);
		}
		
		$("#recordusertype").val(data.usertype);
		if (data.usertype == WxXxUser.USER_TYPE_PARENT) {
			$("#notice_" + templatetype).css("display", "block");
		} else {
			$("#notice_" + templatetype).css("display", "none");
		}
		
		// 是否已完成
		$("#recordstate").val(data.state);
		if(data.state == saveComplete) {
			$("#notice_" + templatetype + " button").attr("disabled", "disabled");
			$("#notice_" + templatetype).attr("onclick", "");
			$("#page_" + templatetype + " .itemTag").removeClass("tagNotCompleted");
			$("#page_" + templatetype + " .itemTag").addClass("tagCompleted");
		} else {
			$("#notice_" + templatetype + " button").removeAttr("disabled");
			$("#notice_" + templatetype).attr("onclick", "promptWindow()");
			$("#page_" + templatetype + " .itemTag").removeClass("tagCompleted");
			$("#page_" + templatetype + " .itemTag").addClass("tagNotCompleted");
		}
	}
}

function saveFamilyInfo(){
	if ($("#recordusertype").val() == WxXxUser.USER_TYPE_TEACHER) {
		$("#recordstate").val(saveComplete);
	}
	
	var param = {
		recordid : $("#recordid").val(),
		familyphoto : $("#familyphoto").val(),
		handprint : $("#handprint").val(),
		footprint : $("#footprint").val(),
		content : $("#content").val(),
		state : $("#recordstate").val()
	};
	var submitData = {
		api : ApiParamUtil.GROWTH_SAVE_FAMILY,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache:false,
		type: "POST",
		async:false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200) {
				PromptBox.alert("保存成功！");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}
/** 幸福一家人 end **/

/** 我眼中的老师、老师眼中的我、我的小伙伴、展望未来 start **/
function queryRecordInfo(){
	var param = {
		templatetype: templatetype,
		campusid: $("#campusid").val(),
		growthstuid: $("#growthstuid").val(),
		xqbm: $("#xqbm").val()
	};
	var submitData = {
		api : ApiParamUtil.GROWTH_GROWTH_RECORD_LIST,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				setRecordInfo(result.data);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function setRecordInfo(dataList){
	if(dataList != null && dataList.length > 0){
		var data = dataList[0];
		$("#recordid").val(data.id);
		$("#picpath_" + templatetype).val(data.picpath);
		if(data.picpath != null && data.picpath != ""){
			$("#_picpath_" + templatetype).css("background-image","url("+setOSSImageSize(data.picpath)+")");
			checkPicurl($("#_picpath_" + templatetype),data.picpath,(4/3));
		}
		$("#content_" + templatetype).val(data.content);
		
		if(templatetype == WxXxGrowthTemplate.TYPE_LOOK_FUTRUE) {
			$("#advice_parent").val(data.advice_parent);
			$("#advice_teacher").val(data.advice_teacher);
		}
		
		$("#recordusertype").val(data.usertype);
		if (data.usertype == WxXxUser.USER_TYPE_PARENT) {
			$("#notice_" + templatetype).css("display", "block");
		} else {
			$("#notice_" + templatetype).css("display", "none");
		}
		
		// 是否已完成
		$("#recordstate").val(data.state);
		stateTransformationOfPage(data.state,templatetype);
	}
}

function stateTransformationOfPage(state, templatetype){
	if(state == saveComplete) {
		$("#notice_" + templatetype + " button").attr("disabled", "disabled");
		$("#notice_" + templatetype).attr("onclick", "");
		$("#page_" + templatetype + " .itemTag").removeClass("tagNotCompleted");
		$("#page_" + templatetype + " .itemTag").addClass("tagCompleted");
	} else {
		$("#notice_" + templatetype + " button").removeAttr("disabled");
		$("#notice_" + templatetype).attr("onclick", "promptWindow()");
		$("#page_" + templatetype + " .itemTag").removeClass("tagCompleted");
		$("#page_" + templatetype + " .itemTag").addClass("tagNotCompleted");
	}
}

function saveRecordInfo(){
	if ($("#recordusertype").val() == WxXxUser.USER_TYPE_TEACHER) {
		$("#recordstate").val(saveComplete);
	}
	var param = {
		recordid : $("#recordid").val(),
		picpath : $("#picpath_" + templatetype).val(),
		content : $("#content_" + templatetype).val(),
		state : $("#recordstate").val()
	};
	if(templatetype == WxXxGrowthTemplate.TYPE_LOOK_FUTRUE) {
		param.advice_parent = $("#advice_parent").val();
		param.advice_teacher = $("#advice_teacher").val();
	}
	var submitData = {
		api : ApiParamUtil.GROWTH_GROWTH_RECORD_SAVE,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				PromptBox.alert("保存成功！");
				stateTransformationOfPage($("#recordstate").val(),templatetype);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}
/** 我眼中的老师、老师眼中的我、我的小伙伴、展望未来 end **/


function initWebUploader(id){
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
	    	id :'#'+id,
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
        $('#'+id).parent().find("img").attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
		$('#'+id).parent().find(".imgBox").css("background-image","url("+setOSSImageSize(response.picUrl)+")");
		$('#'+id).parent().find(".imgBox input").val(response.picUrl);
		checkPicurl($('#'+id).parent().find(".imgBox"),response.picUrl,(4/3));
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

/**
 * 检查图片长宽比---只适用于背景图设置
 * @param obj 需要设置背景的对象
 * @param url 图片url地址
 * @param ratio 需要比较的长宽比,不传则为1
 * @returns {Boolean} 如果图片本身的长宽比的值大于等于 ratio 的值，则设置高度100%反之设置宽度100%
 */
function checkPicurl(obj,url,ratio){
	if(url.indexOf("@") > 0 ){
		url = url.split("@")[0];
	}
	if(isNaN(ratio)){
		ratio = 1;
	}
	var img = new Image();
	img.src = url;
	img.onerror = function(){
		console.log("图片加载失败，请检查url是否正确");
		obj.css("background-size","auto 100%");
	};
	if(img.complete){
		console.log(url);
		console.log(img.width+" "+img.height);
		if(img.width/img.height >= ratio){
			obj.css("background-size","auto 100%");
		}else{
			obj.css("background-size","100% auto");
		}
	}else{
		img.onload = function(){
			console.log(url);
			console.log(img.width+" "+img.height);
			img.onload=null;//避免重复加载
			if(img.width/img.height >= ratio){
				obj.css("background-size","auto 100%");
			}else{
				obj.css("background-size","100% auto");
			}
		};
	}
}


//成长记录

/**
 * 设置成长记录参数
 */
function setGrowthRecord(){
	growthRecord.nowpage=0;
	$("#recordTitle").html('');
	if(templatetype==WxXxGrowthTemplate.TYPE_GROWTH_FOOTMARK){
		growthRecord.defaultBgimage = "image_upload_bg_activity.jpg";
		$("#recordTextarea").css("padding","40px 120px 30px 20px");
		$(".record_images").hide();
		$(".record_ship").show();
		$("#recordTextarea").attr("maxlength", "74");
	}else if(templatetype==WxXxGrowthTemplate.TYPE_THEME_ACTIVITY){
		growthRecord.defaultBgimage = "image_upload_bg_activity.jpg";
		$("#recordTextarea").css("padding","40px 30px 30px 100px");
		$(".record_images").hide();
		$(".record_three_animals").show();
		$("#recordTextarea").attr("maxlength", "82");
	}else if(templatetype==WxXxGrowthTemplate.TYPE_CLASS_DYNAMIC){
		growthRecord.defaultBgimage = "image_upload_bg_classroom_dynamics.jpg";
		$("#recordTextarea").css("padding","40px 30px 30px 20px");
		$(".record_images").hide();
		$(".record_cloud,.record_leaf").show();
		$("#recordTextarea").attr("maxlength", "35");
	}else if(templatetype==WxXxGrowthTemplate.TYPE_MY_ARTICLE){
		growthRecord.defaultBgimage = "image_upload_bg_baby_work.jpg";
		$("#recordTextarea").css("padding","40px 30px 30px 20px");
		$(".record_images").hide();
		$(".record_balloon,.record_flower").show();
		$("#recordTextarea").attr("maxlength", "45");
	}
}

/**
 * 查询成长记录
 */
function queryGrowthRecord(){
	var param = {
		templatetype:templatetype,
		growthstuid:$("#growthstuid").val(),
		xqbm:$("#xqbm").val(),
		campusid: $("#campusid").val()
	};
	var submitData = {
		api:ApiParamUtil.GROWTH_GROWTH_RECORD_LIST,
		iDisplayLength: growthRecord.iDisplayLength,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				if(result.data.length===0){
					$('.icon_record_btn_right').hide();
					$('.icon_record_btn_left').hide();
				}else{
					createGrowthRecordList(result.data);
				}
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}


/**
 * 成长记录组装
 */
function createGrowthRecordList(dataList){	
	if(dataList.length > 0 && growthRecord.nowpage + 1< dataList.length){
		$('.icon_record_btn_right').show();
	}else{
		$('.icon_record_btn_right').hide();
	}
	if(dataList.length > 1 && growthRecord.nowpage > 0 ){
		$('.icon_record_btn_left').show();
	}else{
		$('.icon_record_btn_left').hide();
	}
	$("#recordstate").val(dataList[growthRecord.nowpage].state);
	var date = dataList[growthRecord.nowpage].publishdate? dataList[growthRecord.nowpage].publishdate.substring(0,4)+"年-"+dataList[growthRecord.nowpage].publishdate.substring(4,6)+"月":dataList[growthRecord.nowpage].createtime.substring(0,4)+"年-"+dataList[growthRecord.nowpage].createtime.substring(5,7)+"月";
	var picpath = dataList[growthRecord.nowpage].picpath ? dataList[growthRecord.nowpage].picpath: ctx + "/static/styles/mobile/images/growth/" + growthRecord.defaultBgimage;
	if(dataList[growthRecord.nowpage].picpath){
		$("#growthRecordIconpath").val(picpath);
		$("#_growthRecordIconpath").css("background-image","url("+setOSSImageSize(picpath)+")");
	}else{
		$("#_growthRecordIconpath").css("background-image","url("+setOSSImageSize(picpath)+")");
		$("#growthRecordIconpath").val("");
	}
	if(dataList[growthRecord.nowpage].title){
		$("#recordTitle").text(dataList[growthRecord.nowpage].title);
	}else{
		if($("#recordTitle").find("input").length>0){
			return;
		}else{
			$("#recordTitle").html('<input type="text" class="title" placeholder="请输入标题" maxlength="10" value="" />');
			$("#recordTitle").find("input").blur(function(){
				if($(this).val().length>10){
					PromptBox.alert("标题小于10个字符哦");
					return;
				}
				if($(this).val().length==0|| !$(this).val().replace(/(^\s*)|(\s*$)/g, "")){
					PromptBox.alert("标题别忘了填");
					return;
				}
				$("#recordTitle").text($(this).val());
			});
		}
	}
	var usertype=dataList[growthRecord.nowpage].usertype;
	$("#recordusertype").val(usertype);
	if(usertype==2){
		$("#noticeBtnRecord").parent().show();
		if(dataList[growthRecord.nowpage].state!=2){
			$("#noticeBtnRecord").removeClass("disabled");
		}else{
			$("#noticeBtnRecord").addClass("disabled");
		}
	}else{
		$("#noticeBtnRecord").parent().hide();
	}
	$("#recordDate").text(date);
	$("#recordTextarea").val(dataList[growthRecord.nowpage].content);
	stateTransformation(dataList[growthRecord.nowpage].state);
	$("#recordDataId").val(dataList[growthRecord.nowpage].id);
}

/**
 * 上一页
 */
function growthRecordPreviousPage(){
	$("#recordTitle").text('');
	growthRecord.nowpage = growthRecord.nowpage - 1;
	if(growthRecord.nowpage===0){
		$('.icon_record_btn_left').hide();
	}else{
		$('.icon_record_btn_left').show();
	}
	queryGrowthRecord();
}

/**
 * 下一页
 */
function growthRecordNextPage(){
	$("#recordTitle").text('');
	growthRecord.nowpage = growthRecord.nowpage + 1;
	if(growthRecord.nowpage===1){
		$('.icon_record_btn_right').hide();
	}else{
		$('.icon_record_btn_right').show();
	}
	queryGrowthRecord();
}

/**
 * 记录类型转换
 * @param state
 * @returns
 */
function stateTransformation(state){
	if(state==saveComplete){
		$("#growthRecord .itemTag").removeClass("tag_not_completed").addClass("tagCompleted");
	}else{
		$("#growthRecord .itemTag").removeClass("tagCompleted").addClass("tagNotCompleted");
	}
}

/**
 * 保存成长记录
 * @param id
 */
function saveGrowthRecord(){
	var dataid = $("#recordDataId").val();
	var title = $("#recordTitle").text();
	var content = $("#recordTextarea").val();
	var image = $("#growthRecordIconpath").val();
	var state = saveDraft;
	if(!title){
		PromptBox.alert("标题别忘了填写哦");
		return;
	}
	if(title.length>10){
		PromptBox.alert("标题过长啦，小于10个字符哦");
		return;
	}
	if(!content){
		PromptBox.alert("内容别忘了填写哦");
		return;
	}
	var contenMaxLength = 100;
	if(title.length>contenMaxLength){
		PromptBox.prompt("内容过长啦，小于"+contenMaxLength+"个字符哦");
		return;
	}	
	var usertype=$("#recordusertype").val();
	if(usertype==0){
		if(templatetype==WxXxGrowthTemplate.TYPE_GROWTH_FOOTMARK ||templatetype==WxXxGrowthTemplate.TYPE_MY_ARTICLE){
			usertype=2;
		}else{
			usertype=1;
		}
	}
	if(usertype==1){
		state=saveComplete;
	}else{
		state=$("#recordstate").val();
		if(state==0){
			state=saveDraft;
		}
	}
	var param = {
		recordid: dataid,
		templatetype: templatetype,
		title:title,
		content:content,
		picpath:image,
		dataid:dataid,
		publishdate:new Date().Format('yyyyMM'),
		state:state,
		usertype:usertype
	};
	var submitData = {
		api:ApiParamUtil.GROWTH_GROWTH_RECORD_SAVE,
		param : JSON.stringify(param)
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				PromptBox.alert("保存成功！");
				stateTransformation(state);
				if($("#recordusertype").val()==0){
					if(usertype==2){
						$("#noticeBtnRecord").parent().show();
						$("#noticeBtnRecord").removeClass("disabled");
					}
				}
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function sendRemind(){
	$("#winConfirm").attr("disabled", "disabled");
	var param = {
		growthstuid : $("#growthstuid").val(),
		campusid : $("#campusid").val(),
		dataid : $("#recordid").val(),
		content : $("#winContent").val(),
		templatetype : templatetype
	};
	var submitData = {
		api : ApiParamUtil.GROWTH_SINGLE_PUSH_REMIND_MSG,
		param : JSON.stringify(param)
	};
	
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				PromptBox.alert("提醒成功！");
				closeBox();
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
			$("#winConfirm").removeAttr("disabled");
		}
	});
	
}

function promptWindow() {
	$("#oWindow").css("width", "400px");
	var oWinObj = $("#oWindow");
	$(".blackBg").css("display","block");
	oWinObj.show();
	var doc = document.documentElement;
	var oWinX = (doc.clientWidth - oWinObj[0].offsetWidth)/2;
//	var oWinY = (doc.clientHeight - oWinObj[0].offsetHeight-50)/2;
	oWinObj.css('left',oWinX+'px');
//	this.oWinObj.css('top',oWinY+'px');
	var _this = this;
	$("#winContent").val("本周将要完成成长档案，请家长完善本月成长内容！");
	$("#winConfirm").attr("onclick", "sendRemind()");
}

function closeBox() {
	$("#oWindow").css("display","none");
	$(".blackBg").css("display","none");
}

// 预览 
function preview(){
	var stuid = $("#growthstuid").val();
	photoArr = new Array();
	previewwNum = 0;
	previewStuid = stuid;
	$("body").addClass("mfp-zoom-out-cur");
	var $previewBg = $('<div id="pbgDiv" style="position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);z-index:1034;" onclick="closePreview()"></div>');
	var $previewBox = $('<div id="pboxDiv" style="position:fixed;top:30px;bottom:50px;left:50%;width:400px;margin-left:-200px;background-color:#fff;z-index:1035;"></div>');
	var $preDiv = $('<div id="preDiv" onclick="preFlip()" style="position:fixed;top:50%;left:30px;width:100px;height:100px;margin-top:-50px;background:url('+ctx+'/static/pixelcave/page/img/preview_pre.png) no-repeat center;z-index:1036;cursor: pointer;"></div>');
	var $nextDiv = $('<div id="nextDiv" onclick="nextFlip()" style="position:fixed;top:50%;right:30px;width:100px;height:100px;margin-top:-50px;background:url('+ctx+'/static/pixelcave/page/img/preview_next.png) no-repeat center;z-index:1036;cursor: pointer;"></div>');
	var $box = $('<div style="height:100%;position: relative;"></div>');
	$("body").append($previewBg);
	$("body").append($previewBox);
	$("body").append($preDiv);
	$("body").append($nextDiv);
	$previewBox.append($box);
	var $previewHeader = $('<div id="previewHeader" style="width:100%;padding:10px;overflow:hidden;border-bottom:2px solid #3cb16c;cursor: default;"></div>');
	var $previewBody = $('<div id="previewBody" style="text-align:center;cursor: pointer;position:absolute;top:36px;bottom:0;left:0;right:0;"></div>');
	$box.append($previewHeader);
	$box.append($previewBody);
	var $span1 = $('<div style="display:inline-block;height:14px;line-height:14px;border-left:3px solid #3cb16c;color:#3cb16c;padding-left:4px;float:left;font-weight: bold;font-family: \'微软雅黑\';">预览</div>');
	var $span2 = $('<div style="width:14px;height:14px;background:url('+ctx+'/static/pixelcave/page/img/ico_close.png) no-repeat center;float:right;cursor: pointer;" onclick="closePreview()"></div>');
	$previewHeader.append($span1);
	$previewHeader.append($span2);
	$img = $('<img style="height:100%;" src="" />');
	$previewBody.append($img);
	
	queryPreviewDataList();
}

function queryPreviewDataList(){
	GHBB.prompt("正在加载~");
	var param = {
		campusid : $("#campusid").val(),
		xqbm : $("#xqbm").val(),
		growthstuid : previewStuid
	};
	var submitData = {
		api : ApiParamUtil.GROWTH_QUERY_PREVIEW_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			previewList = result.data;
			GHBB.hide();
			queryPreviewPhoto();
		}
	});
}

function queryPreviewPhoto(){
	$("#previewBody").find("img").attr("src","");
	GHBB.prompt("正在加载~");
	var previewData = previewList[previewwNum];
	
	var param = {
		campusid : $("#campusid").val(),
		xqbm : $("#xqbm").val(),
		growthstuid : previewStuid,
		growthid : previewData.growthid,
		templatetype:previewData.templatetype,
		filename:previewData.filename,
		num:previewData.num,
		startNum : previewwNum,
		type : "preview",
		lengthNum : "1"
	};
	var submitData = {
		api : ApiParamUtil.GROWTH_PREVIEW_BY_IMG,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			previewTotal = previewList.length;
			var url = "data:image/png;base64,"+result.data.url;
			/*回调函数*/
			$("#pboxDiv").find("img").attr("src",url);
			setPreviewPhoto($("#pboxDiv").find("img"), url, $("#pboxDiv").width()/$("#pboxDiv").height());
			photoArr.push(url);
			GHBB.hide();
			$("#nextDiv").attr("onclick","nextFlip();");
		}
	});
}

function closePreview(){
	$("body").removeClass("mfp-zoom-out-cur");
	$("#pbgDiv").remove();
	$("#pboxDiv").remove();
	$("#preDiv").remove();
	$("#nextDiv").remove();
}

function preFlip(){
	if(previewwNum > 0){
		previewwNum = previewwNum -1;
	}
	$("#pboxDiv").find("img").attr("src",photoArr[previewwNum]);
	setPreviewPhoto($("#pboxDiv").find("img"), photoArr[previewwNum], $("#pboxDiv").width()/$("#pboxDiv").height());
}

function nextFlip(){
	if(previewwNum == photoArr.length -1 && previewwNum < previewTotal -1){
		$("#nextDiv").attr("onclick","");
		previewwNum++;
		queryPreviewPhoto();
	}else if(previewwNum < photoArr.length -1){
		previewwNum++;
		$("#pboxDiv").find("img").attr("src",photoArr[previewwNum]);
		setPreviewPhoto($("#pboxDiv").find("img"), photoArr[previewwNum], $("#pboxDiv").width()/$("#pboxDiv").height());
	}
}

/**
 * 检查图片长宽比---只适用于背景图设置
 * @param obj 需要设置背景的对象
 * @param url 图片url地址
 * @param ratio 需要比较的长宽比,不传则为1
 * @returns {Boolean} 如果图片本身的长宽比的值大于等于 ratio 的值，则设置高度100%反之设置宽度100%
 */
function setPreviewPhoto(obj,url,ratio){
	if(url.indexOf("@") > 0 ){
		url = url.split("@")[0];
	}
	if(isNaN(ratio)){
		ratio = 1;
	}
	var img = new Image();
	img.src = url;
	img.onerror = function(){
		console.log("图片加载失败，请检查url是否正确");
		$("#pboxDiv").css({"margin-left":"-200px","width":"400px"});
	};
	if(img.complete){
		console.log(url);
		console.log(img.width+" "+img.height);
		$("#pboxDiv").css({"margin-left":(-obj.parent().height()*img.width/(img.height*2))+"px","width":"auto"});
		$("#previewHeader").css({"width":obj.parent().height()*img.width/img.height+"px"});
	}else{
		img.onload = function(){
			console.log(url);
			console.log(img.width+" "+img.height);
			img.onload=null;//避免重复加载
			$("#pboxDiv").css({"margin-left":(-obj.parent().width()/2)+"px","width":"auto"});
			$("#previewHeader").css({"width":obj.parent().height()*img.width/img.height+"px"});
		};
	}
}