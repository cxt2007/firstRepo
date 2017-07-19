//所有条件
function queryText(){
	var startDate = isJudge($("#startDate").val())
	var endDate = isJudge($("#endDate").val())
	var idcardOrName = isJudge($("#idcardOrName").val())
	if(startDate==$("#startDate").attr("placeholder")){
		startDate="";
	}
	if(endDate==$("#endDate").attr("placeholder")){
		endDate="";
	}
	if(idcardOrName==$("#idcardOrName").attr("placeholder")){
		idcardOrName="";
	}
	return "startDate="+startDate+"&endDate="+endDate+"&idcardOrName="+idcardOrName;
}
//判断空
function isJudge(str){
	if ($.trim(typeof(str)) == "undefined" || $.trim(str)=="null" ||str==null) {
		str = "";
		return str;
	}else{
		return str;
	}
}
//查询
function historyQuery(query){
		$.ajax({
			url:"/careRecord/list",	            		
			async:false,
			type:"POST",
			data:{"queryText":query},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//查看
	function viewDetails(peopleId,obj) {
		$.ajax({
			url:"/careRecord/detailsList?peopleId=" + peopleId,	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//刷新
	function refresh(){
		$.ajax({
			url:"/careRecord/historyList",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//修改
	function historyEdit(id){
		$.ajax({
			url:"/careRecord/update?id=" + id,	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
	
	//删除
	function historyCancel(id,_self){
		$.confirm({
	        title:"删除确认",
	        message:"确定要删除吗？",
	        width: 300,
	        height:200,
	        okFunc: function(){
	        	$.ajax({
	        		type : 'post',
	        		url : '/appVersion/delete',
	        		data : {'id' : id},
	        		dataType: "json",
	        		success : function(data) {
	        			if(data=200){
	        				$(_self).parents("tr").remove();
	        				$.messageBox({message:'删除成功',level: "success"});
	        			}else if(data.msg="删除失败"){
	        				$.messageBox({message:'删除失败',level: "error"});
	        			}else{
	        				$.messageBox({message:'删除失败',level: "error"});
	        			}
	        		}
	        	});
	        }
		});
	}
	
	
	
	$(function() {
		//新增		
		$("#maintainForm").formValidate({
			 submitHandler: function(form) {
				 $(form).ajaxSubmit({
						dataType: "json",
						success: function(data){
			            	if(data.code==200){	   
			            		$.messageBox({message:'保存成功',level: "success"});
			            		$.ajax({
			            			url:"/appVersion/list",	            		
			            			async:false,
			            			type:"POST",
			            			success:function(data){
			            				if(data){
			            					$("#indexCommonView").html("").html(data);
			            				}
			            			}
			            		});
			            	} else if(data.code="500") {
			            		$.messageBox({message:data.msg,level: "error"});
			            		
			            	}else{
			            		$.messageBox({message:'保存失败',level: "error"});
			            	}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown){
							$.messageBox({level:"error",message:"提交错误"});
						}
				 });
			 },
			 errorHandler:function(){
			 }
		});
		
	});
