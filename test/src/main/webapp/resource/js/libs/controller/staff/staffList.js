//查看
function view(id){
	$.ajax({
		url : "/staff/view",
		type : "POST",
		async : false,
		data:{'id':id},
		success : function(data){
			if (data) {
				$("#indexCommonView").html("").html(data);
			}
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
			url:"/staff/list",	            		
			async:false,
			type:"POST",
			data:{"query":queryText},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
	
	