var ctx=$("#ctx").val();
var appid=$("#appid").val();
var temp=0;
$(document).ready(function() {
	/**
	 * 根据选择的年级的不同，更换班级图标， 前提是该图标 用户没有点击上传过
	 */
	$("#nj-chosen").change(function(){
		changeIcon();
	});
	$("#submitForm").click(function(){
		saveCommittee();
	});
	$("#info-tab-click").click(function(){
		$("#student_tab").removeClass("active");
		$("#teacher_tab").removeClass("active");
		$("#info_tab").addClass("active");
	});
	$("#teacher-tab-click").click(function(){
		$("#info_tab").removeClass("active");
		$("#student_tab").removeClass("active");
		$("#teacher_tab").addClass("active");
	});
	$("#student-tab-click").click(function(){
		$("#info_tab").removeClass("active");
		$("#teacher_tab").removeClass("active");
		$("#student_tab").addClass("active");
	});
//	$("#teacher-list").change(function(){
//		addTeacher();
//	})
	$("#campus-chosen").change(function() {
		refreshNjListAndTeacherListByCampusid();
	});
	$("#bjImage").click(function(){
		$("#uploadFile").click();
	});
	$("#idimg").click(function(){
		$("#uploadFile1").click();
	});
	$("#bj-name").focus(function(){
		if($("input[name=state]").val()==0){
			if($("#bj-name").val()=="请输入班级名称"){
				$("#bj-name").val("");
				$("#bj-name").css("color","#000000");
				$("#bj-name").css("border-color","#1bbae1");
			}
		}
	});
	$("#bj-name").blur(function(){
		if($("input[name=state]").val()==0){
			if($("#bj-name").val()==""){
				$("#bj-name").val("请输入班级名称");
				$("#bj-name").css("color","#cccccc");
				$("#bj-name").css("border-color","red");
			}
		}else if($("#bj-name").val()==""){
			$("#bj-name").val($("#bjnameForCheck").val());
		}
	});
	initWebUploader();
	resetTeacherList();
	getCommitteeType();
	findClassRoomList();
});

function changeIcon(){
	var NJMC_DABAN = [ "大班", "幼大班" ];
	var NJMC_ZHONGBAN = [ "中班", "幼中班" ];
	var NJMC_XIAOBAN = [ "小班", "幼小班" ];
	var NJMC_TUOBAN = [ "托班", "幼托班" ];
	var NJMC_XUEQIANBAN = [ "学前班", "幼学前班" ];
	var NJMC_GRADE_ONE = [ "一年级" ];
	var NJMC_GRADE_TWO = [ "二年级" ];
	var NJMC_GRADE_THREE = [ "三年级" ];
	var NJMC_GRADE_FOUR = [ "四年级" ];
	var NJMC_GRADE_FIVE = [ "五年级" ];
	var NJMC_GRADE_SIX = [ "六年级" ];
	var NJMC_GRADE_MIDDLE_ONE = [ "初一", "初一年级", "初中一年级" ];
	var NJMC_GRADE_MIDDLE_TWO = [ "初二", "初二年级", "初中二年级" ];
	var NJMC_GRADE_MIDDLE_THREE = [ "初三", "初三年级", "初中三年级" ];
	var NJMC_GRADE_HIGH_ONE = [ "高一", "高一年级", "高中一年级" ];
	var NJMC_GRADE_HIGH_TWO = [ "高二", "高二年级", "高中二年级" ];
	var NJMC_GRADE_HIGH_THREE = [ "高三", "高三年级", "高中三年级" ];

	var elseIconPath="http://static.weixiaotong.com.cn/0a7608d8b63664b1f89ad72cf010043bebf9372f.jpg";
	var iconpath=$("#bjImage").attr("src");
	iconpath=iconpath.split("@");
	iconpath=iconpath[0];	
	
	var currentNjid=$("#nj-chosen").val();
	var currentNjmc=$("#nj-chosen option[value="+currentNjid+"]").text();
	if(isIn(currentNjmc,NJMC_DABAN)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_DABAN);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_DABAN);
	}else if(isIn(currentNjmc,NJMC_ZHONGBAN)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_ZHONGBAN);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_ZHONGBAN);
	}else if(isIn(currentNjmc,NJMC_XIAOBAN)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_XIAOBAN);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_XIAOBAN);
	}else if(isIn(currentNjmc,NJMC_TUOBAN)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_TUOBAN);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_TUOBAN);
	}else if(isIn(currentNjmc,NJMC_XUEQIANBAN)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_XUEQIANBAN);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_XUEQIANBAN);
	}else if(isIn(currentNjmc,NJMC_GRADE_ONE)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_ONE);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_ONE);
	}else if(isIn(currentNjmc,NJMC_GRADE_TWO)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_TWO);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_TWO);
	}else if(isIn(currentNjmc,NJMC_GRADE_THREE)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_THREE);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_THREE);
	}else if(isIn(currentNjmc,NJMC_GRADE_FOUR)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_FOUR);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_FOUR);
	}else if(isIn(currentNjmc,NJMC_GRADE_FIVE)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_FIVE);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_FIVE);
	}else if(isIn(currentNjmc,NJMC_GRADE_SIX)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_SIX);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_SIX);
	}else if(isIn(currentNjmc,NJMC_GRADE_MIDDLE_ONE)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_MIDDLE_ONE);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_MIDDLE_ONE);
	}else if(isIn(currentNjmc,NJMC_GRADE_MIDDLE_TWO)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_MIDDLE_TWO);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_MIDDLE_TWO);
	}else if(isIn(currentNjmc,NJMC_GRADE_MIDDLE_THREE)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_MIDDLE_THREE);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_MIDDLE_THREE);
	}else if(isIn(currentNjmc,NJMC_GRADE_HIGH_ONE)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_HIGH_ONE);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_HIGH_ONE);
	}else if(isIn(currentNjmc,NJMC_GRADE_HIGH_TWO)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_HIGH_TWO);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_HIGH_TWO);
	}else if(isIn(currentNjmc,NJMC_GRADE_HIGH_THREE)){
		$("#bjImage").attr("src",WxXxBjsj.BIGICONPATH_GRADE_HIGH_THREE);
		$("#iconpath").val(WxXxBjsj.BIGICONPATH_GRADE_HIGH_THREE);
	}else{
		$("#bjImage").attr("src",elseIconPath);
		$("#iconpath").val(elseIconPath);
	}
	
}

