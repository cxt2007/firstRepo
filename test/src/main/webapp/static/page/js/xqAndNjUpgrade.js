/*
 *  Document   : tzList.js
 *  Author     : hbz
 *  Description: 通知管理页面
 */
var ctx = "";
var xqAndNjUpgrade = function() {
	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document).ready(function() {

	$("#xqUpgradeQueryBtn").click(function() {
		generate_xqUpgrade_table();
	});
	
	$("#school-chosen").change(function() {
		generate_xqUpgrade_table();
	});
	
	$("#njUpgradeQueryBtn").click(function() {
		generate_njUpgrade_table();
	});
	
	$("#campus-chosen").change(function() {
		generate_njUpgrade_table();
	});

	$("#xqUpgradeBtn").click(function() {
		$("#xqUpgradeModel").modal("show");
	});
	
	$("#xqUpgradeSubmit").click(function() {
		validateXqFrom();
	});
	
	$("#njUpgradeSubmit").click(function() {
		upgradeNj();
	});
	
	
	
});

/**
 * 系统参数列表
 */
function generate_xqUpgrade_table() {
	GHBB.prompt("正在加载~");
	var rownum = 1;
	var sAjaxSource = ctx + "/xtgl/bjsj/ajax_query_xq?campusids="+$("#school-chosen").val();
	
	var aoColumns = [
	{
		"bVisible": false,
		"mDataProp" : "id"}
	,
	{
		"sTitle": "序号",
		"sClass" : "text-center",
		"sWidth" : "70px",
		"mDataProp" : "id"}
	,{
		"sTitle": "学期名称",
		"sClass" : "text-center",
		"mDataProp" : "xqmc"
	}, {
		"sTitle": "学期编码",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "xqbm"
	}, {
		"sTitle": "学年编码",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "xnbm"
	}, {
		"sTitle": "是否当前学期",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "xqgb"
	}, {
		"sTitle": "周数",
		
		"sClass" : "text-center",
		"mDataProp" : "weeknum"
	},{
		"sTitle": "学期开始时间",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "weeknum"
	}];
	
	var xqTable = $('#xqUpgrade-datatable').dataTable({
		"aaSorting" : [ [ 2, 'desc' ] ],
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" :sAjaxSource,
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			// Append the grade to the default row class name
			// //alert(aaData.bjid);
			$('td:eq(0)', nRow).html(rownum);
			rownum = rownum + 1;
			if(aaData.currentxq==true){
				$('td:eq(4)', nRow).html("是");
			}else{
				$('td:eq(4)', nRow).html("否");
			}
			$('td:eq(6)', nRow).html(toDDMMMYY(aaData.weekbegin));
			
			return nRow;
		},
		"aoColumns" :aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
	
	xqTable.makeEditable({
		sUpdateURL : ctx+"/xtgl/config/ajax_query_updateXq",
		"aoColumns" : [ {class:'read_only'},{class:'read_only'},
		{
			indicator : 'Saving...',
			loadtext : 'loading...',
			type : 'text',
			onblur : 'submit'
		},
		{indicator : 'Saving...',
			loadtext : 'loading...',
			type : 'text',
			onblur : 'submit'
		}, 
		{class:'read_only'},
		{
			indicator : 'Saving...',
			loadtext : 'loading...',
			type : 'text',
			onblur : 'submit'
		}
		],
		fnOnEdited: function(result, sOldValue, sNewValue, iRowIndex, iColumnIndex, iRealColumnIndex)
		{ 	
			generate_xqUpgrade_table();
			return true;
		},
		sAddURL : "XXXX.action",
		sAddHttpMethod : "GET",
		sDeleteHttpMethod : "GET"

	});
}

function generate_njUpgrade_table(){
    /* Initialize Datatables */
	GHBB.prompt("正在加载~");
    var sAjaxSource=ctx+"/xtgl/bjsj/ajax_query_bjsj?campusid="+$("#campus-chosen").val();
    var rownum = 1;
    var njUpgradeTable = $('#njUpgrade-datatable').dataTable({
        "iDisplayLength": 50,
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bAutoWidth":false,
        "sAjaxSource": sAjaxSource,
        "fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			// Append the grade to the default row class name
			// //alert(aaData.bjid);
			$('td:eq(0)', nRow).html(rownum);
			rownum = rownum + 1;
//			if(aaData.state==1 && aaData.ifbybj!=1){
//				$('td:eq(2)', nRow).html(aaData.bjmc_mc+"-请[双击]修改班级名称");
//			}else{
//				$('td:eq(2)', nRow).html(aaData.bjmc_mc);
//			}
			$('td:eq(6)', nRow).html(toDDMMMYY(aaData.weekbegin));
			$('td:eq(1)', nRow).html(aaData.njmc+"(排序:"+aaData.orderid+")");
			return nRow;
		},
        "aoColumns": [
   				{"sTitle": "序号","mDataProp": "rowno","sClass": "text-center"},
   	            {"sTitle": "年级","mDataProp": "njmc","sClass": "text-center"},
   	            {"sTitle": "班级名称","mDataProp": "bjmc_mc","sClass": "text-center"},
   	            {"sTitle": "建班时间","mDataProp": "jbsj","sClass": "text-center"}],
   	    "fnInitComplete": function(oSettings, json) {
   				GHBB.hide();
   		    }
    });
    
//    njUpgradeTable.makeEditable({
//		sUpdateURL : ctx+"/xtgl/bjsj/updateName",
//		"aoColumns" : [ 
//		{class:'read_only'},
//		{class:'read_only'},
//		{indicator : 'Saving...',
//			loadtext : 'loading...',
//			type : 'text',
//			onblur : 'submit'
//		}, 
//		{class:'read_only'},
//		{class:'read_only'}
//		],
//		sAddURL : "XXXX.action",
//		sAddHttpMethod : "GET",
//		sDeleteHttpMethod : "GET"
//
//	});
    
}

