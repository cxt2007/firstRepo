var ctx=$("#ctx").val();
var active = [];
var as = [];
var t = [];
var addNum = 1;
var flags = true;
$(document).ready(function() {
	generate_table();
	$("#school-chosen").change(function() {
		generate_table();
	});
	
	$("#year-chosen").change(function() {
		generate_table();
	});
	
	$("#state-chosen").change(function() {
		generate_table();
	});
	
	$("#search-btn").click(function() {
		generate_table();
	});
	
	$("#exportFile").click(function() {
		exportZxbm();
	});
	
	$("#xsids").click(function(){
		$("input[name='xsids']").prop("checked", $("#xsids").prop("checked"));
	});
	
	$("#del-btn").click(function(){
		delChecked();
	});
	
	$("#saveMark").click(function() {
		saveMark();
	});
	
	$("#send-btn").click(function() {
		showMsg();
	});
	
	$("#sendMsg").click(function() {
		sendMsg();
	});
});

function showMsg(){
	//$('#zxbm_id').val(id);
	var chk_value =[];//定义一个数组    
    $('input[name="xsids"]:checked').each(function(){//遍历每一个名字为xsids的复选框，其中选中的执行函数    
        chk_value.push($(this).val());//将选中的值添加到数组chk_value中    
    });
    
    if(chk_value.length == 0){
    	alert("未选中任何在线报名信息！");
    	return;
    }
    $('#msg_id').val(chk_value);
	$('#modal-msg-zxbm').modal('show');
}

// 发送消息
function sendMsg(){
	var url=ctx+"/xtgl/registration/sendMsg";
	var submitData = {
			ids:$('#msg_id').val(),
			msg_y:$('#msg_y').val(),
			msg_n:$('#msg_n').val()
	};
	
	if(confirm("确定发送?")){
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					alert("消息发送成功！");
					$("#xsids").prop("checked", false);
					$('#modal-msg-zxbm').modal('hide');
					generate_table();
				}else{
					alert(data);
				}	
	    });
	}
}

function markZxbm(id,state,remark){
	$("#zxbm_id").val(id);
	if (remark) {
		$('#remark').val(remark);
	}else{
		$('#remark').val('');
	}
	var inputs = $("#zxbm_state input");
	for(var i=0;i<inputs.length;i++){
		var obj = inputs[i];
		if(obj.value == state){
			obj.checked = true;
		}else{
			obj.checked = false;
		}
	}
}
//设置表单跳转
function frompage(){
	window.location.href = ctx+"/base/func/20107?appid=808&campusid="+$("#school-chosen").val();
}

// 保存标记
function saveMark(){
	GHBB.prompt("数据保存中~");
	var url=ctx+"/xtgl/registration/saveMark";
	
	var submitData = {
			id:$('#zxbm_id').val(),
			state:$('input:radio[name="state"]:checked').val(),
			remark:$('#remark').val()
	};
	
	if(confirm("确定保存?")){
		$.post(url,
			submitData,
	      	function(data){
			GHBB.hide();
				if(data=="success"){
					alert("标记保存成功！");
					generate_table();
					closebg();
				}else{
					alert(data);
				}	
	    });
	}
}

function delChecked(){
	var chk_value =[];//定义一个数组    
	var flag = true;
    $('input[name="xsids"]:checked').each(function(){//遍历每一个名字为xsids的复选框，其中选中的执行函数    
    	if(flag){
    		if (this.title != 0) {
        		alert("无法删除已处理的在线报名信息!");
        		flag = false;
        		return;
        	}
        	chk_value.push($(this).val());//将选中的值添加到数组chk_value中    
    	}
    });
    
    if(flag){
	    if(chk_value.length == 0){
	    	alert("未选中任何在线报名信息！");
	    	return;
	    }
	    
		if(confirm("确定删除所选在线报名信息?")){
			var url=ctx+"/xtgl/registration/deletes";
			var submitData = {
				ids: chk_value
			}; 
			$.post(url,
				submitData,
		      	function(data){
					if(data=="success"){
						alert("删除成功!");
						$("#xsids").prop("checked", false);
						generate_table();
						return false;
					}else{
						alert(data);
					}
		      });
		}	
	}
}

function exportZxbm(){
	GHBB.prompt("数据导出中~");
	var url=ctx+"/xtgl/registration/exportZxbmList";
	var submitData = {
			year:$("#year-chosen").val(),
			campusid:$("#school-chosen").val(),
			state:$("#state-chosen").val(),
			bbxm:$("#bbxm").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			GHBB.hide();
			location.href=ctx + data; 
    	});
}

function delConfirm(id){
	if(confirm("确定删除该在线报名信息?")){
		var url=ctx+"/xtgl/registration/delete";
		var submitData = {
				id: id
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					alert("删除成功!");
					generate_table();
					return false;
				}else{
					alert(data);
				}
	      });
	}		
}

