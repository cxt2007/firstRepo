var PATH = '';//域名或IP
var RESOURCEPATH = '';//资源库前缀
var OAPPID = '';
var ver="1.0";//版本号
var mode="developer";//online
var script={
	base:["resource/js/base/jquery.base.js","resource/js/base/jqueryui.js","resource/js/base/jqGrid.js","resource/js/base/validate.js"],
	widget:["resource/js/libs/dialog.js","resource/js/libs/gridUtil.js","resource/js/libs/formValidate.js","resource/js/libs/widget.js","resource/js/libs/base.js","resource/js/libs/idCheckUtil.js","resource/js/external/xheditor/xheditor-1.2.1.min.js","resource/js/external/xheditor/zh-cn.js","resource/js/libs/richText.js"],
	mod:['resource/js/external/uploadify/swfobject.js','resource/js/external/uploadify/jquery.uploadify.v2.1.4.min.js','resource/js/libs/uploadFile.js']
	}
for(resource in script){
	for(var i=0,len=script[resource].length;i<len;i++){
		script[resource][i]=script[resource][i]+"?ver="+ver;
	}
}

//加载基础库
if(mode!="online"){
	head.load(script.base,function(){
			//组件相关
		head.load(script.widget,function(){
			//框架模块
			head.load(script.mod,function(){
				
			});
		})
		//});
	});
}else{
	head.load(script.base,function(){
		//组件相关
		head.load(["resource/libs/widget.min.js?ver="+ver,"resource/libs/mod.min.js?ver="+ver],function(){});
	});
}