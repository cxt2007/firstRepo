//function aaa(){
//	$("#orderTrackingDialog").dialog('close');
//}
//详情
function view(id){
	$.ajax({
		url:"/peopleInfo/details",	            		
		async:false,
		type:"POST",
		data:{"id":id},
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
			}
		}
	});
}


////新增月计划
//function add(){
//	$("#orderTrackingDialog").createDialog({
//		width:900,
//		height:600,
//		position:'top',
//		title:'',
//		url:'/carePeopleInfo/add?types=2',
////		buttons:{
////			"关闭":function(){
////				$(this).dialog('close');	
////			}
////		}
//	});
//}



////跳转新增页
//function addPlan(){
//	$.ajax({
//		url:"/carePeopleInfo/add",	            		
//		async:false,
//		type:"POST",
//		success:function(data){
//			if(data){
//				$("#indexCommonView").html("").html(data);
//			}
//		}
//	});
//}

////月关怀跳转详情页
//function viewList(){
//	$.ajax({
//		url:"/carePeopleInfo/toView",	            		
//		async:false,
//		type:"POST",
//		success:function(data){
//			if(data){
//				$("#indexCommonView").html("").html(data);
//			}
//		}
//	});
//}
////获取老人关怀数据
//function addPeoplePlan(){
//	var month = $("#month").find("option:selected").attr("value")||'';
//	var year = $("#year").find("option:selected").attr("value")||'';
//	$.ajax({
//		url:"/carePeopleInfo/addPeopleInfo",	            		
//		async:true,
//		data:{
//			"month":month,
//			"year":year
//		},
//		type:"POST",
//		success:function(data){
//			if(data){
//				$.ajax({
//					url:"/carePeopleInfo/addinfo",	            		
//					async:false,
//					data:{
//						"month":month,
//						"year":year,
//						"types":2
//					},
//					type:"POST",
//					success:function(data){
//						if(data){
//							$("#peopleCommonView").html("").html(data);
//						}
//					}
//				});
//			}
//		}
//	});
//}
//$("#saveSubmitBtn").click(function(){
//	var month = $("#month").find("option:selected").attr("value")||'';
//	var year = $("#year").find("option:selected").attr("value")||'';
//	var ids = document.getElementsByName('ids');
//	var hides = new Array();
//	for(var i=0;i<ids.length;i++){
//	   hides.push(ids[i].value);
//	}
//	$.ajax({
//		url:"/carePeopleInfo/updateType?ids="+hides,	            		
//		async:false,
//		type:"POST",
//		success:function(data){
//			if(data){
//				$.ajax({
//					url:"/carePeopleInfo/add",	            		
//					async:false,
//					data:{
//						"month":month,
//						"year":year
//					},
//					type:"POST",
//					success:function(data){
//						if(data){
//							$("#indexCommonView").html("").html(data);
//						}
//					}
//				});
//			}
//		}
//	});
//})
//取消关怀
//$("#cancleSubmitBtn").click(function(){
//	var month = $("#month").find("option:selected").attr("value")||'';
//	var year = $("#year").find("option:selected").attr("value")||'';
//	var ids = document.getElementsByName('ids');
//	var hides = new Array();
//	for(var i=0;i<ids.length;i++){
//	   hides.push(ids[i].value);
//	}
//	$.ajax({
//		url:"/carePeopleInfo/deleteInfo?ids="+hides,	            		
//		async:false,
//		type:"POST",
//		success:function(data){
//			if(data){
//				$.ajax({
//					url:"/carePeopleInfo/add",	            		
//					async:false,
//					data:{
//						"month":month,
//						"year":year
//					},
//					type:"POST",
//					success:function(data){
//						if(data){
//							$("#indexCommonView").html("").html(data);
//						}
//					}
//				});
//			}
//		}
//	});
//})

//跳转新增Y一个老人的页面
//function addOnePeople(){
//	$('#messageDialog').createDialog({
//		width:540,
//		height:380,
//		title:'新增',
//		url:'/carePeopleInfo/toAdd',
//		buttons:{
//			'确定':function(){
//				$(this).dialog("close");
//			},
//			'取消':function(){
//				$(this).dialog("close");
//			}
//		}
//	});
//}
//关怀计划跳转详情页
//function viewCarePlan(){
//	$.ajax({
//		url:"/carePeopleInfo/toCarePlanView",	            		
//		async:false,
//		type:"POST",
//		success:function(data){
//			if(data){
//				$("#indexCommonView").html("").html(data);
//			}
//		}
//	});
//}
/**
 * 关怀列表搜索
 * @param query
 */
function searchCareList(query){
	var queryText = $("#query").val().trim();
	if($("#query").val()==$("#query").attr("placeholder")){
		queryText="";
		return;
	}
	$.ajax({
		url:"/carePeopleInfo/careList",	            		
		async:false,
		type:"POST",
		data:{"queryText":queryText},
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
				$("#commodityClass").val($("#commodityValue").val()?$("#commodityValue").val():null);
			}
		}
	});
}
	/**
	 * 新增关怀
	 */
	//$("#showExchange").click(function(){
		function carePlan(peopleId){
			$("#exchangeDialog").createDialog({
				width: 620,
				height: 400,
				title: '新增关怀',
				position: { using:function(pos){  
			        var topOffset = $(this).css(pos).offset().top;  
			        if (topOffset = 0||topOffset>0) {  
			            $(this).css('top', 20);  
			        }  
			    }}, 
				url: '/careRecord/getByPeopleId?peopleId='+ peopleId,
				buttons: {
					"保存": function() {
						$("#maintainForm").submit();
					},
					"关闭": function() {
						$(this).dialog("close");
					}
				}
			});
}