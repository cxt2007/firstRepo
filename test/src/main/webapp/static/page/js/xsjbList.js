var ctx="";
var TablesDatatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();

$(document).ready(function() {
	generate_xsjb_table();
	getSerchFormBjsjList();
	
	$("#xsjbQueryBtn").click(function() {	// 点击查询按钮
		generate_xsjb_table();
	});
	
	$("#user_camups_chosen").change(function() {
		getSerchFormBjsjList();
	});
	
	$("#ifby").change(function() {
		if($("#ifby").val()==1){
			$("#setDept").css("display","none");
		}else if($("#ifby").val()==0){
			$("#setDept").css("display","true");
		}
		
		getSerchFormBjsjList();
	});
	
	$("#user_bjid_chosen").change(function() {
		 generate_xsjb_table();
	});
	
	$("#stu_binding_chosen").change(function() {
		 generate_xsjb_table();
	});
	
	$("#exportFile").click(function() {
		expectXsjb();
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
	
	$("#saveXsjb").click(function() {
		$("#saveXsjb").attr("disabled", true); 
		if($("#serialnumber_xsjb").val() == undefined || $("#serialnumber_xsjb").val() == "" && $("#serialnumber_xsjb").val() == null){
			alert("导入数据存在错误，请检查后重新导入！");
			$("#saveXsjb").attr("disabled", false); 
			return;
		}
		displaySaveBtn(0);
		if($("#import_insert_or_update").val()==1){
			var url= ctx+"/xtgl/initdata/xsjbInfoAddBatch";
			var submitData = {
				serialnumber: $("#serialnumber_xsjb").val()
			}; 
			$.post(url,
				submitData,
		      	function(data){
					alert(data);
					$("#xsjbImportInfo").html("");
					$("#saveXsjb").attr("disabled", false); 
					$('#importXsjbModal').modal('hide');
					generate_xsjb_table();
		      });
			return false;
		}else if($("#import_insert_or_update").val()==2){
			var param = {
					serialnumber: $("#serialnumber_xsjb").val(),
					campusid:$("#import_campusid").val()
				};
			var submitData = {
				api : ApiParamUtil.STU_MANAGE_BATCH_UPDATE,
				param : JSON.stringify(param)
			};
			$.post(commonUrl_ajax, submitData, function(data) {
				var json = typeof data === "object" ? data : JSON.parse(data);
				if (json.ret.code == 200) {
					PromptBox.alert(json.ret.msg);
					$("#xsjbImportInfo").html("");
					$("#saveXsjb").attr("disabled", false); 
					$('#importXsjbModal').modal('hide');
					generate_xsjb_table();
				} else {
					PromptBox.alert(json.ret.msg);
				}
				return false;
			});
		}		
	});
	
	$("#printSalt").click(function (){
		printSalt();
	});

	$("#setDept").click(function (){
		if(!checkChecked()){
			return;
		}
		queryDeptList();
		$('#setDeptModal').modal('show');
	});

	$("#saveDept").click(function (){
		saveDept();
	});
});

function addXsjzInfo(id,xm,count){
	$('#new_title').html("新增学生 "+ xm + " 的家长信息");
	$('#xsjb_id').val(id);
	$('#xsjz_count').val(count);
	$('#username').val(''),
	$('#xb').val(1),
	$('#gx').val(1),
	$('#phone').val(''),
	$('#modal-new-xsjz').modal('show');
}

function saveXsjz(){
	GHBB.prompt("数据保存中~");
	var id = $('#xsjb_id').val();
	var url=ctx+"/xtgl/xsjb/saveXsjz/"+id;
	
	var gzdw = $('#gzdw').val();
	var rclx = $('#rclx').val();
	
	var submitData = {
			stuid:$('#xsjb_id').val(),
			username:$('#username').val(),
			xb:$('#xb').val(),
			gx:$('#gx').val(),
			phone:$('#phone').val(),
			gzdw:gzdw,
			rclx:rclx
	}; 
				
	$.post(url,
		submitData,
      	function(data){
		if(data==1){
			GHBB.hide();
			var xsjzID = "jz_count" + id;
			$("#"+xsjzID).html((parseInt($("#"+xsjzID).html())+1));
			$('#modal-new-xsjz').modal('hide');
			alert("保存成功！");
			generate_xsjb_table();
		}else{
			alert(data);
		}	
    });
}


function updateXsjz(){
	GHBB.prompt("数据保存中~");
	var id = $('#jz_id').val();
	var orgcode = $('#jz_orgcode').val(); 
	var url=ctx+"/xtgl/xsjb/updateXsjz/"+id;
	
	var gzdw = "";
	var rclx = "";
	if(orgcode == '10010'){
		gzdw = $('#jz_gzdw').val();
		rclx = $('#jz_rclx').val();
	}
	var submitData = {
			stuid:$('#jz_id').val(),
			username:$('#jz_username').val(),
			gx:$('#jz_gx').val(),
			phone:$('#jz_phone').val(),
			slaveuser:$('#jz_slaveuser').val(),
			gzdw:gzdw,
			rclx:rclx
	}; 		
	alert(url);
	$.post(url,
		submitData,
      	function(data){
			if(data == '1'){
				GHBB.hide();
				alert("修改成功！");
				$('#modal-add-xsjz').modal('hide');
				generate_xsjb_table();
			}else{
				alert(data);
			}
			
			
    });
}

function deleteJzByJzid(){
	if(confirm("确定删除该学生家长?")){
		var id = $('#jz_id').val();
		var name = $('#jz_username').val(); 
		var xsjb_id = $('#xsjb_id').val();
		var xsjb_xm = $('#xsjb_xm').val();
		var url=ctx+"/xtgl/xsjb/deleteXsjz";
		var submitData = {
				id		: 	id,
				stuid	:	xsjb_id
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					alert("删除成功!");
					var xsjzID = "jz_count" + xsjb_id;
					$("#"+xsjzID).html((parseInt($("#"+xsjzID).html())-1));
					queryXsjzInfo(xsjb_id,xsjb_xm);
					generate_xsjb_table();
					return false;
				}else{
					alert(data);
				}
	      });
	}		
}

