/*
 *  Document   : newsList.js
 *  Author     : yxw
 *  Description: 公司新闻发布页面
 */

var ctx = $("#ctx").val();
var yqdtType = $("#yqdtType").val();
var editor;

$(document).ready(function() {
	generate_table();
	$("#search-btn").click(function() {
		generate_table();
	});
	$("#uploadFile").change(function() {
		uploadImg()
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
		$('#source').val("");
		$('#createtime').val(time);
		$("#uploadImg").attr("src", "");
		$("#imgurl").val("");
		$("#keywords").val("");
		$("#description").val("");
		editor.html("");
		$('#content').val("");
		$('#modal-addconfig').modal('show');
	});
	$("#saveSubmit").click(function() {
		btnClick();
	});
});
KindEditor.ready(function(K) {
	var folder = "yqdt";
	editor = K.create('textarea[name="content"]', {
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

function delConfirm(num) {
	if (confirm("确认删除?")) {
		var url = ctx + "/gsgl/news/ajax_del_news";
		var submitData = {
			id : num
		};
		$.post(url, submitData, function(data) {
			PromptBox.alert("删除成功!");
			generate_table();
			return false;
		});
	}
}

function toEdit(num) {
	$('#addOrEdit').html("修改");
	var url = ctx + "/gsgl/news/ajax_edit_news";
	var submitData = {
		id : num
	};
	$.post(url, submitData, function(datas) {
		$('#info-id').val(datas.id);
		$('#title-add').val(datas.title);
		$('#source').val(datas.source);
		$('#createtime').val(datas.publishdate.substr(0, 10));
		$("#uploadImg").attr("src", datas.imgurl);
		$("#imgurl").val(datas.imgurl);
		$("#keywords").val(datas.keywords);
		$("#description").val(datas.description);
		editor.html(datas.content);
		$('#content').val(datas.content);
		$('#modal-addconfig').modal('show');
		return false;
	});
}

function generate_table() {
	App.datatables();
	var rownum = 1;
	/* Initialize Datatables */

	var sAjaxSource = ctx + "/gsgl/news/ajax_query_news?&title="
			+ $("#title").val();
	var columns = [ {
		"sTitle" : "序号",
		"mDataProp" : "rowno",
		"sClass" : "text-center",
		"sWidth" : "60px"
	}, {
		"sTitle" : "照片",
		"mDataProp" : "imgurl",
		"sClass" : "text-center",
		"sWidth" : "100px"
	}, {
		"sTitle" : "标题",
		"mDataProp" : "title",
		"sClass" : "text-center",
		"sWidth" : "200px"
	}, {
		"sTitle" : "发布人",
		"mDataProp" : "publisher",
		"sClass" : "text-center",
		"sWidth" : "80px"
	}, {
		"sTitle" : "发布日期",
		"mDataProp" : "publishdate",
		"sClass" : "text-center",
		"sWidth" : "150px"
	}, {
		"sTitle" : "来源",
		"mDataProp" : "source",
		"sClass" : "text-center",
		"sWidth" : "80px"
	}, {
		"sTitle" : "关键字",
		"mDataProp" : "keywords",
		"sClass" : "text-center",
		"sWidth" : "150px"
	}, {
		"sTitle" : "描述",
		"mDataProp" : "description",
		"sClass" : "text-center",
		"sWidth" : "200px"
	}, {
		"sTitle" : "管理",
		"mDataProp" : "operation",
		"sClass" : "text-center",
		"sWidth" : "60px"
	} ];
	$('#news-datatable').dataTable({
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
	var content = $("#content").val();
	var source = $("#source").val().replace(/\t/g, "");
	var imgurl = $("#imgurl").val();
	var keywords = $("#keywords").val();
	var description = $("#description").val();
	if (title == "" || title == null) {
		PromptBox.alert("标题必填！");
		return;
	} else if (content == "" || content == null) {
		PromptBox.alert("内容必填！");
		return;
	} else if (keywords == "" || keywords == null) {
		PromptBox.alert("关键字必填，否则新闻无法被抓取！");
		return;
	} else if (description == "" || description == null) {
		PromptBox.alert("描述必填，否则新闻无法被抓取！");
		return;
	}
	if (confirm("是否确定继续操作?")) {
		var bjid;
		var bjmc;
		var url = ctx + "/gsgl/news/ajax_save";
		var submitData = {
			id : info,
			title : title,
			content : content,
			source : source,
			imgurl : imgurl,
			keywords : keywords,
			description : description,
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
	oReq.open("POST", ctx + "/gsgl/news/picupload?isAjax=true&resType=json",
			true);
	oReq.onload = function(oEvent) {
		$('#saveSubmit').removeAttr('disabled');
		if (oReq.status == 200 && oReq.responseText != '') {
			$("#uploadImg").attr("src", oReq.responseText);
			$("#imgurl").val(oReq.responseText);
			// ajaxQueryMrcp(weeknum, campusid);
		} else {
			PromptBox.alert("照片上传失败！");
		}
	};
	oReq.send(oData);
};