$(document).ajaxComplete(function(event,xhr,options){
	if (xhr.responseText === '{"code":1001,"data":"","msg":"您的账号已失效，请重新登录."}'|| xhr.responseText === '{"code":1001,"data":"","msg":"您的账号已再别处登陆."}') {
    	location.href='login';
    }
});
$.ajaxSetup({
    cache:false
});
$.cacheScript = function(obj) {
	var version="1.0";
	var cache = (obj.cache === undefined) ? 'true' : obj.cache;
	$.ajax({
		type: 'GET', 
		url: obj.url+"?"+version, 
		dataType: 'script', 
		ifModified: true, 
		cache: cache,
		success:function(){
			obj.callback();	
		}	
	});
};
function loadPage(url,cont){
	var cont = $(cont);
	$.ajax({
		type: 'GET', 
		url: url, 
		success:function(data){
			cont.html("").append(data);
		}	
	});
}
//tab切换
function tabsFun(tit,cont){
	var tit = $(tit),cont = $(cont);
	tit.on('click',function(){
		var index = $(this).index();
		$(this).addClass("on").siblings().removeClass("on");
		cont.eq(index).show().siblings().hide();
	})
}
$.extend({
	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type") || "",
			xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.nodeName === "parsererror" ) {
			jQuery.error( "parsererror" );
		}

		// Allow a pre-filtering function to sanitize the response
		// s is checked to keep backwards compatibility
		if ( s && s.dataFilter ) {
			data = s.dataFilter( data, type );
		}

		// The filter can actually parse the response
		if ( typeof data === "string" ) {
			// Get the JavaScript object, if JSON is used.
			if ( type === "json" || !type && ct.indexOf("json") >= 0 ) {
				data = jQuery.parseJSON( data );

			// If the type is "script", eval it in global context
			} else if ( type === "script" || !type && ct.indexOf("javascript") >= 0 ) {
				jQuery.globalEval( data );
			}
		}

		return data;
	},
	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) {
			s.error.call( s.context, xhr, status, e );
		}

		// Fire the global callback
		if ( s.global ) {
			jQuery.triggerGlobal( s, "ajaxError", [xhr, s, e] );
		}
	},
	layout:function(option){
		function layoutFun(){
			var documentHeight=document.documentElement.clientHeight
				-$(".ui-layout-north").outerHeight(true)
				-$(".ui-layout-south:visible").outerHeight(true);
			var rightWidth=document.documentElement.clientWidth-$(".ui-layout-west:visible").width();
			$(".ui-layout-center,.ui-layout-west").height(documentHeight);
			$("#countMain").closest("#contentDiv").height(documentHeight-12);//统计页面无grid,table父层需高100%撑开
			setTimeout(function(){
				$(".center-left").height(documentHeight-$("#contentDiv>.newNavTop").outerHeight(true)-54)
				$(".orgObjContent").height(documentHeight-$("#contentDiv>.newNavTop").outerHeight(true)-$(".center-left h4").outerHeight(true)-$(".center-left .autosearch").outerHeight(true)-$("#editModeBox").outerHeight(true) -80);
				$("#dutyAreaList").height(documentHeight).scrollTop(0);
			},500)	
			$(".ui-layout-north dl.sysMenuList").width(document.documentElement.clientWidth);//ie6 bug
			if(window._currentGrid!=undefined && !window._currentGrid.closest(".leaderCon")[0] && !window._currentGrid.closest(".workbenchTabList")[0] && window._currentGrid.closest(".ui-layout-center")[0]){
				window._currentGrid.setGridWidth(rightWidth-$(".superviseCenterRight:visible").width()-$("#contentDiv .center-left").width()-$("#contentDiv .center-content-right").width()-85).setGridHeight(documentHeight-$("#nav:visible").outerHeight(true)-$("#thisCrumbs:visible").outerHeight(true)-$(".content-top").height()-$("#content-top").height()-$(".groupNav").height()-$("#commonPopulation:visible").outerHeight(true)-$("#tabList .ui-tabs-nav").outerHeight(true)-$("#contractCommonPopulation").outerHeight(true)-$("#statistics").height()-$(".center-right .newNavBottom").outerHeight(true)-$("#contentDiv>.newNavTop").outerHeight(true)-105);
			}
		}
		layoutFun();
		$(window).resize(function(){
			clearTimeout(window._layoutTimer);
			window._layoutTimer=setTimeout(function(){
				layoutFun();
			},300);
		});
		$(".slideResizer .slideToggler").toggle(function(){//缩进条按钮事件
			$(".ui-layout-west").hide();
			$(".slideResizer .slideToggler").addClass("slideTogglerCur").attr("title","展开");
			layoutFun();
			$(window).trigger("resize");
		},function(){
			$(".ui-layout-west").show();
			$(".slideResizer .slideToggler").removeClass("slideTogglerCur").attr("title","缩进");
			
			layoutFun();
			$(window).trigger("resize");
		});
	},
	messageBox : function(options) {
		var dfop={
			message: false,
			level: "success",
			speed: 500,
			life:2000
		};
		$.extend(dfop, options);
		if(options=='close'){
			$("#jGrowl").removeAttr("style").empty();
			return false;
		}
		if(!$("#jGrowl")[0]){
			$("body").append("<div id='jGrowl'></div>");
		}else{
			$("#jGrowl").removeAttr("style").empty();
		}
		dfop.message='<div class="'+dfop.level+'"><span></span>'+dfop.message+'</div>';
		$("#jGrowl").addClass("jGrowl").append(dfop.message).animate({top:'50%'},dfop.speed);
		function hideMessageBox(){
			clearTimeout(window._messageBox);
			window._messageBox=setTimeout(function(){
				$("#jGrowl").remove();
			},dfop.life);
		}
		hideMessageBox();
		$("#jGrowl").hover(function(){
			clearTimeout(window._messageBox);
		},function(){
			hideMessageBox();
		});
	},
	loadingComp:function(option){       // loading状态控件 - 用于jqgrid
		var _init=function(){
			$("body").prepend('<div class="dialog_loading"><div class="loadingcon"></div></div>');
		};
		if(typeof(option)=='string'){
            if(option=="open"){
                _init();
                $(".dialog_loading").show();
            };
            if(option=="close"){
                $(".dialog_loading").remove();
            }
		};
	},

    fillFormElem:function(op){        //获取数据字典项
        var o = $.extend({
            //getPageDataUrl:'system/sysUser/getById.action',          // 请求页面数据所需要的
            //getDataId:setData.id,                                    // 修改模式下所需要的id
            tplId:'',        // 模版的id
            viewModId:'',    // 生成好的页面插入到这个id
            setData:'',      // 新增模式下说需要的
            maps:'',         // 请求select所用的id
            callback:null    // 某些情况需要回调执行一些方法

        },op||{});

        var obj = {
            data:{},
            pageData:null,
            elemData:null,
            renderTpl:function(tplId,data){
                var html = template.render(tplId,data);      //渲染模版
                $('#'+ o.viewModId).append( html)
                    .find('select').each(function(){
                        $(this).val( $(this).attr('dfVal') )

                    });
                if( $.isFunction(o.callback)  ){ o.callback(obj.data) }

            },
            mergerData:function(a,b){
            },
            init:function(){
            	function setElemData(elemData){
                    obj.elemData = elemData;

                    if(!o.getPageDataUrl && !obj.pageData){
                        obj.data = o.setData;
                        obj.data.elemData = obj.elemData;
                        obj.renderTpl(o.tplId,obj.data);
                    }else if(o.getPageDataUrl && obj.pageData){
                        obj.data = $.extend(obj.pageData, o.setData||{});
                        obj.data.elemData = obj.elemData;
                        obj.renderTpl(o.tplId,obj.data);
                    }
            	}
            	if(o.maps){
	                $.ajax({
	                    url:'system/sysDict/getDict.action',
	                    data:{"maps": o.maps,"appId":OAPPID},
	                    success:setElemData
	                });
            	}else{
            		setElemData('');
            	}

                if(o.setData.mode == 'edit' || o.setData.mode == 'copy'){
                    $.ajax({
                        url: o.getPageDataUrl,
                        data:{'id': o.getDataId},
                        success:function(pageData){
                            obj.pageData = pageData;
                            if( obj.elemData || !o.maps ){
                                obj.data = $.extend(obj.pageData, o.setData||{});
                                obj.data.elemData = obj.elemData;
                                obj.renderTpl(o.tplId,obj.data);
                            }
                        }
                    });
                }
            }
        };
        obj.init();
    }
});

