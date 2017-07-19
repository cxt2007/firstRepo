var MAIN_MANAGE_SCHOOL_WECHAT_NAVIGATION_CONFIG = $("#MAIN_MANAGE_SCHOOL_WECHAT_NAVIGATION_CONFIG").val();
var MAIN_MANAGE_SCHOOL_WECHAT_ARTICLE_CONFIG = $("#MAIN_MANAGE_SCHOOL_WECHAT_ARTICLE_CONFIG").val();
var MAIN_MANAGE_SCHOOL_SAVE_WECHAT_MODULE_CONFIG = $("#MAIN_MANAGE_SCHOOL_SAVE_WECHAT_MODULE_CONFIG").val();
var COMMON_QUERY_DICT = $("#COMMON_QUERY_DICT").val();
var DICT_TYPE_ARTICLE_DATALIMIT = $("#DICT_TYPE_ARTICLE_DATALIMIT").val();

var commonUrl_ajax = $("#commonUrl_ajax").val();

var ctx=$("#ctx").val();

$(document).ready(function() {
	generate_kgpz_table();
	$("#kgpz-search-select-campus").change(function() {	// 点击查询按钮
		generate_kgpz_table();
	});
	
	$("#kgpz-search-btn").click(function() {
		generate_kgpz_table();
	});
	
});


function generate_kgpz_table(){
	GHBB.prompt("正在加载~");
	var rownum=1;
	/* Initialize Datatables */
	var sAjaxSource=ctx+"/xtgl/kgpz/ajax_findInfoByCampusid";
	var param ="campusid="+ $("#kgpz-search-select-campus").val();
    sAjaxSource=sAjaxSource+"?"+param;
	var aoColumns= [
						{ "sWidth": "30px", "sClass": "text-center","mDataProp": "id"},
						{ "sWidth": "70px", "sClass": "text-center","mDataProp": "configname"},
						{ "sWidth": "120px", "sClass": "text-left","mDataProp": "remark"},
    					{ "sWidth": "60px", "sClass": "text-center","mDataProp": "configvalue"},
    					{ "sWidth": "70px", "sClass": "text-center","mDataProp": "publishdate"},
    					{ "sWidth": "70px", "sClass": "text-center","mDataProp": "publisher"}
    	           ];
	
	
    $('#kgpz-datatable').dataTable({
    	"aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] }],
        "iDisplayLength": 50,
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bAutoWidth":false,
        "sAjaxSource": sAjaxSource,
//        "bServerSide":true,//服务器端必须设置为true
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
        	// 序号
        	//rownum=aaData
        //$('td:eq(0)', nRow).html(iDisplayIndex);
        	$('td:eq(0)',nRow).html(rownum);
        	var state;
        	if(aaData.configvalue=='1' && (aaData.configcode != "1030002" && aaData.configcode != "1030003" && aaData.configcode != "1030004" && aaData.configcode != "1030005")){
        		state="<label class='switch switch-primary'><input type='checkbox' checked onclick='updateConfig("+aaData.id+",this);'><span></span></label>";
        	}else if(aaData.configvalue=='0' && (aaData.configcode != "1030002" && aaData.configcode != "1030003" && aaData.configcode != "1030004" && aaData.configcode != "1030005")){
        		state="<label class='switch switch-primary'><input type='checkbox' onclick='updateConfig("+aaData.id+",this);'><span></span></label>";
        	}else if(aaData.configcode == "1030002" || aaData.configcode == "1030003" || aaData.configcode == "1030004" || aaData.configcode == "1030005"){
        		state = kgpzInputBox(aaData);
        	}else{
        		state='<input type="text" id="kgpzconfigvalue" value="'+aaData.configvalue+'" name="kgpzconfigvalue" onchange="updateConfigValue('+aaData.id+',this);" class="form-control input-sm" placeholder="光标移出自动保存">';
        	}
        	$('td:eq(3)',nRow).html(state);
        	
			rownum=rownum+1;
			return nRow;
		}, 
        "aoColumns":aoColumns,
        "fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
    });    
}

function kgpzInputBox(aaData){
	var input="";
	if(aaData.configcode == "1030002"){
		input = '<input type="number" id="kgpzconfigvalue" min="0" max="1" value="'+aaData.configvalue+'" name="kgpzconfigvalue" onchange="updateConfigValue('+aaData.id+',this);" class="form-control input-sm" placeholder="光标移出自动保存">';
	}else if(aaData.configcode == "1030003"){
		input = '<input type="number" id="kgpzconfigvalue" min="1" max="2" value="'+aaData.configvalue+'" name="kgpzconfigvalue" onchange="updateConfigValue('+aaData.id+',this);" class="form-control input-sm" placeholder="光标移出自动保存">';
	}else if(aaData.configcode == "1030004"){
		input = '<input type="number" id="kgpzconfigvalue" min="10" max="200" value="'+aaData.configvalue+'" name="kgpzconfigvalue" onchange="updateConfigValue('+aaData.id+',this);" class="form-control input-sm" placeholder="光标移出自动保存">';
	}else if(aaData.configcode == "1030005"){
		input = '<input type="number" id="kgpzconfigvalue" min="200" max="500" value="'+aaData.configvalue+'" name="kgpzconfigvalue" onchange="updateConfigValue('+aaData.id+',this);" class="form-control input-sm" placeholder="光标移出自动保存">';
	}
	return input;
}

function initConfig(){
	var url=ctx+"/xtgl/kgpz/ajax_initConfigInfoByCampusid";
	$.post(url,{"campusid":$("#kgpz-search-select-campus").val()},function(data){
		var result=data.split(":");
		if(result[0]=="error")
			alert(data);
		else{
			alert("校区配置信息初始化成功");
			generate_kgpz_table();
		}
	});
}

function updateConfigValue(id,obj){
	var url=ctx+"/xtgl/kgpz/ajax_updateConfigvalueById";
	$.post(url,
			{"configvalue":obj.value,"id":id,"campusid":$("#kgpz-search-select-campus").val()},
	      	function(data){				
				var datas=eval("("+data+")");
//				$(obj).parent().parent().next().html(datas.publishdate);
//				$(obj).parent().parent().next().next().html(datas.publisher);
	    });
}


function updateConfig(id,obj){
	var url=ctx+"/xtgl/kgpz/ajax_updateConfigvalueById";
	var configvalue;
	if(obj.checked){		
		configvalue=1;
	}else{
		configvalue=0;
	}	
	$.post(url,
			{"configvalue":configvalue,"id":id,"campusid":$("#kgpz-search-select-campus").val()},
	      	function(data){				
				var datas=eval("("+data+")");
				$(obj).parent().parent().next().html(datas.publishdate);
				$(obj).parent().parent().next().next().html(datas.publisher);
	    });
}
