var ctx="";
var newParentNum = 2;
var nowParentID = "";

var TablesDatatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();
var deptIds = $("#deptIds").val();

var defineGrilImage = "http://jeff-ye-1978.qiniudn.com/girlteacher.jpg";
var defineBoyImage = "http://jeff-ye-1978.qiniudn.com/boyteacher.jpg";

$(document).ready(function() {
	
	$(".xsjbsex").change(function(){
		var $selectedvalue = $("input[name='xsjbsex']:checked").val();
		if($("#xsjbpicpath")[0].src==defineGrilImage||$("#xsjbpicpath")[0].src==defineBoyImage){
			if ($selectedvalue == 1) {
				$("#xsjbpicpath").attr('src',defineBoyImage); 
			} else {
				$("#xsjbpicpath").attr('src',defineGrilImage);
			}
		}
	});
	
	if($("#istrain").val()=='false'){
		getNjsjList();
	}else{
		$("#bjids").multiselect({
			selectedList : 5
		});
	}

	queryDeptList();
	$("#campusid").change(function() {
		queryDeptList();
	});

	$("#stuDept").change(function() {
		$("#deptIds").val($("#stuDept").val());
	});
	
	$("#saveSubmit").click(function() {	// 点击保存按钮
		$('#xsjb-form').validate({
	        errorClass: 'help-block animation-slideDown', 
	        errorElement: 'div',
	        errorPlacement: function(error, e) {
	            e.parents('.form-group > div').append(error);
	        },
	        highlight: function(e) {
	            $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
	            $(e).closest('.help-block').remove();
	        },
	        success: function(e) {
	            e.closest('.form-group').removeClass('has-success has-error');
	            e.closest('.help-block').remove();
	        },
	        rules: {
	        	bh: {
	                required: true
	            },
	            xm: {
	                required: true
	            },
	        },
	        messages: {
	        	bh: {
	                required: '请填写学生编号'
	            },
	            xm: {
	                required: '请填写学生姓名'
	            },
	        },
	    });
		
		
		var xm = $("#xsjbxm").val();
		if(xm == '' || xm == null ){
			alert("请输入学生姓名！");
			return false;
		}
		
		var campusid = $("#campusid").val();
		if(campusid == '' || campusid == null ){
			alert("请设置校区！");
			return false;
		}
		
		if(!$("#istrain")){
			var njid = $("#njid").val();
			if(njid == '' || njid == null ){
				alert("请设置年级！");
				return false;
			}
		}		
		
		var bjids = $("#bjids").val();
		if(bjids == '' || bjids == null ){
			alert("请设置班级！");
			return false;
		}		
		
		var remark = $("#remark").val();
		if(remark.length > 45){
			alert("备注不得超过45个字！");
			return false;
		}
		
		$("#picpath").val($("#xsjbpicpath")[0].src);
		$("#xm").val(xm);
		$("#birthday").val($("#xsjbbirthday").val());
		$("#xb").val($("input[name='xsjbsex']:checked").val());
		$("#campusid").attr("disabled",false);
	});
	
	$(".formBox_content ul.line li").mouseover(function(){
		$(this).find('.display_none').addClass('display_block');
		$(this).find('.display_none').removeClass('display_none');
	})
	
	$(".formBox_content ul.line li").mouseout(function(){
		$(this).find('.display_block').addClass('display_none');
		$(this).find('.display_block').removeClass('display_block');
	})
	
	$("#saveServiceSubmit").click(function(){
		
		var iconpathlist = getParentIconPath();
		var gxlist = getParentGx();
		var namelist= getParentName();
		var phonelist = getParentPhone();
		var xllist = getParentXl();
		var userids = getParentUserId();
		var mainParent = getMainParent();
		
		var campusid = $("#campusid").val();
		var orgcode = $("#orgcode").val();
		var rclxlist = "";
		var gzdwlist = getParentGzdw();
		if(orgcode == 10010){
			rclxlist = getParentRclx();
		}
		
		var nameArr=[];
		$("input[name=name_parent]").each(function(){
			nameArr.push($(this).val());
		});
		
		if(nameArr != null && nameArr.length){
			for(var i=0;i<nameArr.length;i++){
				if(nameArr[i] == ""){
					alert("请填写家长姓名！");
					return ;
				}
			}
		}
		
		var phoneArr=[];
		$("input[name=phone_parent]").each(function(){
			phoneArr.push($(this).val());
		});
		if(phoneArr != null && phoneArr.length){
			for(var i=0;i<phoneArr.length;i++){
				if(phoneArr[i] == ""){
					alert("请填写手机号！");
					return ;
				}
			}
		}
		
		var gxArr=[];
		$("select[name=gx_parent]").each(function(){
			gxArr.push($(this).val());
		});
		if(gxArr != null && gxArr.length){
			for(var i=0;i<gxArr.length;i++){
				for(var j=i+1;j<gxArr.length;j++){
					if(gxArr[i] == gxArr[j] && gxArr[i]!=7){
						alert("家长关系重复，请重新设置！");
						return ;
					}
				}
			}
		}
		
		var url=ctx+"/xtgl/xsjb/saveXsJzInfo";
		var submitData = {
				parent_iconpathlist : iconpathlist,
				parent_gxlist: gxlist,
				parent_namelist: namelist,
				parent_phonelist:phonelist,
				parent_xllist:xllist,
				parent_userids : userids,
				stuid:$("#id").val(),
				parent_orgcode:orgcode,
				parent_campusid:campusid,
				
				parent_rclxlist:rclxlist,
				parent_gzdwlist:gzdwlist,
				parent_mainparent:mainParent
		}; 
		 
		$.post(url,
			submitData,
	      	function(data){
				if(data == "warn"){
					alert("请先保存学生信息！");
				}else{
					setParentUserId(data);
					alert("保存成功！");
				}
				
	    });
		
	});
	
	initUploader();
});

