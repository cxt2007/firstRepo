var ctx="";
var currentPage = 0;
var iDisplayLength = 12;
var TablesDatatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();

$(document).ready(function() {
	getSerchFormBjsjList();
	
	$("#xsjbQueryBtn").click(function() {	// 点击查询按钮
		currentPage = 0;
		generate_xsjb_table();
	});
	
	$("#user_camups_chosen").change(function() {
		currentPage = 0;
		getSerchFormBjsjList();
	});
	
	$("#user_bjid_chosen").change(function() {
		 currentPage = 0;
		 generate_xsjb_table();
	});
	
	$("#btn_export").click(function() {
		exportBindCode();
	});
	
	$("#xsids").click(function(){
		$("input[name='xsids']").prop("checked", $("#xsids").prop("checked"));
	});
	
	$("#delChecked").click(function (){
		delChecked();
	});
	
	$("#saveXsjz").click(function() {
		var username = $('#username').val();
		var phone = $('#phone').val();
		
		if(username == null || username==""){
			alert('请填写家长姓名');
			return ;
		}
		if(phone == null || phone==""){
			alert('请填写手机号');
			return ;
		}
		saveXsjz();
	});

});

function exportBindCode(){
	GHBB.prompt("数据导出中~");
	var campusid = $('#user_camups_chosen').val();
	var bjid = $('#user_bjid_chosen').val();
	var xmOrKh = $('#xmOrKh').val();
	var param = {
		campusid	: campusid,
		xmOrKh		: xmOrKh,
		bjid		: bjid,
		user_role:"teacher"
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_PRINT_SALT,
		param : JSON.stringify(param)
	};
	$.post(ctx+ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			window.location.href=ctx + result.data.saltpath;
		}else{
			alert(json.ret.msg);
		}
	});
}

function generate_xsjb_table(){
	var campusid = $('#user_camups_chosen').val();
	var bjid = $('#user_bjid_chosen').val();
	var xmOrKh = $('#xmOrKh').val();
	var iDisplayStart = currentPage * iDisplayLength;
	var url=ctx+"/xtgl/xszs/ajaxQueryXszs";
	var submitData = {
			xmOrKh			: xmOrKh,
			campusid		: campusid,
			bjid			: bjid,
			iDisplayStart	: iDisplayStart,
			iDisplayLength	: iDisplayLength
	};
	$.post(url,
		submitData,
      	function(data){
		var datas = eval('(' + data + ')');
		createViewBox(datas);
    });
}

function createViewBox(datas){
	var str = "";
	if(datas.total > 0){
		for (var i = 0; i < datas.xszsList.length; i++) {
			str += '<div class="viewBox">'
				+  '	<div class="l">'
				+  '		<div class="name" title="'+datas.xszsList[i].xm+'">'+datas.xszsList[i].xm+'</div>'
				+  '		<div class="infoes">'
				+  '			<span>'+datas.xszsList[i].xb+'</span>'
				+  '			<span>'+datas.xszsList[i].age+'岁</span>'
				+  '			<span name="'+datas.xszsList[i].bjid+'">'+datas.xszsList[i].bjmc+'</span>'
				+  '			<span>'+datas.xszsList[i].jzCount+'位家长</span>'
				+  '			<span title="密钥：'+datas.xszsList[i].salt+'" class="bg">'+datas.xszsList[i].bingding+'</span>'
//				+  '			<span class="bg">'+datas.xszsList[i].ispay+'</span>'
				+  '		</div>'
				+  '	</div>'
				+  '	<div class="r">'
				+  '		<form enctype="multipart/form-data" method="post" name="uploadfileinfo_'+datas.xszsList[i].id+'" style="position:relative;overflow:hidden;">'
				+  ' 			<img id="iconpath_'+datas.xszsList[i].id+'" alt="" src="'+checkQiniuUrl(datas.xszsList[i].picpath)+'" />'
				+  '			<div id="filePicker_'+datas.xszsList[i].id+'"></div>'
				+  '		</form>'		
				+  '	</div>'
				+  '</div>';
		}
	}else{
		str = '<div class="noData">未查询到数据</div>';
	}
	str += '<div class="cl"></div>';
	$("#viewList").html(str);
	for ( var i = 0; i < datas.xszsList.length; i++) {
		initWebUploader(datas.xszsList[i].id);
	}
	createPageList(datas.total);
}

