	// 审核通过
	function checkPass(id) {
		$.confirm({
	        title:"确认",
	        message:"确定该用户通过实名认证？",
	        width: 300,
	        okFunc: function(){
				$.ajax({
					type : 'post',
					url : '/populaceUser/checkPopulaceUser',
					data : {
						'id' : id,
						'state':0
					},
					dataType: "json",
					success : function(data) {
						$.ajax({
							url:"/populaceUser/checkingList",	            		
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
	
	function checkNoPass(id) {
		$('#checkDialog').createDialog({
			width:500,
			height:300,
			title:'审核不通过',
			url:'/populaceUser/noCheck?id='+id,
			buttons:{
				'确定':function(){
					$("#settingForm").submit();
				},
				'取消':function(){
					$(this).dialog("close");
				}
			}
		});
	}
