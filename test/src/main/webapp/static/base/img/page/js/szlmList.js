var commonUrl_ajax = $("#commonUrl_ajax").val();
var ctx=$("#ctx").val();
var firstColumnData;
var ifShowFirst = ($("#webSiteState").val()=='true' && $("#isAgent").val() == 'false') ? true : false;
var MAIN_MANAGE_SCHOOL_WECHAT_NAVIGATION_CONFIG = $("#MAIN_MANAGE_SCHOOL_WECHAT_NAVIGATION_CONFIG").val();
var MAIN_MANAGE_SCHOOL_WECHAT_ARTICLE_CONFIG = $("#MAIN_MANAGE_SCHOOL_WECHAT_ARTICLE_CONFIG").val();
var MAIN_MANAGE_SCHOOL_SAVE_WECHAT_MODULE_CONFIG = $("#MAIN_MANAGE_SCHOOL_SAVE_WECHAT_MODULE_CONFIG").val();
var COMMON_QUERY_DICT = $("#COMMON_QUERY_DICT").val();
var DICT_TYPE_ARTICLE_DATALIMIT = $("#DICT_TYPE_ARTICLE_DATALIMIT").val();

$(document).ready(function() {
	$("#saveFirstColumn").click(function() {
		saveFirstColumn();
	});
	$("#saveSecondColumn").click(function() {
		saveSecondColumn();
	});
	$("#szlm-search-select-campus").change(function() {
		queryFirstColumnList();
		querySecondColumnList();
		loading_article_config();
		loading_navigation_config();
		queryConfig();
		
	});
	
	queryFirstColumnList();
	
	loading_navigation_config();
	loading_article_config();
	
	$("#config-save-btn").click(function() {
		saveConfig();
	});
});

function queryConfig(){
	var param = {
			campusid : $("#szlm-search-select-campus").val()
	};
	var submitData = {
			api: ApiParamUtil.SCHOOL_KGPZ_QUERY,
			param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var result = typeof data === "object" ? data : JSON.parse(data);
		var item = typeof data === "object" ? result.data : JSON.parse(result.data);
		$("#kgpzItem").val(item.aaData['405']);
	});
}

