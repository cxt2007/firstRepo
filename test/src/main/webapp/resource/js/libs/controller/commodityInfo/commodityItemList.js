	threeSelect({
	    		province:'city',
	    		provinceValue:$('#provinceValue').val()
	});



//搜索
	function search(query){
		var queryText = $("#query").val().trim();
		var city = $("#city").find("option:selected").attr("value")||'';
		var commodityClass = $("#commodityClass").find("option:selected").attr("value")||'';
		if($("#query").val()==$("#query").attr("placeholder")){
			queryText="";
			return;
		}
		$.ajax({
			url:"/commodity/list",	            		
			async:false,
			type:"POST",
			data:{"city":city,"commodityClass":commodityClass,"queryText":queryText,"types":"1"},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
					$("#commodityClass").val($("#commodityValue").val()?$("#commodityValue").val():null);
				}
			}
		});
	}
	


	//getCity();
	//选择城市
	$("#city").change(function(){
		var city = $("#city").find("option:selected").attr("value")||'';
		var commodityClass = $("#commodityClass").find("option:selected").attr("value")||'';
		$.ajax({
			url:"/commodity/list",	            		
			async:false,
			type:"POST",
			data:{"city":city,"commodityClass":commodityClass,"types":"1"},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
					$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
					$("#commodityClass").val($("#commodityValue").val()?$("#commodityValue").val():null);
				}
			}
		});
	
	});
	/*
	function getCity(){
		$.ajax({
				type:'post',
				url:'/org/getOrgListById',
				dataType:'json',
				async:false,
				success:function(data){
					var provinceData = data.organizationList;
					$("#city").append("<option id=' ' value=' '>"+"请选择"+"</option>");
					for(i=0;i<provinceData.length;i++){
						$("#city").append("<option id='"+ provinceData[i].id +"' value='"+provinceData[i].orgName+"'>"+provinceData[i].orgName+"</option>");
					}											
					if($("#city"+" option").size()>1){
						$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
					}
				}
			});
	}
	*/	
	//用品
	$("#commodityClass").change(function(){
		var city = $("#city").find("option:selected").attr("value")||'';
		var commodityClass = $("#commodityClass").find("option:selected").attr("value")||'';
		$.ajax({
			url:"/commodity/list",	            		
			async:false,
			type:"POST",
			data:{"commodityClass":commodityClass,"city":city,"types":"1"},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
					$("#commodityClass").val($("#commodityValue").val()?$("#commodityValue").val():null);
					$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
				}
			}
		});
	});
	
	//置顶
	function topList(id) {
		var city = $("#city").find("option:selected").attr("value")||'';
		var commodityClass = $("#commodityClass").find("option:selected").attr("value")||'';
		$.ajax({
				type : 'POST',
				url : '/commodity/top',
				async:false,
				data : {'id' : id},
				success : function(data) {
					if(data.code==200){
						$.messageBox({message:"置顶成功"});	
						$.ajax({
							url:"/commodity/list",	            		
							async:false,
							type:"POST",
							data:{"types":"1","city":city,"commodityClass":commodityClass},
							success:function(data){
								if(data){
									$("#indexCommonView").html("").html(data);
								}
							}
						});
					} else {
						$.messageBox({message:"置顶失败！",level:"warn"});
					}
				}
		});
	}
	