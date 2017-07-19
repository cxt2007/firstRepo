/*
 *  Document   : tzList.js
 *  Author     : hbz
 *  Description: 通知管理页面
 */
var ctx = "";
var paxyList = function() {
	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document).ready(function() {

	//班级出勤统计
	$("#classPaxyTjQueryBtn").click(function() {
		generate_classPaxyTj_table();
	});
	
	//学生打卡记录
	$("#stuPaxyLogQueryBtn").click(function() {
		generate_stuPaxyLog_table();
	});
	
	//学生请假记录
	$("#stuLeaveLogQueryBtn").click(function() {
		generate_stuLeaveLog_table();
	});
	
	//教师考勤统计
	$("#teacherPaxyTjQueryBtn").click(function() {
		generate_teacherPaxyTj_table();
	});
	
	//教师考勤记录
	$("#teacherPaxyLogQueryBtn").click(function() {
		generate_teacherPaxyLog_table();
	});
	
	//教师请假记录
	$("#teacherLeaveLogQueryBtn").click(function() {
		generate_teacherLeaveLog_table();
	});
	
	$("#search_EQ_campusid").change(function() {
		getFormBjsjList($("#search_EQ_campusid").val(),"search_EQ_bjid");//过滤条件存在班级时生效
	
	});
	
	$("#tjcardlog_campusid").change(function() {
		getFormBjsjList($("#tjcardlog_campusid").val(),"tjbjid");//过滤条件存在班级时生效
	
	});
	$("#tjcardlog_campusid_leave").change(function() {
		getFormBjsjList($("#tjcardlog_campusid_leave").val(),"tjbjid_leave");//过滤条件存在班级时生效
	
	});
	
	$(".fastTime-endDate").blur(function() {
		changeFastTime(this);
	});
	$(".fastTime-startDate").blur(function() {
		changeFastTime(this);
	});
	if($('#functionId').val()=="20"){
		$('.fastTime-startDate,.fastTime-endDate').datepicker().on('changeDate', function(e) {
			var currentTarget = $(e.currentTarget);
			var parentNode = currentTarget.parent('.input-group');
//			var childrens = parentNode.find('.fastTime-startDate,.fastTime-endDate');
			if(currentTarget.parents(".table-responsive").find('.fastTime').val()=="0"){
				var limitingRange = 60*60*1000*24*31;
				if(currentTarget.hasClass('fastTime-startDate')){
					var startDate =  e.date;
					var endDate = new Date(e.date.getTime()+limitingRange);
					var endNode = parentNode.find('.fastTime-endDate');
					var endTime = new Date(endNode.val());
					if(endTime.getTime() > endDate.getTime() || endTime.getTime() < startDate.getTime()){
						endNode.datepicker('update',endDate.Format('yyyy-MM-dd'));
					}
//					childrens.datepicker('setStartDate', startDate);
//					childrens.datepicker('setEndDate', endDate);
				}else{
					var startDate = new Date(e.date.getTime()-limitingRange);
					var endDate = e.date;
					var startNode = parentNode.find('.fastTime-startDate');
					var startTime = new Date(startNode.val());
					if(startTime.getTime() > endDate.getTime() || startTime.getTime() < startDate.getTime()){
						startNode.datepicker('update',startDate.Format('yyyy-MM-dd'));
					}
//					childrens.datepicker('setStartDate', startDate);
//					childrens.datepicker('setEndDate', endDate);
				}
			}
			
		});
	}
	
	$(".select-chosen").change(function(){
		changeQueryData(this);
	})
});

function changeQueryData(node){
	setTimeout(function(){
		var tableid = $(".tab-pane.active").attr("id");
		if(tableid == "classPaxyTj-tab"){
			generate_classPaxyTj_table();
		}else if(tableid == "stuPaxyLog-tab"){
			generate_stuPaxyLog_table();
		}else if(tableid == "stuLeaveLog-tab"){
			generate_stuLeaveLog_table();
		}else if(tableid == "teacherPaxyTj-tab"){
			generate_teacherPaxyTj_table();
		}else if(tableid == "teacherPaxyLog-tab"){
			generate_teacherPaxyLog_table();
		}else if(tableid == "teacherLeaveLog-tab"){
			generate_teacherLeaveLog_table();
		}
	}, 500);
}


function getFormBjsjList(campusid,controlName){
	var url=ctx+"/base/findBjsjByCampusid";
	var submitData = {
		campusid: campusid
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#"+controlName+" option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	
	        	$("#"+controlName).append("<option value=" + datas[i][0] + " >"
	        			+ datas[i][1] + "</option>");
	        };
	        $("#"+controlName).find("option[index='0']").attr("selected",'selected');
	        $("#"+controlName).trigger("chosen:updated");
    });
}

/**
 * 创建班级出勤统计表格
 */
