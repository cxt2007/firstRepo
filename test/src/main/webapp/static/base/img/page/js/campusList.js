var ctx = $("#ctx").val();
var appid = $("#appid").val();
var commonUrl_ajax = $("#commonUrl_ajax").val();

$(document).ready(function() {
	generate_campus_table();
	$("#campus-search-btn").click(function() {
		generate_campus_table();
	});
	
	$("#orgList").change(function() {
		generate_campus_table();
	});
	
	$("#fzgl-save-btn").click(function() {
		saveDeptInfo();
	});
	
	$("#fzgl-del-btn").click(function() {
		delDeptInfo();
	});
	
	$("#fzgl-add-btn").click(function() {
		addDeptInfo();
	});
	
	$("#fzgl-edit-btn").click(function() {
		toEdit();
	});
	
	$("#search_nowName").keyup(function() {
		findDeptUserList();
	});
	
	$("#search_allName").keyup(function() {
		findAllUserList();
	});
	
	$("#bjList").change(function() {
		findAllUserList();
	});
	
	$("#fzgl-search-select-campus").change(function() {
		findDeptList();
		$("#nowUserList").html("");
		queryBjsj(true);
	});
	
	queryBjsj(false);
	findDeptList();
	
	$("#kqpz-save-btn").click(function(){
		saveKqpz();
	})
	
	$("#kqpz-search-select-campus").change(function(){
		queryKqpz();
	})
	
	$("#kqpz-search-btn").click(function(){
		queryKqpz();
	})
	
	getDictList(ApiParamUtil.COMMON_QUERY_DICT,".kqtype-data",DICTTYPE.DICT_TYPE_PUNCH_TYPE);
	
	$('.timepicker-input').datetimepicker({
		format: "hh:ii",
		keyboardNavigation: false,
		minuteStep: 0,
		language: 'zh-CN',
		startView: 1,
		minView: 0,
		maxView: 0,
		/*startDate: '06:00',
		endDate: '09:00',*/
		autoclose: true
	});
	
	$('.timepicker-input').datetimepicker().on('show', function(ev){
	    $('.datetimepicker thead tr').html('<div style="width:185px"></div>');
	});
	
	$('.timepicker-input').datetimepicker().on('changeDate', function(ev){
		var type = ev.target.id.substring(ev.target.id.lastIndexOf('_'));
		var time = ev.target.id.substring(ev.target.id.lastIndexOf('_'));
		var nodemsg = ev.target.id.split('_');
		var thistime = $('#'+ev.target.id).val();
		if(nodemsg[3]==="start"){
			var startNode = '#'+ev.target.id;
			var endNode = '#'+nodemsg[0]+"_"+nodemsg[1]+"_"+nodemsg[2]+"_"+'end';
			var starttime  = $(startNode).val();
			var endtime = $(endNode).val();
			var tip = '#'+nodemsg[0]+"_"+nodemsg[1]+"_tip_"+nodemsg[2];
			if(hourBranchFormatToSeconds(starttime)>hourBranchFormatToSeconds(endtime)){
				$(tip).html('时段设置错误');
				$(startNode+","+endNode).addClass("timepicker-error");
				return;
			}else{
				$(tip).html('');
				$(startNode+","+endNode).removeClass("timepicker-error");
			}
		}else if(nodemsg[3]==="end"){
			var startNode = '#'+nodemsg[0]+"_"+nodemsg[1]+"_"+nodemsg[2]+"_"+'start';
			var endNode = '#'+ev.target.id;
			var endtime  = $(endNode).val();
			var starttime = $(startNode).val();
			var tip = '#'+nodemsg[0]+"_"+nodemsg[1]+"_tip_"+nodemsg[2];
			if(hourBranchFormatToSeconds(starttime)>hourBranchFormatToSeconds(endtime)){
				$(tip).html('时段设置错误');
				$(startNode+","+endNode).addClass("timepicker-error");
				return;
			}else{
				$(tip).html('');
				$(startNode+","+endNode).removeClass("timepicker-error");
			}
		}else{
			return;
		}
		var errorNode = new Array();
		var tipNode = new Array();
		for(var i =1;i<7;i++){
			if(i==nodemsg[2])continue;
			var sta_node = '#'+nodemsg[0]+"_"+nodemsg[1]+"_"+i.toString()+"_"+"start";
			var end_node = '#'+nodemsg[0]+"_"+nodemsg[1]+"_"+i.toString()+"_"+"end";
			var other_tip = '#'+nodemsg[0]+"_"+nodemsg[1]+"_tip_"+i.toString();
			var sta_time = $(sta_node).val();
			var end_time = $(end_node).val();
			if(i<parseInt(nodemsg[2])){
				if(hourBranchFormatToSeconds(sta_time)>hourBranchFormatToSeconds(thistime)){
					errorNode.push(sta_node);
					tipNode.push(other_tip);
				}
				if(hourBranchFormatToSeconds(end_time)>hourBranchFormatToSeconds(thistime)){
					errorNode.push(end_node);
					tipNode.push(other_tip);
				}
			}else{
				if(hourBranchFormatToSeconds(sta_time)<hourBranchFormatToSeconds(thistime)){
					errorNode.push(sta_node);
					tipNode.push(other_tip);
				}
				if(hourBranchFormatToSeconds(end_time)<hourBranchFormatToSeconds(thistime)){
					errorNode.push(end_node);
					tipNode.push(other_tip);
				}
			}
		}
		if(errorNode.length!==0){
			tipNode.push(tip);
			errorNode.push('#'+ev.target.id);
			$(tipNode.join(',')).html('时段设置重合');
			$(errorNode.join(',')).addClass("timepicker-error");
		}else{
			$(".timepicker-error-tip").html('');
			$(".timepicker-error").removeClass("timepicker-error");
		}
	});
	
	queryKqpz();
});

