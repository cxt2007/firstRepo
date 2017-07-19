/*
 *  Document   : mrcpmanage.js
 *  Author     : lxb
 *  Description: 每周食谱管理页面JS
 */
var ctx="";
var mrcpmanage = function() {
    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();

var DAILY_MANAGE_MZCP_QUERY_COMMENT_LIST_FOR_PC = $("#DAILY_MANAGE_MZCP_QUERY_COMMENT_LIST_FOR_PC").val();
var DAILY_MANAGE_MZCP_COMMENT_SELECT = $("#DAILY_MANAGE_MZCP_COMMENT_SELECT").val();
var commonUrl_ajax = $("#commonUrl_ajax").val();
var weeknum = $("#current_weekinx").val();
var mrcpids = "";
var campusId = "";
var currentNjList = "";
var commentReplyPage = 0;

$(document).ready(function() {
	findXqbBycampusid();
	campusId = $("#mrcp_campus_chosen").val();
	
	$("#mrcp_campus_chosen").change(function() {
		findXqbBycampusid();
	});
	
	$("#mrcp-njsj-chosen").change(function() {
//		generate_table_mrcp(weeknum);
		findMrcpByWeekInx(weeknum);
	});
	
	$("#mrcp-weekinx-chosen").change(function() {
		weeknum = $("#mrcp-weekinx-chosen").val();
//		generate_table_mrcp(weeknum);
		findMrcpByWeekInx(weeknum);
	});
	
	$("#saveMrcpInfo").click(function() {
		ajaxSaveMrcp();
	});
	
	$("#resetMrcp").click(function() {
		resetNewMrcp();
	});
	
	$("#mrcp_import_campus").change(function() {
		getSerchImportNjsjList();
		
	});
	
	$("#copy_mrcp_btn").click(function() {
		getCopyMrcpModelNjsjList();
		ajaxQueryWeeklist("#mrcp_copy_weekinx");
		$('#copyMrcpModal').modal('show');
	});
	
	$("#mrcpSendTimeBtn").click(function() {
		saveMrcpSendTime();
	});
	
	$("#copyMrcpInfoBtn").click(function(){
		copyMrcpToAnotherWeek();
	});
	
	$("#uploadFile").change(function(){
		uploadImg();
	});
	
	$("#ifSelected").click(function(){
		changeCheckBoxValue();
	});
	
	$("#replyNextPage").click(function(){
		changeReplyPage(1);
	});
	$("#replyPreviousPage").click(function(){
		changeReplyPage(2);
	});
	
	$("#btnAuth_span_reply").click(function(){
		replyMessage();
	});
	
	initWebUploader();
});

$(function(){
	$("#mrcp_import_njsj").multiselect({
		selectedList: 20
	});
	
	$("#mrcp_copy_njsj").multiselect({
		selectedList: 20
	});
});

function getWeekNumber(){
	var msg = "没有选项！";
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.COMMON_WEEK_NUMBER,
			param: JSON.stringify({
				campusid : $('#mrcp_campus_chosen').val()
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				$("#current_weekinx").val(result.data.weeknum);
				//$('#mrcp-weekinx-chosen').trigger("chosen:updated");
				
				weeknum = result.data.weeknum;
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function findXqbBycampusid() {
	GHBB.prompt("正在加载~");
	var url = ctx + "/jyhd/mrcpref/ajax_query_xqb";
	var submitData = {
		campusid : $('#mrcp_campus_chosen').val(),
	};
	$.post(url, submitData, function(data) {
		GHBB.hide();
		var datas = eval(data);
		if (datas.length <= 0) {
			alert("您所在校区未设置当前学期");
			$('#mrcp_campus_chosen').find("option[value='"+campusId+"']").attr("selected",true);
			$('#mrcp_campus_chosen').trigger("chosen:updated");
			return findXqbBycampusid();
		} else {
			campusId = $("#mrcp_campus_chosen").val();
			getWeekNumber();
			getSerchFormNjsjList();
			ajaxQueryWeeklist("#mrcp-weekinx-chosen");
			getSerchFormNjsjList();
			findMrcpByWeekInx(weeknum);
		}
	});
}


function findSendTimeByCampusid() {
	var url = ctx + "/jyhd/mrcpref/findSendTimeByCampusid";
	var submitData = {
		campusid : $('#mrcp_campus_chosen').val(),
	};
	$.ajax({
		cache:false,
		type: "POST",
		async:false,
		url: url,
		data: submitData,
		success: function(json){
			var result = eval(json);
			$("#sendtime").val(result);
		}
	});
}

function ajaxQueryWeeklist(obj) {
	var url = ctx+"/jyhd/mrcpref/ajax_query_weeklist";
	var submitData = {
		campusid : $('#mrcp_campus_chosen').val(),
	}; 
	
	$.get(url,submitData, function(data) {
		var datas = eval(data);
		var selectOption = obj+" option";
		$(selectOption).remove();//user为要绑定的select，先清除数据   
        for(var i=0;i<datas.length;i++){
        	var currentWeek = "";
        	var currentClass = "";
        	if($("#current_weekinx").val()==datas[i]+1){
        		currentWeek = "--本周";
        		currentClass = "selected";
        	}
        	$(obj).append("<option value=" + (datas[i]+1)+" "+currentClass+">第"
        			+ (datas[i]+1) + "周食谱"+currentWeek+"</option>");
        };
        $(obj).find("option[index='0']").attr("selected",'selected');
        $(obj).trigger("chosen:updated");
		$("#week_list").html(data);
	});
}

function findMrcpByWeekInx(weekinx){
//	$(obj).parent().children().removeClass("currentTag");
//	$(obj).addClass("currentTag");
	weeknum = weekinx;
	var submitData = {
		weekinx : weekinx,
		campusid : $('#mrcp_campus_chosen').val(),
	}; 
	var url = ctx+"/jyhd/mrcpref/ajax_query_WeekHeader";
	
	$.get(url,
		submitData,
      	function(data){
			$("#mrcpHeader").html(data);
			generate_table_mrcp(weekinx);
      }); 
}


function showLastWeekMrcp(){
	var index = parseInt(weeknum)-1 ;
	if(index>0){
//		generate_table_mrcp(index);
		findMrcpByWeekInx(index);
		$('#mrcp-weekinx-chosen').find(
				"option[value='" + index + "']").attr("selected",
				true);
		$('#mrcp-weekinx-chosen').trigger("chosen:updated");
		weeknum = index;
	}
}

function showAfterWeekMrcp(){
	var index = parseInt(weeknum)+1 ;
	if(index <= $("#weekcount").val()){
//		generate_table_mrcp(index);
		findMrcpByWeekInx(index);
		$('#mrcp-weekinx-chosen').find(
				"option[value='" + index + "']").attr("selected",
				true);
		$('#mrcp-weekinx-chosen').trigger("chosen:updated");
		weeknum = index;
	}
}

function generate_table_mrcp(weekInx){
//	$("#mrcpHeader").find("th").eq(0).html("第"+weekInx+"周食谱列表");
//	$("#week_list").children().removeClass("currentTag");
//	$("#week_list").children().eq(weekInx-1).addClass("currentTag");
	GHBB.prompt("正在加载~");
	App.datatables();
	var sAjaxSource=ctx+"/jyhd/mrcpref/ajax_findMrcpInfo";
	var param = "search_EQ_campusid="+$("#mrcp_campus_chosen").val();
    param=param+"&search_EQ_njids="+$("#mrcp-njsj-chosen").val();
    param=param+"&search_EQ_weekInx="+weekInx;
    
    sAjaxSource=sAjaxSource+"?"+param;
    var aoColumns= [
                    	{ "sWidth": "100px", "sClass": "text-center ","mDataProp": "typeName"},
                    	{ "sWidth": "200px", "sClass": "text-center ","mDataProp": "cm_1"},
                    	{ "sWidth": "200px", "sClass": "text-center ","mDataProp": "cm_2"},
                    	{ "sWidth": "200px", "sClass": "text-center ","mDataProp": "cm_3"},
                    	{ "sWidth": "200px", "sClass": "text-center ","mDataProp": "cm_4"},
                    	{ "sWidth": "200px", "sClass": "text-center ","mDataProp": "cm_5"},
                    	{ "sWidth": "200px", "sClass": "text-center ","mDataProp": "cm_6"},
                    	{ "sWidth": "200px", "sClass": "text-center ","mDataProp": "cm_7"}
                   ];
    
    $('#mrcp-datatable').dataTable({
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bAutoWidth":false,
        "bPaginate":false,
        "bSort":false,
        "bInfo":false,
        "sAjaxSource": sAjaxSource,
        "fnRowCallback": function(nRow, aaData, iDisplayIndex ) {
        	$(nRow).addClass(setRowBackground(nRow));
        	// 周一
        	var editMonHtml = assembleMrcpHtml(1,aaData.type,aaData.cm_1,aaData.cm_id_1,aaData.cm_iconpath_1,aaData.commentList,iDisplayIndex);
        	$('td:eq(1)', nRow).html(editMonHtml);
        	// 周二
    		var editTueHtml = assembleMrcpHtml(2,aaData.type,aaData.cm_2,aaData.cm_id_2,aaData.cm_iconpath_2,aaData.commentList,iDisplayIndex);
        	$('td:eq(2)', nRow).html(editTueHtml);
        	// 周三
    		var editWedHtml = assembleMrcpHtml(3,aaData.type,aaData.cm_3,aaData.cm_id_3,aaData.cm_iconpath_3,aaData.commentList,iDisplayIndex);
        	$('td:eq(3)', nRow).html(editWedHtml);
        	// 周四
    		var editThuHtml = assembleMrcpHtml(4,aaData.type,aaData.cm_4,aaData.cm_id_4,aaData.cm_iconpath_4,aaData.commentList,iDisplayIndex);
        	$('td:eq(4)', nRow).html(editThuHtml);
        	// 周五 	
    		var editFirHtml = assembleMrcpHtml(5,aaData.type,aaData.cm_5,aaData.cm_id_5,aaData.cm_iconpath_5,aaData.commentList,iDisplayIndex);
        	$('td:eq(5)', nRow).html(editFirHtml);
        	// 周六
    		var editSatHtml = assembleMrcpHtml(6,aaData.type,aaData.cm_6,aaData.cm_id_6,aaData.cm_iconpath_6,aaData.commentList,iDisplayIndex);
        	$('td:eq(6)', nRow).html(editSatHtml);
        	// 周日
    		var editSunHtml = assembleMrcpHtml(7,aaData.type,aaData.cm_7,aaData.cm_id_7,aaData.cm_iconpath_7,aaData.commentList,iDisplayIndex);
        	$('td:eq(7)', nRow).html(editSunHtml);
        	
		},  
        "aoColumns":aoColumns,
        "fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
    });
}

function setRowBackground(nRow){
	var typeName = $('td:eq(0)', nRow).html();
	if(typeName == '早餐'){
		return 'active tr-height';
	}else if(typeName == '早点'){
		return 'success tr-height';
	}else if(typeName == '午餐'){
		return 'warning tr-height';
	}else if(typeName == '午点'){
		return 'danger tr-height';
	}else if(typeName == '晚餐'){
		return 'info tr-height';
	}else{
		return 'tr-height';
	}
}


function assembleMrcpHtml(weekday,type,cm,id,iconpath,commentList,iDisplayIndex){
	if(iDisplayIndex != 5){
		var detailDiv = "";
		var onclickHtml = "";
		if(cm==null || cm == "null" || cm == ""){
			detailDiv = '<div style="font-size:22px;color:#999;">+</div>';
		}else{
			if(iconpath==undefined || iconpath == null || iconpath == ""){
				detailDiv = '<div style="width:100%;text-align:center;word-wrap: break-word;max-width:150px;overflow : hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 5;-webkit-box-orient: vertical;">'
					+ cm
					+ '</div>';
			}else{
				detailDiv = '<div style="width:100%;"><div style="width:60%;float:left;border:0px solid #000;">'
					+ '<img style="width:60px;" src="'+checkQiniuUrl(iconpath)+'"></img>'
					+ '</div>'
					+ '<div style="width:40%;float:left;border:0px solid #000;text-align:left;word-wrap: break-word;max-width:150px;overflow : hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 5;-webkit-box-orient: vertical;">'+cm+'</div>'
					+ '</div>';
			}
		}
		onclickHtml = ' onclick="toEdit('+weekday+','+type+','+id+')" ';
		var str = '<div style="text-align:center;cursor:pointer;" '+onclickHtml+'>'+detailDiv+'</div>';
	}else{
		var commentInfo = commentList[weekday - 1];
		var onclickHtml = ' onclick="showCommentBox(\''+commentInfo.dataid+'\');" ';
		str = '<div style="width:100%;height:100%;text-align:center;cursor:pointer;color:blue;" '+onclickHtml+'>'
			+ '	<span>评论'+commentInfo.commentCount+'</span>'
			+ '	<span>精选'+commentInfo.commentSelectCount+'</span>'
			+ '</div>';
	}
	return str;
}

function getSerchFormNjsjList(){
	
	var url=ctx+"/jyhd/mrcpref/findNjsjByCampusid";
	var submitData = {
		campusid: $("#mrcp_campus_chosen").val(),
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			currentNjList = datas;
			$("#mrcp-njsj-chosen option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	
	        	$("#mrcp-njsj-chosen").append("<option value=" + datas[i].id+" >"
	        			+ datas[i].njmc + "</option>");
	        };
	        $("#mrcp-njsj-chosen").find("option[index='0']").attr("selected",'selected');
	        $("#mrcp-njsj-chosen").trigger("chosen:updated");
	        
	        generate_table_mrcp(weeknum);
    });
}

function getSerchImportNjsjList(){
	var url=ctx+"/jyhd/mrcpref/findNjsjByCampusid";
	var submitData = {
		campusid: $("#mrcp_import_campus").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#mrcp_import_njsj option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	
	        	$("#mrcp_import_njsj").append("<option value=" + datas[i].id+" >"
	        			+ datas[i].njmc + "</option>");
	        };
	        $("#mrcp_import_njsj").multiselect('refresh'); 
	        getSerchImportWeekList();
    });
}

function getCopyMrcpModelNjsjList(){
	var njid = $("#mrcp-njsj-chosen").val();
	var url=ctx+"/jyhd/mrcpref/findNjsjByCampusid";
	var submitData = {
		campusid: $("#mrcp_campus_chosen").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#mrcp_copy_njsj option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	$("#mrcp_copy_njsj").append("<option value=" + datas[i].id+" >"
	        			+ datas[i].njmc + "</option>");
	        	if(njid == datas[i].id){
	        		$('#mrcp_copy_njsj').find(
	        				"option[value='" + njid + "']").attr("selected",
	        				true);
	        	}
	        };
	        $("#mrcp_copy_njsj").multiselect('refresh'); 
    });
}