function setJobsCssOnfocus(obj){
	$(obj).css("border","1px solid #1bbae1");
}

function setJobsCssOnblur(obj){
	$(obj).css("border","1px solid #dbe1e8");
}

function refreshNjListAndTeacherListByCampusid(){
	var campusid=$("#campus-chosen").val();
	var url=ctx+"/xtgl/bjsj/ajax_getNjListAndTeacherListByCampusid?campusid="+campusid;
	$.get(url,function(data){
		$("#teacher-list option").remove();	
		$("#teacher-list").append("<option>请选择老师</option>")
		$("#nj-chosen").html("");
		if(data=="[]") return;
		datas=eval(data);
		var njList=datas[0];
		var teacherList=datas[1];
		if(njList==null || njList=="" || njList.length==0){
			$("#nj-chosen").html("<option value=''>暂无年级</option>");
		}else{
			for(var i=0;i<njList.length;i++){
				var nj=njList[i].njmc;
				$("#nj-chosen").append("<option value='"+njList[i].id+"'>"+njList[i].njmc+"</option>");
			}	
			for(var i=0;i<teacherList.length;i++){
				if(teacherList[i].job!=null && teacherList[i].job!="")
					$("#teacher-list").append("<option value='"+teacherList[i].id+"'>"+teacherList[i].name+"/"+teacherList[i].job+"</option>");
				else 
					$("#teacher-list").append("<option value='"+teacherList[i].id+"'>"+teacherList[i].name+"</option>");
				$("#teacher-info").html("");
				addTeacher();
			}
		}			
	});
}

