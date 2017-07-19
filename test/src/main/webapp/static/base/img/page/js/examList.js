var njOption = "";
var ctx = $("#ctx").val();
var currentPage = 0;
var displayStart = 0;
var displayLength = 9;
var functionId= $("#functionId").val();
$(document).ready(function() {
	queryCampus();
	$("#campusList").change(function() {
		queryNjsj();
		queryCourse();
	});
	$("#njList").change(function() {
		queryBjsj();
		queryCourse();
	});
	$("#addNjList").change(function() {
		queryAddBjsj();
	});
	$("#add-btn").click(function() {
		$('#modal-addexam').modal('show');
		queryAddNjsj();
		queryAddCourse();
	});
	$("#saveBtn").click(function() {
		saveExam();
	});
	$("#closeBtn").click(function() {
		$("#examname").val("");
		$('#modal-addexam').modal('hide');
	});
});

function changeChecked(obj,thisid){
	if(thisid == 0){
		if($(obj).hasClass("searchBtnActive")){
			$(obj).parent().parent().find(".searchBtn").removeClass("searchBtnActive");
		}else{
			$(obj).parent().parent().find(".searchBtn").addClass("searchBtnActive");
		}
	}else{
		var activeObj = $(obj).parent().parent().find(".searchBtnActive");
		var childrenObj = $(obj).parent().parent().find(".searchBtn");
		if($(obj).hasClass("searchBtnActive")){
			if(activeObj.length == childrenObj.length != 0){
				childrenObj.eq(0).removeClass("searchBtnActive");
			}
			$(obj).removeClass("searchBtnActive");
		}else{
			if(activeObj.length == (childrenObj.length - 2) && childrenObj.length != 0){
				childrenObj.eq(0).addClass("searchBtnActive");
			}
			$(obj).addClass("searchBtnActive");
		}
	}
	queryExam();
}

function changeAddChecked(obj){
	if($(obj).hasClass("searchBtnActive")){
		$(obj).removeClass("searchBtnActive");
	}else{
		$(obj).addClass("searchBtnActive");
	}
}

function queryCampus(){
	var param = {}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_CAMPUS,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#campusList option").remove();// user为要绑定的select，先清除数据
			for (var i = 0; i < result.data.campusList.length; i++) {
				$("#campusList")
					.append("<option value=" + result.data.campusList[i].id + ">" + result.data.campusList[i].value + "</option>");
			}
			$("#campusList option").eq(0).attr("selected", true);
			$("#campusList").trigger("chosen:updated");
			queryCourse();
			queryNjsj();
		}
	});
}

function queryNjsj(){
	var param = {
		campusid : $("#campusList").val(),
		userid : main_userid
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_GRADE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#njList option").remove();
			for (var i = 0; i < result.data.njList.length; i++) {
				$("#njList")
					.append("<option value=" + result.data.njList[i].id + ">" + result.data.njList[i].njmc + "</option>");
			}
			$("#njList option").eq(0).attr("selected", true);
			$("#njList").trigger("chosen:updated");
			queryBjsj();
		}
	});
}

function queryAddNjsj(){
	var param = {
		campusid : $("#campusList").val(),
		userid : main_userid
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_GRADE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#addNjList option").remove();
			for (var i = 0; i < result.data.njList.length; i++) {
				$("#addNjList")
					.append("<option value=" + result.data.njList[i].id + ">" + result.data.njList[i].njmc + "</option>");
			}
			$("#addNjList option").eq(0).attr("selected", true);
			$("#addNjList").trigger("chosen:updated");
			queryAddBjsj();
		}
	});
}

