threeSelect({
    		province:'city',
    		city:'district',
    		district:'town',
    		provinceValue:$('#provinceValue').val(),
    		cityValue:$('#cityValue').val(),
    		districtValue:$('#districtValue').val()
});
$(function(){
	//表单提交
	var tag=false;
	$("#addBtn").click(function(){
		$("#maintainForm").submit();
	});
	
	$("#maintainForm").formValidate({
		submitHandler : function(form) {
			var nameValue=$("#name").val();
			var idcardValue=$("#idcard").val();
			var phoneValue=$("#phone").val();
			var subsidytypeValue=$("#subsidytype").val();
			var servicemerchantsValue=$("#servicemerchants").val();
			var servicetimesValue=$("#servicetimes").val();
			if((null==nameValue || ""==nameValue)&&(null==idcardValue || ""==idcardValue)&&(null==phoneValue || ""==phoneValue)
			   &&(null==subsidytypeValue || ""==subsidytypeValue)&&(null==servicemerchantsValue || ""==servicemerchantsValue)	
				&&(null==servicetimesValue || ""==servicetimesValue)){
				$.messageBox({message:"不能为空！",level: "warn"});
				return false;
			}
			if(tag){return false}
			tag=true;
			$(form).ajaxSubmit({
				success : function(data) {
					if(data.code==200){
						$.ajax({
							url:"/subsidy/list",	            		
							async:false,
							type:"POST",
							success:function(data){
								if(data){
									$("#indexCommonView").html("").html(data);

								}
							}
						});
					}else{
						tag=false;
						$.messageBox({message:data.msg,level: "warn"});
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					tag=false;
					$.messageBox({message:"提交失败",level: "warn"});
				}
			});
			
		},
		errorHandler : function() {
		}
	});
	
	
	
//	
//	//用姓名 进行身份证，电话联想
//	$('.subsidyPeople').on('blur','#name',function(e){
//		var nameValue = $('#name').val();
//		if(!nameValue){
//			$("#idcard").val("");
//			$("#phone").val("");
//			$("#city").val("");
//			$("#district").val("");
//			$("#town").val("");
//			$("#address").val("");
//			$.messageBox({message:"姓名必须输入！",level: "warn"});
//		}else{
//			$.ajax({
//	    		url:'/subsidy/getInfo',
//	    		async:false,
//	    		type:"POST",
//	    		data:{'name':nameValue},
//	    		success:function(data){
//	    			var data = data.lstPeopleInfo;			
//	    			var LI ='';
//	    			for(var i = 0;i<data.length;i++){
//	    				//if(data[i].gender==null ||data[i].gender=='null' || data[i].gender=="" ){
//	    					//LI+="<li><span>"+data[i].name+","+data[i].idcardNum+","+data[i].resideDistrict+"-"+data[i].resideTown+"-"+data[i].residentialAdress+
//							//"</span><span class='hidden'>"+data[i].contactPhone+","+data[i].isThisCity+","+data[i].id+"</span></li>"
//	    				if(data[i].isThisCity==1){
//	    					LI+="<li><span>"+data[i].name+","+data[i].idcardNum+","+data[i].resideDistrict+"-"+data[i].resideTown+"-"+data[i].resideCommunity+"-"+data[i].residentialAdress+
//							"</span><span class='hidden'>"+data[i].contactPhone+","+data[i].isThisCity+","+data[i].id+","+" "+"</span></li>"
//	    				}else{
//	    					LI+="<li><span>"+data[i].name+","+data[i].idcardNum+","+data[i].residentialAdress+
//							"</span><span class='hidden'>"+data[i].contactPhone+","+data[i].isThisCity+","+data[i].id+","+" "+"</span></li>"
//	    				}
//	    				//}else{
//	    				
////	    					$.ajax({
////	    						url:"/subsidy/getDictById",
////	    						async:false,
////	    						type:"POST",
////	    						data:{'id':data[i].gender},
////	    						success:function(data2){
////	    							if(data2 != null && data2.dicts != null){
////	    								var gender = data2.dicts.name;
////	    								LI+="<li><span>"+data[i].name+","+gender+","+data[i].idcardNum+","+data[i].resideDistrict+"-"+data[i].resideTown+"-"+data[i].resideCommunity+"-"+data[i].residentialAdress+
////	    								"</span><span class='hidden'>"+data[i].contactPhone+","+data[i].isThisCity+","+data[i].id+","+gender+"</span></li>"
////	    							}
////	    						}
////	    					});
////	    				}
//	    			}
//	    			$('.serviceTipDialog ul').html(LI);
//					$('.serviceTipDialog').show();
//					$('.serviceTipDialog ul').on('click','li',function(){
//						var liData =$(this).find('span').eq(0).html().split(',');
//						var liData2 =$(this).find('span').eq(1).html().split(',');
//						var dict = liData[2].split('-');
////						if(liData[1]==null ||liData[1]=='null' || liData[1]==""){
////							$("#sex").val('');
////						}else{
////							$("#sex").val(liData[1]);
////						}
//						$('#peopleId').val(liData2[2]);
//						$("#idcard").val(liData[1]);
//						$('#name').val(liData[0]);
//						if(liData2[0]==null ||liData2[0]=='null' || liData2[0]==""){
//							$('#phone').val("");
//						}else{
//							$('#phone').val(liData2[0]);
//						}			
//						if(liData2[1]==1){
//							$('#address').val(dict[3]);				
//							$('#city').val($('#otherCityValue').val());
//							$('#city').change();
//							$('#district').val(dict[0]);
//							$('#district').change();
//							$('#town').val(dict[1]);
//							$('#town').change();
//						}else if(liData2[1]==0){
//							$('#address').val(dict[0]);
//						}
//							
////						$('#address').val(dict[3]);				
////						$('#city').val($('#otherCityValue').val());
////						$('#city').change();
////						$('#district').val(dict[0]);
////						$('#district').change();
////						$('#town').val(dict[1]);
////						$('#town').change();				
//					});
//	    		}
//			});
//		}
//		hideBox();
//	});
//	
//	function hideBox(){
//		setTimeout(function(){
//			$("body").one("click",function(){
//				if($(".serviceTipDialog").is(':visible')){
//					$(".serviceTipDialog").hide().find("li").remove();
//				}
//				if( $(".tipDialog").is(':visible') ){
//					$(".tipDialog").hide().find("tbody tr").remove();
//				}
//			})
//		},100)
//	};
	
  //获得商家信息
  $('#servicemerchants').keyup(function(){
		var servicemerchantsValue = $('#servicemerchants').val();
		if(!servicemerchantsValue){
			$.messageBox({message:"不能为空！",level: "warn"});
		}else{
			$.ajax({
	    		url:'/subsidy/getMerchantsId',
	    		async:false,
	    		type:"POST",
	    		data:{'servicemerchants':servicemerchantsValue},
	    		success:function(data){
	    			var data = data.MerchantsInfo;			
	    			var LI ='';
	    			for(var i = 0;i<data.length;i++){
	    				if(data[i].name==null ||data[i].name=='null' || data[i].name=="" ){
	    					$.messageBox({message:"没有该机构！",level: "warn"});
//	    					LI+="<li><span>"+data[i].name+","+data[i].orgId+
//							"</span><span class='hidden'>"+data[i].name+","+data[i].orgId+"</span></li>"
	    				}else{
	    					LI+="<li><span>"+data[i].name+
							"</span><span class='hidden'>"+data[i].name+","+data[i].id+"</span></li>"
	    				}
	    			}
	    			$('.serviceTip ul').html(LI);
					$('.serviceTip').show();
					$('.serviceTip ul').on('click','li',function(){
						var liData =$(this).find('span').eq(0).html().split(',');
						var liData2 =$(this).find('span').eq(1).html().split(',');
						if(liData[0]==null ||liData[0]=='null' || liData[0]==""){
							$('#servicemerchants').val("");
						}else{
							$('#servicemerchants').val(liData[0]);
						}
						$('#merchantsId').val(liData2[1]);
					});
		        }
		
			});
	
		}
		hideBox2();
	});
  function hideBox2(){
		setTimeout(function(){
			$("body").one("click",function(){
				if($(".serviceTip").is(':visible')){
					$(".serviceTip").hide().find("li").remove();
				}
			})
		},100)
	};
})
	