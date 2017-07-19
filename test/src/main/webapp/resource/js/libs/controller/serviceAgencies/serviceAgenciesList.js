	threeSelect({
	    province:'city',
	    provinceValue:$('#provinceValue').val()
	});
	

function refresh(){
	$.ajax({
		url:"/serviceAgencies/lists",	
		data:{"types":"1"},
		async:false,
		type:"POST",
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
			}
		}
	});
}

// 启用状态
$("#isEnable").change(function(e){
		var query = $("#query").val();
		var isEnable = $("#isEnable").val();
		var city = $("#city").val();
		$.ajax({
			url:"/serviceAgencies/lists",	
			data:{'query':query,'isEnable':isEnable,"city":city,"types":"1"},
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
					$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
				}
			}
		});
	})



$("#city").change(function(e){
		var query = $("#query").val();
		var city = $("#city").val();
		var isEnable=$("#isEnable").val();
		$.ajax({
			url:"/serviceAgencies/lists",	
			data:{'query':query,'city':city,'isEnable':isEnable,"types":"1"},
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
					$("#isEnable").val($("#isEnableValue").val()?$("#isEnableValue").val():null);
				}
			}
		});
	})

function searchSA(query){
	var isEnable = $("#isEnable").val();
	query=query.trim();
	if(query==$("#query").attr("placeholder")){
		query="";
		return;
	}
	$.ajax({
		url:"/serviceAgencies/lists",	 
		data:{"query":query,"isEnable":isEnable,"types":"1"},
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
function addSA(){
	$.ajax({
		url:"/serviceAgencies/add",	            		
		async:false,
		type:"POST",
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);

			}
		}
	});
}

function updateSA(id){
	$.ajax({
		url:"/serviceAgencies/edit",
		data:{"id":id},
		async:false,
		type:"POST",
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);

			}
		}
	});
}

function deleteSA(id){

	$.confirm({
		title:"确认",
	    message:"确定删除该商家？",
	    width: 300,
	    height:280,
	    okFunc: function(){
	    	$.ajax({
	    		url:"/serviceAgencies/delete?id="+id,	            		
	    		async:false,
	    		type:"GET",
	    		success:function(data){
	    			data = JSON.parse(data);
	    			if(data.code!=200 ){
	                    $.messageBox({message:data.msg,level:"error"});
	                    return;
	                }else{
	                	$.messageBox({message:data.data});
	                	$.ajax({
	    					url:"/serviceAgencies/lists",	            		
	    					async:false,
	    					type:"POST",
	    					success:function(dataHtml){
	    						if(data){
	    							$("#indexCommonView").html("").html(dataHtml);

	    						}
	    					}
	    				});
	                }
	    		}
	    	});
	    
	    }
	})
}

function enableSA(id){
	$.confirm({
		title:"确认",
		message:"确定启用？",
		width:300,
		height:280,
		okFunc:function(){
			$.ajax({
				url:"/serviceAgencies/enableOperate",
				data:{"id":id,"operate":1},
				async:false,
				type:"POST",
				success:function(data){
	    			if(data.code!=200 ){
	                    $.messageBox({message:data.msg,level:"error"});
	                    return;
	                }else{
	                	$.messageBox({message:data.data});
	                	$.ajax({
	    					url:"/serviceAgencies/lists",	            		
	    					async:false,
	    					type:"POST",
	    					success:function(dataHtml){
	    						if(data){
	    							$("#indexCommonView").html("").html(dataHtml);

	    						}
	    					}
	    				});
	                }
				}
			});
		}
	});
}

function disableSA(id){

	$.confirm({
		title:"确认",
	    message:"确定禁用？",
	    width: 300,
	    height:280,
	    okFunc: function(){
	    	$.ajax({
	    		url:"/serviceAgencies/enableOperate",
	    		data:{"id":id,"operate":2},
	    		async:false,
	    		type:"POST",
	    		success:function(data){
	    			if(data.code!=200 ){
	                    $.messageBox({message:data.msg,level:"error"});
	                    return;
	                }else{
	                	$.messageBox({message:data.data});
	                	$.ajax({
	    					url:"/serviceAgencies/lists",	            		
	    					async:false,
	    					type:"POST",
	    					success:function(data){
	    						if(data){
	    							$("#indexCommonView").html("").html(data);

	    						}
	    					}
	    				});
	                }
	    		}
	    	});
	    
	    }
	})
}

function resetPassword(userId){
	$("#inputDialog").createDialog({
		width:475,
		height:270,
		title:'重置密码',
		url:"/serviceAgencies/reset?userId="+userId,
		buttons:{
			"确定":function(event){
				var newPassword = $("#newPassword").val();
				if(null == newPassword || "" == newPassword){
					$.messageBox({message : "请输入新密码",level : "warn"});
					return;
				}
				if(newPassword.length < 6){
					$.messageBox({message : "请输入6位以上的新密码",level : "warn"});
					return;
				}
				$.ajax({
					url:"/serviceAgencies/resetPassword",
					data:{
						'newPassword':newPassword,
						'userId':userId
					},
					async:false,
					type:"POST",		
					success:function(data){
						if(data.ret.code==200){
							$("#inputDialog").dialog("close");
							$.messageBox({message : '操作成功！',level : "success"});
						}else{
							$("#inputDialog").dialog("close");
							$.messageBox({message : data.ret.msg,level : "success"});
						}
						$.ajax({
							url:"/serviceAgencies/lists",	            		
							async:false,
							type:"POST",
							success:function(data){
								if(data){
									$("#indexCommonView").html("").html(data);
								}
							}
						});
					}
				});
			},
			"取消":function(){
				$(this).dialog("close");
			}
		}
	});
}

function viewSA(id){
	$.ajax({
		url:"/serviceAgencies/viewSA?id="+id,	            		
		async:false,
		type:"GET",
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);

			}
		}
	});
}
//
//
//
//
//$(function(){
//	new tabFun("#tabTable .tableTit li","#tabTable .tabCont .tableMod")
//})


