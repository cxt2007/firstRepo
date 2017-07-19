var defaultPage=5;
var defaultPageHalf = parseInt(defaultPage/2);
var totalNum = 0;
var nowNum = 0;
var previewPicArr = new Array();
$(document).ready(function() {
	$(".xcbox").click(function() {
		intoXcDetail();
	});
	$(".nav-tabs").find("a").click(function() {
		changeSearch();
	});
	$(".img").mouseover(function() {
		showCheckBox(this);
		showEnlargeBtn(this);
	});
	$(".img").mouseout(function() {
		hideCheckBox(this);
		hideEnlargeBtn(this);
	});
	$(".checkBox").find("i").click(function() {
		checkPhoto(this);
	});
	$("#search-btn").click(function() {
		queryBbzp();
	});
	$("#deletePhoto_btn").click(function() {
		deleteFiles();
	});
	$("#addDescripBtn").click(function() {
		var checkFiles = $("i[check='yes']");
		if(checkFiles.length==0){
			PromptBox.alert("请至少选择一张照片！");
			return;
		}
		$('#modal-descrip').modal('show');
		$('#file_tag').tokenfield('enable');
		if(checkFiles.length===1){
			viewFile($(checkFiles[0]).attr("fileid"));
			$("#file_tag").val(checkFiles.attr("tag"));
			$('#file_tag').tokenfield('setTokens', checkFiles.attr("tag"));
		}else{
			$("#file_stuid").val('');
			$("#file_stuid").trigger("chosen:updated");
		}
	});
	$("#saveBbzp").click(function() {
		saveBbzp();
	});
	$("#updateFile").click(function() {
		updateTagAndRemark();
	});
	$("#school-chosen").change(function() {
		findBjandXsByCampusid(true);
		findBjByCampusid();
	});
	$("#school-chosen-add").change(function() {
		findBjandXsByCampusidAdd();
	});
	$("#bj-chosen-add").change(function() {// 查询
		getXsjbByBjid();
		queryBbzp();
	});
	$("#file_bjid").change(function() {// 查询
		getXsidByBjid($(this).val(),null);
	});
	$("#bj-chosen").change(function() {// 查询
		queryBbzp();
	});
	$("#closeBbzp").click(function() {// 查询
		deleteImage();
	});
	$("#closeTag").click(function() {// 查询
		deleteTag();
	});
	queryBbzp();
	initWebUploader();
	_initWebUploader();
});
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

function maxWidth(obj){
	obj.find("img").css("width","100%");
	obj.find("img").css("top","50%");
	obj.find("img").css("left","0");
	obj.find("img").css("margin-top",-obj.find("img").height()/2);
}

function maxHeight(obj){
	obj.find("img").css("height","100%");
	obj.find("img").css("top","0");
	obj.find("img").css("left","50%");
	obj.find("img").css("margin-left",-obj.find("img").width()/2);
}

function maxHeightAndWidth(obj){
	obj.find("img").css("top","0");
	obj.find("img").css("left","0");
	obj.find("img").css("height","100%");
	obj.find("img").css("width","100%");
}

var ctx = $("#ctx").val();

function showXcBox(){
	$("#xcList").css("display","block");
	$("#detailPhoto").css("display","none");
}

function intoXcDetail(){
	$("#xcList").css("display","none");
	$("#detailPhoto").css("display","block");
}

function changeSearch(){
	$(".tab-search").children().removeClass("active");
	var id = "";
	$(".tab-content").find(".tab-pane").each(function(){
		if($(this).hasClass("active")){
			id = $(this).attr("id");
		}
	});
	if(id != ""){
		id = id.split("-")[0] + "-search";
	}
	$("#"+id).addClass("active");
}

function showCheckBox(obj){
	$(obj).find(".checkBox").css("display","block");
	$(obj).find("i").css("display","block");
}

function hideCheckBox(obj){
	if($(obj).find(".checkBox").find("i").attr("check") != "yes"){
		$(obj).find(".checkBox").css("display","none");
		$(obj).find("i").css("display","none");
	}
}

