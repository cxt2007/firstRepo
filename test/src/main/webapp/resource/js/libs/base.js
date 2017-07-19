$(function(){
	// 简单的切换方法
    function tabsFun(on,cont){
        var on = $(on);
        var cont = $(cont);
        on.hover(function(){
            var index = $(this).index()
            on.removeClass('on');
            $(this).addClass('on');
            cont.eq(index).show().siblings().hide()
            
        },function(){
        
        })
    }
    
    new tabsFun('.graphIntermediate .tabs li','');
    
	
  	
	Date.prototype.format = function(format){ 
		var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
		} 
		if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		} 

		for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
		format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
		} 
		return format; 
		} 
});
	
/* 评估页面导航切换 */
jQuery.fn.anchorGoWhere = function(options){
	var obj = jQuery(this);
	var defaults = {target:1, timer:400};
	var o = jQuery.extend(defaults,options);

	
	var s=[];
	$("#evaluationContent .wrap").each(function(){
		s.push($(this).offset().top-150);
	})
	var winScroll = function(){		
		var top = $(window).scrollTop();	
		$(".leftMenu .assessmentItem li a").removeClass("on");
		for(var i=0;i<s.length;i++){
			if(top<s[i]){
				$(".leftMenu .assessmentItem li").eq(i).find("a").addClass("on");
				return;
			}
		}
			
	 }
	 $(window).on("scroll",function(){		
		clearTimeout(window._scrollTimer);		
		window._scrollTimer = setTimeout(function(){		
			 var isRel = $("html").attr("rel");
			 if(isRel==undefined){
				 $("html").attr("rel","1");
			 }
			 var targetTop =parseFloat($("html").attr("rel"));
			 var top = $("body").scrollTop();
			 if(top==targetTop){	
				 return false; 
			 }
			 winScroll();
		 },450);	
	 });
	 
	obj.each(function(i){
		jQuery(obj[i]).click(function(){
			var index = jQuery(this).parents('li').index(),
				_rel = jQuery(this).attr("href").substr(1);
			jQuery(this).addClass('on').parents('li').siblings('li').find('a').removeClass('on');
			switch(o.target){
				case 1: 
					var targetTop = jQuery("#"+_rel).offset().top - 177 - (index * 44);
					targetTop=targetTop<0?1:targetTop;
					jQuery("html,body").attr("rel",targetTop).stop().animate({scrollTop:targetTop}, o.timer);
					break;
				case 2:
					var targetLeft = jQuery("#"+_rel).offset().left;
					jQuery("html,body").animate({scrollLeft:targetLeft}, o.timer);
					break;
			}
			return false;
		});		
	});	
	jQuery(obj[0]).click();
}



/************************************************/
var agencies_orgId = "3B3328B0861D45FB9CB4528FED0F4ECF";//服务机构默认 orgId
function getFloatStr(num){  
    num += '';  
    num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符  
      
    if(/^0+/) //清除字符串开头的0  
        num = num.replace(/^0+/, '');  
    if(!/\./.test(num)) //为整数字符串在末尾添加.00  
        num += '.00';  
    if(/^\./.test(num)) //字符以.开头时,在开头添加0  
        num = '0' + num;  
    num += '00';        //在字符串末尾补零  
    num = num.match(/\d+\.\d{2}/)[0];  
    return num;
};