// 查看在线报名信息
function viewZxbmInfo(id){
	showbg();
	var url=ctx+"/xtgl/registration/findZxbmById";
	var submitData = {
		id: id
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval('(' + data + ')');
			if(datas != ''){
				$("#field ul").find("li").each(function(){
					$(this).css("display","block");
					var idname = $(this).attr("id");
					if(!datas[idname]){
						$(this).css("display","none");
					}
					$(this).find("input").val(datas[idname]);
					if($(this).attr("id")=="bb_sex"&&datas[idname]=="1" ){
						$(this ).find("input").val("男");
					}
					if($(this).attr("id")=="bb_sex"&&datas[idname]=="2" ){
						$(this).find("input").val("女");
					}
				});
			markZxbm(datas.id,datas.state,datas.remark);
			$("#formremarktext").html(datas.formremark);
			}
			if(datas.picpath){
				var li = "";
				var picListArry = datas.picpath.split(",");
				createPicList(picListArry);
				var a = "";
					$(".banner").removeClass("hide");
					$(".deleteImage").click(function(){
						setDelPicIds(this);
					});
			}else{
				$("#slider1").html('<li style="width:43%;position:fixed;list-style:none;">'
						+ '		<img style="height:100%;" alt="" src="'+ctx+"/static/images/u545.png"+'" />'
						+ '		<span class="font"></span>'
						+ '		<span class="bg"></span>'
						+ '</li>');
				$("#pagenavi1").html('<a class="active" >'+0+'</a>');
			}
			checkImage();
    });
}

function closeImg(){
	$("#slider1").html("");
	$("#slider1").css({"width":"359px","left":"0"});
	$("#pagenavi1").html("");
	closebg();
}

function checkSetting(filed){
	var zxbmTableTileList=$('#zxbmTableTileList').val();
	var cc=zxbmTableTileList.indexOf(filed);
	if(cc>-1){
		return true;
	}else{
		return false;
	}
}

