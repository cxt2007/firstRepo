var ctx = $("#ctx").val();

$(document).ready(function() {
	jq(function() {
		seajs.use([ 'newthread' ], function(newthread) {
			newthread.init();
		});
		
		
	});
});

KindEditor.ready(function(K) {
	editor1 = K.create('textarea[name="jtnr"]', {
		cssPath : '${ctx}/static/kindeditor/plugins/code/prettify.css',
		uploadJson : '${ctx}/filehandel/kindEditorUpload/xxjj/media',
		fileManagerJson : '${ctx}/filehandel/kindEditorFileManager',
		allowFileManager : true,
		afterCreate : function() {
			var self = this;
			K.ctrl(document, 13, function() {
				self.sync();
				document.forms['newthread'].submit();
			});
			K.ctrl(self.edit.doc, 13, function() {
				self.sync();
				document.forms['newthread'].submit();
			});
		}
	});
});

function changeAppraise(stuid){
	queryReview(stuid);
	activeTab(stuid);
}

function activeTab(stuid){
	$("#stu_"+stuid).parent().parent().find("a").removeClass("active");
	$("#stu_"+stuid).addClass("active");
	setStuNameTitle();
}

function queryReview(stuid){
	var url=ctx+"/xtgl/theme/ajax_query_comment";
	var themeid = $("#themeid").val();
	var submitData = {
		stuid	: stuid,
		themeid : themeid
	}; 
	$.get(url,
		submitData,
     	function(data){
		var datas = eval("(" + data + ")");
		createAppraiseBox(datas);
    });
}

function createAppraiseBox(datas){
	var parent_publishdate = "";
	var parentmsg = "";
	var teacher_publishdate = "";
	var teachermsg = "";
	if(datas != null && datas.parent_publishdate != null && datas.parent_publishdate != ""){
		parent_publishdate = datas.parent_publishdate;
		parentmsg = datas.parentmsg;
	}else{
		parentmsg = "暂无家长评语";
	}
	if(datas != null && datas.teacher_publishdate != null && datas.teacher_publishdate != ""){
		teacher_publishdate = datas.teacher_publishdate;
		teachermsg = datas.teachermsg;
		$("#teachermsg").html(teachermsg);
		hideEditAppraise();
	}else{
		teachermsg = "暂无老师评语";
		$("#teachermsg").html(teachermsg);
		showEditAppraise();
	}
	$("#parent_publishdate").html(parent_publishdate);
	$("#parentmsg").html(parentmsg);
	$("#teacher_publishdate").html(teacher_publishdate);
	clearPhoto();
	if(datas != null){
		findPhoto(datas.stuid);
		$("#reviewid").val(datas.id);
	}else{
		$("#reviewid").val("");
	}
}

function findPhoto(stuid){
	var url=ctx+"/xtgl/theme/ajaxQueryPhoto";
	var themeid = $("#themeid").val();
	var submitData = {
			stuid	: stuid,
			themeid : themeid
	}; 
	$.post(url,
		submitData,
     	function(data){
		var datas = eval("(" + data + ")");
		createPhotoList(datas);
    });
}

function createPhotoList(datas){
	var parentLi = "";
	var teacherLi = "";
	for (var i = 0; i < datas.length; i++) {
		if(datas[i].usertype == 1){
			teacherLi+= '<li>'
					 +  '	<div class="img">'
					 +  '		<img alt="" src="'+checkQiniuUrl(datas[i].qiniufile)+'" />'
					 +  '	</div>'
					 +  '</li>';
		}else if(datas[i].usertype == 2){
			parentLi += '<li>'
					 +  '	<div class="img">'
					 +  '		<img alt="" src="'+checkQiniuUrl(datas[i].qiniufile)+'" />'
					 +  '	</div>'
					 +  '</li>';
		}
	}
	$("#parentPhoto").html(parentLi);
	$("#teacherPhoto").html(teacherLi);
}

function setStuNameTitle(){
	var stuName = $(".xsjbList").find("a[class='active']").html();
	$("#stu_p").html(stuName + "家长的感言");
}

function clearPhoto(){
	$("#parentPhoto").html("");
	$("#teacherPhoto").html("");
	$("#addPic").parent().find("li[id!='addPic']").remove();
	$("input[name='qiniufile']").remove();
}

function showEditAppraise(){
	if($("#teachermsg").html() == "暂无老师评语"){
		$("#newTeachermsg").val("");
	}else{
		$("#newTeachermsg").val($("#teachermsg").html());
	}
	$("#editAppraise").removeClass("hide");
	showOrHideEditBtn();
}

function hideEditAppraise(){
	$("#editAppraise").addClass("hide");
	$("#newTeachermsg").text("");
	showOrHideEditBtn();
}

function saveComment(){
	var themeid = $("#themeid").val();
	var teachermsg = $("#newTeachermsg").val();
	var stuid = $(".xsjbList").find("a[class='active']").attr("id").split("_")[1];
	var campusid = $("#campusid").val();
	if(teachermsg == ""){
		alert("评语内容不能为空！");
		return;
	}
	var url=ctx+"/xtgl/theme/saveComment";
	var submitData = {
			themeid		: themeid,
			teachermsg	: teachermsg,
			stuid		: stuid,
			campusid	: campusid
	}
	$.post(url,
		submitData,
     	function(data){
		if(data == "修改成功！" || data == "保存成功！"){
			$("#teachermsg").html(teachermsg);
		}
		hideEditAppraise();
		showTeachermsg();
    });
}

function showOrHideEditBtn(){
	if($("#editAppraise").hasClass("hide")){
		$("#editBtn").removeClass("hide");
	}else{
		$("#editBtn").addClass("hide");
	}
}

function editComment(){
	hideTeachermsg();
	showEditAppraise();
}

function showTeachermsg(){
	$("#teachermsg").css("display","block");
}

function hideTeachermsg(){
	$("#teachermsg").css("display","none");
}

function savePhoto(){
	var photoList = $("input[name='qiniufile']");
	var qiniufile = "";
	if(photoList.length == 0){
		alert("请至少选择一张图片！");
		return;
	}else{
		for (var i = 0; i < photoList.length; i++) {
			if(i == photoList.length - 1){
				qiniufile += photoList.eq(i).val();
			}else{
				qiniufile += photoList.eq(i).val() + ",";
			}
		}
	}
	var stuid = $(".xsjbList").find("a[class='active']").attr("id").split("_")[1];
	var themeid = $("#themeid").val();
	var campusid = $("#campusid").val();
	var reviewid = $("#reviewid").val();
	var url=ctx+"/xtgl/theme/savePhoto";
	var submitData = {
			themeid		: themeid,
			stuid		: stuid,
			campusid	: campusid,
			reviewid	: reviewid,
			qiniufile	: qiniufile
	}
	$.post(url,
		submitData,
     	function(data){
		alert(data);
		var teacherLi = "";
		for (var i = 0; i < photoList.length; i++) {
			teacherLi+= '<li>'
					 +  '	<div class="img">'
					 +  '		<img alt="" src="'+photoList.eq(i).val()+'" />'
					 +  '	</div>'
					 +  '</li>';
		}
		$("#teacherPhoto").append(teacherLi);
		$("#addPic").parent().find("li[id!='addPic']").remove();
		photoList.remove();
    });
}
