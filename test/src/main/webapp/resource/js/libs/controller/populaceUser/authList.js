	function authFail(id){
		$("#inputDialog").createDialog({
			width:475,
			height:280,
			title:'认证不通过原因',
			url:"/authentication/fail?id="+id,
			buttons:{
				"确定":function(event){
					var failReason = $("#failReason").val();
					if(null == failReason || "" == failReason){
						$.messageBox({message : "请输入认证失败原因",level : "warn"});
						return;
					}
					$.ajax({
						url:"/authentication/authFail",
						data:{
							'failReason':failReason,
							'id':id
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
								url:"/authentication/authList",	            		
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
	
	
	function authSuccess(id){
		$.ajax({
			url:"/authentication/checkElder",
			data:{"id":id},
			async:false,
			type:"POST",
			success:function(data){
				if(data.ret.code==200){
					authSuccess1(id);
				}else{
					$.confirm({
				        title:"确认",
				        message:"该老年人不存在，确定认证？",
				        height: 275,
				        width: 300,
				        okFunc: function(){
							$.ajax({
								type : 'post',
								url : '/authentication/authSuccess1',
								data : {
									'id' : id
								},
								dataType: "json",
								success : function(data) {
									if(data.ret.code==200){
										$.messageBox({message : '认证成功！',level : "success"});
									}else{
										$.messageBox({message : "认证失败",level : "warn"});
									}
									
									$.ajax({
										url:"/authentication/authList",	            		
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
				        }
					})
				}
			}
		});
	}
	
	function authSuccess1(id){
		$.ajax({
			url:"/authentication/authSuccess",
			data:{
				'id':id
			},
			async:false,
			type:"POST",		
			success:function(data){
				if(data.ret.code==200){
					$.messageBox({message : '操作成功！',level : "success"});
				}else{
					$.messageBox({message : data.ret.msg,level : "warn"});
				}
				$.ajax({
					url:"/authentication/authList",	            		
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
	}