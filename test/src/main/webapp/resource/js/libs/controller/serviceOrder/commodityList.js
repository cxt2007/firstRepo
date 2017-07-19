//threeSelect({
//	    province:'city',
//	    provinceValue:$('#provinceValue').val()
//	});
oldThreeSelect({
    province:'city',
    provinceValue:$('#provinceValue').val()
});

	//城市切换
$("#city").change(function(){
	var city = $("#city").find("option:selected").attr("value")||'';
	var state = $("#state").find("option:selected").attr("value")||'';
	var source = $("#source").find("option:selected").attr("value")||'';
	$.ajax({
		url:"/serviceOrder/commodityList",	            		
		async:false,
		type:"POST",
		data:{"city":city,"state":state,"source":source},
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
				$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
				$("#state").val($("#stateValue").val()?$("#stateValue").val():null);
				$("#source").val($("#sourceValue").val()?$("#sourceValue").val():null);
			}
		}
	});

});

//来源切换
$("#source").change(function(){
	var city = $("#city").find("option:selected").attr("value")||'';
	var state = $("#state").find("option:selected").attr("value")||'';
	var source = $("#source").find("option:selected").attr("value")||'';
	$.ajax({
		url:"/serviceOrder/commodityList",	            		
		async:false,
		type:"POST",
		data:{"city":city,"state":state,"source":source},
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
				$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
				$("#state").val($("#stateValue").val()?$("#stateValue").val():null);
				$("#source").val($("#sourceValue").val()?$("#sourceValue").val():null);
			}
		}
	});

});

//状态切换
$("#state").change(function(){
	var city = $("#city").find("option:selected").attr("value")||'';
	var state = $("#state").find("option:selected").attr("value")||'';
	var source = $("#source").find("option:selected").attr("value")||'';
	$.ajax({
		url:"/serviceOrder/commodityList",	            		
		async:false,
		type:"POST",
		data:{"city":city,"state":state,"source":source},
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
				$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
				$("#state").val($("#stateValue").val()?$("#stateValue").val():null);
				$("#source").val($("#sourceValue").val()?$("#sourceValue").val():null);
			}
		}
	});

});





function searchButton(){
	var query = $("#query").val().trim();
	var city = $("#city").find("option:selected").attr("value")||'';
	var state = $("#state").find("option:selected").attr("value")||'';
	var source = $("#source").find("option:selected").attr("value")||'';
	if($("#query").val()==$("#query").attr("placeholder")){
		query="";
		return;
	}
	$.ajax({
		url:"/serviceOrder/commodityList",	            		
		async:false,
		type:"POST",
		data:{"query":query,"city":city,"state":state,"source":source},
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
				$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
				$("#state").val($("#stateValue").val()?$("#stateValue").val():null);
				$("#source").val($("#sourceValue").val()?$("#sourceValue").val():null);
			
			}
		}
	});

		
//		var query = $("#query").val();
//		if($("#query").val()==$("#query").attr("placeholder")){
//			query="";
//			return;
//		}
//		$.ajax({
//			url:"/serviceOrder/commodityList?query="+encodeURIComponent(query),	            		
//			async:false,
//			type:"POST",
//			success:function(data){
//				if(data){
//					$("#indexCommonView").html("").html(data);
//	
//				}
//			}
//		});
	}


	function view(id){
		$.ajax({
			url:"/serviceOrder/view?id="+encodeURIComponent(id),	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