function getSerchImportWeekList(){
	var url=ctx+"/jyhd/mrcpref/findWeekByCampusid";
	var submitData = {
		campusid: $("#mrcp_import_campus").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);

			$("#mrcp_import_weekinx").find("option").remove();
			if(datas != "" && datas != undefined){
		        for(var i=0;i<datas.length;i++){
		        	$("#mrcp_import_weekinx").append("<option value=" + (datas[i]+1)+" >第"
		        			+ (datas[i]+1) + "周</option>");
		        };
		        $("#mrcp_import_weekinx").find("option[index='0']").attr("selected",'selected');
		        $("#mrcp_import_weekinx").trigger("chosen:updated");
			}else{
				$("#mrcp_import_weekinx option").remove();
				alert("学期数据有误，请检查是否设置当前学期和学期周数！");
			}
			
    });
}


function improtFile() {
	var filepath = $("input[name='improtMrcpFile']").val();
	
	if (filepath == undefined || $.trim(filepath) == "") {
		alert("请选择上传文件！");
		return;
	} else {
		var fileArr = filepath.split("//");
		var fileTArr = fileArr[fileArr.length - 1].toLowerCase().split(".");
		var filetype = fileTArr[fileTArr.length - 1];
		if (filetype != "xls") {
			alert("暂只支持2003格式的Excel文件(后缀为xls)");
			return;
		}
	}
	
	mrcpImportuploadFile();

}

