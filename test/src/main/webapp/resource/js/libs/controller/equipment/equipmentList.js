$(function(){
	
});

function exportList(){
	$.confirm({
        title:"确认",
        message:"确认导出？",
        width: 300,
        height:250,
        okFunc: function(){
        	var queryText = $("#query").val().trim();
        	var status = $("#status").val();
        	var deviceType = $("#deviceType").val();
        	if($("#query").val()==$("#query").attr("placeholder")){
        		queryText="";
        		return;
        	}
			var submitData={
					'query':queryText,
					'status':status,
					'deviceType':deviceType
				};
//        	$.ajax({
//        		url: "/equipmentInfo/getCountBeforeInformationRegistrationFile",
//        		type: "POST",
//        		data: submitData,
//        		success: function(data){
//        			if(data.data){
						$("#queryTextForm").val(queryText);
						$("#statusForm").val(status);
						$("#deviceTypeForm").val(deviceType);
        				$("#exportForm").submit();
//        			}else{
//        				$.notice({level:"info",message:"没有选择老人"});
//        			}
//        		}
//        	});
        }});
}

function syncFile(){
	$("#messageDialog").createDialog({
		width:400,
		height:600,
		title:'关联附件',
		url:'/equipment/syncFileForm',
		buttons: {
//		  "确认" : function(event){
//			  $("#syncFileForm").submit();
//			  return;
//		   },
			"关闭":function(event){
				$("#messageDialog").dialog("close");
		   }
		}
	});
}

//function syncFile1(){
//	$("#messageDialog").dialog({
//		modal:true,
//		title:'关联附件',
//		width:400,
//		buttons: {
//		  "确定" : function(event){
//			  $.ajax({
//					url:"/equipment/syncFile",	
//					data:{'fileDir':$("#fileDir").val()},
//					async:false,
//					type:"POST",
//					success:function(data){
//						$("#messageDialog").dialog("close");
//						$.messageBox({message:"关联条数:"+data.count,level: "warn"});
//					}
//				});
//		   },
//			"取消":function(event){
//				$("#messageDialog").dialog("close");
//		   }
//		}
//	}) .css({"height":"auto"});
//	$("div.ui-dialog-buttonset").find('button:contains("确定")').addClass("butFocus");
//	
//}


	//同步审核时间(不用了)
//	function syntime() {
//		var ods = $("input[name='equitIds']:checked");
//		var odsArray = new Array();
//		ods.each(function() {
//			odsArray.push($(this).val());
//		});
//		$.confirm({
//			title : "确认",
//			message : "请确认是否同步？",
//			width : 375,
//			height : 353,
//			okFunc : function() {
//				$.ajax({
//					traditional : true,
//					url : "/equipment/syntime",
//					data : {
//						"equitIds" : odsArray
//					},
//					success : function(data) {
//						if(data.code==200 ){
//							$.messageBox({message : '同步成功',level : "success"}); 
//							$.ajax({
//								url:"/equipment/list",	            		
//								async:false,
//								type:"POST",
//								success:function(data){
//									if(data){
//										$("#indexCommonView").html("").html(data);
//									}
//								}
//							});
//			            }else{
//			            	 $.messageBox({message:"请选择要同步的终端",level:"warn"});
//			            }
//					}
//				})
//				
//			}
//		});
//	}
	


//同步审核时间
//function checkAll(name) {     
//		  var el = document.getElementsByTagName('input');     
//		  var len = el.length;     
//		  for(var i=0; i<len; i++) {         
//		   if((el[i].type=="checkbox") && (el[i].name==name))    {             
//		     el[i].checked = true;         
//		   }     
//		  } 
//		}
//	
//		function clearAll(name) {    
//		  var el = document.getElementsByTagName('input');     
//		  var len = el.length;     
//		  for(var i=0; i<len; i++) {         
//		   if((el[i].type=="checkbox") && (el[i].name==name))  {             
//		     el[i].checked = false;        
//		   }     
//		  } 
//		}





//导入
	 $("#import").click(function(){
	     	$("#exportDatas").createDialog({
	     		width: 450,
				height: 370,
				title:'导入',
				url:'/equipment/import',
				buttons: {
					"关闭" : function(event){
						$("#exportDatas").dialog("close");
					}
					}
				});
	     	//$("#exportDatas").css({'minHeight':'41px',height:'auto','paddingBottom':'0'});
	 });




$("#status").change(function(){
	var queryText = $("#query").val().trim();
	var status = $("#status").val();
	var deviceType=$("#deviceType").val()
	$.ajax({
		url:"/equipment/list",	
		data:{'query':queryText,'status':status,'deviceType':deviceType},
		async:false,
		type:"POST",
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
			}
		}
	});
	
})

$("#deviceType").change(function(){
	var queryText = $("#query").val().trim();
	var status = $("#status").val();
	var deviceType = $("#deviceType").val();
	$.ajax({
		url:"/equipment/list",	
		data:{'query':queryText,'status':status,'deviceType':deviceType},
		async:false,
		type:"POST",
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
			}
		}
	});
})

