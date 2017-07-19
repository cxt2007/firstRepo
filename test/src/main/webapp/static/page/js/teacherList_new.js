var ctx = "";
var TablesDatatables = function() {

	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document).ready(function() {
	generate_teacher_table();

	$("#teacherQueryBtn").click(function() { // 点击查询按钮
		generate_teacher_table();
	});

	$("#teacherAddBtn").click(function() { // 点击新增按钮
		$('#modal-add-teacher').modal('show');
	});

	$("#user_campus_chosen").change(function() {
		getSerchFormBjsjList();
	});

	$("#user_bjid_chosen").change(function() {
		generate_teacher_table();
	});

	$("#exportFile").click(function() {
		expectTeachers();
	});
	
	$("#user_binding_chosen").change(function() {
		generate_teacher_table();
	});
	
	$("#user_mobileshow_chosen").change(function() {
		generate_teacher_table();
	});
	
	$("#teacherids").click(function(){
		$("input[name='teacherids']").prop("checked", $("#teacherids").prop("checked"));
	});
	
	$("#saveTeacher").click(function() {
		$("#saveTeacher").attr("disabled", true); 
		if($("#serialnumber_tch").val() == undefined || $("#serialnumber_tch").val() == "" && $("#serialnumber_tch").val() == null){
			alert("导入数据存在错误，请检查后重新导入！");
			$("#saveTeacher").attr("disabled", false); 
			return;
		}
		if($("#import_insert_or_update").val()==1){
			var url= ctx+"/xtgl/initdata/userInfoAddBatch";
			var submitData = {
				serialnumber: $("#serialnumber_tch").val()
			}; 
			$.post(url,
				submitData,
		      	function(data){
					alert(data);
					$("#teacherImportInfo").html("");
//					document.getElementById("saveTeacher").style.display = "none";
					$("#saveTeacher").attr("disabled", false); 
					$('#importTeacherModal').modal('hide');
					generate_teacher_table();
		      });
			return false;
		}else if($("#import_insert_or_update").val()==2){
			var param = {
					serialnumber: $("#serialnumber_tch").val(),
					campusid:$("#import_campusid").val()
				};
			var submitData = {
				api : ApiParamUtil.SYS_MANAGE_TEACHER_BATCH_UPDATE,
				param : JSON.stringify(param)
			};
			$.post(commonUrl_ajax, submitData, function(data) {
				var json = typeof data === "object" ? data : JSON.parse(data);
				if (json.ret.code == 200) {
					PromptBox.alert(json.ret.msg);
					$("#teacherImportInfo").html("");
					$("#saveTeacher").attr("disabled", false); 
					$('#importTeacherModal').modal('hide');
					generate_teacher_table();
				} else {
					PromptBox.alert(json.ret.msg);
				}
				return false;
			});
		}
		
	});
	
	$("#setDept").click(function (){
		if(!checkChecked()){
			return;
		}
		queryDeptList();
		$('#setDeptModal').modal('show');
	});

	$("#saveDept").click(function (){
		saveDept();
	});
});