function getCommitteeType(){
	var submitData = {
		apiparams: JSON.stringify({
			params:{
				type: 'CLASS_COMMITTEE'
			},
			readonly: true
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: ctx + '/securityapi/dict_list/',
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createCommitteeType(result.data);
				getStuList();
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createCommitteeType(committeeType){
	if(committeeType != null){
		var option = '<option value="0">——请选择职务——</option>';
		for ( var i = 0; i < committeeType.length; i++) {
			committee = committeeType[i];
			option += '<option value="'+committee.key+'">'+committee.value+'</option>';
		}
		$("#committee-type").html(option);
	}
}

function getStuList(){
	var campusid = '';
	if($("input[name=state]").val()==0){
		campusid=$("#campus-chosen").val();
	}else{
		campusid=$("#campusid").val();
	}
	if($("#bjid").val()!=undefined && $("#bjid").val()!=''){
		var submitData={};
		submitData.campusid=campusid;
		submitData.bjid =$("#bjid").val();
		var resutl = CalApiUtil.callSecurityApi('xsjb_listByBjid',submitData);
		createStuList(resutl);
	}
	getCommitteeList();
//	
//	var submitData = {
//		apiparams: JSON.stringify({
//			params:{
//				bjid: $("#bjid").val(),
//				campusid: campusid
//			},
//			readonly: true
//		})
//	};
//	$.ajax({
//		cache:false,
//		type: "POST",
//		url: ctx + '/securityapi/xsjb_listByBjid/',
//		data: submitData,
//		success: function(datas){
//			var result = typeof datas === "object" ? datas : JSON.parse(datas);
//			if(result.ret.code==="200"){
//				createStuList(result.data);
//				getCommitteeList();
//			}else{
//				console.log(result.ret.code+":"+result.ret.msg);
//			}
//		}
//	});
}

function createStuList(studentList){
	if(studentList != null){
		var option = '<option value="0">——请选择学生——</option>';
		for ( var i = 0; i < studentList.length; i++) {
			stu = studentList[i];
			option += '<option value="'+stu.id+'">'+stu.name+'</option>';
		}
		$("#stu-list").html(option);
	}
}

function addTeacher(){
	var teacher_option = $("#teacher-list").html();
	
	
	$("#teacher-info").append("<li><input type='hidden' name='teacherIds' value=''/>"+
										"<select class='form-control teacher-info-col1' onchange='chooseTeacher(this);'>"+teacher_option+
										"</select>"+
										"<input type='tel' maxlength='25' name='jobs' class='teacher-info-col2' value='' placeholder='请编辑职务'  onfocus='setJobsCssOnfocus(this)' onblur='setJobsCssOnblur(this)'/>"+
										"<span class='teacher-info-col4' onclick='teacherRemove(this)'>&nbsp;&nbsp;移除</span>"+
										"</li>");
	resetTeacherList();
}

function chooseTeacher(e){
	var idAndJob=$(e).val();
	var idAndJobArr=idAndJob.split("/");
	var id=idAndJobArr[0];
	var job=idAndJobArr[1];	
	$(e).prev().val(id);
	$(e).next().val(job);
}

function jobEdit(obj){
	$(obj).prev().focus();
}

function teacherRemove(obj){
	$(obj).parent().remove();
}
/**
 * 校验班级名称  不能为空  并不能在当前校区重名
 * @returns {Boolean}
 */
function checkBjmc(){
	if(temp==1)
		return true;
	var bjmc=$("#bj-name").val().trim();
	var info=$("#info").val();
	if(bjmc==""|| bjmc=="请输入班级名称" || bjmc==null){
		alert("请输入班级名称");
	}else if(info.length > 45){
		alert("班级备注不得超过45个字");
	}else{
		if($("input[name=state]").val()==1 && bjmc==$("#bjnameForCheck").val().trim()){	
				return true;						
		}else{
			var url=ctx+"/xtgl/bjsj/checkBjmc";
			var campusid="";
			if($("input[name=state]").val()==0){
				campusid=$("#campus-chosen").val();
			}else{
				campusid=$("#campusid").val();
			}
			GHBB.prompt("数据保存中~");
			$.post(url,{"campusid":campusid,"bjmc":bjmc},function(data){
				GHBB.hide();
				if(data==0){
					alert("当前班级名称已经存在");
					return false;
				}else{
					temp=1;
					$("#submitForm").trigger("click");
				}
			})
		}		
	}
	return false;
}

function checkTeacherJobs(){
	$("input[name=jobs]").each(function(){
		if($(this).val()=="" || $(this).val()==null){
			$(this).val("");			
		}
	})
	return true;
}

function checkTeacherIds(){
	var ids=[]
	$("input[name=teacherIds]").each(function(){
		ids.push($(this).val());
	})
	for(var i=0;i<ids.length;i++){
		for(var j=i+1;j<ids.length;j++){
			if(ids[i]==ids[j]){
				alert("老师添加重复，请修改后或移除后，再保存");
				return false;
			}				
		}
	}
	return true;
}

function checkNjid(){
	var njid=$("#nj-chosen").val();
	if(njid =="" || njid ==null){
		alert("请先设置年级");
		return false;
	}		
	return true;
}

function checkSubmit(){
	
	 return checkBjmc() && checkNjid() && checkTeacherIds() && checkTeacherJobs();		
}



function deleteClass(){
	var url=ctx+"/xtgl/bjsj/deleteBj";
	var bjid=$("input[name=id]").val();
	if(bjid!=null || bjid!=""){
		if(confirm("确定要删除该班级吗？")){
			$.post(url,{"bjid":$("input[name=id]").val()},function(data){
				if(data=="success"){
					alert("删除班级成功");
					location.href=ctx+"/xtgl/bjsj?appid="+appid;
				}else if(data=="error"){
					alert("该班级还有学生，不能删除");
				}				
			})
		}
	}	
}

function setBtnDisabled(){
	$("#submitForm").attr("disabled","disabled");
}

function initWebUploader(){
	// 初始化Web Uploader
	var uploader = WebUploader.create({
	    // 选完文件后，是否自动上传。
	    auto: true,
	    // swf文件路径
	    swf: ctx + '/static/js/webuploader/Uploader.swf',
	    // 文件接收服务端。
	    server: ctx+"/klxx/wlzy/swfupload",
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    pick: {
	    	id :'#filePicker',
	    	multiple : false
	    },
	    // 只允许选择图片文件。
	    accept: {
	        title: 'Images',
	        extensions: 'gif,jpg,jpeg,bmp,png',
	        mimeTypes: 'image/*'
	    }
	});
	
	// 当有文件添加进来的时候
	uploader.on( 'fileQueued', function( file ) {
        $('#xsjbpicpath').attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
		$("#iconpath").val(response.picUrl);
	    $('#bjImage').attr( 'src', response.picUrl);
	});
	
	// 文件上传失败，显示上传出错。
	uploader.on( 'uploadError', function( file ) {
	    var $li = $( '#'+file.id ),
	        $error = $li.find('div.error');

	    // 避免重复创建
	    if ( !$error.length ) {
	        $error = $('<div class="error"></div>').appendTo( $li );
	    }

	    $error.text('上传失败');
	});
	
	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on( 'uploadComplete', function( file ) {
	    $( '#'+file.id ).find('.progress').remove();
	});
}

function resetTeacherList(){
	var teacherList = $("#teacher-info").find("select");
	var teacheridArr = [];
	for ( var i = 0; i < teacherList.length; i++) {
		var teacherid = teacherList.eq(i).val();
		if(teacherid != null && teacherid != "" && teacherid != undefined){
			teacheridArr.push(teacherid);
		}
		teacherList.eq(i).change(function(){
			resetTeacherList();
		});
	}
	
	var allTeacher = $("#teacher-list").find("option");
	
	for ( var i = 0; i < teacherList.length; i++) {
		var teacherid = teacherList.eq(i).val();
		teacherList.eq(i).children().remove();
		for ( var j = 0; j < allTeacher.length; j++) {
			var option = allTeacher.eq(j);
			if(option.val() == teacherid || $.inArray(option.val(), teacheridArr) == -1){
				if(option.val() == teacherid){
					option.attr("selected","selected");
				}
				teacherList.eq(i).append(option.prop("outerHTML"));
				option.removeAttr("selected");
			}
		}
	}
}

function addCommittee(){
	var li = '<li class="c">'
		   + '	<select name="committee" class="form-control teacher-info-col1">'+ $("#committee-type").html() +'</select>'
		   + '	<select name="stuid" class="form-control teacher-info-col1">'+ $("#stu-list").html() +'</select>'
		   + '	<a href="javascript:void(0);" onclick="removeCommittee(this);" class="teacher-info-col4">移除</a>'
		   + '</li>';
	$("#committeeList").append(li);
	totalCount();
}

function totalCount(){
	var num = $("#committeeList").find(".c").length;
	if(num == 0){
		$("#committeeList").html('<li class="noData"><a href="javascript:addCommittee();">点击添加班委</a></li>');
	}else{
		$("#committeeList").find('.noData').remove();
	}
}

function removeCommittee(obj){
	$(obj).parent().remove();
	totalCount();
}

function getCommitteeData(){
	var list = new Array();
	var cList = $("select[name='committee']");
	var sList = $("select[name='stuid']");
	if(cList.length != sList.length){
		return list;
	}
	for ( var i = 0; i < cList.length; i++) {
		c = cList.eq(i);
		s = sList.eq(i);
		if(c.val() != 0 && s.val() != 0){
			var obj = {};
			obj.committee = c.val();
			obj.stuid = s.val();
			list.push(obj);
		}
	}
	return list;
}

function saveCommittee(){
	if(checkSubmit()){
		GHBB.prompt("数据保存中...");
		var campusid = '';
		if($("input[name=state]").val()==0){
			campusid=$("#campus-chosen").val();
		}else{
			campusid=$("#campusid").val();
		}
		var committeeList=getCommitteeData();
		if($("#bjid").val()!=undefined && $("#bjid").val()!='' && committeeList!=null && committeeList.length>0){
			var submitData={};
			submitData.campusid=campusid;
			submitData.bjid =$("#bjid").val();
			submitData.committeeList =getCommitteeData();
			var resutl = CalApiUtil.callSecurityApi('classcommittee_save',submitData,false);
		}
		$("#bjForm").submit();
//		var submitData = {
//			apiparams: JSON.stringify({
//				params:{
//					bjid: $("#bjid").val(),
//					campusid: campusid,
//					committeeList: getCommitteeData()
//				},
//				readonly: false
//			})
//		};
//		$.ajax({
//			cache:false,
//			type: "POST",
//			url: ctx + '/securityapi/classcommittee_save/',
//			data: submitData,
//			success: function(datas){
//				var result = typeof datas === "object" ? datas : JSON.parse(datas);
//				if(result.ret.code==="200"){
//					$("#bjForm").submit();
//				}else{
//					console.log(result.ret.code+":"+result.ret.msg);
//				}
//			}
//		});
	}
}

function getCommitteeList(){
	var campusid = '';
	if($("input[name=state]").val()==0){
		campusid=$("#campus-chosen").val();
	}else{
		campusid=$("#campusid").val();
	}
	var submitData = {
		apiparams: JSON.stringify({
			params:{
				bjid: $("#bjid").val(),
				campusid: campusid
			},
			readonly: false
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: ctx + '/securityapi/classcommittee_listByBjid/',
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createCommitteeList(result.data);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createCommitteeList(committeeList){
	if(committeeList != null && committeeList.length > 0){
		$("#committeeList").children().remove();
		for ( var i = 0; i < committeeList.length; i++) {
			var committee = committeeList[i];
			var li = '<li class="c">'
				   + '	<select id="committee_'+ committee.id +'" name="committee" class="form-control teacher-info-col1">'+ $("#committee-type").html() +'</select>'
				   + '	<select id="stuid_'+ committee.id +'" name="stuid" class="form-control teacher-info-col1">'+ $("#stu-list").html() +'</select>'
				   + '	<a href="javascript:void(0);" onclick="removeCommittee(this);" class="teacher-info-col4">移除</a>'
				   + '</li>';
			$("#committeeList").append(li);
			$("#committee_"+committee.id).val(committee.committee);
			$("#stuid_"+committee.id).val(committee.stuid);
		}
	}
	totalCount();
}

/**
 * 查询教室列表
 * @param usertype
 * @param current_stuid
 */
function findClassRoomList(){
	//设置当前学生 为空
	var campusid = '';
	if($("input[name=state]").val()==0){
		campusid=$("#campus-chosen").val();
	}else{
		campusid=$("#campusid").val();
	}
	var submitData={};
	submitData.campusid=campusid;
	var resutl = CalApiUtil.callSecurityApi('examroom_findClassRoomList',submitData);
	createClassroomList(resutl);
	
}

function createClassroomList(classRoomList){
	if(classRoomList != null){
		
		$("#classroom-list option").remove();//user为要绑定的select，先清除数据   
        for(var i=0;i<classRoomList.length;i++){
        	$("#classroom-list").append("<option value=" + classRoomList[i].classroomid+" >"
        			+ classRoomList[i].classroomName + "</option>");
        };
        $("#classroom-list").find("option[value='"+$("#classroomid1").val()+"']").attr("selected",'selected');
        $("#classroom-list").trigger("chosen:updated");
        
	}
}




