function mrcpImportuploadFile() {
	GHBB.prompt("数据正在导入中~");
	progress();
	var campusid = $("#mrcp_import_campus").val();
	var njids = $("#mrcp_import_njsj").val();
	var week = $("#mrcp_import_weekinx").val();
	$.ajaxFileUpload({
		url : ctx + '/jyhd/mrcpref/mrcpInfoImport?campusid='+campusid
				  + "&njids="+njids
				  + "&weekinx="+week,//需要链接到服务器地址
		secureuri : false,
		fileElementId : 'improtMrcpFile',//文件选择框的id属性
		dataType : 'json', //服务器返回的格式，可以是json
		success : function(data, status) {
			GHBB.hide();
			$("#serialnumber").val(
					data.serialnumber.replace("[", "").replace("]", ""));
			$("#errstate").val(
					data.state.replace("[", "").replace("]", ""));
			var gridhtml = data.griddata.replace(/\&lt;/g, "<").replace(
					/\&gt;/g, ">").replace("[", "").replace("]", "");
			$("#div_mrcp_content_view").html(gridhtml);
			$('#save_importMrcpInfo').removeAttr('disabled');
			$('#save_importMrcpInfo').removeClass("disabled");
			$('#save_importMrcpInfo').addClass("btn-primary");	
		},
		error : function(data, status) {
			GHBB.hide();
			alert(data);
		}
	});
}

