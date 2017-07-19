var ctx="";
var deptDatatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();

$(document).ready(function() {
	generate_table_dept();
	
	$("#saveSubmit").click(function() {
		var orderid = $("#orderid").val();
		if(orderid == ""){
			orderid = 1000;
		}
		var deptname = $("#deptname").val();
		if(deptname == null || deptname == ""){
			alert("部门名称不能为空");
			return;
		}
		
		if(confirm("确定保存?")){
			var url=ctx+"/xtgl/dept/save_dept";
			var submitData = {
				id			: $("#dept_id").val(),
				campusid	: $("#campusid").val(),
				deptname	: $("#deptname").val(),
				orderid		: orderid,
				remark		: $("#remark").val()
			}; 
			$.post(url,
				submitData,
		      	function(data){
					if(data == "success"){
						setDeptResetting();
						generate_table_dept();
					}else{
						alert(data);
					}
		    		return false;
		      });
			return false;
		}else 
			return false;
		
		
	});
	$("#resetDept").click(function() {
		setDeptResetting();
	});
});


function setDeptResetting(){
	$("#dept_id").val('');
	$('#campusid option').eq(0).attr("selected",true);
	$('#campusid').trigger("chosen:updated");
	$("#deptname").val('');
	$("#orderid").val('');
	$("#remark").val('');
	
}

function generate_table_dept(){
	var rownum=1;
	App.datatables();
	
	var sAjaxSource=ctx+"/xtgl/dept/ajax_query_dept";
    var aoColumns= [
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "id"},
                    	{ "sWidth": "150px", "mDataProp": "campusid_ch"},
                    	{ "sWidth": "150px", "sClass": "text-center","mDataProp": "deptname"},
                    	{ "sWidth": "150px", "sClass": "text-center","mDataProp": "deptname"}
                   ];
    
    
    $('#dept-datatable').dataTable({
    	"aaSorting":[ [3,'desc']],
        "iDisplayLength": 10,
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bAutoWidth":false,
        "bSort":false,
        "sAjaxSource": sAjaxSource,
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
        	// 序号
        	$('td:eq(0)', nRow).html(rownum);
        	var editHtml='<div style="text-align:center"><a href="javascript:openDeptEdit(\''+aaData.id+'\');">'+aaData.deptname+'</a></div>';
 			$('td:eq(2)', nRow).html(editHtml);
 			// 删除
 			var delHtml='<div class="btn-group btn-group-xs"><a href="javascript:delDeptConfirm('+aaData.id+');">删除</a></div>';
 			$('td:eq(3)', nRow).html(delHtml);
 			
			rownum=rownum+1;
			return nRow;
		}, 
        "aoColumns":aoColumns
    });
}

function openDeptEdit(dept_id){
	var url=ctx+"/xtgl/dept/ajax_query_dept_id";
	var submitData = {
		id	: dept_id
	};
	$.post(url,
		submitData,
      	function(data){
			var datas=eval("("+data+")");
			
			$("#dept_id").val(datas.id);
			
			$('#campusid').find("option[value='"+datas.campusid+"']").attr("selected",true);
			$('#campusid').trigger("chosen:updated");
			
			$("#deptname").val(datas.deptname);
			$("#orderid").val(datas.orderid);
			$("#remark").val(datas.remark);
      });
}

function delDeptConfirm(id){
	if(confirm("确认删除?")){
		var url=ctx+"/xtgl/dept/ajax_delDept";
		var submitData = {
				id	: id
		}; 
		$.post(url,
			submitData,
	      	function(data){
				alert("删除成功!");
				generate_table_dept();
				setDeptResetting();
	    		return false;
	      });
	}
}