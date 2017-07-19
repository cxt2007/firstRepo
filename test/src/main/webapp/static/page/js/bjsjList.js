var ctx = $("#ctx").val();
var appid = $("#appid").val();

var ifOK = false;
var pageSize = 10000;
var currentPage = 1;
var maxPage;

$(document).ready(function() {	
	ajax_queryNjsj();	
	$("#ifby").change(function(){
		ajax_queryNjsj();
	});
	$("#school-chosen").change(function(){
		ajax_queryNjsj();
	});
	$("#njsj").change(function(){
		ajax_getDataList();
	});
	$("#search-btn").click(function(){
		ajax_getDataList();
	});
});

function ajax_queryNjsj(){
	GHBB.prompt("正在加载~");
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_GRADE,
		param : JSON.stringify({
			campusid:$("#school-chosen").val(),
			ifby:$("#ifby").val()
		})
	};
	$.ajax({
		cache : false,
		type : "POST",
		url : commonUrl_ajax,
		data : submitData,
		success : function(datas) {
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code === "200") {
				var njList=result.data.njList;				
				if($("#xxtype").val()==3){
					$("#njsj").val(njList[0].id);
				}else{
					$("#njsj option").remove();
					var njids="";
					var options="";
					for(var i=0;i<njList.length;i++){
						njids+=njList[i].id+",";
						options+="<option value='"+njList[i].id+"'>"+njList[i].njmc+"</option>";
					}
					if(njids.length>0){
						njids=njids.substring(0,njids.length-1);
					}
					options="<option value='"+njids+"' selected=true>全部</option>"+options;
					$("#njsj").html(options);
					$('#njsj').trigger("chosen:updated");					
				}
				ajax_getDataList();
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function getDisplayStart(){
	return pageSize*(currentPage-1);
}

function ajax_getDataList(){
	GHBB.prompt("数据保存中~");
	$("#viewlist").html("");
	var displayStart=getDisplayStart();
	var url=ctx+"/xtgl/bjsj/ajax_getDataList";
	var campusid=$("#school-chosen").val();
	var bjName=$("#bjNameForSearch").val();
	var campusname=$("#school-chosen option[value="+campusid+"]").text();
	var submitData={
			search_campusid:campusid,
			search_bjName:bjName,
			search_njid:$("#njsj").val()
	};
	$.get(url,submitData,function(data){
		GHBB.hide();
		//1.填充数据   2项数据  老师List  和  班级list		
		var datas=eval(data);
		if(currentPage === 1 && datas.length===1){
			$("#viewlist").html("无数据内容");
			return;
		}
		var contents="";
		//最后一个数据是 总 记录数	
		var smallIconPath;
		var dabanBigIconPath="http://static.weixiaotong.com.cn/bjicon_youdaban.png";
		var dabanSmallIconPath="http://static.weixiaotong.com.cn/b57ced5cad1d788e9265d04502debb0e386a75b8.png";
		var zhongbanBigIconPath="http://static.weixiaotong.com.cn/bjicon_youzhongban.png";
		var zhongbanSmallIconPath="http://static.weixiaotong.com.cn/3f11dd94d8ce7d42ab655deab9af633903b7b84a.png";
		var xiaobanBigIconPath="http://static.weixiaotong.com.cn/bjicon_youxiaoban.png";
		var xiaobanSmallIconPath="http://static.weixiaotong.com.cn/651a657b787942c59171e1f0f0cd37e3cf208a00.png";
		var tuobanBigIconPath="http://static.weixiaotong.com.cn/bjicon_tuoban.png";
		var tuobanSmallIconPath="";
		for(var i=0;i<datas.length-1;i++){
			var njmc=datas[i].njmc;
			var iconpath=datas[i].iconpath;
			if(iconpath==""||iconpath==null){
				if(njmc=="大班" || njmc=="幼大班"){
					iconpath=dabanBigIconPath;
					smallIconPath=dabanSmallIconPath;
				}else if(njmc=="中班" || njmc=="幼中班"){
					iconpath=zhongbanBigIconPath;
					smallIconPath=zhongbanSmallIconPath;
				}else if(njmc=="小班" || njmc=="幼小班"){
					iconpath=xiaobanBigIconPath;
					smallIconPath=xiaobanSmallIconPath;
				}else if(njmc=="托班" || njmc=="幼托班"){
					iconpath=tuobanBigIconPath;
					smallIconPath=tuobanSmallIconPath;
				}
			}else{
				iconpath=checkQiniuUrl120(iconpath);
				if(njmc=="大班" || njmc=="幼大班"){
					smallIconPath=dabanSmallIconPath;
				}else if(njmc=="中班" || njmc=="幼中班"){
					smallIconPath=zhongbanSmallIconPath;
				}else if(njmc=="小班" || njmc=="幼小班"){
					smallIconPath=xiaobanSmallIconPath;
				}else if(njmc=="托班" || njmc=="幼托班"){
					smallIconPath=tuobanSmallIconPath;
				}
			}
			contents+='<div class="viewbox" onclick="toEdit('+datas[i].id+')">'+
							'<div class="viewbox-content">'+
							'<div class="viewbox-content-left" >'+
							'<img class="vcl-img" src="'+iconpath+'"/img></div>'+
							'<div class="viewbox-content-right">'+
							'<div class="vcr-bjmc">'+datas[i].bjmc+'</div>';			
			contents+='<div class="vcr-count" style="margin-top:20px">'+datas[i].xsCount+'位学生&nbsp;'+datas[i].teacherCount+'位老师</div>'+
			'</div></div></div>';							
		}
		$("#viewlist").append(contents);
		//2.更新页码
		
	});
}


function delConfirm(num){
	if(confirm("确认删除?")){
		var url=ctx+"/xtgl/bjsj/ajax_del_bjsj";
		var submitData = {
				id	: num
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data == "success"){
					alert("删除成功！");
					generate_table();
				}else{
					alert(data);
				}
	    		return false;
	      });
	}
}

function toEdit(bjid){
	location.href=ctx+"/xtgl/bjsj/toupdate?bjid="+bjid+"&appid="+appid+"&campusid="+$("#school-chosen").val();
}

/**
 * 新增班级时，先校验 该校区有没有设置年级，如果没有，则提示。不能加班级
 */
function toCreate(){
	var url=ctx+"/xtgl/bjsj/ajax_checkNjExists?campusid="+$("#school-chosen").val();
	$.get(url,function(data){
		if(data=="error")
			alert("当前校区还未设置年级，请先设置年级");
		else
			location.href=ctx+"/xtgl/bjsj/tocreate?appid="+appid;
	});
}
/**
 * 判断图片路径是否属于阿里的cdn
 * @param qiniuUrl
 * @returns
 */
function checkQiniuUrl(qiniuUrl) {
	var oscdn_domain = 'static.weixiaotong.com.cn';
	if (qiniuUrl.indexOf(oscdn_domain) > 0) {
		return qiniuUrl + '@100w_100h_1e_0c_0i_60Q_1x_1o.jpg';
	} else {
		return qiniuUrl;
	}
}

/**
 * 阿里云 OSS 图片处理服务
 * @param qiniuUrl
 * @returns
 */
function ossImg(qiniuUrl, imgThumbnailParam) {
	var oscdn_domain = 'static.weixiaotong.com.cn';
	if (qiniuUrl.indexOf(oscdn_domain) > 0) {
		return qiniuUrl + imgThumbnailParam;
	} else {
		return qiniuUrl;
	}
}


