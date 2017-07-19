var ctx = "";
var TablesDatatables = function() {

	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document)
		.ready(
				function() {

					$("#resourceQuery")
							.click(
									function() {
										var a = document.getElementById("id").value
										var a = parseInt(a) - 1;
										var b = document
												.getElementById("firstid").value
										if (a != b) {
											location.href = ctx
													+ '/klxx/catagory/update/'
													+ parseInt(a) + "?"
													+ "search_EQ_firstId="
													+ $("#firstid").val()
													+ "&search_EQ_lastId="
													+ $("#lastid").val();
										} else {
											alert("已经到第一条");
										}
									});

					$("#exportFile").click(
							function() {
								var a = document.getElementById("id").value
								var a = parseInt(a) + parseInt(1);
								var b = document.getElementById("lastid").value
								var b = parseInt(b) + 1;
								if (a != b) {
									location.href = ctx
											+ '/klxx/catagory/update/'
											+ parseInt(a) + "?"
											+ "search_EQ_firstId="
											+ $("#firstid").val()
											+ "&search_EQ_lastId="
											+ $("#lastid").val();
								} else {
									alert("已经到最后一条");
								}
							});
				});
document.addEventListener('DOMContentLoaded', init, false);
function init() {
	var u = new UploadPic();
	u
			.init({
				input : document.querySelector('.input'),
				callback : function(base64) {
					document.querySelector('.bigImg').innerHTML = "<img id='srcImg' src='"
							+ base64 + "'>";
					document.querySelector('.previewImg').innerHTML = "<img id='previewImg' src='"
							+ base64 + "' style='width:100px;height:100px;'>";
					$("#bigImage").val(base64);
					popupDiv('pop-div');
					cutImage();
				},
				loading : function() {
					// document.querySelector('.imgzip').innerHTML =
					// '读取中，请稍候...';
				}
			});
}

function UploadPic() {
	this.sw = 0;
	this.sh = 0;
	this.tw = 0;
	this.th = 0;
	this.scale = 0;
	this.maxWidth = 0;
	this.maxHeight = 0;
	this.maxSize = 0;
	this.fileSize = 0;
	this.fileDate = null;
	this.fileType = '';
	this.fileName = '';
	this.input = null;
	this.canvas = null;
	this.mime = {};
	this.type = '';
	this.callback = function() {
	};
	this.loading = function() {
	};
}

UploadPic.prototype.init = function(options) {
	/*
	 * var xScroll = (document.documentElement.scrollWidth >
	 * document.documentElement.clientWidth) ?
	 * document.documentElement.scrollWidth :
	 * document.documentElement.scrollWidth;
	 */
	var xScroll = 600;
	this.maxWidth = options.maxWidth || xScroll;
	this.maxHeight = options.maxHeight || xScroll;

	this.maxSize = options.maxSize || 8 * 1024 * 1024;
	this.input = options.input;
	this.mime = {
		'png' : 'image/png',
		'jpg' : 'image/jpeg',
		'jpeg' : 'image/jpeg',
		'bmp' : 'image/bmp'
	};
	this.callback = options.callback || function() {
	};
	this.loading = options.loading || function() {
	};

	this._addEvent();
};

/**
 * @description 绑定事件
 * @param {Object}
 *            elm 元素
 * @param {Function}
 *            fn 绑定函数
 */
UploadPic.prototype._addEvent = function() {
	var _this = this;

	function tmpSelectFile(ev) {
		_this._handelSelectFile(ev);
	}

	this.input.addEventListener('change', tmpSelectFile, false);
};

/**
 * @description 绑定事件
 * @param {Object}
 *            elm 元素
 * @param {Function}
 *            fn 绑定函数
 */
UploadPic.prototype._handelSelectFile = function(ev) {
	var file = ev.target.files[0];

	// this.type = file.type;

	// 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题）
	if (!this.type) {
		this.type = this.mime[file.name.match(/\.([^\.]+)$/i)[1]];
	}

	if (!/image.(png|jpg|jpeg|bmp)/.test(this.type)) {
		alert('对不起，您选择的文件类型不是图片！');
		return;
	}

	if (file.size > this.maxSize) {
		alert('对不起，您选择的文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择！');
		return;
	}

	this.fileName = file.name;
	this.fileSize = file.size;
	this.fileType = this.type;
	this.fileDate = file.lastModifiedDate;

	this._readImage(file);
};

/**
 * @description 读取图片文件
 * @param {Object}
 *            image 图片文件
 */
UploadPic.prototype._readImage = function(file) {
	var _this = this;

	function tmpCreateImage(uri) {
		_this._createImage(uri);
	}

	this.loading();

	this._getURI(file, tmpCreateImage);
};

