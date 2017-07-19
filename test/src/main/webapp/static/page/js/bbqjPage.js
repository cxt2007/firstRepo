/*
 *  Document   : bbqjPage.js
 *  Author     : yxw
 *  Description: 学生请假管理页面
 */

var ctx=$("#ctx").val();
var yqdtType=$("#yqdtType").val();	

$(document).ready(function() {
	generate_table();
	
	$("#school-chosen").change(function() {
		var url=ctx+"/yqdt/yqdt/ajax_change_bj";
		var submitData = {
			campusid	: $("#school-chosen").val()
		};
		$.post(url,
			submitData,
	      	function(data){
				var datas = eval(data);
				$("#bj-chosen option").remove();//user为要绑定的select，先清除数据
		        for(var i=0;i<datas.length;i++){
		        	$("#bj-chosen").append("<option value=" + datas[i][0] + ">" + datas[i][1] + "</option>");
		        };
		        $("#bj-chosen option").eq(0).attr("selected",true);
				$("#bj-chosen").trigger("chosen:updated");
				generate_table();
	    		return false;
	      });
	});
	$("#school-chosen-add").change(function() {
		var url=ctx+"/yqdt/yqdt/ajax_change_add_bj";
		var submitData = {
			campusid	: $("#school-chosen-add").val()
		};
		$.post(url,
			submitData,
	      	function(data){
				var datas = eval(data);
				$("#bj-chosen-add option").remove();//user为要绑定的select，先清除数据
		        for(var i=0;i<datas.length;i++){
		        	$("#bj-chosen-add").append("<option value=" + datas[i].id + ">" + datas[i].bj + "</option>");
		        };
		        $("#bj-chosen-add option").eq(0).attr("selected",true);
				$("#bj-chosen-add").trigger("chosen:updated");
	    		return false;
	      });
	});
	$("#bj-chosen").change(function() {
		generate_table();
	});
	$("#qjlx").change(function() {
		generate_table();
	});
	$("#search-btn").click(function() {
		generate_table();
	});
	$("#exportFile").click(function() {
		expectFile();
	});
});

function generate_table(){
	 App.datatables();
     /* Initialize Datatables */
     var sAjaxSource=ctx+"/jyhd/bbqj/ajax_query_bbqj?"
     				+"content="+$("#content").val()
    		 		+"&startrq="+$("#startrq").val()
    		 		+"&endrq="+$("#endrq").val()
    		 		+"&campusid="+$("#school-chosen").val()
    		 		+"&bjid="+$("#bj-chosen").val()
    		 		+"&qjlx="+$("#qjlx").val();
     $('#example-datatable').dataTable({
         "iDisplayLength": 50,
         "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
         "bFilter": false,
         "bLengthChange": false,
         "bDestroy":true,
         "sAjaxSource": sAjaxSource,
         "aoColumns": [
    				{"sTitle": "序号","mDataProp": "rowno","sClass": "text-center"},
    	            {"sTitle": "班级","mDataProp": "bjid_ch","sClass": "text-center"},
    	            {"sTitle": "姓名-家长","mDataProp": "stuid_ch-userid_ch","sClass": "text-center"},
    	            {"sTitle": "事由","mDataProp": "content","sWidth": "400px","sClass":"text-center"},
    	            {"sTitle": "请假类型","mDataProp": "qjlx","sClass":"text-center"},
    	            {"sTitle": "开始日期","mDataProp": "startrq","sClass": "text-center"},
    	        	{"sTitle": "结束日期","mDataProp": "endrq","sClass": "text-center"},
    	        	{"sTitle": "请假日期","mDataProp": "qjrq","sClass": "text-center"}
    	       ],
         "bAutoWidth":false
     });
     
 }

function expectFile(){	
	var url=ctx + "/jyhd/bbqj/expectFile";
	
	var submitData = {
			content: $("#content").val(),
			startrq: $("#startrq").val(),
			endrq: $("#endrq").val(),
			campusid: $("#school-chosen").val(),
			bjid: $("#bj-chosen").val(),
			qjlx: $("#qjlx").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			location.href=ctx + data;
    });
}