/**
 * 时分转秒
 */
function hourBranchFormatToSeconds(date){
	var time = date.split(':');
	var hour = time[0];
	var branch = time[1];
	var seconds = hour*3600+branch*60;
	return seconds;
}


/**
 * 获取字典下拉框选项
 */
function getDictList(api,node,type){
	var msg = "没有选项！";
	var url = commonUrl_ajax;
	var submitData = {
			api: api,
			param: JSON.stringify({
				type:type
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createDictList(result.data.dictList,msg,node);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

/**
 * 创建字典下拉框
 * @param dataData
 * @param msg
 * @param node
 */
function createDictList(dataData,msg,node){
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].key+'">'+dataData[i].value+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.alert(msg);
	}else{
		$(node).val(dataData[0].key);
	}
	$(node).trigger("chosen:updated");
}

/**
 * 设置考勤配置的值
 */
function setKqpzDefaultValue(data){ 
	$('#tea_timepicker_1_start').val(data['20710511']);
	$('#tea_timepicker_1_start').attr("kgpzkey","20710511");
	$('#tea_timepicker_1_end').val(data['20710512']);
	$('#tea_timepicker_1_end').attr("kgpzkey","20710512");
	$('#tea_timepicker_2_start').val(data['20710521']);
	$('#tea_timepicker_2_start').attr("kgpzkey","20710521");
	$('#tea_timepicker_2_end').val(data['20710522']);
	$('#tea_timepicker_2_end').attr("kgpzkey","20710522");
	$('#tea_timepicker_3_start').val(data['20710531']);
	$('#tea_timepicker_3_start').attr("kgpzkey","20710531");
	$('#tea_timepicker_3_end').val(data['20710532']);
	$('#tea_timepicker_3_end').attr("kgpzkey","20710532");
	$('#tea_timepicker_4_start').val(data['20710541']);
	$('#tea_timepicker_4_start').attr("kgpzkey","20710541");
	$('#tea_timepicker_4_end').val(data['20710542']);
	$('#tea_timepicker_4_end').attr("kgpzkey","20710542");
	$('#tea_timepicker_5_start').val(data['20710551']);
	$('#tea_timepicker_5_start').attr("kgpzkey","20710551");
	$('#tea_timepicker_5_end').val(data['20710552']);
	$('#tea_timepicker_5_end').attr("kgpzkey","20710552");
	$('#tea_timepicker_6_start').val(data['20710561']);
	$('#tea_timepicker_6_start').attr("kgpzkey","20710561");
	$('#tea_timepicker_6_end').val(data['20710562']);
	$('#tea_timepicker_6_end').attr("kgpzkey","20710562");
	
	$('#stu_timepicker_1_start').val(data['20710611']);
	$('#stu_timepicker_1_start').attr("kgpzkey","20710611");
	$('#stu_timepicker_1_end').val(data['20710612']);
	$('#stu_timepicker_1_end').attr("kgpzkey","20710612");
	$('#stu_timepicker_2_start').val(data['20710621']);
	$('#stu_timepicker_2_start').attr("kgpzkey","20710621");
	$('#stu_timepicker_2_end').val(data['20710622']);
	$('#stu_timepicker_2_end').attr("kgpzkey","20710622");
	$('#stu_timepicker_3_start').val(data['20710631']);
	$('#stu_timepicker_3_start').attr("kgpzkey","20710631");
	$('#stu_timepicker_3_end').val(data['20710632']);
	$('#stu_timepicker_3_end').attr("kgpzkey","20710632");
	$('#stu_timepicker_4_start').val(data['20710641']);
	$('#stu_timepicker_4_start').attr("kgpzkey","20710641");
	$('#stu_timepicker_4_end').val(data['20710642']);
	$('#stu_timepicker_4_end').attr("kgpzkey","20710642");
	$('#stu_timepicker_5_start').val(data['20710651']);
	$('#stu_timepicker_5_start').attr("kgpzkey","20710651");
	$('#stu_timepicker_5_end').val(data['20710652']);
	$('#stu_timepicker_5_end').attr("kgpzkey","20710652");
	$('#stu_timepicker_6_start').val(data['20710661']);
	$('#stu_timepicker_6_start').attr("kgpzkey","20710661");
	$('#stu_timepicker_6_end').val(data['20710662']);
	$('#stu_timepicker_6_end').attr("kgpzkey","20710662");
	$('.timepicker-input').datetimepicker('update');
	
	$('#tea_kqtype_1').val(data['2071051']);
	$('#tea_kqtype_1').attr("kgpzkey","2071051");
	$('#tea_kqtype_2').val(data['2071052']);
	$('#tea_kqtype_2').attr("kgpzkey","2071052");
	$('#tea_kqtype_3').val(data['2071053']);
	$('#tea_kqtype_3').attr("kgpzkey","2071053");
	$('#tea_kqtype_4').val(data['2071054']);
	$('#tea_kqtype_4').attr("kgpzkey","2071054");
	$('#tea_kqtype_5').val(data['2071055']);
	$('#tea_kqtype_5').attr("kgpzkey","2071055");
	$('#tea_kqtype_6').val(data['2071056']);
	$('#tea_kqtype_6').attr("kgpzkey","2071056");
	$('#stu_kqtype_1').val(data['2071061']);
	$('#stu_kqtype_1').attr("kgpzkey","2071061");
	$('#stu_kqtype_2').val(data['2071062']);
	$('#stu_kqtype_2').attr("kgpzkey","2071062");
	$('#stu_kqtype_3').val(data['2071063']);
	$('#stu_kqtype_3').attr("kgpzkey","2071063");
	$('#stu_kqtype_4').val(data['2071064']);
	$('#stu_kqtype_4').attr("kgpzkey","2071064");
	$('#stu_kqtype_5').val(data['2071065']);
	$('#stu_kqtype_5').attr("kgpzkey","2071065");
	$('#stu_kqtype_6').val(data['2071066']);
	$('#stu_kqtype_6').attr("kgpzkey","2071066");
	
	
	$('#tea_kqtype_1_remark').val(data['2071051_remark']);
	$('#tea_kqtype_1_remark').attr("kgpzkey","2071051_remark");
	$('#tea_kqtype_2_remark').val(data['2071052_remark']);
	$('#tea_kqtype_2_remark').attr("kgpzkey","2071052_remark");
	$('#tea_kqtype_3_remark').val(data['2071053_remark']);
	$('#tea_kqtype_3_remark').attr("kgpzkey","2071053_remark");
	$('#tea_kqtype_4_remark').val(data['2071054_remark']);
	$('#tea_kqtype_4_remark').attr("kgpzkey","2071054_remark");
	$('#tea_kqtype_5_remark').val(data['2071055_remark']);
	$('#tea_kqtype_5_remark').attr("kgpzkey","2071055_remark");
	$('#tea_kqtype_6_remark').val(data['2071056_remark']);
	$('#tea_kqtype_6_remark').attr("kgpzkey","2071056_remark");
	$('#stu_kqtype_1_remark').val(data['2071061_remark']);
	$('#stu_kqtype_1_remark').attr("kgpzkey","2071061_remark");
	$('#stu_kqtype_2_remark').val(data['2071062_remark']);
	$('#stu_kqtype_2_remark').attr("kgpzkey","2071062_remark");
	$('#stu_kqtype_3_remark').val(data['2071063_remark']);
	$('#stu_kqtype_3_remark').attr("kgpzkey","2071063_remark");
	$('#stu_kqtype_4_remark').val(data['2071064_remark']);
	$('#stu_kqtype_4_remark').attr("kgpzkey","2071064_remark");
	$('#stu_kqtype_5_remark').val(data['2071065_remark']);
	$('#stu_kqtype_5_remark').attr("kgpzkey","2071065_remark");
	$('#stu_kqtype_6_remark').val(data['2071066_remark']);
	$('#stu_kqtype_6_remark').attr("kgpzkey","2071066_remark");
	
	$(".kqtype-data").trigger("chosen:updated");
}

function findDeptList(){
	GHBB.prompt("正在加载~");
	var param = {
		campusid : $("#fzgl-search-select-campus").val()
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_QUERY_DEPTLIST_BY_TYPE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$('#deptList').tree({
				data : result.data,
				loadFilter: function(data){
					return convert(data);
			    },
				onClick: function(node){
					changeCurrentType("deptList",node);
				}
			});
		}
	});
}