function progress() {
	$("#loading").ajaxStart(function() {
		setTimeout(function() {
			$.messager.progress('close');
		}, 15000);
	}).ajaxComplete(function() {
		//$.messager.progress('close');
	});
}

function save_importMrcpInfo(){
	var url=ctx+"/jyhd/mrcpref/mrcpInfoAddBatch";
	if($("#serialnumber").val() == ""){
		alert("数据存在错误，无法保存！");
		return ;
	}
	if($("#errstate").val() == "false"){
		alert("数据存在错误，无法保存！");
		return ;
	}
	
	if(confirm("是否将预览食谱作为,第"+$("#mrcp_import_weekinx").val()+"周食谱?")){
		var submitData = {
				serialnumber: $("#serialnumber").val(),
				campusid: $("#mrcp_import_campus").val(),
				weekinx: $("#mrcp_import_weekinx").val(),
				appid:$("#appid").val()
			}; 
			$('#save_importMrcpInfo').attr('disabled','disabled');
			$.post(url,
				submitData,
		      	function(data){
					$('#importMrcpModal').modal('hide');
					$("#current_weekinx").val($("#mrcp_import_weekinx").val());
					weeknum = $("#mrcp_import_weekinx").val();
					generate_table_mrcp($("#mrcp_import_weekinx").val());
					$('#save_importMrcpInfo').removeAttr('disabled');
					//$('#showcard').removeAttr('disabled');
					
					$('#mrcp_campus_chosen').find(
							"option[value='" + $("#mrcp_import_campus").val() + "']").attr("selected",
							true);
					$('#mrcp_campus_chosen').trigger("chosen:updated");
					
					$('#mrcp-weekinx-chosen').find(
							"option[value='" + weeknum + "']").attr("selected",
							true);
					$('#mrcp-weekinx-chosen').trigger("chosen:updated");	
					
		      }); 
		
	}else{
		return;
	}
	return false;
}

function selectWeek(weekinx) {
	var campusid = $("#campusid").val();
	weeknum = weekinx;
	ajaxQueryMrcp(weekinx, campusid);
	$("#page_weekinx").val(weekinx);
	$("#cp_title").text("第" + weekinx + "周菜谱");

}

function showWeek() {
	$('#week_window').show();
}

function showAddCm() {
	$('#add_cm_window').show();
	$('#input_new_cm').val("");
	$('#input_new_ingredient').val("");
	$('#input_new_yyjz').val("");

}

function hideAddCm() {
	$('#add_cm_window').hide();
}

function hideWeek() {
	$('#week_window').hide();
}

function toEdit(weekday,timetype,mrcpIds) {
	var submitData = {
			mrcpid: mrcpIds,
	}; 
	var url = ctx+"/jyhd/mrcpref/ajax_query_mrcp_detail";
	$.get(url,
		submitData,
      	function(data){
//			$('input[name=edit_njsj]').attr('checked',false);
			$("#iconpath").attr('src',''); 
			$("#mrcp_iconpath").val('');
			var json = JSON.parse(data);
			
			$("#input_new_cm").val(json.cm);
			$("#input_new_ingredient").val(json.ingredient);
			$("#mrcp_id").val(json.id);
			$("#mrcp_type").val(timetype);
			$("#weekday").val(weekday);
			$("#iconpath").attr('src',json.iconpath); 
			$("#mrcp_iconpath").val(json.iconpath);
			if(json.iconpath==null||json.iconpath=="null"||json.iconpath==""){
				$("#delImageBtn").css("display","none");
			}else{
				$("#delImageBtn").css("display","block");
			}
			findNjsjByCampusId();

			findCmByType(json.weekday,timetype);			
			$('#myModal').modal('show');
      }); 

	//disableSaveBtn();
}

