//input清除按钮的隐藏与显示
$.extend({
	showTxtValue:function(o){
		$(o).bind('focusin',function(){
			var that = this;
			if(that.value === that.defaultValue){
				that.value = "";
				var event_name ='input';
				if(navigator.userAgent.indexOf('MSIE') !=-1){
					event_name = 'propertychange';
				}
				$(that).unbind(event_name).bind(event_name,function(){
					if(that.value != that.defaultValue && that.value !=""){
						$(that).nextAll('.searchDel').show();
						$(that).nextAll('.searchDel').click(function(){
							$(that).val("").trigger('focusout');
						});
					}
				});
				
			}
		}).bind('focusout',function(){
			var that = this;
			if(that.value === ""){
				that.value=that.defaultValue;
				$(that).nextAll('.searchDel').hide();
			}
		});
	}

});

//tab切换
function tabsFun(tit,cont){
	var tit = $(tit),cont = $(cont);
	tit.on('click',function(){
		var index = $(this).index();
		$(this).addClass("on").siblings().removeClass("on");
		cont.eq(index).show().siblings().hide();
	})
}

//提示框
function confirmPop(m,n){
	var m = $(m),n = $(n);
	m.on('click',function(){
		var offset = $(this).parents("tr").offset(),
		popTop = offset.top-110;
		n.show().css({top: popTop+"px"});
	});
}
//弹框关闭
$(".confirmPop .cancelBtn").click(function(){
	$(this).parents(".confirmPop").hide();
});


//模拟checkbox选中
function checkBoxChecked(){
	$('.packageCont').off('click').on('click','.checkbox',function(){
	    if($(this).siblings("input[type='checkbox']").is(':checked')){
	        $(this).removeClass('cur');
	        $(this).siblings("input[type='checkbox']").removeAttr('checked');
	    }else{
	        $(this).addClass('cur');
	        $(this).siblings("input[type='checkbox']").attr('checked','checked');
	    }
	});
}
//虚拟币切换
$('.switch-box').on('change','#switchInput',function(){
	$(this).parents('.switch-box').toggleClass('checked');
});

//全选
function select(m,n){
	$(n).prop("checked", $(m).prop("checked"));
	var $all = $(n);
	if($all.is(':checked')){
		$all.siblings(".checkbox").addClass('cur');
		$all.attr('checked','checked');
	}else{
	   		$all.siblings(".checkbox").removeClass('cur');
	   		$all.removeAttr('checked');
	}
}

