function showEnlargeBtn(obj){
	$(obj).find(".enlargeBtn").css("display","block");
}

function hideEnlargeBtn(obj){
	$(obj).find(".enlargeBtn").css("display","none");
}

function checkPhoto(obj){
	if($(obj).attr("check") == undefined || $(obj).attr("check") == "" || $(obj).attr("check") == null || $(obj).attr("check") == "no"){
		$(obj).css("background","#32ad64");
		$(obj).css("background-image","url("+ctx+"/static/pixelcave/page/img/bbzp_checked.png)");
		$(obj).attr("check","yes");
	}else{
		$(obj).css("background","none");
		$(obj).attr("check","no");
	}
}

function deleteFiles(){
	var checkFiles = $("i[check='yes']");
	if(checkFiles.length==0){
		PromptBox.alert("请至少选择一张照片！");
		return;
	}
	if (confirm("确定删除?")) {
		GHBB.prompt("数据保存中~");
	var files = new Array();
	checkFiles.each(function(){
		files.push($(this).attr("fileid"));
	});
	var url=ctx+"/klxx/wlzy/deleteFiles";
	var submitData = {
		"search_fileids": files.toString(),
	}; 
	$.post(url,submitData,function(data){
		GHBB.hide();
		if(data=="success")
		checkFiles.each(function(){
			$(this).parents("li").remove();
		});
		queryBbzp();
    });
	}
}

/**
 * 查询宝宝作品
 */
function queryBbzp(){
	GHBB.prompt("正在加载~");
	var url=ctx+"/klxx/wlzy/queryBbzp";
	var submitData = {
		"search_campusid": $("#school-chosen").val(),
		"search_bjid":$("#bj-chosen").val().replace(/(^\s*)|(\s*$)|(\n*$)|(\t*$)/g, ""),
		"search_title":$("#title").val(),
		"search_xm":$("#search_name").val(),
		"search_pagenum":1
	};
	$.post(url,submitData,function(data){
		GHBB.hide();
		var datas = JSON.parse(data);
		if(datas.aaData.length==0){
			$(".photoList").html('<div style="width:100%;height:50px;line-height:100px;text-align:center;">未查询到数据</div>');
			$(".pagination").html("");
			return;
		}
		createBbzp(datas.aaData);
		createPages(datas.pageNum,datas.pageSize);
    });
}

/**
 * 创建分页页脚
 * @param pageNum
 * @param size
 */
function createPages(pageNum,size){
	var Pages= new Array();
	Pages.push('<li><a href="javascript:queryLastWlzyByPageNum('+pageNum+')"><i class="fa fa-angle-left"></i></a></li>');
	if(size<defaultPage){
		for(var i=1;i<size+1;i++){
			if(pageNum==i){
				Pages.push('<li class="active"><a href="javascript:queryBbzpByPage('+(i)+')">'+(i)+'</a></li>');
			}else{
				Pages.push('<li><a href="javascript:queryBbzpByPage('+(i)+')">'+(i)+'</a></li>');
			}
		}
	}else if(pageNum<defaultPage-defaultPageHalf){
		for(var i=1;i<defaultPage+1;i++){
			if(pageNum==i){
				Pages.push('<li class="active"><a href="javascript:queryBbzpByPage('+(i)+')">'+(i)+'</a></li>');
			}else{
				Pages.push('<li><a href="javascript:queryBbzpByPage('+(i)+')">'+(i)+'</a></li>');
			}
		}
	}else if(pageNum+defaultPageHalf>size){
		for(var i=size-defaultPage+1;i<size+1;i++){
			if(pageNum==i){
				Pages.push('<li class="active"><a href="javascript:queryBbzpByPage('+(i)+')">'+(i)+'</a></li>');
			}else{
				Pages.push('<li><a href="javascript:queryBbzpByPage('+(i)+')">'+(i)+'</a></li>');
			}
		}
	}else{
		for(var i=pageNum-defaultPageHalf;i<defaultPageHalf+pageNum+1;i++){
			if(pageNum==i){
				Pages.push('<li class="active"><a href="javascript:queryBbzpByPage('+(i)+')">'+(i)+'</a></li>');
			}else{
				Pages.push('<li><a href="javascript:queryBbzpByPage('+(i)+')">'+(i)+'</a></li>');
			}
		}
	}
	Pages.push('<li><a href="javascript:queryNextWlzyByPageNum('+pageNum+","+size+')"><i class="fa fa-angle-right"></i></a></li>');
	$(".pagination").html(Pages.join(""));
}