function queryBjsj(){
	var param = {
		njid : $("#njList").val(),
		campusid : $("#campusList").val(),
		userid : main_userid
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_CLASS_BY_GRADEID,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(removeHtmlTagTemp(json));
		if(result.ret.code == 200){
			$("#bjList").children().remove();
			$("#bjList")
			.append('<li><div id="bjid_0" class="searchBtn searchBtnActive" onclick="changeChecked(this,0);">全部班级</div></li>');
			for (var i = 0; i < result.data.bjList.length; i++) {
				$("#bjList")
					.append('<li><div id="bjid_'+ result.data.bjList[i].id +'" class="searchBtn searchBtnActive" onclick="changeChecked(this,'
							+ result.data.bjList[i].id +');">'
							+ result.data.bjList[i].bj 
							+'</div></li>');
			}
			queryExam();
		}
	});
}

function queryAddBjsj(){
	var param = {
		njid : $("#addNjList").val(),
		campusid : $("#campusList").val(),
		userid : main_userid
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_CLASS_BY_GRADEID,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(removeHtmlTagTemp(json));
		if(result.ret.code == 200){
			var bjSelect = $("select[name=addBjList]");
			$("select[name=addBjList] option").remove();
			for (var i = 0; i < bjSelect.length; i++) {
				for(var j=0;j<result.data.bjList.length;j++){
					bjSelect.eq(i).append("<option value=" + result.data.bjList[j].id+" >" + result.data.bjList[j].bj + "</option>");
				};
				bjSelect.eq(i).multiselect('refresh');
			}
		}
	});
}

/**
 * 去掉空格、&nbsp;
 * 
 * @param str
 */
function removeHtmlTagTemp(str) {
	str = str.replace(/&nbsp;/ig, '');// 去掉&nbsp;
	str = str.replace(/\s/g, ''); // \s匹配任何空白字符，包括空格、制表符、换页符等等
	return str;
}

function queryCourse(){
	var param = {
		campusid : $("#campusList").val(),
		userid : main_userid
	};
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#courseList").children().remove();
			$("#courseList")
			.append('<li><div id="courseid_0" class="searchBtn searchBtnActive" onclick="changeChecked(this,0);">全部科目</div></li>');
			for (var i = 0; i < result.data.courseList.length; i++) {
				$("#courseList")
					.append('<li><div id="courseid_'+ result.data.courseList[i].courseid 
							+'" class="searchBtn searchBtnActive" onclick="changeChecked(this,'
							+ result.data.courseList[i].courseid +');">'
							+ result.data.courseList[i].coursename
							+'</div></li>');
			}
		}
	});
}

function queryAddCourse(){
	var param = {
		campusid : $("#campusList").val(),
		userid : main_userid
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#addCourseList").children().remove();
			for (var i = 0; i < result.data.courseList.length; i++) {
				$("#addCourseList")
					.append('<li class="no_m_l"><div id="courseid_'+ result.data.courseList[i].courseid 
							+'" class="searchBtn" onclick="changeAddChecked(this);">'
							+ result.data.courseList[i].coursename
							+'</div></li>');
			}
		}
	});
}

function queryExam(){
	GHBB.prompt("正在加载~");
	var bjid = getCheckedIds("bjList");
	var courseid = getCheckedIds("courseList");
	displayStart = currentPage * displayLength;
	var param = {
		displayStart : displayStart,
		displayLength : displayLength,
		bjids : bjid,
		njid : $("#njList").val(),
		courseids : courseid,
		campusid : $("#campusList").val()
	}
	var submitData = {
		api : ApiParamUtil.MY_CLASS_EXAM_SCORE_QUERY_EXAM_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		$("#examList").children().remove();
		if(result.ret.code == 200){
			if((result.data.examList == null || result.data.examList.length == 0) && currentPage == 0){
				$("#examList").append('<li class="noData">没有查到考试信息哦！</li>');
			}else if((result.data.examList == null || result.data.examList.length == 0) && currentPage != 0){
				$("#examList").append('<li class="noData">没有更多考试信息了！</li>');
			}else{
				for (var i = 0; i < result.data.examList.length; i++) {
					var examInfo = result.data.examList[i];
					$("#examList").append(createExamList(examInfo));
				}
			}
			createPageList(result.data.total);
		}else{
			$("#examList").append('<li class="noData">'+ result.ret.msg +'</li>');
		}
	});
}

