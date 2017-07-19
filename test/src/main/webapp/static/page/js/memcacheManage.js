var ctx = $("#ctx").val();
$(document).ready(		
		function() {
			generate_table();
			setOriginalDate();
			$("#search-btn").click(function() {
				generate_table();
			});
			
			$("#callActivelogService").click(function (){
				callActivelogService();
			});
			
			$("#refreshCacheBtn").click(function() {
				refreshCacheBtn();
			});

			
			$("#refreshCampusCacheBtn").click(function(){
				refreshCampusCacheBtn();
			});
			

			$("#pushMrcpBtn").click(function() {
				pushMrcpBtn();
			});
			

			$("#setMobileMenuAllBtn").click(function(){
				setMobileMenuAll();
			});
			
			$("#pushMailTestBtn").click(function() {
				pushMailTestBtn();
			});
			

			$("#getAllWechatTemplate").click(function(){
				getAllWechatTemplate();
			});
			
			
		});
function generate_table() {
	App.datatables();
	var rownum = 1;
	/* Initialize Datatables */
	var sAjaxSource=ctx+"/xtgl/cachemanege/ajax_memcache_list";
	var param = "search_key="+$("#key").val();
	 	param=param+"&search_campusid="+$("#campus-chosen").val();
	 	sAjaxSource=sAjaxSource+"?"+param; 	

	var	columns = [ {
			"sTitle" : "序号",
			"sWidth" : "60px",
			"mDataProp" : "rowno",
			"sClass" : "text-center"
		}, {
			"sTitle" : "缓存名称",
			"mDataProp" : "bjmc",
			"sWidth" : "300px",
			"sClass" : "text-center"
		}, {
			"sTitle" : "业务数据",
			"mDataProp" : "title",
			"sClass" : "text-center"
		}, {
			"sTitle" : "管理",
			"mDataProp" : "operation",
			"sWidth" : "150px",
			"sClass" : "text-center"
		} ];
	$('#memcache-datatable').dataTable({
		"aoColumnDefs": [ { "bSortable": false, "aTargets": [ '_all'] ,sDefaultContent : ''}],
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"sAjaxSource" : sAjaxSource,
		"aoColumns" : columns,
		"bAutoWidth" : false,
		"bServerSide" : true,// 服务器端必须设置为true
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			// 序号
			$('td:eq(0)', nRow).html(rownum);
			$('td:eq(1)', nRow).html(aaData.dictcode);
			var entry = state='<input type="text" id="operationvalue_'+aaData.id+'" "name="operationvalue" ;" class="form-control input-sm" placeholder="'+aaData.dictname+'">';
			$('td:eq(2)', nRow).html(entry);

			if(aaData.isSinge==1){
				$('td:eq(3)', nRow).html("<a style='margin:0 5px;'  href='javascript:invalid("+aaData.id+");'>重置</a>" +
						"<a style='margin:0 5px;' href='javascript:searchMemCache("+aaData.id+");'>查看</a>");
			} else {
				$('td:eq(3)', nRow).html("<a style='margin:0 5px;' href='javascript:invalid("+aaData.id+");'>重置</a>" +
						"<a style='margin:0 5px;'  href='javascript:batchInvalid("+aaData.id+");'>批量重置</a>" +
						"<a style='margin:0 5px;' href='javascript:searchMemCache("+aaData.id+");'>查看</a>");
			}
			rownum = rownum + 1;
			return nRow;
		},
	});
}
function invalid(id) {
		var operationData = $("#operationvalue_"+id).val();
		var url = ctx + "/xtgl/cachemanege/ajax_invalid_memcache";
		var submitData = {
			id : id ,
			operationData : operationData
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				alert("重置成功!");
			} else {
				alert(data);
			}
		});
}

function batchInvalid(id) {
	var campusid = $("#campus-chosen").val();
	var url = ctx + "/xtgl/cachemanege/ajax_batch_invalid_memcache";
	var submitData = {
			id : id ,
			campusid : campusid
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				alert("重置成功!");
			} else {
				alert(data);
			}
		});
}

function searchMemCache(id){
	var url = ctx + "/xtgl/cachemanege/ajax_search_memcache";
	var operationData = $("#operationvalue_"+id).val();
	var submitData = {
		id : id ,
		operationData : operationData
	};
	$.post(url, submitData, function(json) {
		var json = typeof json == "object" ? json : JSON.parse(json);
		if(json.ret.code == "200"){
			var datas = json.data;
			alert(datas);
		}
	});
}

function getBeginTime(starttime) {
	return starttime + " 00:00:00";
}

function getEndTime(endtime) {
	return endtime + " 23:59:59";
}

//设置初始日期
function setOriginalDate(){
	var currentDate = new Date();
	currentDate.setTime(currentDate.getTime()-24*60*60*1000);
	var day = currentDate.getDate();
	
	$("#startDate").datepicker('setDate','-'+day+'d');
	$("#endDate").datepicker('setDate','-1d');
	$("#starttime").datepicker('setDate','-'+day+'d');
	$("#endtime").datepicker('setDate','-1d');
}

function callActivelogService(){
	if($("#starttime").val()==undefined || $("#endtime").val()==undefined){
		alert("请设置初始时间");
		return;
	}
	var param = {
		starttime : getBeginTime($("#starttime").val()),
		endtime : getEndTime($("#endtime").val())
	};
	var submitData = {
		api : ApiParamUtil.ANALYSIS_CALL_ACTIVELOGSERVICE,
		param : JSON.stringify(param)
	};
	
	$.post($("#commonUrl_ajax").val(), submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			alert("获取成功!");
		}else{
			alert("获取失败,失败原因:"+result.ret.msg);
			console.log(result.ret.code+":"+result.ret.msg);
		}
	});
}

/**
 * 重置系统缓存
 */
function refreshCacheBtn() {
	var url = ctx + "/xtgl/verifyUser/refershCache";
	$.post(url, {}, function(data) {
		alert(data);
	});
}

/**
 * 重置校区缓存
 */
function refreshCampusCacheBtn() {
	var url = ctx + "/xtgl/verifyUser/refershCampusCache";
	$.post(url, {}, function(data) {
		alert(data);
	});
}

/**
 * 模拟发送食谱
 */
function pushMrcpBtn() {
	var url = ctx + "/xtgl/verifyUser/push_mrcp?campusid=2289";
	$.get(url, {}, function(data) {
		alert(data);
	});
}

/**
 * 发送阻塞文件
 */
function pushMsgTryBtn() {
	var url = ctx + "/xtgl/verifyUser/push_msg_try";
	$.get(url, {}, function(data) {
		alert(data);
	});
}

function setMobileMenuAll(){
	var url = ctx + "/xtgl/config/set_mobile_menuAll?search_EQ_orgcode="
			+ $("#search_EQ_orgcode").val();
	$.get(url, {}, function(data) {
		alert(data);
	});
}


/**
 * 模拟发送邮件
 */
function pushMailTestBtn() {
	var url = ctx + "/xtgl/verifyUser/push_mail_test";
	$.get(url, {}, function(data) {
		alert(data);
	});
}


function getAllWechatTemplate(){
	var url = ctx + "/xtgl/config/getAllWechatTemplate?search_EQ_orgcode="
	+ $("#search_EQ_orgcode").val();
	$.post(url, {}, function(data) {
		alert(data);
	});
}