function generate_teacher_table() {
	var rownum = 1;
	App.datatables();
	GHBB.prompt("正在加载~");
	var sAjaxSource = ctx + "/xtgl/teacher/ajax_findTeacherInfo";
	var param = "search_EQ_campusid=" + $("#user_campus_chosen").val();
	param = param + "&search_EQ_bjid=" + $("#user_bjid_chosen").val();
	param = param + "&search_LIKE_name=" + $("#user_name").val();
	param = param + "&search_EQ_binding=" + $("#user_binding_chosen").val();
	param = param + "&search_EQ_isshow=" + $("#user_mobileshow_chosen").val();

	sAjaxSource = sAjaxSource + "?" + param;// 调用后台携带参数路径
	var aoColumns = [  {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	},{
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"mDataProp" : "name"
	}, {
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "xb"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "phonenum"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "roles"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "position"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "ifshow"
	}, {
		"sWidth" : "120px",
		"sClass" : "text-center",
		"mDataProp" : "galleryKeySalt"
	}, {
		"sWidth" : "120px",
		"sClass" : "text-center",
		"mDataProp" : "slaveuser"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "slaveuser"
	} ];
	var isAgent =  $("#isAgent").val();
	$('#teacher-datatable')
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
						"bServerSide" : true,// 服务器端必须设置为true
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							// 序号
							$('td:eq(0)', nRow).html('<input name="teacherids" type="checkbox" value="'+aaData.id+'">');
							//照片
							var iconpath = "";
							if (aaData.iconpath != null
									&& aaData.iconpath != '') {
								iconpath = aaData.iconpath;
							} else {
								if (aaData.xb == 1) {
									iconpath = "http://jeff-ye-1978.qiniudn.com/boyteacher.jpg";
								} else {
									iconpath = "http://jeff-ye-1978.qiniudn.com/girlteacher.jpg";
								}
							}
							var picHtml = '<img src="'
									+ checkQiniuUrl(iconpath)
									+ '" style="height:64px;width: 64px" alt="avatar" class="img-circle">';
							$('td:eq(1)', nRow).html(picHtml);
							// 姓名
							var editHtml = '<div style="text-align:center;"><a href="'
									+ ctx
									+ '/xtgl/teacher/update/'
									+ aaData.id
									+ '?appid='+$("#appid").val()+'">' + aaData.name + '</a></div>';
							$('td:eq(2)', nRow).html(editHtml);
							// 性别
							var xb_ch = "";
							if (aaData.xb == 1) {
								xb_ch = "男";
							} else {
								xb_ch = "女";
							}
							var xbHtml = '<div style="text-align:center;">'
									+ xb_ch + '</div>';
							$('td:eq(3)', nRow).html(xbHtml);
							
							// 角色
							var role_class = "";
							if ("leader" == aaData.roles) {
								role_class = "label label-success";
							} else if ("admin" == aaData.roles) {
								role_class = "label label-info";
							} else if ("user" == aaData.roles) {
								role_class = "label label-primary";
							} else {
								role_class = "label label-warning";
							}
							var roleHtml = '<div class="text-center"><a href="javascript:void(0)" class="'
									+ role_class
									+ '">'
									+ aaData.roles_ch
									+ '</a></div>';
							$('td:eq(5)', nRow).html(roleHtml);
							
							
							// 手机端显示
							var ifshow_ch = "";
							if (aaData.ifshow == 1) {
								ifshow_ch = "显示";
							} else {
								ifshow_ch = "-";
							}
							var ifshowHtml = '<div style="text-align:center;">'
									+ ifshow_ch + '</div>';
							$('td:eq(7)', nRow).html(ifshowHtml);
							
							
							//是否绑定
							var slaveuser = "";
							if (aaData.slaveuser == null
									|| aaData.slaveuser == "") {
								slaveuser="未绑定";
							}else{
								slaveuser="已绑定";
							}
							var slaveuserHtml='<div style="text-align:center;">'
								+ slaveuser + '</div>';
							$('td:eq(9)',nRow).html(slaveuserHtml);
							
							// 删除
							var delhtml="";
							if(isAgent!="true"){
								delhtml = '<div class="btn-group btn-group-xs" >'
									+ '<a href="'
									+ ctx
									+ '/xtgl/teacher/delete/'
									+ aaData.id
									+ '?appid='+$("#appid").val()+'" onclick="return delConfirm();">删除</a>'
									+ '</div>';
							}
							$('td:eq(10)', nRow).html(delhtml);

							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns,
						"fnInitComplete": function(oSettings, json) {
							GHBB.hide();
					    }
					});
}

function getSerchFormBjsjList() {
	var url = ctx + "/base/findBjsjByCampusid";
	var submitData = {
		campusid : $("#user_campus_chosen").val()
	};
	$.post(url, submitData, function(data) {
		var datas = eval(data);
		$("#user_bjid_chosen option").remove();// user为要绑定的select，先清除数据
		for ( var i = 0; i < datas.length; i++) {

			$("#user_bjid_chosen").append(
					"<option value=" + datas[i][0] + " >" + datas[i][1]
							+ "</option>");
		}
		;
		$("#user_bjid_chosen").find("option[index='0']").attr("selected",
				'selected');
		$("#user_bjid_chosen").trigger("chosen:updated");

		generate_teacher_table();
	});
}
function delConfirm() {
	if (confirm("是否删除该教师?")) {
		return true;
	} else {
		return false;
	}
}

function resetConfirm() {
	if (confirm("确定重置该教师密码?")) {
		return true;
	} else {
		return false;
	}
}

function expectTeachers() {
	GHBB.prompt("数据导出中~");
	var url = ctx + "/xtgl/teacher/expectTeacherList";
	var submitData = {
		search_EQ_campusid : $("#user_campus_chosen").val(),
		search_EQ_bjid : $("#user_bjid_chosen").val(),
		search_LIKE_name : $("#user_name").val()
	};
	$.post(url, submitData, function(data) {
		GHBB.hide();
		location.href = ctx + data;
	});
}

function checkUpdateFileType(){
	
    var filepath=$("input[name='updateFile']").val();
    if(filepath==undefined||$.trim(filepath)==""){  
    	alert("请选择上传文件！");
       return;  
    }else{  
       var fileArr=filepath.split("//"); 
       var fileTArr=fileArr[fileArr.length-1].toLowerCase().split(".");  
       var filetype=fileTArr[fileTArr.length-1];  
       if(filetype!="xls"){  
    	    alert("上传文件必须为office 2003格式Excel文件！");
        	return;  
       } 
    }
    uploadUpdateFile();
}
function uploadUpdateFile() {
	GHBB.prompt("数据正在导入中~");
	progress();
	$.ajaxFileUpload({
		url: commonUrl_ajax+"?api="+ApiParamUtil.SYS_MANAGE_TEACHER_BATCH_UPDATE_IMPORT+"&param="+JSON.stringify({
			"campusid":$("#user_campus_chosen").val()
		}),	//需要链接到服务器地址
		secureuri:false,
		fileElementId: 'updateFile',					//文件选择框的id属性
		dataType:'json', 							//服务器返回的格式，可以是json
		success: function (result,status){
			GHBB.hide();
			if(result.ret.code==="200"){
				var serialnumber=result.data.serialnumber;
				$("#serialnumber_tch").val(serialnumber);
				$("#import_campusid").val(result.data.campusid);
				if(serialnumber != "" ){
					$("#saveTeacher").css('display','block');
				}else{
					$("#saveTeacher").css('display','none');
				}
				var gridhtml = result.data.griddata.replace(/\&lt;/g,"<").replace(/\&gt;/g,">").replace("[","").replace("]","");
				$("#teacherImportInfo").html(gridhtml);
				$("#importTitle").html("批量修改老师信息");
				$("#import_insert_or_update").val(2);
				$('#importTeacherModal').modal('show');
			}else{
				PromptBox.alert(result.ret.code+":"+result.ret.msg);
			}			
		},
		error: function(data,status){
			GHBB.hide();
			alert("error");
		}
	});
}

