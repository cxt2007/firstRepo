/*
 *  Document   : yqdtPage.js
 *  Author     : yxw
 *  Description: 产品管理--功能管理
 */

var ctx = $("#ctx").val();
var yqdtType = $("#yqdtType").val();
var slaveuser = $("#slaveuser").val();
var editor;

$(document).ready(
		function() {
			//generate_table();
			//系统消息
			cpgl_generate_table($("#XXJJ_TYPE_XTTZ").val(),'xtxx');

			//功能介绍
			cpgl_generate_table('34,35,36','gnjs');
			
			//常见问题
			cpgl_generate_table($("#XXJJ_TYPE_CJWT").val(),'cjwt');
			
			//关于我们
			cpgl_generate_table($("#XXJJ_TYPE_GYWM").val()+","+$("#XXJJ_TYPE_USER_INSTRUCTIONS").val()+","+$("#XXJJ_TYPE_TECHNICAL_SUPPORT").val(),'about');
			
			
			$("#gnjs-search-btn").click(function() {
				cpgl_generate_table('34,35,36','gnjs');
			});
			
			$("#xtxx-search-btn").click(function() {
				cpgl_generate_table($("#XXJJ_TYPE_XTTZ").val(),'xtxx');
			});
			
			$("#cjwt-search-btn").click(function() {
				cpgl_generate_table($("#XXJJ_TYPE_CJWT").val(),'cjwt');
			});
			
			$("#about-search-btn").click(function() {
				cpgl_generate_table($("#XXJJ_TYPE_GYWM").val()+","+$("#XXJJ_TYPE_USER_INSTRUCTIONS").val()+","+$("#XXJJ_TYPE_TECHNICAL_SUPPORT").val(),'about');
			});
			
			
			$("#xtxx-addPageBtn").click(function() {
				openAddModel($("#XXJJ_TYPE_XTTZ").val())		
			});
			

			$("#cjwt-addPageBtn").click(function() {
				openAddModel($("#XXJJ_TYPE_CJWT").val())		
			});
			

			$("#about-addPageBtn").click(function() {
				openAddModel($("#XXJJ_TYPE_GYWM").val())		
			});
			
			$("#sendSubmit").click(function() {
				btnClick(2);
			});
			$("#saveSubmit").click(function() {
				btnClick(1);
			});
			$("#preview").click(function() {
				btnClick(3);
			});
			
			$("#xtxx_xxType").change(function(){
				cpgl_generate_table($("#XXJJ_TYPE_XTTZ").val(),'xtxx');
			});
			
			$("#cjwt_xxType").change(function(){
				cpgl_generate_table($("#XXJJ_TYPE_CJWT").val(),'cjwt');
			});
			
			$("#gnjs_xxType").change(function(){
				cpgl_generate_table('34,35,36','gnjs');
			});
		});