function findNjsjByCampusId(){
//	var njids = $("#mrcp-njsj-chosen").val();
	$(".checkbox-inline").find('input').removeAttr("checked");
	var url=ctx+"/jyhd/mrcpref/findNjIdsByCampusidAndWeekinx";
	var submitData = {
		campusid: $("#mrcp_campus_chosen").val(),
		weekinx : weeknum,
		njid:$("#mrcp-njsj-chosen").val()
	}; 
	$.post(url,
		submitData,
      	function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			var njArr = currentNjList;
			$("#njsjDiv").html('');
			var njsjDivHtml = "<label>同步修改当天用餐  </label>&nbsp;&nbsp;";
			
			var njids = result.noMrcpNjids;
			var njid = "";
			if(njids != undefined && njids != null && njids != ""){
				njid = njids.split(",");
			}

			for(var i=0;i<njArr.length;i++){
				var disableClass = "";
				if(njid != null && njid.length>0){
					for(var j=0;j<njid.length;j++){
						if(njArr[i].id+"" == njid[j]+""){
							disableClass = "";
							break;
						}else{
							disableClass = " disabled='disabled' ";
						}
					}
				}else{
					disableClass = " disabled='disabled' ";
				}
				njsjDivHtml = njsjDivHtml+"<label class='checkbox-inline'><input type='checkbox' id='edit_njsj_"+njArr[i].id+"' name='edit_njsj' "+disableClass+" value='"+njArr[i].id+"'>"+njArr[i].njmc+"</label>";	
			}
			$("#njsjDiv").html(njsjDivHtml);
			
			var njids = result.mrcpNjids;
			$("input[name='edit_njsj']").attr("checked",false);	
			if(njids != undefined || njids != null ){
				var njidArr = njids.split(",");
				if(njidArr != null && njidArr.length>0){
					for(var i=0;i<njidArr.length;i++){
						var checkbox = '#edit_njsj_'+njidArr[i];
						$(checkbox).prop("checked",'checked');
					}
				}
			}else{
				njids = result.noMrcpNjids;
				var njidArr = njids.split(",");
				if(njidArr != null && njidArr.length>0){
					for(var i=0;i<njidArr.length;i++){
						var checkbox = '#edit_njsj_'+njidArr[i];
						$(checkbox).prop("checked",'checked');
					}
				}
//				var checkbox = '#edit_njsj_'+$("#mrcp-njsj-chosen").val();
//				$(checkbox).prop("checked",true);
//				$(".checkbox-inline").find('input').attr("checked",true);
			}
    });
}



function findCmByType(weekday,type){ 
	var sAjaxSource = ctx+"/jyhd/mrcpref/ajax_query_cm";
	var param = "search_EQ_campusid="+$("#mrcp_campus_chosen").val();
    param=param+"&search_EQ_weekinx=" + weeknum + "&search_EQ_weekday=" + weekday + "&search_EQ_type=" + type;
    sAjaxSource=sAjaxSource+"?"+param;
    $.get(sAjaxSource, {}, function(data) {
    	var datas = eval(data);
    	$("#historyMrcpCmDiv").html('');
    	for(var i=0;i<datas.length;i++){
    		var iconpath = "";
    		if(datas[i].iconpath != null && datas[i].iconpath != undefined){
    			iconpath = datas[i].iconpath;
    		}
        	$("#historyMrcpCmDiv").append('<div class="mainKey"><a href="javascript:setCmAndIngredient(\''+datas[i].cm+'\',\''+datas[i].ingredient+'\',\''+iconpath+'\');">' + datas[i].cm + '</a></div>');
        };
	});
    
}

function setCmAndIngredient(cm,ingredient,iconpath){
	$('#input_new_cm').val(cm);
	$('#input_new_ingredient').val(ingredient);
	$("#iconpath").attr('src',iconpath); 
	$("#mrcp_iconpath").val(iconpath); 
}

function ajaxSaveMrcp() {
	var weekday = $('#weekday').val();
	var type = $('#mrcp_type').val();
	var campusid = $('#mrcp_campus_chosen').val();
	var cm = $('#input_new_cm').val();
	var ingredient = $('#input_new_ingredient').val();
	var njids = getAddNjids();
	if((cm==null || cm=='') && ingredient!=null && ingredient!=''){
		alert("菜名不能为空");
		return false;
	}
	if(cm.length > 500){
		alert("请限制菜名字数在500字以内");
		return;
	}
	if(ingredient.length > 500){
		alert("请限制配料字数在500字以内");
		return;
	}
	var submitData = {
		weekinx: weeknum,
		weekday:weekday,
		campusid:campusid,
		id:$('#mrcp_id').val(),
		ingredient:ingredient,
		cm:cm,
		type:type,
		njids:njids,
		iconpath:$("#mrcp_iconpath").val(),
		appid:$("#appid").val()
	}; 
	
	var url = ctx+"/jyhd/mrcpref/save_mrcpref";

	$.get(url, submitData, function(data) {
		generate_table_mrcp(weeknum);
		$('#myModal').modal('hide');
		//generate_table_cmqd(weekday,type);
	});
}

function getAddNjids(){
	var njids = "";
	var chk_value=[];
	$("input[name=edit_njsj]:checked").each(function(){
		chk_value.push($(this).val());
	});
	for(var i=0;i<chk_value.length;i++){
		njids += chk_value[i]+",";
	}
	if(njids.length>0){
		njids = njids.substring(0, njids.length-1);
	}
	return njids;
}

function resetNewMrcp(){
	$('#input_new_cm').val('');
	$('#input_new_ingredient').val('');
	var file = $("#uploadFile");
	file.after(file.clone().val(""));
	file.remove();
	$("#uploadFile").change(function(){
		uploadImg();
	});
	$("#iconpath").attr('src',""); 
	$("#mrcp_iconpath").val(""); 
	$("#delImageBtn").css("display","none");
}

function delImage(){
	var file = $("#uploadFile");
	file.after(file.clone().val(""));
	file.remove();
	$("#uploadFile").change(function(){
		uploadImg();
	});
	$("#iconpath").attr('src',""); 
	$("#mrcp_iconpath").val(""); 
	$("#delImageBtn").css("display","none");
}

function openImoortMrcpDialog() {
	//openMrcpDialog(2,2,'周二','午餐');
	$("#div_mrcp_content_view").html("");
	getSerchImportNjsjList();
	$('#importMrcpModal').modal('show');
	$('#save_importMrcpInfo').attr('disabled','disabled');
	//$('#myModalLabel').html("单击菜名选择<a onclick='showWeek()'>"+week_title+type_title+"</a>，如菜名不存在，请<a onclick='showWeek()'>新增</a>。");
	//$('#myModalLabel').html("单击菜名选择 "+week_title+type_title+" ，如菜名不存在，请<a onclick='showAddCm()'>新增</a>");

}