function createZxbmTableTitle(){
	
	var aoColumns = new Array();
	aoColumns.push({"sWidth": "70px","sTitle":"<input id=\"xsids\" type=\"checkbox\" value=\"\" />","sClass":"text-center","mDataProp": "id"});
	aoColumns.push({"sWidth": "120px","sTitle":"姓名","sClass":"text-center","mDataProp": "bb_name"});
	aoColumns.push({"sWidth": "70px","sTitle":"性别","sClass":"text-center","mDataProp": "bb_sex"});
	if (checkSetting("birthday")) {
		aoColumns.push({"sWidth": "120px","sTitle":"出生日期","sClass":"text-center","mDataProp": "birthday"});
	}
	
	if (checkSetting("census")) {
		aoColumns.push({"sWidth": "100px","sTitle":"户籍","sClass":"text-center","mDataProp": "census"});

	}
	if (checkSetting("father_name")) {
		aoColumns.push({"sWidth": "100px","sTitle":"父亲姓名","sClass":"text-center","mDataProp": "father_name"});

	}
	if (checkSetting("father_lxdh")) {
		aoColumns.push({"sWidth": "100px","sTitle":"父亲电话","sClass":"text-center","mDataProp": "father_lxdh"});

	}
	if (checkSetting("mother_name")) {
		aoColumns.push({"sWidth": "100px","sTitle":"母亲名字","sClass":"text-center","mDataProp": "mother_name"});

	}
	if (checkSetting("mother_lxdh")) {
		aoColumns.push({"sWidth": "100px","sTitle":"母亲电话","sClass":"text-center","mDataProp": "mother_lxdh"});

	}
	if (checkSetting("hometown")) {
		aoColumns.push({"sWidth": "100px","sTitle":"籍贯","sClass":"text-center","mDataProp": "hometown"});
	}
	if (checkSetting("nation")) {
		aoColumns.push({"sWidth": "120px","sTitle":"民族","sClass":"text-center","mDataProp": "nation"});
	}
	
	
	if (checkSetting("credentials_type")) {
		aoColumns.push({"sWidth": "100px","sTitle":"证件类型","sClass":"text-center","mDataProp": "credentials_type"});

	}
	if (checkSetting("credentials_num")) {
		aoColumns.push({"sWidth": "100px","sTitle":"证件号","sClass":"text-center","mDataProp": "credentials_num"});

	}

	if (checkSetting("hukou_type")) {
		aoColumns.push({"sWidth": "100px","sTitle":"户口性质","sClass":"text-center","mDataProp": "hukou_type"});

	}
	if (checkSetting("hukou_area")) {
		aoColumns.push({"sWidth": "100px","sTitle":"户口所在地","sClass":"text-center","mDataProp": "hukou_area"});

	}
	if (checkSetting("address")) {
		aoColumns.push({"sWidth": "100px","sTitle":"现住址","sClass":"text-center","mDataProp": "address"});

	}
	
//	if (checkSetting("picpath")) {
//		aoColumns.push({"sWidth": "100px","sTitle":"资料照片","sClass":"text-center","mDataProp": "nation"});
//
//	}
	if (checkSetting("formremark")) {
		aoColumns.push({"sWidth": "100px","sTitle":"备注","sClass":"text-center","mDataProp": "remark"});

	}

	if (checkSetting("bb_class")) {
		aoColumns.push({"sWidth": "100px","sTitle":"班级","sClass":"text-center","mDataProp": "classname"});

	}

	if (checkSetting("zxbm_phone")) {
		aoColumns.push({"sWidth": "70px","sTitle":"手机号码","sClass":"text-center","mDataProp": "phonenum"});

	}
	if (checkSetting("zxbm_qq")) {
		aoColumns.push({"sWidth": "70px","sTitle":"QQ","sClass":"text-center","mDataProp": "qq"});

	}
	if (checkSetting("zxbm_wechat")) {
		aoColumns.push({"sWidth": "60px","sTitle":"微信","sClass":"text-center","mDataProp": "wechat"});

	}
	if (checkSetting("zxbm_mail")) {
		aoColumns.push({"sWidth": "80px","sTitle":"电子邮箱","sClass":"text-center","mDataProp": "mail"});

	}
	if (checkSetting("zxbm_workunit")) {
		aoColumns.push({"sWidth": "80px","sTitle":"工作单位","sClass":"text-center","mDataProp": "workunit"});

	}
	if (checkSetting("zxbm_education")) {
		aoColumns.push({"sWidth": "80px","sTitle":"学历","sClass":"text-center","mDataProp": "education"});

	}
	if (checkSetting("zxbm_finishschool")) {
		aoColumns.push({"sWidth": "100px","sTitle":"毕业院校","sClass":"text-center","mDataProp": "finishschool"});

	}
	if (checkSetting("zxbm_postcode")) {
		aoColumns.push({"sWidth": "60px","sTitle":"邮编","sClass":"text-center","mDataProp": "postcode"});

	}
	if (checkSetting("zxbm_introduction")) {
		aoColumns.push({"sWidth": "100px","sTitle":"个人介绍","sClass":"text-center","mDataProp": "introduction"});

	}
	var result=new Array();
	if(aoColumns.length>=6){
		for(i=0;i<aoColumns.length;i++){
			result.push(aoColumns[i]);
			if(i==6){
				break;
			}
		}
	}
	result.push({ "sWidth": "150px", "sTitle":"报名时间","sClass": "text-center","mDataProp": "datetime"});
	result.push({ "sWidth": "150px", "sTitle":"状态","sClass": "text-center","mDataProp": "state_ch"});
	
	return result;
}

function generate_table(){
	 App.datatables();
	 GHBB.prompt("正在加载~");
	 var rownum = 1;
     /* Initialize Datatables */
     var sAjaxSource=ctx+"/xtgl/registration/ajax_query_zxbm?"
    		 		+"year="+$("#year-chosen").val()
    		 		+"&campusid="+$("#school-chosen").val()
    		 		+"&state="+$("#state-chosen").val()
    		 		+"&bbxm="+$("#bbxm").val();
     var aoColumns = createZxbmTableTitle();
     
//     var aoColumns = [
//						{ "sWidth": "70px", "sClass": "text-center","mDataProp": "id"},
//						{ "sWidth": "150px", "sClass": "text-center","mDataProp": "bb_name"},
//						{ "sWidth": "70px", "sClass": "text-center","mDataProp": "bb_sex"},
//	 					{ "sWidth": "120px", "sClass ": "text-center","mDataProp": "birthday"},
//	 					{ "sWidth": "120px", "sClass": "text-center","mDataProp": "father_name"},
//	 					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "father_lxdh"},
//	 					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "datetime"},
//	 					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "state_ch"}
//	 				];

 	$('#example-datatable').dataTable({
 						"aaSorting" : [ [ 3, 'desc' ] ],
 						"iDisplayLength" : 20,
 						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
 								[ 10, 20, 30, "All" ] ],
 						"bFilter" : false,
 						"bLengthChange" : false,
 						"bDestroy" : true,
 						"bAutoWidth" : false,
 						"bSort" : false,
 						"sAjaxSource" : sAjaxSource,
 						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
 							var checkBox = '<input name="xsids" type="checkbox" value="'+aaData.id+'" title="'+aaData.state+'" />'
 				        	$('td:eq(0)', nRow).html(checkBox);
 							
 							var nameHtml = '<div style="text-align:center;"><a href="javascript:viewZxbmInfo('+aaData.id+')">'+aaData.bb_name+'</a></div>';
 							// 宝宝姓名
 							$('td:eq(1)', nRow).html(nameHtml);
 							
// 							var handleHtml = '';
// 							if (aaData.state == 0) {
// 								handleHtml='<div style="text-align:center;"><a href="javascript:markZxbm('+aaData.id+',\''+aaData.bb_name+'\','+aaData.state+',\''+aaData.remark+'\')">标记</a>&nbsp;&nbsp;<a href="javascript:delConfirm('+aaData.id+');">删除</a></div>';
// 							} else {
// 								handleHtml='<div style="text-align:center;"><a href="javascript:markZxbm('+aaData.id+',\''+aaData.bb_name+'\','+aaData.state+',\''+aaData.remark+'\')">标记</a></div>';
// 							}
// 							
// 							// 操作
// 							$('td:eq(8)', nRow).html(handleHtml);
 							
 							// 性别
 							if (aaData.bb_sex == 1) {
 								$('td:eq(2)', nRow).html('男');
 							} else {
 								$('td:eq(2)', nRow).html('女');
 							}
 							
 							rownum = rownum + 1;
 							return nRow;
 						},
 						"aoColumns" : aoColumns,
 						"fnInitComplete": function(oSettings, json) {
 							GHBB.hide();
 					    }
 					});
     
 }

