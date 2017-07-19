var ctx = "";
var logList = function() {
	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document).ready(function() {
	generate_operateLog_table();
	generate_pushLog_table();
	
	$("#search_EQ_campusid").change(function() {
		findUserByCampusid($("#search_EQ_campusid").val(),"search_EQ_teacherid");//过滤条件存在班级时生效
	});
	
	$("#operateLogQueryBtn").click(function(){
		generate_operateLog_table();
	});
	
	$("#pushLogQueryBtn").click(function(){
		generate_pushLog_table();
	});
	
});

function findUserByCampusid(campusid,controlName){
	var url=ctx+"/xtgl/log/findUserByCampusid";
	var submitData = {
		campusid	:	campusid
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#"+controlName+" option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	
	        	$("#"+controlName).append("<option value=" + datas[i][0] + " >"
	        			+ datas[i][1] + "</option>");
	        };
	        $("#"+controlName).find("option[index='0']").attr("selected",'selected');
	        $("#"+controlName).trigger("chosen:updated");
    });
}

function generate_operateLog_table(){
	App.datatables();
	var rownum = 1;
	var sAjaxSource = getOperateLogUrl();
	var aoColumns = [{
		"sTitle" : "序号",
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sTitle" : "IP地址",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "ip"
	},{
		"sTitle" : "操作模块",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "appname"
	}, {
		"sTitle" : "模块路径",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "apppath"
	}, {
		"sTitle" : "操作人",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "username"
	}, {
		"sTitle" : "操作时间",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "operatetime"
	}];
	
	var exoTable = $('#operateLog-datatable').dataTable({
		
		"aaSorting" : [ [ 3, 'desc' ] ],
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ],
				[ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort" : false,
		"sAjaxSource" : sAjaxSource,
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(rownum);
			rownum = rownum + 1;
			return nRow;
		},
		"aoColumns" :aoColumns
	});
}

function getOperateLogUrl(){
	return ctx+"/xtgl/log/ajax_queryOperateLog?search_GTE_dqrq="+ getBeginTime($("#search_GTE_dqrq").val())+"&search_LTE_dqrq="+getEndTime($("#search_LTE_dqrq").val())
	+"&search_EQ_campusid="+$("#search_EQ_campusid").val()+"&search_EQ_userid="+$("#search_EQ_teacherid").val();
}

function generate_pushLog_table(){
	App.datatables();
	var rownum = 1;
	var sAjaxSource = getPushLogUrl();
	var aoColumns = [{
		"sTitle" : "序号",
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sTitle" : "消息类型",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "msgtype"
	},{
		"sTitle" : "标题",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "title"
	}, {
		"sTitle" : "消息内容",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "msg"
	}, {
		"sTitle" : "处理人",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "sender"
	}, {
		"sTitle" : "发送时间",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "sendertime"
	}];
	
	var exoTable = $('#pushLog-datatable').dataTable({
		
		"aaSorting" : [ [ 3, 'desc' ] ],
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ],
				[ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort" : false,
		"sAjaxSource" : sAjaxSource,
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(rownum);
			rownum = rownum + 1;
			return nRow;
		},
		"aoColumns" :aoColumns
	});
}

function getPushLogUrl(){
	return ctx+"/xtgl/log/ajax_queryPushLog?search_GTE_dqrq="+ getBeginTime($("#messageLog_begindate").val())+"&search_LTE_dqrq="+getEndTime($("#messageLog_enddate").val())
	+"&search_EQ_campusid="+$("#messageLog_campusid").val()+"&search_EQ_type="+$("#messageLog_type").val()+"&search_LIKE_title="+$("#messageLog_title").val();
}

function getBeginTime(starttime)
{ 
	return starttime + " 00:00:00";
}


function getEndTime(endtime)
{
	return endtime + " 23:59:59";
}




