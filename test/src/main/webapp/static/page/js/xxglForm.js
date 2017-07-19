var ctx = $("#ctx").val();
var appid = $("#appid").val();

$(document).ready(function() {
	getCountyTown('#countyTown');
	$("#campusName").focus();
	$("#province").change(function(){
		var url=ctx+"/base/findCityByProvince";
		var submitData = {
			dictcode: $("#province").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				var datas = eval(data);
				$("#city option").remove();//user为要绑定的select，先清除数据 
				$("#countyTown option").remove();
		        for(var i=0;i<datas.length;i++){
		        		$("#city").append("<option value=" + datas[i].dictcode+" >"
			        			+ datas[i].dictname + "</option>");
		        };
		        $("#city").find("option[index='0']").attr("selected",'selected');
		        $("#city").trigger("chosen:updated");
		        $("#countyTown").trigger("chosen:updated");
		        getCountyTown('#countyTown');
	    });
	});
	$("#city").change(function() {
		getCountyTown('#countyTown');
	});
	$("#orgcode").change(function(){
		var xx_type=$(this).find("option:selected").attr("valuexxtype");
		orgcodeSelect($(this).val(),xx_type);
	})
	
	$("#saveSubmit").click(function(){
		$('#xxgl-form').validate({

	    });
		
		var campusName = $("#campusName").val();
		if(campusName == '' || campusName == null ){
			PromptBox.alert("请输入校区名称！");
			return false;
		}
		
		var orgcode = $("#orgcode").val();
		if(orgcode == '' || orgcode == null ){
			PromptBox.alert("请选择公众帐号！");
			return false;
		}
		
		var superadmin = $("#superadmin").val();
		if(superadmin == '' || superadmin == null ){
			PromptBox.alert("请输入管理员！");
			return false;
		}
		
		if(superadmin.length>20){
			PromptBox.alert("管理员账号内容过长，限制20个字符！");
			return false;
		}
		
		if($('#keyModel').val() == 'true'){
			if($('#keycode_key').val() == '' || $('#keycode_key').val() == null ){
				PromptBox.alert("key不能为空！");
				return false;
			}
		}
		
		$("#auditstate").val("0");
		$("#campus").val($("#campusName").val());
		$("#simplename").val($("#campus_simplename").val());
		$("#imgpath").val($("#campusImgpath")[0].src);
		var payment = $('input[name="payment_radio"]:checked').val();
		$("#payment").val(payment);
	});
	
	$("#auditSubmit").click(function(){
		$('#xxgl-form').validate({

	    });
		
		var campusName = $("#campusName").val();
		if(campusName == '' || campusName == null ){
			PromptBox.alert("请输入校区名称！");
			return false;
		}
		
		var orgcode = $("#orgcode").val();
		if(orgcode == '' || orgcode == null ){
			PromptBox.alert("请选择公众帐号！");
			return false;
		}
		
		var superadmin = $("#superadmin").val();
		if(superadmin == '' || superadmin == null ){
			PromptBox.alert("请输入管理员！");
			return false;
		}
		
		if(superadmin.length>20){
			PromptBox.alert("管理员账号内容过长，限制20个字符！");
			return false;
		}
		if($('#keyModel').val() == 'true'){
			if($('#keycode_key').val() == '' || $('#keycode_key').val() == null ){
				PromptBox.alert("key不能为空！");
				return false;
			}
		}
		
		
		$("#auditstate").val("1");
		$("#campus").val($("#campusName").val());
		$("#simplename").val($("#campus_simplename").val());
		$("#imgpath").val($("#campusImgpath")[0].src);
		var payment = $('input[name="payment_radio"]:checked').val();
		$("#payment").val(payment);
		
	});
	
});