function disableSaveBtn() {
	$('#save_menu').addClass("disabled");
	$('#save_menu').removeClass("btn-primary");
}

function enableSaveBtn() {

	$('#save_menu').removeClass("disabled");
	$('#save_menu').addClass("btn-primary");
}

function onclickx(menuid) {
	unSelectMenuAction(menuid);
}

var bgcSelect = "#d9edf7";
var borderSelect = "2px solid #bce8f1";

var bgcUnSelectColor = "#fcf8e3";
var borderUnSelect = "1px solid #fbeed5";

function unSelectMenuAction(menuid) {

	$('#menu_' + menuid).removeClass("large_menu_name_select");
	$('#menu_' + menuid).addClass("large_menu_name_unselect");

	$('#select_menu' + menuid).remove();
	$('#menu_' + menuid).attr("state", "0");

	enableSaveBtn();
}

function selectMenuAction(menuid) {

	$('#menu_' + menuid).removeClass("large_menu_name_unselect");
	$('#menu_' + menuid).addClass("large_menu_name_select");

	$('#menu_' + menuid).attr("state", "1");
	var menuname = $('#lable_' + menuid).text().trim();
	$("#selected_menu_content")
			.append(
					'<div id="select_menu'+menuid+'" menuid="'+menuid+'" class="selected_mrcp_style inner-td-div">'
							+ menuname
							+ '<a class="close" data-dismiss="alert"  onclick="onclickx('
							+ menuid + ')">×</a></div>');

	enableSaveBtn();
}

function refreshMrcp() {
	//ajaxQueryWeeklist();
}

function selectMenu(menuid) {
	
	var url = ctx+"/jyhd/mrcpref/ajax_query_mrcp_detail";
	var submitData = {
			mrcpid: menuid
	}; 
	$.get(url,
		submitData,
      	function(data){
			var json = JSON.parse(data);
			$("#input_new_cm").val(json.cm);
			$("#input_new_ingredient").val(json.ingredient);
			
      }); 
	
}

function editMenu(menuid) {
	alert("双击菜单id:" + menuid);
}

function showModifyBtn() {
	if ($("#edit_mrcp_btn").attr("state") == "0") {
		$(".cell_btn").show();
		$("#edit_mrcp_btn").text("关闭修改");
		$("#edit_mrcp_btn").attr("state", "1");
	} else {
		$(".cell_btn").hide();
		$("#edit_mrcp_btn").text("修改菜谱");
		$("#edit_mrcp_btn").attr("state", "0");
	}
}

function ajaxQueryMrcp(weekinx, campusid) {

	var url = ctx+"/jyhd/mrcp/ajax_query_mrcp?weekinx=" + weekinx
			+ "&campusid=" + campusid;

	$.get(url, {}, function(data) {
		// data contains the result
		// Assign result to the sum id
		$("#div_mrcp_table").html(data);
		if ($("#edit_mrcp_btn").attr("state") == "1") {
			$(".cell_btn").show();
		}
	});

}

function ajaxQueryCmqd() {

	var weekday = $('#page_weekday').val();
	var type = $('#page_timetype').val();
	var cname = $("#input_cmname").val();
	var campusid = $("#campusid").val();
	var url = ctx+"/jyhd/mrcp/ajax_query_cmqd?weekinx="
			+ $("#page_weekinx").val() + "&weekday=" + weekday + "&type="
			+ type + "&cmname=" + cname + "&campusid=" + campusid;

	$.get(url, {}, function(data) {
		// data contains the result
		// Assign result to the sum id
		$("#div_cmqd_content").html(data);
		//ajaxQuerySelectedCmqd();
	});

}

function ajaxQuerySelectedCmqd() {

	var weekday = $('#page_weekday').val();
	var type = $('#page_timetype').val();
	var campusid = $('#campusid').val();
	var url = ctx+"/jyhd/mrcp/ajax_query_selected_cmqd?weekinx="
			+ $("#page_weekinx").val() + "&weekday=" + weekday + "&type="
			+ type + "&campusid=" + campusid;

	$.get(url, {}, function(data) {
		// data contains the result
		// Assign result to the sum id   
		$("#selected_menu_content").html(data);
	});

}

function ajaxAddCmqd() {

	var cm = $('#input_new_cm').val();
	var type = $('#page_timetype').val();
	var yyjz = $('#input_new_yyjz').val();
	var ingredient = $('#input_new_ingredient').val();
	var campusid = $('#campusid').val();

	var url = ctx+"/jyhd/mrcp/add_cmqd?type=" + type + "&cm=" + cm
			+ "&ingredient=" + ingredient + "&yyjz=" + yyjz + "&campusid="
			+ campusid;
	$.get(url, {}, function(data) {
		ajaxQueryCmqd();
		hideAddCm();
	});
}

