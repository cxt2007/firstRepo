/*
 *  Document   : wlzyForm.js
 *  Author     : yxw
 *  Description: 班级相册修改界面
 */

var ctx = $("#ctx").val();
/*var photoBox = 1;
var swfuList = [];*/
$(window).load(function() {
	renderPhoto();
	$(".time").html($(".time").html().substring(5));
	/*swfuList[1] = new SWFUpload({
		upload_url: ctx+"/klxx/wlzy/swfupload",
		// File Upload Settings
		file_size_limit : "50 MB",	// 1000MB
		file_types : "*.jpg;*.jpeg;*.gif;*.png",//设置可上传的类型
		file_types_description : "所有文件",
		file_upload_limit : "10",
						
		file_queue_error_handler : fileQueueError,//选择文件后出错
		file_dialog_complete_handler : fileDialogComplete,//选择好文件后提交
		file_queued_handler : fileQueued,
		upload_progress_handler : uploadProgress,
		upload_error_handler : uploadError,
		upload_success_handler : uploadSuccess,
		upload_complete_handler : uploadComplete,

		// Button Settings
		button_placeholder_id : "addImg1",
		button_width: 90,
		button_height: 90,
		button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
		button_cursor: SWFUpload.CURSOR.HAND,
		
		// Flash Settings
		flash_url : ctx + "/static/js/swfupload/swfupload.swf",

		custom_settings : {
			upload_target : "addPhotoBox1"
		},
		// Debug Settings
		debug: false  //是否显示调试窗口
	});*/
	
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

function addPhotoBox(obj){
	if($(obj).val() != ""){
		if($(obj).parent().parent().parent().parent().find("div[name=addPhotoBox]").eq(0).find("div[class='photoBox show']").length >= 9){
			alert("最多只能添加9涨图片");
			return;
		}
		var oData = new FormData(document.forms.namedItem("fileinfo"));
		oData.append("CustomField", "This is some extra data");
		var oReq = new XMLHttpRequest();
		oReq.open("POST",
				ctx+"/klxx/wlzy/picupload?isAjax=true&resType=json", true);
		oReq.onload = function(oEvent) {
			if (oReq.status == 200 && oReq.responseText != '') {
				var str = "";
				str += '<div id="photoBox" class="photoBox">'
					+  '	<div class="img">'
					+  '		<div class="gallery-image">'
		            +  '        	<img id="0" src="'+ oReq.responseText +'" alt="image">'
		            +  '        	<div class="gallery-image-options">'
		            +  '            	<a onclick="removePhoto(this)" class="btn btn-sm btn-alt btn-primary" data-toggle="tooltip" title="Remove"><i class="fa fa-times"></i></a>'
		            +  '        	</div>'
		            +  '    	</div>'
		            +  '	</div>'
		            +  '</div>';
				$(obj).parent().parent().parent().parent().find("div[name=addPhotoBox]").eq(0).append(str);
				setTimeout(function(){renderPhoto();}, 200);
			}
		};
		oReq.send(oData);
	}
}

function removePhoto(obj){
	$(obj).parent().parent().parent().parent().remove();
}

$(document).ready(
		function() {
			generate_table()
			
			$("#school-chosen").change(function() {// 查询
				getSerchFormBjsjList();
			});
			
			$("#bj-chosen").change(function() {// 查询
				getXsjbByBjid();
			});
			
			$("#addPageBtn").click(function() {// 查询
				updateWlzy();
			});
		});

function getSerchFormBjsjList(){
	GHBB.prompt("正在加载~");
	var url=ctx+"/xtgl/bjsj/findBjsjByCampusId";
	var submitData = {
			search_LIKE_campusid: $("#school-chosen").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
		GHBB.hide();
			var datas = eval(data);
			$("#bj-chosen option").remove();
	        for(var i=0;i<datas.length;i++){
	        	
	        	$("#bj-chosen").append("<option value=" + datas[i].id+" >"
	        			+ datas[i].bj + "</option>");
	        };
	        $("#bj-chosen").find("option[index='0']").attr("selected",'selected');
	        $("#bj-chosen").trigger("chosen:updated");
	        
	        getXsjbByBjid();
    });
}

function generate_table(){
	GHBB.prompt("正在加载~");
   App.datatables();
   var sAjaxSource=ctx+"/klxx/wlzy/ajax_query_wlzyComment?wlzyid="+$("#wlzy_id").val();
   var columns = [
  	            {"sTitle": "回复人","mDataProp": "sender","sClass": "text-center","sWidth":"200px"},
  	            {"sTitle": "内容","mDataProp": "content","sClass": "text-center","sWidth":"400px"},
  	            {"sTitle": "回复时间","mDataProp": "publishdate","sClass": "text-center","sWidth":"150px"},
  	        	{"sTitle": "管理","mDataProp": "operation","sClass": "text-center","sWidth":"80px"}
  	       ];
   $('#wlzy-datatable').dataTable({
       "bPaginate": false,
       "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
       "bFilter": false,
       "bLengthChange": false,
       "bDestroy":true,
       "sAjaxSource": sAjaxSource,
       "aoColumns": columns,
       "bAutoWidth":false,
       "bSort" : false,
       "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
			return nRow;
       }, 
       "fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
   });
   
}

