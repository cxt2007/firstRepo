var msgtree = {
		stutree:[],
		teatree:[],
		grouptree:[]
}
var msg_stu_tree_level = {
		all: "all",
		campus: "campus",
		class: "class",
		student: "student"
}
var msg_tea_tree_level = {
		all: "all",
		campus: "campus",
		department: "department",
		teacher: "teacher"
}
var msg_group_tree_level = {
		all: "all",
		campus: "campus",
		group: "group",
		people: "people"
}
var msgtree_checked = {
		stutree: new Map(),
		teatree: new Map(),
		grouptree: new Map()
}
var msgtree_config = {
	campusids: '',
	all: true
};

var receiverIds = "";
var receiverNames = "";

/**
 * 切换树tab
 * @param obj
 * @param type
 */
function changeTab(obj,type){
	if(receiverIds.length>0){
		if (confirm("切换后之前选择的接收人将被清除，是否继续?")) {
			resetReceivers();
			resetTree('#teacherData');
			resetTree('#xsjbData');
			resetTree('#stuDeptData');
			changeTabs(obj,type);
		}
	}else{
		changeTabs(obj,type);
	}
	loadTree(obj);
}

/**
 * 加载树
 * @param obj
 */
function loadTree(obj){
	var typeName = $(obj).attr("name");
	var typeList = $("#"+typeName).find("li");
	if(typeList.length == 0){
		if(typeName == "xsjbList-tab"){
			queryClassStuList("");
		}else if(typeName == "teacherList-tab"){
			queryTeacherList("");
		}else if(typeName == "stuDeptList-tab"){
			queryStuDeptList("");
		}
	}
}

/**
 * 切换多个tab
 * @param obj
 * @param type
 */
function changeTabs(obj,type){
	$("#searchClass").val("");
	$("#searchTeacher").val("");
	$("#searchDept").val("");
	var tab_content_name = $(obj).attr("name");
	$(obj).parent().parent().children().removeClass("active");
	$(obj).parent().addClass("active");
	$("#"+tab_content_name).parent().find(".tab-pane").removeClass("active");
	$("#"+tab_content_name).addClass("active");
	$("#sendList").val("[]");
	if(type==1 || type==3){
		tztype = 2;
	}else{
		tztype = 4;
	}
}

/**
 * 重置树
 * @param treeName
 */
function resetTree(treeName){
	var selected = $(treeName).tree('getChecked');
	for ( var i = 0; i < selected.length; i++) {
		$(treeName).tree('update', {
			target: selected[i].target,
			checked: false
		});
	}
}

/**
 * 重置选择人
 */
function resetReceivers(){
	receiverIds = "";
	receiverNames = "";
	campusids = "";
	bjsjIds = "";
	$("#presetDate").attr("checked",false);
	if($("#resendsms")!=undefined && $("#resendsms")!=null){
		$("#resendsms").attr("checked",false);

	}


	$("#publishdate").val('');
	$("#publishdateDiv").hide();
	
	$("#tzForm_receiverids").val('');
	$("#tzForm_receiver").html('请点击右侧校区或班级或者姓名勾选接收人！');
}

/**
 * 查询学生树数据
 * @param type
 */
