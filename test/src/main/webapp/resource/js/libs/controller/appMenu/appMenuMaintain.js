$(function(){
	
	  threeSelect({
			province:'city',
			provinceValue:$('#provinceValue').val()
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
	    	flag=false;
	    	var city=$("#city option:selected").attr("id");
	    	$("#citys").val(city);
	    	$("#maintainForm").submit();
	    }) 
		$("#maintainForm").formValidate({
			submitHandler : function(form) {
			    var defaultImg = $("#queue_themeLogos .defaultImg")
			    if(flag){
			    	if(defaultImg.length == 1){
				    	$.messageBox({level:'warn',message:'请上传图片'});
				    	return;
				    }
			    }
				if(tag){return false;}
				tag = true;
				$(form).ajaxSubmit({
					dataType: "json",
					 success: function(data){
			            	if(data.code==200){
			            		$.messageBox({message:"保存成功"});
								$.ajax({
									url:"/appmenu/list",	
									data:{city:$("#provinceValue").val()},            		
									async:false,
									type:"POST",
									success:function(dataHtml){
										if(data){
											$("#indexCommonView").html("").html(dataHtml);
										}
									}
								});
			            	}else{
			            		tag=false;
			            		$.messageBox({message:data.msg,level:"error"});
			            	}
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
	    
//	    threeSelect({
//			province:'city',
//			provinceValue:$('#provinceValue').val()
//		});
//	    function select(config){
//			var $s1=$("#"+config.province);
//			getProvince(config);
//			$s1.change(function(){
//				if(this.selectedIndex==-1 || this.options[this.selectedIndex].value==""){
//					return;
//				} 
//				var s1_curr_val = this.options[this.selectedIndex].value;
//				var s1_curr_id = this.options[this.selectedIndex].id;
//			});
//		}
//		function appendOptionTo($o,k,v,d){
//			var $opt=$("<option>").text('请选择').val(k);
//			if(k==d){$opt.attr("selected", "selected")}
//			$opt.appendTo($o);
//		}
//		function clearOptions($o){
//			$o.html("");
//			appendOptionTo($o,"","","","");
//		}
//		function getProvince(config){
//			$.ajax({
//				type:'post',
//				url:'/org/getOrgListById',
//				dataType:'json',
//				async:false,
//				success:function(data){
//					clearOptions($("#"+config.province));	
//					var provinceData = data.organizationList;
//					for(i=0;i<provinceData.length;i++){
//						$("#"+config.province).append("<option id='"+ provinceData[i].id +"' value='"+provinceData[i].id+"'>"+provinceData[i].orgName+"</option>");
//					}
//					if($("#"+config.province+" option").size()>1){
//						$("#"+config.province).val(config.provinceValue?config.provinceValue:null);		
//						var province_curr_id = $("#"+config.province+" option:selected").attr("id");
//					}
//				}
//			});
//		}
	    $("#city"+" "+"#"+$('#provinceValue').val()).attr({'selected':'selected'});
	    
});	