function validateCampus(auditstate){

}
function getCountyTown(node) {
	var msg = "没有选项！";
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.COMMON_QUERY_COUNTY_TOWN,
			param: JSON.stringify({
				cityId: $("#city").val()
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			$("#countyTown option").remove();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createCityList(result.data.countyTownList,msg,node);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
			$("#countyTown").trigger("chosen:updated");
		}
	});
}
function createCityList(dataData,msg,node){
	var dataList = new Array();
	for(var i=1;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].id+'">'+dataData[i].value+'</option>');
	}
	$(node).find("option[index='0']").attr("selected", 'selected');
	$(node).trigger("chosen:updated");
	$(node).html(dataList.join(''));
}
function checkloginName() {
	if ($("#superadmin").val() == "") {
		return;
	}
	var a = true;
	jQuery.ajax({
		type : "get",
		url : ctx + "/xtgl/teacher/checkloginName",
		async : false,
		cache : false,
		data : {
			loginName : $("#superadmin").val(),
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
		pyjc = '该用户名已经被占用！';
		PromptBox.alert($("#superadmin").val() + pyjc);
		$("#superadmin").val('');
	}
}

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
	GHBB.prompt("数据保存中~");
	var url = ctx + "/xtgl/teacher/uploadImage";
	var submitData = {
		orgcode : $("#orgcode").val(),
		bigImage : $("#bigImage").val(),
		x : $("#x").val(),
		y : $("#y").val(),
		w : $("#w").val(),
		h : $("#h").val(),
		id : $("#id").val()
	};
	if ($("#id").val() != "") {
		$.post(url, submitData, function(data) {
			GHBB.hide();
			hideDiv('pop-div');
			PromptBox.alert("照片更新成功！");
			location.reload();
		});
	} else {
		$.post(url, submitData, function(data) {
			GHBB.hide();
			hideDiv('pop-div');
			PromptBox.alert("照片上传成功！");
			$("#idimg").attr("src",data);
			$("#iconpath").attr("value",data);
		});
	}
	
}

function isShowRecevieDiv(){
	var roles = $("#roles").val();
	if(roles == "leader"){
		$("#isreceiveDiv").css("display", "block");
	}else{
		$('#isreceive').find("option[value='0']")
		.attr("selected", true);
		$('#isreceive').trigger("chosen:updated");
		$("#isreceiveDiv").css("display","none");
	}
}

function uploadImg() {
	var namedItem = "uploadfileinfo";
	var oData = new FormData(document.forms.namedItem(namedItem));
	oData.append("CustomField", "This is some extra data");
	var oReq = new XMLHttpRequest();
	oReq.open("POST",
			ctx+"/xtgl/xsjb/picupload?isAjax=true&resType=json", true);
	
	oReq.onload = function(oEvent) {
		if (oReq.status == 200 && oReq.responseText != '') {
			$("#campusImgpath").attr('src',oReq.responseText); 
		} 
	};
	oReq.send(oData);
};

function setBtnDisabled(){
	$("#saveSubmit,#auditSubmit").attr("disabled","disabled");
}

/**
 * 查询代理商关联key
 */
function getKeyList(orgcode){
	GHBB.prompt("正在加载~");
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.DLS_CAMPUS_KEY_LIST_QUERY,
			param: JSON.stringify({
				select_orgcode: orgcode
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createKeyList(result.data.keylist);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createKeyList(dataData){
	var node = "#keycode_key";
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].key+'" createtime="'+dataData[i].createtime+'">'+dataData[i].key+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
//		PromptBox.alert(msg);
	}else{
		$(node+" option").eq(0).attr("selected",true);
		//$(node).val(dataData[0].id);
	}
	$(node).trigger("chosen:updated");
}

/**
 * 选择校区
 * @param orgcode
 * @param xx_type
 */
function orgcodeSelect(orgcode,xx_type){
	if(($('#businessmodel').val() == 2 || xx_type==3) && ($('#id').val()==null || $('#id').val()=='')){
		//key模式代理商和培训机构,并且属于新增的时候，需要进行　key选择　并显示
		getKeyList(orgcode);
		$("#keycode_key_div").css("display","block");
		$('#keyModel').val('true');
	}else{
		$("#keycode_key_div").css("display","none");
		$('#keyModel').val('false');
	}
}

