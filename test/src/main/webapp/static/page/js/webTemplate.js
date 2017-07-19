var ctx = $("#ctx").val();
var currentPage = 0;
var iDisplayLength = 8;
var commonUrl_ajax = $("#commonUrl_ajax").val();

$(document).ready(function() {
	$("#webtemp-save-btn").click(function() {
		saveWebTemp();
	});
	$("#webtemp_campusid").change(function() {
		queryWebTempList();
	});
	queryWebTempList();
});

function queryWebTempList(){
	GHBB.prompt("正在加载~");
	var iDisplayStart = currentPage * iDisplayLength;
	var param = {
		campusid : $("#webtemp_campusid").val(),
		displayStart	: iDisplayStart,
		displayLength	: iDisplayLength
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_QUERY_WEB_TEMPLATE_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			createWebTemp(result.data);
		}
		GHBB.hide();
	});
}

function createWebTemp(datas){
	var li = "";
	var pageCount = Math.ceil(datas.total/iDisplayLength);
	if(datas.webtemplateList.length > 0){
		for (var i = 0; i < datas.webtemplateList.length; i++) {
			var ifuse = "";
			if(datas.webtemplateList[i].ifuse == 1){
				ifuse = " checked";
			}
			li += '<li>'
			   +  '		<div class="imgBox">'
			   +  '			<img alt="" src="'+ datas.webtemplateList[i].qiniufile +'" />'
			   +  '		</div>'
			   +  '		<div class="click">'
			   +  '			<div class="l">'
			   +  '				<input '+ifuse+' id="webtemp_'+ datas.webtemplateList[i].webtemplate +'" name="checkWebTemp" type="radio" value="'+datas.webtemplateList[i].webtemplate+'" />'
			   +  '				<label for="webtemp_'+ datas.webtemplateList[i].webtemplate +'">选择</label>'
			   +  '			</div>'
			   +  '			<div class="c">'+datas.webtemplateList[i].title+'</div>'
			   +  '			<div class="r">'
			   +  '				<a href="'+ datas.webtemplateList[i].url +'" target="view_window">模板预览</a>'
			   +  '			</div>'
			   +  '		</div>'
			   +  '	</li>';
		}
		$("#webtemplateList").html('<ul>'+li+'</ul>');
	}else{
		$("#webtemplateList").html('<div class="noData">未查到数据</div>');
	}
	createPageList(datas.total);
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
		li += '<li'+active+'><a href="javascript:queryNow('+ (i) +')">'+ (i+1) +'</a></li>';
	}
	li += '<li><a href="javascript:nextQuery(' + pageCount + ')"><i class="fa fa-angle-right"></i></a></li>';
	$("#pagination").html(li);
}

function saveWebTemp(){
	var webtemplate = $('#webtemplateList input[name="checkWebTemp"]:checked ').val();
	if(webtemplate == "" || webtemplate == null){
		alert("请选择一个模板！");
		return;
	}
	var param = {
		campusid : $("#webtemp_campusid").val(),
		webtemplate : webtemplate
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SAVE_WEB_TEMPLATE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			alert("模板设置成功！");
			queryWebTempList();
		}
	});
}

function queryNow(num){
	currentPage = num;
	queryWebTempList();
}

function previousQuery(){
	if(currentPage > 0){
		currentPage = currentPage - 1;
	}
	queryWebTempList();
}

function nextQuery(pageCount){
	if(currentPage < (pageCount - 1)){
		currentPage++;
	}
	queryWebTempList();
}