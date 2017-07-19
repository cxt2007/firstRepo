// 修改
function editDiscovery(id) {
//	var releaseStatus = $("#"+id).html();
//	if(releaseStatus == "已发布"){
//		$.messageBox({message:"该发现内容已发布，不可修改！",level:"warn"});
//        return;
//	}else{
		$.ajax({
			url:"/discovery/edit",
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

//function addCity (id) {
//	$.ajax ({
//		url:"/discovery/addCity",
//		async:false,
//		type:"POST",
//		data:{"id":id},
//		success:function(data){
//			if(data){
//				$("#indexCommonView").html("").html(data);
//			}
//		}
//	});
// }


// 删除
function delDiscovery(id) {
	var releaseStatus = $("#"+id).html();
	if(releaseStatus == "已发布"){
		$.messageBox({message:"该发现内容已发布，不可删除！",level:"warn"});
        return;
	}else{
		$.confirm({
	        title:"确认",
	        message:"确定删除该内容？",
	        width: 300,
	        okFunc: function(){
				$.ajax({
					type : 'post',
					url : '/discovery/del',
					data : {
						'id' : id
					},
					dataType: "json",
					success : function(data) {
						if (data) {
							$.ajax({
								url:"/discovery/list",	            		
								async:false,
								type:"POST",
								success:function(data){
									if(data){
										$("#indexCommonView").html("").html(data);

									}
								}
							});
						} else {
							alert("删除失败！");
						}
					}
				});
	        }
		})
	}
}

//新增
function toAdd(){
	$.ajax({
		url:"/discovery/add",	            		
		async:false,
		type:"POST",
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data).refreshPlaceholder();
			}
		}
	});
}

//置顶
function topList(id) {
	$.ajax({
		type : 'post',
		url : '/discovery/topList',
		data : {
			'id' : id
		},
		dataType: "json",
		success : function(data) {
			if (data) {
				$.ajax({
					url:"/discovery/list",	            		
					async:false,
					type:"POST",
					success:function(data){
						if(data){
							$("#indexCommonView").html("").html(data);

						}
					}
				});
			} else {
				alert("置顶失败！");
			}
		}
	});
}


function release(id){
	var releaseStatus = $("#"+id).html();
	if(releaseStatus == "已发布"){
		$.messageBox({message:"该发现内容已发布！",level:"warn"});
        return;
	}else{
		$.ajax({
			url:"/discovery/vail",
			async:false,
			type:"POST",
			data:{"id":id},
			success:function(data){
				if(data.code!=200 ){
	                $.messageBox({message:data.msg,level:"warn"});
	                return;
	            }else{
	            	$.ajax({
						url:"/discovery/release",	            		
						async:false,
						type:"POST",
						data:{"id":id},
						success:function(data){
							data = JSON.parse(data);
							if(data.code!=200 ){
				                $.messageBox({message:data.msg,level:"error"});
				                return;
				            }else{
				            	$.messageBox({message:data.data});
				            	$.ajax({
									url:"/discovery/list",	            		
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
			  }
		});
	}	
}

function revoke(id){
	var releaseStatus = $("#"+id).html();
	if(releaseStatus == "未发布"){
		$.messageBox({message:"该发现内容未发布！",level:"warn"});
		return;
	}else{
		$.ajax({
			url:"/discovery/revoke",
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
	            	$.ajax({
						url:"/discovery/list",	            		
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
}
