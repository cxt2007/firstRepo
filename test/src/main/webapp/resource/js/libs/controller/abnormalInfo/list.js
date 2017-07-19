
function queryText(){
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	if (typeof(startDate) == "undefined" ||startDate==null) { 
		startDate="";
	}  
	if (typeof(endDate) == "undefined" || endDate==null) { 
		endDate="";
	}  
	return "startDate="+startDate+"&endDate="+endDate;
}
//查询
function abnormalInfoQuery(query){
		var query = queryText();//获取条件
		$.ajax({
			url:"/abnormalInfo/list?"+query,	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//查看
	function viewDetails(id,obj) {
		$.ajax({
			url:"/careRecord/detailsList?id=" + id,	            		
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
			url:"/abnormalInfo/list",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
	//返回
	function returnBtu(){
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
	
	//查看
	function showDataView(id){
		if(id!=null&&id!=''){
			$.ajax({
				type : 'post',
				async:false,
				url:"/abnormalInfo/showDataView",
        		data : {'id' : id},
				success:function(data){
					if(data){
						$("#indexCommonView").html("").html(data);
					}
				}
			});
		}
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
