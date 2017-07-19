	setTimeout(function(){
    	threeSelect({
    		province:'city',
    		provinceValue:$('#provinceValue').val()
    	});
	},100);
	function refreshList(){
		var city = $("#city").find("option:selected").attr("id")||'';
		var releaseStatus = $("#releaseStatus").find("option:selected").attr("value")||'';
		$.ajax({
			url:"/volunteer/list?city="+city+"&releaseStatus="+releaseStatus,	            		
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
	//选择城市
	$("#city").change(function(){
		refreshList();
	});
	$("#releaseStatus").change(function(){
		refreshList();
	});
	//新增
	function toAdd(){
		$.ajax({
			url:"/volunteer/add",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	// 修改
	function updateVolunteer(id) {
		$.ajax({
			url:"/volunteer/edit",
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
	// 查看
	function viewVolunteer(id) {
		$.ajax({
			url:"/volunteer/details",
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
	
	function addCity(id){
		$("#changeCityDialog").createDialog({
			width:520,
			height:500,
			title:'城市选择',
			url:'/volunteer/addCity?id='+id,
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
	
	// 删除
	function delVolunteer(id) {
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
						url : '/volunteer/del',
						data : {
							'id' : id
						},
						dataType: "json",
						success : function(data) {
							if (data) {
								refreshList();
							} else {
								$.messageBox({message:"删除失败！",level:"error"});
							}
						}
					});
		        }
			})
		}
	}
	
	//置顶
	function topList(id) {
		$.ajax({
				type : 'POST',
				url : '/volunteer/top',
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
				url:"/volunteer/vail",
				async:false,
				type:"POST",
				data:{"id":id},
				success:function(data){
					if(data.code!=200 ){
		                $.messageBox({message:data.msg,level:"warn"});
		                return;
		            }else{
		            	$.ajax({
		        			url:"/volunteer/release",	            		
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
				url:"/volunteer/revoke",
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
	
