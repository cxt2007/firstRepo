//$(document).ready(function() {
//	  $("#chk").click(function() {
//		  $("input[name='orderIds']").each(function() {
//				$(this).attr("checked", !this.checked);
//			});
//	  });
//});
	
	//搜索
	function search(){
		var queryText = $("#query").val().trim();
		if($("#query").val()==$("#query").attr("placeholder")){
			queryText="";
			return;
		}
		$.ajax({
			url:"/headquarters/list",	            		
			async:false,
			type:"POST",
			data:{"queryText":queryText},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
	
	//查看
	function view(id){
			$.ajax({
				url:"/subsidy/view",
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
	
	//新增
	function toAdd(){
		$.ajax({
			url:"/headquarters/add/view",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
		
	}
	$("#import").click(function(){
	 	$("#exportDatas").createDialog({
	 		width: 450,
			height: 370,
			title:'导入',
			url:'/subsidy/import',
			buttons: {
				"关闭" : function(event){
					$("#exportDatas").dialog("close");
					$.ajax({
						url:"/subsidy/list",	            		
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
	 	//$("#exportDatas").css({'minHeight':'41px',height:'auto','paddingBottom':'0'});
	});

	//删除
	function del(id){
		$.confirm({
	        title:"确认",
	        message:"确定删除该信息？",
	        width: 300,
	        okFunc: function(){
				$.ajax({
					type : 'post',
					url : '/subsidy/del',
					data : {'id' : id},
					dataType: "json",
					success : function(data) {
						if (data) {
							$.ajax({
								url:"/subsidy/list",	            		
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
	
	// 修改
	function edit(id) {
			$.ajax({
				url:"/headquarters/edit/view",
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