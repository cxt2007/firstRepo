
//刷新列表
	function refreshList(){
		var city = $("#city").find("option:selected").attr("id")||'';
		var releaseStatus = $("#releaseStatus").find("option:selected").attr("value")||'';
		$.ajax({
			url:"/activity/list?city="+city+"&releaseStatus="+releaseStatus,	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
					$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
				}
			}
		});
	}
	setTimeout(function(){
    	threeSelect({
    		province:'city',
    		provinceValue:$('#provinceValue').val()
    	});
	},100);
//	getCity();
	//选择城市
	$("#city").change(function(){
		refreshList();
	});
	$("#releaseStatus").change(function(){
		refreshList();
	});
//	function getCity(){
//		$.ajax({
//				type:'post',
//				url:'/org/getOrgListById',
//				dataType:'json',
//				async:false,
//				success:function(data){
//					var provinceData = data.organizationList;
//					$("#city").append("<option id=' ' value=' '>"+"请选择"+"</option>");
//					for(i=0;i<provinceData.length;i++){
//						$("#city").append("<option id='"+ provinceData[i].id +"' value='"+provinceData[i].orgName+"'>"+provinceData[i].orgName+"</option>");
//					}											
//					if($("#city"+" option").size()>1){
//						$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
//					}
//				}
//			});
//	}
	function addCity(id){
		$("#changeCityDialog").createDialog({
			width:520,
			height:500,
			title:'城市选择',
			url:'/activity/addCity?id='+id,
			buttons:{
				"确定":function(event){
					$("#maintainForm").submit();
				},
				"取消":function(){
					$(this).dialog("close");
				}
			}
		});
		
	}
	
	
//	function addhz() {
//			var city=$("#cityhz").val();
//			refreshList();
//	}
//		function addzs() {
//			var city=$("#cityzs").val();
//			refreshList();
//		}
	
	// 修改
	function updateActivity(id) {
	//	var releaseStatus = $("#"+id).html();
	//	if(releaseStatus == "已发布"){
	//		$.messageBox({message:"该活动已发布,不可修改！",level:"warn"});
	//        return;
	//	}else{
			$.ajax({
				url:"/activity/edit",
				data:{"id":id},
				async:false,
				type:"POST",
				success:function(data){
					if(data){
						$("#indexCommonView").html("").html(data);
	
					}
				}
			});
	//	}
	}
	
	// 查看
	function viewActivity(id) {
		$.ajax({
			url:"/activity/view",
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
	
	
	
	// 审核列表的查看
	function viewActivitys(id) {
		$.ajax({
			url:"/activity/views",
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
	
	
	// 删除
	function delActivity(id) {
		var releaseStatus = $("#"+id).html();
		if(releaseStatus == "已发布"){
			$.messageBox({message:"该活动已发布,不可删除！",level:"warn"});
	        return;
		}else{
			$.confirm({
		        title:"确认",
		        message:"确定删除该活动？",
		        width: 300,
		        okFunc: function(){
					$.ajax({
						type : 'post',
						url : '/activity/del',
						data : {
							'id' : id
						},
						dataType: "json",
						success : function(data) {
							if (data) {
								refreshList();
							} else {
								$.messageBox({message:"删除失败！",level:"warn"});
							}
						}
					});
		        }
			})
		}
	}
	
	//通过
	function  pass(id){
		$.ajax({
			type : 'post',
			url : "/activity/pass",
			data:{'id':id},
			dataType: "json",
			success : function(data) {
				if (data) {
					$.ajax({
						url:"/activity/auditList",	            		
						async:false,
						type:"POST",
						success:function(data){
							if(data){
								$("#indexCommonView").html("").html(data);
							}
						}
					});
				} else {
					$.messageBox({message:"审核通过失败！",level:"warn"});
				}
			}
		});
		
		
	}
	
	
	//不通过
	
	function  nopass(id){
		var value=$("#noPassValue").val();
		value = $.trim(value);  
		if(value==""){
			$.messageBox({level:'error',message:'不通过的内容!'});
			return;
		}
		$.ajax({
			type : 'post',
			url : "/activity/nopass",
			data : {
				'id' : id,
				'value':value
			},
			dataType: "json",
			success : function(data) {
				if (data) {
					$.ajax({
						url:"/activity/auditList",	            		
						async:false,
						type:"POST",
						success:function(data){
							if(data){
								$("#indexCommonView").html("").html(data);
							}
						}
					});
				} else {
					$.messageBox({message:"审核不通过失败！",level:"warn"});
				}
			}
		});
		
		
	}
	
	// 审核
	function viewaudit(id) {
		$.ajax({
			url:"/activity/auditView",
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

	function openCenter(id){
		
		$.ajax({
			url:"/activity/centerView",
			data:{"id":id},
			async:false,
			type:"POST",
			success:function(data){
				debugger;
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
		
	}
	
	
	
	
	function toAdd(){
		$.ajax({
			url:"/activity/add",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//置顶
	function topList(id) {
		$.ajax({
				type : 'POST',
				url : '/activity/top',
				async:false,
				data : {
					'id' : id
				},
				dataType: "json",
				success : function(data) {
					if (data) {
						refreshList();
					} else {
						$.messageBox({message:"置顶失败！",level:"warn"});
					}
				}
		});
	}
	function release(id){
		var releaseStatus = $("#"+id).html();
		if(releaseStatus == "已发布"){
			$.messageBox({message:"该活动已发布！",level:"warn"});
	        return;
		}else{
			$.ajax({
				url:"/activity/vail",
				async:false,
				type:"POST",
				data:{"id":id},
				success:function(data){
					if(data.code!=200 ){
		                $.messageBox({message:data.msg,level:"warn"});
		                return;
		            }else{
		            	$.ajax({
		        			url:"/activity/release",	            		
		        			async:false,
		        			type:"POST",
		        			data:{"id":id},
		        			success:function(data){
		        				data = JSON.parse(data);
		        				if(data.code!=200 ){
		        	                $.messageBox({message:"请将活动填写完整后在发布",level:"error"});
		        	                return;
		        	            }else{
		        	            	$.messageBox({message:data.data});
		        	            	refreshList();
		        	            }
		        			}
		        		});
		            }
				}
			});
			
		}
	}
	
	function revoke(id){
		var releaseStatus = $("#"+id).html();
		if(releaseStatus == "未发布"){
			$.messageBox({message:"该活动未发布！",level:"warn"});
			return;
		}else{
			$.ajax({
				url:"/activity/revoke",
				data:{"id":id},
				async:false,
				type:"POST",
				success:function(data){
					data = JSON.parse(data);
					if(data.code != 200){
						$.messageBox({message:data.msg,level:"error"});
		                return;
					}else{
						$.messageBox({message:data.data});
						refreshList();
					}
				}
			});
		}
	}
