TQ.catalog = function(dfop){			
	var build = {        
	        init:function(){
	        	/* 上传附件 */
				 var initAttachFileUploader = function(){
					  $(".exist").each(function(i,d){
							 var queueID = $(this).find(".custom-queue").attr("id"),
							     targetType = $(this).closest(".files").attr("relType"),
							     selectid = $(this).find("select").attr("id"),
							     fileId = $(this).find("input").attr("id");							     
							   //调用上传附件
						       	build.uploadFile(fileId,queueID,selectid,targetType);
						     /*$('#'+fileId).uploadFile({
								queueID : queueID,						
								targetType:targetType,
								selectid : selectid,
								maxFileUpload : 10
							 });*/						    	
						})
					}
				 setTimeout(function(){
					 initAttachFileUploader();
				  },100)
				
				
				build.bindEvent();
	        },
	        uploadFile:function(fileId,queueID,selectid,type){
	        	//上传附件        	
				$('#'+fileId).uploadFile({
					buttonImg:"/resource/js/external/uploadify/newUploadButton.jpg",
					script: '/files/uploadTOOtherSystem',
					scriptData	   : {sid:null,isFlash:true,targetType:type,sysType:'merchants'},
					//sysType : 'merchants',
					isCatalog:true,
					queueID:queueID,
                    selectid:selectid,
                    targetType:type,
                    maxFileUpload:10,
                    queueSizeLimit:1						
				});
				if($(".filesBox").find("object")){
					$(".filesBox").find("object").addClass("hidden");
				}						
	        },
	        bindEvent:function(){
	        	//添加分类
	        	dfop.addCatalogBtn.click(function(){
	        		if($("#catalogTable tr").hasClass("trEdit")){
	        			$.messageBox({message:"有分类尚未保存！",level: "error"});
	        			return;
	        		}
	        		var fileId,queueID,selectid,selectname,type,
	        			time=new Date().getTime();
	        		    cloneCon=dfop.cloneTbody.clone().removeAttr("id").removeClass("hidden");
	        		    //唯一的ID标示一级分类名称
	        		    //cloneCon.find(".item-sup").attr("id","sup"+time);	        		    
	        		    //fileId
	        		    fileId=cloneCon.find(".file").attr("id")+time;
		        		cloneCon.find(".file").attr("id",fileId)
		        		//queueID
	        		    queueID=cloneCon.find(".custom-queue").attr("id")+time;
		        		cloneCon.find(".custom-queue").attr("id",queueID)
		        		//selectid
	        		    selectid=cloneCon.find("select").attr("id")+time;
		        		cloneCon.find("select").attr("id",selectid)
		        		//selectname
	        		    selectname=cloneCon.find("select").attr("name")+time;
		        		cloneCon.find("select").attr("name",selectname)
	        		    //type
		        		type=cloneCon.find(".files").attr("relType")+time;
		        		cloneCon.find(".files").attr("relType",type);
		        	        		
	        		//放入新的tbody
	        		dfop.catalogTable.append(cloneCon);	
		        	//调用上传附件
		        	build.uploadFile(fileId,queueID,selectid,type);	
		        		
	        	})
	        	//分类展开
	        	dfop.catalogTable.on("click",".switch",function(){
	        		var selector = $(this).closest("tbody");
	        		if(selector.hasClass("holding")){
	        			selector.removeClass("holding");
	        			selector.addClass("expand");
	        		}else if(selector.hasClass("expand")){
	        			selector.removeClass("expand");
	        			selector.addClass("holding");
	        		}
	        	})
	        	//添加子分类	        	
	        	dfop.catalogTable.on("click",".addSubItemBtn",function(){
	        		if($(this).closest("tbody").find("tr").hasClass("trEdit")){
	        			$.messageBox({message:"有分类尚未保存！",level: "error"});
	        			return;
	        		}
	        		var selector = $(this).closest(".item-add"),
		        		fileId,queueID,selectid,selectname,type,
	        			time=new Date().getTime();
	        		    cloneCon=dfop.cloneSubItem.clone().removeAttr("id").removeClass("hidden");
	        		    
	        		//唯一的ID标示二级分类名称
	        		    //var parentId=selector.closest("tbody").find(".item-sup").attr("id");
	        		    //cloneCon.attr("id",parentId+"sub"+time);	    
        		    //fileId
        		    fileId=cloneCon.find(".file").attr("id")+time;
	        		cloneCon.find(".file").attr("id",fileId)
	        		//queueID
        		    queueID=cloneCon.find(".custom-queue").attr("id")+time;
	        		cloneCon.find(".custom-queue").attr("id",queueID)
	        		//selectid
        		    selectid=cloneCon.find("select").attr("id")+time;
	        		cloneCon.find("select").attr("id",selectid)
	        		//selectname
        		    selectname=cloneCon.find("select").attr("name")+time;
	        		cloneCon.find("select").attr("name",selectname)
        		    //type
	        		type=cloneCon.find(".files").attr("relType")+time;
	        		cloneCon.find(".files").attr("relType",type)
	        		
	        		//放入新的tr
		        	selector.before(cloneCon);	        		
		        	//调用上传附件
		        	build.uploadFile(fileId,queueID,selectid,type);
	        	})
	        	//未保存情况下，点击删除整行
	        	dfop.catalogTable.on("click",".txtclear",function(){	        		
	        		var selector_tr = $(this).closest("tr");
   						if(selector_tr.hasClass("item-sup")){
   							//如果是一级类目就删除整个tbody
   							selector_tr.closest("tbody").remove();
   						}else if(selector_tr.hasClass("item-sub")){
   							//如果是二级类目就删除自身
   							selector_tr.remove();
   						}				   
	        	})
	        	//点击去除红框类errorInput
	        	dfop.catalogTable.on("blur",".cataText",function(){	        		
	        		if($(this).length>0){
	        			$(this).removeClass("errorInput");	        			
	        		} 					   
	        	})
	        	//点击保存
	        	dfop.catalogTable.on("click",".newSave",function(){	 
	        		var selector_tr = $(this).closest("tr"),
	        			selector_tr_id = $(this).closest("tr").attr("id"),
	        		    selector_tbody = $(this).closest("tbody"),
	        		    selector_cataText = $(this).closest("tr").find(".cataText"),
	        		    selector_txtclear = $(this).closest("tr").find(".txtclear"),
	        		    cataText = $(this).closest("tr").find(".cataText").val(),
	        		    selfid="",//本级id
	        		    parentId="",//父级id
	        		    saveimg="";
	        		if($(this).closest("tr").find(".saveimg").length>0){
	        			//saveimg =$(this).closest("tr").find(".saveimg").attr("src").split("imgPath=")[1];
	        			saveimg =$(this).closest("tr").find(".saveimg").attr("id");
	        		}	        		
	        		if(cataText.length<=0){
	        			selector_cataText.addClass("errorInput");
	        			$.messageBox({message:"请输入分类名称",level: "warn"});
	        			return false;
	        		}
	        		//获取本级和父级的id
	        		if(selector_tr.hasClass("item-sup")){
	        			selfid=selector_tr_id;	        			
	        		}else if(selector_tr.hasClass("item-sub")){
	        			selfid=selector_tr_id;
	        			parentId=$(this).closest("tbody").find(".item-sup").attr("id");
	        		}
	        		selector_cataText.removeClass("errorInput");
	        		
	        		$.ajax({					
	   					url:"/serviceCategory/add",
	   					type:"POST",
	   					data:{"id":selfid,"parentId":parentId,"name":cataText,"attach":saveimg},
	   					success:function(data){
	   						data=JSON.parse(data);
	   						if(data.code!=200){
	   							$.messageBox({message:data.msg,level: "error"});
	   							return;
	   						}
	   						$.messageBox({message:"成功"});
	   						//设置保存tr的id	   		
	   		        		selector_tr.attr("id",data.data.id)
	   						//保存成功，tr去掉可编辑的状态
	   						selector_tr.removeClass("trEdit");	   						
	   						//保存成功，input去掉可清空的功能
	   						selector_txtclear.addClass("hidden");
	   					    //显示上下移动功能
	   						selector_tr.find(".move-box").removeClass("hidden");
	   					    //保存成功，分类名称去掉可编辑的状态
	   						selector_cataText.addClass("disabled").prop("readonly",true);	 
	   						//添加图片的object隐藏
	   						selector_tr.find("object").addClass("hidden");
	   						refresh();//页面刷新
//	   						$.ajax({
//	   							url:"/serviceCategory/list",
//	   							async:false,
//	   		   					type:"POST",
//	   		   					success:function(data){
//	   		   						if(data){
//	   		   							$("#indexCommonView").html("").html(data);
//	   		   						}
//	   		   					}
//	   						});
	   					},
	   					error:function(){
	   						$.messageBox({message:"请求数据错误",level: "error"});
	   					}
	   				});
	        	})
	        	//点击修改
	        	dfop.catalogTable.on("click",".newRevise",function(){	        		
	        		var selector_tr = $(this).closest("tr"),
	        		    selector_tbody = $(this).closest("tbody"),
	        		    selector_txtclear = $(this).closest("tr").find(".txtclear"),
	        		    selector_cataText = $(this).closest("tr").find(".cataText");
   						//修改，tr加上可编辑的状态
   						selector_tr.addClass("trEdit");     							
   					    //修改，分类名称加上可编辑的状态
   						selector_cataText.removeClass("disabled").prop("readonly",false);
   						//添加图片的object显示
   						selector_tr.find("object").removeClass("hidden");
	        	})
	        	//点击删除
	        	dfop.catalogTable.on("click",".newDel",function(){	        		
	        		var selector_tr = $(this).closest("tr"),
	        			selector_tr_id = $(this).closest("tr").attr("id"),
	        		    selector_tbody = $(this).closest("tbody"),
	        		    selector_cataText = $(this).closest("tr").find(".cataText"),
	        		    cataText = $(this).closest("tr").find(".cataText").val(),
	        		    selfid="",//本级id
	        		    parentId="",//父级id
	        		    saveimg="";
	        		if($(this).closest("tr").find(".saveimg").length>0){
	        			saveimg =$(this).closest("tr").find(".saveimg").attr("src").split("imgPath=")[1];
	        		}	
	        		if(selector_tr.hasClass("item-sup")){	        			
	        			if(selector_tr.next("tr").attr("id") && selector_tr.next("tr").attr("id").length>0){
	        				$.messageBox({message:"有已保存的子类目，禁止删除！",level: "error"});
	        				return;
	        			}
	        			selfid=selector_tr_id;
	        		}else if(selector_tr.hasClass("item-sub")){
	        			selfid=selector_tr_id;
	        			
	        		}
	        		$.ajax({					
	   					url:"/serviceCategory/delete",
	   					type:"POST",
	   					data:{"id":selfid},
	   					success:function(data){
	   						data=JSON.parse(data);
	   						if(data.code!=200){
	   							$.messageBox({message:data.msg,level: "error"});
	   							return;
	   						}
	   						$.messageBox({message:"删除成功"});
	   						if(selector_tr.hasClass("item-sup")){	        			
	   		        			//删除主类目
	   		        			selector_tbody.remove();
	   		        		}else if(selector_tr.hasClass("item-sub")){
	   		        			//删除二级类目
	   		        			selector_tr.remove();
	   		        		}
	   					},
	   					error:function(){
	   						$.messageBox({message:"请求数据错误",level: "error"});
	   					}
	   				})    
	        	})
	        	//点击置顶
	        	dfop.catalogTable.on("click",".move-top",function(){	        		
	        		var selector_tr = $(this).closest("tr"),
	        			selector_tr_id = $(this).closest("tr").attr("id"),
	        		    selector_tbody = $(this).closest("tbody"),
	        		    selector_itemSup = selector_tbody.find(".item-sup"),
	        		    selector_thead = dfop.catalogTable.find("thead");
	        		
	        		$.ajax({					
	   					url:"/serviceCategory/toTop",
	   					type:"POST",
	   					data:{"id":selector_tr_id},
	   					success:function(data){
	   						data=JSON.parse(data);
	   						if(data.code!=200){
	   							$.messageBox({message:data.msg,level: "warn"});
	   							return;
	   						}
	   						$.messageBox({message:"置顶成功"});
	   						if(selector_tr.hasClass("item-sup")){	        			
	   		        			//主类目移动到thead下一位
	   		        			selector_thead.after(selector_tbody);
	   		        		}else if(selector_tr.hasClass("item-sub")){	        			
	   		        			//二级类目移动到当前item-sub下一位
	   		        			selector_itemSup.after(selector_tr);	        			
	   		        		}
	   						refresh();//页面刷新
	   					},
	   					error:function(){
	   						$.messageBox({message:"请求数据错误",level: "error"});
	   					}
	   				})
	        	})
	        	//点击上移
	        	dfop.catalogTable.on("click",".move-up",function(){	        		
	        		var selector_tr = $(this).closest("tr"),
	        			selector_tr_id = $(this).closest("tr").attr("id"),
	        		    selector_tbody = $(this).closest("tbody"),
	        		    selector_itemSup = selector_tbody.find(".item-sup"),
	        		    selector_thead = dfop.catalogTable.find("thead");
	        		
	        		
	        		$.ajax({					
	   					url:"/serviceCategory/moveChange",
	   					type:"POST",
	   					data:{"id":selector_tr_id,"type":1},
	   					success:function(data){
	   						data=JSON.parse(data);
	   						if(data.code!=200){
	   							$.messageBox({message:data.msg,level: "warn"});
	   							return;
	   						}
	   						$.messageBox({message:"上移成功"});
	   						if(selector_tr.hasClass("item-sup")){	        			
	   		        			//如果前面有tbody
	   		        			if(selector_tbody.prev().is("tbody")){
	   		        				//主类目移动到前面有tbody上一位
	   		        				selector_tbody.prev("tbody").before(selector_tbody);
	   		        			}
	   		        			
	   		        		}else if(selector_tr.hasClass("item-sub")){	 
	   		        			//如果前面有item-sub
	   		        			if(selector_tr.prev().is(".item-sub")&&selector_tr.prev().is(":not(.item-add)")){
	   		        				//二级类目移动到前面有item-sub上一位
	   		        				selector_tr.prev(".item-sub").before(selector_tr);
	   		        			}
	   		        				        			
	   		        		}
	   						refresh();//页面刷新
	   					},
	   					error:function(){
	   						$.messageBox({message:"请求数据错误",level: "error"});
	   					}
	   				})  
	        		
	        		
	        	})
	        	//点击下移
	        	dfop.catalogTable.on("click",".move-down",function(){	        		
	        		var selector_tr = $(this).closest("tr"),
	        			selector_tr_id = $(this).closest("tr").attr("id"),
	        		    selector_tbody = $(this).closest("tbody"),
	        		    selector_itemSup = selector_tbody.find(".item-sup"),
	        		    selector_thead = dfop.catalogTable.find("thead");
	        			
	        		
	        		$.ajax({					
	   					url:"/serviceCategory/moveChange",
	   					type:"POST",
	   					data:{"id":selector_tr_id,"type":2},
	   					success:function(data){
	   						data=JSON.parse(data);
	   						if(data.code!=200){
	   							$.messageBox({message:data.msg,level: "warn"});
	   							return;
	   						}
	   						$.messageBox({message:"下移成功"});
	   						if(selector_tr.hasClass("item-sup")){	        			
	   		        			//如果下面有tbody
	   		        			if(selector_tbody.next().is("tbody")){
	   		        				//主类目移动到thead下一位
	   		        				selector_tbody.next("tbody").after(selector_tbody);
	   		        			}
	   		        			
	   		        		}else if(selector_tr.hasClass("item-sub")){	 
	   		        			//如果下面有item-sub
	   		        			if(selector_tr.next().is(".item-sub")&&selector_tr.next().is(":not(.item-add)")){
	   		        				//二级类目移动到当前item-sub下一位
	   		        				selector_tr.next(".item-sub").after(selector_tr);
	   		        			}
	   		        		}
	   						refresh();//页面刷新
	   					},
	   					error:function(){
	   						$.messageBox({message:"请求数据错误",level: "error"});
	   					}
	   				}) 
	        	})
	        	//点击置底
	        	dfop.catalogTable.on("click",".move-btm",function(){	        		
	        		var selector_tr = $(this).closest("tr"),
	        			selector_tr_id = $(this).closest("tr").attr("id"),
	        		    selector_tbody = $(this).closest("tbody"),
	        		    selector_itemadd = selector_tbody.find(".item-add"),
	        		    selector_thead = dfop.catalogTable.find("thead");
	        		$.ajax({					
	   					url:"/serviceCategory/toLow",
	   					type:"POST",
	   					data:{"id":selector_tr_id},
	   					success:function(data){
	   						data=JSON.parse(data);
	   						if(data.code!=200){
	   							$.messageBox({message:data.msg,level: "warn"});
	   							return;
	   						}
	   						$.messageBox({message:"置底成功"});
	   						if(selector_tr.hasClass("item-sup")){	        			
	   		        			//主类目移动到table最后面
	   		        			dfop.catalogTable.append(selector_tbody);	        			
	   		        		}else if(selector_tr.hasClass("item-sub")){	        			
	   		        			//二级类目移动到当前item-sub下一位
	   		        			selector_itemadd.before(selector_tr);	        			
	   		        		}
	   						refresh();//页面刷新
	   					},
	   					error:function(){
	   						$.messageBox({message:"请求数据错误",level: "error"});
	   					}
	   				})
	        	})
	        }
		}
		build.init();
	
}

function refresh(){
	$.ajax({
			url:"/serviceCategory/list",
			async:false,
				type:"POST",
				success:function(data){
					if(data){
						$("#indexCommonView").html("").html(data);
					}
				}
		});
}