function generate_classPaxyTj_table() {
	var url=ctx+"/xtgl/kgpz/ajax_queryKqConfigByCampusid";
	var submitData = {
			campusid: $("#tjcardlog_campusid").val()
	};
	GHBB.prompt("正在加载~");
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			var rownum = 1;
			var aoColumns = [{
				"sTitle" : "日期",
				"sWidth" : "120px",
				"sClass" : "text-center",
				"mDataProp" : "date"
			}, {
				"sTitle" : "班级",
				"sWidth" : "120px",
				"sClass" : "text-center",
				"mDataProp" : "bjmc"
			}, {
				"sTitle" : "学生数量",
				"sWidth" : "100px",
				"sClass" : "text-center",
				"mDataProp" : "xssl"
			}, {
				"sTitle" : result.aaData['20710611']+"-"+result.aaData['20710612']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval1",
				"mDataProp" : "interval1"
			}, {
				"sTitle" : result.aaData['20710621']+"-"+result.aaData['20710622']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval2",
				"mDataProp" : "interval2"
			}, {
				"sTitle" : result.aaData['20710631']+"-"+result.aaData['20710632']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval3",
				"mDataProp" : "interval3"
			}, {
				"sTitle" : result.aaData['20710641']+"-"+result.aaData['20710642']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval4",
				"mDataProp" : "interval4"
			}, {
				"sTitle" : result.aaData['20710651']+"-"+result.aaData['20710652']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval5",
				"mDataProp" : "interval5"
			}, {
				"sTitle" : result.aaData['20710661']+"-"+result.aaData['20710662']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval6",
				"mDataProp" : "interval6"
			}];
			
			$('#classPaxyTj-datatable').dataTable({
				"aaSorting":[ [3,'desc']],
				"iDisplayLength" : 50,
				"bFilter" : false,
				"bLengthChange" : false,
				"bDestroy" : true,
				"bAutoWidth" : false,
				"bSort":false,
				"sAjaxSource" : commonUrl_ajax,
				//"sAjaxDataProp":'dataLsit',
				"bServerSide" : true,// false为前端分页
				"fnServerParams": function (aoData) {
					 var param = {
							campusid: $("#tjcardlog_campusid").val(),
							enddate: $("#tjcardlog_enddate").val(),
							begindate: $("#tjcardlog_begindate").val(),
							bjid: $("#tjbjid").val(),
							iDisplayStart: 0,
					        iDisplayLength: 10,
					        sEcho: 1
						};
					aoData.push( { "name": "api", "value": ApiParamUtil.CLASS_ATTENDANCE_ABSENCE_QUERY} );
					aoData.push( { "name": "iDisplayStart", "value": 0 } );
					aoData.push( { "name": "iDisplayLength", "value": 10 } );
					aoData.push( { "name": "sEcho", "value": 1 } );
					aoData.push( { "name": "param", "value": JSON.stringify(param) } );
				},
				"fnServerData": function (sSource, aoData, fnCallback) {
		            $.ajax( {
		                "dataType": 'json',
		                "type": "POST",
		                "url": sSource,
		                "data": aoData,
		                "success": function(json) {
		                	if (json.ret.code == 200) {
		                		fnCallback(json.data);
		                	} else {
		                		PromptBox.alert(json.ret.msg);
		                	}
						}             
		            } );
		        },
				//"aaSorting" : [[ 0, "asc" ], [ 5, "desc" ], [ 8, "desc" ]],
				"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
					var queryHtml_1='<div class="btn-group btn-group-xs">'+aaData.interval1+'人考勤/'+'<a href="#"  onclick="openQueryClassModel(\''+aaData.bjid+'\',\'interval1\',\''+aaData.date+'\',\''+(aaData.xssl-aaData.interval1)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.xssl-aaData.interval1)+'人未打</a></div>';
					var queryHtml_2='<div class="btn-group btn-group-xs">'+aaData.interval2+'人考勤/'+'<a href="#"  onclick="openQueryClassModel(\''+aaData.bjid+'\',\'interval2\',\''+aaData.date+'\',\''+(aaData.xssl-aaData.interval2)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.xssl-aaData.interval2)+'人未打</a></div>';
					var queryHtml_3='<div class="btn-group btn-group-xs">'+aaData.interval3+'人考勤/'+'<a href="#"  onclick="openQueryClassModel(\''+aaData.bjid+'\',\'interval3\',\''+aaData.date+'\',\''+(aaData.xssl-aaData.interval3)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.xssl-aaData.interval3)+'人未打</a></div>';
					var queryHtml_4='<div class="btn-group btn-group-xs">'+aaData.interval4+'人考勤/'+'<a href="#"  onclick="openQueryClassModel(\''+aaData.bjid+'\',\'interval4\',\''+aaData.date+'\',\''+(aaData.xssl-aaData.interval4)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.xssl-aaData.interval4)+'人未打</a></div>';
					var queryHtml_5='<div class="btn-group btn-group-xs">'+aaData.interval5+'人考勤/'+'<a href="#"  onclick="openQueryClassModel(\''+aaData.bjid+'\',\'interval5\',\''+aaData.date+'\',\''+(aaData.xssl-aaData.interval5)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.xssl-aaData.interval5)+'人未打</a></div>';
					var queryHtml_6='<div class="btn-group btn-group-xs">'+aaData.interval6+'人考勤/'+'<a href="#"  onclick="openQueryClassModel(\''+aaData.bjid+'\',\'interval6\',\''+aaData.date+'\',\''+(aaData.xssl-aaData.interval6)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.xssl-aaData.interval6)+'人未打</a></div>';
					$('td:eq(3)', nRow).html(queryHtml_1);
					$('td:eq(4)', nRow).html(queryHtml_2);
					$('td:eq(5)', nRow).html(queryHtml_3);
					$('td:eq(6)', nRow).html(queryHtml_4);
					$('td:eq(7)', nRow).html(queryHtml_5);
					$('td:eq(8)', nRow).html(queryHtml_6);
				},
				"aoColumns" : aoColumns,
				"fnInitComplete": function(oSettings, json) {
					GHBB.hide();
			    }
			});
		}
	});
	
}

/**
 * 创建学生打卡记录表
 */
function generate_stuPaxyLog_table() {
	GHBB.prompt("正在加载~");
	var url=ctx+"/xtgl/kgpz/ajax_queryKqConfigByCampusid";
	var submitData = {
			campusid: $("#search_EQ_campusid").val()
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			var rownum = 1;
			var url1 = commonUrl_ajax;
			var sAjaxSource =getDkjlTjUrl();
			var aoColumns = [{
				"sTitle" : "日期",
				"sWidth" : "120px",
				"sClass" : "text-center",
				"mDataProp" : "date"
			}, {
				"sTitle" : "班级",
				"sWidth" : "120px",
				"sClass" : "text-center",
				"mDataProp" : "bj"
			}, {
				"sTitle" : "学生姓名",
				"sWidth" : "100px",
				"sClass" : "text-center",
				"mDataProp" : "xm"
			}, {
				"sTitle" : result.aaData['20710611']+"-"+result.aaData['20710612']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval1",
				"mDataProp" : "interval1"
			}, {
				"sTitle" : result.aaData['20710621']+"-"+result.aaData['20710622']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval2",
				"mDataProp" : "interval2"
			}, {
				"sTitle" : result.aaData['20710631']+"-"+result.aaData['20710632']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval3",
				"mDataProp" : "interval3"
			}, {
				"sTitle" : result.aaData['20710641']+"-"+result.aaData['20710642']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval4",
				"mDataProp" : "interval4"
			}, {
				"sTitle" : result.aaData['20710651']+"-"+result.aaData['20710652']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval5",
				"mDataProp" : "interval5"
			}, {
				"sTitle" : result.aaData['20710661']+"-"+result.aaData['20710662']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval6",
				"mDataProp" : "interval6"
			}];
			
			$('#stuPaxyLog-datatable').dataTable({
				"aaSorting":[ [3,'desc']],
				"iDisplayLength" : 50,
				"bFilter" : false,
				"bLengthChange" : false,
				"bDestroy" : true,
				"bAutoWidth" : false,
				"bSort":false,
				"sAjaxSource" : commonUrl_ajax,
				//"sAjaxDataProp":'dataLsit',
				"bServerSide" : true,// false为前端分页
				"fnServerParams": function (aoData) {
					 var param = {
							orgcode: main_orgcode,
							campusid: $("#search_EQ_campusid").val(),
							enddate: $("#search_LTE_dqrq").val(),
							begindate: $("#search_GTE_dqrq").val(),
							bjid: $("#search_EQ_bjid").val(),
							xm: $("#search_LIKE_xm").val(),
							punchClockType: $("#search_EQ_punchCards").val(),
							iDisplayStart: 0,
					        iDisplayLength: 10,
					        sEcho: 1
						};
					aoData.push( { "name": "api", "value": ApiParamUtil.DAILY_MANAGE_STUDENT_ATTENDANCE_LIST_QUERY} );
					aoData.push( { "name": "iDisplayStart", "value": 0 } );
					aoData.push( { "name": "iDisplayLength", "value": 10 } );
					aoData.push( { "name": "sEcho", "value": 1 } );
					aoData.push( { "name": "param", "value": JSON.stringify(param) } );
				},
				"fnServerData": function (sSource, aoData, fnCallback) {
		            $.ajax( {
		                "dataType": 'json',
		                "type": "POST",
		                "url": sSource,
		                "data": aoData,
		                "success": function(json) {
		                	if (json.ret.code == 200) {
		                		fnCallback(json.data);
		                	} else {
		                		PromptBox.alert(json.ret.msg);
		                		GHBB.hide();
		                	}
						}             
		            } );
		        },
				//"aaSorting" : [[ 0, "asc" ], [ 5, "desc" ], [ 8, "desc" ]],
				"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
					var queryHtml_1=createStuPushBox(aaData.interval1,aaData.id1,aaData.stuid);
					var queryHtml_2=createStuPushBox(aaData.interval2,aaData.id2,aaData.stuid);
					var queryHtml_3=createStuPushBox(aaData.interval3,aaData.id3,aaData.stuid);
					var queryHtml_4=createStuPushBox(aaData.interval4,aaData.id4,aaData.stuid);
					var queryHtml_5=createStuPushBox(aaData.interval5,aaData.id5,aaData.stuid);
					var queryHtml_6=createStuPushBox(aaData.interval6,aaData.id6,aaData.stuid);
					$('td:eq(3)', nRow).html(queryHtml_1);
					$('td:eq(4)', nRow).html(queryHtml_2);
					$('td:eq(5)', nRow).html(queryHtml_3);
					$('td:eq(6)', nRow).html(queryHtml_4);
					$('td:eq(7)', nRow).html(queryHtml_5);
					$('td:eq(8)', nRow).html(queryHtml_6);
				},
				"aoColumns" : aoColumns,
				"fnInitComplete": function(oSettings, json) {
					GHBB.hide();
			    }
			});
		}
	});
}

