var ctx = $("#ctx").val();
var appid = $("#appid").val();
var currentPage = 0;
var iDisplayLength = 8;

$(document).ready(function() {
	getZthdList(1);
	$("#search-btn").click(function() {
		$("#state").val("0,1");
		currentPage = 0;
		getZthdList(1);
	});
	$("#campusid").change(function() {
		getSearchBj();
	});
	$("#bjids").change(function() {
		$("#state").val("0,1");
		currentPage = 0;
		getZthdList(1);
	});
});

function turnToManage(id){
	location.href=ctx + "/xtgl/theme/editComment/" + id +"?appid=" + appid;
}

function addNewZthd(){
	location.href=ctx + "/xtgl/theme/newZthd";
}

function getZthdList(ifSetTitle){
	GHBB.prompt("正在加载~");
	var url = ctx + "/xtgl/theme/findTheme";
	var campusid = $("#campusid").val();
	var title = $("#title").val();
	var bjids = $("#bjids").val();
	var state = $("#state").val();
	var iDisplayStart = currentPage * iDisplayLength;
	var submitData = {
		campusid	: campusid,
		title		: title,
		bjids		: bjids,
		state		: state,
		iDisplayStart	: iDisplayStart,
		iDisplayLength	: iDisplayLength
	};
	$.get(url, submitData, function(data) {
		GHBB.hide();
		var datas = eval('(' + data + ')');
		createZthdList(datas,ifSetTitle);
	});
}

function createZthdList(datas,ifSetTitle){
	var total = datas.total;
	var send = datas.send;
	var draft = datas.draft;
	var factLength = datas.factLength;
	var stateTitle = "";
	
	var li = "";
	if(factLength > 0){
		for (var i = 0; i < datas.themeList.length; i++) {
			var state = "未发布 |";
			if(datas.themeList[i].state == 1){
				state = "已发布 |";
			}
			var pushContent = "";
			var pushHref = "";
			var color_black = "";
			if(datas.themeList[i].ifpush == 1){
				pushContent = "已推送 |";
				color_black = " color_black";
			}else{
				pushContent = "推送";
				pushHref = ' href="javascript:sendMsgToWx('+datas.themeList[i].id+');"';
			}
			var spanTag = "";
			if(datas.themeList[i].tag != "" && datas.themeList[i].tag != null){
				var tag = datas.themeList[i].tag.split(",");
				for (var j = 0; j < tag.length; j++) {
					spanTag += '<span>'+tag[j]+'</span>';
				}
			}
			var m_r_0 = "";
			if((i+1) % 4 == 0){
				m_r_0 = ' class="m_r_0"';
			}
			li += '<li'+m_r_0+'>'
				+ '	<div onclick="turnToManage('+datas.themeList[i].id+');" class="t">'
				+ '		<div class="img">'
				+ '			<img alt="" src="'+checkQiniuUrl(datas.themeList[i].picpath)+'" />'
				+ '			<div class="describeBg"></div>'
				+ '			<div class="describe">'+datas.themeList[i].title+'</div>'
				+ '		</div>'
				+ '	</div>'
				+ '	<div class="m">'
				+ '		<span class="state">'+state+'</span>'
				+ '		<span class="editBtn">'
				+ '			<a class="w_40_per'+color_black+'" '+ pushHref +'>'+pushContent+'</a>'
				+ '			<a href="'+ ctx +'/xtgl/theme/update/'+datas.themeList[i].id+'?appid='+$("#appid").val()+'">编辑</a>'
				+ '			<a class="m_r_0" href="javascript:void(0);" onclick=delTheme(this,'+datas.themeList[i].id+');>删除</a>'
				+ '		</span>'
				+ '		<span class="commentNum"><label title="'+datas.themeList[i].commentCount+'" class="count">'+datas.themeList[i].commentCount+'</label><label class="text">评论</label></span>'
				+ '	</div>'
				+ '	<div class="b">' + spanTag + '</div>'
				+ '</li>';
			
		}
	}else{
		li += '<li style="width:100%;height:100px;line-height:150px;text-align:center;font-size:24px;">未查询到数据</li>';
	}
	stateTitle = '<span class="active" onclick="stateSearch(\'0,1\',this)">全部（'+total+'）</span><span onclick="stateSearch(\'1\',this)">已发布（'+send+'）</span><span onclick="stateSearch(\'0\',this)">未发布（'+draft+'）</span>';
	li += '<div class="cl"></div>';
	if(ifSetTitle == 1){
		$("#stateTitle").html(stateTitle);
	}
	$("#zthdList").html(li);
	createPageList(factLength);
}

function sendMsgToWx(id){
	if(confirm("确认推送？")){
		var campusid = $("#campusid").val();
		var param = {
			id 	: id,
			//此值为前后台约定主题活动在推送中的type值只在WxXxXxjj中定义，数据库中不存在
			type : WxXxXxjj.XXJJ_TYPE_THEME,
			campusid : campusid,
			//0为预览状态，推送即更新状态
			ifpreview : "0"
		}
		var submitData = {
			api : ApiParamUtil.COMMON_WX_PUSH,
			param : JSON.stringify(param)
		};
		$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				getZthdList(1);
				alert("微信消息推送成功！");
			}else{
				alert("推送失败！");
			}
		});
	}
}

function stateSearch(state,obj){
	$("#state").val(state);
	currentPage = 0;
	getZthdList(0);
	avticeStateTag(obj);
}

function query_zthd(num){
	currentPage = num;
	getZthdList(1);
}

function previousQuery(){
	if(currentPage > 0){
		currentPage = currentPage - 1;
	}
	getZthdList(1);
}

function nextQuery(pageCount){
	if(currentPage < (pageCount - 1)){
		currentPage++;
	}
	getZthdList(1);
}

function createPageList(total){
	var li = '<li><a href="javascript:previousQuery()"><i class="fa fa-angle-left"></i></a></li>';
	var pageCount = Math.ceil(total/iDisplayLength);
	for (var i = 0; i < pageCount; i++) {
		var active = "";
		if(i == currentPage){
			active = " class='active'";
		}else{
			active = '';
		}
		li += '<li'+active+'><a href="javascript:query_zthd('+ (i) +')">'+ (i+1) +'</a></li>';
	}
	li += '<li><a href="javascript:nextQuery(' + pageCount + ')"><i class="fa fa-angle-right"></i></a></li>';
	$("#pagination").html(li);
}

function getSearchBj() {
	GHBB.prompt("正在加载~");
	var url = ctx + "/yqdt/yqdt/ajax_change_bj";
	var submitData = {
		campusid : $("#campusid").val()
	};
	$.post(url, submitData, function(data) {
		GHBB.hide();
		var datas = eval(data);
		$("#bjids option").remove();// user为要绑定的select，先清除数据
		for (var i = 0; i < datas.length; i++) {
			$("#bjids").append(
					"<option value=" + datas[i][0] + ">" + datas[i][1]
							+ "</option>");
		}
		;
		$("#bjids option").eq(0).attr("selected", true);
		$("#bjids").trigger("chosen:updated");
		getZthdList(1);
		return false;
	});
}

function delTheme(obj,id) {
	if(confirm("确定删除该条主题活动?")){
		GHBB.prompt("数据保存中~");
		var url = ctx +'/xtgl/theme/deleteTheme/'+id;
		var submitData = {
			
		};
		$.post(url, submitData, function(data) {
			GHBB.hide();
			alert(data);
			$(obj).parent().parent().parent().remove();
			return false;
		});
	}
}

function avticeStateTag(obj){
	$(obj).parent().children().removeClass("active");
	$(obj).addClass("active");
}