function queryFirstColumnList() {
	var param = {
		campusid : $("#szlm-search-select-campus").val()
	};
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_QUERY_FIRST_FUNCTION_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			firstColumnData = json.data;
			createFirstColumnList(json.data);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function createFirstColumnList(data){
	if(data != null && data.length > 0){
		var li = "";
		var ifHaveCustom = 0;
		for ( var i = 0; i < data.length; i++) {
			var firstColumnInfo = data[i];
			var nameDiv = '<label>'+firstColumnInfo.name+'</label>';
			var delDiv = "";
			var readOnly = "";
			if(firstColumnInfo.isedited == "0"){
				nameDiv = '<div class="fillInput"><input type="tel" value="'+firstColumnInfo.name+'" minlength="1" maxlength="5" placeholder="自定义栏目" class="form-control" onkeyup="changeColumName(this);" /></div>';
				delDiv = '<a type="button" class="handleBtn" onclick="delCustomColumn(this);">删除</a>';
				ifHaveCustom++;
			}
			if(firstColumnInfo.isfixed == "1"){
				readOnly = ' readonly="true"';
			}
			li += '<li>'
				+ '		<div class="firstColumnBox">'
				+ '		<input type="hidden" name="inDatabase" value="1" />'
				+ '		<input type="hidden" name="isedited" value="'+firstColumnInfo.isedited+'" />'
				+ '		<input type="hidden" name="isfixed" value="'+firstColumnInfo.isfixed+'" />'
				+ '		<input type="hidden" name="isSave" value="0" />'
				+ '		<input type="hidden" name="columName" value="'+firstColumnInfo.name+'" />'
				+ '		<input type="hidden" name="id" value="'+firstColumnInfo.id+'" />'
				+ 			nameDiv
				+ '			<div class="orderidInput">'
				+ '				<input name="orderid" type="tel" value="'+firstColumnInfo.orderid+'" minlength="1" placeholder="序号"'+readOnly+' class="form-control" onkeyup="setChangeTag(this);" />'
				+ '			</div>'
				+ 			delDiv
				+ '		</div>'
				+ '	</li>';
		}
		if(ifHaveCustom == 0){
			li += '<li>'
				+ '		<div class="firstColumnBox">'
				+ '			<a type="button" class="handleBtn" onclick="addNewFirstColumn(this);">新增</a>'
				+ '		</div>'
				+ '</li>';
		}
		$("#firstColumn").html(li);
	}
	querySecondColumnList();
}

function querySecondColumnList() {
	var param = {
		campusid : $("#szlm-search-select-campus").val()
	};
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_QUERY_SECOND_FUNCTION_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			createSecondColumnList(json.data);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function createSecondColumnList(data){
	if(data != null && data.length > 0){
		var hide = "";
		if(!ifShowFirst){
			hide = ' class="hide"';
		}
		var li = '<li>'
				+'	<div class="firstColumnBox">'
				+'		<label>栏目名称</label>'
				+'		<label>位置排序</label>'
				+'		<label '+hide+'>所属一级栏目</label>'
				+'	</div>'
				+'</li>';
		for ( var i = 0; i < data.length; i++) {
			var secondColumnInfo = data[i];
			li += '<li>'
				+ '	<div class="firstColumnBox">'
				+ '		<input type="hidden" name="inDatabase" value="1" />'
				+ '		<input type="hidden" name="isSave" value="0" />'
				+ '		<input type="hidden" name="id" value="'+secondColumnInfo.id+'" />'
				+ '		<div class="fillInput">'
				+ '			<input name="columName" type="tel" minlength="1" maxlength="5" placeholder="自定义栏目" class="form-control" value="'+secondColumnInfo.name+'" onkeyup="setChangeTag(this);" />'
				+ '		</div>'
				+ '		<div class="orderidInput">'
				+ '			<input name="orderid" type="tel" minlength="1" placeholder="序号" class="form-control" value="'+secondColumnInfo.orderid+'" onkeyup="setChangeTag(this);" />'
				+ '		</div>'
				+ '		<div '+hide+' class="selectBox">'
				+ 			createFirstSelect(secondColumnInfo.parentid)
				+ '		</div>'
				+ '		<a type="button" class="handleBtn" onclick="delSecondColumn(this)">删除</a>'
				+ '	</div>'
				+ '</li>';
		}
		li += '<li>'
			+ '		<div class="firstColumnBox">'
			+ '			<a type="button" class="handleBtn" onclick="addSecondColumn(this);">新增</a>'
			+ '		</div>'
			+ '</li>';
		
		$("#secondColumn").html(li);
	}
}

function createFirstSelect(parentid){
	if(firstColumnData != null && firstColumnData.length > 0){
		var option = "";
		for ( var i = 0; i < firstColumnData.length; i++) {
			var firstColumnInfo = firstColumnData[i];
			var selected = "";
			if(firstColumnInfo.id == parentid){
				selected = ' selected="selected"';
			}
			if(!firstColumnInfo.isfixed){
				option += '<option value="'+firstColumnInfo.id+'"'+selected+'>'+firstColumnInfo.name+'</option>';
			}
		}
		var select = '<select name="parentid" onchange="setChangeTag(this);">'+option+'</select>';
		return select;
	}
}

function addNewFirstColumn(obj){
	var columDiv = "";
	var nowOrderid = getMxOrderid("firstColumn") + 1;
	columDiv	 = '<input type="hidden" name="inDatabase" value="0" />'
				 + '<input type="hidden" name="isedited" value="0" />'
				 + '<input type="hidden" name="isfixed" value="0" />'
				 + '<input type="hidden" name="isSave" value="1" />'
				 + '<input type="hidden" name="columName" value="" />'
				 + '<input type="hidden" name="id" value="0" />'
				 + '<div class="fillInput">'
				 + '	<input type="tel" minlength="1" maxlength="5" placeholder="自定义栏目" class="form-control" onkeyup="changeColumName(this);" />'
				 + '</div>'
				 + '<div class="orderidInput">'
				 + '	<input name="orderid" type="tel" value="'+nowOrderid+'" minlength="1" placeholder="排序号" class="form-control">'
				 + '</div>'
				 + '<a type="button" class="handleBtn" onclick="delCustomColumn(this);">删除</a>';
	$(obj).parent().html(columDiv);
}

function addSecondColumn(obj){
	var nowOrderid = getMxOrderid("secondColumn") + 1;
	var inputLength = $("#secondColumn").find("input[name='orderid']").length;
	
	if(inputLength > 15){
		alert("最多增加15个栏目！");
		return ;
	}
	
	if(!isFinite(nowOrderid)){
		nowOrderid = 1;
	}

	
	var hide = "";
	if(!ifShowFirst){
		hide = ' class="hide"';
	}
	var li = '<li>'
		+ '	<div class="firstColumnBox">'
		+ '		<input type="hidden" name="inDatabase" value="0" />'
		+ '		<input type="hidden" name="isSave" value="1" />'
		+ '		<input type="hidden" name="id" value="0" />'
		+ '		<div class="fillInput">'
		+ '			<input name="columName" type="tel" minlength="1" maxlength="5" placeholder="自定义栏目" class="form-control" value="" />'
		+ '		</div>'
		+ '		<div class="orderidInput">'
		+ '			<input name="orderid" type="tel" minlength="1" placeholder="序号" class="form-control" value="'+nowOrderid+'" />'
		+ '		</div>'
		+ '		<div '+hide+' class="selectBox">'
		+ 			createFirstSelect("0")
		+ '		</div>'
		+ '		<a type="button" class="handleBtn" onclick="delSecondColumn(this)">删除</a>'
		+ '	</div>'
		+ '</li>';
	$(obj).parent().parent().before(li);
}

function changeColumName(obj){
	setChangeTag(obj);
	$(obj).parent().parent().find("input[name='columName']").val($(obj).val());
}

function setChangeTag(obj){
	$(obj).parent().parent().find("input[name='isSave']").eq(0).val("1");
}

function delCustomColumn(obj){
	if($(obj).parent().find("input[name='inDatabase']").val() == "0"){
		$(obj).parent().html('<a type="button" class="handleBtn" onclick="addNewFirstColumn(this);">新增</a>');
	}else{
		if (confirm("确认删除?")) {
			var param = {
				campusid : $("#szlm-search-select-campus").val(),
				id : $(obj).parent().find("input[name='id']").val()
			};
			var submitData = {
				api : ApiParamUtil.SYS_MANAGE_DEL_FIRST_FUNCTION_INFO,
				param : JSON.stringify(param)
			};
			$.post(commonUrl_ajax, submitData, function(data) {
				var json = typeof data === "object" ? data : JSON.parse(data);
				if (json.ret.code == "200") {
					PromptBox.alert("删除成功！");
					queryFirstColumnList();
				} else {
					PromptBox.alert(json.ret.msg);
				}
			});
		}
	}
}

function delSecondColumn(obj){
	if($(obj).parent().find("input[name='inDatabase']").val() == "0"){
		$(obj).parent().parent().remove();
	}else{
		if (confirm("确认删除?")) {
			var param = {
				campusid : $("#szlm-search-select-campus").val(),
				id : $(obj).parent().find("input[name='id']").val()
			};
			var submitData = {
				api : ApiParamUtil.SYS_MANAGE_DEL_SECOND_FUNCTION_INFO,
				param : JSON.stringify(param)
			};
			$.post(commonUrl_ajax, submitData, function(data) {
				var json = typeof data === "object" ? data : JSON.parse(data);
				if (json.ret.code == "200") {
					PromptBox.alert("删除成功！");
					querySecondColumnList();
					loading_article_config();
				} else {
					PromptBox.alert(json.ret.msg);
				}
			});
		}
	}
}

function getMxOrderid(id){
	var orderidArr = new Array();
	var orderidList = $("#"+id).find("input[name='orderid']");
	for ( var i = 0; i < orderidList.length; i++) {
		var orderid = orderidList.eq(i).val();
		if(jQuery.inArray(orderid, orderidArr) == -1){
			orderidArr.push(orderid);
		};
	};
	return Math.max.apply(null, orderidArr);
}

function saveFirstColumn(){
	var templateList = new Array();
	var firstColumnList = $("#firstColumn li");
	for ( var i = 0; i < firstColumnList.length; i++) {
		var column = firstColumnList.eq(i);
		if(column.find("input[name='isSave']").val() == "1"){
			var map = {
				id : column.find("input[name='id']").val(),
				name : column.find("input[name='columName']").val(),
				orderid : column.find("input[name='orderid']").val(),
				parentid : "0"
			};
			templateList.push(map);
		}
	}
	var param = {
		campusid : $("#szlm-search-select-campus").val(),
		templateList : templateList,
		leveltype : "first"
	};
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SAVE_FIRST_FUNCTION_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			PromptBox.alert("保存成功！");
			queryFirstColumnList();
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function saveSecondColumn(){
	var templateList = new Array();
	var secondColumnList = $("#secondColumn li");
	for ( var i = 0; i < secondColumnList.length; i++) {
		var column = secondColumnList.eq(i);
		if(column.find("input[name='isSave']").val() == "1"){
			var map = {
				id : column.find("input[name='id']").val(),
				name : column.find("input[name='columName']").val(),
				orderid : column.find("input[name='orderid']").val(),
				parentid : column.find("select[name='parentid']").val()
			};
			templateList.push(map);
		}
	}
	var param = {
		campusid : $("#szlm-search-select-campus").val(),
		templateList : templateList,
		leveltype : "second"
	};
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SAVE_FIRST_FUNCTION_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			PromptBox.alert("保存成功！");
			queryFirstColumnList();
			loading_article_config();
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}


function saveConfig() {
	if ($("#navigation_ul :checkbox:checked").size() < 2)
	{
		PromptBox.alert('微信端首页导航模块最少显示2个！');
		return;
	}
	if ($("#article_ul :checkbox:checked").size() < 2)
	{
		PromptBox.alert('微信端文章模块最少显示2个！');
		return;
	}
	
	var templateList = new Array();
	var nav_modules = $("#navigation_ul li");
	for (var i = 0; i < nav_modules.length; i++) {
		var reg = new RegExp("^\d+||0$");
		
		var sort = $(nav_modules[i]).find('[name="sort"]').val();
		if (sort == '') {
			PromptBox.alert('请输入序号！');
			return;
		}
		if (!reg.test(sort)) {
			PromptBox.alert('请输入正确的序号！');
			return;
		}
		
		var isuse = '0';
		if ($(nav_modules[i]).find('[name="isuse"]').is(':checked')) {
			isuse = '1';
		}
		var config = {
			id : $(nav_modules[i]).find('[name="id"]').val(),
			isfixed : $(nav_modules[i]).find('[name="isfixed"]').val(),
			isuse : isuse,
			sort : sort,
			alias : $(nav_modules[i]).find('[name="alias"]').val(),
		}
		templateList.push(config);
	}
	
	var art_modules = $("#article_ul li");
	for (var i = 0; i < art_modules.length; i++) {
		var reg = new RegExp("^\d+||0$");
		
		var sort = $(art_modules[i]).find('[name="sort"]').val();
		if (sort == '') {
			PromptBox.alert('请输入序号！');
			return;
		}
		if (!reg.test(sort)) {
			PromptBox.alert('请输入正确的序号！');
			return;
		}
		
		var isuse = '0';
		if ($(art_modules[i]).find('[name="isuse"]').is(':checked')) {
			isuse = '1';
		}
		var config = {
			id : $(art_modules[i]).find('[name="id"]').val(),
			isfixed : $(nav_modules[i]).find('[name="isfixed"]').val(),
			isuse : isuse,
			sort : sort,
			alias : $(art_modules[i]).find('[name="alias"]').val(),
			datalimit : $(art_modules[i]).find('[name="datalimit"]').val(),
		}
		templateList.push(config);
	}
	
	var param = {
		templateList : templateList
	}
	var submitData = {
		api : MAIN_MANAGE_SCHOOL_SAVE_WECHAT_MODULE_CONFIG,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			PromptBox.alert('微信端模块配置信息保存成功！');
		} else {
			PromptBox.alert(json.ret.msg);
		}
		
	});
}

function loading_navigation_config() {
	var param = {
		campusid : $("#szlm-search-select-campus").val()
	}
	var submitData = {
		api : MAIN_MANAGE_SCHOOL_WECHAT_NAVIGATION_CONFIG,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			var templateList = datas.templateList;
			html = '';
			for (var i = 0; i < templateList.length; i++) {
				var checkState = '';
				if (templateList[i].isuse == 1) {
					checkState = 'checked="checked"';
				}
				if(($("#kgpzItem").val() != undefined && $("#kgpzItem").val() != null && $("#kgpzItem").val() != 0 && templateList[i].menu_appid == '107107') || templateList[i].menu_appid != '107107'){
					html += '<li>'
						+ '<div class="formLine">'
						+ '<input type="hidden" name="id" value="' + templateList[i].id + '"/>'
						+ '<input type="hidden" name="isfixed" value="' + templateList[i].isfixed + '"/>'
						+ '<div class="col-md-4 m_lr_10 width_100">'
						+ '<input name="isuse" type="checkbox" class="formBox_check" value="1" ' + checkState + '>' + templateList[i].title
						+ '</div>'
						+ '<div class="col-md-2 width_100">'
						+ '<input name="sort" type="tel" value="' + templateList[i].sort + '" minlength="1" placeholder="序号" class="form-control">'
						+ '</div>'
						+ '<div class="col-md-2 m_lr_10 width_100">'
						+ '<input name="alias" type="tel" maxlength="5" value="' + templateList[i].alias + '" placeholder="别名" class="form-control">'
						+ '</div>'
						+ '<div class="cl"></div>'
						+ '</div>'
						+ '</li>';
				}
			}
			$("#navigation_ul").html(html);
		} else {
			PromptBox.alert(json.ret.msg);
		}
		
	});
}