function changeCurrentType(treeName,node){
	$("#search_nowName").val("");
	$("#search_allName").val("");
	if($('#'+treeName).tree('isLeaf', node.target)){
		$("#currentNodeID").val(node.id);
		$("#currentNodeName").val(node.text);
		$("#currentType").val($('#'+treeName).tree('getParent',node.target).id);
		findDeptUserList();
		findAllUserList();
		$("#search_nowName").removeAttr("readOnly");
		$("#search_allName").removeAttr("readOnly");
		$("#bjList").removeAttr("disabled");
	}else{
		$("#currentNodeID").val("");
		$("#currentNodeName").val("");
		$("#currentType").val(node.id);
		$("#nowUserList").html('<div class="unData"></div>');
		$("#allUserList").html('<div class="unData"></div>');
		$("#search_nowName").attr("readOnly",true);
		$("#search_allName").attr("readOnly",true);
		$("#bjList").attr("disabled",true);
	}
	if($("#currentType").val() == "0"){
		$("#bjList").addClass("hide");
		$("#search_allName").addClass("width_100");
	}else{
		$("#bjList").removeClass("hide");
		$("#search_allName").removeClass("width_100");
	}
}

/**
 * 获取考勤配置信息
 */
function queryKqpz(){
	var url=ctx+"/xtgl/kgpz/ajax_queryKqConfigByCampusid";
	var submitData = {
			campusid: $("#kqpz-search-select-campus").val()
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			setKqpzDefaultValue(result.aaData);
		}
	});
}

