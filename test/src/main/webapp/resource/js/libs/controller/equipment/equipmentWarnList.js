//类型
$("#type").change(function(){
	search();
});

//搜索
function search(){
	var warnType;
	var startTime;
	var endTime;
	if(airNull($("#type").val())){
		warnType = $("#type").val();
	}
	if(airNull($("#startTime").val())){
		startTime = $("#startTime").val();
	}
	if(airNull($("#endTime").val())){
		endTime = $("#endTime").val();
	}
	$.ajax({
		url:"/equipmentWarn/equipmentWarnList",	            		
		async:false,
		type:"POST",
		data:{"warnType":warnType,"startTime":startTime,"endTime":endTime},
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

$(function(){
	//new tabFun("#tabTable .tableTit li","#tabTable .tabCont .tableMod")
	
	$('#startTime').datePicker({		 
		  dateFormat: "yy-mm-dd",
		  showClearButton:false, 
		  onSelect:function(selectedDate){         	
	  }
	});
	
	$('#endTime').datePicker({		 
		  dateFormat: "yy-mm-dd",
		  showClearButton:false, 
		  onSelect:function(selectedDate){         	
	  }
	}); 
})