function initUploader(){
	var filePickers = $("div[name='filePicker']");
	for ( var i = 0; i < filePickers.length; i++) {
		var filePicker = filePickers.eq(i);
		initWebUploader(filePicker.attr("id"));
	}
}

function getNjsjList(){
	if($("#ifby").val()==1){
		$("#njid").append("<option value=''>"
    			+ $("#by_njmc").val() + "</option>");
		$("#njid").attr("disabled",true);
		$("#bjids").append("<option value="+$("#xsjb_bjid").val()+" >"
    			+ $("#xsjb_bjmc").val() + "</option>");
		$("#bjids").attr("disabled",true);
		return;
	}
	var url=ctx+"/base/findNjsjList";
	var submitData = {
			campusid: $("#campusid").val()+""
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#njid option").remove();
			var selected_njid = "";
	        for(var i=0;i<datas.length;i++){
	        	if($("#xsjb_njid").val()==datas[i].id){
	        		selected_njid = datas[i].id; 
	        	}
	        	$("#njid").append("<option value=" + datas[i].id + ">"
	        			+ datas[i].njmc + "</option>");
	        };
	        
        	$('#njid').find("option[value='" + selected_njid + "']")
			.attr("selected", true);
        	$('#njid').trigger("chosen:updated");
	        
	        getBjsjList();
    });
}


function getBjsjList(){
	GHBB.prompt("正在加载~");
	var url=ctx+"/xtgl/bjsj/findBjsjByCampusidAndNjid";
	var submitData = {
		search_EQ_campusid: $("#campusid").val()+"",
		search_EQ_njid: $("#njid").val()+""
	}; 
	$.post(url,
		submitData,
      	function(data){
		GHBB.hide();
			var datas = eval(data);
			$("#bjids option").remove();//user为要绑定的select，先清除数据   
			var selected_bjid = "";
	        for(var i=0;i<datas.length;i++){
	        	if($("#xsjb_bjid").val()==datas[i].id){
	        		selected_bjid = datas[i].id;
	        	}
	        	
	        	$("#bjids").append("<option value=" + datas[i].id + " >"
	        			+ datas[i].bj + "</option>");
	        };
        	$('#bjids').find("option[value='" + selected_bjid + "']")
			.attr("selected", true);
        	$('#bjids').trigger("chosen:updated");
        	
    });
}