function createPageList(total){
	var pageCount = Math.ceil(total/iDisplayLength);
	var pageRange = 5;
	var startPage = 0;
	var endPage = 0;
	if (pageCount < 5) {
		startPage = 1;
		endPage = pageCount;
	} else {
		startPage = (currentPage - 1) > 0 ? (currentPage - 1) : 1;
		endPage = startPage + (pageRange - 1);
		if (endPage > pageCount) {
			endPage = pageCount;
			startPage = endPage + 1 - pageRange;
		}
	}
	
	var li = '';
	if (startPage > 1) {
		li += '<li><a href="javascript:query_wlzy(0)">第一页</a></li>';
	}
	
	li += '<li><a href="javascript:previousQuery()"><i class="fa fa-angle-left"></i></a></li>';
	for (var i = startPage - 1; i < endPage; i++) {
		var active = "";
		if(i == currentPage){
			active = " class='active'";
		}else{
			active = '';
		}
		li += '<li'+active+'><a href="javascript:query_wlzy('+ (i) +')">'+ (i+1) +'</a></li>';
	}
	li += '<li><a href="javascript:nextQuery(' + pageCount + ')"><i class="fa fa-angle-right"></i></a></li>';
	if (endPage < pageCount) {
		li += '<li><a href="javascript:query_wlzy(' + (pageCount-1) + ')">最后一页</a></li>';
	}
	
	$("#pagination").html(li);
}

function query_wlzy(num){
	currentPage = num;
	generate_xsjb_table();
}

function previousQuery(){
	if(currentPage > 0){
		currentPage = currentPage - 1;
	}
	generate_xsjb_table();
}

function nextQuery(pageCount){
	if(currentPage < (pageCount - 1)){
		currentPage++;
	}
	generate_xsjb_table();
}

function getSerchFormBjsjList(){
	
	var url=ctx+"/base/findBjsjByCampusid";
	var submitData = {
		campusid: $("#user_camups_chosen").val()
	}; 
	var search_EQ_bjid =  $("#search_EQ_bjid").val();
	var selected;
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#user_bjid_chosen option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	if(search_EQ_bjid!=null && search_EQ_bjid!='' && search_EQ_bjid==datas[i][0]){
	        		$("#user_bjid_chosen").append("<option value=" + datas[i][0]+" selected >"
		        			+ datas[i][1] + "</option>");
	        	}else{
	        		$("#user_bjid_chosen").append("<option value=" + datas[i][0]+" >"
		        			+ datas[i][1] + "</option>");
	        	}
	        	
	        };
	        $("#user_bjid_chosen").find("option[index='0']").attr("selected",'selected');
	        $("#user_bjid_chosen").trigger("chosen:updated");
	        
	        generate_xsjb_table();
    });
}

function findXsjzByJzid(id){
	var url=ctx+"/xtgl/xsjb/findXsjzByJzid";
	var submitData = {
		id: id
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval("(" + data + ")");
			$('#jz_id').val(datas.id);
			$('#jz_orgcode').val(datas.orgcode);
			$('#jz_username').val(datas.name);
			
			$('#jz_gx').find("option[value='"+datas.gx+"']").attr("selected",true);
			$('#jz_gx').trigger("chosen:updated");
			
			$('#jz_phone').val(datas.phone);
			$('#jz_slaveuser').val(datas.slaveuser);
			if('10010' == datas.orgcode){
				$('#jz_gzdw').val(datas.gzdw);
				
				$('#jz_rclx').find("option[value='"+datas.rclx+"']").attr("selected",true);
				$('#jz_rclx').trigger("chosen:updated");
			}
    });
}

function initWebUploader(stuid){
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
	    	id :'#filePicker_'+stuid,
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
        $('#iconpath_'+stuid).attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
		updateHeader(stuid,response.picUrl);
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

function updateHeader(stuid,iconpath){
	var param = {
			stuid:stuid,
			iconpath:iconpath
		};
	var submitData = {
		api:ApiParamUtil.MY_STUDENT_UPLOAD_HEADER,
		param:JSON.stringify(param)
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				$('#iconpath_'+stuid).attr( 'src', iconpath);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}