KindEditor.ready(function(K) {
	var folder = "yqdt";
	editor = K.create('textarea[name="jtnr"]', {
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

function openAddModel(datatype){
	if(datatype=="32"){
		$("#articleType_area").css("display","block");
	}else{
		$("#articleType_area").css("display","none");
	}
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
	$('#yqdtType').val(datatype);
	var time = year + "-" + mounth + "-" + day;
	$('#info-id').val("");
	$('#title-add').val("");
	$('#createtime').val(time);
	
	editor.html("");
	$('#jtnr').val("");
	if(datatype == "33" || datatype=="34,35,36"|| datatype=="31"){
		$("#xxTypeDiv").show();
	}else{
		$("#xxTypeDiv").hide();
	}
	
	$('#modal-addconfig').modal('show');
}

function delConfirm(num,type) {
	if (confirm("确认删除?")) {
		GHBB.prompt("数据保存中~");
		var url = ctx + "/yqdt/yqdt/ajax_del_news";
		var submitData = {
			id : num
		};
		$.post(url, submitData, function(data) {
			GHBB.hide();
			alert("删除成功!");
			if(type==33){
				cpgl_generate_table('33','xtxx');
			}else if(type==32||type==37||type==38){
				cpgl_generate_table('32,37,38','about');
			}else {
				cpgl_generate_table('34,35,36','gnjs');
			}
			return false;
		});
	}
}

function toEdit(num) {
	
	$('#addOrEdit').html("修改");
	var url = ctx + "/yqdt/yqdt/ajax_edit_news";
	var submitData = {
		id : num
	};
	$.post(url, submitData, function(data) {
		var datas = eval("(" + data + ")");
		$('#info-id').val(datas.id);
		$('#title-add').val(datas.title);
		var publishdate=datas.publishdate.split(" ");
		if(publishdate.length>1){
			publishdate=publishdate[0];
		}
		$('#createtime').val(publishdate);
		$('#school-chosen-add1').find("option[value='" + datas.campusid + "']")
				.attr("selected", true);
		$('#school-chosen-add1').trigger("chosen:updated");
		
		if (yqdtType == "21") {
			$('#guidetypes-chosen').find(
					"option[value='" + datas.guidetype + "']").attr("selected",
					true);
			$('#guidetypes-chosen').trigger("chosen:updated");
		}if (yqdtType == "30") {
			$('#type-chosen-add').find(
					"option[value='" + datas.type + "']").attr("selected",
					true);
			$('#type-chosen-add').trigger("chosen:updated");
		}
		if(datas.type=="32" || datas.type=="37"){
			$('#articleType option').each(function(){
				if($(this).val()==datas.type){
					$(this).attr("selected","true");
				}else{
					$(this).removeAttr("selected");
				}
			})
			$('#articleType').trigger("chosen:updated");
			$("#articleType_area").css("display","block");
		}else{
			$("#articleType_area").css("display","none");
		}
		
		if(datas.type == "33" || datas.type=="34" || datas.type=="35" || datas.type=="36"|| datas.type == "31"){
			$("#xxTypeDiv").show();
			$('#edit_xxType').find(
					"option[value='" + datas.xx_type + "']").attr("selected",
					true);
			$('#edit_xxType').trigger("chosen:updated");
		}else{
			$("#xxTypeDiv").hide();
		}
		
		$('#yqdtType').val(datas.type);
		editor.html(datas.jtnr);
		$('#jtnr').val(datas.jtnr);
		$('#modal-addconfig').modal('show');
		return false;
	});
}

function cpgl_generate_table(datatype,datatableid) {
	GHBB.prompt("正在加载~");
	var search_title=datatableid+"-";
	/* Initialize Datatables */
	var xx_type = 0;
	if(datatype == "34,35,36"){
		xx_type = $("#gnjs_xxType").val();
	}else if(datatype == "33"){
		xx_type = $("#xtxx_xxType").val();
	}else if(datatype == "31"){
		xx_type = $("#cjwt_xxType").val();
	}
	var sAjaxSource = ctx + "/zbgl/cpgl/ajax_query?dataType="+datatype+"&title="+ $('#title-'+datatableid).val() + "&state=1,2&xxType="+xx_type;

	var rowno=0;
	var columns = [ {
			"sTitle" : "序号",
			"mDataProp" : "title",
			"sClass" : "text-center"
		}, {
			"sTitle" : "标题",
			"mDataProp" : "title",
			"sClass" : "text-center"
		}, {
			"sTitle" : "类型",
			"mDataProp" : "type",
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
			"sTitle" : "状态",
			"mDataProp" : "state",
			"sClass" : "text-center"
		}, {
			"sTitle" : "管理",
			"mDataProp" : "publishdate",
			"sClass" : "text-center"
		} ];
	$('#datatable-'+datatableid).dataTable({
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"sAjaxSource" : sAjaxSource,
		"aoColumns" : columns,
		"bAutoWidth" : false,
		"bServerSide" : true,// 服务器端必须设置为true
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    },
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			rowno=rowno+1;
			$('td:eq(0)', nRow).html(rowno);
			var type_ch="";
			
			if(aaData.type=="34"){
				type_ch="功能介绍";
			}else if(aaData.type=="35"){
				type_ch="家长指南";
			}else if(aaData.type==36){
				type_ch="老师指南";
			}else if(aaData.type==33){
				type_ch="系统消息";
			}else if(aaData.type==31){
				type_ch="常见问题";
			}else if(aaData.type==32){
				type_ch="关于我们";
			}else if(aaData.type==37){
				type_ch="用户须知";
			}else if(aaData.type==38){
				type_ch="技术支持";
			}
			$('td:eq(2)', nRow).html(type_ch);
			var state_ch="已发布";
			if(aaData.state==1){
				state_ch="未发布";
			}
			$('td:eq(5)', nRow).html(state_ch);
			var editHtml='<div style="text-align:center;"><a href="javascript:toEdit('+aaData.id+')">编辑</a>&nbsp;&nbsp;<a href="javascript:delConfirm('+aaData.id+','+aaData.type+')">删除</a></div>';
 			$('td:eq(6)', nRow).html(editHtml);
 			return nRow;
		},
	});	
}

/**
 * 
 * @param state
 *            1保存草稿 2:正式发布 3:预览
 * @returns {Boolean}
 */
function btnClick(state) {
	if(state == 3 && (slaveuser == null || slaveuser == "")){
		alert("您登录的账号未绑定无法预览，请通过手机端进行绑定");
		return;
	}
	var info = $("#info-id").val();
	var title = $("#title-add").val().replace(/\t/g, "");
	var synchro = $("#synchro").val();
	var campusid = "";
	var ifpush = 0;
	var type = $("#yqdtType").val();
	if(type=="32"){
		type=$("#articleType").val();
	}
	var xxType = 1;
	if(type == "33" || type == "31"){
		xxType = $("#edit_xxType").val();
	}
	
	if ($("#title-add").val() == "" || $("#title-add").val() == null) {
		return;
	}
	
	if (confirm("是否确定继续操作?")) {
		GHBB.prompt("数据保存中~");
		var orgcodes = "";
		
		var url = ctx + "/zbgl/cpgl/ajax_add_news";
		var submitData = {
			id : $("#info-id").val(),
			title : title,
			type:type,
			campusid : "",
			publishdate : $("#createtime").val(),
			jtnr : $("#jtnr").val(),
			appid:$("#appid").val(),
			state:state,
			xx_type:xxType
		};
		$.post(url, submitData, function(data) {
			GHBB.hide();
			if (data == "error" && state == "2") {
				alert("该类型已存在,不能新增");
				return false;
			}else{
				$("#info-id").val(data);
			}
			if(state != "3"){
				$('#modal-addconfig').modal('hide');
			}else{
				alert("预览消息发送成功，请在手机上查看效果！");
			}
			if(type==33){
				cpgl_generate_table('33','xtxx');
			}else if(type==32||type==37||type==38){
				cpgl_generate_table('32,37,38','about');
			}else {
				cpgl_generate_table('34,35,36','gnjs');
			}
			
			return false;
		});
		return false;
	} else
		return false;

}

function previewInThePhone(id){
	var userid = $("#userid").val();
	var campusid = $("#school-chosen").val();
	var orgcode = $("#orgcode").val();
	var appid = "";
	if(yqdtType == "2"){
		appid = "1071022";
	}else if(yqdtType == "3"){
		appid = "1071032";
	}else{
		alert("非公告、新闻模块不支持预览手机端页面功能！");
		return;
	}
    var url = ctx+"/mobile/loading_page?orgcode="+orgcode+"&campusid="+campusid+"&appid="+appid+"&dataid="+id+"&userid="+userid+"&preview=1";
	window.open (url,'newwindow','height=580,width=360,top=20,left=330,scrollbars=yes,location=no');
}