function uploadImgForStu() {
	var namedItem = "uploadfileinfo";
	var oData = new FormData(document.forms.namedItem(namedItem));
	oData.append("CustomField", "This is some extra data");
	var oReq = new XMLHttpRequest();
	oReq.open("POST",
			ctx+"/xtgl/xsjb/picupload?isAjax=true&resType=json", true);
	
	oReq.onload = function(oEvent) {
		if (oReq.status == 200 && oReq.responseText != '') {
			$("#xsjbpicpath").attr('src',oReq.responseText); 
			$("#picpath").val(oReq.responseText);
		} 
	};
	oReq.send(oData);
} ;

function uploadImg(userid,type) {
	if(userid == undefined || userid == ''){
		alert("家长信息有误！");
		return ;
	}
	var namedItem = "uploadfileinfo_"+type+"_"+userid;
	var oData = new FormData(document.forms.namedItem(namedItem));
	oData.append("CustomField", "This is some extra data");
	var oReq = new XMLHttpRequest();
	oReq.open("POST",
			ctx+"/xtgl/xsjb/picupload?isAjax=true&resType=json", true);
	
	oReq.onload = function(oEvent) {
		if (oReq.status == 200 && oReq.responseText != '') {
			$("#iconpath_"+type+"_"+userid).attr('src',oReq.responseText);
			$("#iconpath_value_"+type+"_"+userid).val(oReq.responseText);
		} 
	};
	oReq.send(oData);
} ;

function getAge(){
	var birthday = new Date(Date.parse($("#xsjbbirthday").val()));
	var currentDate = new Date();
	if(birthday>currentDate){
		alert("生日不能设置在当前日期之后!");
		$("#xsjbbirthday").val($("#default_birthday").val());
		return ;
	}
	var age =currentDate.getFullYear() - birthday.getFullYear();
	$("#age").html(age+'岁');
	
}

function addXsjz(){
	$("#xsjz_ul").append(fillNewXsjzCell());
	initWebUploader(nowParentID);
}

