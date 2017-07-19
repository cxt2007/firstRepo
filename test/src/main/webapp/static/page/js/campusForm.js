var ctx = "";
var commonUrl_ajax = $("#commonUrl_ajax").val();
var TablesDatatables = function() {

	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$.validator.addMethod("isDomain", function(value, element) {     
    return this.optional(element) || checkDomain(value);     
}, "请正确输入您的身份证号码");  


function checkDomain(str) {
	var strRegex = '^((https|http|ftp|rtsp|mms)?://)' 
		+ '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
		+ '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
		+ '|' // 允许IP和DOMAIN（域名） 
		+ '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
		+ '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
		+ '[a-z]{2,6})' // first level domain- .com or .museum 
		+ '(:[0-9]{1,4})?' // 端口- :80 
		+ '((/?)|' // a slash isn't required if there is no file name 
		+ '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'; 
		var re=new RegExp(strRegex);
		if (re.test(str)) {
			if(/weixiaotong.com/.test(str)){
				if(/http/.test(str)){
					return (false); 
				}else{
					return (true); 
				}
			}else{
				return (true); 
			}
		} else { 
			return (false); 
		} 
} 
$(document).ready(
		function() {
			$('#campus-form').validate(
					{
						errorClass : 'help-block animation-slideDown',
						errorElement : 'div',
						errorPlacement : function(error, e) {
							e.parents('.form-group > div').append(error);
						},
						highlight : function(e) {
							$(e).closest('.form-group').removeClass(
									'has-success has-error').addClass(
									'has-error');
							$(e).closest('.help-block').remove();
						},
						success : function(e) {
							e.closest('.form-group').removeClass(
									'has-success has-error');
							e.closest('.help-block').remove();
						},
						rules : {
							orgcode : {
								required : true
							},
							campus : {
								required : true,
							},
							simplename : {
								required : true,
							},
							domain : {
								isDomain : true
							},
						},
						messages : {
							orgcode : {
								required : '请填写学校名称'
							},
							campus : {
								required : '请填写校区'
							},
							simplename : {
								required : '请填写校区简称'
							},
							domain : {
								isDomain: "请输入一个合法的域名地址，weixiaotong.com域名请输入全拼并且不包含http://，如test.weixiaotong.com"
							},
						},
					});
			$("#saveSubmit").click(function() { // 点击保存按钮
				var isAgent = $("#isAgent").val();
				var confirmMsg = "是否确定保存?";
//				if($("#campus").val()==""){
//					return false;
//				}
				if(isAgent=="true"){
					confirmMsg="["+$("#campus").val()+"]园所归属["+ $("#orgcode").find("option:selected").text()+"]学校,保存后将无法更改归属,确认是否保存?"
				}
				if (confirm(confirmMsg)) {
					return true;
				}
				return false;
			});
			
			$("#province").change(function(){
				GHBB.prompt("数据保存中~");
				var url=ctx+"/base/findCityByProvince";
				var submitData = {
					dictcode: $("#province").val()
				}; 
				$.post(url,
					submitData,
			      	function(data){
					GHBB.hide();
						var datas = eval(data);
						$("#city option").remove();//user为要绑定的select，先清除数据   
				        for(var i=0;i<datas.length;i++){
				        		$("#city").append("<option value=" + datas[i].dictcode+" >"
					        			+ datas[i].dictname + "</option>");
				        	
				        };
				        $("#city").find("option[index='0']").attr("selected",'selected');
				        $("#city").trigger("chosen:updated");
				        
			    });
			});
			initWebUploader();
			initUploadLogo();
		});
// 校验校区名是否重复
function checkCampus() {
	if ($("#campus").val() == "") {
		return;
	}
	var a = true;
	jQuery.ajax({
		type : "get",
		url : ctx + "/xtgl/campus/checkCampus",
		async : false,
		cache : false,
		data : {
			campus : $("#campus").val(),
			id : $("#id").val(),
			method : "get"
		},
		dataType : "html",
		scriptCharset : "UTF-8",
		success : function(s) {
			if (s != "true") {
				a = false;
			}
		}
	});
	if (a != true) {
		pyjc = '该校区名已存在！';
		PromptBox.alert($("#campus").val() + pyjc);
		$("#campus").val('');
	}
}

//检查登录名
function checkloginName() {
	if ($("#defaultLoginName").val() == "") {
		return;
	}
	var a = true;
	jQuery.ajax({
		type : "get",
		url : ctx + "/xtgl/teacher/checkloginName",
		async : false,
		cache : false,
		data : {
			loginName : $("#defaultLoginName").val(),
			method : "get"
		},
		dataType : "html",
		scriptCharset : "UTF-8",
		success : function(s) {
			if (s != "true") {
				a = false;
			}
		}
	});
	if (a != true) {
		pyjc = '该用户名已经被占用！';
		PromptBox.alert($("#defaultLoginName").val() + pyjc);
		$("#defaultLoginName").val('');
	}
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
        $('#idimg').attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
		$("#imgpath").val(response.picUrl);
		$("#imgpath_a").attr("href",response.picUrl);
	    $('#idimg').attr( 'src', response.picUrl );
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


function initUploadLogo(){
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
	    	id :'#uploadLogo',
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
        $('#qrcodeurl_img').attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
//		$("#imgpath").val(response.picUrl);
		var picPath = getQRcode(response.picUrl);
		$("#qrcodeurl").val(picPath);
		$("#downloadLogo").attr("href",picPath);
		$("#qrcodeurl_upload").attr("href",picPath);
	    $('#qrcodeurl_img').attr( 'src', picPath);
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

function getQRcode(filePath){
	var id = $("#id").val();
	var url = commonUrl_ajax;
	var resultStr ;
	var submitData = {
			api: ApiParamUtil.COMMON_GETCODE_FROM_LOGO,
			param: JSON.stringify({
				id:id,
				filePath:filePath
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
				resultStr = result.data;
			}
		}
	});
	return resultStr;
}