function queryNextWlzyByPageNum(page,total){
	if(page < total){
		queryBbzpByPage(page+1);
	}
}

function queryLastWlzyByPageNum(page){
	if(page > 1){
		queryBbzpByPage(page-1);
	}
}

function queryBbzpByPage(page){
	GHBB.prompt("正在加载~");
	var url=ctx+"/klxx/wlzy/queryBbzp";
	var submitData = {
		"search_campusid": $("#school-chosen").val(),
		"search_bjid":$("#bj-chosen").val().replace(/(^\s*)|(\s*$)|(\n*$)|(\t*$)/g, ""),
		"search_title":$("#title").val(),
		"search_xm":$("#search_name").val(),
		"search_pagenum":page
	}; 
	$.post(url,submitData,function(data){
		GHBB.hide();
		var datas = JSON.parse(data);
		if(datas.aaData.length==0){
			$(".photoList").html("");
			return;
		}
		createBbzp(datas.aaData);
		createPages(datas.pageNum,datas.pageSize);
		document.getElementById('allPhoto-tab'). scrollIntoView();
    });
}

/**
 * 创建宝宝作品列表
 * @param datas
 */
function createBbzp(datas){
	var photoList= new Array();
	photoList.push('<div class="monthList mfp-group"><div class="time">'+datas[0].publishdate.substring(0,10)+'</div><ul>');
	for(var i=0;i<datas.length;i++){
		if(i!=0 && i!= datas.length && datas[i].publishdate.substring(0,10) != datas[i-1].publishdate.substring(0,10)){
			photoList.push('<div class="cl"></div></ul></div><div class="monthList mfp-group"><div class="time">'+datas[i].publishdate.substring(0,10)+'</div><ul>');
		}
		photoList.push('<li><div class="img">'+
				'<div class="checkBox"><i bjid="'+datas[i].bjid+'" fileid="'+datas[i].fileid+'" publisherid="'+datas[i].publisherid+'" tag="'+datas[i].tag+'"></i></div>'+
				'<div class="enlargeBtn"></div>'+
				'<img alt="" src="'+checkQiniuUrl(datas[i].qiniufile)+'" /></div></li>');
	}
	photoList.push('<div class="cl"></div></ul></div>');
	$(".photoList").html(photoList.join(''));
	$(".img").mouseover(function() {
		showCheckBox(this);
		showEnlargeBtn(this);
	});
	$(".img").mouseout(function() {
		hideCheckBox(this);
		hideEnlargeBtn(this);
	});
	$(".checkBox").find("i").click(function() {
		checkPhoto(this);
	});
	$(".enlargeBtn").click(function(){
		previewPic(this);
	});
	initImgCss();
}

