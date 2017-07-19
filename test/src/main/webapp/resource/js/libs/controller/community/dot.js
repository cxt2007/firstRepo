threeSelect({
		province:'city',
		city:'district',
		district:'town',
		provinceValue:$('#provinceValue').val(),
		cityValue:$('#cityValue').val(),
		districtValue:$('#districtValue').val()
});
function dotQuery(){
		var queryText = $("#query").val().trim();
		if($("#query").val()==$("#query").attr("placeholder")){
			queryText="";
			return;
		}
		$.ajax({
			url:"/community/dotList",	            		
			async:false,
			type:"POST",
			data:{'query':queryText},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//查看
	function dotShow(id,obj) {
		$.ajax({
			url:"/community/dotShow?id=" + id,	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//新增
	function dotAddView(){
		$.ajax({
			url:"/community/dotAddView",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//修改
	function dotEdit(id){
		$.ajax({
			url:"/community/dotUpdateView?id=" + id,	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
	
	//删除
	function dotCancel(id,_self){
		$.confirm({
	        title:"删除确认",
	        message:"确定要删除吗？",
	        width: 300,
	        height:200,
	        okFunc: function(){
	        	$.ajax({
	        		type : 'post',
	        		url : '/community/dotCancel',
	        		data : {'id' : id},
	        		dataType: "json",
	        		success : function(data) {
	        			queryPage();
//	        			if(data=200){
//	        				$(_self).parents("tr").remove();
//	        				$.messageBox({message:'删除成功',level: "success"});
//	        				queryPage();
//	        			}else if(data.msg="删除失败"){
//	        				$.messageBox({message:'删除失败',level: "error"});
//	        				queryPage();
//	        			}else{
//	        				$.messageBox({message:'删除失败',level: "error"});
//	        				queryPage();
//	        			}
	        		}
	        	});
	        }
		});
	}
	
	
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
		
		//新增		
		$("#maintainForm").formValidate({
			 submitHandler: function(form) {
				 $(form).ajaxSubmit({
						dataType: "json",
						success: function(data){
			            	if(data.code==200){	   
			            		$.messageBox({message:'保存成功',level: "success"});
			            		$.ajax({
			            			url:"/community/dotList",	            		
			            			async:false,
			            			type:"POST",
			            			success:function(data){
			            				if(data){
			            					$("#indexCommonView").html("").html(data);
			            				}
			            			}
			            		});
			            	} else if(data.code="500") {
			            		$.messageBox({message:data.msg,level: "error"});
			            		
			            	}else{
			            		$.messageBox({message:'保存失败',level: "error"});
			            	}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown){
							$.messageBox({level:"error",message:"提交错误"});
						}
				 });
			 },
			 errorHandler:function(){
			 }
		});
		
		//返回
		$("#returnBtn").click(function(){
			$.ajax({
				url:"/community/dotList",	            		
				async:false,
				type:"POST",
				success:function(data){
					if(data){
						$("#indexCommonView").html("").html(data);
		
					}
				}
			});
		});
	});
	
	
	function queryPage(){
		$.ajax({
			url:"/community/dotList",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);

				}
			}
		});
	}
	
