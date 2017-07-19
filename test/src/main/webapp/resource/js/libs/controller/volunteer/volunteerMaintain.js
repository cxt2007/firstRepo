selectTeam();
function selectTeam(){
		$.ajax({
			type:'post',
			url:'/volunteerTeam/getVolTeamList',
			dataType:'json',
			async:false,
			success:function(data){
				var volTeamData = data.volunteerTeamList;
				var $opt=$("<option>").text('请选择').val();
				for(i=0;i<volTeamData.length;i++){
					$("#teamName").append("<option id='"+ volTeamData[i].id +"' value='"+volTeamData[i].teamName+"'>"+volTeamData[i].teamName+"</option>");
				}
				if($("#teamName"+" option").size()>1){
					$("#teamName").val($('#teamNameValue').val()?$('#teamNameValue').val():null);		
				}
			}
		});
	}
//	select({
//		teamName:'teamName',
//		teamNameValue:$('#teamNameValue').val()
//	});
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
		var teamNameId= $("#teamName").find("option:selected").attr("id")||'';
		$("#teamNameId").val(teamNameId);
		$("#maintainForm").ajaxSubmit({
			dataType: "json",
			data:$("#maintainForm").serialize(),
			success : function(data) {
				$.ajax({
					url:"/volunteer/list",	            		
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
    	$("#maintainForm").submit();
    })
    
    	$("#maintainForm").formValidate({
    		submitHandler : function(form) {
    			var teamNameId= $("#teamName").find("option:selected").attr("id")||'';
    			$("#teamNameId").val(teamNameId);
    		    var defaultImg = $("#queue_themeLogos .defaultImg")
    		    if(flag){
    		    	if(defaultImg.length == 1){
    			    	$.messageBox({level:'warn',message:'请上传主题图片'});
    			    	return;
    			    }
    		    }
    			if(tag){return false;}
    			tag = true;
    			$("#releaseStatus").val(1);
    			console.log($(form).serialize());
    	    	$(form).ajaxSubmit({
    				dataType: "json",
    				data:$(form).serialize(),
    				success : function(data) {
    					$.ajax({
    						url:"/volunteer/list",	            		
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
    
    
//    function select(config){
//		var $s1=$("#"+config.teamName);
//		selectTeam(config);
//		$s1.change(function(){
//			if(this.selectedIndex==-1 || this.options[this.selectedIndex].value==""){
//				return;
//			} 
//			var s1_curr_val = this.options[this.selectedIndex].value;
//			var s1_curr_id = this.options[this.selectedIndex].id;
//		});
//	}
//	function appendOptionTo($o,k,v,d){
//		var $opt=$("<option>").text('请选择').val(k);
//		if(k==d){$opt.attr("selected", "selected")}
//		$opt.appendTo($o);
//	}
//	function clearOptions($o){
//		$o.html("");
//		appendOptionTo($o,"","","","");
//	}
	
	