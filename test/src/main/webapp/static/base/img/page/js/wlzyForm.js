/*
 *  Document   : wlzyForm.js
 *  Author     : yxw
 *  Description: 班级相册修改界面
 */

var ctx = $("#ctx").val();
var appid = $("#appid").val();
var uploadBox = 1;
var addImg1,addImg2,addImg3,addImg4,addImg5;
var addPhotoBox1,addPhotoBox2,addPhotoBox3,addPhotoBox4,addPhotoBox5;
var swfuList = [];
var addImgList = [addImg1,addImg2,addImg3,addImg4,addImg5];
var addPhotoBoxList = [addPhotoBox1,addPhotoBox2,addPhotoBox3,addPhotoBox4,addPhotoBox5];
$(window).load(function() {
	renderPhoto();
	for (var i = 1; i <= 5; i++) {
		addImgList[i] = "addImg"+i;
		addPhotoBoxList[i] = "addPhotoBox"+i;
		swfuList[i] = new SWFUpload({
			upload_url: ctx+"/klxx/wlzy/swfupload",
			// File Upload Settings
			file_size_limit : "8MB",	// 1000MB
			file_types : "*.jpg;*.jpeg;*.png",//设置可上传的类型
			file_types_description : "所有文件",
			file_upload_limit : "99",
							
			file_queue_error_handler : fileQueueError,//选择文件后出错
			file_dialog_complete_handler : fileDialogComplete,//选择好文件后提交
			file_queued_handler : fileQueued,
			upload_progress_handler : uploadProgress,
			upload_error_handler : uploadError,
			upload_success_handler : uploadSuccess,
			upload_complete_handler : uploadComplete,

			// Button Settings
			button_placeholder_id : addImgList[i],
			button_width: 90,
			button_height: 90,
			button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
			button_cursor: SWFUpload.CURSOR.HAND,
			
			// Flash Settings
			flash_url : ctx + "/static/js/swfupload/swfupload.swf",

			custom_settings : {
				upload_target : addPhotoBoxList[i]
			},
			// Debug Settings
			debug: false  //是否显示调试窗口
		});
	}
});

function renderPhoto(){
	var imgDiv = $(".img");
	for (var i = 0; i < imgDiv.length; i++) {
		if(imgDiv.eq(i).find("img").height() < imgDiv.eq(i).find("img").width()){
			if(!imgDiv.eq(i).is(":hidden")){
				imgDiv.eq(i).find("img").css("height","100%");
				imgDiv.eq(i).find("img").css("left","50%");
				imgDiv.eq(i).find("img").css("margin-left",-imgDiv.eq(i).find("img").width()/2);
			}
		}else{
			if(!imgDiv.eq(i).is(":hidden")){
				imgDiv.eq(i).find("img").css("width","100%");
				imgDiv.eq(i).find("img").css("top","50%");
				imgDiv.eq(i).find("img").css("margin-top",-imgDiv.eq(i).find("img").height()/2);
			}
		}
	}
}


function removePhoto(obj){
	$(obj).parent().parent().parent().parent().remove();
}

function addUploadBox(obj){
	if(uploadBox > 5){
		alert("最多只能添加5条记录！");
		return;
	}
	$(obj).parent().parent().parent().parent()
		.find("div[name=addUploadBox]")
		.find("div[id=uploadBox"+ uploadBox +"]").css("display","block");
	uploadBox++;
}

$(document).ready(
		function() {
			
			$("#school-chosen").change(function() {// 查询
				getSerchFormBjsjList();
			});
			
			$("#bj-chosen").change(function() {// 查询
//				getXsjbByBjid();
			});
			
			$("#form_sendtype").change(function() {// 查询
				getXsjbByBjid();
			});
			
			$("#addPageBtn").click(function() {// 查询
				saveInfo();
			});
			
		});