function generate_xsjb_table(){
	GHBB.prompt("正在加载~");
	var rownum=1;
	App.datatables();
	/* Initialize Datatables */
	var sAjaxSource=ctx+"/xtgl/xsjb/ajax_findXsjbInfo";
	var param = "search_EQ_campusid="+$("#user_camups_chosen").val();
    param=param+"&search_EQ_bjid="+$("#user_bjid_chosen").val();
    param=param+"&search_LIKE_xm="+$("#user_xm").val();
	param=param+"&search_ifby="+$("#ifby").val();
	param=param+"&search_ifbind="+$("#stu_binding_chosen").val();
    sAjaxSource=sAjaxSource+"?"+param;//调用后台携带参数路径
	var aoColumns= [
						{ "sWidth": "70px", "sClass": "text-center","mDataProp": "id"},
    					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "picpath"},
    					{ "sWidth": "150px", "mDataProp": "xm"},
    					{ "sWidth": "70px", "sClass": "text-center","mDataProp": "xb"},
    					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "birthday"},
    					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "bjid_ch"},
    					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "rxny"},
    					{ "sWidth": "120px", "sClass": "text-center","mDataProp": "gallerySalt"},
    					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "age"}
    	           ];
	
	
    $('#xsjb-datatable').dataTable({
    	"aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] }],
        "iDisplayLength": 50,
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bAutoWidth":false,
        "sAjaxSource": sAjaxSource,
        "bServerSide":true,//服务器端必须设置为true
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
        	// 序号
        	//rownum=aaData
        //$('td:eq(0)', nRow).html(iDisplayIndex);
        	var checkBox = '<input name="xsids" type="checkbox" value="'+aaData.id+'" />';
        	$('td:eq(0)', nRow).html(checkBox);
//        	$('td:eq(1)', nRow).html(rownum);
        	// 照片
        	var picpath = "";
        	if(aaData.picpath!=null && aaData.picpath!=''){
        		picpath = aaData.picpath;
        	}else{
        		if(aaData.xb == 1){
        			picpath = "http://jeff-ye-1978.qiniudn.com/boyteacher.jpg";
        		}else{
        			picpath = "http://jeff-ye-1978.qiniudn.com/girlteacher.jpg";
        		}
        	}
        	var picHtml='<img src="'+checkQiniuUrl(picpath)+'" style="height:64px;width: 64px" alt="avatar" class="img-circle">';
        	$('td:eq(1)', nRow).html(picHtml);
 			// 姓名
 			var editHtml='<div style="text-align:center;"><a href="'+ctx+'/xtgl/xsjb/update/'+aaData.id+'?'+param+'&appid='+$("#appid").val()+'">'+aaData.xm+'</a></div>';
 			$('td:eq(2)', nRow).html(editHtml);
 			// 性别
 			var xb_ch = "男";
 			if(aaData.xb == 2){
 				xb_ch = "女";
 			}
 			$('td:eq(3)', nRow).html(xb_ch);
 			
// 			// 是否付费
// 			isPayment = "未开通";
// 			if(aaData.payment == 1 ){
// 				isPayment = "已开通";
// 			}
// 			$('td:eq(4)', nRow).html(isPayment);
// 			var isBinding = "否";
// 			if(aaData.binding == 1){
// 				isBinding = "是";
// 			}
// 			$('td:eq(5)', nRow).html(isBinding);
 			// 家长
// 			parentsHtml='<div style="text-align:center;"><a id="query_xsjz_count'+aaData.id+'" href="javascript:queryXsjzInfo('+aaData.id+',\''+aaData.xm+'\','+aaData.wxXxXsjzList.length+')">查看(<label id="jz_count'+aaData.id+'">'+aaData.wxXxXsjzList.length+'</label>)</a>&nbsp;&nbsp;<a href="javascript:addXsjzInfo('+aaData.id+',\''+aaData.xm+'\','+aaData.wxXxXsjzList.length+')">新增</a></div>';
// 			$('td:eq(7)', nRow).html(parentsHtml);
 			// 状态
 			// 是否付费
 			var payCss = "";
 			var bindingCss = "";
 			var isPayment = "未服务";
 			if(aaData.payment == 1 ){
 				isPayment = "服务中";
 				payCss = " pay";
 			}
 			
 			var isBinding = "未绑定";
 			if(aaData.binding == 1){
 				isBinding = "已绑定";
 				bindingCss = " binding";
 			}
 			
 			var delhtml='<div class="btn-group btn-group-xs" ><a class="l'+bindingCss+'" href="javascript:void(0);">'+isBinding+'</a>&nbsp;&nbsp;<a class="r'+payCss+'" href="javascript:void(0);">'+isPayment+'</a></div>';
 			$('td:eq(8)', nRow).html(delhtml);
 			
			rownum=rownum+1;
			return nRow;
		}, 
        "aoColumns":aoColumns,
        "fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
    });
}

