<script type="text/javascript" src="/resource/js/base/jquery.base.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/base/jqueryui.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/base/jqGrid.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/libs/dateUtil.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/base/validate.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/libs/dialog.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/libs/gridUtil.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/libs/formValidate.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/libs/base.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/libs/idCheckUtil.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/external/xheditor/xheditor-1.2.1.min.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/external/xheditor/zh-cn.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/external/xheditor/richText.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/external/uploadify/swfobject.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/external/uploadify/jquery.uploadify.v2.1.4.min.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/libs/uploadFile.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/libs/init.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/external/jquery.ba-hashchange.min.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/external/placeholders.min.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/base/threeSelect.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/libs/jquery.cookie.js?ver=1.0"></script>
<script type="text/javascript" src="/resource/js/libs/widget.js?ver=1.0"></script>
<!--
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=Dlgw0e1C0s4u1HvuCQO4ngVA"></script>
-->
<script type="text/javascript" src="/resource/js/libs/My97DatePicker/WdatePicker.js?ver=1.0"></script>
<script type="text/javascript">
//<meta name="renderer" content="ie-stand">指定360浏览器调用IE标准模式，必须第二次载入才起作用，
	//如果是360浏览器下面的chrome内核，就重载一下，让页面头部的	
	(function(){		
		var uA=navigator.userAgent;
		if(uA.indexOf("Chrome")>-1){			
			if($.cookie('isChrome')){
				$.cookie('isChrome', null);
			}else{
				$.cookie('isChrome', 'true');
				location.reload();
			}
		}
	})();
</script>
<script>var base="${base}";</script>
<script type="text/javascript">   
   var TQ = {};  
   var PATH = "";   
</script>
<script type="text/javascript" src="/resource/js/libs/controller/index.js?ver=1.0"></script>
<script type="text/javascript">
$(function(){	
	TQ.index();	
})
</script>