function createExamList(data){
	var bjname = "";
	for (var i = 0; i < data.bjList.length; i++) {
		if(i == data.bjList.length -1){
			bjname += data.bjList[i].bj;
		}else{
			bjname += data.bjList[i].bj + "、";
		}
	}
	var course = "";
	for (var i = 0; i < data.courseList.length; i++) {
		course += '<span>'+ data.courseList[i].courseName +'</span>'
	}
	var result = '<li id="'+ data.id +'">'
			   + '	<div class="examTitle"><a href="'+ctx+'/base/func/'+ApiParamUtil.MY_CLASS_EXAM_SCORE_EDIT_JUMP+'?appid='+functionId+'&examid='+data.id+'&campusid='+data.campusid+'">'+ data.examname +'</a></div>'
			   + '	<div class="examTime">'
			   + '		<span>'+ data.examtime +'</span>'
			   + '		<a href="javascript:delExam('+ data.id +');">删除</a>'
			   + '	</div>'
			   + '	<div class="examBj">'+bjname+'</div>'
			   + '	<div class="examCourse">' + course + '	</div>'
			   + '</li>';
	return 	result;
}

function saveExam(){
	var courseid = getCheckedIds("addCourseList");
	var examtime = $("#examtime_day").val();
	var examendtime = $("#examendtime_day").val();
	if($("#examname").val() == null || $("#examname").val() == ""){
		return;
	}
	if($("#addBjList").val() == null){
		alert("请选择考试班级！");
		return;
	}
	if(courseid.length == 0){
		alert("请选择考试科目！");
		return;
	}
	var param = {
		bjids : $("#addBjList").val().toString(),
		njid : $("#addNjList").val(),
		campusid : $("#campusList").val(),
		courseids : courseid,
		examname : $("#examname").val(),
		examtime : examtime.toString(),
		examendtime:examendtime.toString()
	}
	GHBB.prompt("数据保存中~");
	var submitData = {
		api : ApiParamUtil.MY_CLASS_EXAM_SCORE_SAVE_EXAM_INFO,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$('#modal-addexam').modal('hide');
			$("#examname").val("");
			queryExam();
		}
	});
}

function delExam(id){
	if(confirm("确认删除？")){
		GHBB.prompt("数据保存中~");
		var param = {
			id : id,
			campusid : $("#campusList").val()
		}
		var submitData = {
			api : ApiParamUtil.MY_CLASS_EXAM_SCORE_DEL_EXAM_INFO,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(json) {
			GHBB.hide();
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				alert("删除成功");
				queryExam();
			}
		});
	}
}

function getCheckedIds(boxID){
	var searchIds = "";
	var searchList = $("#"+boxID).find(".searchBtnActive");
	if(searchList.length > 0){
		for (var i = 0; i < searchList.length; i++) {
			if(i == searchList.length - 1){
				searchIds += searchList.eq(i).attr("id").split("_")[1];
			}else{
				searchIds += searchList.eq(i).attr("id").split("_")[1] + ",";
			}
		}
	}
	return searchIds;
}

function createPageList(total){
	var li = '<li><a href="javascript:previousQuery()"><i class="fa fa-angle-left"></i></a></li>';
	var pageCount = Math.ceil(total/displayLength);
	for (var i = 0; i < pageCount; i++) {
		var active = "";
		if(i == currentPage){
			active = " class='active'";
		}else{
			active = '';
		}
		li += '<li'+active+'><a href="javascript:query_page('+ (i) +')">'+ (i+1) +'</a></li>';
	}
	li += '<li><a href="javascript:nextQuery(' + pageCount + ')"><i class="fa fa-angle-right"></i></a></li>';
	$("#pagination").html(li);
}

function query_page(num){
	currentPage = num;
	queryExam();
}

function previousQuery(){
	if(currentPage > 0){
		currentPage = currentPage - 1;
	}
	queryExam();
}

function nextQuery(pageCount){
	if(currentPage < (pageCount - 1)){
		currentPage++;
	}
	queryExam();
}