var appid = $("#appid").val();
var boxWidth = 600;
var imgBoxMaxWidth = 600;
var boxHeight = 100;
var temporaryJcrop;
//创建变量保持API和图片大小
var jcrop_api,boundx,boundy,
// 抓取预览窗格中的一些信息
$preview = $('#preview-pane'),
$small_pcnt = $('#preview-pane .preview-container'),
$small_pimg = $('#preview-pane .preview-container img'),
$big_pcnt = $('#preview-big .preview-container'),
$big_pimg = $('#preview-big .preview-container img'),
// 设置预览图片宽高比
small_xsize = $small_pcnt.width();
$small_pcnt.height($small_pcnt.width()/4);
var small_ysize = $small_pcnt.height();
$(".preview_adBox").height($(".previewTitle").height()+$small_pcnt.height());
big_xsize = $big_pcnt.width();
$big_pcnt.height($big_pcnt.width()/4);
var big_ysize = $big_pcnt.height();
var newPicpath;

$(document).ready(function() {
	$("#submit_send").click(function() {
		saveAdInfo("2");
	});
	$("#submit_save").click(function() {
		saveAdInfo("3");
	});
	$("#content").keyup(function() {
		changePreviewTitle();
	});
	$("#savePic").click(function() {
		saveImage();
	});
	getAdInfo();
});