function previewPic(obj){
	previewPicArr.length = 0;
	var picList = $(obj).parents(".mfp-group").find("img");
	picList.each(function(){
		previewPicArr.push($(this).attr("src"));
	});
	nowNum = $.inArray($(obj).parent().find("img").attr("src"), previewPicArr);
	totalNum = picList.length;
	var $bg = $('<div class="mfp-bg mfp-ready"></div>');
	var $wrap = $('<div class="mfp-wrap mfp-gallery mfp-close-btn-in mfp-auto-cursor mfp-ready" style="overflow-x: hidden; overflow-y: auto;">'+
				  '		<div class="mfp-container mfp-s-ready mfp-image-holder">'+
				  '			<div class="mfp-content">'+
				  '				<div class="mfp-figure">'+
				  '					<button title="Close (Esc)" type="button" class="mfp-close" onclick="hidePreview();">×</button>'+
				  '					<figure>'+
				  '						<img class="mfp-img" src="'+previewPicArr[nowNum]+'">'+
				  '						<figcaption>'+
				  '							<div class="mfp-bottom-bar">'+
				  '								<div class="mfp-counter">'+
				  '									<span class="mfp-counter">'+(nowNum+1)+' of '+totalNum+'</span>'+
				  '								</div>'+
				  '							</div>'+
				  '						</figcaption>'+
				  '					</figure>'+
				  '				</div>'+
				  '			</div>'+
				  '			<div class="mfp-preloader">Loading...</div>'+
				  '			<button type="button" class="mfp-arrow mfp-arrow-left mfp-prevent-close" title="Previous" onclick="previous();"></button>'+
				  '			<button type="button" class="mfp-arrow mfp-arrow-right mfp-prevent-close" title="Next" onclick="next();"></button>'+
				  '		</div>'+
				  '</div>');
	$("body").prepend($bg);
	$("body").prepend($wrap);
	$(".mfp-img").css("max-height",$(window).height()+"px");
	window.onresize=function(){$(".mfp-img").css("max-height",$(window).height()+"px");};
}

function previous(){
	if(nowNum == 0){
		nowNum = totalNum -1;
	}else{
		nowNum--;
	}
	$(".mfp-img").attr("src",previewPicArr[nowNum]);
	$(".mfp-counter").html((nowNum+1) + ' of ' + totalNum);
}

function next(){
	if(nowNum == totalNum -1){
		nowNum = 0;
	}else{
		nowNum++;
	}
	$(".mfp-img").attr("src",previewPicArr[nowNum]);
	$(".mfp-counter").html((nowNum+1) + ' of ' + totalNum);
}

function hidePreview(){
	$(".mfp-bg").remove();
	$(".mfp-wrap").remove();
}

/**
 * 查询宝宝作品相册
 */
function queryBbzpXc(){
	GHBB.prompt("正在加载~");
	var url=ctx+"/klxx/wlzy/queryBbzpXc";
	var submitData = {
		"search_campusid": $("#school-chosen").val(),
		"search_bjid":$("#bj-chosen").val().replace(/(^\s*)|(\s*$)|(\n*$)|(\t*$)/g, ""),
		"search_title":$("#title").val()
	}; 
	$.post(url,submitData,function(data){
		GHBB.hide();
		var datas = JSON.parse(data);
		if(datas.length==0){
			$(".xcList").html("");
			return;
		}
		createBbzpXc(datas);
    });
}

/**
 * 创建宝宝作品相册列表
 * @param datas
 */
function createBbzpXc(datas){
	var photoList= new Array();
	for(var i=0;i<datas.length;i++){
		photoList.push('<div class="xcbox"><div class="img"><img alt="" src="'+checkQiniuUrl(datas[i].qiniufile)+'" /></div><div class="xcName"><span class="name">'+datas[i].title+'</span><span class="num">（'+datas[i].counts+'张）</span></div></div>');
	}
	photoList.push('<div class="cl"></div><div class="cl"></div>');
	$(".xcList").html(photoList.join(''));
	$(".xcbox").click(function() {
		intoXcDetail();
	});
}


function findBjandXsByCampusidAdd(){
	var url = ctx + "/klxx/wlzy/ajax_change_bj";
	var submitData = {
		campusid : $("#school-chosen-add").val()
	};
	$.post(url, submitData,
			function(data) {
				var datas = eval(data);
				$("#bj-chosen-add option").remove();// user为要绑定的select，先清除数据
				for ( var i = 0; i < datas.length; i++) {
					$("#bj-chosen-add").append(
							"<option value=" + datas[i].id
									+ ">" + datas[i].bj
									+ "</option>");
				}
				$("#bj-chosen-add option").eq(0).attr(
						"selected", true);
				$("#bj-chosen-add").trigger("chosen:updated");
				getXsjbByBjid();
				return false;
			});
}