function fillNewXsjzCell(){
	nowParentID = "filePicker" + new Date().getTime();
	var newXsjzHtml = '<li>'
		 + '	<div class="formLine">'
		 + '		<input type="hidden" name="xsjz_id" value="0" /> '
		 + '		<div class="col-md-2 width_50">'
		 + '			<div class="parentHeader">'
		 + '				<input id="iconpath_value_add_'+newParentNum+'" name="iconpath" type="text" class="form-control" value="'+ctx + '/static/styles/mobile/images/gh_default_stu.jpg">'
		 + '				<form enctype="multipart/form-data" method="post" name="uploadfileinfo_add_'+newParentNum+'" style="position:relative;overflow:hidden;">'
		 + '					<img id="iconpath_add_'+newParentNum+'" alt="" src="'+ctx + '/static/styles/mobile/images/gh_default_stu.jpg">'
		 + '					<div id="'+nowParentID+'" name="filePicker"></div>'
		 + '				</form>'
		 + '			</div>'
		 + '		</div>'
		 + '		<div class="col-md-2 m_lr_10 width_100 m_tb_7">'
		 + '			<select name="gx_parent" class="form-control xsjb-info-col1" style="width: 120px;" >'
		 + $("#gx_list").html()
		 + ' 			</select>'
		 + ' 		</div>' 
		 + '		<div class="col-md-2 m_lr_10 width_100 m_tb_7">'
		 + ' 			<input name="name_parent" type="text" class="form-control" placeholder="家长姓名">'
		 + '		</div>'	
		 + '		<div class="col-md-2 width_100 m_tb_7">'
		 + '			<input name="phone_parent" type="tel" class="form-control" '
		 + '				placeholder="输入手机号" minlength="11" maxlength="11" >'
		 + ' 		</div>'
		 + ' 		<div class="col-md-2 m_lr_10 width_100 m_tb_7">'
		 + '			<select name="xl_parent" class="form-control xsjb-info-col1" data-placeholder="请选择学历" style="width: 120px;">'
		 + $("#xl_list").html()
		 + ' 			</select>'
		 + '		</div>'
		 + '			<div class="col-md-2 m_lr_10 width_100 m_tb_7">'
		 + '				<input name="gzdw_parent" type="text" class="form-control" placeholder="工作单位"> '
		 + '			</div>';
	if($("#orgcode").val() == 10010){// 中科院
		newXsjzHtml = newXsjzHtml 
		+ '			<div class="col-md-2 m_lr_10 width_100 m_tb_7">'	
		+ '				<select name="rclx_parent" class="form-control xsjb-info-col1" data-placeholder="请选择人才类型" style="width: 120px;">'
		+ 					$("#rclx_list").html()	
		+ '				</select> '
		+ ' 		</div>';	
	} 
	newXsjzHtml =  newXsjzHtml
		 + '		<div class="col-md-2 m_lr_10 width_50 m_tb_7">'
		 + ' 			<span class="center">未绑定</span>'
		 + ' 		</div>'
		 + '		<div class="col-md-2 m_lr_10 width_50 m_tb_7">'
		 + '			<span class="center xsjb-info-col4" onclick="javascript:parentRemove(this);">删除</span>'		
		 + ' 		</div>'
		 + '		<div class="cl"></div>'
		 + '	</div>'
		 + '</li>';
	newParentNum ++;
	return newXsjzHtml;
}

function getXsjzHtml(){
	var html= $("#gx_list").html();
	
	var gxList=[];
	$("select[name=gx_parent]").each(function(){
		gxList.push($(this).val());
	});

	for(var j=0;j<gxList.length;j++){
		if(xsjzList[i].dictcode == gxList[j]){
			break;
		}else{
			gxclass = " selected ";
		}
	}
	html = html + '<option value="'+xsjzList[i].dictcode+'" '+gxclass+' >'+xsjzList[i].dictname+'</option>';

//	alert(html);
	return html;
}


function parentRemove(obj){
	$(obj).parent().parent().parent().remove();
}

function setMainparent(obj){
	$(obj).parent().parents().find('.mainparent').html('');
	$(obj).parent().parents().find('.mainparent').removeClass('mainparent_true');
	$(obj).parent().parent().find('.mainparent').addClass('mainparent_true');
	$(obj).parent().parent().find('.mainparent').html('默认联系人');
}

function setXmpy(){
	var xm = $("#xsjbxm").val();
	var url=ctx+"/xtgl/xsjb/translateXmpy";
	var submitData = {
			xm: xm
	}; 
	$.post(url,
		submitData,
      	function(data){
			$("#xmpy").val(data);
	        
    });	
}

function getParentIconPath(){
	var iconpathArr = "";
	var iconpathList=[];
	$("input[name=iconpath]").each(function(){
		iconpathList.push($(this).val());
	});
	for(var i=0;i<iconpathList.length;i++){
		iconpathArr += iconpathList[i]+",";
	}
	return iconpathArr;
}

function getParentGx(){
	var gxArr = "";
	var gxList=[];
	$("select[name=gx_parent]").each(function(){
		gxList.push($(this).val());
	});
	for(var i=0;i<gxList.length;i++){
		gxArr += gxList[i]+",";
	}
	return gxArr;
}

function getParentName(){
	var nameArr = "";
	var nameList=[];
	$("input[name=name_parent]").each(function(){
		nameList.push($(this).val());
	});
	for(var i=0;i<nameList.length;i++){
		nameArr += nameList[i]+",";
	}
	return nameArr;
}