function saveAdInfo(state){
	GHBB.prompt("数据保存中~");
	var adImgPath = $("#adImgPath").attr("src");
	var title = $("#title").val();
	var content = $("#content").val();
	if(title == null || title == ""){
		PromptBox.alert("请输入广告标题！");
		return false;
	}
	if(adImgPath == null || adImgPath == ""){
		PromptBox.alert("请添加图片！");
		return false;
	}
	if(content == null || content == ""){
		PromptBox.alert("请添加描述！");
		return false;
	}
	var submitData = {
		api:ApiParamUtil.DLS_DLS_AD_SAVE,
		param:JSON.stringify({
			id:$("#adId").val(),
			adurl:$("#adurl").val(),
			content:content,
			picpath:adImgPath,
			newPicpath:newPicpath,
			x1: $('#x1').val(),
			y1: $('#y1').val(),
		    x2: $('#x2').val(),
		    y2: $('#y2').val(),
		    w: $('#w').val(),
		    h: $('#h').val(),
		    sw: boxWidth,
		    sh: boxHeight,
			state:state,
			title:title
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				alert("保存成功");
				window.location.href = main_ctx + "/base/func/61003?appid="+appid;
				return false;
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function getAdInfo(){
	if($("#adId").val() != null && $("#adId").val() != ""){
		var adurl = $("#adurl").val();
		var title = $("#title").val();
		var submitData = {
			api:ApiParamUtil.DLS_AD_ONE_QUERY,
			param:JSON.stringify({
				id:$("#adId").val()
			})
		};
		$.ajax({
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas){
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					setAdInfo(result.data);
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}
}

function setAdInfo(adInfo){
	if(adInfo != null){
		$("#adurl").val(adInfo.adurl);
		$("#title").val(adInfo.title);
		$("#previewTitle").html(adInfo.content);
		$("#content").val(adInfo.content);
		$("#adImgPath").attr("src",adInfo.picpath);
		$("#ad_img_show").attr('src',adInfo.picpath);
	}
}

function showCutBox(){
	fileSelectHandler();
	$('#modal-pic-cut').modal('show');
}

function updatePreview(c){
	updateInfo(c);
    if (parseInt(c.w) > 0) {
      var small_rx = small_xsize / c.w;
      var small_ry = small_ysize / c.h;
      $small_pimg.css({
        width: Math.round(small_rx * boundx) + 'px',
        height: Math.round(small_ry * boundy) + 'px',
        marginLeft: '-' + Math.round(small_rx * c.x) + 'px',
        marginTop: '-' + Math.round(small_ry * c.y) + 'px'
      });
      var big_rx = big_xsize / c.w;
      var big_ry = big_ysize / c.h;
      $big_pimg.css({
        width: Math.round(big_rx * boundx) + 'px',
        height: Math.round(big_ry * boundy) + 'px',
        marginLeft: '-' + Math.round(big_rx * c.x) + 'px',
        marginTop: '-' + Math.round(big_ry * c.y) + 'px'
      });
    }
};

function fileSelectHandler() {

    // get selected file
    var oFile = $('#uploadFile')[0].files[0];

    // hide all errors
    $('.error').hide();

    // check for image type (jpg and png are allowed)
    var rFilter = /^(image\/jpeg|image\/png)$/i;
    if (! rFilter.test(oFile.type)) {
    	PromptBox.alert('请上传图片，格式支持jpg,png！').show();
        return;
    }

    // check for file size
    if (oFile.size > 1000 * 1024) {
    	PromptBox.alert('图片最大不能超过1M！').show();
        return;
    }

    // preview element
    var oImage = document.getElementById('preview');

    // prepare HTML5 FileReader
    var oReader = new FileReader();
        oReader.onload = function(e) {

        // e.target.result contains the DataURL which we can use as a source of the image
        oImage.src = e.target.result;
        oImage.onload = function () { // onload event handler

            // display step 2
            $('.cutBox').fadeIn(500);

            // display some basic image info
            var sResultFileSize = bytesToSize(oFile.size);
            $('#filesize').val(sResultFileSize);
            $('#filetype').val(oFile.type);
            $('#filedim').val(oImage.naturalWidth + ' x ' + oImage.naturalHeight);
            boxWidth = oImage.naturalWidth>imgBoxMaxWidth? imgBoxMaxWidth:oImage.naturalWidth;
            boxHeight = boxWidth*oImage.naturalHeight/oImage.naturalWidth;
            // Create variables (in this scope) to hold the Jcrop API and image size
           // var jcrop_api, boundx, boundy;

            // destroy Jcrop if it is existed
            if (typeof jcrop_api != 'undefined') 
                jcrop_api.destroy();

            // initialize Jcrop
            $('#preview').Jcrop({
                minSize: [32, 32], // min crop size
                aspectRatio : 4, // keep aspect ratio 1:1
                bgFade: true, // use fade effect
                bgOpacity: .3, // fade opacity
                onChange: setTemporaryJcrop,
                onSelect: setTemporaryJcrop,
                boxWidth: imgBoxMaxWidth,
                setSelect: [ 0, 0, boxWidth, boxWidth/4 ],
                onRelease: clearInfo
            }, function(){

                // use the Jcrop API to get the real image size
                var bounds = this.getBounds();
                boundx = bounds[0];
                boundy = bounds[1];

                // Store the Jcrop API in the jcrop_api variable
                jcrop_api = this;
            });
        };
    };

    // read selected file as DataURL
    oReader.readAsDataURL(oFile);
    $("#uploadFile").val('');
}

//convert bytes into friendly format
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

//check for selected crop region
function checkForm() {
    if (parseInt($('#w').val())) return true;
    $('.error').html('Please select a crop region and then press Upload').show();
    return false;
};

//update info by cropping (onChange and onSelect events handler)
function updateInfo(e) {
    $('#x1').val(e.x);
    $('#y1').val(e.y);
    $('#x2').val(e.x2);
    $('#y2').val(e.y2);
    $('#w').val(e.w);
    $('#h').val(e.h);
};

//clear info by cropping (onRelease event handler)
function clearInfo() {
    $('.info #w').val('');
    $('.info #h').val('');
};

function saveImage() {
	updatePreview(temporaryJcrop);
	$("#adImgPath").attr('src',$("#preview").attr('src'));
	$("#ad_img_show").attr('src',$("#preview").attr('src'));
	newPicpath = $("#preview").attr('src');
	$("#remind").hide();
	$('#modal-pic-cut').modal('hide');
	$('#uploadFile')[0].files[0]=null;
}

function setTemporaryJcrop(c){
	temporaryJcrop = c;
}



function changePreviewTitle(){
	$("#previewTitle").html($("#content").val());
}