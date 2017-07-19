	var build = {
			
			init:function(){
	        	//初始化户籍地
			setTimeout(function(){
	        	threeSelect({
	        		province:'city',
	        		city:'district',
	        		district:'town',
	        		provinceValue:$('#cityValue').val(),
	        		cityValue:$('#districtValue').val(),
	        		districtValue:$('#townValue').val()
	        	});
			},1000);	  
//				setTimeout(function(){
//		        	fourSelect({
//		        		city:'city',
//		        		district:'district',
//		        		town:'town',
//		        		community:'community',
//		        		cityValue:$('#cityValue').val(),
//		        		districtValue:$('#districtValue').val(),
//		        		townValue:$('#townValue').val(),
//		        		communityValue:$('#communityValue').val()
//		        	});
//				},1000);	 
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
	        	        queueSizeLimit:queueSizeLimit,
	        	        script: '/files/uploadTOOtherSystem',
			    		sysType:'merchants'
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
	        				 queueSizeLimit =6;
	        				 maxFileUpload = 6;
	        			 }else{
	        				 isMultiImg=false;
	        			 }	
	        			 //isSingleImg为true,只允许上传一张图片
	        			 if(isCatalog=="true"){
	        				 isCatalog=true;
	        				 queueSizeLimit =1;
	        				 maxFileUpload = 6;
	        			 }else{
	        				 isCatalog=false;
	        			 }	
	        		   //调用上传附件
	        			uploadFile(fileId,queueID,selectid,targetType,buttonImg,isMultiImg,isCatalog,maxFileUpload,queueSizeLimit);					     						    	
	        	});
					//初始化服务类型
					if($("#serviceCategorys").val().length>0){
						$("#serviceType").serviceType({
							isServiceType   : true,
							isAutoGetDate   : true,
							isHasParentData : true,
							parentData      : $("#serviceCategorys").val(),										
							checkData       : $("#serviceTypes").val(),
							childUrl        : "/serviceCategory/getChildByPid"							
						})
					};					
					//初始化覆盖区域
					$("#areaType").serviceType({
						isAreaType      : true,
						isAutoGetDate   : true,
						parentUrl       : "/org/getOrgListById",	
						parentId        : "",
						checkData       : $("#converageSqs").val(),
						childUrl        : "/org/getOrgListById"							
					})									
					
				build.bindEvent();
				if($("#mode").val() == "view") {
					$("input").attr({ readonly: 'true' });
					$("input[type='checkbox']").attr({ disabled : "disabled" });
					$("input[type='radio']").attr({ disabled : "disabled" });
					$("input[type='text']").attr({ disabled : "disabled" });
					$("textarea").attr({ disabled : "disabled" });
					$("#formSubmit").addClass("none");
					$("select").attr({ disabled : "disabled" });
					$(".filesBox").find("object").addClass("hidden");
					$(".fileTip").addClass("hidden");
				}
				if($("#mode").val() == "edit" ){
					
					$("input[name='isAssessment']").attr({ disabled : "disabled" });
//					if($("#agenciesType").val()==2 || $("#agenciesType").val()==3 || $("#agenciesType").val()==4){
//						$("input[name='agenciesType']").attr({ disabled : "disabled" });
//						$("#agenciesType").attr("name","agenciesType");
//					}
				}
				
				
			},	      
		    uploadFile:function(fileId,queueID,selectid,type,buttonImg,isCatalog,certificate,maxFileUpload){
		    	//上传附件        	
		    	$('#'+fileId).uploadFile({
		    		buttonImg:buttonImg,						
		    		queueID:queueID,
		    		selectid:selectid,
		    		targetType:type,
		    		isCatalog:isCatalog,
		    		isCertificate:certificate,
		    		maxFileUpload:maxFileUpload,
		    		script: '/files/uploadTOOtherSystem',
		    		sysType:'merchants',
		    		queueSizeLimit:1
		    	});
		    },
	        bindEvent:function(){
	        	$("#formSubmit").click(function(){
	        		//获取“机构标记”的img的id，用隐藏域传到后台
	        		var imgId = $("#queue_companyLogos .saveimg").attr("id");
	        		if(imgId=="saveimg"){
	        			imgId = "";
	        		}
	        		//imgId!="saveimg"?imgId:"";	        		
	        		$("#mark").val(imgId);
	        		$("#certificate").val();
	        		//去掉隐藏的tbody
	        		$(".tabCon").each(function(i,d){		           		
	           			if($(this).hasClass("hidden")){
	           				$(this).remove();
		           		}
		           	})
	        		
	        		$("#indexCommonView").clearNewplaceholder();
	        	    $('#maintainForm').submit();
	        	    //定位到第一个验证错误的地方errorInput
	        	    setTimeout(function(){
						if($(".errorInput").length>0){
							var offsetTop = $(".errorInput:first").offset().top,
								winHeight = $(window).height(),
								winSolTop = $(window).scrollTop();
							if(winSolTop>offsetTop){
								$(window).scrollTop(offsetTop);
							}
						}
					},1000)
	        	});
	        	var tag=false;
	        	$("#maintainForm").formValidate({ 
	        		 submitHandler: function(form) {
	        			//保存服务类型的数据
	 		           	var serviceTypes = $("#serviceType input").map(function(){
	 		           		if($(this).prop("checked")){
	 		           			return $(this).attr("inputid");
	 		           		}					  
	 					}).get().join(",");
	 	        		if(serviceTypes.length==0){
	 	        			$.messageBox({message:"请选择服务类型",level: "warn"});
	 							return;
	 	        		}	        		
	 		           	$("#serviceTypes").val(serviceTypes);
	 		           	//保存覆盖社区的数据
	 		           	var converageSqs = $("#areaType input").map(function(){
	 		           		if($(this).prop("checked")){
	 		           			return $(this).attr("inputid");
	 		           		}					  
	 					}).get().join(",");		           	
	 		           	if(converageSqs.length==0){
	 	        			$.messageBox({message:"请选择覆盖街道",level: "warn"});
	 							return;
	 	        		}
	 		           	$("#converageSqs").val(converageSqs);           	
	 		           	
	        			//生成map数据
	 		           	var saveMap={};
	 		           	$("#serviceAgenciesAdd .tabCon").each(function(i,d){
	 		           		if(!$(this).hasClass("hidden")){
	 		           			var inputText = $(this).find(".saveMap").find("input[type='text']"),
	 		           				inputRadio = $(this).find(".saveMap").find("input[type='radio']"),
	 		           				inputCheckbox = $(this).find(".saveMap").find("input[type='checkbox']");
	 		           				select = $(this).find(".saveMap").find("select");
	 		           				textarea = $(this).find(".saveMap").find("textarea");
	 		           				$.each(inputText,function(){
	 		           					if($(this).val()!=""){
	 		           						saveMap[$(this).attr("name")]=$(this).val();
	 		           					}
	 		           					
	 		           				})	 
	 		           				$.each(inputRadio,function(){
		 		           				if($(this).prop("checked")){
	 		           						saveMap[$(this).attr("name")]=$(this).val();
	 		           					}
	 		           				})	
	 		           				$.each(inputCheckbox,function(){
		 		           				if($(this).prop("checked")){
	 		           						saveMap[$(this).attr("name")]=$(this).val();
	 		           					}
	 		           				})
	 		           				select.each(function(){
		 		           				if($(this).find("option:selected")){
	 		           						saveMap[$(this).attr("name")]=$(this).find("option:selected").attr("value");
	 		           					}
	 		           				})	 	
	 		           				$.each(textarea,function(){
	 		           					if($(this).val()!=""){
	 		           						saveMap[$(this).attr("name")]=$(this).val();
	 		           					}
	 		           				})
	 		           		}
	 		           	})	        			
	 		           	$("#saveValue").val(JSON.stringify(saveMap));
	 		            $.ajax({
		 		  		 	url:"/serviceAgencies/repeat",
		 		  		 	type:"POST",
		 		  		 	async:false,
		 		  		 	data:{"id":$("#id").val(),
		 		  		 			"name":$("#name").val()},
		 		  		 	success:function(data){
//		 		  		 		console.log(data.code);
		 		  		 		if(data.code==500){
		 		  		 			$.messageBox({message:data.msg,level:'warn'});
		 		  		 			return;
		 		  		 		}
		 		  		 		if(tag){
		 		  		 			return false;
		 		  		 		}
		 		  		 		tag=true;
		 		  		 		$(form).ajaxSubmit({
		 		  		 			success: function(data){
		 		  		 				data=JSON.parse(data);
		 		  		 				if(data.code!=200){
		 		  		 					tag=false;
		 		  		 					$.messageBox({message:data.msg,level: "error"});
		 		  		 					return;
		 		  		 				}else{
		 		  		 					$.messageBox({message:data.data});
		 		  		 					var t=new Date().getTime();
		 		  		 					if($("#modeType").val()=="1"){
		 		  		 						window.location.href="/index#A22D977AA0D245AC8D2A53089B98517F?t="+t;
		 		  		 					}
		 		  		 					if($("#modeType").val()=="2"){
		 		  		 						window.location.href="/index#621A6F1E461B4D6CA53BFF2E7CB350B7?t="+t;
		 		  		 					}
		 		  		 				}
		 		  		 				$.ajax({
		 		  		 					url:"/serviceAgencies/lists",	            		
		 		  		 					async:false,
		 		  		 					type:"POST",
		 		  		 					success:function(dataHtml){
		 		  		 						if(dataHtml){
		 		  		 							$("#indexCommonView").html("").html(dataHtml);
		 		  		 							$(window).scrollTop(0); 
		 		  		 						}
		 		  		 					}
		 		  		 				});
		 		  		 			},
		 		  		 			error: function(XMLHttpRequest, textStatus, errorThrown){
		 		  		 				tag=false;
		 		  		 				alert("提交错误");
		 		  		 			}
		 		  		 	    });
		 		  		 	},
	 		            });	
	        		},
		 		  	errorHandler:function(){
		 		 	}
	        	});
	        	//机构类型切换
	           	$(".tabHandle input").each(function(i,d){	  
	           		$(this).click(function(){
	           			$(".serviceAgenciesAdd .tabCon").addClass("hidden");
	           			if($(this).hasClass("serviceOrg")){
		           			$("#commonCon,#serviceOrgCon").removeClass("hidden");
		           		}else if($(this).hasClass("threeOne")){
		           			$("#commonCon,#threeOneCon").removeClass("hidden");
		           		}else if($(this).hasClass("Nonprofits")){
		           			$("#addNonprofits").removeClass("hidden");
		           		}
	           			$(".ui-layout-west").height($(".ui-layout-center").height());
	           		})   	        		
	           		
	           	})	   
	           	//setTimeout(function(){
//						var agenciesType = $("#agenciesType").val();
//					  	if(agenciesType=="1"){
//					  		$("#serviceOrg").click();
//					  	}else if(agenciesType=="2"){
//					  		$("#center").click();
//					  	}else if(agenciesType=="3"){
//					  		$("#tuoLaoSuo").click();
//					  	}else if(agenciesType=="4"){
//					  		$("#nursingHome").click();
//					  	}else if(agenciesType=="5"){
//					  		$("#Nonprofits").click();
//					  	}else{
//					  		$("#serviceOrg").click();
//					  	}
				//	},600)	
	            //搜索
	            $("#fastSearchButton").click(function(event){	
	            	build.gridFun.fastSearch();
	        	});
	            //在院老人数
	            $('.oldNumInfo input').bind('input propertychange', function() {
	        		var count=0;
	        		$('.oldNumInfo input').each(function(i,d){
	        			if($(this).val()!=''&&parseFloat($(this).val())>=0){	        				
		        			count+=(parseFloat($(this).val()));
	        			}
	        			
	        		})
	        		$("#total").val(count);
	        	});
	        }
		}

		build.init();
		
		$('#oldMenTable').on('change','#switchInput',function(){
			$(this).parents('.switch-box').toggleClass('checked');
		});

		
		