function getSerchFormBjsjList(){
	var param = {
		campusid : $("#user_camups_chosen").val(),
		ifby : $("#ifby").val()
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_CLASS,
		param : JSON.stringify(param)
	};
	$.post(ctx+ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			createBjList(result.data.bjList);
		}else{
			console.log(result.ret.code+":"+result.ret.msg);
		}
	});
	
}

function createBjList(bjData){
	$("#user_bjid_chosen option").remove();//user为要绑定的select，先清除数据   
	if(bjData.length>0){
		var allBjid=bjData[0].id;
		for(var i=1;i<bjData.length;i++){
			allBjid+=","+bjData[i].id;
		}
		$("#user_bjid_chosen").append("<option value=" + allBjid+" >全部班级</option>");
	}
	for(var i=0;i<bjData.length;i++){
    	if(search_EQ_bjid!=null && search_EQ_bjid!='' && search_EQ_bjid==bjData[i].id){
    		$("#user_bjid_chosen").append("<option value=" + bjData[i].id+" selected >"
        			+ bjData[i].bj + "</option>");
    	}else{
    		$("#user_bjid_chosen").append("<option value=" + bjData[i].id+" >"
        			+ bjData[i].bj + "</option>");
    	}
    	
    };
    $("#user_bjid_chosen").find("option[index='0']").attr("selected",'selected');
    $("#user_bjid_chosen").trigger("chosen:updated");
    
    generate_xsjb_table();
}