/**
 * @description 通过文件获得URI
 * @param {Object}
 *            file 文件
 * @param {Function}
 *            callback 回调函数，返回文件对应URI return {Bool} 返回false
 */
UploadPic.prototype._getURI = function(file, callback) {
	var reader = new FileReader();
	var _this = this;

	function tmpLoad() {
		// 头不带图片格式，需填写格式
		var re = /^data:base64,/;
		var ret = this.result + '';

		if (re.test(ret))
			ret = ret.replace(re, 'data:' + _this.mime[_this.fileType]
					+ ';base64,');

		callback && callback(ret);
	}

	reader.onload = tmpLoad;

	reader.readAsDataURL(file);

	return false;
};

/**
 * @description 创建图片
 * @param {Object}
 *            image 图片文件
 */
UploadPic.prototype._createImage = function(uri) {
	var img = new Image();
	var _this = this;

	function tmpLoad() {
		_this._drawImage(this);
	}

	img.onload = tmpLoad;

	img.src = uri;
};

/**
 * @description 创建Canvas将图片画至其中，并获得压缩后的文件
 * @param {Object}
 *            img 图片文件
 * @param {Number}
 *            width 图片最大宽度
 * @param {Number}
 *            height 图片最大高度
 * @param {Function}
 *            callback 回调函数，参数为图片base64编码 return {Object} 返回压缩后的图片
 */
UploadPic.prototype._drawImage = function(img, callback) {
	this.sw = img.width;
	this.sh = img.height;
	this.tw = img.width;
	this.th = img.height;

	this.scale = (this.tw / this.th).toFixed(2);

	this.sw = this.maxWidth;
	this.sh = Math.round(this.sw / this.scale);

	if (this.sh > this.maxHeight) {
		this.sh = this.maxHeight;
		this.sw = Math.round(this.sh * this.scale);
	}

	this.canvas = document.createElement('canvas');
	var ctx = this.canvas.getContext('2d');

	this.canvas.width = this.sw;
	this.canvas.height = this.sh;

	ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.sw, this.sh);

	this.callback(this.canvas.toDataURL(this.type));

	ctx.clearRect(0, 0, this.tw, this.th);
	this.canvas.width = 0;
	this.canvas.height = 0;
	this.canvas = null;
};

function popupDiv(div_id) {
	var div_obj = $("#" + div_id);
	var windowWidth = document.body.scrollWidth;
	var windowHeight = document.body.scrollHeight;
	var popupHeight = div_obj.height();
	var popupWidth = div_obj.width();

	// 添加并显示遮罩层
	$("<div id='mask'></div>").addClass("mask").width(windowWidth).height(
			windowHeight).click(function() {
		// hideDiv(div_id);
	}).appendTo("body").fadeIn(200);

	div_obj.css({
		"position" : "absolute"
	}).animate({
		left : windowWidth / 2 - popupWidth / 2,
		top : 0,
		opacity : "show"
	}, "slow");
}

function hideDiv(div_id) {
	document.querySelector('.input').value = "";
	$("#mask").remove();
	$("#" + div_id).animate({
		left : 0,
		top : 0,
		opacity : "hide"
	}, "slow");
}

// 裁剪图像
function cutImage() {
	$("#srcImg").Jcrop({
		aspectRatio : 1,
		onChange : showCoords,
		onSelect : showCoords,
		setSelect : [ 0, 0, 400, 400 ]
	});

	// 简单的事件处理程序，响应自onChange,onSelect事件，按照上面的Jcrop调用
	function showCoords(obj) {
		$("#x").val(obj.x);
		$("#y").val(obj.y);
		$("#w").val(obj.w);
		$("#h").val(obj.h);
		if (parseInt(obj.w) > 0) {
			// 计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
			var rx = 80 / obj.w;
			var ry = 80 / obj.h;

			// 通过比例值控制图片的样式与显示
			$("#previewImg").css({
				width : Math.round(rx * $("#srcImg").width()) + "px",
				height : Math.round(rx * $("#srcImg").height()) + "px",
				marginLeft : "-" + Math.round(rx * obj.x) + "px",
				marginTop : "-" + Math.round(ry * obj.y) + "px"
			});
		}
	}
}

function crop_submit() {
	$("#crop_form").submit();
}

function saveConfirm() {
	$(".popUpBox,.popUpBoxBg").show();
}

function saveImage() {
	var url = ctx + "/klxx/catagory/update";
	var submitData = {
		orgcode : $("#orgcode").val(),
		bigImage : $("#bigImage").val(),
		x : $("#x").val(),
		y : $("#y").val(),
		w : $("#w").val(),
		h : $("#h").val(),
		id : $("#id").val()
	};
	$.post(url, submitData, function(data) {
		hideDiv('pop-div');
		alert("封面更改成功！");
		location.reload();
	});
}