var ctx = $("#ctx").val();
var commonUrl_ajax = $("#commonUrl_ajax").val();
var MAIN_MANAGE_PRODUCT_FIND_ADVISELIST = $("#MAIN_MANAGE_PRODUCT_FIND_ADVISELIST").val();
var MAIN_MANAGE_PRODUCT_DEL_ADVISEINFO = $("#MAIN_MANAGE_PRODUCT_DEL_ADVISEINFO").val();
var MAIN_MANAGE_PRODUCT_FIND_ADVISEINFO = $("#MAIN_MANAGE_PRODUCT_FIND_ADVISEINFO").val();

$(document).ready(function() {
	findOrgListByXxType($("#yjfk_xxType").val());
//	generate_table_yjfk();
	
	$("#yjfk-search-btn").click(function(){
		generate_table_yjfk();
	});
	$("#yjfk-org-chosen").change(function(){
		generate_table_yjfk();
	});

	$("#yjfk_xxType").change(function(){
		findOrgListByXxType($("#yjfk_xxType").val());
	});
	$("#btnAuth_span_reply").click(function(){
		replyYjfk();
	});
	$("#replyNextPage").click(function(){
		changeReplyPage(1);
	});
	$("#replyPreviousPage").click(function(){
		changeReplyPage(2);
	});
});


function generate_table_yjfk(){
	GHBB.prompt("正在加载~");
	var rownum=1;
    var aoColumns = [ {
		"sTitle" : "反馈类型",
		"mDataProp" : "adviseTypeName",
		"sClass" : "text-center"
	},{
		"sTitle" : "反馈人",
		"mDataProp" : "advisePersonName",
		"sClass" : "text-center"
	},{
		"sTitle" : "联系方式",
		"mDataProp" : "phoneNumber",
		"sClass" : "text-center"
	},{
		"sTitle" : "反馈时间",
		"mDataProp" : "lysj",
		"sClass" : "text-center"
	},{
		"sTitle" : "处理人",
		"mDataProp" : "userid_ch",
		"sClass" : "text-center"
	},{
		"sTitle" : "管理",
		"mDataProp" : "id",
		"sClass" : "text-center"
	} ];
    
    
    $('#yjfk-datatable').dataTable({
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
				content : $("#yjfk-content").val(),
				search_orgcode : $("#yjfk-org-chosen").val(),
				"iDisplayStart" : 0,
		        "iDisplayLength": 10,
		        "sEcho" : 1,
		        xxType : $("#yjfk_xxType").val()
				
			};
			aoData.push( { "name": "api", "value": MAIN_MANAGE_PRODUCT_FIND_ADVISELIST } );
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
        	var date = getDate(new Date(aaData.lysj),"yyyy-MM-dd HH:mm:ss");
        	$('td:eq(3)', nRow).html(date);
        	$('td:eq(4)', nRow).html(aaData.handlername);
 			// 删除
 			var delHtml='<div class="btn-group btn-group-xs"><a style="margin:0 5px;" href="javascript:showYjfk('+aaData.id+');">回复</a></div>'
 					   +'<a style="margin:0 5px;" href="javascript:delYjfkConfirm('+aaData.id+');">删除</a></div>';
 			$('td:eq(5)', nRow).html(delHtml);
 			
			rownum=rownum+1;
			return nRow;
		}, 
        "aoColumns":aoColumns,
        "fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
    });
}


function getDate(time, format){
	    var t = new Date(time);
	    var tf = function(i){
	    	return (i < 10 ? '0' : '') + i;
	    };
	    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
	        switch(a){
	            case 'yyyy':
	                return tf(t.getFullYear());
	                break;
	            case 'MM':
	                return tf(t.getMonth() + 1);
	                break;
	            case 'mm':
	                return tf(t.getMinutes());
	                break;
	            case 'dd':
	                return tf(t.getDate());
	                break;
	            case 'HH':
	                return tf(t.getHours());
	                break;
	            case 'ss':
	                return tf(t.getSeconds());
	                break;
	        }
	  });
}

function showYjfk(id){
	var url=ctx+"/base/ajax_query_data";
	var param = {
			id	: id
	};
	var submitData = {
		api : MAIN_MANAGE_PRODUCT_FIND_ADVISEINFO,
		param : JSON.stringify(param)
	}
	$.post(url,submitData,function(json){
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#userid_ch").html(result.data.yjfk.userid_ch);
			$("#phone").html(result.data.yjfk.phoneNumber);
			$("#lysj").html(format(result.data.yjfk.lysj, 'yyyy-MM-dd HH:mm:ss'));
			$("#yjfk_content").html(result.data.yjfk.content);
			$("#adviseid").val(result.data.yjfk.id);
			$("#yjfk_senderid").val(result.data.yjfk.userid);
			$('#replyContent').val('');
			
			$('#tz_nowPage').val(1);
			$('#tz_serialnumber').val(result.data.yjfk.serialnumber);
			$('.messageReplyFooter').hide();
			$('#messageReplyBox').html('');
			$('#replyContent').val('');
			getMessageReplyList();
			$('#modal-yjfk').modal('show');
		}else{
			alert(result.ret.msg);
		}
    });
}