function validateXqFrom(){
	
	
	$('#xqUpgradeForm').validate({
        errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
        errorElement: 'div',
        errorPlacement: function(error, e) {
            e.parents('.form-group > div').append(error);
        },
        highlight: function(e) {
            $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
            $(e).closest('.help-block').remove();
        },
        success: function(e) {
            // You can use the following if you would like to highlight with green color the input after successful validation!
            e.closest('.form-group').removeClass('has-success has-error'); // e.closest('.form-group').removeClass('has-success has-error').addClass('has-success');
            e.closest('.help-block').remove();
        },
       
        rules: {
        	xqUpgradeForm_xqgb: {
                required: true
            },
            xqUpgradeForm_startNian: {
	            required: true
	        },
	        xqUpgradeForm_endNian: {
	            required: true
	        },
	        xqUpgradeForm_weeknum: {
	            required: true
	        },
	        xqUpgradeForm_weekbegin: {
	            required: true
	        }
        },
        messages: {
        	xqUpgradeForm_xqgb:'此字段不可为空',
        	xqUpgradeForm_startNian: '此字段不可为空',
        	xqUpgradeForm_endNian: '此字段必选',
        	xqUpgradeForm_weekbegin:'此字段必选',
        	xqUpgradeForm_weeknum:'此字段必选'
        },
        submitHandler:function(form){
        	upgradeXq();
        }  
    });
}

function upgradeXq(){
	if(confirm("是否确定继续操作?")){
		var url=ctx+"/xtgl/config/ajax_query_addXq";
		var submitData ={
				xqgb:$("#xqUpgradeForm_xqgb").val(),
				xnbm:$("#xqUpgradeForm_startNian").val()+$("#xqUpgradeForm_endNian").val(),
				weeknum:$("#xqUpgradeForm_weeknum").val(),
				weekbegin:$("#xqUpgradeForm_weekbegin").val(),
				campusid:$("#xqUpgradeForm_campusid").val()
		};
		
		  $.post(url,
			  submitData,
		      function(data){
		    	alert(data);
		    	generate_xqUpgrade_table();
		     });
	}
	
}


function upgradeNj(){
	$('#njUpgradeSubmit').attr('disabled','disabled');
	var param = {
			campusid : $("#campus-chosen").val()
		}
	var campus_ch=$("#campus-chosen").find('option:selected').text();
	if(confirm("是否确定将["+campus_ch+"]进行升年级操作,同时请确认年级是否已经按照从小到大排序(托班－>大班)?")){
		GHBB.prompt("数据保存中~");
		var url=ctx + ApiParamUtil.COMMON_URL_AJAX;
		var submitData = {
				api : ApiParamUtil.SYS_MANAGE_SAVE_UPGRADE_NJSJ,
				param : JSON.stringify(param)
			};		
		$.post(url,
		  submitData,
	      function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code === "200") {
				PromptBox.alert("升级年级成功，请前往班级管理，修改班级名称");
			}else{
				PromptBox.alert("提示:" + result.ret.msg);
			}
			$('#njUpgradeSubmit').removeAttr('disabled');
			generate_njUpgrade_table();
	     });
	}else{
		$('#njUpgradeSubmit').removeAttr('disabled');
	}	
}

//日期转Str
function toDDMMMYYYY(date) {
	var dt = new Date(); 
	
	var d = new Date(date);
	var dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate().toString();
	var month=d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth().toString();
	var yyyy = d.getFullYear().toString(); //2011
		//var YY = YYYY.substr(2);   // 11
	return yyyy+"-"+month+"-"+dd;
}

function toDDMMMYY(date) {
	var d = toDDMMMYYYY(date);
	return d;
}
