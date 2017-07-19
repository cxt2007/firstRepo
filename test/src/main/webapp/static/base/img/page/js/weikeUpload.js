var ctx = $("#ctx").val();

$(document).ready(function() {
	loading_campus_list();
	
	$("#search_campus").change(function(){
		loading_knowledge_tree();
	});
	
	$("#search-btn").click(function() {
		loading_knowledge_tree();
	});
	
	$("#add-btn").click(function() {
		add_knowledge_info();
	});
	
	$("#delete-btn").click(function() {
		delete_knowledge_info();
	});
	
	$("#knowledge-save-btn").click(function() {
		save_knowledge_info();
	});
	
	$("#delete-btn").attr("disabled", "disabled");
	
	$("#wk_campus").change(function(){
		// 年级联动
		loading_grade_list();
		loading_course_list();
	});
	
	$("#wk_kc").change(function(){
		loading_knowledge_list();
	});
	
	$("#saveBtn").click(function() {
		saveWkInfo();
	});
	
	$("#wkFileToUpload").change(function() {
		var filepath = $("input[name='wkFileToUpload']").val();
		if (filepath == undefined || $.trim(filepath) == "") {
			alert("请选择上传文件！");
			return;
		} else {
			var fileArr = filepath.split("//");
			var fileTArr = fileArr[fileArr.length - 1].toLowerCase().split(".");
			var filetype = fileTArr[fileTArr.length - 1];
			
			var allowType = "[rmvb][avi][mp4]";// 允许上传的文件类型
			if (allowType.indexOf("[" + filetype.toLowerCase() + "]") == -1) {
				alert("文件类型不符合要求，请重新选择上传文件！");
				return;
			}
		}
		
		var maxsize = 30*1024*1024; //30M
		var errMsg = "上传文件的大小不能超过30M！";
		var tipMsg = "您的浏览器暂不支持计算上传文件的大小，请确保上传文件不要超过30M，建议使用IE、Chrome浏览器。";
		var  browserCfg = {};
		var ua = window.navigator.userAgent;
		if (ua.indexOf("MSIE")>=1) {
			browserCfg.ie = true;
		} else if (ua.indexOf("Firefox") >= 1) {
			browserCfg.firefox = true;
		} else if (ua.indexOf("Chrome") >= 1) {
			browserCfg.chrome = true;
		}
		
		var obj_file = document.getElementById("wkFileToUpload");
		var filesize = 0;
		if (browserCfg.firefox || browserCfg.chrome) {
			filesize = obj_file.files[0].size;
		} else if(browserCfg.ie) {
			var obj_img = document.getElementById("wkFileToUpload");
			obj_img.dynsrc = obj_file.value;
			filesize = obj_img.fileSize;
		} else {
			alert(tipMsg);
		}
		if (filesize == -1) {
			alert(tipMsg);
		} else if (filesize > maxsize) {
			alert(errMsg);
			return;
		}
		
		$("#stepDone").css("background","url(" + ctx + "/static/pixelcave/page/img/upload_bg.png) no-repeat 0 -190px");
		$("#stepDone").css("width","440px");
		$("#step1").css("color","#afafaf");
		$("#step2").css("color","#f60");
		$("#step3").css("color","#afafaf");
		$("#choseBox").css("display","none");
		$("#fillInfo").css("display","block");
		wkFileUpload();
	});
	initWebUploader();
});

function loading_campus_list() {
	GHBB.prompt("正在加载~");
	var param = {}
	var submitData = {
		api: ApiParamUtil.COMMON_QUERY_CAMPUS,
		param: JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		GHBB.hide();
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			$("#search_campus option").remove();
			$("#wk_campus option").remove();
			var datas = json.data;
			var campusList = datas.campusList;
			var campusTabHtml = '';
			var spanClass = 'active';
			for (var i = 0; i < campusList.length; i++) {
				$("#search_campus").append('<option value="'+campusList[i].id+'">'+campusList[i].value+'</option>');
				$("#wk_campus").append('<option value="'+campusList[i].id+'">'+campusList[i].value+'</option>');
			}
			$("#search_campus").trigger("chosen:updated");
			$("#wk_campus").trigger("chosen:updated");
			loading_knowledge_tree();
			
			// 年级联动
			loading_grade_list();
			loading_course_list();
			
		} else {
			PromptBox.alert(json.ret.msg);
		}
		
	});
}

