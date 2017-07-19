$(function() {
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
            maxFileUpload:10,
            //fileExt:'*.jpg;*.gif;*.png;*.jpeg;*.bmp',
            queueSizeLimit:1						
		});
}
		/* 上传附件 */				
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
  
	threeSelect({
		province:'addressDistrict',
		city:'addressStreet',
		district:'community',
		firstId:'D0D800463CF34730BFF62235FE37C2A1',
		provinceValue:$('#addressDistrictValue').val(),
		cityValue:$('#addressStreetValue').val(),
		districtValue:$('#communityValue').val()		
	});
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
				if(data.code ==200){
					$.messageBox({message:'保存成功'});
					$.ajax({
						url:"/equipmentInfo/list",	            		
						async:false,
						type:"POST",
						success:function(data){
							if(data){
								$("#indexCommonView").html("").html(data);
							}
						}
					});
				}else if(data && data.code ==500){
					$.messageBox({level:'warn',message:data.msg});
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


}
);