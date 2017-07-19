/*
 *  Document   : xxjjList.js
 *  Author     : yxw
 *  Description: 学校简介管理页面
 */

var ctx=$("#ctx").val();
var appid = $("#appid").val();

$(document).ready(function() {
	$("#school-chosen").change(function() {
		generate_table();
	});
	$("#addPageBtn").click(function() {
		var url=ctx+"/yqdt/xxjj/update/0";
		location.href=url;
	});
	initImgCss();
	$(".contentBox .img:nth-child(6n)").attr("class","img noMR");
});

KindEditor.ready(function(K) {
	var folder="yqdt";
	var editor1 = K.create('textarea[name="jtnr"]', {
		cssPath : ctx+'/static/kindeditor/plugins/code/prettify.css',
		uploadJson : ctx+'/filehandel/kindEditorUpload/'+folder+'/image',
		fileManagerJson : ctx+'/filehandel/kindEditorFileManager',
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
		}
	});
	//prettyPrint();
});

//function delConfirm(num){
//	if(confirm("确认删除?")){
//		var url=ctx+"/yqdt/xxjj/ajax_del_news";
//		var submitData = {
//				id	: num
//		}; 
//		$.post(url,
//			submitData,
//	      	function(data){
//				alert("删除成功!");
//				generate_table();
//	    		return false;
//	      });
//	}
//}

function toEdit(id){
	var campusid = $("#school-chosen").val();
	window.location.href=ctx+"/yqdt/xxjj/update/" + id + "?campusid=" + campusid + "&appid=" + appid;
}

function generate_table(){
	location.href=ctx+"/yqdt/xxjj?search_campus="+$('#school-chosen').val()+"&appid=" + appid;
 }

function  initImgCss(){
	var imgDivs = $(".img");
	for (var i = 0; i < imgDivs.length; i++) {
		//外面边框的的高宽比例
		var H_W = imgDivs.eq(i).height() / imgDivs.eq(i).width();
		//图片的高宽比例
		var h_w = imgDivs.eq(i).find("img").height() / imgDivs.eq(i).find("img").width();
		if(H_W > 1 && H_W > h_w){
			maxHeight(imgDivs.eq(i));
		}else if(H_W > 1 && H_W < h_w){
			maxWidth(imgDivs.eq(i));
		}else if(H_W < 1 && H_W > h_w){
			maxHeight(imgDivs.eq(i));
		}else if(H_W < 1 && H_W < h_w){
			maxWidth(imgDivs.eq(i));
		}else if(H_W = 1 && h_w > 1){
			maxWidth(imgDivs.eq(i));
		}else if(H_W = 1 && h_w < 1){
			maxHeight(imgDivs.eq(i));
		}else{
			maxHeightAndWidth(imgDivs.eq(i));
		}
	}
}

function maxWidth(obj){
	obj.find("img").css("width","100%");
	obj.find("img").css("top","50%");
	obj.find("img").css("margin-top",-obj.find("img").height()/2);
}

function maxHeight(obj){
	obj.find("img").css("height","100%");
	obj.find("img").css("left","50%");
	obj.find("img").css("margin-left",-obj.find("img").width()/2);
}

function maxHeightAndWidth(obj){
	obj.find("img").css("top","0");
	obj.find("img").css("left","0");
	obj.find("img").css("height","100%");
	obj.find("img").css("width","100%");
}