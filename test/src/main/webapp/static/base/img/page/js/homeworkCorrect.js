var commonUrl_ajax = $("#commonUrl_ajax").val();

var ctx = $("#main_ctx").val();

$(document).ready(function() {
	$(".ifr_div").css("width", $(".full").width());
	$(".ifr_div").css("height", $(".full").height());
	$("#loading").css("width", $(".full").width());
	$("#loading").css("height", $(".full").height());
	
	loading_homework();
	
    loading_class_list();
    
    loading_comment_list();
    
    $("#homework-bjid-chosen").change(function() {
    	$("#homework-detail-id").val("");
    	loading_student_list();
	});
    
    $("#saveSubmit").click(function() {
    	save_homework_info();
	});
    
});

/**
 * 切换学生
 * 
 * @param obj
 */
function changeStudent(obj, id) {
	if ($("#comment").val() != $("#pre-comment").val() && $(obj).find("input").attr("value") != $("#homework-detail-id").val() && $("#homework-detail-id").val() != '') {
		save_homework_info();
	}
	
	$(".btn-done-active").removeClass("btn-done-active");
	$(".btn-doing-active").removeClass("btn-doing-active");
	$(obj).addClass($(obj).val() + "-active");
	
	loading_student_homework_detail(id);
	
}

/**
 * 提示保存并切换上交的作业图片
 * 
 */
function saveAndChangeImg(obj, id) {
	var image = $("#myCanvas").get(0).toDataURL("image/png");
	if ($(".ui-dialog").css("display") == "block" && $("#photo-src").val() != "" && image != $("#photo-src").val()) {
		if (confirm("确认保存图片吗？")) {
			save_homework_img();
		} else {
			changeImg(obj, id);
		}
	} else {
		changeImg(obj, id);
	}
}

/**
 * 切换上交的作业图片
 * 
 */
