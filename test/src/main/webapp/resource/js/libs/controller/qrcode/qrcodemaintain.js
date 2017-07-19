$(function() {
	//autocomplete
	var tag=false;	  	  
	//表单提交
	$("#maintainForm").formValidate({
		submitHandler : function(form) {
//			$.ajax({
//				url: PATH+"/qrcode/vailPeople",
//				data:{"idcard":$("#idcard").val(),
//					 "name":$("#name").val()
//				},
//				type:"POST",
//				success: function(data) {
//						if(data.code==500){							
//							$.messageBox({level:'warn',message:'该老人不存在！'});
//							tag = true;
//						}
//						if(data.code==200){
//							 tag = false;
//							 if(tag){
//									return false;
//								}
//								tag = true;
						    	$(form).ajaxSubmit({
									dataType: "json",
									success : function(data) {
										if(data && data.ret && data.ret.code==200){
											$.ajax({
												url:"/qrcode/list",	            		
												async:false,
												type:"POST",
												success:function(data){
													if(data){
														$("#indexCommonView").html("").html(data);
													}
												}
											});
										}else if(data && data.ret && data.ret.code==500){
											tag=false;
											$.messageBox({level:'warn',message:data.ret.msg});		
										}else{
											tag=false;
											$.messageBox({level:'error',message:'提交错误！'});	
										}
									},
									error : function(XMLHttpRequest, textStatus, errorThrown) {
										tag=false;
										$.messageBox({level:'error',message:'提交错误！'});		
									}
								});	
//						}
//				},
//				error : function(){					
//				}
//			});			
				    
		},
		errorHandler : function() {
		}
	});
});