function createStuPushBox(interval,id,stuid){
	var stuPushBox = new Array();
	var intervals = interval.split(',');
	var ids = id.split(',');
	for(var i=0;i<intervals.length;i++){
		stuPushBox.push('<div ><a href="#" onclick="viewStuPushData(\''+ids[i]+'\',\''+stuid+'\')">'+intervals[i]+'</a></div>');
	}
	return stuPushBox.join('');
}

function createTeaPushBox(interval,id,teacherid){
	var stuPushBox = new Array();
	var intervals = interval.split(',');
	var ids = id.split(',');
	for(var i=0;i<intervals.length;i++){
		stuPushBox.push('<div><a href="#" onclick="viewTeaPushData(\''+ids[i]+'\',\''+teacherid+'\')">'+intervals[i]+'</a></div>');
	}
	return stuPushBox.join('');
}

function viewTeaPushData(id,teacherid){
	GHBB.prompt("正在加载~");
	var submitData = {
			api: ApiParamUtil.DAILY_MANAGE_TEACHER_ATTENDANCE_ONE_QUERY,
			param: JSON.stringify({
				id:id,
				teacherid: teacherid
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
				var bodytemp = result.data.bodytemp;
				if(bodytemp!=null && bodytemp!='' && bodytemp!='0.0'){
					bodytemp = bodytemp+'&#176;C';
				}else{
					bodytemp = '未测';
				}
				openStartTeaXQ(result.data.teachername,result.data.picpath,bodytemp);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}


function viewStuPushData(id,stuid){
	GHBB.prompt("正在加载~");
	var submitData = {
			api: ApiParamUtil.DAILY_MANAGE_STUDENT_ATTENDANCE_ONE_QUERY,
			param: JSON.stringify({
				id:id,
				stuid: stuid
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
				var bodytemp = result.data.bodytemp;
				if(bodytemp!=null && bodytemp!='' && bodytemp!='0.0'){
					bodytemp = bodytemp+'&#176;C';
				}else{
					bodytemp = '未测';
				}
				openStartXQ(result.data.bjname,result.data.stuname,result.data.picpath,result.data.ismedicine,result.data.issnack,result.data.isfeeling,bodytemp,result.data.parentword,result.data.macid,result.data.kh);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function makeStuPaxyTableColumnTitle(xxtype){
	var aoColumns;
	if(xxtype!=1){
		aoColumns = [{
    		"sTitle" : "日期",
    		"sWidth" : "100px",
    		"sClass" : "text-center",
    		"mDataProp" : "2"
    	}, {
    		"sTitle" : "班级",
    		"sWidth" : "70px",
    		"sClass" : "text-center",
    		"mDataProp" : "4"
    	}, {
    		"sTitle" : "学生姓名",
    		"sWidth" : "120px",
    		"sClass" : "text-center",
    		"mDataProp" : "6"
    	}, {
    		"sTitle" : "上午打卡时间",
    		"sWidth" : "100px",
    		"sClass" : "text-center",
    		"mDataProp" : "7"
    	}, {
    		"sTitle" : "下午打卡时间",
    		"sWidth" : "100px",
    		"sClass" : "text-center",
    		"mDataProp" : "8"
    	}];
	}else{
		aoColumns = [{
    		"sTitle" : "日期",
    		"sWidth" : "100px",
    		"sClass" : "text-center",
    		"mDataProp" : "2"
    	}, {
    		"sTitle" : "班级",
    		"sWidth" : "70px",
    		"sClass" : "text-center",
    		"mDataProp" : "4"
    	}, {
    		"sTitle" : "学生姓名",
    		"sWidth" : "120px",
    		"sClass" : "text-center",
    		"mDataProp" : "6"
    	}, {
    		"sTitle" : "上午打卡时间",
    		"sWidth" : "100px",
    		"sClass" : "text-center",
    		"mDataProp" : "7"
    	}, {
    		"sTitle" : "下午打卡时间",
    		"sWidth" : "100px",
    		"sClass" : "text-center",
    		"mDataProp" : "8"
    	}, {
    		"sTitle" : "考勤保育",
    		"sWidth" : "100px",
    		"sClass" : "text-center"
    	}];
	}
	return aoColumns;
}

function setDKXQ(bj,xm,time,image,medicine,snack,feeling,bodytemp){
	var stateBox= new Array();
	if(bodytemp!=null && bodytemp!=''){
		bodytemp = bodytemp+'℃';
	}else{
		bodytemp = '未测';
	}
	if(time!=null && time!=''){
		tags = "'"+bj+"','"+xm+"','"+image+"',"+medicine+","+snack+","+feeling+",'"+bodytemp+"'";
		stateBox.push('<a class="openStartXQ" onclick="openStartXQ('+tags+')">'+time+'</a>');
	}
	return stateBox.join("");
}

/**
 * 设置学生打卡状态
 * @param pic
 * @param mood
 * @param pill
 * @param healthy
 */
function setStuState(bj,xm,image,medicine,snack,feeling,bodytemp,parentword){
	var stateBox= new Array();
	var isXq = false;
	var tags;
	stateBox.push('<div class="stuState btn-group btn-group-xs "><div style="float:left">');
//	if(image!==null && image!==""){
//		stateBox.push('<i class="image_true"></i>');
//		isXq = true;
//	}else{
//		stateBox.push('<i class="image_false"></i>');
//	}
	if(medicine){
		stateBox.push('<i class="medicine_true"></i>');
		isXq = true;
	}else{
		stateBox.push('<i class="medicine_false"></i>');
	}
	if(snack){
		stateBox.push('<i class="snack_true"></i>');
		isXq = true;
	}else{
		stateBox.push('<i class="snack_false"></i>');
	}
	if(feeling){
		stateBox.push('<i class="feeling_true"></i>');
		isXq = true;
	}else{
		stateBox.push('<i class="feeling_false"></i>');
	}
	stateBox.push('</div>');
	if(parentword!=""){
		stateBox.push('<a style="color:#3498db;padding-top:7px;float:left" title="'+parentword+'" " >家长留言</a>');
		
	}
	
//	if(bodytemp!=null && bodytemp!=''&& bodytemp>36 && bodytemp<37){
//		stateBox.push('<i class="bodytemp_true"></i>');
//	}else{
//		stateBox.push('<i class="bodytemp_false"></i>');
//	}
//	if(isXq){
//		tags = "'"+bj+"','"+xm+"','"+image+"',"+medicine+","+snack+","+feeling+",'"+bodytemp+"'";
//		stateBox.push('<a class="openStartXQ" onclick="openStartXQ('+tags+')">详情</a>');
//	}
	stateBox.push('</div>');
	return stateBox.join("");
}

function displayParentWord(obj){
	$(obj).css('display','none');
	$(obj).next().css('display','inline-block');
}

function hideParentWord(obj){
	$(obj).css('display','none');
	$(obj).prev().css('display','inline-block');
}

function openStartTeaXQ(xm,image,bodytemp){
	$("#cardImage").attr("src", image);
	$("#kqby_xm").html(xm);
	$("#physical").html(bodytemp=="null" ?"":bodytemp);
	$('#modal-tea-descrip').modal('show');
}

function openStartXQ(bj,xm,image,medicine,snack,feeling,bodytemp,parentword,macid,kh){
	var stateBox= new Array();
	if(medicine){
		stateBox.push('<i class="medicine_true"></i>');
		isXq = true;
	}else{
		stateBox.push('<i class="medicine_false"></i>');
	}
	if(snack){
		stateBox.push('<i class="snack_true"></i>');
		isXq = true;
	}else{
		stateBox.push('<i class="snack_false"></i>');
	}
	if(feeling){
		stateBox.push('<i class="feeling_true"></i>');
		isXq = true;
	}else{
		stateBox.push('<i class="feeling_false"></i>');
	}
	$("#cardImage").attr("src", image);
	$("#parentword").html(parentword);
	$("#kqby_xm").html(xm);
	if(macid==null || macid==undefined){
		macid="";
	}
	if(kh==null || kh==undefined){
		kh="";
	}
	var macid_kh=macid+" "+kh;
	if(macid!="" || kh!=""){
		$("#macidAndKh").html("考勤机:"+macid+ "<br>卡&nbsp;&nbsp;&nbsp;&nbsp;号:"+kh);
	}
	
	$("#kqby_bjmc").html(bj);
	$("#physical").html(bodytemp=="null" ?"":bodytemp);
	$("#stuState").html(stateBox.join(""));
	$('#modal-descrip').modal('show');
}


/**
 * 创建学生请假记录表
 */
function generate_stuLeaveLog_table() {
	GHBB.prompt("正在加载~");
	var rownum = 1;
    var sAjaxSource =getStuQjjlCxUrl();
	var aoColumns = [{
		"sTitle" : "班级",
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	}, {
		"sTitle" : "学生姓名",
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "1"
	}, {
		"sTitle" : "学生家长姓名",
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "2"
	}, {
		"sTitle" : "请假类型",
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "3"
	}, {
		"sTitle" : "具体事由",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "4"
	}, {
		"sTitle" : "起止日期",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "5"
	}, {
		"sTitle" : "请假日期",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "6"
	}, {
		"sTitle" : "回复",
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "7"
	}];
	
	var exoTable = $('#stuLeavePaxyLog-datatable').dataTable({
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bServerSide":true,//服务器端必须设置为true
		"sAjaxSource" :sAjaxSource,
		"sAjaxDataProp":"aaData",
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			var queryHtml = "";
			if(aaData[7]){
				queryHtml='<a href="#"  onclick="viewLeaveReply(\''+aaData[7]+'\');">已回复</a>';
			}else{
				queryHtml='--';
			}
			$('td:eq(7)', nRow).html(queryHtml);
			return nRow;
		},
		"aoColumns" :aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}


function viewLeaveReply(serialnumber){
	$("#modal-LeaveReply").modal("show");
	getLeaveReplyContent(serialnumber);
}

function jsDateFormat(date,format){
	if(date!=null){
		var date = new Date(date);
		if(format=='1'){
			date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
		}else if(format=='2'){
			date = checkTime(date.getHours())+':'+checkTime(date.getMinutes());
		}
	}
	return date;
}

function checkTime(i)
{
if (i<10) 
  {i="0" + i}
  return i
}


/**
 * 创建教师考勤统计表
 */
function generate_teacherPaxyTj_table() {
	GHBB.prompt("正在加载~");
	var url=ctx+"/xtgl/kgpz/ajax_queryKqConfigByCampusid";
	var submitData = {
			campusid: $("#search_campusid_teacherPaxyTj").val()
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			var rownum = 1;
			var aoColumns = [{
				"sTitle" : "日期",
				"sWidth" : "120px",
				"sClass" : "text-center",
				"mDataProp" : "date"
			}, {
				"sTitle" : "教师数量",
				"sWidth" : "100px",
				"sClass" : "text-center",
				"mDataProp" : "jssl"
			}, {
				"sTitle" : result.aaData['20710511']+"-"+result.aaData['20710512']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval1",
				"mDataProp" : "interval1"
			}, {
				"sTitle" : result.aaData['20710521']+"-"+result.aaData['20710522']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval2",
				"mDataProp" : "interval2"
			}, {
				"sTitle" : result.aaData['20710531']+"-"+result.aaData['20710532']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval3",
				"mDataProp" : "interval3"
			}, {
				"sTitle" : result.aaData['20710541']+"-"+result.aaData['20710542']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval4",
				"mDataProp" : "interval4"
			}, {
				"sTitle" : result.aaData['20710551']+"-"+result.aaData['20710552']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval5",
				"mDataProp" : "interval5"
			}, {
				"sTitle" : result.aaData['20710561']+"-"+result.aaData['20710562']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval6",
				"mDataProp" : "interval6"
			}];
			
			$('#teacherPaxyTj-datatable').dataTable({
				"aaSorting":[ [3,'desc']],
				"iDisplayLength" : 50,
				"bFilter" : false,
				"bLengthChange" : false,
				"bDestroy" : true,
				"bAutoWidth" : false,
				"bSort":false,
				"sAjaxSource" : commonUrl_ajax,
				//"sAjaxDataProp":'dataLsit',
				"bServerSide" : true,// false为前端分页
				"fnServerParams": function (aoData) {
					 var param = {
							campusid:  $("#search_campusid_teacherPaxyTj").val(),
							enddate: $("#search_endDate_teacherPaxyTj").val(),
							begindate: $("#search_startDate_teacherPaxyTj").val(),
							iDisplayStart: 0,
					        iDisplayLength: 10,
					        sEcho: 1
						};
					aoData.push( { "name": "api", "value": ApiParamUtil.TEACHER_ATTENDANCE_ABSENCE_QUERY} );
					aoData.push( { "name": "iDisplayStart", "value": 0 } );
					aoData.push( { "name": "iDisplayLength", "value": 10 } );
					aoData.push( { "name": "sEcho", "value": 1 } );
					aoData.push( { "name": "param", "value": JSON.stringify(param) } );
				},
				"fnServerData": function (sSource, aoData, fnCallback) {
		            $.ajax( {
		                "dataType": 'json',
		                "type": "POST",
		                "url": sSource,
		                "data": aoData,
		                "success": function(json) {
		                	if (json.ret.code == 200) {
		                		fnCallback(json.data);
		                	} else {
		                		PromptBox.alert(json.ret.msg);
		                	}
						}             
		            } );
		        },
				//"aaSorting" : [[ 0, "asc" ], [ 5, "desc" ], [ 8, "desc" ]],
				"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
					var queryHtml_1='<div class="btn-group btn-group-xs">'+aaData.interval1+'人考勤/'+'<a href="#"  onclick="openQueryTeacherModel(\'interval1\',\''+aaData.date+'\',\''+(aaData.jssl-aaData.interval1)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.jssl-aaData.interval1)+'人未打</a></div>';
					var queryHtml_2='<div class="btn-group btn-group-xs">'+aaData.interval2+'人考勤/'+'<a href="#"  onclick="openQueryTeacherModel(\'interval2\',\''+aaData.date+'\',\''+(aaData.jssl-aaData.interval2)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.jssl-aaData.interval2)+'人未打</a></div>';
					var queryHtml_3='<div class="btn-group btn-group-xs">'+aaData.interval3+'人考勤/'+'<a href="#"  onclick="openQueryTeacherModel(\'interval3\',\''+aaData.date+'\',\''+(aaData.jssl-aaData.interval3)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.jssl-aaData.interval3)+'人未打</a></div>';
					var queryHtml_4='<div class="btn-group btn-group-xs">'+aaData.interval4+'人考勤/'+'<a href="#"  onclick="openQueryTeacherModel(\'interval4\',\''+aaData.date+'\',\''+(aaData.jssl-aaData.interval4)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.jssl-aaData.interval4)+'人未打</a></div>';
					var queryHtml_5='<div class="btn-group btn-group-xs">'+aaData.interval5+'人考勤/'+'<a href="#"  onclick="openQueryTeacherModel(\'interval5\',\''+aaData.date+'\',\''+(aaData.jssl-aaData.interval5)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.jssl-aaData.interval5)+'人未打</a></div>';
					var queryHtml_6='<div class="btn-group btn-group-xs">'+aaData.interval6+'人考勤/'+'<a href="#"  onclick="openQueryTeacherModel(\'interval6\',\''+aaData.date+'\',\''+(aaData.jssl-aaData.interval6)+'\')" data-toggle="tooltip" title="查看" >'+(aaData.jssl-aaData.interval6)+'人未打</a></div>';
					$('td:eq(2)', nRow).html(queryHtml_1);
					$('td:eq(3)', nRow).html(queryHtml_2);
					$('td:eq(4)', nRow).html(queryHtml_3);
					$('td:eq(5)', nRow).html(queryHtml_4);
					$('td:eq(6)', nRow).html(queryHtml_5);
					$('td:eq(7)', nRow).html(queryHtml_6);
				},
				"aoColumns" : aoColumns,
				"fnInitComplete": function(oSettings, json) {
					GHBB.hide();
			    }
			});
		}
	});
}

