var ctx = $("#ctx").val();

$(document).ready(function() {
	loading_campus();
	initWebUploader();
	
	$("#homework_camupsid").change(function() {
		loading_nj();
	});
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
				$("#homework_camupsid option").remove();
				var campusList = result.data.campusList;
				var spanClass = 'active';
				for (var i = 0; i < campusList.length; i++) {
					$("#homework_camupsid").append('<option value="'+campusList[i].id+'">'+campusList[i].value+'</option>');
					spanClass = '';
				}
				$("#homework_camupsid").trigger("chosen:updated");
				loading_nj();
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

/**
 * 加载年级列表
 * 
 */
function loading_nj() {
	var param = {
		campusid: $("#homework_camupsid").val(),
		userid: $("#main_userid").val()
	}
	var submitData = {
		api: ApiParamUtil.COMMON_QUERY_GRADE,
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
				$("#homework_njid option").remove();
				var njList = result.data.njList;
				var spanClass = 'active';
				for (var i = 0; i < njList.length; i++) {
					$("#homework_njid").append('<option value="'+njList[i].id+'">'+njList[i].njmc+'</option>');
					spanClass = '';
				}
				$("#homework_njid").trigger("chosen:updated");
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
	var param = {
		campusid: $("#homework_camupsid").val(),
		userid: $("#main_userid").val()
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
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code === "200") {
				$("#homework_courseid option").remove();
				var courseList = result.data.courseList;
				var spanClass = 'active';
				for (var i = 0; i < courseList.length; i++) {
					$("#homework_courseid").append('<option value="'+courseList[i].courseid+'">'+courseList[i].coursename+'</option>');
					spanClass = '';
				}
				$("#homework_courseid").trigger("chosen:updated");
				
				if ($("#homeworkid").val() != '') {
					loading_homework_detail();
				}
				
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

/**
 * 获取作业详情
 * 
 */
function loading_homework_detail() {
	var param = {
		homeworkid: $("#homeworkid").val()
	}
	var submitData = {
		api: ApiParamUtil.MY_CLASS_HOMEWORK_HOMEWORK_DETAIL,
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
				$("#title").val(result.data.homeworkinfo.title);
				$("#content").val(result.data.homeworkinfo.content);
				$("#label").val(result.data.homeworkinfo.label);
				$("#serialnumber").val(result.data.homeworkinfo.serialnumber);
				$("#homework_camupsid").val(result.data.homeworkinfo.campusid);
				$("#homework_njid").val(result.data.homeworkinfo.gradeid);
				$("#homework_courseid").val(result.data.homeworkinfo.courseid);
				
				var photos = result.data.homeworkinfo.qiniufiles.split(",");
				if (photos.length > 0) {
					var html = '';
					for (i = 0; i < photos.length; i++) {
						html += '<div id=WU_FILE_"' + i + '" class="thumbnail gallery-image">' +
					                '<div class="img">' +
					                	'<img id="0" alt="image" src="'+photos[i]+'">' +
					                '</div>' +
					                '<div class="gallery-image-options">' +  
					                '	<a onclick="removePhoto(this)" class="btn btn-sm btn-alt btn-primary" data-toggle="tooltip" title="Remove"><i class="fa fa-times"></i></a>' +  
					                '</div>' +
					            '</div>';
					}
					$("#fileList").prepend(html);
					imagesTotal();
				    setTimeout(function(){initPhoto();}, 200);
				}
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}



/**
 * 作业保存
 * 
 */
function homework_save(state) {
	var photoList = $("#fileList").find(".thumbnail");
	var photos = "";

	for (var j = 0; j < photoList.length; j++) {
		if(photoList.eq(j).find("img").attr("src") != ctx +"/static/js/images/loading1.gif"){
			photos += photoList.eq(j).find("img").attr("src") + ",";
		}
	}
	if(photos.length > 0){
		photos = photos.substring(0, photos.length - 1);
	}
	if(!$('#title').val()){
		PromptBox.alert('标题必填！');
		return;
	}
	if(!$('#homework_njid').val()){
		PromptBox.alert('年级必填！');
		return;
	}
	if(!$('#homework_courseid').val()){
		PromptBox.alert('科目必填！');
		return;
	}
	if(photos.length===0&&!$('#content').val()){
		PromptBox.alert('请填写内容或者上传图片！');
		return;
	}
	
	
	if (confirm("确定继续操作吗？")) {
		GHBB.prompt("数据保存中~");
		var param = {
			campusid: $("#homework_camupsid").val(),
			orgcode: $("#main_orgcode").val(),
			publisherid: $("#main_userid").val(),
			id: $("#homeworkid").val(),
			content: $("#content").val(),
			courseid: $("#homework_courseid").val(),
			coursename: $("#homework_courseid option:selected").text(),
			gradeid: $("#homework_njid").val(),
			gradename: $("#homework_njid option:selected").text(),
			isshare: '0',
			label: $("#label").val(),
			qiniufile: photos,
			serialnumber: $("#serialnumber").val(),
			state: state,
			title: $("#title").val()
		}
		var submitData = {
			api: ApiParamUtil.MY_CLASS_HOMEWORK_SAVE,
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
					alert('作业保存成功！');
					window.location.href = ApiParamUtil.MY_CLASS_HOMEWORK_JUMP+"?appid="+$("#functionId").val();
				} else {
					console.log(result.ret.code + ":" + result.ret.msg);
				}
			}
		});
	}
}

function removePhoto(obj){
	$(obj).parent().parent().remove();
	imagesTotal();
}

/**
 * 计算图片数量
 * 
 */
function imagesTotal(){
	if($(".gallery-image").length==9){
		$("#filePicker").addClass("hide");
	}else{
		$("#filePicker").removeClass("hide");
	}
	$(".imageTips").html('还可以上传'+(9-$(".gallery-image").length)+'张照片哟~');
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
	    pick: '#filePicker',
	    // 只允许选择图片文件。
	    accept: {
	        title: 'Images',
	        extensions: 'gif,jpg,jpeg,bmp,png',
	        mimeTypes: 'image/*'
	    }
	});
	
	// 当有文件添加进来的时候
	uploader.on( 'fileQueued', function( file ) {
		if($(".gallery-image").length >= 9){
			alert("最多只能上传9张图片");
			return;
		}
	    var $li = $(
	            '<div id="' + file.id + '" class="thumbnail gallery-image">' +
	                '<div class="img">' +
	                	'<img id="0" alt="image">' +
	                '</div>' +
	                '<div class="gallery-image-options">' +  
	                '	<a onclick="removePhoto(this)" class="btn btn-sm btn-alt btn-primary" data-toggle="tooltip" title="Remove"><i class="fa fa-times"></i></a>' +  
	                '</div>' +
	            '</div>'
	            ),
	        $img = $li.find('img');
	    // $list为容器jQuery实例
	    $("#fileList").prepend( $li );
	    // 创建缩略图
	    // 如果为非图片文件，可以不用调用此方法。
	    // thumbnailWidth x thumbnailHeight 为 100 x 100
	    $img.attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
	    $( '#'+file.id ).find("img").attr("src",response.picUrl);
	    imagesTotal();
	    setTimeout(function(){renderPhoto(file.id);}, 200);
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

function renderPhoto(fileid){
	var img = $("#"+fileid).find("img");
	if(img.height() < img.width()){
		img.css("height","100%");
		img.css("left","50%");
		img.css("margin-left",-img.width()/2);
	}else if(img.height() == img.width()){
		img.css("width","100%");
		img.css("height","100%");
		img.css("top","0");
		img.css("left","0");
	}else{
		img.css("width","100%");
		img.css("top","50%");
		img.css("margin-top",-img.height()/2);
	}
}

function initPhoto(){
	var imgs = $("#fileList").find("img");
	for ( var i = 0; i < imgs.length; i++) {
		var img = imgs.eq(i);
		if(img.height() < img.width()){
			img.css("height","100%");
			img.css("left","50%");
			img.css("margin-left",-img.width()/2);
		}else if(img.height() == img.width()){
			img.css("width","100%");
			img.css("height","100%");
			img.css("top","0");
			img.css("left","0");
		}else{
			img.css("width","100%");
			img.css("top","50%");
			img.css("margin-top",-img.height()/2);
		}
	}
}