//搜索
function searchIt(query){
	var queryText = $("#query").val().trim();
	var status = $("#status").val();
	var deviceType = $("#deviceType").val();
	if($("#query").val()==$("#query").attr("placeholder") && status == ''){
		queryText="";
		return;
	}
	$.ajax({
		url:"/equipment/list",	
		data:{
			'query':queryText,
			'status':status,
			'deviceType':deviceType
		},
		async:false,
		type:"POST",
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
			}
		}
	});
}
//详情
	function viewEquipment(id){		
		$.ajax({
			url:"/equipment/view",
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
	
// 修改
	function editEquipment(id,imgurl) {
		if(imgurl.length!=0){
			$.messageBox({message : "有附件，不允许修改", level:"warn"});
			return;
		}
		$.ajax({
			url:"/equipment/edit",
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
	//激活
	function activatedEquipment(id) {
		$.confirm({
	        title:"确认",
	        message:"请确认终端处于开机且SIM卡可以正常使用的状态！",
	        width: 300,
	        height:300,
	        okFunc: function(){
				$.ajax({
					url:"/equipment/activated",
					data:{"id":id},
					async:false,
					type:"POST",
					success:function(data){
						if(data && data.code == 200){
							$.messageBox({message : data.data});
						}else if(data && data.code == 500){
							$.messageBox({message : data.msg , level:"warn"});
						}else{
							$.messageBox({message : "激活出错" , level:"warn"});
						}
					}
				});
	        }
		})
	}

	// 一键激活所有未激活终端
	function oneActivated(id) {
		$("#exportDatas").createDialog({
     		width: 400,
			height: 245,
			title:'批量激活',
			url:'/equipment/openAllAccountPage',
			buttons: {
				"确定" : function(event){
					$("#dateForm").submit();
				},
     			"取消":function(event){
     				$("#exportDatas").dialog("close");
				}
			}
		});
	}
	// 一键重置所有终端的亲情号码
	function oneKeyInfo(id) {
		$("#exportDatas").createDialog({
			width: 400,
			height: 245,
			title:'同步亲情号码',
			url:'/equipment/setAllKeyPage',
			buttons: {
				"确定" : function(event){
					$("#dateForm").submit();
				},
     			"取消":function(event){
     				$("#exportDatas").dialog("close");
				}
			}
		});
	}
	// 删除
	function delEquipment(id) {
		$.confirm({
			title:"确认",
			message:"确定删除该内容？",
			width: 300,
			height:280,
			okFunc: function(){
				$.ajax({
					type : 'post',
					url : '/equipment/del',
					data : {
						'id' : id
					},
					dataType: "json",
					success : function(data) {
						if (data.code == 200) {
							$.ajax({
								url:"/equipment/list",	            		
								async:false,
								type:"POST",
								success:function(data){
									if(data){
										$("#indexCommonView").html("").html(data);
									}
								}
							});
						} else {
							debugger
							$.messageBox({message : data.msg, level : "warn"});
						}
					}
				});
			}
		})
	}
	
	// 注销
	function logOutEquipment(id) {
		$("#logOutDialog").createDialog({
     		width: 550,
			height: 370,
			title:'提示',
			url:'/equipment/toLogoutPage',
			buttons: {
				"确定注销" : function(event){
					var reason = $("#reason").val();
					$.ajax({
						url:"/equipment/logout",
						data:{
							'reason':reason,
							'id':id
						},
						async:false,
						type:"POST",		
						success:function(data){
							if (data) {
								if(data.ret!=null && data.ret.code==200){
									$.messageBox({message : '注销成功！'});
									$("#logOutDialog").dialog("close");
									$.ajax({
										url:"/equipment/list",	            		
										async:false,
										type:"POST",
										success:function(data){
											if(data){
												$("#indexCommonView").html("").html(data);
											}
										}
									});
								}else if(data.ret!=null && data.ret.code==500){
									$.messageBox({message : '注销失败！',level : "warn"});
								}
							} else {
								$.messageBox({message : '注销失败！',level : "warn"});
							}
						}
					});
				},
				"取消" : function(event){
					$(this).dialog("close");
				}
			}
		});
	}
	//新增
	function toAddEquipment(){
		$.ajax({
			url:"/equipment/add",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data).refreshPlaceholder();
				}
			}
		});
	}

	//同步(暂时不用)
//	function synchronous(id){
//		$.ajax({
//			url:"/equipment/synch",	            		
//			async:false,
//			type:"POST",
//			data:{"id":id},
//			success:function(data){
//				data = JSON.parse(data);
//				if(data.code!=200 ){
//	                $.messageBox({message:data.msg,level:"error"});
//	                return;
//	            }else{
//	            	$.messageBox({message:data.data});
//	            	$.ajax({
//						url:"/equipment/list",	            		
//						async:false,
//						type:"POST",
//						success:function(dataHtml){
//							if(data){
//								$("#indexCommonView").html("").html(dataHtml);
//
//							}
//						}
//					});
//	            }
//			}
//		});
//	}
 

