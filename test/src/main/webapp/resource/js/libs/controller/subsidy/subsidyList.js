//$(document).ready(function() {
//	  $("#chk").click(function() {
//		  $("input[name='orderIds']").each(function() {
//				$(this).attr("checked", !this.checked);
//			});
//	  });
//});
	function checkAll(name) {     
		  var el = document.getElementsByTagName('input');     
		  var len = el.length;     
		  for(var i=0; i<len; i++) {         
		   if((el[i].type=="checkbox") && (el[i].name==name))    {             
		     el[i].checked = true;         
		   }     
		  } 
		}
	
		function clearAll(name) {    
		  var el = document.getElementsByTagName('input');     
		  var len = el.length;     
		  for(var i=0; i<len; i++) {         
		   if((el[i].type=="checkbox") && (el[i].name==name))  {             
		     el[i].checked = false;        
		   }     
		  } 
		}
	
	
	//批量生成订单
	function batchOrders() {
		var ods = $("input[name='orderIds']:checked");
		var odsArray = new Array();
		ods.each(function() {
			odsArray.push($(this).val());
		});
		$.confirm({
			title : "确认",
			message : "请确认是否生成订单？",
			width : 375,
			height : 353,
			okFunc : function() {
				$.ajax({
					traditional : true,
					url : "/subsidy/subsidyOrders",
					data : {
						"orderIds" : odsArray
					},
					success : function(data) {
						if(data.code==200 ){
							$.messageBox({message : '批量生成订单成功',level : "success"}); 
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
			            }else{
			            	 $.messageBox({message:"请选择要生成的订单",level:"warn"});
			            }
					}
				})
				
			}
		});
	}
	
	//搜索
	function search(query){
		var queryText = $("#query").val().trim();
		if($("#query").val()==$("#query").attr("placeholder")){
			queryText="";
			return;
		}
		$.ajax({
			url:"/subsidy/list",	            		
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
		
	function toAdd(){
		$.ajax({
			url:"/subsidy/add",	            		
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
	//已注销，取消注销
	function release(id){
		$.ajax({
			url:"/subsidy/release",
			data:{"id":id},
			async:false,
			type:"POST",
			success:function(data){
				if(data!=null){
	            	$.ajax({
						url:"/subsidy/list",	            		
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
	   };
	//注销
	function revoke(id){
		$.ajax({
			url:"/subsidy/revoke",
			data:{"id":id},
			async:false,
			type:"POST",
			success:function(data){
				if(data!=null){
	            	$.ajax({
						url:"/subsidy/list",	            		
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
	
	// 修改
	function edit(id) {
			$.ajax({
				url:"/subsidy/edit",
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