String.prototype.trim = function() {
	var str = this, whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
	for ( var i = 0, len = str.length; i < len; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}
	for (i = str.length - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};

function getMrcpListByCampusId() {
	var campusid = $('#campusid').val();
	ajaxQueryMrcp(weeknum, campusid);
}

function showDetailInfo(weekday, type,mrcpid) {
	
	var url = ctx+"/jyhd/mrcpref/ajax_query_mrcpdetailRef?mrcpid=" + mrcpid;
	$.get(url, {}, function(data) {
		$("#div_mrcp_content").html(data);
		$('#myDailog').modal('show');
	});
}

function delConfirm(){
	if(confirm("确定删除第"+weeknum+"周食谱?")){
			var campusid = $('#mrcp_campus_chosen').val();
			var njids = $('#mrcp-njsj-chosen').val();
			var url = ctx+"/jyhd/mrcpref/deleteMrcp?weekinx=" + weeknum + "&campusid=" + campusid + "&njids=" + njids;
			$.get(url, {}, function(data) {
				generate_table_mrcp(weeknum);
			});
		 return true;
	}else 
		return false;
}

var mrcpids = "";

function uploadImg() {
	mrcpIds = $("#mrcp_id").val();
//	if(mrcpIds == undefined || mrcpIds == ''){
//		alert("请先设置菜谱信息！");
//		return ;
//	}
	mrcpids = mrcpIds;
	var oData = new FormData(document.forms.namedItem("uploadfileinfo"));
	oData.append("CustomField", "This is some extra data");
	var oReq = new XMLHttpRequest();
	oReq.open("POST",
			ctx+"/jyhd/mrcpref/picupload?isAjax=true&resType=json&mrcpIds="
					+ mrcpIds, true);
	
	oReq.onload = function(oEvent) {
		if (oReq.status == 200 && oReq.responseText != '') {
			$("#iconpath").attr('src',oReq.responseText); 
			$("#mrcp_iconpath").val(oReq.responseText); 
			$("#delImageBtn").css("display","block");
//			alert("保存成功");
		} 
	};
	oReq.send(oData);
} ;

function setMrcpSendTime(){
	findSendTimeByCampusid();
	$('#mrcpSendTimeModal').modal('show');
}

function saveMrcpSendTime(){
	var url = ctx+"/jyhd/mrcpref/save_mrcp_sendtime?campusid=" + $('#mrcp_campus_chosen').val()+"&configvalue="+$("#sendtime").val();
	$.get(url, {}, function(data) {
		if(data == "success"){
			alert("保存成功");
		}else{
			alert(data);
		}
		$('#mrcpSendTimeModal').modal('hide');
	});
}

function copyMrcpToAnotherWeek(){
	var njid = $("#mrcp-njsj-chosen").val();
	var toNjid = $("#mrcp_copy_njsj").val();
	var week = $("#mrcp-weekinx-chosen").val();
	var toWeek = $("#mrcp_copy_weekinx").val();
	
	if(toNjid.indexOf(njid)>=0 && week == toWeek){
		alert("不能复制食谱到本周本年级！");
		return ;
	}
	
	var url = ctx+"/jyhd/mrcpref/copy_mrcp_to_otherWeek?campusid=" + $('#mrcp_campus_chosen').val()+"&njid=" + njid + "&toNjid="+ toNjid
	+"&weekinx="+ week +"&toWeekinx=" + toWeek;
	$.get(url, {}, function(data) {
		alert(data);
		$('#copyMrcpModal').modal('hide');
	});
}

function showCommentBox(mrcpids){
	$("#mrcpids").val(mrcpids);
	$("#mrcpCommentModal").modal('show');
	generate_table_mrcp_comment();
}

function closeCommentBox(){
	$("#mrcpids").val("");
	$("#mrcpCommentModal").modal('hide');
	generate_table_mrcp($("#mrcp-weekinx-chosen").val());
}

function generate_table_mrcp_comment(){
    var aoColumns = [ {
		"sTitle" : "精选评论",
		"mDataProp" : "id",
		"sClass" : "text-center"
	},{
		"sTitle" : "评论人",
		"mDataProp" : "publisher",
		"sClass" : "text-center"
	},{
		"sTitle" : "评论时间",
		"mDataProp" : "commentTime",
		"sClass" : "text-center"
	},{
		"sTitle" : "内容",
		"mDataProp" : "content",
		"sClass" : "text-center",
		"sWidth" : "400px"
	} ];
    
    
    $('#mrcp-comment-datatable').dataTable({
    	"aaSorting":[ [3,'desc']],
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bAutoWidth":false,
        "bSort":false,
        "sAjaxSource": commonUrl_ajax,
        "bServerSide":true,//服务器端必须设置为true
        "fnServerParams": function (aoData) {
			var param = {
				campusid : $("#mrcp_campus_chosen").val(),
				dataid : $("#mrcpids").val(),
				selectedState : $("#ifSelected").val(),
				"iDisplayStart" : 0,
		        "iDisplayLength": 10,
		        "sEcho" : 1
				
			};
			aoData.push( { "name": "api", "value": DAILY_MANAGE_MZCP_QUERY_COMMENT_LIST_FOR_PC } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
		},
		"fnServerData": function (sSource, aoData, fnCallback) {
            $.ajax( {
                "dataType": 'json',
                "type": "POST",
                "url": sSource,
                "data": aoData,
                "success": function(json) {
                	if (json.ret.code == 200) {
                		fnCallback(json.data);
                	} else {
                		alert(json.ret.msg);
                	}
				}             
            } );
        },
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
        	var checked = aaData.isSelected == "1" ? "checked" : "";
        	var state='<label class="switch switch-primary"><input type="checkbox" '+checked+' onclick="selectComment(\''+aaData.serialnumber+'\',this);"><span></span></label>';
        	$('td:eq(0)',nRow).html(state);
        	var span = '<a title="'+aaData.content+'" style="display:block;width:400px;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;cursor: pointer;" '
        	+'onclick="showCommentReply(\''+aaData.publisherid+'\',\''+aaData.publishdate+'\',\''+aaData.publisher+'\',\''+aaData.serialnumber+'\',this);">'+aaData.content+'</a>'
        	$('td:eq(3)',nRow).html(span);
		}, 
        "aoColumns":aoColumns
    });
}

function showCommentReply(publisherid,publishdate,publisher,serialnumber,obj){
	$("#c_publisher").html(publisher);
	$("#c_publishdate").html(publishdate);
	$("#c_content").html($(obj).html());
	$("#c_serialnumber").val(serialnumber);
	$("#c_receiveid").val(publisherid);
	$("#c_receiver").val(publisher);
	commentReplyPage = 0;
	$('#messageReplyBox').html('');
	$('.messageReplyFooter').hide();
	$('#replyContent').val('');
	getReplyList();
	$("#modal-comment-reply").modal('show');
}

function getReplyList(){
	var pageLength = 2;
	var pageStart = commentReplyPage * pageLength;
	var submitData = {
		api : ApiParamUtil.DAILY_MANAGE_MZCP_COMMENT_RECEIVE_LIST,
		param : JSON.stringify({
			serialnumber: $("#c_serialnumber").val(),
			pageStart:pageStart,
			pageLength:pageLength
		})
	};
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code == 200) {
				createLeaveReplyContent(result.data.dataList);
				if(result.data.pageTotal>2)
					$('.messageReplyFooter').show();
				if(commentReplyPage==0){
					$('#replyPreviousPage').attr("disabled","");
				}else{
					$('#replyPreviousPage').removeAttr("disabled");
				}
				if(commentReplyPage+1 >= Math.ceil(result.data.pageTotal/pageLength)){
					$('#replyNextPage').attr("disabled","");
				}else{
					$('#replyNextPage').removeAttr("disabled");
				}
			} else {
				PromptBox.alert(result.ret.msg);
			}
			$("#modal-comment-reply").modal('show');
		}
	});
}