function findBjandXsByCampusid(isQuery){
	var url=ctx+"/base/findBjsjByCampusid";
	var submitData = {
		campusid: $("#school-chosen").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#bj-chosen option").remove();// user为要绑定的select，先清除数据 
	        for(var i=0;i<datas.length;i++){
	        	
	        	$("#bj-chosen").append("<option value=" + datas[i][0] + " >"
	        			+ datas[i][1] + "</option>");
	        };
	        $("#bj-chosen option").find("option[index='0']").attr("selected",'selected');
	        $("#bj-chosen option").trigger("chosen:updated");
	        if(isQuery){
	        	queryBbzp();
	        }
    });
}

function findBjByCampusid(){
	var url=ctx+"/base/findBjsjByCampusid";
	var submitData = {
		campusid: $("#school-chosen").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#file_bjid option").remove();// user为要绑定的select，先清除数据 
	        for(var i=0;i<datas.length;i++){
	        	
	        	$("#file_bjid").append("<option value=" + datas[i][0] + " >"
	        			+ datas[i][1] + "</option>");
	        };
	        $("#file_bjid option").find("option[index='0']").attr("selected",'selected');
	        $("#file_bjid option").trigger("chosen:updated");
    });
}

function getXsjbByBjid(){
	var bjid = $("#bj-chosen-add").val();
	var url=ctx+"/xtgl/xsjb/ajax_queryJsonXsjbByBjid/"+bjid+"/0";
	var submitData = {
			bjid : bjid,
			stuids : 0
	};
	$.get(url,submitData,function(data){
		var datas = eval(data);
		$("#xcForm_stus option").remove();
		for (var i = 0; i < datas.length; i++) {
			$("#xcForm_stus").append("<option value=" + datas[i].id
					+ ">" + datas[i].xm
					+ "</option>");
		}
		$("#xcForm_stus").trigger("chosen:updated");
		return false;
	});
}

function removePhoto(obj){
	$(obj).parent().parent().remove();
}
function bbzpImageUpload(){
	$('#modal-addphoto').modal('show');
	$('#wlzy_tag').tokenfield('enable');
}
function deleteImage(){
	$("#fileList").html('<div id="filePicker"></div>');
	_initWebUploader();
	$("#profile-tweet").val('');
	$(".search-choice").remove();
	$("#wlzy_tag").val('');
	$("#xcForm_stus").val('');
	$(".token").remove();
	$('#wlzy_tag').tokenfield('disable');
	$("#xcForm_stus").trigger("chosen:updated");
}

function deleteTag(){
	$("#file_tag").val('');
	$('#file_tag').tokenfield('disable');
	$(".token").remove();
	$("#file_remark").val('');
	$(".search-choice").remove();
}
function bbzpImageTotal(photoBoxLimit){
	if($('.gallery-image').length>=30){
		PromptBox.alert("最多只能添加"+photoBoxLimit+"张照片！");
		return true;
	}
}

/**
 * 查询单张照片的信息
 */
function viewFile(fileid){
	var submitData = {
		fileid:fileid,
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: ctx + "/klxx/wlzy/viewFile",
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			$("#file_remark").val(result.aaData.content);
			$("#file_bjid").val($("i[check='yes']").attr("bjid"));
			$("#file_bjid option").trigger("chosen:updated");
			var stuidArray = result.aaData.stuids.split(",");
			getXsidByBjid($("i[check='yes']").attr("bjid"),stuidArray);
		}
	});
}

function getXsidByBjid(bjid,stuids){
	var url=ctx+"/xtgl/xsjb/ajax_queryJsonXsjbByBjid/"+bjid+"/0";
	var submitData = {
			bjid : bjid,
			stuids : 0
	};
	$.get(url,submitData,function(data){
		var datas = eval(data);
		$("#file_stuid option").remove();
		for (var i = 0; i < datas.length; i++) {
			$("#file_stuid").append("<option value=" + datas[i].id
					+ ">" + datas[i].xm
					+ "</option>");
		}
		$("#file_stuid").val(stuids);
		$("#file_stuid").trigger("chosen:updated");
		return false;
	});
}

/**
 * 修改标签、描述
 */
