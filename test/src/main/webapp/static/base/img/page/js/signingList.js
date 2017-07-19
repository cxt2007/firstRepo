/*
 *  Document   : newsList.js
 *  Author     : yxw
 *  Description: 公司签约页面
 */

var ctx=$("#ctx").val();

$(document).ready(function() {
	generate_table();
	$("#search-btn").click(function() {
		generate_table();
	});
	$("#addPageBtn").click(function() {
		$('#addOrEdit').html("签约");
		$('#info-id').val("");
		$('#title-add').val("");
		$('#modal-addconfig').modal('show');
	});
	$("#setInit").click(function() {
		getInitNum();
		$('#setOrEdit').html("设置");
		$('#modal-setInitconfig').modal('show');
	});
	$("#saveSubmit").click(function() {
		btnClick();
	});
	$("#setSubmit").click(function() {
		setClick();
	});
	
	$("#deleteInit").click(function() {
		deleteInit();
	});
	
});
function delConfirm(num){
	if(confirm("确认删除?")){
		var url=ctx+"/gsgl/signing/ajax_del_signing";
		var submitData = {
				id	: num
		}; 
		$.post(url,
			submitData,
	      	function(data){
				alert("删除成功!");
				generate_table();
	    		return false;
	      });
	}
}

function deleteInit(){
	if(confirm("确认删除?")){
		var url=ctx+"/gsgl/signing/ajax_del_initNumAndSigning";
		var submitData = {}; 
		$.post(url,
			submitData,
	      	function(data){
				alert("删除成功!");
				generate_table();
	    		return false;
	      });
	}
}

function toEdit(num){
	$('#addOrEdit').html("修改");
	var url=ctx+"/gsgl/signing/ajax_edit_signing";
	var submitData = {
			id	: num
	}; 
	$.post(url,
		submitData,
     	function(datas){
		$('#info-id').val(datas.id);
		$('#title-add').val(datas.name);
		$('#modal-addconfig').modal('show');
   		return false;
    });
}

function generate_table(){
	 App.datatables();
	 var rownum=1;
     /* Initialize Datatables */
     
     var sAjaxSource=ctx+"/gsgl/signing/ajax_query_signing?&name="+$("#title").val();
     var columns = [
    				{"sTitle": "序号","mDataProp": "rowno","sClass": "text-center"},
    	            {"sTitle": "学校名称","mDataProp": "name","sClass": "text-center"},
    	            {"sTitle": "操作","mDataProp": "operation","sClass": "text-center"}
    	       ];
     $('#news-datatable').dataTable({
         "iDisplayLength": 50,
         "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
         "bFilter": false,
         "bLengthChange": false,
         "bDestroy":true,
         "sAjaxSource": sAjaxSource,
         "aoColumns": columns,
         "bAutoWidth":false,
         "bServerSide":false,//服务器端必须设置为true
         "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
         	// 序号
         	//rownum=aaData
         	$('td:eq(0)', nRow).html(rownum);
         	rownum=rownum+1;
			return nRow;
         }, 
     });
     
 }

function btnClick() {
	var info = $("#info-id").val();
	var name = $("#title-add").val().replace(/\t/g,"");
	if(name == "" || name == null){
		alert("请填写学校名称！");
		return;
	}
	var url=ctx+"/gsgl/signing/ajax_save";
	var submitData = {
		id			: info,
		name		: name
	}; 
	$('#saveSubmit').attr('disabled','disabled');
	$.post(url,
		submitData,
      	function(data){
			$('#saveSubmit').removeAttr('disabled');
			$('#modal-addconfig').modal('hide');
			generate_table();
    		return false;
      });
		
	
}

function setClick() {
	var initNum = $("#initNum").val().replace(/\t/g,"");
	if(isNaN(initNum)){
		alert("初始值必须为数字！");
		return;
	}
	if(confirm("是否确定继续操作?")){
		var url=ctx+"/gsgl/signing/ajax_set_init";
		var submitData = {
			num : initNum,
			hcmc: $("#hcmc").val()
		}; 
		$('#setSubmit').attr('disabled','disabled');
		$.post(url,
			submitData,
	      	function(data){
				$('#setSubmit').removeAttr('disabled');
				alert("设置成功");
				$('#modal-setInitconfig').modal('hide');
	    		return false;
	      });
		return false;
	}else 
		return false;
	
}

function getInitNum(){
	var url=ctx+"/gsgl/signing/ajax_get_init";
	$.post(url,
	     	function(datas){
			var data =eval('('+datas+')');
			
			$('#initNum').val(data[1]);
			$('#hcmc').val(data[2]);

	   		return false;
	    });
}