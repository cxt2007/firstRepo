/*
 *  Document   : videoList.js
 *  Author     : yxw
 *  Description: 公司新闻发布页面
 */

var ctx = $("#ctx").val();
var yqdtType = $("#yqdtType").val();
var id = 0;

$(document).ready(function() {
	generate_table();
	$("#search-btn").click(function() {
		generate_table();
	});
	$("#uploadFile").change(function() {
		uploadImg();
	});
	$("#addPageBtn").click(function() {
		$('#addOrEdit').html("新增");
		var year = new Date().getFullYear();
		var mounth = new Date().getMonth() + 1;
		if (mounth < 10) {
			mounth = "0" + mounth;
		}
		var day = new Date().getDate();
		if (day < 10) {
			day = "0" + day;
		}
		var time = year + "-" + mounth + "-" + day;
		$('#info-id').val("");
		$('#title-add').val("");
		$('#createtime').val(time);
		$("#uploadImg").attr("src", "");
		$("#fmurl").val("");
		$('#videoPath').val("");
		$("#loadBox").css("display", "none");
		$("#progressBar").css("width", "0%");
		$("#progressBar").attr("aria-valuenow", "0%");
		$("#progressBar").html("0%");
		$('#videoName').css("display", "none");
		$('#videoName').html("");
		$('#modal-addconfig').modal('show');
	});
	$("#saveSubmit").click(function() {
		btnClick();
	});
});

function addressAction() {
	$
			.get(
					ctx + '/gsgl/video/getProgress',
					function(data) {
						// alert(data);
						// $("#pb1").progressBar(data.percent);
						var dataVal = eval(data);
						// $("#readedBytes").html(dataVal.percent);
						if (dataVal.percent == 1) {
							clearInterval(id);
							$("#fileSize").html(
									dataVal.pContentLengthch + "MB/"
											+ dataVal.pContentLengthch + "MB");
							$("#uploadSpeed").html(dataVal.pMin + "KB/S");
							$("#progressBar").css("width", "100%");
							$("#progressBar").attr("aria-valuenow", "100%");
							$("#progressBar").html("100%(完成)");
							$("#loadBoxName").html("上传完成！");
							$("#loadBox").find("div[class='progressSpan']")
									.css("display", "none");
						} else {
							var progressBarNum = (dataVal.pBytesReadch / dataVal.pContentLengthch)
									.toFixed(2) * 100;
							// alert(progressBarNum);
							$("#progressBar")
									.css("width", progressBarNum + "%");
							$("#progressBar").attr("aria-valuenow",
									progressBarNum + "%");
							$("#progressBar").html(progressBarNum + "%");
							$("#fileSize").html(
									dataVal.pBytesReadch + "M/"
											+ dataVal.pContentLengthch + "M");
							$("#uploadSpeed").html(dataVal.pMin + "KB/S");
						}

					}, 'json');
}

function videoUpload() {
	id = window.setInterval(addressAction, 1000);
	$.ajaxFileUpload({
		url : ctx + '/gsgl/video/videoUpload',// 需要链接到服务器地址
		secureuri : false,
		fileElementId : 'videoUpload',// 文件选择框的id属性
		dataType : 'json',// 服务器返回的格式，可以是json
		success : function(data) {
			var dataVal = eval(data);
			$('#saveSubmit').removeAttr('disabled');
			$("#videoPath").val(dataVal.filepath);
			// if($("#wk_resourceid").val()!=""){
			// saveWkFile();
			// }
		},
		error : function(data) {
			// var dataVal=eval(data);
			alert("上传失败:" + data);
		}
	});
}

function fileChange() {
	if ($("#loadBox").css("display") == "block") {
		alert("正在上传或上一个视频信息还未保存！");
		return;
	}
	var filepath = $("input[name='videoUpload']").val();
	if (filepath == undefined || $.trim(filepath) == "") {
		alert("请选择上传文件！");
		return;
	} else {
		var fileArr = filepath.split("\\");
		var fileTArr = fileArr[fileArr.length - 1].toLowerCase().split(".");
		var filetype = fileTArr[fileTArr.length - 1];
		var fileName = fileTArr[0];
		if (filetype == "mp4" || filetype == "avi") {
			$('#saveSubmit').attr('disabled', 'disabled');
			$('#videoName').css("display", "none");
			$('#videoName').html("");
			$("#loadBox").css("display", "block");
		} else {
			alert("上传文件必须为视频,以mp4、avi结尾！");
			return;
		}
	}
	videoUpload();
}

