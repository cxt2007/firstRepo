//连续关机时间
$("#offDay").change(function(){
	refresh();
});

//刷新
function refresh(){
	var offDay;
	if(airNull($("#offDay").val())){
		offDay = $("#offDay").val();
	}
	$.ajax({
		url:"/equipmentWarnLog/list",	            		
		async:false,
		type:"POST",
		data:{"offDay":offDay},
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
			}
		}
	});
}

//判断空
function airNull(str){
	if(typeof(str) != "undefined" && str!='' && str!=null){
		return true;
	}
	return false;
}