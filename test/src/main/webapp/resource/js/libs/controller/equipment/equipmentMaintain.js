$(function() {
	
	/*上传附件*/        
	var uploadFile=function(fileId,queueID,selectid,type,buttonImg,isMultiImg,isCatalog,maxFileUpload,queueSizeLimit){
		//上传附件        	
		$('#'+fileId).uploadFile({
			buttonImg:buttonImg,
			queueID:queueID,
	        selectid:selectid,
	        targetType:type,
	        isMultiImg:isMultiImg,
	        isCatalog:isCatalog,
	        maxFileUpload:maxFileUpload,
	        queueSizeLimit:queueSizeLimit
		});
	};
	/* 调用上传附件 */		
	
	  $(".exist").each(function(i,d){
		 var queueID = $(this).find(".custom-queue").attr("id"),
		     targetType = $(this).closest(".files").attr("relType"),
		     selectid = $(this).find("select").attr("id"),
		     fileId = $(this).find("input").attr("id"),
		     buttonImg=$(this).attr("buttonImg"),
		     isMultiImg=$(this).attr("isMultiImg"),
		  	 isCatalog=$(this).attr("isCatalog"),
		 	 queueSizeLimit = 1,
		 	 maxFileUpload = 1;
		 	 //isMultiImg为true
			 if(isMultiImg=="true"){
				 isMultiImg=true;
				 queueSizeLimit =7;
				 maxFileUpload = 7;
			 }else{
				 isMultiImg=false;
			 }	
			 //isSingleImg为true,只允许上传一张图片
			 if(isCatalog=="true"){
				 isCatalog=true;
				 queueSizeLimit =1;
				 maxFileUpload = 7;
			 }else{
				 isCatalog=false;
			 }	
		   //调用上传附件
			uploadFile(fileId,queueID,selectid,targetType,buttonImg,isMultiImg,isCatalog,maxFileUpload,queueSizeLimit);					     						    	
	});
	/*end of 上传附件*/	
	if($("#equipmentId").val()!=null && $("#equipmentId").val()!=''){
	
	}else{
		var datess=new Date(); 
		$("#giveTime").val(datess.getFullYear()+"-"+(datess.getMonth()+1)+"-"+datess.getDate());
	}
	/*
	function uploadFile(fileId,queueID,selectid,type,buttonImg,fileExt,isCatalog,certificate){
    	//上传附件        	
		$('#'+fileId).uploadFile({
			buttonImg:buttonImg,
			fileExt:fileExt,
			queueID:queueID,
            selectid:selectid,
            targetType:type,
            isCatalog:isCatalog,
			isCertificate:certificate,
            maxFileUpload:5,
            //fileExt:'*.jpg;*.gif;*.png;*.jpeg;*.bmp',
            queueSizeLimit:1						
		});
}
		/* 上传附件 */		
	/*
  $(".exist").each(function(i,d){
		 var queueID = $(this).find(".custom-queue").attr("id"),
		     targetType = $(this).closest(".files").attr("relType"),
		     selectid = $(this).find("select").attr("id"),
		     fileId = $(this).find("input").attr("id"),
		     buttonImg=$(this).attr("buttonImg"),
		     fileExt=$(this).attr("fileExt"),
		     isCatalog=$(this).attr("isCatalog"),
		     certificate=$(this).attr("certificate");
		 	 //isCatalog为true,借用服务类目的功能
			 if(isCatalog=="true"){
				 isCatalog=true;
			 }else{
				 isCatalog=false;
			 }
			//certificate为true,借用服务类目的功能
			 if(certificate=="true"){
				 certificate=true;
			 }else{
				 certificate=false;
			 }
		   //调用上传附件
	       	uploadFile(fileId,queueID,selectid,targetType,buttonImg,fileExt,isCatalog,certificate);					     						    	
	});
	
	*/
	
	//autocomplete
	var tag=false;
	var isThisCity = 1;
	$("#idcard").blur(function(){
		//debugger;
		if($(this).hasClass("errorInput")){
			return;
		}
		if(!$("#equipmentId").val()){
			$.ajax({
				url: PATH+"/equipmentInfo/getByidcard",
				data:{"idcard":$("#idcard").val()},
				type:"POST",
				success: function(data) {
					if(data && data.ret && data.ret.data){
						var d = data.ret.data;
						var elderType=d.elderType;
						$("#elderType").val(elderType);
						$("#idCard").val(d.idcardNum);
						$("#deviceNo").val(d.signedNo);
						$("#name").val(d.name);
						$("#deviceSIM").val(d.contactPhone);
						if(d.birthday!=null){
							 $("#birthday").val(d.birthday.substring(0,10));
						   }
						$("#address").val(d.resideDistrict+""+d.resideTown+""+d.resideCommunity+""+d.resideAddress);
						$("#resideCityValue").val(d.resideCity);
						$("#resideDistrictValue").val(d.resideDistrict);
						$("#resideTownValue").val(d.resideTown);
						$("#resideCommunityValue").val(d.resideCommunity);
						$("#resideAddress").val(d.resideAddress);
//						$("#button1").val(d.button1);
//						$("#button1Name").val(d.button1Name);
//						$("#button1Relation").val(d.button1Relation);
//						$("#button3").val(d.button3);
//						$("#button3Name").val(d.button3Name);
//						$("#button3Relation").val(d.button3Relation);
//						$("#qrcodeNum").val(d.qrcode);
						$("#peopleId").val(d.id);
					}else{
						$("#theme").val("");
						$("#equipmentIdCard").val("");
						$("#name").val("");
						$("#addressDistrictValue").val("");
						$("#addressStreetValue").val("");
						$("#communityValue").val("");
						$("#resideAddress").val("");
						$("#button1").val("");
						$("#button1Name").val("");
						$("#button1Relation").val("");
						$("#button3").val("");
						$("#button3Name").val("");
						$("#button3Relation").val("");
						$("#qrcodeNum").val("");
						$("#equipmentInfoId").val("");
						$.messageBox({level:'error',message:data.ret.msg});
					}
				},
				error : function(){
					
				}
			})
		}
		
		
	})
//	$("#phoneNumber").blur(function(){
//		if($(this).hasClass("errorInput")){
//			return;
//		}
//		if(!$("#equipmentId").val() && $("#phoneNumber").val().length==11){
//			$.ajax({
//				url: PATH+"/equipmentInfo/getByPhoneNum",
//				data:{"phone":$("#phoneNumber").val()},
//				type:"POST",
//				success: function(data) {
//					if(data && data.ret && data.ret.data){
//						var d = data.ret.data;
//						$("#theme").val(d.equipmentNumber);
//						$("#equipmentIdCard").val(d.idcard);
//						$("#name").val(d.name);
//						$("#addressDistrictValue").val(d.resideDistrict);
//						$("#addressStreetValue").val(d.resideTown);
//						$("#communityValue").val(d.resideCommunity);
//						$("#resideAddress").val(d.resideAddress);
//						$("#button1").val(d.button1);
//						$("#button1Name").val(d.button1Name);
//						$("#button1Relation").val(d.button1Relation);
//						$("#button3").val(d.button3);
//						$("#button3Name").val(d.button3Name);
//						$("#button3Relation").val(d.button3Relation);
//						$("#qrcodeNum").val(d.qrcode);
//						$("#equipmentInfoId").val(d.id);
//					}else{
//						$("#theme").val("");
//						$("#equipmentIdCard").val("");
//						$("#name").val("");
//						$("#addressDistrictValue").val("");
//						$("#addressStreetValue").val("");
//						$("#communityValue").val("");
//						$("#resideAddress").val("");
//						$("#button1").val("");
//						$("#button1Name").val("");
//						$("#button1Relation").val("");
//						$("#button3").val("");
//						$("#button3Name").val("");
//						$("#button3Relation").val("");
//						$("#qrcodeNum").val("");
//						$("#equipmentInfoId").val("");
//					}
//				},
//				error : function(){
//					
//				}
//			})
//		}
//	})	 
     //解绑
	 $(".btnTable").on("click",".removeRelation",function(){
		 $(this).prev("span").addClass("hidden");
		 $(this).addClass("hidden");
		 $(this).closest("td").find("input").removeClass("hidden");
	 })
	//表单提交	
	$("#maintainForm").formValidate({
		submitHandler : function(form) {
			//debugger;
			var equipmentId = $("#equipmentId").val();
			var url_;
			if(tag){
				return false;
			}
			if(equipmentId != null && equipmentId != '' ){
				url_ = "/equipment/list";
			}else{
				url_ = "/equipment/list";
			}
			tag = true;
	    	$(form).ajaxSubmit({
				dataType: "json",
				success : function(data) {
					if(data && data.ret && data.ret.code ==200){
						$.messageBox({message:data.ret.data});
						$.ajax({
							url:url_,
							async:false,
							type:"POST",
							success:function(data){
								if(data){
									$("#indexCommonView").html("").html(data);
								}
							}
						});
					}else if(data && data.ret && data.ret.code ==500){
						$.messageBox({level:'warn',message:data.ret.msg});
					}else{
						
						$.messageBox({level:'error',message:'提交错误！'});
					}
					tag=false;
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					
					tag=false;
					$.messageBox({level:'error',message:'提交错误！'});		
				}
			});
		    
		},
		errorHandler : function() {
		}
	});
});