/**
 * 创建教师考勤记录表
 */
function generate_teacherPaxyLog_table() {
	GHBB.prompt("正在加载~");
	var url=ctx+"/xtgl/kgpz/ajax_queryKqConfigByCampusid";
	var submitData = {
			campusid: $("#search_campusid_teacherPaxyLog").val()
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			var rownum = 1;
			var aoColumns = [{
				"sTitle" : "日期",
				"sWidth" : "120px",
				"sClass" : "text-center",
				"mDataProp" : "date"
			}, {
				"sTitle" : "班级",
				"sWidth" : "120px",
				"sClass" : "text-center",
				"mDataProp" : "bjmc"
			}, {
				"sTitle" : "教师姓名",
				"sWidth" : "100px",
				"sClass" : "text-center",
				"mDataProp" : "name"
			}, {
				"sTitle" : result.aaData['20710511']+"-"+result.aaData['20710512']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval1",
				"mDataProp" : "interval1"
			}, {
				"sTitle" : result.aaData['20710521']+"-"+result.aaData['20710522']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval2",
				"mDataProp" : "interval2"
			}, {
				"sTitle" : result.aaData['20710531']+"-"+result.aaData['20710532']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval3",
				"mDataProp" : "interval3"
			}, {
				"sTitle" : result.aaData['20710541']+"-"+result.aaData['20710542']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval4",
				"mDataProp" : "interval4"
			}, {
				"sTitle" : result.aaData['20710551']+"-"+result.aaData['20710552']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval5",
				"mDataProp" : "interval5"
			}, {
				"sTitle" : result.aaData['20710561']+"-"+result.aaData['20710562']+"考勤",
				"sWidth" : "130px",
				"sClass" : "text-center interval6",
				"mDataProp" : "interval6"
			}];
			
			$('#teacherPaxyLog-datatable').dataTable({
				"aaSorting":[ [3,'desc']],
				"iDisplayLength" : 50,
				"bFilter" : false,
				"bLengthChange" : false,
				"bDestroy" : true,
				"bAutoWidth" : false,
				"bSort":false,
				"sAjaxSource" : commonUrl_ajax,
				//"sAjaxDataProp":'dataLsit',
				"bServerSide" : true,// false为前端分页
				"fnServerParams": function (aoData) {
					 var param = {
							orgcode: main_orgcode,
							campusid: $("#search_campusid_teacherPaxyLog").val(),
							enddate: $("#search_endDate_teacherPaxyLog").val(),
							begindate: $("#search_startDate_teacherPaxyLog").val(),
							xm: $("#search_xm_teacherPaxyLog").val(),
							iDisplayStart: 0,
					        iDisplayLength: 10,
					        sEcho: 1
						};
					aoData.push( { "name": "api", "value": ApiParamUtil.DAILY_MANAGE_TEACHER_ATTENDANCE_LIST_QUERY} );
					aoData.push( { "name": "iDisplayStart", "value": 0 } );
					aoData.push( { "name": "iDisplayLength", "value": 10 } );
					aoData.push( { "name": "sEcho", "value": 1 } );
					aoData.push( { "name": "param", "value": JSON.stringify(param) } );
				},
				"fnServerData": function (sSource, aoData, fnCallback) {
		            $.ajax( {
		                "dataType": 'json',
		                "type": "POST",
		                "url": sSource,
		                "data": aoData,
		                "success": function(json) {
		                	if (json.ret.code == 200) {
		                		fnCallback(json.data);
		                	} else {
		                		PromptBox.alert(json.ret.msg);
		                	}
						}             
		            } );
		        },
				//"aaSorting" : [[ 0, "asc" ], [ 5, "desc" ], [ 8, "desc" ]],
				"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
					var queryHtml_1=createTeaPushBox(aaData.interval1,aaData.id1,aaData.teacherid);
					var queryHtml_2=createTeaPushBox(aaData.interval2,aaData.id2,aaData.teacherid);
					var queryHtml_3=createTeaPushBox(aaData.interval3,aaData.id3,aaData.teacherid);
					var queryHtml_4=createTeaPushBox(aaData.interval4,aaData.id4,aaData.teacherid);
					var queryHtml_5=createTeaPushBox(aaData.interval5,aaData.id5,aaData.teacherid);
					var queryHtml_6=createTeaPushBox(aaData.interval6,aaData.id6,aaData.teacherid);
					$('td:eq(3)', nRow).html(queryHtml_1);
					$('td:eq(4)', nRow).html(queryHtml_2);
					$('td:eq(5)', nRow).html(queryHtml_3);
					$('td:eq(6)', nRow).html(queryHtml_4);
					$('td:eq(7)', nRow).html(queryHtml_5);
					$('td:eq(8)', nRow).html(queryHtml_6);
				},
				"aoColumns" : aoColumns,
				"fnInitComplete": function(oSettings, json) {
					GHBB.hide();
			    }
			});
		}
	});
}