function changeImg(obj, id) {
	$(".ifr_div").css("display", "block");
	
	var qiniufile = $(obj).find("img").attr("src");
	
	var param = {
		qiniufile: qiniufile
	};
	var submitData = {
		api: ApiParamUtil.MY_CLASS_HOMEWORK_STUDENT_HOMEWORK_IMG_CONVERT,
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
				
				$("#photo-header").val($(obj).find("input").val());
				$("#photo-id").val(id);
				
				var base64src = 'data:image/' + $("#photo-header").val() + ';base64,' + result.data.base64src;
				
				$("#photo-src").val(base64src);
				
				var imgmain = new Image();
				imgmain.src = $("#photo-src").val();
				
				$(".box-img-active").removeClass("box-img-active");
				$(obj).addClass("box-img-active");
				
				var theCanvas = document.getElementById("myCanvas");
				var context = theCanvas.getContext("2d");
				
				var width = document.documentElement.clientWidth/2 - 36;
				$("#myCanvas").attr("width", width + "px");
				
				var height = width/imgmain.width*imgmain.height;
				$("#myCanvas").attr("height", height + "px");
				
				jPainter();
				
				imgmain.onload = function() {
					context.fillStyle="#FFFFFF";
					context.fillRect(0, 0, theCanvas.width, theCanvas.height);
					
					context.drawImage(imgmain, 0, 0, width, height);
					
					$(".ifr_div").css("display", "none");
				}
				
//				$("#myCanvas").css("width", $("#container").css("width"));
//				$("#myCanvas").css("height", theCanvas.width/imgmain.width*imgmain.height);
//				context.drawImage(imgmain, 0, 0);
				
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
	
}

/**
 * 加载接收作业的班级列表
 * 
 */
function loading_class_list() {
	var param = {
		homeworkid: $("#homeworkid").val()
	};
	var submitData = {
		api: ApiParamUtil.MY_CLASS_HOMEWORK_RECEIVE_CLASS_LIST,
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
				$("#homework-bjid-chosen option").remove();
				var classList = result.data.classList;
				if (classList.length > 1) {
					for (var i = 1; i < classList.length; i++) {
						$("#homework-bjid-chosen").append('<option value="'+classList[i].classid+'">'+classList[i].classname+'</option>');
					}
					$("#homework-bjid-chosen").trigger("chosen:updated");
					
					loading_student_list();
				}
				
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}


/**
 * 加载接收作业的学生列表
 * 
 */
function loading_student_list() {
	var param = {
		campusid: $("#main_campusid").val(),
		classid: $("#homework-bjid-chosen").val(),
		homeworkid: $("#homeworkid").val()
	};
	var submitData = {
		api: ApiParamUtil.MY_CLASS_HOMEWORK_RECEIVE_STUDENT_LIST,
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
				var xsjbList = result.data.xsjbList;
				var total_send = 0;
				var total_doing = 0;
				var total_done = 0;
				var html = '';
				for (var i = 0; i < xsjbList.length; i++) {
					total_send++;
					var xsjb = xsjbList[i];
					if (xsjb.state == 1) { //已提交，未批改
						html += '<button class="col-md-5 btn btn-alt btn-primary btn-already" type="button" onclick="changeStudent(this, ' + xsjb.id + ');" value="btn-doing">' + xsjb.stuname + '<input type="hidden" value="' + xsjb.id + '" /></button>';
						total_doing++;
					} else if (xsjb.state == 2) { //已批改
						html += '<button class="col-md-5 btn btn-alt btn-done btn-already" type="button" onclick="changeStudent(this, ' + xsjb.id + ');" value="btn-done">'
							+ xsjb.stuname
							+ '<img alt="" src="' + ctx + '/static/styles/mobile/images/ico_yes2.png" />'
							+ '<input type="hidden" value="' + xsjb.id + '" />'
							+ '</button>';
						total_doing++;
						total_done++;
					} else {
						html += '<button class="col-md-5 btn btn-alt btn-default btn-todo active" type="button">' + xsjb.stuname + '</button>';
					}
				}
				$("#student-list").html(html);
				$("#total_send").html(total_send);
				$("#total_doing").html(total_doing);
				$("#total_done").html(total_done);
				
				if ($("#student-list").find(".btn-already").length > 0) {
					$(".rightBtn").css("display", "none");
					$(".rightDiv").css("display", "block");
					$($("#student-list").find(".btn-already").get(0)).trigger("click");
				} else {
					$(".rightBtn").css("display", "block");
					$(".rightDiv").css("display", "none");
				}
				
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}


/**
 * 加载学生上交的作业详情
 * 
 */
function loading_student_homework_detail(id) {
	var param = {
		id: id
	};
	var submitData = {
		api: ApiParamUtil.MY_CLASS_HOMEWORK_STUDENT_HOMEWORK_DETAIL,
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
				$("#homework-detail-id").val(result.data.id);
				$("#serialnumber").val(result.data.serialnumber);
				$("#stuname").html(result.data.stuname);
				$("#submitdate").html(result.data.submitdate);
				if (!isNullOrEmpty(result.data.remark)) {
					$("#remark").html(result.data.remark);
				}
				$("#comment").val(result.data.comment);
				$("#pre-comment").val(result.data.comment);
				
				var photoList = result.data.photoList;
				if (photoList.length > 0) {
					$(".block-img").css("display", "block");
//					$("#dialog").css("display", "block");
					var html = '';
					for (var i = 0; i < photoList.length; i++) {
						html += '<div class="col-md-3">'
		                	+ '<div class="box-img img" onclick="saveAndChangeImg(this, ' + photoList[i].id + ');">'
		                	+ '<img src="' + photoList[i].qiniufile + '" id="photo-' + photoList[i].id + '" />'
		                	+ '<input type="hidden" value="' + photoList[i].header + '" />'
		                	+ '<div class="cl"></div>'
		                	+ '</div>'
		                	+ '</div>';
					}
					$("#photo-list").html(html);
					
					$(".box-img").css("height", $(".box-img").width());
				    initImgCss();
					
//					$("#photo-src").val($("#myCanvas").get(0).toDataURL("image/png"));
//					$($("#photo-list").find(".box-img").get(0)).trigger("click");
				} else {
					$(".block-img").css("display", "none");
//					$("#dialog").css("display", "none");
				}
				
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

/**
 * 作业批改图片保存
 * 
 */
function save_homework_img() {
	$(".ifr_div").css("display", "block");
	var image = $("#myCanvas").get(0).toDataURL("image/png").replace("data:image/png;base64,", "");
	var param = {
		campusid: $("#main_campusid").val(),
		orgcode: $("#main_orgcode").val(),
		userid: $("#main_userid").val(),
		fileid: $("#photo-id").val(),
		id: $("#homework-detail-id").val(),
		qiniufile: image,
		serialnumber: $("#serialnumber").val()
	};
	var submitData = {
		api: ApiParamUtil.MY_CLASS_HOMEWORK_CORRECT_SAVE_IMG,
		param: JSON.stringify(param)
	};
	close_dialog();
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code == "200") {
				$("#photo-" + $("#photo-id").val()).attr("src", result.data.qiniufile);
				PromptBox.alert('作业批改图片保存成功！');
				$(".ifr_div").css("display", "none");
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

/**
 * 关闭画板
 * 
 */
function close_dialog() {
	$('#dialog').dialog('close');
}

function changeColor(obj) {
	$("#pencil-color").val($(obj).val());
	var btns = $(".btn-pencil");
	for(i = 0; i < btns.length; i++) {
		$(btns[i]).removeClass("active");
	}
	$(obj).addClass("active");
}

function rollback(obj) {
	$(obj).removeClass("active");
}

/**
 * 作业批改信息保存
 * 
 */
function save_homework_info() {
	if (confirm("确定保存批改吗？")) {
		var param = {
			userid: $("#main_userid").val(),
			id: $("#homework-detail-id").val(),
			comment: $("#comment").val()
		};
		var submitData = {
			api: ApiParamUtil.MY_CLASS_HOMEWORK_CORRECT_SAVE,
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
					PromptBox.alert('作业批改保存成功！');
				} else {
					console.log(result.ret.code + ":" + result.ret.msg);
				}
			}
		});
	}
}

/**
 * 加载作业详情
 * 
 */
function loading_homework() {
	var submitData = {
			api:ApiParamUtil.MY_CLASS_HOMEWORK_HOMEWORK_DETAIL,
			param:JSON.stringify({
				homeworkid: $("#homeworkid").val()
			})
		};
		$.ajax({
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas){
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code == "200") {
					var homework = result.data.homeworkinfo;
					$('#homeworkid').val(homework.id);
					$('#homeworkname').html(homework.title);
					$('#homeworktitle').html(homework.title);
					$('#homeworkcourse').html(homework.coursename);
					$('#homeworkgrade').html(homework.gradename);
					$('#publisher').html(homework.publishername);
					$('#publishdate').html(homework.publishdate);
					var qiniufiles =homework.qiniufiles.split(",");
					var qiniufilesArray = new Array();
					for(var i = 0;i<qiniufiles.length;i++) {
						qiniufilesArray.push('<div class="col-md-12"><img class="mfp-img" src="'+qiniufiles[i]+'"></div>');
					}
					$('#homeworkImages').html(qiniufilesArray.join());
					$('#homeworktag').html(homework.label);
					$('#homeworkcontent').html(homework.content);
				} else {
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
}

/**
 * 显示作业详情
 * 
 */
function show_homework_dialog() {
	$('#modal-homework').modal('show');
}

/**
 * 加载预置评语列表
 * 
 */
function loading_comment_list() {
	var param = {
		type: DICTTYPE.DICT_TYPE_COMMENT
	};
	var submitData = {
		api: ApiParamUtil.COMMON_QUERY_DICT,
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
				var html = '';
				var dictList = result.data.dictList;
				for (var i = 0; i < dictList.length; i++) {
					html += '<a href="javascript:addComment(\'' + dictList[i].value + '\');">' + dictList[i].value + '</a>';
				}
				$("#comment-list").html(html);
				
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}


/**
 * 插入预置评语
 * 
 */
function addComment(obj) {
	var comment = $("#comment").val() + obj;
	$("#comment").val(comment);
}

function  initImgCss(){
	var imgDivs = $(".img");
	for (var i = 0; i < imgDivs.length; i++) {
		//外面边框的的高宽比例
		var H_W = imgDivs.eq(i).height() / imgDivs.eq(i).width();
		//图片的高宽比例
		var h_w = imgDivs.eq(i).find("img").height() / imgDivs.eq(i).find("img").width();
		if(H_W > 1 && H_W > h_w){
			maxHeight(imgDivs.eq(i));
		}else if(H_W > 1 && H_W < h_w){
			maxWidth(imgDivs.eq(i));
		}else if(H_W < 1 && H_W > h_w){
			maxHeight(imgDivs.eq(i));
		}else if(H_W < 1 && H_W < h_w){
			maxWidth(imgDivs.eq(i));
		}else if(H_W = 1 && h_w > 1){
			maxWidth(imgDivs.eq(i));
		}else if(H_W = 1 && h_w < 1){
			maxHeight(imgDivs.eq(i));
		}else{
			maxHeightAndWidth(imgDivs.eq(i));
		}
	}
}

function maxWidth(obj) {
	obj.find("img").css("width","100%");
	obj.find("img").css("top","50%");
//	obj.find("img").css("margin-top",-obj.find("img").height()/2);
}

function maxHeight(obj) {
	obj.find("img").css("height","100%");
	obj.find("img").css("left","50%");
//	obj.find("img").css("margin-left",-obj.find("img").width()/2);
}

function maxHeightAndWidth(obj) {
	obj.find("img").css("top","0");
	obj.find("img").css("left","0");
	obj.find("img").css("height","100%");
	obj.find("img").css("width","100%");
}