/**
 * 保存考勤配置信息
 */
function saveKqpz(){
	var url = commonUrl_ajax;
	if($(".timepicker-error").length!==0){
		PromptBox.alert("时间段设置有误，请修改正确后再保存！")
		return;
	}
	var kapzArray = new Object();
	$('.timepicker-input,.kqtype-data').each(function(){
		if(!$(this).val()){
			PromptBox.alert("时段时间不能为空！")
			return;
		}
		kapzArray[$(this).attr("kgpzkey")] = $(this).val().replace(/\s/g,'');
	})
	var params={
			campusid: $("#kqpz-search-select-campus").val(),
			userid: main_userid,
			orgcode: main_orgcode,
			kapzArray:kapzArray
	}
	var submitData = {
			api: ApiParamUtil.SCHOOL_KGPZ_SAVE,
			param: JSON.stringify(params)
	};
	GHBB.prompt("数据保存中~");
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		data: submitData,
		success: function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code == 200){
				PromptBox.alert("保存成功！");
			}
		}
	});
}


function toEdit(){
	if($("#currentNodeID").val() == null || $("#currentNodeID").val() == ""){
		alert("请先选择一个分组");
		return;
	}
	$('#modal-fzgl').modal('show');
	findDeptInfo($("#currentNodeID").val());
}

