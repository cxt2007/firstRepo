var ctx="";
var datatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();

$(document).ready(function() {
	generate_table_lottery();
	
	$("#queryLotteryBtn").click(function(){
		generate_table_lottery();
	});
	
	$("#orgcode_chosen").change(function(){
		generate_table_lottery();
	});
	
	$("#theme_chosen").change(function(){
		getTemplateByTheme();
	});
	
	$("#item_chosen").change(function(){
		generate_table_lottery();
	});
	
	$("#ifzj_chosen").change(function(){
		generate_table_lottery();
	});
	
	$("#iffj_chosen").change(function(){
		generate_table_lottery();
	});
	
	$("#lotteryids").click(function(){
		$("input[name='lotteryids']").prop("checked", $("#lotteryids").prop("checked"));
	});
	
});

function generate_table_lottery(){
	var rownum=1;
	App.datatables();
	
	var sAjaxSource=ctx+"/xtgl/lotteryrecord/ajax_query_lotteryrecord";
	var param = "search_orgcode=" + $("#orgcode_chosen").val();
	param = param + "&search_theme=" + $("#theme_chosen").val();
	param = param + "&search_template=" + $("#item_chosen").val();
	param = param + "&search_sfzj=" + $("#ifzj_chosen").val();
	param = param + "&search_fjzt=" + $("#iffj_chosen").val();
	param = param + "&search_starttime=" + getBeginTime($("#search_GTE_dqrq").val());
	param = param + "&search_endtime=" + getEndTime($("#search_LTE_dqrq").val());
	sAjaxSource = sAjaxSource + "?" + param;
	
    var aoColumns= [
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "0"},
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "0"},
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "2"},
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "4"},
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "6"},
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "7"},
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "8"},
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "10"},
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "11"},
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "12"},
                    	{ "sWidth": "70px", "sClass": "text-center","mDataProp": "13"}
                   ];
    
    
    $('#lottery-datatable').dataTable({
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
        	$('td:eq(1)', nRow).html(rownum);
        	// 发奖状态
 			if(aaData[7] == 1){
 				$('td:eq(5)', nRow).html("已发奖");
 			}else{
 				$('td:eq(5)', nRow).html("未发奖");
 			}
 			
 			//绑定对象
 			if(aaData[10] == 1){
 				$('td:eq(7)', nRow).html("老师");
 			}else{
 				$('td:eq(7)', nRow).html("学生");
 			}
 			
 			// 是否中奖
 			var readonly = "";
 			var name="";
 			if(aaData[13] == 1){
 				$('td:eq(10)', nRow).html("已中奖");
 				name="lotteryids";
 			}else{
 				$('td:eq(10)', nRow).html("未中奖");
 				readonly='disabled="true"';
 				name = "unlotteryids"
 			}
        	var checkBox = '<input name="'+name+'" type="checkbox" value="'+aaData[0]+'" '+readonly+'/>';
        	$('td:eq(0)', nRow).html(checkBox);
 			
			rownum=rownum+1;
			return nRow;
		}, 
        "aoColumns":aoColumns
    });
}

function getTemplateByTheme(){
	var url=ctx+"/xtgl/lotteryrecord/findTemplateByThemeid";
	var submitData = {
		parentid :$("#theme_chosen").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#item_chosen option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        		$("#item_chosen").append("<option value=" + datas[i].id+" >"
		        			+ datas[i].name + "</option>"); 	
	        };
	        $("#item_chosen").find("option[index='0']").attr("selected",'selected');
	        $("#item_chosen").trigger("chosen:updated");
	        generate_table_lottery();
    });
}

function awardPrize(){
	var chk_value =[];
    $('input[name="lotteryids"]:checked').each(function(){
    	chk_value.push($(this).val());
    });
    if(chk_value == "" || chk_value.length == 0){
    	alert("未选中记录！");
    	return;
    }
	if(confirm("确定对选中记录进行发奖?")){
		var url=ctx+"/xtgl/lotteryrecord/awardPrizeBatch";
		var submitData = {
			lotteryids	: chk_value+""
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					alert("设置成功!");
					$("#lotteryids").prop("checked", false);
					generate_table_lottery();
					return false;
				}else{
					alert(data);
				}
				
	    		
	     });
	}		
}

function getBeginTime(starttime) {
	return starttime + " 00:00:00";
}

function getEndTime(endtime) {
	return endtime + " 23:59:59";
}
