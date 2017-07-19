//	threeSelect({
//	    province:'city',
//	    provinceValue:$('#provinceValue').val()
//	});
	
	//获得服务类目
	getCategory();
	
	
	function getCategory(){
		$.ajax({
				type:'post',
				url:'/serviceItem/category',
				//dataType:'json',
				async:false,
				success:function(data){
					var serviceCategoryData = data.serviceCategoryList;
					$("#categoryId").append("<option id='' value=''>"+"请选择"+"</option>");
					for(i=0;i<serviceCategoryData.length;i++){
						$("#categoryId").append("<option id='"+ serviceCategoryData[i].id +"' value='"+serviceCategoryData[i].id+"'>"+serviceCategoryData[i].name+"</option>");
					}											
					if($("#categoryId"+" option").size()>1){
						$("#categoryId").val($("#categoryValue").val()?$("#categoryValue").val():null);
					}
				}
			});
	}
	
	
	
	
	
	
	
	
	//搜索
	function search(query){
		var query = $("#query").val().trim();
		var city = $("#city").find("option:selected").attr("value")||'';
		var categoryId = $("#categoryId").find("option:selected").attr("value")||'';
		if($("#query").val()==$("#query").attr("placeholder")){
			queryText="";
			return;
		}
		$.ajax({
			url:"/serviceItem/list",	            		
			async:false,
			type:"POST",
			data:{"city":city,"categoryId":categoryId,"query":query,"types":"1"},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
					$("#categoryId").val($("#categoryValue").val()?$("#categoryValue").val():null);
					$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
				}
			}
		});
	}
	


	getCity();
	//选择城市
	$("#city").change(function(){
		var city = $("#city").find("option:selected").attr("value")||'';
		var cityId = $("#city").find("option:selected").attr("id")||'';
		var categoryId = $("#categoryId").find("option:selected").attr("value")||'';
		$.ajax({
			url:"/serviceItem/list",	            		
			async:false,
			type:"POST",
			data:{"city":city,"cityId":cityId,"categoryId":categoryId,"types":"1"},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
					$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
					$("#categoryId").val($("#categoryValue").val()?$("#categoryValue").val():null);
				}
			}
		});
	
	});
	
	function getCity(){
		$.ajax({
				type:'post',
				url:'/org/getHZOrgListById',
				dataType:'json',
				async:false,
				success:function(data){
					var provinceData = data.organizationList;
					$("#city").empty();
					$("#city").append("<option id='' value=''>"+"请选择"+"</option>");
					for(i=0;i<provinceData.length;i++){
						$("#city").append("<option id='"+ provinceData[i].id +"' value='"+provinceData[i].id+"'>"+provinceData[i].orgName+"</option>");
					}											
					if($("#city"+" option").size()>1){
						$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
					}
				}
			});
	}
	
	//
	$("#categoryId").change(function(){
		var city = $("#city").find("option:selected").attr("value")||'';
		var categoryId = $("#categoryId").find("option:selected").attr("value")||'';
		var cityId = $("#city").find("option:selected").attr("id")||'';
		$.ajax({
			url:"/serviceItem/list",	            		
			async:false,
			type:"POST",
			data:{"categoryId":categoryId,"city":city,"cityId":cityId,"types":"1"},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
					$("#categoryId").val($("#categoryValue").val()?$("#categoryValue").val():null);
					$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
				}
			}
		});
	});
	
	//置顶
	function topList(id) {
		var city = $("#city").find("option:selected").attr("value")||'';
		var categoryId = $("#categoryId").find("option:selected").attr("value")||'';
		$.ajax({
				type : 'POST',
				url : '/serviceItem/top',
				async:false,
				data : {'id' : id},
				success : function(data) {
					if(data.code==200){
						$.messageBox({message:"置顶成功"});	
						$.ajax({
							url:"/serviceItem/list",	            		
							async:false,
							type:"POST",
							data:{"types":"1","city":city,"categoryId":categoryId},
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
	