function createLeaveReplyContent(dataList){
	var dataArray = new Array();
	for(var i=0;i<dataList.length;i++){
		dataArray.push('<div class="message-reply-box">');
		dataArray.push('<div>');
		dataArray.push('<span class="name">'+dataList[i].publisher+'</span>');
		dataArray.push('<span class="time">'+dataList[i].publishdate+'</span>');
//		if(type==="send" && $(".nav-tabs[data-toggle='tabs']").find(".active").attr("id") != "leader-tab-page")
//			dataArray.push('<button class="btn btn-sm btn-default send-reply" onclick="sendReplyMessage('+dataList[i].senderid+',\''+dataList[i].name+'\');">回复</button>');
		dataArray.push('</div>');
		var content="";
		var datas = dataList[i];
		if(datas.contenttype == "1"){
			content  += '<span class="sj"></span>';
			content  += '<span class="text voicetext" onclick="playAudioHdxx(this);" voiceid="'+datas.id+'" style="min-width:20%;width:'+widthByDuration(parseInt(datas.duration))+'%;">' ;
			content += '<i class="voice_play_icon"></i>' ;
			content += '</span>' ;
			content += '</span>' ;
			content += '<input id="audiourl_'+datas.id+'" type="hidden" value="'+datas.content+'">' ;
			content +=  '<span class="tips">'+datas.duration+'"</span>' ;
			if(datas.isread==0){
				content += '<span class="state"></span>' ;
			}
		}else if(datas.fileList != null && datas.fileList.length > 0){
			var photo = "";
			for ( var j = 0; j < datas.fileList.length; j++) {
				photo += '<div class="content-img"><img alt="" src="'+datas.fileList[j]+'" /></div>';
			}
			content = '<div class="message-reply-content">'+datas.content+'</div>' +photo;
		}else{
			content = '<div class="message-reply-content">'+datas.content+'</div>';
		}
		dataArray.push(content);
		dataArray.push('<div style="clear:both;"></div>');
		dataArray.push('</div>');
	}
	$('#messageReplyBox').html(dataArray.join(''));
}

/**
 * 
 * @param type 1下一页 2上一页
 */
function changeReplyPage(type){
	if(type===1){
		commentReplyPage++;
	}else{
		commentReplyPage--;
	}
	getReplyList();
}

/**
 * 消息回复
 */
function replyMessage(){
	var replyContent = $('#replyContent').val();
	if(replyContent===null||replyContent===''){
		PromptBox.alert('消息回复不能为空！');
		return false;
	}
	var submitData = {
			api:ApiParamUtil.DAILY_MANAGE_MZCP_SAVE_COMMENT_INFO,
			param:JSON.stringify({
				dataid:$('#dataid').val(),
				parentid:$('#c_serialnumber').val(),
				content:replyContent,
				receiveid:$('#c_receiveid').val(),
				receiver:$('#c_receiver').val(),
				usertype:1,
				userid:main_userid,
				orgcode:main_orgcode,
				campusid:$("#mrcp_campus_chosen").val()
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			PromptBox.alert('回复成功！');
			getReplyList();
			$('#replyContent').val('');
		}
	});
}

function selectComment(serialnumber,obj){
	var param = {
		campusid : $("#mrcp_campus_chosen").val(),
		serialnumber : serialnumber
	};
	var submitData = {
			api 	: DAILY_MANAGE_MZCP_COMMENT_SELECT,
			param	: JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			if(result.ret.msg == "1"){
				$(obj).attr("checked",true);
			}else if(result.ret.msg == "0"){
				$(obj).attr("checked",false);
			}else{
				alert("设置精选评论失败！");
			}
		}
	});
}

function changeCheckBoxValue(){
	$("#ifSelected").val($("#ifSelected").is(':checked') ? "1" : "0,1");
	generate_table_mrcp_comment();
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
        $('#iconpath').attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
	    $('#iconpath').attr( 'src', response.picUrl );
		$("#mrcp_iconpath").val(response.picUrl);
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