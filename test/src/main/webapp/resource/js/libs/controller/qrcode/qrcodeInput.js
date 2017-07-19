/*	$(function(){
	//	debugger
		getQrcodeCity();
	})
	
	function getQrcodeCity(){
		
		$.ajax({
				type:'post',
				url:'/org/getHZOrgListById',
				dataType:'json',
				async:false,
				success:function(data){
					var provinceData = data.organizationList;
					$("#qrcodeCity").append("<option id='' value=''>"+"请选择"+"</option>");
					for(i=0;i<provinceData.length;i++){
						$("#qrcodeCity").append("<option id='"+ provinceData[i].id +"' value='"+provinceData[i].orgName+"'>"+provinceData[i].orgName+"</option>");
					}											
				}
			});
	}
	*/