function setTeaDKXQ(xm,time,image,bodytemp){
	var stateBox= new Array();
	if(bodytemp!=null && bodytemp!=''){
		bodytemp = bodytemp+'℃';
	}else{
		bodytemp = '未测';
	}
	if(time!=null && time!=''){
		tags = "'"+xm+"','"+image+"','"+bodytemp+"'";
		stateBox.push('<a class="openStartXQ" onclick="openStartTeaXQ('+tags+')">'+time+'</a>');
	}
	return stateBox.join("");
}

/**
 * 创建教师请假记录表
 */
function generate_teacherLeaveLog_table() {
	GHBB.prompt("正在加载~");
	var rownum = 1;
	var sAjaxSource =getTeacherQJJLCxUrl();
	var aoColumns = [{
		"sTitle" : "班级",
		"sWidth" : "60px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	}, {
		"sTitle" : "教师姓名",
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "1"
	}, {
		"sTitle" : "请假类型",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "2"
	}, {
		"sTitle" : "具体事由",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "3"
	}, {
		"sTitle" : "起止日期",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "4"
	}
	, {
		"sTitle" : "请假日期",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "5"
	}
	];
	
	var teacherLeaveLog_Table = $('#teacherLeaveLog-datatable').dataTable({

		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bServerSide":true,//服务器端必须设置为true
		"sAjaxSource" :sAjaxSource,
		"sAjaxDataProp":"aaData",
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			// Append the grade to the default row class name
			// //alert(aaData.bjid);
			return nRow;
		},
		"aoColumns" :aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

/**
 * 查询某个班级某天打卡详情
 * 
 */
function openQueryClassModel(bjid,time,date,xssl){
	GHBB.prompt("正在加载~");
	var interval =	$("#classPaxyTj-datatable th."+time).text();
	var time = interval.substr(0,interval.length-2).split("-");
	var rownum = 1;
	var aoColumns = [{
		"sTitle" : "姓名",
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "xm"
	}, {
		"sTitle" : "是否打卡",
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "whetherQj"
	}];
	
	$('#stuQqCardLog-datatable').dataTable({
//		"aaSorting":[ [3,'desc']],
		"iDisplayLength" : xssl,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort":false,
		"sAjaxSource" : commonUrl_ajax,
		//"sAjaxDataProp":'dataLsit',
		"bServerSide" : true,// false为前端分页
		"fnServerParams": function (aoData) {
			 var param = {
					campusid: $("#tjcardlog_campusid").val(),
					starttime: time[0]+':00',
					endtime: time[1]+':00',
					bjid: bjid,
					date: date,
					iDisplayStart: 0,
				    iDisplayLength: 10,
				    sEcho: 1
				};
			aoData.push( { "name": "api", "value": ApiParamUtil.CLASS_ATTENDANCE_ABSENCE_VIEW} );
			aoData.push( { "name": "iDisplayStart", "value": 0 } );
			aoData.push( { "name": "sEcho", "value": 1 } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
		},
		"fnServerData": function (sSource, aoData, fnCallback) {
            $.ajax( {
                "dataType": 'json',
                "type": "POST",
                "url": sSource,
                "data": aoData,
                "success": function(datas) {
                	var json = typeof datas === "object" ? datas : JSON.parse(datas);
                	if (json.ret.code == 200) {
                		fnCallback(json.data);
                	} else {
                		PromptBox.alert(json.ret.msg);
                	}
				}             
            } );
        },
		//"aaSorting" : [[ 0, "asc" ], [ 5, "desc" ], [ 8, "desc" ]],
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			var whetherQj = aaData.whetherQj==0 ? "未打卡":"<a herf='' title="+aaData.qjly+" >请假</a>";
			$('td:eq(1)', nRow).html(whetherQj);
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
	
	$("#stuQqCardLogModel").modal("show");
	
}

/**
 * 查询某个园区某天教师缺勤详情
 * @param rq
 * @param bjid
 * @param pmorem
 * @param iTotalRecords
 */
function openQueryTeacherModel(time,date,jssl){
	GHBB.prompt("正在加载~");
	var interval =	$("#teacherPaxyTj-datatable th."+time).text();
	var time = interval.substr(0,interval.length-2).split("-");
	var rownum = 1;
	var aoColumns = [{
		"sTitle" : "姓名",
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "name"
	}, {
		"sTitle" : "是否打卡",
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "whetherQj"
	}];
	
	$('#stuQqCardLog-datatable').dataTable({
//		"aaSorting":[ [3,'desc']],
		"iDisplayLength" : jssl,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort":false,
		"sAjaxSource" : commonUrl_ajax,
		//"sAjaxDataProp":'dataLsit',
		"bServerSide" : true,// false为前端分页
		"fnServerParams": function (aoData) {
			 var param = {
					campusid: $("#search_campusid_teacherPaxyTj").val(),
					starttime: time[0]+':00',
					endtime: time[1]+':00',
					date: date,
					iDisplayStart: 0,
				    iDisplayLength: 10,
				    sEcho: 1
				};
			aoData.push( { "name": "api", "value": ApiParamUtil.TEACHER_ATTENDANCE_ABSENCE_VIEW} );
			aoData.push( { "name": "iDisplayStart", "value": 0 } );
			aoData.push( { "name": "iDisplayLength", "value": 10 } );
			aoData.push( { "name": "sEcho", "value": 1 } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
		},
		"fnServerData": function (sSource, aoData, fnCallback) {
            $.ajax( {
                "dataType": 'json',
                "type": "POST",
                "url": sSource,
                "data": aoData,
                "success": function(datas) {
                	var json = typeof datas === "object" ? datas : JSON.parse(datas);
                	if (json.ret.code == 200) {
                		fnCallback(json.data);
                	} else {
                		PromptBox.alert(json.ret.msg);
                	}
				}             
            } );
        },
		//"aaSorting" : [[ 0, "asc" ], [ 5, "desc" ], [ 8, "desc" ]],
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			var whetherQj = aaData.whetherQj==0 ? "未打卡":"<a herf='' title="+aaData.qjly+" >请假</a>";
			$('td:eq(1)', nRow).html(whetherQj);
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
	
	$("#stuQqCardLogModel").modal("show");
	
//	generate_TeacherAbsenceLog_table(rq,campusid,pmorem,iTotalRecords);
	
}

/**
 * 创建某个园区某天教师缺勤详情表格
 */
function generate_TeacherAbsenceLog_table(rq,campusid,pmorem,iTotalRecords) {
	var rownum = 1;
	GHBB.prompt("正在加载~");
	var sAjaxSource = ctx+"/jyhd/paxy/ajax_tj_teacher_absencelog?kqrq="+ rq+"&campusid="+campusid+"&pmorem="+pmorem+"&iTotalRecords="+iTotalRecords;
	var aoColumns = [{
		"sTitle" : "教师姓名",
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "1"
	}, {
		"sTitle" : "是否打卡",
		"sWidth" : "100px",
		"sClass" : "text-center"
	}];
	
	var whether = "否";
	
	var stuQqCardLog_Table = $('#stuQqCardLog-datatable').dataTable({

		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bServerSide":true,//服务器端必须设置为true
		"sAjaxSource" :sAjaxSource,
		"sAjaxDataProp":"aaData",
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			// Append the grade to the default row class name
			// //alert(aaData.bjid);
			if(aaData[2]==0){
				whether = "否";
			}else if(aaData[2]==1){
				whether = "请假";
			}else{
				whether = aaData[2];
			}
			$('td:eq(1)', nRow).html(whether);
			return nRow;
		},
		"aoColumns" :aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
	
	$("#stuQqCardLogModel").modal("show");
}

/**
 * 班级出勤统计
 * @param offset
 * @returns {String}
 */
function getDkjlTjUrl(){
	return ctx+"/jyhd/paxy/ajax_tj_cardlog?begindate="+ $("#tjcardlog_begindate").val()+getBeginTime("tab2")+"&enddate="+$("#tjcardlog_enddate").val()+ " 23:59:59"
			+"&page=1&bjid="+$("#tjbjid").val()+"&campusid="+$("#tjcardlog_campusid").val();
}

/**
 * 学生打卡记录
 * @param offset
 * @returns {String}
 */
function getDkjlCxUrl(){
	return ctx+"/jyhd/paxy/ajax_query_cardlog?search_GTE_dqrq="+ $("#search_GTE_dqrq").val()+getBeginTime("tab1")+"&search_LTE_dqrq="+$("#search_LTE_dqrq").val()+ getEndTime("tab2")
	+"&search_LIKE_xm="+$("#search_LIKE_xm").val()+"&search_EQ_bjid="+$("#search_EQ_bjid").val()+"&search_EQ_usertype=2"
			+"&page=1&search_EQ_campusid="+$("#search_EQ_campusid").val()+"&search_EQ_punchCards="+$('#search_EQ_punchCards').val();
}

/**
 * 学生请假记录
 * @param offset
 * @returns {String}
 */
function getStuQjjlCxUrl(){
	return ctx+"/jyhd/paxy/ajax_query_stuQjlog?search_GTE_dqrq="+ $("#stuLeavelog_begindate").val()+getBeginTime("tab1")+"&search_LTE_dqrq="+$("#stuLeavelog_enddate").val()+ getEndTime("tab2")
	+"&search_LIKE_xm="+$("#search_LIKE_xm").val()+"&search_EQ_bjid="+$("#tjbjid_leave").val()+"&search_EQ_usertype=2"
			+"&page=1&search_EQ_campusid="+$("#search_EQ_campusid").val();
}

/**
 * 教师考勤统计
 * @param offset
 * @returns {String}
 */
function getTeacherKQTJCxUrl()
{
	return ctx+"/jyhd/paxy/ajax_query?" +
			"search_startDate="+ $("#search_startDate_teacherPaxyTj").val()+" 00:00:00"
			+"&search_endDate="+$("#search_endDate_teacherPaxyTj").val()+" 23:59:59"
//			+"&kqstate="+$("#kqstate").val()
			+"&search_campusid="+$("#search_campusid_teacherPaxyTj").val()
			+"&search_type=TEACHERPAXYTJ"
			+"&page=1";
}

/**
 * 教师考勤记录
 * @param offset
 * @returns {String}
 */
function getTeacherDKJLCxUrl()
{	
	return ctx+"/jyhd/paxy/ajax_query?"+
			"search_startDate="+ $("#search_startDate_teacherPaxyLog").val()+" 00:00:00"
			+"&search_endDate="+$("#search_endDate_teacherPaxyLog").val()+" 23:59:59"
//			+"&kqstate="+$("#kqstate").val()
			+"&search_campusid="+$("#search_campusid_teacherPaxyLog").val()
			+"&search_xm="+$("#search_xm_teacherPaxyLog").val()
			+"&search_type=TEACHERPAXYLOG"
			+"&page=1";
}

/**
 * 教师请假记录
 * @param offset
 * @returns {String}
 */
function getTeacherQJJLCxUrl()
{	
	return ctx+"/jyhd/paxy/ajax_query?"+
			"search_startDate="+$("#search_startDate_teacherLeaveLog").val()+" 00:00:00"
			+"&search_endDate="+$("#search_endDate_teacherLeaveLog").val()+" 23:59:59"
//			+"&kqstate="+$("#kqstate").val()
			+"&search_campusid="+$("#search_campusid_teacherLeaveLog").val()
			+"&search_type=TEACHERLEAVELOG"
			+"&page=1";
}

function getBeginTime(tabname)
{ 
//	if ($("#"+tabname+"_pmorem").val()=="2") //下午
//	{
//		return " 12:00:00";
//	}
//	else 
//	{
		return " 00:00:00";
//	}
}

function getEndTime(tabname)
{
//	if ($("#"+tabname+"_pmorem").val()=="2") //下午
//	{
		return " 23:59:59";
//	}
//	else 
//	{
//		return " 11:59:59";
//	}
}

/**
 * 导出学生打卡记录
 */
function expectStuCardLog(){
	GHBB.prompt("数据导出中~");
	var url=ctx+"/jyhd/paxy/expectPaxyList";
	var submitData = {
		search_orgcode: main_orgcode,
		search_campusid: $("#search_EQ_campusid").val(),
		search_enddate: $("#search_LTE_dqrq").val(),
		search_begindate: $("#search_GTE_dqrq").val(),
		search_bjid: $("#search_EQ_bjid").val(),
		search_xm: $("#search_LIKE_xm").val(),
		search_punchClockType: $("#search_EQ_punchCards").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
		GHBB.hide();
			if(data.startsWith("error")){
				PromptBox.alert(data);
			}else{
				window.location.href=ctx+data ;
			}   		
      		
    });
}

/**
 * 导出班级打卡统计信息
 */
function exportBjFile(){
	GHBB.prompt("数据导出中~");
	var url=ctx+"/jyhd/paxy/expectBjPaxyList";
	var submitData = {
			search_campusid: $("#tjcardlog_campusid").val(),
			search_enddate: $("#tjcardlog_enddate").val(),
			search_begindate: $("#tjcardlog_begindate").val(),
			search_bjid: $("#tjbjid").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			GHBB.hide();
            window.location.href=ctx+data ;
    });
}
/**
 * 导出学生考勤统计详情
 */
function expectStudentPaxyDetails(){
	GHBB.prompt("数据导出中~");
	var url=ctx+"/jyhd/paxy/expectStudentPaxyDetails";
	var submitData = {
			search_campusid: $("#tjcardlog_campusid").val(),
			search_begindate: $("#tjcardlog_begindate").val(),
			search_enddate: $("#tjcardlog_enddate").val(),
			search_bjid: $("#tjbjid").val()			
	}; 
	$.post(url,
		submitData,
      	function(data){
		GHBB.hide();
		if(data==''){
			PromptBox.alert("请确认条件中，两个日期不能超过30天");
		}else{
			window.location.href=ctx+data ;
		} 
    });
}
/**
 * 导出老师考勤统计详情
 */
function expectTeacherPaxyDetails(){
	GHBB.prompt("数据导出中~");
	var url=ctx+"/jyhd/paxy/expectTeacherPaxyDetails";
	var submitData = {
			search_campusid: $("#search_campusid_teacherPaxyTj").val(),
			search_begindate: $("#search_startDate_teacherPaxyTj").val(),
			search_enddate: $("#search_endDate_teacherPaxyTj").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
		GHBB.hide();
            window.location.href=ctx+data ;
    });
}
/**
 * 导出学生请假记录信息
 */
function exportStuLeaveLogFile(){
	GHBB.prompt("数据导出中~");
	var url=ctx+"/jyhd/paxy/expectStuLeaveLogList";
	var submitData = {
			search_GTE_dqrq:$("#stuLeavelog_begindate").val()+getBeginTime("tab1"),
			search_LTE_dqrq:$("#stuLeavelog_enddate").val()+ getEndTime("tab2"),
			search_LIKE_xm:$("#search_LIKE_xm").val(),
			search_EQ_bjid:$("#tjbjid_leave").val(),
			search_EQ_usertype:2,
			search_EQ_campusid:$("#search_EQ_campusid").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
		GHBB.hide();
            window.location.href=ctx+data ;
    });
}

/**
 * 导出教师考勤统计数据
 */
function expectTeacherPaxyTj(){
	GHBB.prompt("数据导出中~");
	var url=ctx+"/jyhd/paxy/expectTeacherPaxyTjList";
	var submitData = {
			search_campusid:  $("#search_campusid_teacherPaxyTj").val(),
			search_enddate: $("#search_endDate_teacherPaxyTj").val(),
			search_begindate: $("#search_startDate_teacherPaxyTj").val()
	}; 
	$.post(url,submitData,
      	function(data){
		GHBB.hide();
            window.location.href=ctx+data ;
    });
}

/**
 * 导出教师考勤记录数据
 */
function expectTeacherPaxyLog(){
	GHBB.prompt("数据导出中~");
	var url=ctx+"/jyhd/paxy/expectTeacherPaxyLogList";
	var submitData = {
			search_orgcode: main_orgcode,
			search_campusid: $("#search_campusid_teacherPaxyLog").val(),
			search_enddate: $("#search_endDate_teacherPaxyLog").val(),
			search_begindate: $("#search_startDate_teacherPaxyLog").val(),
			search_xm: $("#search_xm_teacherPaxyLog").val()
	}; 
	$.post(url,submitData,
      	function(data){
		GHBB.hide();
            window.location.href=ctx+data;
    });
}

/**
 * 导出教师请假记录数据
 */
function expectTeacherLeaveLog(){
	GHBB.prompt("数据导出中~");
	var url=ctx+"/jyhd/paxy/expectTeacherLeaveList";
	var submitData = {
			search_startDate:$("#search_startDate_teacherLeaveLog").val()+" 00:00:00",
			search_endDate:$("#search_endDate_teacherLeaveLog").val()+" 23:59:59",
			search_campusid:$("#search_campusid_teacherLeaveLog").val(),
			search_type:'TEACHERLEAVELOG'
	}; 
	$.post(url,submitData,
      	function(data){
		GHBB.hide();
            window.location.href=ctx+data ;
    });
}
/**
 * 快捷设置时间
 */
function FastSetUpTime(node){
	fastTimeType = node.value;
	var startDateInput = $(node).parents(".table-responsive").find('.fastTime-startDate');
	var endDateInput = $(node).parents(".table-responsive").find('.fastTime-endDate');
	startDateInput.datepicker('setStartDate', '');
	startDateInput.datepicker('setEndDate', '');
	endDateInput.datepicker('setStartDate', '');
	endDateInput.datepicker('setEndDate', '');
	if(fastTimeType==0){
		return;
	}else if(fastTimeType==1){
		var time = new Date();
		time.setDate(time.getDate() - time.getDay() + 1);
		startDateInput.val(time.getFullYear()+"-"+checkTime(time.getMonth()+1)+"-"+checkTime(time.getDate()));
		time.setDate(time.getDate() + 6);
		endDateInput.val(time.getFullYear()+"-"+checkTime(time.getMonth()+1)+"-"+checkTime(time.getDate()));
	}else if(fastTimeType==2){
		var myDate = new Date();
	    var year = myDate.getFullYear();
	    var month = myDate.getMonth()+1;
	    if (month<10){
	        month = "0"+month;
	    }
	    var firstDay =year+"-"+month+"-"+"01";
	    startDateInput.val(firstDay);
	    myDate = new Date(year,month,0);
	    var lastDay = year+"-"+month+"-"+myDate.getDate();
	    endDateInput.val(lastDay);
	}else if(fastTimeType==3){
		var myDate = new Date();
	    var year = myDate.getFullYear();
	    var month = myDate.getMonth()+1;
	    var day = checkTime(myDate.getDate());
	    if (month<10){
	        month = "0"+month;
	    }
	    var toDay =year+"-"+month+"-"+day;
	    startDateInput.val(toDay);
	    endDateInput.val(toDay);
	}
	startDateInput.datepicker('update');
	endDateInput.datepicker('update');
}

function changeFastTime(node){
	var fastTime =  $(node).parents(".table-responsive").find('.fastTime');
	fastTime.val(0);
	fastTime.find("option[value='0']").attr("selected",true);
	$(".fastTime").trigger("chosen:updated");
}

//获取请假回复信息
function getLeaveReplyContent(serialnumber){
	var submitData = {
			api:ApiParamUtil.LEAVE_REPLY_QUERY,
			param:JSON.stringify({
				serialnumber:serialnumber
			})
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
						createLeaveReplyContent(result.data.hdxxlist);
					}else{
						console.log(result.ret.code+":"+result.ret.msg);
					}
				}
			});
	}

function createLeaveReplyContent(dataList){
	var dataArray = new Array();
	for(var i=0;i<dataList.length;i++){
		dataArray.push('<div class="form-group" ><div class="col-md-12">');
		dataArray.push('<span style="font-weight: bold;font-size: 16px;">'+dataList[i].name+'</span>');
		if(i>0){
			dataArray.push('<span style="margin-left:10px">回复</span>');
		}
		dataArray.push('<span style="margin-left:10px;">'+dataList[i].time.substr(0,16)+'</span></div>');
		dataArray.push('<div class="col-md-12" style="margin-top:10px;">'+dataList[i].content+'</div></div>');
	}
	$('#leaveReplyContent').html(dataArray.join(''));
}