function queryXsjzInfo(id,xm,count){
	$('#title').html("学生 "+ xm + " 的家长信息");
	GHBB.prompt("正在加载~");
	var url=ctx+"/xtgl/xsjb/findXsjzByStuid";
	var submitData = {
		id: id
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			var xsjzHtml = "";
			$('#xsjz_gx_list').html('');
			$('#xsjb_id').val(id);
			$('#xsjb_xm').val(xm);
			$('#xsjb_count').val(count);
			
			if(datas != '' && datas.length>0){
				for(var i=0;i<datas.length;i++){
					var gx = "";
					if(datas[i].gx_ch != undefined || datas[i].gx_ch != null){
						gx = datas[i].gx_ch;
					}
					xsjzHtml = xsjzHtml+'<a href="javascript:findXsjzByJzid('+datas[i].id+');" id="'+datas[i].id+'" class="btn btn-sm btn-alt btn-default">'+(gx+'-'+datas[i].name)+'</a>';   	
					if(i==0){
						$('#jz_id').val(datas[i].id);
						$('#jz_orgcode').val(datas[i].orgcode);
						$('#jz_username').val(datas[i].name);
						
						$('#jz_gx').find("option[value='"+datas[i].gx+"']").attr("selected",true);
						$('#jz_gx').trigger("chosen:updated");
						
						$('#jz_phone').val(datas[i].phone);
						
						$('#jz_slaveuser').val(datas[i].slaveuser);
						if(datas[i].slaveuser!=null && datas[i].slaveuser!=''){
							$('#jz_slaveuser_ch').val("已绑定");
						}else{
							$('#jz_slaveuser_ch').val("未绑定");
						}
						if('10010' == datas[i].orgcode){
							$('#jz_gzdw').val(datas[i].gzdw);
							
							$('#jz_rclx').find("option[value='"+datas[i].rclx+"']").attr("selected",true);
							$('#jz_rclx').trigger("chosen:updated");
						}
						
					}
		        };
		        $('#xsjzModel').css("display","block");
		        $('#xsjz_gx_list').html(xsjzHtml);
		        
			}else{
				$('#xsjzModel').css("display","none");
			}
			GHBB.hide();
	        $('#modal-add-xsjz').modal('show');
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

function delConfirm(id){
	if(confirm("确定删除该学生?")){
		GHBB.prompt("数据保存中~");
		var url=ctx+"/xtgl/xsjb/delete?appid=725";
		var submitData = {
				id	: id
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					GHBB.hide();
					alert("删除成功!");
					generate_xsjb_table();
					return false;
				}else{
					alert(data);
				}
				
	    		
	      });
	}		
}

function delChecked(){
	
	var chk_value =[];//定义一个数组    
    $('input[name="xsids"]:checked').each(function(){//遍历每一个名字为xsids的复选框，其中选中的执行函数    
    	chk_value.push($(this).val());//将选中的值添加到数组chk_value中    
    });
    if(chk_value.length == 0){
    	alert("未选中学生！");
    	return;
    }
	if(confirm("确定删除所选学生?")){
		var url=ctx+"/xtgl/xsjb/delChecked";
		var submitData = {
				xsids	: chk_value.toString()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					PromptBox.alert("删除成功!");
					$("#xsids").prop("checked", false);
					generate_xsjb_table();
					return false;
				}else{
					PromptBox.alert("删除失败!");
				}
				
	    		
	      });
	}		
}

function expectXsjb(){
	GHBB.prompt("数据导出中~");
	var url=ctx+"/xtgl/xsjb/expectXsjbList";
	var submitData = {
			search_EQ_campusid:$("#user_camups_chosen").val(),
			search_EQ_bjid:$("#user_bjid_chosen").val(),
			search_LIKE_xm:$("#user_xm").val(),
			search_ifbind:$("#stu_binding_chosen").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
		GHBB.hide();
			location.href=ctx + data; 
    	});
}

function xsjbCreateForm(){
	var param = "search_EQ_campusid="+$("#user_camups_chosen").val();
    param=param+"&search_EQ_bjid="+$("#user_bjid_chosen").val();
    param=param+"&search_LIKE_xm="+$("#user_xm").val();
    param=param+"&appid="+$("#appid").val();
    param=param+"&search_ifby=0";
	location.href = ctx+"/xtgl/xsjb/create?"+param;
}

