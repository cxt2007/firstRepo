$("#status").change(function(){
		var query = $("#query").val();
		var status = $("#status").val();
		$.ajax({
			url:"/equipmentInfo/onlineList",	
			data:{'query':query,'status':status},
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			}
		});
	})
	function search(query){
		var status = $("#status").val();
		if(query==$("#query").attr("placeholder")){
			query="";
			return;
		}
		$.ajax({
			url:"/equipmentInfo/onlineList",
			async:false,
			type:"POST",
			data:{"query":query,"status":status},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
	function checkData(){
		$.ajax({
			url:"/equipmentInfo/checkData",
			async:false,
			type:"POST",
			success:function(data){
				$.messageBox({message:"校验完成"});
				$.ajax({
					url:"/equipmentInfo/onlineList",	            		
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
	//导入
	 $("#import").click(function(){
	     	$("#exportDatas").createDialog({
	     		width: 450,
				height: 370,
				title:'导入',
				url:'/equipmentInfo/import',
				buttons: {
					"关闭" : function(event){
						$("#exportDatas").dialog("close");
					}
					}
				});
	     	//$("#exportDatas").css({'minHeight':'41px',height:'auto','paddingBottom':'0'});
	 });
//新增
function addInfo(){
	$.ajax({
		url:"/equipmentInfo/add",	            		
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
function editInfo(id){
	$.ajax({
		url:"/equipmentInfo/edit",
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

//删除
function deleteInfo(id){
	$.confirm({
        title:"确认",
        message:"确定删除？",
        width: 300,
        height:280,
        okFunc: function(){
        	$.ajax({
    			url:"/equipmentInfo/delete",
    			data:{"id":id},
    			async:false,
    			type:"POST",
    			dataType: "json",
    			success:function(data){
    				if (data) {
						$.ajax({
							url:"/equipmentInfo/onlineList",	            		
							async:false,
							type:"POST",
							success:function(data){
								if(data){
									$("#indexCommonView").html("").html(data);
								}
							}
						});
					}else {
						$.messageBox({message : '删除失败！',level : "warn"});
					}
    			}
    		});
        }
       })	
}