$(function() {	
	$(".activeDescription").on('click','.expand',function(){
		$('.descriptionMod').css({overflow:'auto',height:'auto'});
		$(this).text("收起 ↑").removeClass("expand").addClass('collapse');
	});
	
	$(".activeDescription").on('click','.collapse',function(){
		$('.descriptionMod').css({overflow:'hidden',height:'150px'});
		$(this).text("展开 ↓").removeClass("collapse").addClass('expand');
	});
	/*上传附件*/        
	var uploadFile=function(fileId,queueID,selectid,type,buttonImg,isMultiImg){
		//上传附件        	
		$('#'+fileId).uploadFile({
			buttonImg:buttonImg,						
			queueID:queueID,
	        selectid:selectid,
	        targetType:type,
	        isMultiImg:isMultiImg,			
	        maxFileUpload:9,
	        queueSizeLimit:9						
		});
	}
	/* 调用上传附件 */				
	  $(".exist").each(function(i,d){
		 var queueID = $(this).find(".custom-queue").attr("id"),
		     targetType = $(this).closest(".files").attr("relType"),
		     selectid = $(this).find("select").attr("id"),
		     fileId = $(this).find("input").attr("id"),
		     buttonImg=$(this).attr("buttonImg"),
		     isMultiImg=$(this).attr("isMultiImg");
		 	 //isMultiImg为true,借用服务类目的功能
			 if(isMultiImg=="true"){
				 isMultiImg=true;
			 }else{
				 isMultiImg=false;
			 }			
		   //调用上传附件
	       	uploadFile(fileId,queueID,selectid,targetType,buttonImg,isMultiImg);					     						    	
	});	
	/*end of 上传附件*/      
	
	//表单提交
	var tag=false;
	$("#maintainForm").formValidate({
		submitHandler : function(form) {
			if(tag){
				 return false;
			 }
			 tag = true;
			$(form).ajaxSubmit({
				dataType: "json",
				success : function(data) {
					// alert("保存成功!");
					location.href = "/activity/list";
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					tag=false;
					alert("提交错误!");
				}
			});
		},
		errorHandler : function() {
		}
	});
});