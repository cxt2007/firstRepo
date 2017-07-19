var ctx = $("#ctx").val();

$(document).ready(function() {
	$("#themeForm_camupsid").change(function() {
		getFormBjsjList('');

	});
	$("#theme-bjids").change(function() {
		getFormXsjbList('', $("#theme-bjids").val());

	});
	
	$("#newthread").submit(function() {	// 点击保存按钮
		
		var starttime = $("#starttime").val();
		if(starttime == '' || starttime == null ){
			alert("请输入开始时间！");
			$("#submit_send,#submit_save").removeAttr("disabled");
			return false;
		}
		
		var endtime = $("#endtime").val();
		if(endtime == '' || endtime == null ){
			alert("请输入结束时间！");
			$("#submit_send,#submit_save").removeAttr("disabled");
			return false;
		}
		return checkEndTime();
	});
	GHBB.prompt("数据保存中~");
	initWebUploader();
	GHBB.hide();
});

KindEditor.ready(function(K) {
	var folder = "zthd";
	editor = K.create('textarea[name="content"]', {
		cssPath : ctx + '/static/kindeditor/plugins/code/prettify.css',
		uploadJson : ctx + '/filehandel/kindEditorUpload/' + folder + '/image',
		fileManagerJson : ctx + '/filehandel/kindEditorFileManager',
		allowFileManager : true,
		afterCreate : function() {
			var self = this;
			K.ctrl(document, 13, function() {
				self.sync();
				document.forms['inputForm'].submit();
			});
			K.ctrl(self.edit.doc, 13, function() {
				self.sync();
				document.forms['inputForm'].submit();
			});
		},
		afterBlur : function() {
			this.sync();
		}
	});
	// prettyPrint();
});

function getFormBjsjList(bjids) {
	GHBB.prompt("正在加载~");
	var url = ctx + "/base/findBjJsonByCampusid";
	var submitData = {
		campusid : $("#themeForm_camupsid").val() + ""
	};
	$.post(url, submitData, function(data) {
		GHBB.hide();
		var datas = eval(data);
		$("#theme-bjids option").remove();// user为要绑定的select，先清除数据
		for ( var i = 0; i < datas.length; i++) {
			var selectState = '';
			if (bjids != null && bjids != '') {
				var arr = eval('[' + bjids + ']');
				;
				var index = $.inArray(datas[i].id, arr);
				if (index != '-1') {
					selectState = 'selected';
				}
			}
			$("#theme-bjids").append(
					"<option value=" + datas[i].id + " " + selectState + " >"
							+ datas[i].bj + "</option>");
			selectState = '';
		}
		;
		$("#theme-bjids").multiselect('refresh');
	});
}

function getFormXsjbList(stuids, bjids) {
	GHBB.prompt("数据保存中~");
	var url = ctx + "/base/findXsjbJsonByBjids";
	var submitData = {
		bjids : bjids.toString()
	};
	$.get(url, submitData, function(data) {
		GHBB.hide();
		var datas = eval(data);
		$("#theme-stuids option").remove();// user为要绑定的select，先清除数据
		for ( var i = 0; i < datas.length; i++) {
			var selectState = '';
			if (stuids != null && stuids != '') {
				var arr = eval('[' + stuids + ']');
				;
				var index = $.inArray(datas[i].id, arr);
				if (index != '-1') {
					selectState = 'selected';
				}
			}
			$("#theme-stuids").append(
					"<option value=" + datas[i].id + " " + selectState + " >"
							+ datas[i].bjid_ch + "-" + datas[i].xm
							+ "</option>");
			selectState = '';
		}
		;
		$("#theme-stuids").multiselect('refresh');
	});
}

function checkStartTime() {
	var year = $("#starttime").val();
	var start = year.substring(0, 10).split('-');
	var endyear = $("#endtime").val();
	var end = endyear.substring(0, 10).split('-');
	var a = (Date.parse(end) - Date.parse(start)) / 3600 / 1000;
	if (a < 0) {
		$("#endtime").val(year);
	} else {
		return true;
	}
}

function checkEndTime() {
	var year = $("#starttime").val();
	var start = year.substring(0, 10).split('-');
	var endyear = $("#endtime").val();
	var end = endyear.substring(0, 10).split('-');
	var a = (Date.parse(end) - Date.parse(start)) / 3600 / 1000;
	if (a < 0) {
		alert("活动结束时间不能比活动开始时间早");
		$("#endtime").val('');
		return false;
	} else {
		return true;
	}
}

function changeState(){
	$("#state").val(1);
}

function checkTable(){
	if($("#jzph").val().length > 400){
		alert("请限制家长配合内容在400字以内");
		return false;
	}
	$("#submit_send,#submit_save").attr("disabled","disabled");
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
        $('#picpath_a').attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
		$('#picpath').val(response.picUrl );
	    $('#picpath_a').attr( 'href', response.picUrl );
	    $('#picpath_a').find("img").attr( 'src', response.picUrl );
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