/**
 * 
 * @param type 1下一页 2上一页
 */
function changeReplyPage(type){
	if(type===1){
		$('#tz_nowPage').val(parseInt($('#tz_nowPage').val())+1);
	}else{
		$('#tz_nowPage').val(parseInt($('#tz_nowPage').val())-1);
	}
	getMessageReplyList();
}

/**
 * 获取消息回复详情列表
 */
function getMessageReplyList(){
	GHBB.prompt("正在加载~");
	var pagesize = 2;
	var submitData = {
			api:ApiParamUtil.MAIN_MANAGE_PRODUCT_ADVISE_REPLY_LIST,
			param:JSON.stringify({
				serialnumber:$('#tz_serialnumber').val(),
				nowPage:$('#tz_nowPage').val(),
				pageSize:pagesize
			})
		};
		$.ajax({
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas){
				GHBB.hide();
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					if(result.data.dataTotal!==0){
						createLeaveReplyContent(result.data.replyList);
						if(result.data.dataTotal>pagesize)
							$('.messageReplyFooter').show();
						if($('#tz_nowPage').val()==1){
							$('#replyPreviousPage').attr("disabled","");
						}else{
							$('#replyPreviousPage').removeAttr("disabled");
						}
						if((parseInt($('#tz_nowPage').val())-1)*pagesize+result.data.replyList.length==result.data.dataTotal){
							$('#replyNextPage').attr("disabled","");
						}else{
							$('#replyNextPage').removeAttr("disabled");
						}
					}
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createLeaveReplyContent(dataList){
	var dataArray = new Array();
	for(var i=0;i<dataList.length;i++){
		dataArray.push('<div class="message-reply-box">');
		dataArray.push('<div>');
		dataArray.push('<span class="name">'+dataList[i].name+'</span>');
		dataArray.push('<span class="time">'+dataList[i].time+'</span>');
		dataArray.push('</div>');
		dataArray.push('<div class="message-reply-content">'+dataList[i].content+'</div>');
		dataArray.push('</div>');
	}
	$('#messageReplyBox').html(dataArray.join(''));
}

function delYjfkConfirm(id){
	if(confirm("确认删除?")){
		GHBB.prompt("数据保存中~");
		var url=ctx+"/base/ajax_query_data";
		var param = {
				id	: id
		};
		var submitData = {
			api : MAIN_MANAGE_PRODUCT_DEL_ADVISEINFO,
			param : JSON.stringify(param)
		}
		$.post(url,submitData,function(json){
			GHBB.hide();
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				generate_table_yjfk();
				alert("删除成功！");
			}else{
				alert(result.ret.msg);
			}
	    });
	}
}

var format = function(time, format){
    var t = new Date(time);
    var tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}

function findOrgListByXxType(_xxType){
	var url=ctx+"/xtgl/orgsj/findOrgByXxtype";
	var submitData = {
			search_EQ_type: _xxType
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#yjfk-org-chosen option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	$("#yjfk-org-chosen").append("<option value=" + datas[i][0]+" >"
		        			+ datas[i][1] + "</option>");
	        	
	        };
	        $("#yjfk-org-chosen").find("option[index='0']").attr("selected",'selected');
	        $("#yjfk-org-chosen").trigger("chosen:updated");
	        
	        generate_table_yjfk();
    });
}

/**
 * 意见反馈回复
 */
function replyYjfk(){
	GHBB.prompt("数据保存中~");
	var replyContent = $('#replyContent').val();
	if(replyContent===null||replyContent===''){
		PromptBox.alert('消息回复不能为空！');
		return false;
	}
	var submitData = {
			api:ApiParamUtil.MAIN_MANAGE_PRODUCT_ADVISE_REPLY,
			param:JSON.stringify({
				content:replyContent,
				adviseid:$('#adviseid').val(),
				receiverid:$('#yjfk_senderid').val(),
				senderid:main_userid
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){				
				$('#modal-yjfk').modal('hide');	
				generate_table_yjfk();
			}else if(result.ret.code==="400"){
				PromptBox.alert("该用户暂未绑定微信！");
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}