function checkTeacherFileType(){
	
    var filepath=$("input[name='teacherFile']").val();
    if(filepath==undefined||$.trim(filepath)==""){  
    	alert("请选择上传文件！");
       return;  
    }else{  
       var fileArr=filepath.split("//"); 
       var fileTArr=fileArr[fileArr.length-1].toLowerCase().split(".");  
       var filetype=fileTArr[fileTArr.length-1];  
       if(filetype!="xls"){  
    	    alert("上传文件必须为office 2003格式Excel文件！");
        	return;  
       } 
    }
    uploadUserFile();
}


function uploadUserFile() {
	GHBB.prompt("数据正在导入中~");
	progress();
	$.ajaxFileUpload({
		url: ctx+'/xtgl/initdata/userInfoImport',	//需要链接到服务器地址
		secureuri:false,
		fileElementId: 'teacherFile',					//文件选择框的id属性
		dataType:'json', 							//服务器返回的格式，可以是json
		success: function (data,status){
			GHBB.hide();
			$("#serialnumber_tch").val(data.serialnumber.replace("[","").replace("]",""));
			if($("#serialnumber_tch").val() != undefined && $("#serialnumber_tch").val() != "" && $("#serialnumber_tch").val() != null){
				document.getElementById("saveTeacher").style.display = "block";
			}else{
				document.getElementById("saveTeacher").style.display = "none";
			}
			var gridhtml = data.griddata.replace(/\&lt;/g,"<").replace(/\&gt;/g,">").replace("[","").replace("]","");
			$("#teacherImportInfo").html(gridhtml);
			$("#importTitle").html("导入老师信息");
			$("#import_insert_or_update").val(1);
			$('#importTeacherModal').modal('show');
		},
		error: function(data,status){
			GHBB.hide();
			alert("error");
		}
	});
}

function progress(){
	 $("#loading")
		.ajaxStart(function(){
			setTimeout(function(){
	             $.messager.progress('close');
	         },15000);
		})
		.ajaxComplete(function(){
			
		});
}

function queryDeptList(){
	var param = {
		campusid : $("#user_campus_chosen").val().toString(),
		type : "0"
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_DEPTLIST_BY_TYPE,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			if(result.data.length == 0){
				$("#deptRemind").css("display","block");
			}
			var teacherDept = $("select[name=teacherDept]");
			$("select[name=teacherDept] option").remove();
			for (var i = 0; i < teacherDept.length; i++) {
				for (var j = 0; j < result.data.length; j++) {
					var select = "";
					$("#teacherDept").append('<option value="' + result.data[j].id + '">'
							+ result.data[j].deptname + '</option>');
				}
				teacherDept.eq(i).trigger("chosen:updated");
			}
		}
	});
}

function saveDept(){
	GHBB.prompt("数据保存中~");
	var memberid = "";
	var teacherids = $("input[name='teacherids']:checked");
	for (var i = 0; i < teacherids.length; i++) {
		if(i == teacherids.length - 1){
			memberid += teacherids.eq(i).val();
		}else{
			memberid += teacherids.eq(i).val() + ",";
		}
	}
	var deptid = "";
	if($("#teacherDept").val() != null && $("#teacherDept").val() != ""){
		deptid = $("#teacherDept").val().toString();
	}
	var campusid = "";
	if($("#user_campus_chosen").val() != null && $("#user_campus_chosen").val() != ""){
		campusid = $("#user_campus_chosen").val().toString();
	}
	var param = {
		memberid : memberid,
		deptid : deptid,
		campusid : campusid,
		type : "0"
	}
	var submitData = {
		api : ApiParamUtil.COMMON_SET_DEPT,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			alert("设置分组成功！");
			$('#setDeptModal').modal('hide');
		}
	});
}

function checkChecked(){
	var memberid = "";
	var teacherids = $("input[name='teacherids']:checked");
	for (var i = 0; i < teacherids.length; i++) {
		if(i == teacherids.length - 1){
			memberid += teacherids.eq(i).val();
		}else{
			memberid += teacherids.eq(i).val() + ",";
		}
	}
	if(teacherids == null || teacherids == "" || teacherids.length == 0){
		alert("请先选择老师！");
		return false;
	}
	return true;
}