function ChangeImage(obj,picPath){
	if(picPath){
		var picListArry = picPath.split(",");
	}
	var index = $(obj).html();
	$(".imageshow").attr("src",picListArry[index]);
	$(obj).css("background-color", "yellow"); 
	$(obj).siblings().css("background-color", "white"); 
}

function checkImage(){
	var width = ""; 
	var height = "";
	var h_w ="";
	$("#slider1 img").each(function(i){
		var img = $(this);
		var src = $(this).attr("src");
		//外面边框的的高宽比例
		var H_W = $("#slider1 li").height() / $("#slider1 li").width();
		// 在内存中创建一个img标记
		$("<img/>").attr("src",$(img).attr("src")).load(function() {
			$(img).attr("src");
			width = this.width;
			height = this.height;
			//图片的高宽比例
		    h_w = height / width;
		    if(H_W > h_w){
		    	$(img).css("height","100%");
		    	$(img).css("margin-left",-($(img).width()- $("#slider1 li").width())/2);
		    }else if(H_W < h_w){
		    	$(img).css("width","100%");
		    	$(img).css("margin-top",-($(img).height()- $("#slider1 li").height())/2);
		    }else if(width< $("#slider1 li").width()&& height<$("#slider1 li").height()){
		    	$(img).css("width","100%");
		    	$(img).css("height","100%");
		    }
	    });
	});
}

//图片轮播
function createPicList(picListArry){
	var li = "";
	for (var i = 0; i < picListArry.length; i++) {
		li += '<li>'
			+ '		<a href="#"><img alt="" src="'+picListArry[i]+'" /></a>'
			+ '		<span class="font"></span>'
			+ '		<span class="bg"></span>'
			+ '</li>';
	}
	$("#slider1").html(li);
	createPageNavi(picListArry);
}

function createPageNavi(picListArry){
	var aList = "";
	for (var i = 0; i < picListArry.length; i++) {
		var active = "";
		if(i == 0){
			active = ' class="active"';
		}
		aList += '<a href="javascript:void(0);"' + active + '>'+(i+1)+'</a>';
	}
	$("#pagenavi1").html(aList);
	initPicCarousel(addNum);
}

function initPicCarousel(addNum){
	active[addNum]=0;
	as[addNum]=document.getElementById('pagenavi'+addNum).getElementsByTagName('a');
	for(var i=0;i<as[addNum].length;i++){
		(function(){
			var j=i;
			as[addNum][i].onclick=function(){
				t.slide(j);
				return false;
			};
		})();
	}
		t[addNum]=new TouchSlider({id:'slider'+addNum, speed:600, timeout:6000, before:function(index){
		as[addNum][active[addNum]].className='';
		active[addNum]=index;
		as[addNum][active[addNum]].className='active';
	}});
}

//创建模态背景
function showbg(){
	$('#modal-view-zxbm').css("z-index","1050");	
	$('#modal-view-zxbm').css("visibility","visible");	
    $('#modal-view-zxbm').modal('show');
    $('#slider1').css("visibility","visible");
    $("body").append("<div class='modal-backdrop fade in'></div>");
}
//删除模态背景
function closebg(){
	$(".modal-backdrop").remove();
	$('#modal-view-zxbm').css("z-index","10");	
	$('#modal-view-zxbm').css("visibility","hidden");
	$('#modal-view-zxbm').css("display","block");
	$('#slider1').css("visibility","hidden");
	$("body").removeClass("modal-open");
}