function checkUpdateFileType(){
	
    var filepath=$("input[name='updateFile']").val();
    if(filepath==undefined||$.trim(filepath)==""){  
    	alert("请选择上传文件！");
       return;  
    }else{  
       var fileArr=filepath.split("//"); 
       var fileTArr=fileArr[fileArr.length-1].toLowerCase().split(".");  
       var filetype=fileTArr[fileTArr.length-1];  
       if(filetype!="xls"){  
    	    alert("上传文件必须为office 2003格式Excel文件！");
        	return;  
       } 
    }
    uploadUpdateFile();
}
function uploadUpdateFile() {
	GHBB.prompt("数据正在导入中~");
	progress();
	$.ajaxFileUpload({
		url: commonUrl_ajax+"?api="+ApiParamUtil.STU_MANAGE_BATCH_UPDATE_IMPORT+"&param="+JSON.stringify({
			"aa":1
		}),	//需要链接到服务器地址
		secureuri:false,
		fileElementId: 'updateFile',					//文件选择框的id属性
		dataType:'json', 							//服务器返回的格式，可以是json
		success: function (result,status){
			GHBB.hide();
			if(result.ret.code==="200"){
				var serialnumber=result.data.serialnumber;
				$("#serialnumber_xsjb").val(serialnumber);
				$("#import_campusid").val(result.data.campusid);
				if(serialnumber != "" ){
					$("#saveXsjb").css('display','block');
				}else{
					$("#saveXsjb").css('display','none');
				}
				var gridhtml = result.data.griddata.replace(/\&lt;/g,"<").replace(/\&gt;/g,">").replace("[","").replace("]","");
				$("#xsjbImportInfo").html(gridhtml);
				$("#importTitle").html("批量修改学生信息");
				$("#import_insert_or_update").val(2);
				$('#importXsjbModal').modal('show');
			}else{
				PromptBox.alert(result.ret.code+":"+result.ret.msg);
			}			
		},
		error: function(data,status){
			alert("error");
		}
	});
}
function checkXsjbFileType(){
	
    var filepath=$("input[name='xsjbFile']").val();
    if(filepath==undefined||$.trim(filepath)==""){  
    	alert("请选择上传文件！");
       return;  
    }else{  
       var fileArr=filepath.split("//"); 
       var fileTArr=fileArr[fileArr.length-1].toLowerCase().split(".");  
       var filetype=fileTArr[fileTArr.length-1];  
       if(filetype!="xls"){  
    	    alert("上传文件必须为office 2003格式Excel文件！");
        	return;  
       } 
    }
    uploadXsjbFile();
}

function uploadXsjbFile() {
	GHBB.prompt("数据正在导入中~");
	progress();
	$.ajaxFileUpload({
		url: ctx+'/xtgl/initdata/xsjbInfoImport',	//需要链接到服务器地址
		secureuri:false,
		fileElementId: 'xsjbFile',					//文件选择框的id属性
		dataType:'json', 							//服务器返回的格式，可以是json
		success: function (data,status){
			GHBB.hide();
			$("#serialnumber_xsjb").val(data.serialnumber.replace("[","").replace("]",""));
			if($("#serialnumber_xsjb").val() != undefined && $("#serialnumber_xsjb").val() != "" && $("#serialnumber_xsjb").val() != null){
				document.getElementById("saveXsjb").style.display = "block";
			}else{
				document.getElementById("saveXsjb").style.display = "none";
			}
			var gridhtml = data.griddata.replace(/\&lt;/g,"<").replace(/\&gt;/g,">").replace("[","").replace("]","");
//			var gridhtml = "<table class='table table-striped table-bordered table-condensed'><thead><tr><th style='text-align:center;vertical-align:middle;white-space:nowrap;'>序号</th><th style='text-align:center;vertical-align:middle;white-space:nowrap;'>校区</th><th style='text-align:center;vertical-align:middle;white-space:nowrap;'>姓名</th><th style='text-align:center;vertical-align:middle;white-space:nowrap;'>班级</th><th style='text-align:center;vertical-align:middle;white-space:nowrap;'>性别</th><th style='text-align:center;vertical-align:middle;white-space:nowrap;'>证件号</th><th style='text-align:center;vertical-align:middle;white-space:nowrap;'>出生日期</th><th style='text-align:center;vertical-align:middle;white-space:nowrap;'>籍贯</th><th style='text-align:center;vertical-align:middle;white-space:nowrap;'>家长手机</th><th style='text-align:center;vertical-align:middle;white-space:nowrap;'>现住址</th><th style='text-align:left;vertical-align:middle;white-space:nowrap;'>错误提示</th></tr></thead>"
//+";<tbody><tr><td style='text-align:center;white-space:nowrap;' >1</td><td style='text-align:center;white-space:nowrap;' >光海微幼通</td><td style='text-align:center;white-space:nowrap;' >测试学生15</td><td style='text-align:center;white-space:nowrap;' >小一班</td><td style='text-align:center;white-space:nowrap;' >男</td><td style='text-align:center;white-space:nowrap;' >330324201110101000</td><td style='text-align:center;white-space:nowrap;' >2011-10-11</td><td style='text-align:center;white-space:nowrap;' >北京</td><td style='text-align:center;white-space:nowrap;' >15823881920</td><td style='text-align:center;white-space:nowrap;' >北京宣武门</td><td style='text-align:left;white-space:nowrap;'></td></tr></tbody></table>";
			$("#xsjbImportInfo").html(gridhtml);
			displaySaveBtn(1);			
			$("#importTitle").html("导入学生信息");
			$("#import_insert_or_update").val(1);
			$('#importXsjbModal').modal('show');
		},
		error: function(data,status){
			GHBB.hide();
			alert("error");
		}
	});
}