function loading_knowledge_tree() {
	GHBB.prompt("正在加载~");
	var param = {
		campusid: $("#search_campus").val(),
		name: $("#search_name").val()
	}
	var submitData = {
		api: ApiParamUtil.APPID_WEIKE_KNOWLEDGE_TREE_QUERY,
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
			if(result.ret.code == "200") {
				$('#knowledgeList').tree({
					data: result.data.wkKnowledgeList,
					loadFilter: function(data){
						return convert(data);
				    },
					onClick: function(node){
						changeNode(node);
					}
				});
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
	
	clear_knowledge_info();
}

function loading_knowledge_list() {
	GHBB.prompt("正在加载~");
	var param = {
		campusid: $("#search_campus").val(),
		courseid: $("#wk_kc").val()
	}
	var submitData = {
		api: ApiParamUtil.APPID_WEIKE_KNOWLEDGE_LIST_QUERY,
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
			if(result.ret.code == "200") {
				$('#wk_knowledgeList').tree({
					data: result.data.nodeList,
					loadFilter: function(data){
						return convert(data);
				    },
					onClick: function(node){
						changeNode(node);
					}
				});
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
	
	$("#currentNodeId").val("");
	$("#currentNodeName").val("");
}

function convert(rows){
	function exists(rows, parentId){
		for(var i=0; i<rows.length; i++){
			if (rows[i].id == parentId) return true;
		}
		return false;
	}
	var nodes = [];
	// get the top level nodes
	for(var i=0; i<rows.length; i++){
		var row = rows[i];
		if (!exists(rows, row.parentid)){
			nodes.push({
				id:row.id,
				text:row.name
			});
		}
	}
	
	var toDo = [];
	for(var i=0; i<nodes.length; i++){
		toDo.push(nodes[i]);
	}
	while(toDo.length){
		var node = toDo.shift();	// the parent node
		// get the children nodes
		for(var i=0; i<rows.length; i++){
			var row = rows[i];
			if (row.parentid == node.id){
				var child = {id:row.id,text:row.name};
				if (node.children){
					node.children.push(child);
				} else {
					node.children = [child];
				}
				toDo.push(child);
			}
		}
	}
	return nodes;
}

/**
 * 知识点树点击事件
 * 
 * @param node
 */
function changeNode(node) {
	$("#currentNodeId").val(node.id);
	$("#currentNodeName").val(node.text);
	$("#knowledgeid").val(node.id);
	if ($("#currentNodeId").val().indexOf("courseid") > -1) {
		$('#delete-btn').attr("disabled", "disabled");
		$('#knowledge-save-btn').attr("disabled", "disabled");
		$('#knowledgeInfo').css('display',"none");
		$('#parentname').val(node.text);
		$("#courseid").val($("#currentNodeId").val().split("-")[1]);
		$("#level").val(2);
		$('#add-btn').removeAttr("disabled");
	} else {
		$('#delete-btn').removeAttr("disabled");
		$('#knowledgeInfo').css('display',"block");
		$('#knowledge-save-btn').removeAttr("disabled");
		$("#knowledge-save-btn").html("修改保存");
		loading_knowledge_info(node);
	}
}

function loading_knowledge_info(node) {
	GHBB.prompt("正在加载~");
	var param = {
		id: node.id
	}
	var submitData = {
		api: ApiParamUtil.APPID_WEIKE_KNOWLEDGE_QUERY,
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
			if(result.ret.code == "200") {
				$("#knowledgename").val(result.data.name);
				$("#parentname").val(result.data.parentname);
				$("#remarks").val(result.data.remark);
				$("#courseid").val(result.data.courseid);
				$("#level").val(result.data.level);
				if (result.data.level == 4) {
					$('#add-btn').attr("disabled", "disabled");
				} else {
					$('#add-btn').removeAttr("disabled");
				}
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function clear_knowledge_info() {
	$("#knowledgename").val("");
	$("#parentname").val("");
	$("#remarks").val("");
	$('#knowledge-save-btn').attr("disabled", "disabled");
	$("#knowledge-save-btn").html("新增保存");
	$('#add-btn').attr("disabled", "disabled");
}

function add_knowledge_info() {
	if ($("#currentNodeId").val() == '') {
		PromptBox.alert('请选中需要增加的知识点的父节点！');
		return;
	}
	$('#knowledgeInfo').css('display',"block");
	$("#knowledgeid").val("");
	$("#knowledgename").val("");
	$("#knowledge-save-btn").html("新增保存");
	$('#knowledge-save-btn').removeAttr("disabled", "disabled");
	
	$("#parentname").val($("#currentNodeName").val());
	$("#remarks").val('');
}

function delete_knowledge_info() {
	
	if ($("#currentNodeId").val() == '' || $("#currentNodeId").val().indexOf("courseid") > -1) {
		PromptBox.alert('请选中需要删除的知识点！');
		return;
	}
	if (confirm('确认删除“' + $("#currentNodeName").val() + '”知识点吗？')) {
		GHBB.prompt("数据保存中~");
		var param = {
			id: $("#currentNodeId").val()
		}
		var submitData = {
			api: ApiParamUtil.APPID_WEIKE_KNOWLEDGE_DELETE,
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
				if(result.ret.code == "200"){
					PromptBox.alert('知识点删除成功！');
					loading_knowledge_tree();
				} else if (result.ret.code == "400") {
					PromptBox.alert(result.ret.msg);
				} else {
					console.log(result.ret.code + ":" + result.ret.msg);
				}
			}
		});
	}
}

function save_knowledge_info() {
	GHBB.prompt("数据保存中~");
	var param;
	if ($("#knowledgeid").val() == "") {
		var levelnum = parseInt($("#level").val()) + 1;
		param = {
			id: "",
			name: $("#knowledgename").val(),
			remarks: $("#remarks").val(),
			userid: $("#main_userid").val(),
			campusid: $("#main_campusid").val(),
			parentid: $("#currentNodeId").val().indexOf("courseid") > -1 ? 0 : $("#currentNodeId").val(),
			courseid: $("#courseid").val(),
			level: levelnum
		};
	} else {
		param = {
			id: $("#knowledgeid").val(),
			name: $("#knowledgename").val(),
			remarks: $("#remarks").val(),
			userid: $("#main_userid").val()
		};
	}
	
	var submitData = {
		api: ApiParamUtil.APPID_WEIKE_KNOWLEDGE_SAVE,
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
			if(result.ret.code == "200"){
				PromptBox.alert('知识点保存成功！');
				loading_knowledge_tree();
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}




function loading_grade_list() {
	GHBB.prompt("正在加载~");
	var submitData = {
		api:ApiParamUtil.COMMON_QUERY_GRADE,
		param:JSON.stringify({
			campusid: $("#wk_campus").val(),
			userid: $("#main_userid").val()
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
			if (result.ret.code==="200") {
				$("#wk_nj option").remove();
				var njList = result.data.njList;
				for (var i = 0; i < njList.length; i++) {
					$("#wk_nj").append('<option value="'+njList[i].id+'">'+njList[i].njmc+'</option>');
				}
				$("#wk_nj").trigger("chosen:updated");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function loading_course_list() {
	GHBB.prompt("正在加载~");
	var submitData = {
		api:ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_LIST,
		param:JSON.stringify({
			campusid: $("#wk_campus").val(),
			userid: $("#main_userid").val()
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
			if (result.ret.code==="200") {
				$("#wk_kc option").remove();
				var courseList = result.data.courseList;
				for (var i = 0; i < courseList.length; i++) {
					$("#wk_kc").append('<option value="'+courseList[i].courseid+'">'+courseList[i].coursename+'</option>');
				}
				$("#wk_kc").trigger("chosen:updated");
				
				loading_knowledge_list();
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}


/**
 * 保存微课信息
 */
function saveWkInfo(){
	GHBB.prompt("数据保存中~");
	var i = Verification();
	if (i != "false") {
		$("#saveBtn1").css("display","none");
		$("#saveBtn2").css("display","block");
		
		var fileList = $("#fileList").find("div[class=fileItem]");
		var filenames = '';
		var fileurls = '';
		
		if(fileList.length > 0) {
			for (var j = 0; j < fileList.length; j++) {
				if(fileList.eq(j).find("span").attr("fileurl") != "" && fileList.eq(j).find("img").length == 0){
					filenames += fileList.eq(j).find("span").attr("filename") + "|";
					fileurls += fileList.eq(j).find("span").attr("fileurl") + "|";
				}
			}
			filenames = filenames.substring(0, filenames.length - 1);
			fileurls = fileurls.substring(0, fileurls.length - 1);
		}
		
		var param = {
			orgcode: $("#main_orgcode").val(),
			userid: $("#main_userid").val(),
			campusid: $("#main_campusid").val(),
			id: "",
			title: $("#wk_title").val(),
			filepath : $("#wk_filePath").val(),
			njid : $("#wk_nj").val(),
			courseid: $("#wk_kc").val(),
			knowledgeid: $("#currentNodeId").val(),
			content: $("#wk_content").val(),
			enclosurename: filenames,
			enclosurepath: fileurls
		};

		var submitData = {
			api: ApiParamUtil.APPID_WEIKE_MYWK_UPDATE,
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
				if(result.ret.code == "200"){
//					$("#wk_resourceid").val(data.resourceid);
					$("#wk-title-td").html($("#wk_title").val());
					$("#wk-content-td").html($("#wk_content").val());
					uploadFinshed();
				} else {
					console.log(result.ret.code + ":" + result.ret.msg);
				}
			}
		});
		
		
		
		
		
		
//		var url = "${ctx}/wk/wkupload!savaWkResource.action";
//	    var options = {   
//             url:url,   
//             type:'post',                    
//             data:null,
//               success:function(data){
//            	   eval( "data = " + data );
//					var dataVal1=eval(data);
//					if(data.state=="true"){
//						$("#wk_resourceid").val(data.resourceid);
//						$("#wk-title-td").html($("#wk_title").val());
//						$("#wk-content-td").html($("#wk_content").val());
//						uploadFinshed();
//					}else{
//						alert("文件未上传成功");
//					}
//             }   
//	    };
//		var form =$("form[name=wkGCForm]");
//		form.ajaxSubmit(options);
	}
}

/**
 * 验证数据是否正确
 */
function Verification() {
	if($("#wk_filePath").val()==""){
		alert("文件正在上传，请等待上传完成后保存！");
		return "false";
	}
	if($("#wk_title").val().length==0 || $("#wk_title").val().length>70){ 
		alert("标题不能为空，且标题不能超过70个字！");
		return "false";
	}
	if($("#wk_content").val().length==0 || $("#wk_content").val().length>500){ 
		alert("简介不能为空，且简介内容不能超过500个字！");
		return "false";
	}
	if($("#wk_nj").val().length==0){ 
		alert("年级必选！");
		return "false";
	}
	if($("#wk_kc").val().length==0){ 
		alert("学科必选！");
		return "false";
	}
	if($("#currentNodeId").val().length==0){ 
		alert("知识点目录必选！");
		return "false";
	}
}

var id = 0;            
function addressAction(){
	 $.get(
	   ctx + '/klxx/wlzy/getProgress',
	   function(data){
		   //alert(data);
		   //$("#pb1").progressBar(data.percent);
		   var dataVal=eval(data);
		   //$("#readedBytes").html(dataVal.percent);
		   if(dataVal.percent==1){
			   clearInterval(id);
			   $("#readedBytes").html(dataVal.pContentLengthch+"MB/"+dataVal.pContentLengthch+"MB");
			   $("#pMin").html(dataVal.pMin+"KB/S");
			   $("#pLeftMin").html(dataVal.pLeftMin+"KB/S");
			   $("#real").css("width","100%");
			   $("#real").html("100%(完成)");
			   $("#loadline-div").css("display","none");
			   $("#loadSuccess-div").css("display","block");
		   }else{
			   var  progressBarNum = parseInt( dataVal.percent*100);
			   $("#readedBytes").html(dataVal.pBytesReadch+"M/"+dataVal.pContentLengthch+"M");
			   $("#pMin").html(dataVal.pMin+"KB/S");
			   $("#pLeftMin").html(dataVal.pLeftMin+"");
			   $("#real").css("width",progressBarNum+"%");
			   $("#real").html(progressBarNum+"%");
		   }
		   
	   },
	   'json'          
	);
}

function wkFileUpload() {
	GHBB.prompt("数据保存中~");
	id = window.setInterval(addressAction,1000); 
	$.ajaxFileUpload({
		url: ctx + '/klxx/wlzy/wkUpload',//需要链接到服务器地址
		secureuri: false,
		fileElementId: 'wkFileToUpload',//文件选择框的id属性
		dataType: 'json',//服务器返回的格式，可以是json
		success: function (data){
			GHBB.hide();
			var dataVal=eval(data);
			if (dataVal.state=="false" ) {
				//alert("文件上传失败");
				$("#wk_filePath").val("123");
			} else {
				$("#wk_filePath").val(dataVal.filepath);
			}
			
		},
		error: function(data){
			//var dataVal=eval(data);
			alert("上传失败:"+data);
		}
	});
}

function uploadFinshed(){
	$("#stepDone").css("background","url(" + ctx + "/static/pixelcave/page/img/upload_bg.png) no-repeat 0 -240px");
	$("#stepDone").css("width","833px");
	$("#step1").css("color","#afafaf");
	$("#step2").css("color","#afafaf");
	$("#step3").css("color","#f60");
	$("#fillInfo").css("display","none");
	$("#loadSuccess-check-div").css("display","block");
	$("#complete").css("display","block");
}


function removeFile(obj) {
	$(obj).parent().remove();
}



$(document).ready(function() {
//	$("#stepDone").css("background","url(" + ctx + "/static/pixelcave/page/img/upload_bg.png) no-repeat 0 -190px");
//	$("#stepDone").css("width","440px");
//	$("#step1").css("color","#afafaf");
//	$("#step2").css("color","#f60");
//	$("#step3").css("color","#afafaf");
//	$("#choseBox").css("display","none");
//	$("#fillInfo").css("display","block");
	
	
	$("#continueBtn").click(function() {
		window.location.reload();
	});
	
	$("#MyWeiKe").click(function() {
		var title = '发布中的';
		window.location.href = ctx + '/base/func/80100?appid=1120';
	});
	
	
	$("#title").focus(function() {
		$("#title").keyup();
		showSpan($("#titleSpan"));
	});
	$("#title").blur(function() {
		hideSpan($("#titleSpan"));
	});
	$("#title").keyup(function() {
		spanChange($("#titleSpan"),80,$("#title").val().length);
	});
	$("#jtnr").focus(function() {
		$("#jtnr").keyup();
		showSpan($("#jtnrSpan"));
	});
	$("#jtnr").blur(function() {
		hideSpan($("#jtnrSpan"));
	});
	$("#jtnr").keyup(function() {
		spanChange($("#jtnrSpan"),500,$("#jtnr").val().length);
	});
});

function showSpan(obj){
	obj.css("display","block");
}

function hideSpan(obj){
	obj.css("display","none");
}

function spanChange(obj,num,nowNum){
	var str;
	if(num - nowNum >= 0){
		obj.css("color","#808080");
		str = "还可以输入"+ (num - nowNum) +"个字符";
	}else{
		obj.css("color","red");
		str = "已超出"+ (nowNum - num) +"个字符";
	}
	obj.html(str);
}

function initWebUploader(){
	// 初始化Web Uploader
	var uploader = WebUploader.create({
	    // 选完文件后，是否自动上传。
	    auto: true,
	    // swf文件路径
	    swf: ctx + '/static/js/webuploader/Uploader.swf',
	    // 文件接收服务端。
	    server: ctx+"/mobile/upload_image_by_app",
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    pick: '#filePicker'
	});
	
	// 当有文件添加进来的时候
	uploader.on( 'fileQueued', function( file ) {
		var fileItemList = $(".fileItem");
		if(fileItemList.length >= 3){
			alert("最多只能上传3个附件！");
			return;
		}
		if(file.size > 10485760){
			alert("附件大小不能超过10M！");
			return;
		}
	    var $li = $(
	            '<div id="'+file.id+'" class="fileItem">' +
	            	'<img>' +
//	    			'<span id="'+file.id+'" filename="'+file.name+'">'+file.name+'</span>' +
//	    			'<a onclick="removeFile(this)" class="btn btn-sm btn-alt btn-primary" data-toggle="tooltip" title="删除"><i class="fa fa-times"></i></a>' +
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
		var fileurl = {
			filetype : file.ext,
			url : response.data.fileurl
		};
	    $( '#'+file.id ).html(
    			'<span filename="'+file.name+'">'+file.name+'</span>' +
    			'<a onclick="removeFile(this)" class="btn btn-sm btn-alt btn-primary" data-toggle="tooltip" title="删除"><i class="fa fa-times"></i></a>'
	    );
	    $span = $( '#'+file.id ).find("span");
	    $span.attr("fileurl",JSON.stringify(fileurl));
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