function findDeptInfo(id){
	var param = {
		id : id
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_QUERY_DEPTINFO,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#deptid").val(result.data.id);
			$("#deptname").val(result.data.deptname);
			$("#leader").val(result.data.leader);
			$("#orderid").val(result.data.orderid);
			$("#remark").val(result.data.remark);
			$('#depttype').find("option[value='" + $("#currentType").val() + "']")
			.attr("selected", true);
			$('#depttype').trigger("chosen:updated");
		}
	});
}

function delDeptInfo(){
	if($("#currentNodeID").val() == "0" || $("#currentNodeID").val() == "1" || $("#currentNodeID").val() == ""){
		return;
	}
	var str = "确认删除\""+$("#currentNodeName").val()+"\"？";
	if(confirm(str)){
		GHBB.prompt("数据保存中~");
		var param = {
			type : $("#currentType").val(),
			id : $("#currentNodeID").val()
		}
		var submitData = {
			api : ApiParamUtil.SYS_MANAGE_DEL_DEPTINFO,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(json) {
			GHBB.hide();
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				alert("删除成功!");
				$("#currentNodeID").val("");
				$("#currentNodeName").val("");
				$("#currentType").val("");
				$("#deptList").empty();
				findDeptList();
				closeDeptInfo();
			}else if(result.ret.code == 400){
				alert(result.ret.msg);
			}
		});
	}
}

function addDeptInfo(){
	$("#deptid").val("");
	$("#deptname").val("");
	$("#leader").val("");
	$("#orderid").val(1000);
	$("#remark").val("");
	$('#depttype').find("option[value='" + $("#currentType").val() + "']").attr("selected", true);
	$("#depttype").trigger("chosen:updated");
	$('#modal-fzgl').modal('show');
}

function closeDeptInfo(){
	$("#deptid").val("");
	$("#deptname").val("");
	$("#leader").val("");
	$("#orderid").val(1000);
	$("#remark").val("");
	$('#depttype').find("option[value='" + $("#currentType").val() + "']").attr("selected", true);
	$("#depttype").trigger("chosen:updated");
	$('#modal-fzgl').modal('hide');
}

