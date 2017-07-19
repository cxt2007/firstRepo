var ctx="";
var appid = $("#appid").val();
var TablesDatatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();

$(document).ready(function() {
	getDictList(ApiParamUtil.COMMON_QUERY_DICT,"#xxtype",DICTTYPE.DICT_TYPE_SCHOOL_TYPE,true);
	getDictList(ApiParamUtil.COMMON_QUERY_DICT,"#verifystate",'WECHAT_VERIFYSTATE',true);
	
	generate_org_table();
	$("#querytOrgbtn").click(function() { // 点击查询按钮
		generate_org_table();
	});
	
	$("#agentuserids,#xxtype,#verifystate").change(function() {
		generate_org_table();
	});
});

/**
 * 获取字典下拉框选项
 */
function getDictList(api,node,type,isAll){
	var msg = "没有选项！";
	var url = commonUrl_ajax;
	var submitData = {
			api: api,
			param: JSON.stringify({
				type:type
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
				if(isAll){
					createDictAllList(result.data.dictList,msg,node);
				}else{
					createDictList(result.data.dictList,msg,node);
				}
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

/**
 * 创建字典下拉框
 * @param dataData
 * @param msg
 * @param node
 */
function createDictList(dataData,msg,node){
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].key+'">'+dataData[i].value+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.alert(msg);
	}else{
		$(node).val(dataData[0].key);
	}
	$(node).trigger("chosen:updated");
}

function createDictAllList(dataData,msg,node){
	var allValue = new Array();
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].key+'">'+dataData[i].value+'</option>');
		allValue.push(dataData[i].key);
	}
	var selectalltitle="全部";
	if(node=="#verifystate"){
		selectalltitle="全部认证状态";
	}else{
		selectalltitle="全部版本";
	}
	
	$(node).html('<option value="'+allValue.toString()+'">'+selectalltitle+'</option>' + dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.alert(msg);
	}else{
		$(node).val(allValue.toString());
	}
	$(node).trigger("chosen:updated");
}

function generate_org_table(){
	GHBB.prompt("正在加载~")
	App.datatables();
	var sAjaxSource=ctx+"/xtgl/orgsj/ajax_findOrgInfo?keyword="+$("#keyword").val()+"&dlsid="+$("#agentuserids").val()+"&xxtype="+$("#xxtype").val()+"&verifystate="+$("#verifystate").val();
	var aoColumns= [
    					{"sTitle" : "学校名称", "sWidth": "150px", "sClass": "text-center","mDataProp": "orgname"},
    					{ "sTitle" : "公众帐号","sWidth": "150px", "sClass": "text-center","mDataProp": "wxloginname"},
    					{ "sTitle" : "代理商名称","sWidth": "150px", "sClass": "text-center","mDataProp": "dlsname"},
    					{ "sTitle" : "接入时间","sWidth": "150px", "sClass": "text-center","mDataProp": "publishdate"},
    					{ "sTitle" : "认证状态","sWidth": "150px", "sClass": "text-center","mDataProp": "verifystate"},
    					{ "sTitle" : "认证过期","sWidth": "150px", "sClass": "text-center","mDataProp": "expiredtime"},
    					{ "sTitle" : "操作","sWidth": "150px", "sClass": "text-center","mDataProp": "id"}
    	           ];
	
	
    $('#org-datatable').dataTable({
        "iDisplayLength": 50,
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bSort" : false,
        "bDestroy":true,
        "bAutoWidth":false,
        "sAjaxSource": sAjaxSource,
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
        	//认证状态
			if(aaData.verifystateFail=="true"){
	        	var verifyStateHtml = '<div><a data-toggle="tooltip" title="'+aaData.failreason+'" style="color:#428bca;text-decoration:underline;cursor: pointer;">'+aaData.verifystateStr+'<i class="hi hi-question-sign fa-1x text-info"></i></a></div>';
			}else{
	        	var verifyStateHtml = aaData.verifystateStr;
			}
			$('td:eq(4)', nRow).html(verifyStateHtml);
 			// 学校名称
 			var editHtml='<div style="width:100%;">'
 						+'	<a style="float:left;width:49%;text-align:center;" href="'+ctx+'/xtgl/config/input?appid='+appid+'&orgcode='+aaData.orgcode+'">配置</a>'
 						+'	<span style="float:left;width:2%">|</span>'
 						+'	<a style="float:left;width:49%;text-align:center;" href="'+ctx+'/xtgl/orgsj/updateform/'+aaData.id+'?appid='+appid+'">修改</a>'
 						+'</div>';
 			$('td:eq(6)', nRow).html(editHtml);
			return nRow;
		}, 
        "aoColumns":aoColumns,
        "fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
    });
}


