var ctx = $("#ctx").val();
var roleid = "";

function clickNode(id) {
	var id = 'id' + id;
	var node = document.getElementById(id);
	if (node.style.display == "none")
		node.style.display = "block";
	else
		node.style.display = "none";
	return false;
}

$(document).ready(function() {
	querySchoolType();

	$("#schoolType").change(function(){
		queryOrgList();
		queryFuncTree();
	});

	$("#orgList").change(function(){
		queryRoleList();
	});
});

function querySchoolType(){
	var param = {
		type : DICTTYPE.DICT_TYPE_SCHOOL_TYPE
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_DICT,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#schoolType option").remove();
			for (var i = 0; i < result.data.dictList.length; i++) {
				$("#schoolType")
					.append("<option value=" + result.data.dictList[i].key + ">" + result.data.dictList[i].value + "</option>");
			}
			$("#schoolType option").eq(0).attr("selected", true);
			$("#schoolType").trigger("chosen:updated");
			queryOrgList();
			queryFuncTree();
		}
	});
}

function queryOrgList(){
	var param = {
		type : $("#schoolType").val(),
		userid : main_userid
	}
	var submitData = {
		api : ApiParamUtil.MAIN_MANAGE_SCHOOL_QUERY_ORG_LIST,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#orgList option").remove();
			for (var i = 0; i < result.data.orgList.length; i++) {
				$("#orgList")
					.append("<option value=" + result.data.orgList[i].orgcode + ">" + result.data.orgList[i].orgname + "</option>");
			}
			$("#orgList option").eq(0).attr("selected", true);
			$("#orgList").trigger("chosen:updated");
			queryRoleList();
		}
	});
}

function queryRoleList(){
	var param = {
		search_orgcode : $("#orgList").val(),
		userid : main_userid
	}
	var submitData = {
		api : ApiParamUtil.MAIN_MANAGE_SCHOOL_QUERY_ROLE_LIST,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			var tr = "";
			for (var i = 0; i < result.data.roleList.length; i++) {
				tr += '<tr><td style="text-align:center">'
				   +  '		<input onclick="queryCheckedFunc(\''+result.data.roleList[i].id +'\')" type="radio"' 
				   +  '		name="optionsRadios" id="role'+ result.data.roleList[i].id +'" value="'+ result.data.roleList[i].id +'">'
				   +  '</td>'
				   +  '<td style="text-align:center">'+ result.data.roleList[i].rolename +'</td></tr>';
			}
			$("#roleData").html(tr);
		}
	});
}

function queryFuncTree(){
	var param = {
		type : $("#schoolType").val(),
		userid : main_userid
	}
	var submitData = {
		api : ApiParamUtil.MAIN_MANAGE_SCHOOL_QUERY_FUNCTION_LIST,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$('#functions').tree({
				data : result.data.funcList,
				loadFilter: function(data){
					return convert(data);
			    }
			});
		}
	});
}

function queryCheckedFunc(_roleid){
	roleid = _roleid;
	//情况选中项
	var selected = $('#functions').tree('getChecked');
	for ( var i = 0; i < selected.length; i++) {
		$('#functions').tree('uncheck', selected[i].target);
	}
	var param = {
		roleid : roleid
	}
	var submitData = {
		api : ApiParamUtil.MAIN_MANAGE_SCHOOL_QUERY_CHECKED_FUNCTION_LIST,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			if (result.data.funcList != null && result.data.funcList.length > 0) {
				// 加载新角色的选中项
				for ( var i = 0; i < result.data.funcList.length; i++) {
					if (result.data.funcList[i].parentid != 0) {
						var node = $('#functions').tree('find', result.data.funcList[i].id);
						$('#functions').tree('check', node.target);
					}
				}
			}
		}
	});
}

function convert(rows){
	function exists(rows, parentid){
		for(var i=0; i<rows.length; i++){
			if (rows[i].id == parentid) return true;
		}
		return false;
	}
	
	var nodes = [];
	// get the top level nodes
	for(var i=0; i<rows.length; i++){
		var row = rows[i];
		if (!exists(rows, row.parentid)){
			nodes.push({
				id:row.id,
				text:row.name
			});
		}
	}
	
	var toDo = [];
	for(var i=0; i<nodes.length; i++){
		toDo.push(nodes[i]);
	}
	while(toDo.length){
		var node = toDo.shift();	// the parent node
		// get the children nodes
		for(var i=0; i<rows.length; i++){
			var row = rows[i];
			if (row.parentid == node.id){
				var child = {id:row.id,text:row.name};
				if (node.children){
					node.children.push(child);
				} else {
					node.children = [child];
				}
				toDo.push(child);
			}
		}
	}
	return nodes;
}

function reloadTree(){
	$.extend($.fn.tree.methods, {
		getCheckedExt : function(jq) {//扩展getChecked方法,使其能实心节点也一起返回
			var checked = $(jq).tree("getChecked");
			var checkbox2 = $(jq).find("span.tree-checkbox2").parent();
			$.each(checkbox2, function() {
				var node = $.extend({}, $.data(this, "tree-node"), {
					target : this
				});
				checked.push(node);
			});
			return checked;
		},
		getSolidExt : function(jq) {//扩展一个能返回实心节点的方法
			var checked = [];
			var checkbox2 = $(jq).find("span.tree-checkbox2").parent();
			$.each(checkbox2, function() {
				var node = $.extend({}, $.data(this, "tree-node"), {
					target : this
				});
				checked.push(node);
			});
			return checked;
		}
	});
	
	$("div.tree-node span").click(function(){
		//alert(1);
		
	});
}