//根据身份证号获取出生日期
function getBirthDayTextFromIdCard(idCard){
	if(idCard!=null&&idCard.length==18){
		idCard=idCard.substring(6,14);
		if(idCard.substring(4,6)<=0||idCard.substring(4,6)>12){
			return "";
		}else if(idCard.substring(6,8)<=0||idCard.substring(6,8)>31){
			return "";
		}else{
			return idCard.substring(0,4)+"-"+idCard.substring(4,6)+"-"+idCard.substring(6,8);
		}
	}else if(idCard!=null&&idCard.length==15){
		idCard=idCard.substring(6,12);
		if(idCard.substring(2,4)<=0||idCard.substring(2,4)>12){
			return "";
		}else if(idCard.substring(4,6)<=0||idCard.substring(4,6)>31){
			return "";
		}else{
			return "19"+idCard.substring(0,2)+"-"+idCard.substring(2,4)+"-"+idCard.substring(4,6);
		}
	}
	return "";
}
//根据身份证号获取性别
function setGender(value){
	if(value.length==15){
		if(value.substr(13,1)%2==0){
			return "5F785394A5964C74A0DD5C1798995836";
		}else{
			return "7DF2A489C62444CDA790C1764E912C62";
		}
	}
	if(value.length==18){
		if(value.substr(16,1)%2==0){
			return "5F785394A5964C74A0DD5C1798995836";
		}else{
			return "7DF2A489C62444CDA790C1764E912C62";
		}
	}
}

//根据出生日期获取年龄
function setAge(value){
	if(value && value.length>10){
		value = getBirthDayTextFromIdCard(value);
	}
	if(value){
		var date = new Date(),
		value = value.substring(0,4);
		value = date.getFullYear() - value;
		return value;
	}
	return null;
}



$(function(){
	setTimeout(function(){
    	$(".loading").fadeOut();
    	var vHeight = $(".ui-layout-center").height();
    	if(vHeight>700){
    		$(".ui-layout-west,.ui-layout-center").removeClass('minHeight');
    		$(".ui-layout-west").height(vHeight);
    	}
    },1000);
	
	//将int 类型的数字转换成double 类型 后面带2位小数点
	  
	
	// 简单的切换方法
    function tabsFun(on,cont){
        var on = $(on);
        var cont = $(cont);
        on.hover(function(){
            var index = $(this).index()
            on.removeClass('on');
            $(this).addClass('on');
            cont.eq(index).show().siblings().hide()
            
        },function(){
        
        })
    }
    
    new tabsFun('.graphIntermediate .tabs li','');
    
	Date.prototype.format = function(format){ 
		var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
		} 
		if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		} 

		for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
		format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
		} 
		return format; 
		} 
});
	



/* 评估页面导航切换 */
jQuery.fn.anchorGoWhere = function(options){
	var obj = jQuery(this);
	var defaults = {target:1, timer:400};
	var o = jQuery.extend(defaults,options);

	
	var s=[];
	$("#evaluationContent .wrap").each(function(){
		s.push($(this).offset().top-150);
	})
	var winScroll = function(){		
		var top = $(window).scrollTop();	
		$(".leftMenu .assessmentItem li a").removeClass("on");
		for(var i=0;i<s.length;i++){
			if(top<s[i]){
				$(".leftMenu .assessmentItem li").eq(i).find("a").addClass("on");
				return;
			}
		}
			
	 }
	 $(window).on("scroll",function(){		
		clearTimeout(window._scrollTimer);		
		window._scrollTimer = setTimeout(function(){		
			 var isRel = $("html").attr("rel");
			 if(isRel==undefined){
				 $("html").attr("rel","1");
			 }
			 var targetTop =parseFloat($("html").attr("rel"));
			 var top = $("body").scrollTop();
			 if(top==targetTop){	
				 return false; 
			 }
			 winScroll();
		 },450);	
	 });
	 
	obj.each(function(i){
		jQuery(obj[i]).click(function(){
			var index = jQuery(this).parents('li').index(),
				_rel = jQuery(this).attr("href").substr(1);
			jQuery(this).addClass('on').parents('li').siblings('li').find('a').removeClass('on');
			switch(o.target){
				case 1: 
					var targetTop = jQuery("#"+_rel).offset().top - 177 - (index * 44);
					targetTop=targetTop<0?1:targetTop;
					jQuery("html,body").attr("rel",targetTop).stop().animate({scrollTop:targetTop}, o.timer);
					break;
				case 2:
					var targetLeft = jQuery("#"+_rel).offset().left;
					jQuery("html,body").animate({scrollLeft:targetLeft}, o.timer);
					break;
			}
			return false;
		});		
	});	
	jQuery(obj[0]).click();
}





























