var ctx = $("#ctx").val();
var commonUrl_ajax = ctx + ApiParamUtil.COMMON_URL_AJAX;

$(document).ready(function() {
	$("#course_camups_chosen").change(function() {
		loading_course_list();
	});
	
	loading_campus();
	
});

/**
 * 加载校区列表
 * 
 */
function loading_campus() {
	var param = {}
	var submitData = {
		api: ApiParamUtil.COMMON_QUERY_CAMPUS,
		param: JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code === "200") {
				$("#course_camups_chosen option").remove();
				var campusList = result.data.campusList;
				var spanClass = 'active';
				for (var i = 0; i < campusList.length; i++) {
					$("#course_camups_chosen").append('<option value="'+campusList[i].id+'">'+campusList[i].value+'</option>');
					spanClass = '';
				}
				$("#course_camups_chosen").trigger("chosen:updated");
				loading_course_list();
				
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

/**
 * 加载科目列表
 * 
 */
function loading_course_list() {
	GHBB.prompt("正在加载~");
	var param = {
		campusid: $("#course_camups_chosen").val()
	}
	var submitData = {
		api: ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_LIST,
		param: JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code === "200") {
				var html = '<div class="viewBox">'
					+ '<div class="col-md-12" style="padding:0;margin-bottom:15px;">'
					+ '<input type="tel" class="form-control" value="" maxlength="20" name="coursename" id="coursename">'
					+ '</div>'
					+ '<div class="cl"></div>'
					+ '<div class="form-group form-actions">'
					+ '<div class="text-center">'
					+ '<button id="addCourse" class="btn btn-sm btn-primary btn-add" type="submit" onclick="add_course_info();">+增加科目</button>'
					+ '</div>'
					+ '</div>'
					+ '</div>';
				$("#viewList").html(html);
				html = '';
				var courseList = result.data.courseList;
				for (var i = 0; i < courseList.length; i++) {
					html += '<div class="viewBox">'
						+ '<div class="l">'
						+ '<div class="name">' + courseList[i].coursename + '</div>'		
						+ '<div class="infoes">'			
						+ '<span>' + courseList[i].campusname + '</span>'			
						+ '</div>'	
						+ '</div>'	
						+ '<div class="r">'	
						+ '<a href="javascript:delete_course_info(' + courseList[i].courseid + ');">删除</a>'	
						+ '</div>'
						+ '</div>';
				}
				html += '<div class="cl"></div>';
				$("#viewList").append(html);
				
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

/**
 * 新增科目信息
 * 
 */
function add_course_info() {
	if (trim($("#coursename").val()) == '') {
		PromptBox.alert('请填写正确的科目名称！');
		return false;
	}
	var param = {
		campusid: $("#course_camups_chosen").val(),
		coursename: $("#coursename").val()
	}
	var submitData = {
		api: ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_ADD,
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
				PromptBox.alert('增加科目成功！');
				loading_course_list();
			} else if(result.ret.code == "400") {
				PromptBox.alert(result.ret.msg);
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

/**
 * 删除科目信息
 * 
 */
function delete_course_info(courseid) {
	if(confirm("是否删除该科目信息？")) {
		var param = {
			courseid: courseid
		}
		var submitData = {
			api: ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_DELETE,
			param: JSON.stringify(param)
		};
		$.ajax({
			cache: false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas) {
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if (result.ret.code == "200") {
					PromptBox.alert('删除科目成功！');
					loading_course_list();
				} else if (result.ret.code == "400") {
					PromptBox.alert(result.ret.msg);
				} else {
					console.log(result.ret.code + ":" + result.ret.msg);
				}
			}
		});
	}
}