function getParentPhone(){
	var phoneArr = "";
	var phoneList=[];
	$("input[name=phone_parent]").each(function(){
		phoneList.push($(this).val());
	});
	for(var i=0;i<phoneList.length;i++){
		phoneArr += phoneList[i]+",";
	}
	return phoneArr;
}

function getParentXl(){
	var xlArr = "";
	var xlList=[];
	$("select[name=xl_parent]").each(function(){
		xlList.push($(this).val());
	});
	for(var i=0;i<xlList.length;i++){
		xlArr += xlList[i]+",";
	}
	return xlArr;
}

function getParentRclx(){
	var rclxArr = "";
	var rclxList=[];
	$("select[name=rclx_parent]").each(function(){
		rclxList.push($(this).val());
	});
	for(var i=0;i<rclxList.length;i++){
		rclxArr += rclxList[i]+",";
	}
	return rclxArr;
}

function getParentGzdw(){
	var gzdwArr = "";
	var gzdwList=[];
	$("input[name=gzdw_parent]").each(function(){
		gzdwList.push($(this).val());
	});
	for(var i=0;i<gzdwList.length;i++){
		gzdwArr += gzdwList[i]+",";
	}
	return gzdwArr;
}

function getParentUserId(){
	var userIdArr = "";
	var userIdList=[];
	$("input[name=xsjz_id]").each(function(){
		userIdList.push($(this).val());
	});
	for(var i=0;i<userIdList.length;i++){
		userIdArr += userIdList[i]+",";
	}
	return userIdArr;
}

function setParentUserId(parentUserIds){
	var userIdArr = "";
	var userIdList=[];
	if(parentUserIds!=null){
		var userIdList =parentUserIds.split(",");
		for(var i=0;i<userIdList.length;i++){
			$("input[name=xsjz_id]").eq(i).val(userIdList[i]);
		}
	}
	
	
}

function getMainParent(){
	return $('.mainparent_true').parents('.formLine').find("input[name=xsjz_id]").val();
}

var gxArr=[];
var currentValue="";

function checkXsjzGx(obj){
//	alert("checkXsjzGx-"+$(obj).val());
//	var xsGxList = getXsjzGxArr();
//	alert(gxArr);
//	alert(currentValue);
	if(gxArr != null && gxArr.length>0){
		for(var i=0;i<gxArr.length;i++){
			if(gxArr[i]==currentValue){
				alert("已存在该关系的用户，请重新设置！");
				$(obj).find("option[value='" + currentValue + "']").attr("selected", true);
				$(obj).trigger("chosen:updated");
			}
		}
	}
}

function getXsjzGxArr(obj){
	currentValue = $(obj).val();
	var xsGxList=[];
	$("select[name=gx_parent]").each(function(){
		xsGxList.push($(this).val());
	});
	gxArr =  xsGxList;
}

function queryDeptList(){
	var deptIdsArry = deptIds.split(",");
	var param = {
		campusid : $("#campusid").val().toString(),
		type : "1"
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_DEPTLIST_BY_TYPE,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			var stuDept = $("select[name=stuDept]");
			$("select[name=stuDept] option").remove();
			for (var i = 0; i < stuDept.length; i++) {
				for (var j = 0; j < result.data.length; j++) {
					var select = "";
					if($.inArray(result.data[j].id.toString(), deptIdsArry) != "-1"){
						select = "selected"
					}
					$("#stuDept").append('<option value="' + result.data[j].id + '" ' + select + '>'
							+ result.data[j].deptname + '</option>');
				}
				stuDept.eq(i).trigger("chosen:updated");
			}
		}
	});
}

function setBtnDisabled(){
	$("#saveSubmit").attr("disabled","disabled");
}

function initWebUploader(id){
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
	    	id :'#'+id,
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
        $('#'+id).parent().find("img").attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
		$('#'+id).parent().find("img").attr( 'src', response.picUrl );
		if(id != "filePicker"){
			$('#'+id).parent().parent().find("input[name='iconpath']").val(response.picUrl);
		}
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