var ctx = "";
var roleDatatables = function() {

	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document).ready(function() {
	generate_table_role();

	$("#orgcode").change(function() {
		generate_table_role();
	});

	$("#saveSubmit").click(function() {
		var rolename = $("#rolename").val();
		if (rolename == null || rolename == "") {
			PromptBox.alert("角色名称不能为空");
			return;
		}
		var rolecode = $("#rolecode").val();
		if (rolecode == null || rolecode == "") {
			PromptBox.alert("角色代码不能为空");
			return;
		}
		if (!rolecode.match(/^[A-Za-z]+$/i)) {
			PromptBox.alert("角色代码只能输入字母");
			return;
		}

		if (confirm("确定保存?")) {
			var url = ctx + "/xtgl/role/save_role";
			var submitData = {
				id : $("#role_id").val(),
				orgcode : $("#orgcode").val(),
				rolename : $("#rolename").val(),
				rolecode : $("#rolecode").val(),
				remark : $("#remark").val()
			};
			$.post(url, submitData, function(data) {
				if (data == "success") {
					setRoleResetting();
					generate_table_role();
				} else {
					PromptBox.alert(data);
				}
				return false;
			});
			return false;
		} else
			return false;

	});
	$("#resetRole").click(function() {
		setRoleResetting();
	});
	
	$("#func-add-btn").click(function() {
		clear_menu_info();
	});
	
	$("#func-del-btn").click(function() {
		delete_menu_info();
	});
	
	$("#func-save-btn").click(function() {
		save_menu_info();
	});
	
	querySchoolType();
	
	$("#schoolType").change(function(){
		loading_func_list();
		loading_parent_menu_list();
		clear_menu_info();
	});
	
	$("#parentMenuList").change(function(){
		init_functioncode();
	});
	
});

function init_functioncode() {
	$("#functioncode").val(parseInt($("#parentMenuList option[value="+$("#parentMenuList").val()+"]").attr("name")) + 1);
}

function querySchoolType() {
	var param = {
		type : DICTTYPE.DICT_TYPE_SCHOOL_TYPE
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_DICT,
		param : JSON.stringify(param)
	};
	
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code == "200"){
				$("#schoolType option").remove();
				for (var i = 0; i < result.data.dictList.length; i++) {
					$("#schoolType")
						.append("<option value=" + result.data.dictList[i].key + ">" + result.data.dictList[i].value + "</option>");
				}
				$("#schoolType option").eq(0).attr("selected", true);
				$("#schoolType").trigger("chosen:updated");
				loading_func_list();
				loading_parent_menu_list();
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function clear_menu_info() {
	$("#functionname").val("");
	$("#menuPath").val("");
	$("#description").val("");
	$("#functioncode").val("");
	$("#currentNodeId").val("");
	$("#currentNodeName").val("");
	$("#func-tabid").val("");
	$("#func-api").val("");
	$("#func-path").val("");
	$("#func-state").val("1");
	$("#func-type").val("1");
	$("#func-state").trigger("chosen:updated");
	$("#func-save-btn").html("新增保存");
}

function delete_menu_info() {
	if ($("#currentNodeId").val() == '' || $("#currentNodeId").val() == '0') {
		PromptBox.alert('请选中需要删除的菜单！');
		return;
	}
	if (confirm('确认删除“' + $("#currentNodeName").val() + '”菜单吗？')) {
		var param = {
			id: $("#currentNodeId").val()
		}
		var submitData = {
			api: ApiParamUtil.SYS_MANAGE_ROLE_AND_MENU_DELETE_MENU_INFO,
			param: JSON.stringify(param)
		};
		
		$.ajax({
			cache: false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas) {
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code == "200"){
					PromptBox.alert('菜单删除成功！');
					loading_func_list();
				} else if (result.ret.code == "400") {
					PromptBox.alert(result.ret.msg);
				} else {
					console.log(result.ret.code + ":" + result.ret.msg);
				}
			}
		});
	}
	
}

function save_menu_info() {
	var param = {
		id: $("#currentNodeId").val(),
		functioncode: $("#functioncode").val(),
		functionname: $("#functionname").val(),
		parentid: $("#parentMenuList").val(),
		url: $("#menuPath").val(),
		state: $("#func-state").val(),
		xxtype: $("#schoolType").val(),
		description: $("#description").val(),
		tabid:$("#func-tabid").val(),
		funcapi:$("#func-api").val(),
		funcpath:$("#func-path").val(),
		type:$("#func-type").val()
	}
	var submitData = {
		api: ApiParamUtil.SYS_MANAGE_ROLE_AND_MENU_SAVE_MENU_INFO,
		param: JSON.stringify(param)
	};
	
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code == "200"){
				PromptBox.alert('菜单保存成功！');
				loading_func_list();
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function loading_parent_menu_list() {
	var param = {
		xxtype: $("#schoolType").val()
	}
	var submitData = {
		api: ApiParamUtil.SYS_MANAGE_ROLE_AND_MENU_QUERY_TOP_MENU_LIST,
		param: JSON.stringify(param)
	};
	
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code == "200"){
				$("#parentMenuList").find("option").remove();
				for (var i = 0; i < result.data.parentlist.length; i++) {
					$("#parentMenuList").append('<option name="'+result.data.parentlist[i].functioncode+'" value="'+result.data.parentlist[i].id+'">'+result.data.parentlist[i].functionname+'</option>');
				}
				$("#parentMenuList").prepend('<option name="0" value="0">无</option>');
				$("#parentMenuList").trigger("chosen:updated");
			} else {
				$("#parentMenuList").append('<option value="0">'+result.ret.msg+'</option>');
				$("#parentMenuList").trigger("chosen:updated");
			}
		}
	});
}