function queryStuTreeData(type,parent){
	GHBB.prompt("正在加载~");
	var api = null;
	var param = null;
	if(type===msg_stu_tree_level.campus){
		api = ApiParamUtil.COMMON_QUERY_CAMPUS;
		param = {
			userid : main_userid,
			name   : name
		};
	}else if(type===msg_stu_tree_level.class){
		api = ApiParamUtil.COMMON_QUERY_CLASS;
		param = {
			userid: main_userid,
			campusid: parent.id
		};
	}else if(type===msg_stu_tree_level.student){
		api = ApiParamUtil.MSG_CLASS_STU_ADDRESS_LIST_QUERY;
		param = {
			bjid:parent.id,
			campusid: $('#xsjbData').tree('getParent',parent.target).id
		};
	}else{
		return;
	}
	var submitData = {
		api : api,
		param : JSON.stringify(param)
	};
	$.ajax({
		async:false,
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				GHBB.hide();
				if(type===msg_stu_tree_level.campus){
					createStuTreeData(result.data.campusList,type);
				}else if(type===msg_stu_tree_level.class){
					createStuTreeData(result.data.bjList,type,parent.id);
				}else if(type===msg_stu_tree_level.student){
					createStuTreeData(result.data,type,parent.id);
				}
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
};

/**
 * 组装学生树
 * @param dataList
 * @param type
 * @param parentId
 */
function createStuTreeData(dataList,type,parentId){
	if(type===msg_stu_tree_level.campus){
		createStuTreeCampusNode(dataList);
		$('#xsjbData').tree({
			data : msgtree.stutree,
		    onBeforeExpand: function(node){
		    	if(!node.attributes.childrenLoad){
		    		if(node.attributes.type===msg_stu_tree_level.campus){
		    			queryStuTreeData(msg_stu_tree_level.class,node);
		    		}else if(node.attributes.type===msg_stu_tree_level.class){
		    			queryStuTreeData(msg_stu_tree_level.student,node);
		    		}
		    	}
		    },
			onClick: function(node){
				if(node.checked){
		    		$('#xsjbData').tree('uncheck', node.target);
		    	}else{
		    		$('#xsjbData').tree('check', node.target);
		    	}
			},
		    onCheck: function(node){
		    	stuTreeCheckedValue(node);
		    }
		});
		if(msgtree_config.all){
			if(msgtree.stutree[0].children.length===1){
				var node = $('#xsjbData').tree('find', msgtree.stutree[0].children[0].id);
				$('#xsjbData').tree('expand',node.target);
			}
		}else{
			if(msgtree.stutree.length===1){
				var node = $('#xsjbData').tree('find', msgtree.stutree[0].id);
				$('#xsjbData').tree('expand',node.target);
			}
		}
	}else if(type===msg_stu_tree_level.class){
		var node = $('#xsjbData').tree('find', parentId);
			var classData = new Object();
			classData.parent = node.target;
			classData.data = createStuTreeClassNode(dataList);
			node.attributes.childrenLoad = true;
		$('#xsjbData').tree('append', classData);
	}else if(type===msg_stu_tree_level.student){
		var node = $('#xsjbData').tree('find', parentId);
		var stuData = new Object();
		stuData.parent = node.target;
		stuData.data = createStuTreeStuNode(dataList);
		node.attributes.childrenLoad = true;
		$('#xsjbData').tree('append', stuData);
	}
}

/**
 * 组装校区节点
 */
function createStuTreeCampusNode(dataList){
	if(msgtree_config.all){
		msgtree.stutree = [{
			children: [],
			id: "",
			text: "全部",
			attributes:{
				childrenLoad: true,
				type: msg_stu_tree_level.all
			}
		}]
		for(var i = 0;i<dataList.length;i++){
			var campusNode = new Object();
			campusNode.children = [];
			campusNode.id = dataList[i].id;
			campusNode.text = dataList[i].value;
			campusNode.state = "closed";
			campusNode.attributes = {
					childrenLoad: false,
					type: msg_stu_tree_level.campus
			}
			msgtree.stutree[0].children.push(campusNode);
		}
	}else{
		msgtree.stutree = [];
		for(var i = 0;i<dataList.length;i++){
			if(msgtree_config.campusids && msgtree_config.campusids != dataList[i].id ){
				continue;
			}
			var campusNode = new Object();
			campusNode.children = [];
			campusNode.id = dataList[i].id;
			campusNode.text = dataList[i].value;
			campusNode.state = "closed";
			campusNode.attributes = {
					childrenLoad: false,
					type: msg_stu_tree_level.campus
			}
			msgtree.stutree.push(campusNode);
		}
	}
}

/**
 * 组装班级节点
 */
function createStuTreeClassNode(dataList){
	var nodes = new Array();
	for(var i = 0;i<dataList.length;i++){
		var classNode = new Object();
		classNode.children = [];
		classNode.id = dataList[i].id;
		classNode.text = dataList[i].bj;
		classNode.state = "closed";
		classNode.attributes = {
				childrenLoad: false,
				type: msg_stu_tree_level.class
			}
		nodes.push(classNode);
	}
	return nodes;
}

/**
 * 组装学生节点
 */
function createStuTreeStuNode(dataList){
	var nodes = new Array();
	for(var i = 0;i<dataList.length;i++){
		var stuNode = new Object();
		stuNode.children = [];
		stuNode.id = dataList[i].id;
		stuNode.text = dataList[i].xm;
		stuNode.attributes = {
				childrenLoad: false,
				type: msg_stu_tree_level.student,
				campusid: dataList[i].campusid,
				bjid: dataList[i].bjid,
			}
		nodes.push(stuNode);
	}
	return nodes;
}

/**
 * 学生树联动收件人
 */
function stuTreeCheckedValue(node){
	var classId;
	var campusId;
	GHBB.prompt("正在加载~");
	if(node.attributes.type===msg_stu_tree_level.campus){
		classId = "";
		campusId = node.id;
		param = {
				bjid: classId,
				campusid: campusId,
				type: node.attributes.type
		};
		var submitData = {
				api : ApiParamUtil.MSG_CLASS_STU_ADDRESS_LIST_QUERY,
				param : JSON.stringify(param)
		};
		$.ajax({
			async:false,
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas){
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					var dataList = result.data;
					if(node.checked){
						var campusObj = new Object();
						var classMap = new Map();
						var stuMap = new Map();
						campusObj.campusid = campusId;
						for(var i=0;i<dataList.length;i++){
							var mapObj = new Object();
							classMap.put(dataList[i].bjid,dataList[i].bjid);
							mapObj.id=dataList[i].id;
							mapObj.text=dataList[i].xm;
							stuMap.put(mapObj.id,mapObj);
						}
						campusObj.classMap = classMap;
						campusObj.stuMap = stuMap;
						msgtree_checked.stutree.put(campusId, campusObj);
					}else{
						if(msgtree_checked.stutree.get(campusId)){
							msgtree_checked.stutree.remove(campusId);
						}
					}
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}else if(node.attributes.type===msg_stu_tree_level.class){
		classId = node.id;
		campusId = $('#xsjbData').tree('getParent',node.target).id;
		param = {
				bjid: classId,
				campusid: campusId,
				type: node.attributes.type
		};
		var submitData = {
				api : ApiParamUtil.MSG_CLASS_STU_ADDRESS_LIST_QUERY,
				param : JSON.stringify(param)
		};
		$.ajax({
			async:false,
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas){
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					var dataList = result.data;
					if(node.checked){
						if(!msgtree_checked.stutree.get(campusId)){
							var campusObj = new Object();
							campusObj.classMap = new Map();
							campusObj.stuMap = new Map();
							msgtree_checked.stutree.put(campusId, campusObj);
						}
						msgtree_checked.stutree.get(campusId).classMap.put(classId,classId);
						for(var i=0;i<dataList.length;i++){
							var mapObj = new Object();
							mapObj.id=dataList[i].id;
							mapObj.text=dataList[i].xm;
							msgtree_checked.stutree.get(campusId).stuMap.put(mapObj.id,mapObj);
						}
					}else{
						if(msgtree_checked.stutree.get(campusId).classMap.get(classId)){
							msgtree_checked.stutree.get(campusId).classMap.remove(classId);
							for(var i=0;i<dataList.length;i++){
								msgtree_checked.stutree.get(campusId).stuMap.remove(dataList[i].id);
							}
						}
					}
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}else if(node.attributes.type===msg_stu_tree_level.student){
		classId = node.attributes.bjid;
		campusId = node.attributes.campusid;
		if(node.checked){
			if(!msgtree_checked.stutree.get(campusId)){
				var campusObj = new Object();
				campusObj.classMap = new Map();
				campusObj.stuMap = new Map();
				msgtree_checked.stutree.put(campusId, campusObj);
			}
			msgtree_checked.stutree.get(campusId).classMap.put(classId,classId);
			var mapObj = new Object();
			mapObj.id = node.id;
			mapObj.text = node.text;
			msgtree_checked.stutree.get(campusId).stuMap.put(node.id,mapObj);
		}else{
			msgtree_checked.stutree.get(campusId).stuMap.remove(node.id);
			if($($('#xsjbData').tree('find', classId).target).find(".tree-checkbox").hasClass("tree-checkbox0")){
				msgtree_checked.stutree.get(campusId).classMap.remove(classId);
			}
			if($($('#xsjbData').tree('find', campusId).target).find(".tree-checkbox").hasClass("tree-checkbox0")){
				msgtree_checked.stutree.remove(campusId);
			}
		}
	}else if(node.attributes.type===msg_stu_tree_level.all){
		classId = "";
		campusId = "";

		param = {
				bjid: classId,
				campusid: campusId,
				type: node.attributes.type
		};
		var submitData = {
				api : ApiParamUtil.MSG_CLASS_STU_ADDRESS_LIST_QUERY,
				param : JSON.stringify(param)
		};
		$.ajax({
			async:false,
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas){
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					var dataList = result.data;
					var childrens = $('#xsjbData').tree('getChildren',node.target);
					if(node.checked){
						for(var j=0;j<childrens.length;j++){
							if(childrens[j].attributes.type===msg_stu_tree_level.campus){
							  var campusObj = new Object();
							  campusObj.classMap = new Map();
							  campusObj.stuMap = new Map();
							  campusObj.campusid = childrens[j].id;
							  msgtree_checked.stutree.put(childrens[j].id, campusObj);
							}
						}
						for(var i=0;i<dataList.length;i++){
							var mapObj = new Object();
							mapObj.id=dataList[i].id;
							mapObj.text=dataList[i].xm;
							msgtree_checked.stutree.get(dataList[i].campusid).stuMap.put(mapObj.id,mapObj);
							msgtree_checked.stutree.get(dataList[i].campusid).classMap.put(dataList[i].bjid,dataList[i].bjid);
						}
					}else{
						for(var j=0;j<childrens.length;j++){
							if(msgtree_checked.stutree.get(childrens[j].id)){
								msgtree_checked.stutree.remove(childrens[j].id);
							}
						}
					}
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}else{
		GHBB.hide();
		return;
	}
	var checkedkey = [];
	var checkedvalue = [];
	var campusArray = [];
	msgtree_checked.stutree.each(function(key,value,index){
		var campusObj = {};
		campusObj.campusid = key;
		campusObj.bjids = [];
		campusObj.receiveids = [];
		value.classMap.each(function(bjid,bj,index){
			campusObj.bjids.push(bjid);
		});
		value.stuMap.each(function(stuid,stuObj,index){
			campusObj.receiveids.push(stuid);
			checkedkey.push(stuid);
			checkedvalue.push(stuObj.text);
		});
		campusArray.push(campusObj);
	});
	
	$("#tzForm_receiver").html(checkedvalue.join(','));
	$("#tzForm_receiverids").val(checkedkey.join(','));
	receiverIds = checkedkey.join(',');
	receiverNames = checkedvalue.join(';')
	$("#sendList").val(JSON.stringify(campusArray));
	if(typeof changeDataByTree == 'function'){
		changeDataByTree();
	}
	if(checkedkey.length===0){
		$("#tzForm_receiver").html('点击通讯录列表选择收件人');
	}
	GHBB.hide();
}


/**
 * 查询老师树数据
 * @param type
 */
function queryTeaTreeData(type,parent){
	GHBB.prompt("正在加载~");
	var api = null;
	var param = null;
	if(type===msg_tea_tree_level.campus){
		api = ApiParamUtil.COMMON_QUERY_CAMPUS;
		param = {
			userid : main_userid,
			name   : name
		};
	}else if(type===msg_tea_tree_level.department){
		api = ApiParamUtil.APPID_SERVICE_TEACHER_DEPT_LIST_DATA;
		param = {
			userid: main_userid,
			campusid: parent.id,
			usertype: WxXxUser.USER_TYPE_TEACHER
		};
	}else if(type===msg_tea_tree_level.teacher){
		api = ApiParamUtil.APPID_SERVICE_TEACHER_LIST_DATA;
		var deptids = parent.id;
			if(deptids.indexOf('_')>-1){
				deptids = deptids.split('_')[1];
			}
		param = {
			deptids : deptids,
			usertype : WxXxUser.USER_TYPE_TEACHER,
			campusid: $('#teacherData').tree('getParent',parent.target).id
		};
	}else{
		return;
	}
	var submitData = {
		api : api,
		param : JSON.stringify(param)
	};
	$.ajax({
		async:false,
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				GHBB.hide();
				if(type===msg_tea_tree_level.campus){
					createTeaTreeData(result.data.campusList,type);
				}else if(type===msg_tea_tree_level.department){
					createTeaTreeData(result.data.dataList,type,parent.id);
				}else if(type===msg_tea_tree_level.teacher){
					createTeaTreeData(result.data.dataList,type,parent.id);
				}
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
};

/**
 * 组装老师树
 * @param dataList
 * @param type
 * @param parentId
 */
function createTeaTreeData(dataList,type,parentId){
	if(type===msg_tea_tree_level.campus){
		createTeaTreeCampusNode(dataList);
		$('#teacherData').tree({
			data : msgtree.teatree,
		    onBeforeExpand: function(node){
		    	if(!node.attributes.childrenLoad){
		    		if(node.attributes.type===msg_tea_tree_level.campus){
		    			queryTeaTreeData(msg_tea_tree_level.department,node);
		    		}else if(node.attributes.type===msg_tea_tree_level.department){
		    			queryTeaTreeData(msg_tea_tree_level.teacher,node);
		    		}
		    	}
		    },
			onClick: function(node){
				if(node.checked){
		    		$('#teacherData').tree('uncheck', node.target);
		    	}else{
		    		$('#teacherData').tree('check', node.target);
		    	}
			},
		    onCheck: function(node){
		    	teaTreeCheckedValue(node);
		    }
		});
		if(msgtree.teatree[0].children.length===1){
			var node = $('#teacherData').tree('find', msgtree.teatree[0].children[0].id);
			$('#teacherData').tree('expand',node.target);
		}
	}else if(type===msg_tea_tree_level.department){
		var node = $('#teacherData').tree('find', parentId);
			var classData = new Object();
			classData.parent = node.target;
			classData.data = createTeaTreeDepartmentNode(dataList,parentId);
			node.attributes.childrenLoad = true;
		$('#teacherData').tree('append', classData);
	}else if(type===msg_tea_tree_level.teacher){
		var node = $('#teacherData').tree('find', parentId);
		var teaData = new Object();
		teaData.parent = node.target;
		teaData.data = createTeaTreeTeaNode(dataList,$('#teacherData').tree('getParent',node.target).id);
		node.attributes.childrenLoad = true;
		$('#teacherData').tree('append', teaData);
	}
}

/**
 * 组装校区节点
 */
function createTeaTreeCampusNode(dataList){
	msgtree.teatree = [{
		children: [],
		id: "",
		text: "全部",
		attributes:{
			childrenLoad: true,
			type: msg_tea_tree_level.all
		}
	}]
	for(var i = 0;i<dataList.length;i++){
		var campusNode = new Object();
		campusNode.children = [];
		campusNode.id = dataList[i].id;
		campusNode.text = dataList[i].value;
		campusNode.state = "closed";
		campusNode.attributes = {
			childrenLoad: false,
			type: msg_tea_tree_level.campus
		}
		msgtree.teatree[0].children.push(campusNode);
	}
}

/**
 * 组装部门节点
 */
function createTeaTreeDepartmentNode(dataList,parentId){
	var nodes = new Array();
	for(var i = 0;i<dataList.length;i++){
		var departmentNode = new Object();
		departmentNode.children = [];
		departmentNode.id = parentId + '_' + dataList[i].deptid;
		departmentNode.text = dataList[i].deptname;
		departmentNode.state = "closed";
		departmentNode.attributes = {
				childrenLoad: false,
				type: msg_tea_tree_level.department
			}
		nodes.push(departmentNode);
	}
	return nodes;
}

/**
 * 组装老师节点
 */
function createTeaTreeTeaNode(dataList,campusid){
	var nodes = new Array();
	for(var i = 0;i<dataList.length;i++){
		var teaNode = new Object();
		teaNode.children = [];
		teaNode.id = dataList[i].id;
		teaNode.text = dataList[i].name;
		teaNode.attributes = {
				childrenLoad: false,
				type: msg_tea_tree_level.teacher,
				campusid: campusid,
				deptid: dataList[i].deptid,
			}
		nodes.push(teaNode);
	}
	return nodes;
}

/**
 * 教师树联动收件人
 */
function teaTreeCheckedValue(node){
	var deptId;
	var campusId;
	GHBB.prompt("正在加载~");
	if(node.attributes.type===msg_tea_tree_level.campus){
		deptId = "";
		campusId = node.id;
		param = {
				campusid : campusId,
				usertype : WxXxUser.USER_TYPE_TEACHER,
				type: node.attributes.type
		};
		var submitData = {
				api : ApiParamUtil.APPID_SERVICE_TEACHER_LIST_DATA,
				param : JSON.stringify(param)
		};
		$.ajax({
			async:false,
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas){
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					var dataList = result.data.dataList;
					if(node.checked){
						var campusObj = new Object();
						var deptMap = new Map();
						var teaMap = new Map();
						campusObj.campusid = campusId;
						for(var i=0;i<dataList.length;i++){
							var mapObj = new Object();
							deptMap.put(dataList[i].deptid,dataList[i].deptid);
							mapObj.id=dataList[i].id;
							mapObj.text=dataList[i].name;
							teaMap.put(mapObj.id,mapObj);
						}
						campusObj.deptMap = deptMap;
						campusObj.teaMap = teaMap;
						msgtree_checked.teatree.put(campusId, campusObj);
					}else{
						if(msgtree_checked.teatree.get(campusId)){
							msgtree_checked.teatree.remove(campusId);
						}
					}
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}else if(node.attributes.type===msg_tea_tree_level.department){
		deptId = node.id;
		if(deptId.indexOf('_')>-1){
			deptId = deptId.split('_')[1];
		}
		campusId = $('#teacherData').tree('getParent',node.target).id;
		param = {
				deptids: deptId,
				campusid: campusId
		};
		var submitData = {
				api : ApiParamUtil.APPID_SERVICE_TEACHER_LIST_DATA,
				param : JSON.stringify(param)
		};
		$.ajax({
			async:false,
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas){
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					var dataList = result.data.dataList;
					if(node.checked){
						if(!msgtree_checked.teatree.get(campusId)){
							var campusObj = new Object();
							campusObj.deptMap = new Map();
							campusObj.teaMap = new Map();
							msgtree_checked.teatree.put(campusId, campusObj);
						}
						msgtree_checked.teatree.get(campusId).deptMap.put(deptId,deptId);
						for(var i=0;i<dataList.length;i++){
							var mapObj = new Object();
							mapObj.id=dataList[i].id;
							mapObj.text=dataList[i].name;
							msgtree_checked.teatree.get(campusId).teaMap.put(mapObj.id,mapObj);
						}
					}else{
						if(msgtree_checked.teatree.get(campusId).deptMap.get(deptId)){
							msgtree_checked.teatree.get(campusId).deptMap.remove(deptId);
							for(var i=0;i<dataList.length;i++){
								msgtree_checked.teatree.get(campusId).teaMap.remove(dataList[i].id);
							}
						}
					}
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}else if(node.attributes.type===msg_tea_tree_level.teacher){
		deptId = node.attributes.deptid;
		campusId = node.attributes.campusid;
		if(node.checked){
			if(!msgtree_checked.teatree.get(campusId)){
				var campusObj = new Object();
				campusObj.deptMap = new Map();
				campusObj.teaMap = new Map();
				msgtree_checked.teatree.put(campusId, campusObj);
			}
			msgtree_checked.teatree.get(campusId).deptMap.put(deptId,deptId);
			var mapObj = new Object();
			mapObj.id = node.id;
			mapObj.text = node.text;
			msgtree_checked.teatree.get(campusId).teaMap.put(node.id,mapObj);
		}else{
			msgtree_checked.teatree.get(campusId).teaMap.remove(node.id);
			if($($('#teacherData').tree('find', campusId + '_'+ deptId).target).find(".tree-checkbox").hasClass("tree-checkbox0")){
				msgtree_checked.teatree.get(campusId).deptMap.remove(deptId);
			}
			if($($('#teacherData').tree('find', campusId).target).find(".tree-checkbox").hasClass("tree-checkbox0")){
				msgtree_checked.teatree.remove(campusId);
			}
		}
	}else if(node.attributes.type===msg_tea_tree_level.all){
		deptId = "";
		campusId = "";
		param = {
				deptid: deptId,
				campusid: campusId,
				type: node.attributes.type
		};
		var submitData = {
				api : ApiParamUtil.APPID_SERVICE_TEACHER_LIST_DATA,
				param : JSON.stringify(param)
		};
		$.ajax({
			async:false,
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas){
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					var dataList = result.data.dataList;
					var childrens = $('#xsjbData').tree('getChildren',node.target);
					if(node.checked){
						for(var j=0;j<childrens.length;j++){
							if(childrens[j].attributes.type===msg_tea_tree_level.campus){
							  var campusObj = new Object();
							  campusObj.deptMap = new Map();
							  campusObj.teaMap = new Map();
							  campusObj.campusid = childrens[j].id;
							  msgtree_checked.teatree.put(childrens[j].id, campusObj);
							}
						}
						for(var i=0;i<dataList.length;i++){
							campusId = dataList[i].campusid;
							var mapObj = new Object();
							mapObj.id=dataList[i].id;
							mapObj.text=dataList[i].name;
							msgtree_checked.teatree.get(campusId).teaMap.put(mapObj.id,mapObj);
							msgtree_checked.teatree.get(campusId).deptMap.put(dataList[i].deptid,dataList[i].deptid);
						}
					}else{
						for(var j=0;j<childrens.length;j++){
							if(msgtree_checked.teatree.get(childrens[j].id)){
								msgtree_checked.teatree.remove(childrens[j].id);
							}
						}
					}
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}else{
		GHBB.hide();
		return;
	}
	var checkedkey = [];
	var checkedvalue = [];
	var campusArray = [];
	msgtree_checked.teatree.each(function(key,value,index){
		var campusObj = {};
		campusObj.campusid = key;
		campusObj.deptids = [];
		campusObj.receiveids = [];
		value.deptMap.each(function(deptid,bj,index){
			if(deptid.indexOf('_')>-1){
				deptid = deptid.split('_')[1];
			}
			campusObj.deptids.push(deptid);
		});
		value.teaMap.each(function(stuid,stuObj,index){
			campusObj.receiveids.push(stuid);
			checkedkey.push(stuid);
			checkedvalue.push(stuObj.text);
		});
		campusArray.push(campusObj);
	});
	
	$("#tzForm_receiver").html(checkedvalue.join(','));
	$("#tzForm_receiverids").val(checkedkey.join(','));
	receiverIds = checkedkey.join(',');
	receiverNames = checkedvalue.join(';')
	$("#sendList").val(JSON.stringify(campusArray));
	if(checkedkey.length===0){
		$("#tzForm_receiver").html('点击通讯录列表选择收件人');
	}
	GHBB.hide();
}

/**
 * 查询老师树数据
 * @param name
 */
function queryTeacherList(name){
	GHBB.prompt("正在加载~");
	if(!name){
		queryTeaTreeData("campus");
		return;
	}
	var param = {
		userid : userid,
		name   : name
	};
	var submitData = {
		api : ApiParamUtil.MSG_CENTER_QUERY_TEACHER_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$('#teacherData').tree({
				data : convert(result.data.classList),
				onClick: function(node){
					if(node.checked){
			    		$('#teacherData').tree('uncheck', node.target);
			    	}else{
			    		$('#teacherData').tree('check', node.target);
			    	}
					getCheckCellValueForPost('#teacherData');
				},
				onCheck: function(node){
				},
				onBeforeExpand: function(node){
				}
			});
			$("div.tree-node span").click(function(){
				if ($('#teacherTab').attr('class') == 'active') {
					getCheckCellValueForPost('#teacherData');
				}else if($('#xsjbTab').attr('class') == 'active'){
					getCheckCellValueForPost('#xsjbData');
				}else if($('#stuDeptTab').attr('class') == 'active'){
					getCheckCellValueForPost('#stuDeptData');
				}
			});
		}else{
			$("#teacherData").html('<div style="width:100%;height:30px;line-height:30px;text-align:center;list-style:none;">数据查询失败</div>');
		}
	});
}

/**
 * 查询学生自定义分组树数据
 * @param name
 */
function queryStuDeptList(name){
	GHBB.prompt("正在加载~");
	var param = {
		userid : main_userid,
		name   : name
	};
	var submitData = {
		api : ApiParamUtil.MSG_CENTER_QUERY_STUDENT_DEPT_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$('#stuDeptData').tree({
				data : convert(result.data.classList),
				onClick: function(node){
					if(node.checked){
			    		$('#stuDeptData').tree('uncheck', node.target);
			    	}else{
			    		$('#stuDeptData').tree('check', node.target);
			    	}
					getCheckCellValueForPost('#stuDeptData');
				}
			});
			
			$("div.tree-node span").click(function(){
				if ($('#teacherTab').attr('class') == 'active') {
					getCheckCellValueForPost('#teacherData');
				}else if($('#xsjbTab').attr('class') == 'active'){
					getCheckCellValueForPost('#xsjbData');
				}else if($('#stuDeptTab').attr('class') == 'active'){
					getCheckCellValueForPost('#stuDeptData');
				}
			});
		}else{
			$("#stuDeptData").html('<div style="width:100%;height:30px;line-height:30px;text-align:center;list-style:none;">数据查询失败</div>');
		}
	});
}

/**
 * 组装树节点
 * @param rows
 * @returns {Array}
 */
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
				var nameText = row.name;
				var paymentText = "";
				if(row.payment != null && row.payment != "1"){
					paymentText = "（未开通）";
				}
				if(row.id.indexOf("xsjb_") != -1){
					nameText = row.name + paymentText;
				}
				var child = {id:row.id,text:nameText};
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

/**
 * 查询班级学生树数据
 * @param name
 */
function queryClassStuList(name){
	$('#xsjbData').tree('reload');
	GHBB.prompt("正在加载~");
	if(!name){
		GHBB.hide();
		queryStuTreeData("campus");
		return;
	}
	var param = {
		campusid: msgtree_config.campusids,
		userid : main_userid,
		name   : name
	};
	var submitData = {
		api : ApiParamUtil.MSG_CENTER_QUERY_CLASS_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$('#xsjbData').tree({
				data : convert(result.data.classList),
				onClick: function(node){
					if(node.checked){
			    		$('#xsjbData').tree('uncheck', node.target);
			    	}else{
			    		$('#xsjbData').tree('check', node.target);
			    	}
					getCheckCellValueForPost('#xsjbData');
				},
				onCheck: function(node){
			    },
				onBeforeExpand: function(node){
				}
			});
			$("div.tree-node span").click(function(){
				if ($('#teacherTab').attr('class') == 'active') {
					getCheckCellValueForPost('#teacherData');
				}else if($('#xsjbTab').attr('class') == 'active'){
					getCheckCellValueForPost('#xsjbData');
				}else if($('#stuDeptTab').attr('class') == 'active'){
					getCheckCellValueForPost('#stuDeptData');
				}
			});
		}else{
			$("#xsjbData").html('<div style="width:100%;height:30px;line-height:30px;text-align:center;list-style:none;">数据查询失败</div>');
		}
	});
}

function getCheckCellValueForPost(treeName) {
	var treeNode = $(treeName);
	var arrIds = [];
	var arrNames = [];
	var arrCampusIds = [];
	var arrBjsjIds = [];
	var parantid = '';
	var checkeds = $(treeName).tree('getChecked');
	
	var campus = {};
	for (var i in checkeds) {
		var leaf = $(treeName).tree('isLeaf', checkeds[i].target);
		if (leaf) {
			var campusid = treeNode.tree('getParent', treeNode.tree('getParent', checkeds[i].target).target).id.split("_")[1];
			var unknowname = treeNode.tree('getParent', checkeds[i].target).id.split("_")[0];
			var unknowid = treeNode.tree('getParent', checkeds[i].target).id.split("_")[1];
			var xsid = checkeds[i].id.split("_")[1];
			if (!campus[campusid]) {
				campus[campusid] = {};
				campus[campusid].unknownames = [];
				campus[campusid].unknowids = [];
				campus[campusid].receiveids = [];
			}
			if(unknowname == "bjsj" && campus[campusid].unknownames.length == 0){
				campus[campusid].unknownames.push("bjids");
			}else if(unknowname == "dept" && campus[campusid].unknownames.length == 0){
				campus[campusid].unknownames.push("deptids");
			}
			if(-1 == $.inArray(unknowid, campus[campusid].unknowids)){
				campus[campusid].unknowids.push(unknowid);
			}
			if(-1 == $.inArray(xsid, campus[campusid].receiveids)){
				campus[campusid].receiveids.push(xsid);
			}
		}
		var node;
		if(i==0 && checkeds[0].text=="全部"){
			node = $(treeName).tree('getNode', checkeds[i].target);
		}else{
			node = $(treeName).tree('getParent', checkeds[i].target);
		}
		// 若为叶子节点，存入节点集合
		var leaf = $(treeName).tree('isLeaf', checkeds[i].target);
		if (leaf && ($.inArray(checkeds[i].id.split("_")[1], arrIds) == "-1")) {
			arrIds.push(checkeds[i].id.split("_")[1]);
			arrNames.push(checkeds[i].text);
		}
		// 父节点为全部的不存入节点集合
		if (node.id != 0 && node.id != 1 && parantid != node.id) {
			if(node.id.indexOf("campus_")>-1){
				arrCampusIds.push(node.id.split("_")[1]);
			}
			if(node.id.indexOf("bjsj_")>-1 || node.id.indexOf("dept_")>-1){
				if(node.id.indexOf("bjsj_") != -1){
					arrBjsjIds.push(node.id.split("_")[1]);
				}
				var parentNode = $(treeName).tree('getParent', node.target);
				if(parentNode.id != 0){
					arrCampusIds.push(parentNode.id.split("_")[1]);
				}
			}
			parantid = node.id;
		}
	}
	var campusArray = [];
	for (var campusid in campus) {
		var campusObj = {};
		campusObj.campusid = campusid;
		campusObj[campus[campusid].unknownames] = campus[campusid].unknowids;
		campusObj.receiveids = campus[campusid].receiveids;
		campusArray.push(campusObj);
	}
	$("#sendList").val(JSON.stringify(campusArray));
	var ifAdd = false;
	if(!$("#individualList").parent().hasClass("hide") && receiverIds != "" && arrIds.length != receiverIds.split(",").length){
		ifAdd = true;
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
	if(ifAdd){
		createIndividualList();
	}
	fillIndividual();
	if(typeof changeDataByTree == 'function'){
		changeDataByTree();
	}
}

function getNoRepeat(s) {  
    return s.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",");  
} 

function fillIndividual(){
	var individualArr = [];
	var contentInput = $("#individualList").find("input[name='content']");
	for ( var i = 0; i < contentInput.length; i++) {
		var individualObj = {};
		if(contentInput.eq(i).val() != ""){
			individualObj.receiveid = contentInput.eq(i).parent().find("input[type='hidden']").val();
			individualObj.content = jsonTrim(contentInput.eq(i).val());
			individualArr.push(individualObj);
		}
	}
	var sendListArr = JSON.parse($("#sendList").val());
	if(sendListArr[0] != undefined){
		sendListArr[0].individualArr = individualArr;
	}
	$("#sendList").val(JSON.stringify(sendListArr));
}

function createIndividualList(){
	if(receiverIds == "" || receiverIds.length == 0){
		if($("#individualList").parent().hasClass("hide")){
			alert("请点击右侧勾选接收人！");
		}else{
			clearnIndividual();
		}
		return;
	}
	var ids = receiverIds.split(",");
	var names = receiverNames.split(";");
	if(ids.length != names.length){
		alert("接收人数据有误！");
		return;
	}
	$("#individualList").parent().removeClass("hide");
	$("#individualBtn").html("收起个性化内容");
	$("#individualList").children().remove();
	for ( var i = 0; i < ids.length; i++) {
		var li = "";
		var id = ids[i];
		var name = names[i];
		var $li = $(
	            	'<li>'+
	            		'<span title="'+name+'">@'+name+'</span>'+
	            		'<input name="content" type="tel" class="form-control" maxlength="100" value="" />'+
	            		'<input name="id" type="hidden" value="'+id+'" />'+
	            	'</li>'
	            );
		$("#individualList").append($li);
		$span = $li.find("span");
		var width = $span.width() + 10;
		$inputTel = $li.find("input[type='tel']");
		$inputTel.css("padding-left",width+"px");
	}
}


function clearnIndividual(){
	$("#individualList").find("li").remove();
	$("#individualList").parent().addClass("hide");
	$("#individualBtn").html("添加个性化内容");
}