function updateTagAndRemark(){
	var checkFiles = $("i[check='yes']");
	if(checkFiles.length==0){
		PromptBox.alert("请至少选择一张照片！");
		return;
	}
	var files = new Array();
	checkFiles.each(function(){
		files.push($(this).attr("fileid"));
	});
	var stuid = -1;
	if($("#file_stuid").val()!==null){
		stuid = $("#file_stuid").val().toString();
	}
	if($("#file_tag").val().length>25){
		PromptBox.alert("标签字数小于25个字！");
		return;
	}
	GHBB.prompt("数据保存中~");
	var url=ctx+"/klxx/wlzy/updateFiles";
	var submitData = {
		"search_text":$("#file_remark").val(),
		"search_bjid":$("#file_bjid").val(),
		"search_tag":$("#file_tag").val(),
		"search_fileids": files.toString(),
		"search_stuids": stuid,
		"search_appid": $("#appid").val()
	};
	$.post(url,submitData,function(data){
		if(data=="success"){
			GHBB.hide();
			$('#modal-descrip').modal('hide');
			deleteTag();
			queryBbzp();
		}
    });
}

/**
 * 宝宝作品保存
 */
function saveBbzp(){
	var havePhoto = 0;
    var jsonArr = "{'json':[";
	var photoNum = 0;
	var commaNum = 0;
	var photoList = $("#fileList").find(".thumbnail");
	var photos = "";
	var fileids = "";
	if(photoList.length==0){
		PromptBox.alert("请至少上传一张照片！");
		return;
	}
	for (var j = 0; j < photoList.length; j++) {
		if(photoList.eq(j).find("img").attr("src") != "" && photoList.eq(j).find("img").attr("src") != ctx +"/static/js/images/loading1.gif"){
			havePhoto = 1;
		}
		if(photoList.eq(j).find("img").attr("src") != ctx +"/static/js/images/loading1.gif"){
			photos += photoList.eq(j).find("img").attr("src") + ",";
			fileids += photoList.eq(j).find("img").attr("id") + ",";
		}
	}
	photoNum += photoList.length;
	commaNum += photos.match(/(,)/g).length;
	if(photos.length > 0){
		photos = photos.substring(0,photos.length - 1);
	}
	if(fileids.length > 0){
		fileids = fileids.substring(0,photos.length - 1);
	}
	var stuid = -1;
	if($("#xcForm_stus").val()!==null){
		stuid = $("#xcForm_stus").val().toString();
	}
	if($("#wlzy_tag").val().length>25){
		PromptBox.alert("标签字数小于25个字！");
		return;
	}
	var prompt = "确定保存?";
	if (confirm(prompt)) {
		GHBB.prompt("数据保存中~");
		var url=ctx+"/klxx/wlzy/saveBbzp";
		var submitData = {
				"search_text":$("#profile-tweet").val(),
				"search_tag":$("#wlzy_tag").val(),
				"appid":$("#appid").val(),
				"search_photos":photos,
				"search_campusid":$("#school-chosen-add").val(),
				"search_bjid":$("#bj-chosen-add").val(),
				"search_stuid":stuid
		};
		$.post(url,submitData,function(data){
			if(data == "success"){
				GHBB.hide();
				queryBbzp();
				deleteImage();
				$('#modal-addphoto').modal('hide');
			}
	    });
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
	    pick: '#addPageBtn_image',
	    // 只允许选择图片文件。
	    accept: {
	        title: 'Images',
	        extensions: 'gif,jpg,jpeg,bmp,png',
	        mimeTypes: 'image/*'
	    }
	});
	
	// 当有文件添加进来的时候
	uploader.on( 'fileQueued', function( file ) {
		$('#modal-addphoto').modal('show');
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
	    $('#wlzy_tag').tokenfield('enable');
	    $img.attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
	    $img = $( '#'+file.id ).find("img");
	    $img.attr("src",response.picUrl);
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

function _initWebUploader(){
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
	    pick: '#filePicker'
	});
	
	// 当有文件添加进来的时候
	uploader.on( 'fileQueued', function( file ) {
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
	    $img.attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
	    $img = $( '#'+file.id ).find("img");
	    $img.attr("src",response.picUrl);
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