function loading_func_list() {
	var param = {
		xxtype: $("#schoolType").val()
	}
	var submitData = {
		api: ApiParamUtil.SYS_MANAGE_ROLE_AND_MENU_QUERY_MENU_LIST,
		param: JSON.stringify(param)
	};
	
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code == "200") {
				$('#funcList').tree({
					data: result.data.funclist,
					loadFilter: function(data){
						return convert(data);
				    },
					onClick: function(node){
						changeNode(node);
					}
				});
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function changeNode(node) {
	$("#currentNodeId").val(node.id);
	$("#currentNodeName").val(node.text);
	if (node.id == 0) {
		$('#func-save-btn').attr('disabled',"true");
	} else {
		$('#func-save-btn').removeAttr("disabled");
		$("#func-save-btn").html("修改保存");
		loading_menu_info(node);
	}
}


function loading_menu_info(node) {
	var param = {
		id: node.id
	}
	var submitData = {
		api: ApiParamUtil.SYS_MANAGE_ROLE_AND_MENU_QUERY_MENU_INFO,
		param: JSON.stringify(param)
	};
	
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code == "200") {
				$("#functionname").val(result.data.funcinfo.functionname);
				$("#menuPath").val(result.data.funcinfo.url);
				$("#description").val(result.data.funcinfo.description);
				$("#functioncode").val(result.data.funcinfo.functioncode);
				$("#func-tabid").val(result.data.funcinfo.tabid);
				$("#func-api").val(result.data.funcinfo.api);
				$("#func-path").val(result.data.funcinfo.path);
				$("#parentMenuList").val(result.data.funcinfo.parentid);
				$("#parentMenuList").trigger("chosen:updated");
				$("#func-state").val(result.data.funcinfo.state);
				$("#func-state").trigger("chosen:updated");
				$("#func-type").val(result.data.funcinfo.type);
				$("#func-type").trigger("chosen:updated");
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function convert(rows){
	function exists(rows, parentId){
		for(var i=0; i<rows.length; i++){
			if (rows[i].id == parentId) return true;
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

function setRoleResetting() {
//	$("#role_id").val('');
//	$('#orgcode option').eq(0).attr("selected", true);
//	$('#orgcode').trigger("chosen:updated");
	$("#rolename").val('');
	$("#rolecode").val('');
	$("#remark").val('');

}

function generate_table_role() {
	var rownum = 1;
	App.datatables();

	var sAjaxSource = ctx + "/xtgl/role/ajax_query_role?orgcode="
			+ $('#orgcode').val();
	var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "orgname"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "rolename"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "rolecode"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "remark"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "rolename"
	} ];

	$('#role-datatable')
			.dataTable(
					{
						"aaSorting" : [ [ 3, 'desc' ] ],
						"iDisplayLength" : 10,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"bSort" : false,
						"sAjaxSource" : sAjaxSource,
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							// 序号
							$('td:eq(0)', nRow).html(rownum);
							var editHtml = '<div style="text-align:center"><a href="javascript:openRoleEdit(\''
									+ aaData.id
									+ '\');">'
									+ aaData.rolename
									+ '</a></div>';
							$('td:eq(2)', nRow).html(editHtml);
							// 删除
							var delHtml = '<div class="btn-group btn-group-xs"><a href="javascript:delRoleConfirm('
									+ aaData.id + ');">删除</a></div>';
							$('td:eq(5)', nRow).html(delHtml);

							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns
					});
}

function openRoleEdit(role_id) {
	var url = ctx + "/xtgl/role/ajax_query_role_id";
	var submitData = {
		id : role_id
	};
	$.post(url, submitData, function(data) {
		var datas = eval("(" + data + ")");

		$("#role_id").val(datas.id);
		$("#rolename").val(datas.rolename);
		$("#rolecode").val(datas.rolecode);
		$("#remark").val(datas.remark);
	});
}

function delRoleConfirm(id) {
	if (confirm("确认删除?")) {
		var url = ctx + "/xtgl/role/ajax_delRole";
		var submitData = {
			id : id
		};
		$.post(url, submitData, function(data) {
			if (data == "error") {
				alert("该角色存在用户,不能删除");
				return;
			}
			alert("删除成功!");
			generate_table_role();
			setRoleResetting();
			return false;
		});
	}
}
