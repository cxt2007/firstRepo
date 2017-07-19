	$("#status").change(function(){
		var queryText = $("#query").val().trim();
		var status = $("#status").val();
		$.ajax({
			url:"/volunteerTeam/list",	
			data:{'query':queryText,'status':status},
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			}
		});
	});
	
	//搜索
	function searchIt(query){
		var queryText = $("#query").val().trim();
		//var status = $("#status").val();
		if($("#query").val()==$("#query").attr("placeholder") && status == ''){
			queryText="";
			return;
		}
		$.ajax({
			url:"/volunteerTeam/list",	
			data:{'queryText':queryText},
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			},
			error:function(){
				elert("查找失败");
			}
		});
	};
	
	//修改
	function editVol(id) {
		$.ajax({
			url:"/volunteerTeam/edit/view",
			data:{"id":id},
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			}
		});
	};
	//判断是否参加活动
	function activity(id){
		$.ajax({
			url:"/volunteerTeam/activity",
			data:{"teamId":id},
			async:false,
			type:"POST",
			success:function(data){
				if(data.code==200){
					$.confirm({
						title:"确认",
						message:"确定删除该内容？",
						width: 300,
						height:280,
						okFunc: function(){
							$.ajax({
								type : 'post',
								url : '/volunteerTeam/del',
								data : {
									'id' : id
								},
								dataType: "json",
								success : function(data) {
									if (data) {
										$.ajax({
											url:"/volunteerTeam/list",	            		
											async:false,
											type:"POST",
											success:function(data){
												if(data){
													$("#indexCommonView").html("").html(data);
													
												}
											}
										});
									} else {
										$.messageBox({message : '删除失败！',level : "warn"});
									}
								}
							});
						}
					});
				}else if(data && data.ret && data.ret.code==500){
					$.messageBox({message : "操作失败" , level:"warn"});
				}else{
					$.messageBox({message :data.msg, level:"warn"});
				}
			}
		});
	}
	
	//新增
	function addVolunteerTeam(){
		$.ajax({
			url:"/volunteerTeam/add/view",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data).refreshPlaceholder();
				}
			}
		});
	}
	
	
	function resetPassword(userId){
		$("#volunteerTeamDatas").createDialog({
			width:475,
			height:270,
			title:'重置密码',
			url:"/volunteerTeam/reset?userId="+userId,
			buttons:{
				"确定":function(event){
					var newPassword = $("#newPassword").val();
					if(null == newPassword || "" == newPassword){
						$.messageBox({message : "请输入新密码",level : "warn"});
						return;
					}
					$.ajax({
						url:"/volunteerTeam/resetPassword",
						data:{
							'newPassword':newPassword,
							'userId':userId
						},
						async:false,
						type:"POST",		
						success:function(data){
							if(data && data.ret && data.ret.code==200){
								$("#volunteerTeamDatas").dialog("close");
								$.messageBox({message : '操作成功！',level : "success"});
							}else if(data && data.ret && data.ret.code == 500){
								$.messageBox({message : data.ret.msg , level:"warn"});
							}else{
								$("#volunteerTeamDatas").dialog("close");
								$.messageBox({message : "操作失败" , level : "warn"});
							}
						}
					});
				},
				"取消":function(){
					$(this).dialog("close");
				}
			}
		});
	};
	
	//禁用
	function disableSA(id){
	
		$.confirm({
			title:"确认",
		    message:"确定禁用？",
		    width: 300,
		    height:280,
		    okFunc: function(){
		    	$.ajax({
		    		url:"/volunteerTeam/enableOperate",
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
		    					url:"/volunteerTeam/list",	            		
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
	
	//启用
	function enableSA(id){
		$.confirm({
			title:"确认",
			message:"确定启用？",
			width:300,
			height:280,
			okFunc:function(){
				$.ajax({
					url:"/volunteerTeam/enableOperate",
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
		    					url:"/volunteerTeam/list",	            		
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
