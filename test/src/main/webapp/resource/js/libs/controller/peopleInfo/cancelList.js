
function search(){
	var queryText = $("#queryText").val().trim();
	var submitData={
			"queryText":queryText,
			"queryAge":$("#queryAge").val(),
			"startAge":$("#startAge").val(),
			"endAge":$("#endAge").val(),
	};
	queryPage(submitData);
}

function removeCancel(id){
	$.confirm({
        title:"确认",
        message:"确定该用户取消注销",
        width: 300,
        okFunc: function(){
			$.ajax({
				type : 'post',
				url : '/peopleInfo/cancel/remove',
				data : {
					'id' : id,
				},
				dataType: "json",
				success : function(data) {
					if(data.code==200){
						$.messageBox({message:"取消注销成功"});
					}else{
						$.messageBox({message:"取消注销失败",level:"error"});
					}
					queryPage();
				}
			});
        }
	});
}

function refresh(){
	queryPage();
}

function queryPage(submitData){
	$.ajax({
		url:"/peopleInfo/cancel/list/view",	            		
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