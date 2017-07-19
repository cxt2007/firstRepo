$(function(){
	$("#queryAge").change(function(){
		$("#startAge").val("");
		$("#endAge").val("");
		search();
	});
	$("#queryIsContract").change(function(){
		search();
	});
	
//	$("#selectAll").change(function(){
//		if($(this).attr("checked")){
//			$("input[name='selectids']").each(function(){
//				$(this).attr("checked",true);
//			});
//		}else{
//			$("input[name='selectids']").each(function(){
//				$(this).attr("checked",false);
//			});
//		}
//	});
});




function addNew(){
	$.ajax({
		url:"/peopleInfo/add/view",	            		
		async:false,
		type:"POST",
		data:{},
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
			}
		}
	});
}


function viewDetail(id){
	$.ajax({
		url:"/peopleInfo/detailsTab",	            		
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

function search(){
	var queryText = $("#queryText").val().trim();
	var queryAge=$("#queryAge").val();
	var startAge=$("#startAge").val();
	var endAge=$("#endAge").val();
	if(startAge!="" || endAge!=""){
		queryAge="";
	}
	var queryIsContract=$("#queryIsContract").val();
	var submitData={
			"queryText":queryText,
			"queryAge":queryAge,
			"startAge":startAge,
			"endAge":endAge,
			"queryIsContract":queryIsContract
	};
	queryPage(submitData);
}

function edit(id){
	$.ajax({
		url:"/peopleInfo/edit/view",	            		
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

function del(id){
	$.confirm({
        title:"确认",
        message:"删除后不能还原，是否确定要删除？",
        width: 300,
        okFunc: function(){
			$.ajax({
				type : 'post',
				url : '/peopleInfo/del',
				data : {
					'id' : id,
				},
				dataType: "json",
				success : function(data) {
					queryPage();
				}
			});
        }
	});
}


//function cancel(id){
//	$("#messageDialog").createDialog({
//		width:400,
//		height:600,
//		title:'注销',
//		url:'/peopleInfo/cancel?id='+id,
//		buttons: {
//		  "确认注销" : function(event){
//			  $("#cancelForm").submit();
//		   },
//			"取消":function(event){
//				$("#messageDialog").dialog("close");
//		   }
//		}
//	});
//}

//注销
function cancel(id){
		$("#messageDialog").createDialog({
     		width: 550,
			height: 370,
			title:'注销',
			url:'/peopleInfo/cancel',
			buttons: {
				"确定注销" : function(event){
					var cancelReason = $("#cancelReason").val();
					$.ajax({
						url:"/peopleInfo/cancelDel",
						data:{
							'cancelReason':cancelReason,
							'id':id
						},
						async:false,
						type:"POST",		
						success:function(data){
							if (data) {
								if(data.ret!=null && data.ret.code==200){
									$.messageBox({message : '注销成功！'});
									$("#messageDialog").dialog("close");
									$.ajax({
										url:"/peopleInfo/list/view",	            		
										async:false,
										type:"POST",
										success:function(data){
											if(data){
												$("#indexCommonView").html("").html(data);
											}
										}
									});
								}else if(data.ret!=null && data.ret.code==500){
									$.messageBox({message : data.ret.msg,level : "warn"});
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




function move(id){
	$("#exportDatas").createDialog({
		width: 450,
		height: 400,
		title:'数据迁移',
		url:'/peopleInfo/remove?ids='+id,
		buttons: {
		  "确认" : function(event){
			  remove();
		   },
			"取消":function(event){
				$("#exportDatas").dialog("close");
//				$("#oldMenTable").trigger("reloadGrid");
		   }
		}
	});
	$("#exportDatas").css({'minHeight':'41px',height:'auto','paddingBottom':'0'});
}

function refresh(){
	queryPage();
}

function queryPage(submitData){
	$.ajax({
		url:"/peopleInfo/list/view",	            		
		async:false,
		type:"POST",
		data:submitData,
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
			}
		}
	});
}

//同步监管数据
$("#isSynchronous").click(function () {
    $.messageBox({level:"success",message:"同步中...,请稍后查看"})
    $("#isSynchronous").attr("disabled","true");
    isSynchronous();
})
function isSynchronous(){
    $("#isSynchronous").attr("style","background: #ccc");

	$.ajax({
		url:"/peopleInfo/isSynchronous",
		async:true,
		type:"Post",
		success:function(data){
			if(data.ret.code==200){
                $("#isSynchronous").removeAttrs("disabled");
                $("#isSynchronous").css({"background":""});
			$.messageBox({level:"success",message:data.ret.data})
			$.ajax({
				url:"/peopleInfo/list",	            		
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
}