TQ.index = function(){
	//退出
	$('.loginOut').click(function(){
		$.confirm({
			width:360,
			height:220,
			level: "warn",
			title:'确认退出',
			message:'确定要退出？',
			okFunc: function(){
		    	document.location.href = "/logout";
					
			}
		});
	});
	//修改密码样式
	$(".accountInfo").hover(function(){
		$(this).find(".settingTigger").addClass("on");
		$(".pullDownList").show();
	},function(){
		$(this).find(".settingTigger").removeClass("on");
		$(".pullDownList").hide();
	});
	
	//修改密码
	$('.userCont').on('click','.settingPassword',function(){
		$("#setDialog").createDialog({
			width:360,
			height:400,
			title:'修改密码',
			url:'/common/updatePwd',
			buttons:{
				"保存":function(event){
					$("#settingForm").submit();
				},
				"取消":function(){
					$(this).dialog("close");
				}
			}
		});
	});
	
	//banner
	var index=0;
	$(".bannerControl li").hover(
		function(){
			var index = $(this).index();
			slider(index);
		}
	);
	var slider =function(index){
		$(".bannerControl li").removeClass("current").eq(index).addClass("current");
		$(".banner li").removeClass("current");
		$(".banner li").eq(index).addClass("current");
	};
	var auto=setInterval(function(){
		if($(".banner li").length<1){
			clearInterval(auto);
		}
		index++;		
		if(index>($(".banner li").length-1)){
			index=0;
		}
		slider(index);
	},3000);
	$(".bannerBox").hover(function(){
		clearInterval(auto);
	},function(){
		auto=setInterval(function(){
			index++;
			if(index>($(".banner li").length-1)){
				index=0;
			}
			slider(index);
		},3000);
	});
	
	
	
	var dp={
			second:false,
			secondVal:"",
			third:false,
			thirdVal:""
	};
	function baseLoad(that,url){
		if(url != undefined){			
			asyncOpen(that, url,dp);
		}else{
			showPageByTopMenu("");//如果没有url,跳转回首页
		}
	}
	var loadPage = function(obj){
		var that 	= $(obj),
			url		= that.attr("url"),	
			h3      = $('#accordion .item h3'),
			uiContBase = $('#accordion .uiContBase a');
		h3.removeClass("uiMenuCur");
		that.closest(".item").find("h3").addClass("uiMenuCur");  
		if(that.hasClass("isHead")){//点击是一级菜单
			if(that.hasClass("hasChild")){//该一级菜单有子菜单					
				uiContBase.removeClass("cur");
				that.parent("h3").next(".uiContBase").find("a").eq(0).addClass("cur");
				url = that.parent("h3").next(".uiContBase").find("a").eq(0).attr("url");//重置url为第一个子元素的url.
				that.attr("url",url);
				that.closest(".item").siblings(".item").find(".uiContBase").addClass("hidden");//隐藏别的子类
				that.parent("h3").next(".uiContBase").removeClass("hidden");//展示当前子类
				//获取面包线的值
				dp.second=true;
				dp.secondVal=that.text();
				dp.third=true;
				dp.thirdVal=that.parent("h3").next(".uiContBase").find("a").eq(0).find("span").text();
			}else{
				//没有二级菜单就去掉所有二级菜单的选中类
				uiContBase.removeClass("cur");
				that.closest(".item").siblings(".item").find(".uiContBase").addClass("hidden");//隐藏别的子类
				//获取面包线的值
				dp.second=true;
				dp.secondVal=that.text();
				dp.third=false;
			}
		}else{
			//点击的是二级菜单
			uiContBase.removeClass("cur");
			that.addClass("cur");
				that.closest(".item").siblings(".item").find(".uiContBase").addClass("hidden");//隐藏别的子类
				that.closest(".uiContBase").removeClass("hidden");//展示当前子类
			//获取面包线的值
			dp.second=true;
			dp.secondVal=that.closest(".item").find("h3").find(".linkItem").text();
			dp.third=true;
			dp.thirdVal=that.find("span").text();
		}	
		
	}
	function sideMenuFun(){
		var linkItem = $('#accordion .linkItem');
        linkItem.on("click",function(){
        	//如果有ID为bannerReturn，说明是未通过hash来跳转的页面，比如grid下面的修改页面。
        	if($("#bannerReturn")[0]&&$(this).hasClass("cur") || $("#bannerReturn")[0]&&$(this).closest("h3").hasClass("uiMenuCur")){
        		$("#bannerReturn").trigger("click");
        	}        	
        	//end of 如果有ID为bannerReturn，说明是未通过hash来跳转的页面，比如grid下面的修改页面。
        	//如果有tip-error类，说明页面有验证未通过的情况，同时要跳转页面，为防止这些提示在跳转的页面显示，要去掉。
        	if($(".tip-error")){        		
        		$(".tip-error").remove();
        	}
        	//end of 如果有tip-error类，说明页面有验证未通过的情况，同时要跳转页面，为防止这些提示在跳转的页面显示，要去掉。
        	//确定页面跳转和选中的类
			loadPage(this);	
			//end of 确定页面跳转和选中的类
        });
	}
	sideMenuFun();
	function showPageByTopMenu(topMenu){
		var menuType;		
		topMenu=='' ? topMenu="index" : topMenu=topMenu;			
		$("#indexCommonView").empty();		
		try{			
			if(topMenu=='index'){//如果是首页
				$(".loading").show();
				var firstUrl = "";
				var firstUrlParent = $(".leftMenu .innerBox .item:first h3:first a").attr("url");
				var firstUrlChild = $(".leftMenu .innerBox .item:first ul li:first a").attr("url");
				var expectIndexUrl = $(".leftMenu .item:first h3:first a").attr("url");
				if(firstUrlParent) {
					firstUrl = firstUrlParent;
				}else {
					firstUrl = firstUrlChild;
				}
				var leftMenuItem = $("#accordion .item");
				if(leftMenuItem.length>1){
					$("#accordion .item").find(".uiContBase").addClass("hidden");
					var firstContBase=$(".leftMenu .innerBox .item:first .uiContBase");
					if(firstContBase.length>0){
						firstContBase.removeClass("hidden");
						firstContBase.find("ul li:first a:first").addClass("cur");
					}
				}
				
				$("#indexCommonView").load(firstUrl,function(){
					//为面包线赋值并显示
					if(dp.second&&dp.secondVal){
						$("#firstBanner .second").find("a").text(dp.secondVal).end().removeClass("hidden");
					}
					if(dp.third&&dp.thirdVal){
						$("#firstBanner .third").find("a").text(dp.third).end().removeClass("hidden");
					}
					//placeholder
					setTimeout(function(){
						//$('input, textarea').placeholder();	
						$("#indexCommonView").refreshPlaceholder();  
					},200);
				});
				if(firstUrlParent==undefined){
					firstUrl = expectIndexUrl;
					var aTxt = $(".leftMenu .item:first h3.uiMenuCur a");
					if(aTxt.attr("url")==firstUrl){
						var topMenuId = aTxt.attr("id");
						baseLoad(topMenuId,firstUrl);
					}

				}

			}else{
				//如果是内页				
				loadPage($("#id"+topMenu));	
				baseLoad($("#id"+topMenu),$("#id"+topMenu).attr("url"));
			}
		}
		catch(err){
			$(".loading").hide();
			$.messageBox({message:'系统出错，请刷新页面重试',level:'error'});
			throw new Error(err);
		}
	}
	var getHash= function(window) {
		function getQueryString(name) {
		    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		    var r = window.location.search.substr(1).match(reg);
		    if (r != null) return unescape(r[2]); return null;
	    }
        var match = (window || this).location.href.match(/#(.*)$/);
        var hash=match ? match[1] : '';
		if(hash.indexOf("?")!=-1){
	        hash=hash.substring(0,hash.indexOf("?"));
	    }
        return hash;
    }
	$(window).hashchange( function(){
	    var hash = getHash(window);
	    setTimeout(function(){
	    	showPageByTopMenu(hash);
	    },300);
	})
	$(window).hashchange();
	
	$("body").on("click","#bannerReturn",function(){
		var url = $(this).attr("url");
		$.ajax({
    		url:url,
    		async:false,
    		type:"GET",
    		success:function(data){
    			if(data){    			   			
    				$("#indexCommonView").html("").html(data);
    				setTimeout(function(){
    					$(".ui-layout-west").height($(".ui-layout-center").height());
    				},600);
    			}
    		}
    	});
	});	
	$("body").on("click",".link_menu",function(){
		var url = $(this).attr("url");
		if(url==null || url==''){
			return;
		}
		$.ajax({
			url:url,
			async:false,
			type:"GET",
			success:function(data){
				if(data){    			   			
					$("#indexCommonView").html("").html(data);
					setTimeout(function(){
						$(".ui-layout-west").height($(".ui-layout-center").height());
					},600);
				}
			}
		});
	});	
	
	
}