function loading_article_config() {
	var param = {
		type : DICT_TYPE_ARTICLE_DATALIMIT
	};
	var submitData = {
		api : COMMON_QUERY_DICT,
		param : JSON.stringify(param)
	};
	var optionHtml = '';
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			var dictList = datas.dictList;
			for (var i = 0; i < dictList.length; i++) {
				optionHtml += '<option value="' + dictList[i].key + '">' + dictList[i].value + '</option>';
			}
			assemble_article_config(optionHtml);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function assemble_article_config(optionHtml) {
	var param = {
		campusid : $("#szlm-search-select-campus").val()
	};
	var submitData = {
		api : MAIN_MANAGE_SCHOOL_WECHAT_ARTICLE_CONFIG,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		$("#article_ul").html("");
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			var templateList = datas.templateList;
			html = '';
			for (var i = 0; i < templateList.length; i++) {
				var checkState = '';
				if (templateList[i].isuse == 1) {
					checkState = 'checked="checked"';
				}
				html = '<li>'
					+ '<div class="formLine">'
					+ '<input type="hidden" name="id" value="' + templateList[i].id + '"/>'
					+ '<input type="hidden" name="isfixed" value="' + templateList[i].isfixed + '"/>'
					+ '<div class="col-md-4 m_lr_10 width_100">'
					+ '<input name="isuse" type="checkbox" class="formBox_check" value="1" ' + checkState + '>' + templateList[i].title
					+ '</div>'
					+ '<div class="col-md-2 width_100">'
					+ '<input name="sort" value="' + templateList[i].sort + '" minlength="1" placeholder="序号" class="form-control" onkeydown="onlyNum(this);">'
					+ '</div>'
					+ '<div class="col-md-2 m_lr_10 width_180">'
					+ '<input name="alias" type="tel" maxlength="11" value="' + templateList[i].alias + '" placeholder="别名" class="form-control">'
					+ '</div>'
					+ '<div class="col-md-2 m_lr_10 width_100">'
					+ '<select id="datalimit_' + templateList[i].id + '" data-placeholder="请选择" class="form-control" name="datalimit" value="' + templateList[i].datalimit + '">'
					+ optionHtml
					+ '</select>'
					+ '</div>'
					+ '<div class="cl"></div>'
					+ '</div>'
					+ '</li>';
				$("#article_ul").append(html);
				$("#datalimit_" + templateList[i].id).val(templateList[i].datalimit);
				
			}
		} else {
			PromptBox.alert(json.ret.msg);
		}
		
	});
}
