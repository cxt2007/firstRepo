var ctx=$("#ctx").val();
var campusid = getUrlParam("campusid");
var orgcode = $("#main_orgcode").val();
var userid = $("#main_userid").val();
$(document).ready(function() {
	generate_table();
});

$("#set-form").click(function(){
	 var param = {campusid:$("#campusid-chosen").val()}
    var submitData = {
		api : ApiParamUtil.MAIL_INTRODUCTORY_INFO,
		param : JSON.stringify(param)
	 };
	 $.post(commonUrl_ajax,submitData,function(data){
		 
});
});

$("#preview-btn").click(function previewForm(){
	var state = 0;
	var field = "";
	var publisherid = userid;
	var lis = $("#field ul").children();
	for(var i=0;i<lis.length;i++){
		var mark;
		if($("#"+lis[i].id).find("input").is(':checked')){
			mark = 1;
		}else{
			mark = 0;
		}
		field += lis[i].id+":"+mark+";";
	}
	if(field){
		field = field.substring(0,field.length-1);
	}
	var param = {
			publisherid:userid,
			campusid:campusid,
			id:$("#formid").val(),
			title:$("#title-add").val(),
			content:$("#title-des").val(),
			showtext:$("#showtext").val(),
			fieldsrule:field,
			state:state
	}
    var submitData = {
		api : ApiParamUtil.MYSHCOOL_ZXBM_FORM_SETING_SAVE,
		param : JSON.stringify(param)
	 };
	 $.post(commonUrl_ajax,submitData,function(data){
	 });
	var url = ctx+"/mobile/loading_page?orgcode="+orgcode+"&campusid="+campusid+"&appIsPreview=1&userid="+userid+"&appid="+ApiParamUtil.MYSHCOOL_ZXBM_PREVIEW_JUMP;
	window.open (url,'newwindow','height=580,width=360,top=20,left=330,scrollbars=yes,location=no');
});
$("#save-btn").click(function (){
	 saveForm(); 
});
function  saveForm(){
	GHBB.prompt("数据保存中~");
	var state = 1;
	var field = "";
	var publisherid = userid;
	var lis = $("#field ul").children();
	for(var i=0;i<lis.length;i++){
		var mark;
		if($("#"+lis[i].id).find("input").is(':checked')){
			mark = 1;
		}else{
			mark = 0;
		}
		field += lis[i].id+":"+mark+";";
	}
	if(field){
		field = field.substring(0,field.length-1);
	}
	var param = {
			publisherid:userid,
			campusid:campusid,
			id:$("#formid").val(),
			title:$("#title-add").val(),
			content:$("#title-des").val(),
			showtext:$("#showtext").val(),
			fieldsrule:field,
			state:state
	}
    var submitData = {
		api : ApiParamUtil.MYSHCOOL_ZXBM_FORM_SETING_SAVE,
		param : JSON.stringify(param)
	 };
	 $.post(commonUrl_ajax,submitData,function(data){
		 GHBB.hide();
		 window.location.href = "/weixt/xtgl/registration?appid=746";
	 });
}

function getUrlParam(name)
{
var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
var r = window.location.search.substr(1).match(reg);  //匹配目标参数
if (r!=null) return unescape(r[2]); return null; //返回参数值
} 

function generate_table(){
	GHBB.prompt("正在加载~");
	var param = {
			campusid:campusid
			}
    var submitData = {
		api : ApiParamUtil.MYSHCOOL_ZXBM_FORM_SETING_QUERY,
		param : JSON.stringify(param)
	 };
	 $.post(commonUrl_ajax,submitData,function(data){
		 var datas = typeof data == "object" ? data : JSON.parse(data);
		 if(datas.data){
			 $("#campus-title").val(datas.data.campus);
			 $("#formid").val(datas.data.id);
			 $("#title-add").val(datas.data.title);
			 $("#title-des").val(datas.data.content);
			 $("#showtext").val(datas.data.showtext);
			 if (datas.data.fieldsrule != null) {
				var fieldsrule = datas.data.fieldsrule;
				$("#field ul").find("li").each(function(){
					var idname = $(this).attr("id");
					if(fieldsrule[idname]=="1"){
						$(this).find("div input").attr("checked","true");
					}else{
						$(this).find("div input").removeAttr("checked");
		
					}
				});
			 }
		 }
		 GHBB.hide();
	 });
}