function saveDeptInfo(){
	var campusid = $("#fzgl-search-select-campus").val();
	var depttype = $("#depttype").val();
	var deptname = $("#deptname").val();
	var leader = $("#leader").val();
	var orderid = $("#orderid").val();
	var remark = $("#remark").val();
	var deptid = $("#deptid").val();
	if(orderid == ""){
		orderid = "0";
	}
	if(deptname == ""){
		alert("组名不能为空！");
		return;
	}
	var param = {
		campusid : campusid,
		type : depttype,
		deptname : deptname,
		leader : leader,
		orderid : orderid,
		remark : remark,
		id : deptid
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SAVE_DEPTINFO,
		param : JSON.stringify(param)
	};
	GHBB.prompt("数据保存中~");
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			alert("保存成功!");
			findDeptList();
			closeDeptInfo();
		}else if(result.ret.code == 400){
			alert(result.ret.msg);
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
		if (!exists(rows, row.parentId)){
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
			if (row.parentId == node.id){
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

function generate_campus_table() {
	var rownum = 1;
	GHBB.prompt("正在加载~");
	var sAjaxSource = ctx + "/xtgl/campus/ajax_findCampusInfo";
	var param = "campus=" + $("#campus").val();
	param = param+"&orgList=" + $("#orgList").val();
	sAjaxSource = sAjaxSource + "?" + param;
	var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "imgpath"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "campus"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "cjrq"
	}];
	if($("#main_orgcode").val()==10010){
		var aoColumns = [ {
			"sWidth" : "70px",
			"sClass" : "text-center",
			"mDataProp" : "id"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "id"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "imgpath"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "campus"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "cjrq"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "id"
		} ];
	}

	$('#campus-datatable')
			.dataTable(
					{
						"iDisplayLength" : 50,
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
							// 校区图片
							var imgpath = "";
							if (aaData.imgpath != null && aaData.imgpath != '') {
								imgpath = aaData.imgpath;
							} else {
								imgpath = ctx + "/static/pixelcave/backend/img/jquery.chosen/campus.png";
							}
							var picHtml = '<img src="'
									+ imgpath
									+ '" style="height:64px;width: 64px" alt="avatar" class="img-circle">';
							$('td:eq(2)', nRow).html(picHtml);
							// 校区名称
							var editHtml = '<div style="text-align:center;"><a href="'
									+ ctx
									+ '/xtgl/campus/update/'
									+ aaData.id
									+ '?appid='+appid+'">' + aaData.campus + '</a></div>';
							$('td:eq(3)', nRow).html(editHtml);
							// 删除
							if($("#main_orgcode").val()==10010){
								var delhtml = '<div class="btn-group btn-group-xs"><a href="'
									+ ctx
									+ '/xtgl/campus/delete/'
									+ aaData.orgcode
									+ '/'
									+ aaData.id
									+ '?appid='+appid+'" onclick="return delConfirm('
									+ aaData.ystype + ');">删除</div>';
								$('td:eq(5)', nRow).html(delhtml);
							}
							

							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns,
						"fnInitComplete": function(oSettings, json) {
							GHBB.hide();
					    }
					});
}

function delConfirm(ystype) {
	if (ystype == 1) {
		alert("当前校区为主园，不能删除！");
		return false;
	}
	if (confirm("校区信息属于关键信息，确认是否删除该条纪录?")) {
		return true;
	} else {
		return false;
	}
};

function queryBjsj(_ifRefresh){
	var param = {
		campusid:$("#fzgl-search-select-campus").val(),
		userid:main_userid,
	};
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_CLASS_FOR_ALL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData,function(json) {
		var result = typeof json === "object" ? json : JSON.parse(json);
		if(result.ret.code==="200"){
			$("#bjList").find("option").remove();
			var bjidsStr = "";
			for (var i = 0; i < result.data.bjList.length; i++) {
				if(i > 0){
					bjidsStr += ",";
				}
				bjidsStr += result.data.bjList[i].id;
				$("#bjList").append('<option value="'+result.data.bjList[i].id+'">'+result.data.bjList[i].bj+'</option>');
			}
			$("#bjList").prepend('<option value="'+bjidsStr+'">全部班级</option>');
			$("#adviseType").trigger("chosen:updated");
			if(_ifRefresh){
				$("#bjList").change();
			}
		}else{
			$("#adviseType").append('<option value="0">'+result.ret.msg+'</option>');
			$("#adviseType").trigger("chosen:updated");
		}
	});
}