$.fn.extend({
	serializeFormJSON : function() {
	   var o = {};
	   var a = this.serializeArray();
	   $.each(a, function() {
	       if (o[this.name]) {
	           if (!o[this.name].push) {
	               o[this.name] = [o[this.name]];
	           }
	           o[this.name].push(this.value || '');
	       } else {
	           o[this.name] = this.value || '';
	       }
	   });
	   return o;
	},
	gridRowRightClick:function(o){
		var self=$(this);
		var dfop = { 
			width: 150, 
			items: [
				{text: "新增记录", icon: "resource/external/contextmenu/css/images/icons/add.png", alias: "add", action: function(){
					$("#add").click();
				}},
				{text: "修改记录", icon: "resource/external/contextmenu/css/images/icons/edit.png", alias: "edit", action: function(){
					var selectId=self.data("selectid");
					if(selectId && typeof updateOperator=='function'){
						updateOperator(selectId);
					}
				}},
				{text: "删除记录", icon: "resource/external/contextmenu/css/images/icons/del.png", alias: "del", action: function(){
					var selectId=self.data("selectid");
					if(selectId && typeof deleteOperator=='function'){
						deleteOperator(selectId);
					}
				}},
				{text: "高级搜索", icon: "resource/external/contextmenu/css/images/icons/search.png", alias: "search", action: function(){
					$("#search").click();
				}},
				{text: "刷新", icon: "resource/external/contextmenu/css/images/icons/refresh.png", alias: "reload", action: function(){
					$("#reload").click();
				}}
			], 
			onShow: applyrule,
			onContextMenu: BeforeContextMenu
		};
		$.extend(dfop,o);
		
		function applyrule(menu) {               
			if (this.id == "target2") {
				menu.applyrule({ 
					name: "target2",
					disable: true,
					items: ["1-2", "2-3", "2-4", "1-6"]
				});
			}else {
				menu.applyrule({ 
					name: "all",
					disable: true,
					items: []
				});
			}
		}
		
		function BeforeContextMenu() {
			return this.id != "target3";
		}
		self.contextmenu(dfop);
	},
	dialogtip:function(option){     // formValidate组件调用
		var defaultOption={
			className: 'tip-error',
			showOn: 'none',
			alignTo: 'target',
			hideTimeout:0,
			showTimeout:0,
			alignX: 'center',
			alignY: 'bottom',
			offsetX: 0,
			offsetY: 5
		};
		$.extend(defaultOption,option);
		$(this).poshytip(defaultOption);
	},
	isButtonEnabled:function(){
		return !($(this).attr("disabled")=="true" || $(this).attr("disabled")=="disabled");
	},
	buttonDisable:function(){
		$(this).addClass("disabled");
	},
	buttonEnable:function(){
		$(this).removeClass("disabled");
	},
	datePicker : function(o) {
		var self = $(this);
		var dfop={
			showWeek: false,
			changeMonth: true,
			changeYear: true,
			yearSuffix: '',
			dateFormat:'yy-mm-dd HH:mm:ss',
			showButtonPanel: true,
			showClearButton:true
		};
		$.extend(dfop,o);
		if(!$("#ui-datepicker-div").attr("id")){
			$.datepicker.initialized = false;
		}
		self.datepicker(dfop);
	},

	pop:function(options){      // isPopExtend
		var self=$(this);
		var selfId=$(this).attr("id");
		var conId=selfId+new Date().getTime();
		var thisWindow = {
			l: $(window).scrollLeft(),
			t: $(window).scrollTop(),
			w: $(window).width(),
			h: $(window).height()
		};
		var defaultOption={
			className: 'tip-yellowsimple',
			hideTimeout:0,
			showTimeout:0,
			offsetX: 5,
			offsetY: 0,
			showOn: 'none',
			alignTo: 'target',
			alignX: 'right',
			alignY: 'center',
			openNew:true,
			content:function(){}
		};
		$.extend(defaultOption,options);
		var target='_blank';
		if(defaultOption.openNew!=true){
			target='_self';
		}
		if(defaultOption.content==null || defaultOption.content==""){
			defaultOption.content='<div class="popupcon" id="'+conId+'">暂无人员类型</div>';
		}else{
			defaultOption.content='<div class="popupcon" id="'+conId+'">人员类型：'+defaultOption.content+'</div>';
		}
		
			
		var init=function(){
			var tipMsg = self.parent().attr("title");
			if(tipMsg && tipMsg!=""){
				 self.parent().attr("title","");
			}
			self.poshytip(defaultOption);
			$(".tip-yellowsimple").bgiframe();
		};
		
		self.hover(
			function(){
				if(self.offset().left+300>thisWindow.w){
					defaultOption.alignX="left";
				}
				else{
					defaultOption.alignX="right";
				};
				init();
				self.poshytip("show");
			},
			function(){
				self.poshytip("hide");
		});
	},
	statisticsAutoHeight:function(){
        var wrapHeight = null,
            wrapWidth = null,
            tableHeight = null,
            layout=function(){
                wrapWidth=$(".ui-layout-center").width()-400;
                wrapHeight=($(".ui-layout-center").height()-$("#thisCrumbs").outerHeight()-$("#contentDiv > .btnbanner").outerHeight()-$(".leaderTit").outerHeight()*2)/2-28;
                tableHeight=wrapHeight-50;
                $(".highcharts-container,.warpTable").height(wrapHeight);
                $(".highcharts-container").width(wrapWidth);
            }
        layout();
        $(window).resize(function(){
            layout();
        })
        return {
            wrapHeight:wrapHeight,
            tableHeight:tableHeight
        };
    }
});
//newplaceholder
;(function ($) {
	$.fn.clearNewplaceholder = function(option){
		var self=$(".searchBar");		
			if ($.browser.msie && $.browser.version<10.0){
				if(self.find(".newplaceholder")){					
					$(".newplaceholder",self).each(function(i,elem){					
						 var _placeholder = $(elem).attr('newplaceholder');
			          	 if ($(elem).val() === _placeholder) {
		          	        	$(elem).val('');		          	        	
		          	     }
					}) 
				}
			}
	};

	$.fn.refreshPlaceholder = function(option){
		var self=$(".searchBar");		
		if ($.browser.msie && $.browser.version<10.0){
			if(self.find(".newplaceholder")){
				$(".newplaceholder",self).each(function(i,elem){
					var _placeholder = $(elem).attr('newplaceholder'); 
		          	   $(elem).focus(function() {				          		   
		          	        if ($(elem).val() === _placeholder) {
		          	        	$(elem).val('')
		          	        }
		          	    }).blur(function() {
		          	        if ($(elem).val().length === 0) {
		          	        	$(elem).val(_placeholder)
		          	        }
		          	    })
					$(elem).focus();				          	 
		          	$(elem).blur();
				});
			}
		}         
	};
	$.fn.serviceType = function(option){
		var self=$(this);
		var dp={				
				isAreaType      : false,//是否是运行覆盖类型
				isServiceType   : false,//是否是运行服务类型
				isHasParentData : false,//是否有第一级的数据
				isAutoGetDate   : false,//是否自动获取各级数据，如果是，就手动点击各级的pointer，cursor获取各级数据
				parentUrl       : "",   //第一级请求的地址
				parentId        : "",   //第一级请求的id
				parentData      : "",	//第一级的数据
				checkData       : "",	//所有被选中的数据集合
				isHaschildData  : false,//是否有第二级的数据
				childUrl        : "",	//第二级请求的地址
				childId         : "",	//第二级请求的id
				childData       : "",	//第二级的数据	
				createParentLi  :function(data){//创建第一级的li
					var li="";
					for(i=0;i<data.length;i++){
						var isChecked="";
						if(dp.checkData.length>0){
							var checkData = JSON.parse(dp.checkData);
							for(j=0;j<checkData.length;j++){
								if(checkData[j]==data[i].id){
									isChecked="checked='checked'";
									break;
								}
							}														
						}
						if(dp.isAreaType){
							li+="<li class='item hold' liid='"+ data[i].id +"'><span class='pointer'></span><label><input class='parentInput' inputid='"+ data[i].id +"' "+ isChecked +" type='checkbox' />"+data[i].orgName+"</label></li>";
						}else if(dp.isServiceType){
							li+="<li class='item hold' liid='"+ data[i].id +"'><span class='pointer'></span><label><input class='parentInput' inputid='"+ data[i].id +"' "+ isChecked +" type='checkbox' />"+data[i].name+"</label></li>";
						}
					}					
					self.find(".parentItem").append(li);
				},
				createChildLi  :function(data,parentLi){//创建第二级的li
					var li="";
					for(i=0;i<data.length;i++){
						var isChecked="";
						if(dp.checkData.length>0){
							var checkData = JSON.parse(dp.checkData);
							for(j=0;j<checkData.length;j++){
								if(checkData[j]==data[i].id){
									isChecked="checked='checked'";
									break;
								}
							}														
						}
						if(dp.isAreaType){
							li+="<li class='subItem holding' liid='"+ data[i].id +"'><span class='cursor'></span><label><input class='childInput' inputid='"+ data[i].id +"' "+ isChecked +" type='checkbox' />"+data[i].orgName+"</label></li>";
						}else if(dp.isServiceType){
							li+="<li class='subItem' liid='"+ data[i].id +"'><label><input class='childInput' inputid='"+ data[i].id +"' "+ isChecked +" type='checkbox' />"+data[i].name+"</label></li>";
						}
					}	
					parentLi.find(".childItem").append(li);
				},
				createGrandsonLi  :function(data,parentLi){//创建第三级的li
					var li="";
					for(i=0;i<data.length;i++){
						var isChecked="";
						if(dp.checkData.length>0){
							var checkData = JSON.parse(dp.checkData);
							for(j=0;j<checkData.length;j++){
								if(checkData[j]==data[i].id){
									isChecked="checked='checked'";
									break;
								}
							}														
						}
						if(dp.isAreaType){
							li+="<li class='grandsonItem' liid='"+ data[i].id +"'><label><input class='grandsonInput' inputid='"+ data[i].id +"' "+ isChecked +" type='checkbox' />"+data[i].orgName+"</label></li>";
						}else if(dp.isServiceType){
							li+="<li class='grandsonItem' liid='"+ data[i].id +"'><label><input class='grandsonInput' inputid='"+ data[i].id +"' "+ isChecked +" type='checkbox' />"+data[i].name+"</label></li>";
						}
					}	
					parentLi.find(".grandsonItems").append(li);
				}
		}
		$.extend(dp,option||{});
		self.empty();
		var ul = '<ul class="parentItem"></ul>';
		self.append(ul);
		if(dp.isHasParentData){		
			dp.createParentLi(JSON.parse(dp.parentData));
		}else{
			if(dp.isAreaType){
				$.ajax({
					type:'post',
					url:dp.parentUrl,
					dataType:'json',
					async:false,
					data:{"id":dp.parentId},
					success:function(data){					
						var districtValues = data.organizationList;
						dp.createParentLi(districtValues);					
					}
				});
			}else if(dp.isServiceType){				
				$.ajax({
					type:'post',
					url:dp.parentUrl,
					dataType:'json',
					async:false,					
					success:function(data){					
						var districtValues = data.data;
						dp.createParentLi(districtValues);					
					}
				});
			}
			
		}
		var bindEvent =function(){
			//获取subitem
			self.on("click",".pointer",function(){
				var parentLi=$(this).closest("li");
				if(parentLi.hasClass("hold")){
					parentLi.removeClass("hold").addClass("extend");
					if(parentLi.find("ul").length>0){
						return;
					}
					var ul = '<ul class="childItem"></ul>';
					parentLi.append(ul);
					var liId = parentLi.attr("liid");
					if(dp.isAreaType){
						$.ajax({
							type:'post',
							url:dp.childUrl,
							dataType:'json',
							async:false,
							data:{"id":liId},
							success:function(data){					
								var districtValues = data.organizationList;
								dp.createChildLi(districtValues,parentLi);					
							}
						});	
					}else if(dp.isServiceType){
						$.ajax({
							type:'post',
							url:dp.childUrl,
							dataType:'json',
							async:false,
							data:{"parentId":liId},
							success:function(data){				
								var districtValues = data.data;
								dp.createChildLi(districtValues,parentLi);					
							}
						});
					}
									
				}else if(parentLi.hasClass("extend")){
					parentLi.removeClass("extend").addClass("hold");
				};
			});
			//获取grandson
			self.on("click",".cursor",function(){
				var parentLi=$(this).closest("li");
				if(parentLi.hasClass("holding")){
					parentLi.removeClass("holding").addClass("extending");
					if(parentLi.find("ul").length>0){
						return;
					}
					var ul = '<ul class="grandsonItems"></ul>';
					parentLi.append(ul);
					var liId = parentLi.attr("liid");
					if(dp.isAreaType){
						$.ajax({
							type:'post',
							url:dp.childUrl,
							dataType:'json',
							async:false,
							data:{"id":liId},
							success:function(data){					
								var districtValues = data.organizationList;
								dp.createGrandsonLi(districtValues,parentLi);					
							}
						});	
					}else if(dp.isServiceType){
						$.ajax({
							type:'post',
							url:dp.childUrl,
							dataType:'json',
							async:false,
							data:{"parentId":liId},
							success:function(data){					
								var districtValues = data.data;
								dp.createChildLi(districtValues,parentLi);					
							}
						});
					}
									
				}else if(parentLi.hasClass("extending")){
					parentLi.removeClass("extending").addClass("holding");
				};
			});		
			
			//parentInput
			self.on("click","input",function(){				
				if($(this).hasClass("parentInput")){//点击的是第一级的input					
					if($(this).prop("checked")){
						if($(this).closest("li").find("ul").length>0){
							$(this).closest("li").find("ul").find("input").prop("checked",true)
						}
					}else{
						if($(this).closest("li").find("ul").length>0){
							$(this).closest("li").find("ul").find("input").prop("checked",false)
						}
					}					
				}else if($(this).hasClass("childInput")){//点击的是第二级的input					
					if($(this).prop("checked")){
						//父层选中
						if($(this).closest(".item").find(".parentInput").length>0){
							$(this).closest(".item").find(".parentInput").prop("checked",true)
						}
						//子层选中
						if($(this).closest("li").find("ul").length>0){
							$(this).closest("li").find("ul").find("input").prop("checked",true)
						}
					}else{
						//子层全不选中
						if($(this).closest("li").find("ul").length>0){
							$(this).closest("li").find("ul").find("input").prop("checked",false);
						}
						//父层是否选中
						if($(this).closest("ul").find(".subItem").length>1){//同级不只有一个li，判断别的li的input是否选中，进而判断父层是否选中
							var childInput = $(this).closest(".childItem").find("input");
							var flag=0;
							$.each(childInput,function(i,d){
								if($(this).prop("checked")){
									flag+=1;									
								}
							})
							if(flag==0){
								$(this).closest(".item").find(".parentInput").prop("checked",false);
							}else{
								$(this).closest(".item").find(".parentInput").prop("checked",true);
							}					
						}else{
							//同级只有一个li且input未选中，则父层也未选中
							$(this).closest(".item").find(".parentInput").prop("checked",false);
						}
						
					}	
				}else if($(this).hasClass("grandsonInput")){//点击的是第三级的input
					if($(this).prop("checked")){
						//父层选中
						if($(this).closest(".subItem").find(".childInput").length>0){
							$(this).closest(".subItem").find(".childInput").prop("checked",true);
						}
						//祖父层选中
						if($(this).closest(".item").find(".parentInput").length>0){
							$(this).closest(".item").find(".parentInput").prop("checked",true);
						}
					}else{
						if($(this).closest("ul").find(".grandsonItem").length>1){//同级不只有一个li，判断别的li的input是否选中，进而判断父层是否选中
							var grandsonInput = $(this).closest(".grandsonItems").find("input");
							var flag=0;
							$.each(grandsonInput,function(i,d){
								if($(this).prop("checked")){
									flag+=1;									
								}
							})
							if(flag==0){
								$(this).closest(".subItem").find(".childInput").prop("checked",false);
								//祖父层是否选中
								if($(this).closest(".childItem").find(".subItem").length>1){//同级不只有一个li，判断别的li的input是否选中，进而判断父层是否选中
									var childInput2 = $(this).closest(".childItem").find("input");
									var flagg=0;
									$.each(childInput2,function(i,d){
										if($(this).prop("checked")){
											flagg+=1;									
										}
									})
									if(flagg==0){
										$(this).closest(".item").find(".parentInput").prop("checked",false);
									}else{
										$(this).closest(".item").find(".parentInput").prop("checked",true);
									}					
								}else{
									//同级只有一个li且input未选中，则父层也未选中
									$(this).closest(".item").find(".parentInput").prop("checked",false);
								}
							}else{
								$(this).closest(".subItem").find(".childInput").prop("checked",true);
							}					
						}else{
							//同级只有一个li且input未选中，则父层也未选中
							$(this).closest(".subItem").find(".childInput").prop("checked",false);
							//祖父层是否选中
							if($(this).closest(".childItem").find(".subItem").length>1){//同级不只有一个li，判断别的li的input是否选中，进而判断父层是否选中
								var childInput2 = $(this).closest(".childItem").find("input");
								var flagg=0;
								$.each(childInput2,function(i,d){
									if($(this).prop("checked")){
										flagg+=1;									
									}
								})
								if(flagg==0){
									$(this).closest(".item").find(".parentInput").prop("checked",false);
								}else{
									$(this).closest(".item").find(".parentInput").prop("checked",true);
								}					
							}else{
								//同级只有一个li且input未选中，则父层也未选中
								$(this).closest(".item").find(".parentInput").prop("checked",false);
							}
						}
					}	
				}
			})
			//是否自动获取数据
			if(dp.isAutoGetDate){				
				setTimeout(function(){
					if(self.find(".pointer").length>0){
						self.find(".pointer").each(function(i,d){
							$(this).trigger("click");
							if($(this).closest(".item").hasClass("extend")){
								$(this).closest(".item").removeClass("extend").addClass("hold");
							}	
						})
					}
					if(self.find(".cursor").length>0){
						self.find(".cursor").each(function(i,d){
							$(this).trigger("click");
							if($(this).closest(".subItem").hasClass("extending")){
								$(this).closest(".subItem").removeClass("extending").addClass("holding");
							}	
						})
					}
				},2000)				
			}
		}
		bindEvent();
	};	
	
	
	$("#indexCommonView").on('click','#bannerReturn',function(event){
		var url = $(this).attr("url");
    	$.ajax({
    		url:url,
    		async:false,
    		type:"GET",
    		data:{},
    		success:function(data){
    			if(data){
    				$("#indexCommonView").html("").html(data);
    				setTimeout(function(){
    					$(".ui-layout-west").height($(".ui-layout-center").height());
    				},600)
    			}
    		}
    	});
    });	
})(jQuery);