$(function() {
	/*上传附件*/   
	setTimeout(function(){
	var uploadFile=function(obj){
		//上传附件        	
		$('#'+obj.fileId).uploadFile({
			buttonImg:obj.buttonImg,						
			queueID:obj.queueID,
	        selectid:obj.selectid,
	        targetType:obj.targetType,
	        isAdvertisement:obj.isAdvertisement,
	        isMultiImg:obj.isMultiImg,
	        isCatalog:obj.isCatalog,
	        advertisementUrl:obj.url,
	        maxFileUpload:obj.maxFileUpload,
	        queueSizeLimit:obj.queueSizeLimit						
		});
	}
	/* 调用上传附件 */		
	
	  $(".exist").each(function(i,d){
		var uploadObj={};
			uploadObj.queueID = $(this).find(".custom-queue").attr("id"),
		 	uploadObj.targetType = $(this).closest(".files").attr("relType"),
		 	uploadObj.selectid = $(this).find("select:first").attr("id"),
		 	uploadObj.fileId = $(this).find("input").attr("id"),
		 	uploadObj.buttonImg=$(this).attr("buttonImg"),
		 	uploadObj.url=$(this).attr("url"),
		 	uploadObj.uploadFileType=$(this).attr("uploadFileType"),//上传组件的类型		 	
		 	//uploadObj.isAdvertisement=$(this).attr("isAdvertisement"),		
		 	//uploadObj.isMultiImg=$(this).attr("isMultiImg"),
		 	//uploadObj.isCatalog=$(this).attr("isCatalog"),
		 	uploadObj.queueSizeLimit = 1,
		 	uploadObj.maxFileUpload = 6;
			//上传组件的类型是否为上传多个图片
			 if(uploadObj.uploadFileType=="multiImg"){
				 uploadObj.isMultiImg=true;
				 uploadObj.queueSizeLimit =7;
				 uploadObj.maxFileUpload = 7;
			 }else{
				 uploadObj.isMultiImg=false;
			 }	
			 //isSingleImg为true,只允许上传一张图片
			 if(uploadObj.uploadFileType=="catalog"){
				 uploadObj.isCatalog=true;
				 uploadObj.queueSizeLimit =1;
				 uploadObj.maxFileUpload = 7;
			 }else{
				 uploadObj.isCatalog=false;
			 }	
		 	 //isAdvertisement为true
			 if(uploadObj.uploadFileType=="themMark"){
				 uploadObj.isAdvertisement=true;				
			 }else{
				 uploadObj.isAdvertisement=false;
			 }				
		   //调用上传附件
			uploadFile(uploadObj);					     						    	
	});	
	/*end of 上传附件*/ 
	  
	 //imgControlers imgDescription 
	 $("#advertisementBox").on("mouseover",".imgDetail",function(){
		 if(!$(this).find(".imgDescription").hasClass("noDescription")){
			 $(this).find(".imgControlers").removeClass("hidden");
			 $(this).find(".imgDescription").addClass("hidden");
		 }
	 }).on("mouseout",".imgDetail",function(){
		 if(!$(this).find(".imgDescription").hasClass("noDescription")){
			 $(this).find(".imgControlers").addClass("hidden");
			 $(this).find(".imgDescription").removeClass("hidden");
		 }
	 }); 
	//edit
	 $("#advertisementBox").on("click",".edit",function(){
		 var $that=$(this);
		 var fileId=$that.closest(".imgBox").attr("fileId");
		 $("#advertisementDialog").createDialog({
				width:500,
				height:395,
				title:'修改广告位',
				url:'/advertisement/edit?id='+fileId,
				buttons:{
					"保存":function(event){
						$("#advertisementForm").submit();
					},
					"取消":function(){
						$(this).dialog("close");
					}
				}
			});
	 });  
	 //del
	 $("#advertisementBox").on("click",".del",function(event){
			var $that=$(this);
			
			$.confirm({
				level:'warn',
				message:'确认删除吗？',
				
				okFunc: function() {	
		        	var fileId=$that.closest(".imgBox").attr("fileId");				        				        	
		        	$.ajax({
			    		url:"/advertisement/del?id="+fileId,
			    		data:{"themMark":fileId},
			    		async:true,
			    		type:"POST",
			    		success:function(data){
			    			if(data.msg=="删除失败"){
			    				$.messageBox({message:'删除失败！',level: "error"});
			    			}else if(data.msg=="该活动已发布,不可删除！"){
			    				$.messageBox({message:'该活动已发布,不可删除！',level: "error"});
			    			}else{
			    				$.messageBox({message:'删除成功',level: "success"});
			    			}
			    			$.ajax({
								url:"/advertisement/list",	            		
								async:true,
								type:"POST",
								success:function(data){
									if(data){
										$("#indexCommonView").html("").html(data);
									}
								}
							});
			    		}
			    	});
		        }				    
			})
			return false;
		})
	//left
	 $("#advertisementBox").on("click",".left",function(){	
		 var $that=$(this);
		 var fileIndex=$that.closest(".imgBox").attr("fileIndex");
		 
		 var fileId=$that.closest(".imgBox").attr("fileId"),
	 	 	 fileIndexLeft=$that.closest(".imgBox").prev(".imgBox").attr("fileIndex"),
	 	 	 fileIdLeft=$that.closest(".imgBox").prev(".imgBox").attr("fileId");
		 	 if(fileIdLeft==undefined){
		 		$.messageBox({level:'error',message:'已经是第一个了！'});
		 		return;
	 		 }
		 $.ajax({
	    		url:"/advertisement/serialNumList",
	    		data:{"themMark":fileId,"fileIndex":fileIndex,"fileIndexLeft":fileIndexLeft,"fileIdLeft":fileIdLeft},
	    		async:true,
	    		type:"POST",
	    		success:function(data){
	    			$.ajax({
						url:"/advertisement/list",	            		
						async:true,
						type:"POST",
						success:function(data){
							if(data){
								$("#indexCommonView").html("").html(data);
							}
						}
					});
	    		}
	    });
	 });
	//right
	 $("#advertisementBox").on("click",".right",function(){
		 var $that=$(this);
		 var fileIndex=$that.closest(".imgBox").attr("fileIndex");
		 
		 var fileId=$that.closest(".imgBox").attr("fileId"),
		 	 fileIndexRight=$that.closest(".imgBox").next(".imgBox").attr("fileIndex"),
		 	 fileIdRight=$that.closest(".imgBox").next(".imgBox").attr("fileId");
		 	 if(fileIdRight==undefined){
		 		 $.messageBox({level:'error',message:'已经是最后一个了！'});
		 		 return;
		 	 }
		 	 $.ajax({
				url:"/advertisement/serialNumList",
				data:{"themMark":fileId,"fileIndex":fileIndex,"fileIndexLeft":fileIndexRight,"fileIdLeft":fileIdRight},
				async:true,
				type:"POST",
				success:function(data){
					$.ajax({
						url:"/advertisement/list",	            		
						async:true,
						type:"POST",
						success:function(data){
							if(data){
								$("#indexCommonView").html("").html(data);
							}
						}
					});
				}
	    	 });
	 });
	//saveimg
	 $("#advertisementBox").on("click",".saveimg",function(){
		 var $that=$(this);
		 var id=$that.attr("activityId");
		 	if(id==""){
				$.messageBox({message:"请先关联活动编码",level: "warn"});
				return ;
			}
		 
		 	 $.ajax({
				url:"/activity/getActivityByAcNum?id="+id,
				async:true,
				type:"POST",
				success:function(data){
					if(data){
						$("#indexCommonView").html("").html(data);
					}
				}
	    	 });
	 });
	 //发布
	 $("#advertisementBox").on("click",".release",function(){
		 var $that=$(this);
		 var fileId=$that.closest(".imgBox").attr("fileId");
		 if(fileId==""){
			 $.messageBox({message:"网络异常,请刷新页面",level: "warn"});
			 return ;
		 }
		 changeCity(fileId);
		 
	 });
	 function changeCity(id){
		 $("#changeCityDialog").createDialog({
				width:520,
				height:500,
				title:'城市选择',
				url:'/advertisement/addCity?id='+id,
				buttons:{
					"确定":function(event){
						$("#maintainForm").submit();
					},
					"取消":function(){
						$(this).dialog("close");
					}
				}
		});
	 };
	 
	 //撤销
	 $("#advertisementBox").on("click",".unrelease",function(){
		 var $that=$(this);
		 var fileId=$that.closest(".imgBox").attr("fileId");
		 if(fileId==""){
			 $.messageBox({message:"网络异常,请刷新页面",level: "warn"});
			 return ;
		 }
		 $.ajax({
			 url:"/advertisement/unrelease?id="+fileId,
			 async:true,
			 type:"POST",
			 success:function(data){
				 if(data && (data.code == 200 || data.code == '200')){
					 $.ajax({
						url:"/advertisement/list",	            		
						async:true,
						type:"POST",
						success:function(data){
							if(data){
								$("#indexCommonView").html("").html(data);
								$.messageBox({message:"撤销成功"});
							}
						}
					});
				 }else{
					 $.messageBox({message:"撤销失败，请刷新后重试",level: "warn"});
				 }
			 }
		 });
	 });
	 

	},100)
});