	function appVersion(query){
		var queryText = $("#query").val().trim();
		if($("#query").val()==$("#query").attr("placeholder")){
			queryText="";
			return;
		}s
		$.ajax({
			url:"/appVersion/list?query="+encodeURIComponent(queryText),
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
	function viewAppVersion(id) {
		$.ajax({
			url:"/appVersion/view?id=" + id,	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//新增
	function addAppVersion(){
		$.ajax({
			url:"/appVersion/add",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//新增
	function edit(id){
		$.ajax({
			url:"/appVersion/update?id=" + id,	            		
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
	function appVersion_cancel(id,_self){
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
