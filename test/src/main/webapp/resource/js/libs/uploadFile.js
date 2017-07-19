(function ($) {
	$.fn.uploadFile=function(option){
		function GetCookie(sName){
		    var   aCookie   =   document.cookie.split("; "); 
		    for(var i=0;i<aCookie.length;i++) {      
		        var aCrumb=aCookie[i].split("=");
		        if(sName==aCrumb[0])     
		            return unescape(aCrumb[1]);   
		    }       
		    return null;  
		}
		
		var self = $(this);
		var selfId=self.attr("id")
		var thisTitle=document.title;
		var rename=false;
		var fileExtBol=false;
		var flashMessage=$.flashVersion();
		var sid=GetCookie("sid");
		
		//不符合规定的附件数组
		var returnBoo=[];
		//var filenameExt='*.jpg;*.gif;*.png;*.zip;*.jpeg;*.pdf;*.pptx;*.rtf;*.tar;*.vsd;*.xlsx;*.tif;*.rar;*.bmp;*.xls;*.docx;*.doc;*.txt;*.ceb;*.mp3';
		var filenameExt='*.jpg;*.gif;*.png;*.jpeg;*.bmp;*.pdf';
		var defaultOption={
			targetType	   : "",
			queueID        : "",
			sizeLimit      : 10485760,
			size		   : 131072,//128kb
			selectid       : "",
			containId      : true,
			isCatalog      : false,//上传单张图片，同时显示缩略图
			isCertificate  : false,//改变原来的上传样式
			isMultiImg	   : false,//是否可以上传多张图片，同时显示缩略图
			isAdvertisement: false,//是否可以上传多张广告位图片，同时显示缩略图
			advertisementUrl: "",
			isProblem      : false,//上传文件是否有问题
			fileDataName   : 'file',  
			method 		   : "GET",
			scriptData	   : {sid:sid,isFlash:true,targetType:option.targetType,sysType:option.sysType},
			uploader       : '/resource/js/external/uploadify/uploadify.swf',
			script         : '/files/upload',
			cancelImg      : '/resource/js/external/uploadify/cancel.png',
			buttonImg	   : '/resource/js/external/uploadify/uploadButton.png',
			folder         : '/',
			multi          : true,
			auto           : true,
			queueSizeLimit : 1,
			maxFileUpload : 10,
			onQueueFull    :function(){
					$.messageBox({message:"单次文件上传，最多选择"+defaultOption.queueSizeLimit+"个文件",level: "error"});
					return false;
				},
			removeCompleted: false,
			width : 50,
			height: 26,
			fileExt        : filenameExt,
			fileDesc       : '图片',
			onSelect:function(event,ID,fileObj){
				var flag=true;
				document.title=thisTitle;
				$("#"+defaultOption.selectid+" option").each(function(){
					if($(this).attr("value").split("|")[1]==(fileObj.name)){
						$.messageBox({level:'error',message:"文件不允许重名。请修改文件名后再上传"});
						$(this).remove();
						flag=false;
					};
				});
				var fileExtNumber=4;
				if(fileObj.name.substring(fileObj.name.length-4,fileObj.name.length-3)!='.'){
					fileExtNumber=5;
				}
				var flieExtName=fileObj.name.substring(fileObj.name.length-fileExtNumber,fileObj.name.length);
				var flieExtNameArr=defaultOption.fileExt.split(";");
				for(var i=0;i<flieExtNameArr.length;i++){
					if(flieExtNameArr[i]==('*'+flieExtName.toLowerCase())){
						fileExtBol=true;
					};
				};
				if(!fileExtBol){
					$.messageBox({level:'error',message:"该类型文件不允许上传"});
					returnBoo.push(fileObj.name);
					flag=false;
				};
				if(defaultOption.isMultiImg){
					$("#"+defaultOption.selectid+" option").each(function(){
						if($(this).attr("value").split(";")[0]==(fileObj.name)){
							$.messageBox({level:'error',message:"文件不允许重名。请修改文件名后再上传"});
							returnBoo.push(fileObj.name);
							flag=false;
						};
					});
					if($("#"+defaultOption.queueID+" .imgBox").size()>=defaultOption.maxFileUpload){
						$.messageBox({level:'error',message:"最多允许上传"+defaultOption.maxFileUpload+"个文件"});
						returnBoo.push(fileObj.name);
						flag=false;
					};		
				}else if(defaultOption.isAdvertisement){
					$("#"+defaultOption.selectid+" option").each(function(){
						if($(this).attr("value").split(";")[0]==(fileObj.name)){
							$.messageBox({level:'error',message:"文件不允许重名。请修改文件名后再上传"});
							returnBoo.push(fileObj.name);
							flag=false;
						};
					});
					if($("#"+defaultOption.queueID+" .imgBox").size()>=defaultOption.maxFileUpload){
						$.messageBox({level:'error',message:"最多允许上传"+defaultOption.maxFileUpload+"个文件"});
						returnBoo.push(fileObj.name);
						flag=false;
					};	
				}else if(!defaultOption.isCatalog){
					if($("#"+defaultOption.queueID+" .uploadifyQueueItem").size()>=defaultOption.maxFileUpload){
						$.messageBox({level:'error',message:"最多允许上传"+defaultOption.maxFileUpload+"个文件"});
						returnBoo.push(fileObj.name);
						flag=false;
					};
				}else if(!defaultOption.isXls){
					if($("#"+defaultOption.queueID+" .uploadifyQueueItem").size()>=defaultOption.maxFileUpload){
						$.messageBox({level:'error',message:"最多允许上传"+defaultOption.maxFileUpload+"个文件"});
						returnBoo.push(fileObj.name);
						flag=false;
					};
				}
				if(fileObj.size<=0){
					$.messageBox({level:'error',message:"不允许上传空文件"});
					returnBoo.push(fileObj.name);
					flag=false;
				}
				/*if(fileObj.size>defaultOption.size){
					$.messageBox({level:'error',message:"上传的图片不能大于"+Math.floor(defaultOption.size/1024)+"KB"});
					returnBoo.push(fileObj.name);
					flag=false;
				}*/
				if(fileObj.name.indexOf(',')>0 || fileObj.name.indexOf('，')>0){
					$.messageBox({level:'error',message:"上传文件名称不允许包含特殊字符(如,)"});
					returnBoo.push(fileObj.name);
					flag=false;
				}
				$(".upload-panel").show();
				defaultOption.isProblem=flag?false:true;//上传文件是否有问题
				 
				return flag;
			}
        };
		$.extend(defaultOption,option);
		if(flashMessage){
			$("#"+defaultOption.containId).html(flashMessage);
			$("#"+selfId+"Uploader").remove();
		}
		var events={
		  	onAllComplete  : function(event,data) {
			  	var size=$("#"+defaultOption.queueid).attr("totalSize");
			  	if(size==undefined){
			  		$("#"+defaultOption.queueid).attr("totalSize",data.allBytesLoaded);
			  	}else{
			  		$("#"+defaultOption.queueid).attr("totalSize",(parseInt(size)+data.allBytesLoaded));
			  	}
			  	if(option.onAllComplete){
			  		option.onAllComplete.call(null,event,data);
			  	}
			},
			onComplete	: function(e,queueid,fileObj,response,data){
				if(defaultOption.isProblem){//上传文件是否有问题
					return false;
				}
				$("#"+self.attr("id")+queueid).parent().css("display","block");// ie7bug
				response = JSON.parse(response);
				if($("#"+defaultOption.selectid+" option").size()<defaultOption.maxFileUpload){
                    if($.inArray(fileObj.name, returnBoo)<0){
                    	var val = response.data.FileName;
                    	val += ";"+response.data.FilePath;
                    	val += ";"+response.data.FileType;
                    	/*catalog 单次上传文件 */
        				if(defaultOption.isCatalog){
        					$("#"+defaultOption.selectid).empty().append("<option value='"+val+"' selected></option>");
        				}else{
        					$("#"+defaultOption.selectid).append("<option value='"+val+"' selected></option>");
        				}
					}
				}
				
				/*catalog 单次上传  */
				if(defaultOption.isCatalog){
					if($("#"+self.attr("id")+queueid).parent().find(".saveimg").length>0){
						$("#"+self.attr("id")+queueid).parent().find(".saveimg").removeClass('defaultImg').attr("src","/files/temp?path="+response.data.FilePath+"&fileSysType="+response.data.FileSysType).attr("id",response.data.FileName+";"+response.data.FilePath+";"+response.data.FileType);
					}else{
						var img="<img class='saveimg' id='"+response.data.FileName+";"+response.data.FilePath+";"+response.data.FileType+"' src='/files/temp?path="+response.data.FilePath+"&fileSysType="+response.data.FileSysType+"' alt='' />";
						$("#"+self.attr("id")+queueid).parent().append(img);
					}					
				}
				
				/*isMultiImg 公益组织 多选  */
				if(defaultOption.isMultiImg){
					if($.inArray(fileObj.name, returnBoo)<0){
						//先删除默认图片
						if($("#"+self.attr("id")+queueid).parent().find(".defaultImg")){
							$("#"+self.attr("id")+queueid).parent().find(".defaultImg").remove();
						}
						var imgBox="<div class='imgBox' fileId='"+response.data.FileName+";"+response.data.FilePath+";"+response.data.FileType+"'><img class='saveimg' src='/files/temp?path="+response.data.FilePath+"&fileSysType="+response.data.FileSysType+"' alt='' /><span class='delete'></span></div>";
						$("#"+self.attr("id")+queueid).parent().append(imgBox);
				
					}
				}
				/*end of isMultiImg*/
				/*isCertificate 新增机构里上传证件*/
				if(defaultOption.isCertificate){
					$("#certificateImgs").append("<li><a class='downloadImg' href='/files/"+response.data.mark+"'>"+response.data.FileName+"</a><span class='delete'><img src='/resource/js/external/uploadify/cancel.png' border='0'></span></li>");					
				}
				/*end of isCertificate*/
				/*isAdvertisement 上传广告位图片*/
				if(defaultOption.isAdvertisement){
					if($.inArray(fileObj.name, returnBoo)<0){
						//var imgBox="<div class='imgBox' fileId='"+response.data.FileName+";"+response.data.FilePath+";"+response.data.FileType+"'><img class='saveimg' src='/files/temp?path="+response.data.FilePath+"' alt='' /><div class='imgDetail'><div class='imgControlers clearfix'><a href='javascript:;' class='btn edit'></a><a href='javascript:;' class='btn delete'></a><a href='javascript:;' class='btn left'></a><a href='javascript:;' class='btn right'></a></div></div></div>";
						//$("#"+self.attr("id")+queueid).parent().append(imgBox);
						if(defaultOption.advertisementUrl){
							$.ajax({
					    		url:defaultOption.advertisementUrl,
					    		data:{"themMark":response.data.FileName+";"+response.data.FilePath+";"+response.data.FileType},
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
						}						
					}
				}
				/*end of isAdvertisement*/
				
				/*Xls */
				if(defaultOption.isXls){
					$("#queue_companyLogos").text(response.data.FileName);
					$("#path").val(response.data.FilePath);					
				}
				/*end of Xls */
				$("#"+self.attr("id")+queueid).attr("id",response.data.FileName+";"+response.data.FilePath+";"+response.data.FileType);
				
				if(option.onComplete){
			  		option.onComplete.call(null,e,queueid,fileObj,response,data);
			  	}
				var queueid = $("#"+defaultOption.queueid);
				$("#"+defaultOption.queueid+"_ids").val(data.fileIds);
				queueid.scrollTop=queueid.scrollHeight-queueid.offsetHeight;
			},
			onCancel:function(event,ID,fileObj){
				
			}
		};
		$.extend(defaultOption,events);
		self.uploadify(defaultOption); 
		var settings=jQuery(this).data('settings');
		if(settings==null){
			settings = defaultOption;
		}
		self.unbind("uploadifySelectOnce").bind("uploadifySelectOnce", {'action': settings.onSelectOnce}, function(event, data) {
			if($("#"+defaultOption.selectid+" option").size()>=defaultOption.maxFileUpload){
				return false;
			}
			event.data.action(event, data);
			if (settings.auto) {
				if (settings.checkScript) { 
					jQuery(this).uploadifyUpload(null, false);
				} else {
					jQuery(this).uploadifyUpload(null, true);
				}
			}
		});
		document.title=thisTitle;
		$("#"+defaultOption.queueID).on("click",".cancel",function(event){
			var $that=$(this);
			$.confirm({
				level:'warn',
				message:'该操作将直接删除上传的文件，确认删除吗？',
				okFunc: function() {			        	
			        	var fileName=$that.closest(".uploadifyQueueItem").attr("id");
			        	var opt;			        	
			        	$("option",$("#"+defaultOption.selectid)).each(function(i,d){			        		
			        		if($(this).attr("value").indexOf(fileName)!=-1){
			        			opt=$(this);
			        			return;
			        		}
			        	});			        	
			        	if(opt){
			        		if(opt.attr("data")){
				        		$("<option>").val(opt.attr("data")).attr("selected",true).appendTo($("#"+defaultOption.selectid+"_del"));			        		
				        	}
			        		opt.remove();
			        	}
						$that.closest(".uploadifyQueueItem").remove();
			        }			
			  
			})
			return false;
		})
		/*isCertificate 新增机构里上传证件 添加删除功能*/
		if(defaultOption.isCertificate){
			$("#certificateImgs").on("click",".delete",function(event){
				var $that=$(this);
				$.confirm({
					level:'warn',
					message:'确认删除吗？',
					okFunc: function() {
				        	var fileId=$that.closest("li").find(".downloadImg").attr("id");	
				        	var fileName=$that.closest("li").find(".downloadImg").text();
				        	var index =$that.closest("li").index();
				        	//var opt = $("option[value*='"+fileName+"']",$("#"+defaultOption.selectid));	
				        	var opt = $("#"+defaultOption.selectid).find("option").eq(index);
				        	var uploadifyQueueItem;		
				        	$that.closest(".exist").find(".uploadifyQueueItem").each(function(i,d){			        		
				        		if($(this).attr("id").indexOf(fileId)!=-1){
				        			uploadifyQueueItem=$(this);
				        			return;
				        		}
				        	});
				        	if(fileId){
				        		//有id，为已存在上传了的图片	
					        	$("<option>").val(opt[0].value.split(";")[0]).attr("selected",true).appendTo($("#deleteAttach"));			        		
					        }
				        	//删除option,li				        		
				        	opt.remove();
				        	//uploadifyQueueItem.remove();
			        		$that.closest("li").remove();			        		
				        }				
				    
				})
				return false;
			})
		}	
		/*isCertificate 新增机构里上传证件 添加删除功能*/
		/*isMultiImg 公益组织 活动新增 添加删除功能*/
		if(defaultOption.isMultiImg){
			$("#"+defaultOption.queueID).on("click",".delete",function(event){
				var $that=$(this);
				$.confirm({
					level:'warn',
					message:'确认删除吗？',
					okFunc: function() {	
			        	var fileId=$that.closest(".imgBox").attr("fileId");				        				        	
			        	var opt,uploadifyQueueItem;		
			        	$that.closest(".exist").find(".uploadifyQueueItem").each(function(i,d){			        		
			        		if($(this).attr("id").indexOf(fileId)!=-1){
			        			uploadifyQueueItem=$(this);
			        			return;
			        		}
			        	});
			        	$("option",$("#"+defaultOption.selectid)).each(function(i,d){			        		
			        		if($(this).attr("value").indexOf(fileId)!=-1){
			        			opt=$(this);
			        			return;
			        		}
			        	});
			        	if(opt){
			        		//有data，为已存在上传了的图片		
			        		if(opt.attr("data")){
				        		$("<option>").val(opt.attr("data")).attr("selected",true).appendTo($("#"+defaultOption.selectid+"_del"));			        		
				        	}
			        		opt.remove();
			        	}				        				        			
				        if(uploadifyQueueItem){
				        	//删除uploadifyQueueItem	
				        	uploadifyQueueItem.remove();
				        }				        
				        //删除imgBox					        	
			        	$that.closest(".imgBox").remove();
			        }				    
				})
				return false;
			})
		}	
		/*end of isMultiImg 公益组织 活动新增 添加删除功能*/
		/*isAdvertisement 广告位添加删除功能*/
		if(defaultOption.isAdvertisement){
			$("#"+defaultOption.queueID).on("click",".delete",function(event){
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
		}
		/*end of isAdvertisement 广告位添加删除功能*/
		$("#"+selfId+"Uploader").attr("title","仅支持"+defaultOption.fileExt+"格式的文件");
	};
	
	$.fn.addUploadFileValue = function(option){
		var self = $(this);
		var defaultOption={
			id:"",
			fileName:"",
			filePath:"",
			fileType:"",
			filesize:"",
			link:"javascript:void(0)",
			showCloseButton:true,
			onRemove:function(id){}
		};
		$.extend(defaultOption,option);
		if(option.onRemove){
			defaultOption.onRemove=function(){
				option.onRemove.call(null,defaultOption.id);
			};
		};
		
		// 文件大小显示
		var fileSizeMsg="";
		if(defaultOption.filesize!=""&&defaultOption.filesize!=0){
			fileSizeMsg = '('+defaultOption.filesize+')';
		};
		// 删除按钮
		if(defaultOption.showCloseButton){
			var canelHtml='<div class="cancel"><a href="javascript:void(0)" id="'+$(this).attr("id")+defaultOption.id+'"><img src="/resource/js/external/uploadify/delete.jpg" border="0"></a></div>';
		}else{
			var canelHtml='';
			$("#custom_file_uploadUploader").remove();
		};
		var itemHtml = '<div id="'+defaultOption.fileName+';'+defaultOption.filePath+';'+defaultOption.fileType+'" class="uploadifyQueueItem completed">'+canelHtml+'<a href="'+defaultOption.link+'" target="_blank"><span title="'+defaultOption.fileName+'" class="fileName">'+defaultOption.fileName+' '+fileSizeMsg+'</span></a></div>';
		$(this).append(itemHtml);		
	}
	
	$.flashVersion=function(){
		var up=false;
		var p = navigator.plugins;
		var f;
        if (p && p.length) {
            for (var i = 0; i < p.length; i++) {
                if (p[i].name.indexOf('Shockwave Flash') > -1) {
                    if(p[i].description.split('Shockwave ')[1]<="Flash 6.0 r154"){
                    	//up=false;
                    }
                    break;
                }
            }
        } else if (window.ActiveXObject) {
            for (var j=9;j>=6;j--) {
                   try {   
                    var fl=eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash."+j+"');");
                    if (fl) {
                        f=j + '.0';
                        break;
                    }
                   }
                   catch(e) {}
            }
            if(f<="6.0"){
            	up=true;
            }
        }
        if(up){
        	return '<div id="flashMessage">您当前的flash版本过低，导致上传功能暂时无法使用，请<a href="http://get.adobe.com/cn/flashplayer/" target="_blank">点击这里</a>进行升级。</div>';
        }
        else{
        	return false;
        }
	}
})(jQuery);