function delConfirm(num){
	if(confirm("确认删除?")){
		GHBB.prompt("数据保存中~");
		var url=ctx+"/klxx/wlzy/ajax_del_wlzycomment";
		var submitData = {
				id	: num
		}; 
		$.post(url,
			submitData,
	      	function(data){
			GHBB.hide();
				if(data == "success"){
					alert("删除成功！");
					generate_table();
				}else{
					alert(data);
				}
	    		return false;
	      });
	}
}

function getXsjbByBjid(){
	var sendtype = $("#form_sendtype").val();
	if(sendtype == 1){
		$("#form_stuids option").remove();	
        $("#form_stuids").append("<option value='"+"-1"+"' >全部</option>");
        $("#form_stuids").find("option[index='0']").attr("selected",'selected');
        $("#form_stuids").trigger("chosen:updated");
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
				$("#form_stuids option").remove();
		        for(var i=0;i<datas.length;i++){
		        	
		        	$("#form_stuids").append("<option value=" + datas[i].id+" >"
		        			+ datas[i].xm + "</option>");
		        };
		        $("#form_stuids").find("option[index='0']").attr("selected",'selected');
		        $("#form_stuids").trigger("chosen:updated");
		   
	    });
	}
}

function updateWlzy(){
    var json = "{\"json\":[";
	var infoList = $("div[name=addUploadBox]").eq(0).find("div[class='uploadBox show']");
	var photoNum = 0;
	var commaNum = 0;
	for (var i = 0; i < infoList.length; i++) {
		if(!infoList.eq(i).is(":hidden")){
			var photoList = infoList.eq(i).find("div[name=addPhotoBox]").find("div[class='photoBox']");
			var photos = "";
			var fileids = "";
			for (var j = 0; j < photoList.length; j++) {
				var photopath = photoList.eq(j).find("img").attr("src");
				var id = photoList.eq(j).find("img").attr("id");

				if(photoList.eq(j).find("img").attr("src") != ctx +"/static/js/images/loading1.gif"){
					photos += photopath + ",";
					fileids += isEmptyOrNull(id)+",";
				}
			}
			photoNum += photoList.length;
			if(photos.length > 0){
				commaNum += photos.match(/(,)/g).length;
			}
			if(photos.charAt(photos.length - 1) == ","){
				photos = photos.substring(0,photos.length - 1);
			}
			if(fileids.charAt(photos.length - 1) == ","){
				fileids = fileids.substring(0,fileids.length - 1);
			}
	        //var content = infoList.eq(i).find("textarea").eq(0).text();
	        if(i == infoList.length-1){
	        	 json = json + translateJson(photos,fileids);
	        }else{
	        	 json = json + translateJson(photos,fileids)+",";
	        }
		}
	}
	json = json + "]}";
	var prompt = "确定保存?";
	if(photoNum != commaNum){
		prompt = "图片还剩"+ (photoNum - commaNum) +"张未上传完成，确定保存？"
	}
	if(confirm(prompt)){
		var url=ctx+"/klxx/wlzy/updateWlzy";
		var submitData = {
				json : json,
				campusid: $("#school-chosen").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data == "success"){
					var url = ctx + "/klxx/wlzy/" + $("#wlzyType").val();
					location.href = url;
				}
				
	    });
	}
}

function translateJson(photos,fileids){
	return "{ \"id\":"+$("#wlzy_id").val()+",\"content\":\""+$("#wlzy_content").val()+"\",\"photos\":\""+photos+"\",\"fileids\":\""+fileids+"\",\"wlzytype\":"+$("#wlzyType").val()+"}";
}

function isEmptyOrNull(value){
	if(value==undefined || value==null || value==''){
		return "";
	}
	return value;
}

function playVideo(obj){
	$(obj).addClass("hide");
	$(obj).parent().find("video").get(0).play();
	$(obj).parent().find("video").get(0).addEventListener("ended",function(){
		$(obj).removeClass("hide");
    },false);
}