function delConfirm(num) {
	if (confirm("确认删除?")) {
		var url = ctx + "/gsgl/video/ajax_del_video";
		var submitData = {
			id : num
		};
		$.post(url, submitData, function(data) {
			alert("删除成功!");
			generate_table();
			return false;
		});
	}
}

function toEdit(num) {
	$('#addOrEdit').html("修改");
	var url = ctx + "/gsgl/video/ajax_edit_video";
	var submitData = {
		id : num
	};
	$.post(url, submitData, function(datas) {
		$('#info-id').val(datas.id);
		$('#title-add').val(datas.title);
		$('#createtime').val(datas.publishdate.substr(0, 10));
		$("#uploadImg").attr("src", datas.fmurl);
		$("#fmurl").val(datas.fmurl);
		$('#videoPath').val(datas.qiniuurl);
		$("#loadBox").css("display", "none");
		$("#progressBar").css("width", "0%");
		$("#progressBar").attr("aria-valuenow", "0%");
		$("#progressBar").html("0%");
		$('#videoName').css("display", "block");
		$('#videoName').html(datas.qiniuurl.split(".com/")[1].split("?")[0]);
		$('#modal-addconfig').modal('show');
		return false;
	});
}

function generate_table() {
	App.datatables();
	var rownum = 1;
	/* Initialize Datatables */

	var sAjaxSource = ctx + "/gsgl/video/ajax_query_video?&title="
			+ $("#title").val();
	var columns = [ {
		"sTitle" : "序号",
		"mDataProp" : "rowno",
		"sClass" : "text-center"
	}, {
		"sTitle" : "封面",
		"mDataProp" : "fmurl",
		"sClass" : "text-center"
	}, {
		"sTitle" : "标题",
		"mDataProp" : "title",
		"sClass" : "text-center"
	}, {
		"sTitle" : "发布人",
		"mDataProp" : "publisher",
		"sClass" : "text-center"
	}, {
		"sTitle" : "发布日期",
		"mDataProp" : "publishdate",
		"sClass" : "text-center"
	}, {
		"sTitle" : "管理",
		"mDataProp" : "operation",
		"sClass" : "text-center"
	} ];
	$('#video-datatable').dataTable({
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"sAjaxSource" : sAjaxSource,
		"aoColumns" : columns,
		"bAutoWidth" : false,
		"bServerSide" : false,// 服务器端必须设置为true
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			// 序号
			// rownum=aaData
			$('td:eq(0)', nRow).html(rownum);
			rownum = rownum + 1;
			return nRow;
		},
	});

}

function btnClick() {
	var info = $("#info-id").val();
	var title = $("#title-add").val().replace(/\t/g, "");
	var fmurl = $("#fmurl").val();
	var videoPath = $('#videoPath').val();
	if (title == "" || title == null) {
		alert("标题必须填写！");
		return;
	} else if (videoPath == "" || videoPath == null) {
		alert("请上传视频！");
		return;
	}
	if (confirm("是否确定继续操作?")) {
		var bjid;
		var bjmc;
		var url = ctx + "/gsgl/video/ajax_save";
		var submitData = {
			id : info,
			title : title,
			fmurl : fmurl,
			qiniuurl : videoPath,
			publishdate : $("#createtime").val()
		};
		$('#saveSubmit').attr('disabled', 'disabled');
		$.post(url, submitData, function(data) {
			$('#saveSubmit').removeAttr('disabled');
			$('#modal-addconfig').modal('hide');
			generate_table();
			return false;
		});
		return false;
	} else
		return false;

}

function uploadImg() {
	$('#saveSubmit').attr('disabled', 'disabled');
	var oData = new FormData(document.forms.namedItem("fileinfo"));
	oData.append("CustomField", "This is some extra data");
	var oReq = new XMLHttpRequest();
	oReq.open("POST", ctx + "/gsgl/video/picupload?isAjax=true&resType=json",
			true);
	oReq.onload = function(oEvent) {
		$('#saveSubmit').removeAttr('disabled');
		if (oReq.status == 200 && oReq.responseText != '') {
			$("#uploadImg").attr("src", oReq.responseText);
			$("#fmurl").val(oReq.responseText);
			// ajaxQueryMrcp(weeknum, campusid);
		} else {
			alert("照片上传失败！");
		}
	};
	oReq.send(oData);
};