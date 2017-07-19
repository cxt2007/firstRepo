function asyncOpen(srcObj, url,dp) {
	if(url==undefined || url==''){
		$.messageBox({message:'系统地址出错，请联系管理员',level:'error'});
		return;
	}
	
	$("#indexCommonView").html("");
	$("#loading").show();
	if(window.ajaxRequest){
    	window.ajaxRequest.abort();
	}
	window.ajaxRequest=$.ajax({
		url : url,
		cache: false,
		async: false,
		success : function(result) {
			//proccessLoginResult(result,function(){
				$("#loading").hide();
				$("#indexCommonView").empty();
				$("#indexCommonView").html(result);
				var vHeight = $(".ui-layout-center").height(),
					wHeight = document.documentElement.clientHeight-$(".ui-layout-north").height();
		    	if(vHeight>700){
		    		$(".ui-layout-west,.ui-layout-center").removeClass('minHeight');
		    		$(".ui-layout-west").height(vHeight);
		    	}else{
		    		$(".ui-layout-west").addClass('minHeight');
		    		$(".ui-layout-wrapper").height(wHeight);
		    	}

				
				if($("#bannerReturn")[0]){
					$("#bannerReturn").attr("url",url);
				}else{
					$("body").append("<span style='display:none;' id='bannerReturn' url='"+url+"'></span>");
				}
								
				//为面包线赋值并显示
				if(dp.second&&dp.secondVal){
					$("#firstBanner .second").find("a").text(dp.secondVal).end().removeClass("hidden");
				}
				if(dp.third&&dp.thirdVal){
					$("#firstBanner .third").find("a").text(dp.thirdVal).end().removeClass("hidden");
				}	
				//placeholder
				setTimeout(function(){
					//$('input, textarea').placeholder();	
					$("#indexCommonView").refreshPlaceholder();  
				},200);
                window.ajaxRequest=null;
           //});
		},
		error:function(err){
			$(".loading").hide();
			window.ajaxRequest=null;
			$.messageBox({message:'系统出错，请刷新页面重试',level:'error'});
		}
	});
}