setTimeout(function(){
	
	//初始化户籍地
	threeSelect({
		province:'addressDistrict',
		city:'addressStreet',
		district:'community',
		provinceValue:$('#addressDistrictValue').val(),
		cityValue:$('#addressStreetValue').val(),
		districtValue:$('#communityValue').val()		
	});
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
	  
	//表单提交
	var tag=false;
	var flag=true;
    $("#addBtn").click(function(){
    	if(tag){return false;}
		tag = true;
    	$("#maintainForm").ajaxSubmit({
			dataType: "json",
			data:$("#maintainForm").serialize(),
			success : function(data) {
				$.ajax({
					url:"/activity/list",	            		
					async:false,
					type:"POST",
					success:function(data){
						if(data){
							$("#indexCommonView").html("").html(data);
						}
					}
				});
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				tag=false;
				$.messageBox({level:'error',message:'提交错误!'});
			}
		});
    })
    
    $("#releaseBtn").click(function(){
//		addCity(id);
    	$("#maintainForm").submit();
    })
    
	$("#maintainForm").formValidate({
		submitHandler : function(form) {
		    var defaultImg = $("#queue_themeLogos .defaultImg");
		    var preDate=$("#preDate").val();
		    var endDate=$("#endDate").val();
		    if(flag){
		    	if(defaultImg.length == 1){
			    	$.messageBox({level:'warn',message:'请上传主题图片'});
			    	return;
			    }
		    	if(preDate==''){
		    		$.messageBox({level:'warn',message:'请填写开始时间'});
			    	return;
		    	}
		    	if(endDate==''){
		    		$.messageBox({level:'warn',message:'请填写结束时间'});
			    	return;
		    	}
		    }
		    $("#releaseStatus").val(1);
			if(tag){return false;}
			tag = true;
	    	$(form).ajaxSubmit({
				dataType: "json",
				success : function(data) {
					$.ajax({
						url:"/activity/list",	            		
						async:false,
						type:"POST",
						success:function(data){
							if(data){
								$("#indexCommonView").html("").html(data);
							}
						}
					});
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					tag=false;
					$.messageBox({level:'error',message:'提交错误!'});
				}
			});
		    
		},
		errorHandler : function() {
		}
	});
},100)
	