function saveInfo(){
	
	var sendType = 1;
	var sendBox = $(".uploadBox").filter(function(){return $(this).css('display')!='none';});
	if(sendBox.length > 1 && sendType == 0){
		for (var i = 0; i < sendBox.length - 1; i++) {
			var selectValue = sendBox.find("select[name=xcForm_stus]").eq(i).val();
			if(selectValue == null || selectValue == ""){
				alert("请选择学生！");
				return;
			}
		}
	}
	var havePhoto = 0;
    var jsonArr = "{'json':[";
	var infoList = $("div[name=addUploadBox]").eq(0).find("div[class=uploadBox]:visible");
	var photoNum = 0;
	var commaNum = 0;
	for (var i = 0; i < infoList.length; i++) {
		var photoList = infoList.eq(i).find("div[name=addPhotoBox]").find("div[class=photoBox]");
		var photos = "";
		var fileids = "";
		if(photoList.length == undefined || photoList.length==0){
			alert("请至少上传一张照片！");
			return;
		}
		
		for (var j = 0; j < photoList.length; j++) {
			if(photoList.eq(j).find("img").attr("src") != "" && photoList.eq(j).find("img").attr("src") != ctx +"/static/js/images/loading1.gif"){
				havePhoto = 1;
			}
			if(photoList.eq(j).find("img").attr("src") != ctx +"/static/js/images/loading1.gif"){
				photos += photoList.eq(j).find("img").attr("src") + ",";
				fileids += photoList.eq(j).find("img").attr("id") + ",";
			}
		}
		photoNum += photoList.length;
		commaNum += photos.match(/(,)/g).length;
		if(photos.length > 0){
			photos = photos.substring(0,photos.length - 1);
		}
		if(fileids.length > 0){
			fileids = fileids.substring(0,photos.length - 1);
		}
		var text = infoList.eq(i).find("textarea").eq(0).val();
		var select = -1;
		var jsonObj = "{\"photos\":\""+photos+"\",\"content\":\""+text+"\",\"xsids\":\""+select+"\",\"wlzytype\":"+$("#wlzyType").val()+",\"fileids\":\""+fileids+"\"}";
		if(i == infoList.length -1){
			jsonArr += jsonObj + "]}";
		}else{
			jsonArr += jsonObj + ",";
		}
	}
	var prompt = "确定保存?";
	if(photoNum != commaNum){
		prompt = "图片还剩"+ (photoNum - commaNum) +"张未上传完成，确定保存？";
	}
	if(havePhoto == 0){
		alert("请至少上传一张照片！");
		return;
	}
	
	if (confirm(prompt)) {
		GHBB.prompt("数据保存中~");
		var url=ctx+"/klxx/wlzy/addBatchWlzy";
		var submitData = {
				json:jsonArr,
				campusid:$("#school-chosen").val(),
				bjid:$("#bj-chosen").val().toString()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data == "success"){
					GHBB.hide();
					var url = ctx + "/klxx/wlzy/" + $("#wlzyType").val() + "?appid="+appid;
					location.href = url;
				}
	    });
	}	
}

function getSerchFormBjsjList(){
	var url=ctx+"/xtgl/bjsj/findBjsjByCampusId";
	var submitData = {
			search_LIKE_campusid: $("#school-chosen").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#bj-chosen option").remove();
	        for(var i=0;i<datas.length;i++){
	        	
	        	$("#bj-chosen").append("<option value=" + datas[i].id+" >"
	        			+ datas[i].bj + "</option>");
	        };

			$("#bj-chosen").multiselect('refresh');

//	        getXsjbByBjid();
    });
}	

function getXsjbByBjid(){
	var sendtype = $("#form_sendtype").val();
	var wlzytype = $("#wlzyType").val();
	if(wlzytype == 6){// 宝宝作品
		sendtype == 2;
	}
	
	if(sendtype == 1){
        var stuSelect = $("select[name=xcForm_stus]");
		$("select[name=xcForm_stus] option").remove();
		for (var i = 0; i < stuSelect.length; i++) {
        	stuSelect.eq(i).append("<option selected=\"selected\" value=\"-1\" >全部</option>");
    		stuSelect.eq(i).multiselect('refresh');
        };
	}else{
		var bjid = $("#bj-chosen").val();
		var url=ctx+"/xtgl/xsjb/ajax_queryJsonXsjbByBjid/"+bjid+"/0";
		var submitData = {
				bjid : bjid,
				stuids : 0
		};
		$.get(url,
			submitData,
	      	function(data){
				var datas = eval(data);
				var stuSelect = $("select[name=xcForm_stus]");
				$("select[name=xcForm_stus] option").remove();
				for (var i = 0; i < stuSelect.length; i++) {
			        for(var j=0;j<datas.length;j++){
			        	var s = "";
			        	if(j == 0){
			        		s = "selected=selected";
			        	}
			        	stuSelect.eq(i).append("<option "+ s +" value=" + datas[j].id+" >" + datas[j].xm + "</option>");
			        };
					stuSelect.eq(i).multiselect('refresh');
				}
	    });
	}
}