function findDeptUserList(){
	var param = {
		campusid : $("#fzgl-search-select-campus").val(),
		username : $("#search_nowName").val(),
		depttype : $("#currentType").val(),
		deptid : $("#currentNodeID").val()
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_QUERY_USER_LIST_BY_DEPTID,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#nowUserNum").html(result.data.userList.length);
			createUserList("nowUserList",result.data.userList);
		}
	});
}

function findAllUserList(){
	var param = {};
	if($("#currentType").val() == "0"){
		param = {
			campusid : $("#fzgl-search-select-campus").val(),
			username : $("#search_allName").val(),
			depttype : $("#currentType").val(),
			deptid : $("#currentNodeID").val()
		}
	}else if($("#currentType").val() == "1"){
		param = {
			campusid : $("#fzgl-search-select-campus").val(),
			username : $("#search_allName").val(),
			bjid : $("#bjList").val(),
			depttype : $("#currentType").val(),
			deptid : $("#currentNodeID").val()
		}
	}else{
		alert("未选中部门！");
		return;
	}
	
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_QUERY_USER_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#allUserNum").html(result.data.userList.length);
			createUserList("allUserList",result.data.userList);
		}
	});
}

function createUserList(listName,datas){
	$("#"+listName).html("");
	var str = "";
	if(datas.length > 0){
		var li = "";
		for (var i = 0; i < datas.length; i++) {
			li += '<li>'
			   +  '		<input type="checkbox" name="'+listName+'" value="'+datas[i].userid+'" />'
			   +  '		<span>'+datas[i].username+'</span>'
			   +  '</li>'
		}
		$("#"+listName).html('<ul>'+li+'</ul>');
	}else{
		$("#"+listName).html('<div class="noData">没有人员！</ul>');
	}
}

function setDept(){
	var deptid = $("#currentNodeID").val();
	if(deptid == null || deptid == ""){
		alert("请选择需要分配到的分组！");
		return;
	}
	var memberid = getCheckedUserIds("allUserList");
	if(memberid == null || memberid == ""){
		alert("请在右侧列表选择需要设置分组的人员！");
		return;
	}
	var param = {
		memberid : memberid,
		deptid : deptid,
		campusid : $("#fzgl-search-select-campus").val(),
		type : $("#currentType").val()
	}
	var submitData = {
		api : ApiParamUtil.COMMON_SET_DEPT,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			findDeptUserList();
			findAllUserList();
		}
	});
}

function cancelDept(){
	var deptid = $("#currentNodeID").val();
	if(deptid == null || deptid == ""){
		alert("请选择需要分配到的分组！");
		return;
	}
	var userids = getCheckedUserIds("nowUserList");
	if(userids == null || userids == ""){
		alert("请在左侧列表选择需要取消分组的人员！");
		return;
	}
	var param = {
		userids : userids,
		deptid : deptid,
		campusid : $("#fzgl-search-select-campus").val(),
		depttype : $("#currentType").val()
	}
	var submitData = {
		api : ApiParamUtil.COMMON_CANCEL_DEPT,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			findDeptUserList();
			findAllUserList();
		}
	});
}

function getCheckedUserIds(checkedName){
	var userids = "";
	var checkedItems = $('input[type="checkbox"][name="'+checkedName+'"]:checked');
	for (var i = 0; i < checkedItems.length; i++) {
		if(i > 0){
			userids += ",";
		}
		userids += checkedItems.eq(i).val();
	}
	return userids;
}