function getRoleInfo() {
	var url = ctx + "/xtgl/role/getRoleInfo";
	var submitData = {
		search_EQ_orgcode : $("#search_EQ_orgcode").val()
	};
	var selected = $('#functions').tree('getChecked');
	for ( var i = 0; i < selected.length; i++) {
		$('#functions').tree('uncheck', selected[i].target);
	}
	$.post(url, submitData, function(data) {
		var datas = eval(data);
		$("#roleData").text("");
		$("#roleData").append(datas);
	});
}

function selectOptions(_roleid) {
	roleid = _roleid;
	$("input[name='optionsRadios'][id='role" + _roleid + "']").attr(
			"checked", true);
	// 清空选中项
	var selected = $('#functions').tree('getChecked');
	for ( var i = 0; i < selected.length; i++) {
		$('#functions').tree('uncheck', selected[i].target);
	}
	var url = ctx + "/xtgl/role/ajax_query_rolefunction?search_EQ_roleid=" + _roleid;
	$.get(url, {}, function(data) {
		var datas = eval(data);
		if (datas.length > 0) {
			// 加载新角色的选中项
			for ( var i = 0; i < datas.length; i++) {
				if (datas[i].paraentid != 0) {
					var node = $('#functions').tree('find', datas[i].id);
					$('#functions').tree('check', node.target);
				}
			}
		}
	});
}

function save() {
	val = $('input:radio[name="optionsRadios"]:checked').val();
	if (val == null || val == "") {
		alert("请选择角色");
		return;
	}
	var arr = [];
	var prevNode = [];
	var parantid = '';
	var i;
	var checkeds = $('#functions').tree('getChecked', 'checked');

	//判断全部的选项有没有被选中
	if ($("div[node-id='0']").find("span").eq(2).attr("class") == "tree-checkbox tree-checkbox1")
		i = 1;
	else
		i = 0;
	for (; i < checkeds.length; i++) {
		var node = $('#functions').tree('getParent', checkeds[i].target);
		// 若为叶子节点，存入节点集合
		var leaf = $(functions).tree('isLeaf', checkeds[i].target);
		if (leaf) {
			arr.push(checkeds[i].id);
		}
		// 父节点为全部的不存入节点集合
		if (node != null && node.id != 0 && parantid != node.id) {
			prevNode.push(node.id);
			parantid = node.id;
		}

	}
	var funcids = "";
	if (arr.length >= 0) {
		funcids = arr.join(',') + "," + prevNode.join(',');
	}
	saveRoleFunction(funcids);
}

function saveRoleFunction(funcids) {
	var url = ctx + "/xtgl/role/saveRoleFunction?search_funcids=" + funcids
			+ "&search_roleid=" + roleid;
	$.get(url, {}, function(data) {
		var datas = eval(data);
		alert(datas);
	});
}

function orgListChangeEvent(){
	getRoleInfo();
	//getFunList();
}

/**获取菜单列表**/

function getFunList() {
	var url = ctx + "/xtgl/role/getfuncList";
	var submitData = {
		search_EQ_orgcode : $("#search_EQ_orgcode").val()
	};
	
	$.post(url, submitData, function(data) {
		//var datas = eval(data);
		$("#functionData").html(data);
		reloadTree();
	});
}

function getCheckCellValue(treeName) {
	var arrIds = [];
	var arrNames = [];
	var arrCampusIds = [];
	var arrBjsjIds = [];
	var parantid = '';
	var i;
	var checkeds = $(treeName).tree('getChecked');
	for (i=0; i < checkeds.length; i++) {
		var node;
		if(i==0 && checkeds[0].text=="全部"){
			node = $(treeName).tree('getNode', checkeds[i].target);
		}else{
			node = $(treeName).tree('getParent', checkeds[i].target);
		}
		// 若为叶子节点，存入节点集合
		var leaf = $(treeName).tree('isLeaf', checkeds[i].target);
		if (leaf) {
			arrIds.push(checkeds[i].id);
			arrNames.push(checkeds[i].text);
		}
		// 父节点为全部的不存入节点集合
		if (node.id != 0 && node.id != 1 && parantid != node.id) {
			if(node.attributes.layer == 'campus' || node.attributes.layer == 'campus_xs'){
				arrCampusIds.push(node.id);
			}
			
			parantid = node.id;
		}
	}
	
	if (arrIds.length >= 0) {
		receiverIds = arrIds.join(',');
	}
	if(arrNames.length >= 0){
		receiverNames = arrNames.join(';');
	}
	
	arrCampusIds = getNoRepeat(arrCampusIds);
	if(arrCampusIds.length >= 0){
		campusids = arrCampusIds.join(',');
	}
	
	if(arrBjsjIds.length >= 0){
		bjsjIds = arrBjsjIds.join(',');
	}
	if(receiverNames == ""){
		receiverNames = "请点击右侧勾选接收人！";
	}
	$("#tzForm_receiverids").val(receiverIds);
	$("#tzForm_receiver").html(receiverNames);
}