function displaySaveBtn(state){
	if(state == 0){
		$("saveXsjb").css("display","none");
	}else{
		$("saveXsjb").css("display","block");
	}
	
}

function progress(){
	 $("#loading")
		.ajaxStart(function(){
			setTimeout(function(){
	             $.messager.progress('close');
	         },15000);
		})
		.ajaxComplete(function(){
			
		});
}

function printSalt(){
	GHBB.prompt("数据导出中~");
	var campusid = $("#user_camups_chosen").val();
	var chk_value =[];//定义一个数组    
    $('input[name="xsids"]:checked').each(function(){//遍历每一个名字为xsids的复选框，其中选中的执行函数    
    	chk_value.push($(this).val());//将选中的值添加到数组chk_value中    
    });
	var param = {
		campusid	: campusid,
		xsids		: chk_value,
		bjid		: $("#user_bjid_chosen").val()
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

function queryDeptList(){
	GHBB.prompt("正在加载~");
	var param = {
		campusid : $("#user_camups_chosen").val().toString(),
		type : "1"
	}
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_DEPTLIST_BY_TYPE,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			if(result.data.length == 0){
				$("#deptRemind").css("display","block");
			}
			var stuDept = $("select[name=stuDept]");
			$("select[name=stuDept] option").remove();
			for (var i = 0; i < stuDept.length; i++) {
				for (var j = 0; j < result.data.length; j++) {
					var select = "";
					$("#stuDept").append('<option value="' + result.data[j].id + '">'
							+ result.data[j].deptname + '</option>');
				}
				stuDept.eq(i).trigger("chosen:updated");
			}
		}
	});
}

function saveDept(){
	GHBB.prompt("数据保存中~");
	var memberid = "";
	var stuids = $("input[name='xsids']:checked");
	for (var i = 0; i < stuids.length; i++) {
		if(i == stuids.length - 1){
			memberid += stuids.eq(i).val();
		}else{
			memberid += stuids.eq(i).val() + ",";
		}
	}
	var deptid = "";
	if($("#stuDept").val() != null && $("#stuDept").val() != ""){
		deptid = $("#stuDept").val().toString();
	}
	var campusid = "";
	if($("#user_camups_chosen").val() != null && $("#user_camups_chosen").val() != ""){
		campusid = $("#user_camups_chosen").val().toString();
	}
	var param = {
		memberid : memberid,
		deptid : deptid,
		campusid : campusid,
		type : "1"
	}
	var submitData = {
		api : ApiParamUtil.COMMON_SET_DEPT,
		param : JSON.stringify(param)
	};
	$.post(ctx + ApiParamUtil.COMMON_URL_AJAX, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			alert("设置分组成功！");
			$('#setDeptModal').modal('hide');
		}
	});
}

function checkChecked(){
	var memberid = "";
	var stuids = $("input[name='xsids']:checked");
	for (var i = 0; i < stuids.length; i++) {
		if(i == stuids.length - 1){
			memberid += stuids.eq(i).val();
		}else{
			memberid += stuids.eq(i).val() + ",";
		}
	}
	if(stuids == null || stuids == "" || stuids.length == 0){
		alert("请先选择学生！");
		return false;
	}
	return true;
}