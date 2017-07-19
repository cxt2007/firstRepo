var ctx = $("#ctx").val();
var currentElement;
var dlsCampusLoaded=0;

$(document).ready(function() {
	$("#campusList").multiselect({
		selectedList : 10
	});
	 $("#saveCampus").click(function() {
		 setCampusList();
	 });
	 $("#saveTime").click(function() {
		 setAdTime();
	 });
	 $("#startTime").on("changeDate", function(event) {
	     $("#startTimeValue").val($("#startTime").datepicker('getFormattedDate','yyyy/mm/dd'));
	     checkTime("start");
	 });
	 $("#endTime").on("changeDate", function(event) {
	     $("#endTimeValue").val($("#endTime").datepicker('getFormattedDate','yyyy/mm/dd'));
	     checkTime("end");
	 });
	 $("body").removeClass("modal-open");
	//获取列表
	getAdList();
	//获取代理商校区列表
	queryDlsCampusList();
});

function queryDlsCampusList(){
	var submitData = {
		api : ApiParamUtil.COMMON_DLS_CAMPUS_LIST,
		param : JSON.stringify({})
	};
	$.ajax({
		cache : false,
		type : "POST",
		url : commonUrl_ajax,
		data : submitData,
		success : function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code === "200") {
				var campusList=result.data.campusList;
				for (var i = 0; i < campusList.length; i++) {
					$("#campusList").append('<option value="' + campusList[i].id + '">'
							+ campusList[i].value + '</option>');
					$("#campusList").multiselect('refresh');
				}
				dlsCampusLoaded=1;
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
				PromptBox.alert(result.ret.msg);
				dlsCampusLoaded=2;
			}
		}
	});
}

function toAdd() {
	window.location.href = ctx + "/base/func/"+ApiParamUtil.DLS_DLS_AD_FORM_JUMP+"?appid=1110";
}

function initImgCss() {
	var ad_img_box = $(".adBox_url");
	for ( var i = 0; i < ad_img_box.length; i++) {
		var img_box = ad_img_box.eq(i);
		var img = img_box.find("img");
		if(img.height() > 0){
			img.css("margin-top", -img.height() / 2);
		}else{
			img.css("top", 0);
			img.css("height", "100%");
		}
	}
}

function getAdList() {
	GHBB.prompt("正在加载~");
	var submitData = {
		api : ApiParamUtil.DLS_DLS_AD_LIST_QUERY,
		param : JSON.stringify({})
	};
	$.ajax({
		cache : false,
		type : "POST",
		url : commonUrl_ajax,
		data : submitData,
		success : function(datas) {
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code === "200") {
				assembleAdList(result.data.adlist);
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function assembleAdList(adlist) {
	var adListStr = "";
	
	var extensionTime = "";
	for ( var i = 0; i < adlist.length; i++) {
		var adObj = adlist[i];
		var editBtn,campusBtn,timeBtn,startBtn;
		var btnText = "编&nbsp;&nbsp;辑";
		var extensionText = "开始推广";
		if(adlist[i].state == 0 || adlist[i].state == 3){
			editBtn = "";
			campusBtn = ' disabled="disabled" ';
			timeBtn = ' disabled="disabled" ';
			startBtn = ' disabled="disabled" ';
			if(adlist[i].state == 0){
				extensionTime = '<a title="'+adlist[i].remark+'" style="color:red;margin-right:10px;display:inline-block;height:100%;cursor: default;">审核不通过</a>';
			}
		}else if(adlist[i].state == 1){
			editBtn = ' disabled="disabled" ';
			campusBtn = "";
			timeBtn = "";
			startBtn = "";
			if(adlist[i].starttime != null && adlist[i].starttime != "" && adlist[i].endtime != null && adlist[i].endtime != ""){
				extensionTime =makeTimeStr(adlist[i].starttime,adlist[i].endtime);
			}else{
				extensionTime = '';
			}
		}else if(adlist[i].state == 2){
			editBtn = ' disabled="disabled" ';
			campusBtn = ' disabled="disabled" ';
			timeBtn = ' disabled="disabled" ';
			startBtn = ' disabled="disabled" ';
			btnText = "审核中";
			extensionTime = '';
		}
		if(adlist[i].state == 1 && adlist[i].launch == "1"){
			extensionText = "暂停推广";
			campusBtn = ' disabled="disabled" ';
			timeBtn = ' disabled="disabled" ';
		}else if(adlist[i].state == 1 && adlist[i].launch == "0"){
			campusBtn = "";
			timeBtn = "";
		}
		adListStr += '<div class="adBox">'
				  +  '	<div class="adBox_title">'
				  +  '		<span class="l">'+adlist[i].title+'</span>'
				  +  '		<span class="r" id="extensionTime_'+adlist[i].id+'">'+extensionTime+'</span>'
				  +  '	</div>'
				  +  '	<div class="adBox_url">'
				  +  '		<img alt="" src="'+adlist[i].picpath+'" />'
				  +  '	</div>'
				  +  '	<div class="adBox_btnlist">'
				  +  '		<button type="button" class="btn btn-sm btn-info" id="editBtn_'+adlist[i].id+'" '+editBtn+' onclick="toEdit('+adlist[i].id+');">'+btnText+'</button>'
				  +  '		<button type="button" class="btn btn-sm btn-info" id="campusBtn_'+adlist[i].id+'" campusids="'+adlist[i].campus+'" adid="'+adlist[i].id+'" '+campusBtn+' onclick="showCampusBox(this);">推广校区</button>'
				  +  '		<button type="button" class="btn btn-sm btn-info" id="timeBtn_'+adlist[i].id+'" starttime="'+adlist[i].starttime+'" endtime="'+adlist[i].endtime+'" adid="'+adlist[i].id+'" '+timeBtn+' onclick="showTimeBox(this);">推广时间</button>'
				  +  '		<button type="button" class="btn btn-sm btn-info" id="startBtn_'+adlist[i].id+'" adid="'+adlist[i].id+'" launch="'+adlist[i].launch+'" '+startBtn+' onclick="setExtension(this);">'+extensionText+'</button>'
				  +  '	</div>'
				  +  '</div>';
	}
	adListStr += '<div class="cl"></div>';
	$("#viewList").html(adListStr);
	initImgCss();
}

function makeTimeStr(starttime,endtime){
	return '推广时间'+starttime+'到'+endtime;
}

function toEdit(id){
	window.location.href = ctx + "/base/func/"+ApiParamUtil.DLS_DLS_AD_FORM_JUMP+"?appid=1110&adId="+id;
}

function showCampusBox(obj){
	if(checkDlsCampusLoaded()){
		currentElement=obj;
		var campusids=$(obj).attr("campusids");
		setCheckedCampusList(campusids);
		$('#modal-check-campus').modal('show');
	}else{
		PromptBox.alert("校区加载失败，请稍后重试");
	}	
}

//判断代理商校区是否已加载完成
function checkDlsCampusLoaded(){
	if(dlsCampusLoaded==0){
		setTimeout("checkDlsCampusLoaded()",50);
	}else if(dlsCampusLoaded==1){
		return true;
	}else if(dlsCampusLoaded==2){
		return false;
	}
}

function setCheckedCampusList(campusids){
	$("#campusList option").each(function(){
		this.selected=false;
	});
	if(campusids==""){
		$("#campusList").multiselect('refresh');
		return;
	}
	var campusidArr=campusids.split(",");
	for(var i=0;i<campusidArr.length;i++){
		$("#campusList option").each(function(){
			if(this.value==campusidArr[i]){
				this.selected=true;
			}			
		});		
	}
	$("#campusList").multiselect('refresh');
}

function showTimeBox(obj){
	currentElement=obj;
	$('#startTime').datepicker();
	$('#endTime').datepicker();
	var starttime=$(obj).attr("starttime");
	var endtime=$(obj).attr("endtime");
	if(starttime!=null && starttime!="" && starttime!="null"){
		$("#startTimeValue").val(starttime);
		$('#startTime').datepicker('update', new Date(starttime.split("/")[0], parseInt(starttime.split("/")[1]) - 1, starttime.split("/")[2]));
	}else{
		$("#startTimeValue").val("");
		$('#startTime').datepicker('update', new Date());
	}
	if(endtime != null && endtime != "" && endtime != "null"){
		$("#endTimeValue").val(endtime);
		$('#endTime').datepicker('update', new Date(endtime.split("/")[0], parseInt(endtime.split("/")[1]) - 1, endtime.split("/")[2]));
	}else{
		$("#endTimeValue").val("");
		$('#endTime').datepicker('update', new Date());
	}
	$('#modal-check-time').modal('show');
}


function setCampusList(){
	var campusids="";
	if($("#campusList").val()!=null){
		campusids = $("#campusList").val().toString();
	}
	var submitData = {
		api:ApiParamUtil.DLS_AD_LAUNCH_CAMPUS_UPDATE,
		param:JSON.stringify({
			id:$(currentElement).attr("adid"),
			campusids:campusids
		})
	};
	GHBB.prompt("数据保存中~");
	$.ajax({
		cache : false,
		type : "POST",
		url : commonUrl_ajax,
		data : submitData,
		success : function(datas) {
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code === "200") {
				$(currentElement).attr("campusids",campusids);
				$('#modal-check-campus').modal('hide');
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
				PromptBox.alert(result.ret.msg);
			}
		}
	});
}

function setAdTime(){	
	var adId = $(currentElement).attr("adid");
	var startTime = $("#startTimeValue").val();
	var endTime = $("#endTimeValue").val();
	if(startTime == "" || startTime == null){
		alert("请选择开始时间");
		return;
	}
	if(endTime == "" || endTime == null){
		alert("请选择结束时间");
		return;
	}
	startTime=startTime.toString();
	endTime=endTime.toString();
	var submitData = {
		api:ApiParamUtil.DLS_AD_LAUNCH_TIME_UPDATE,
		param:JSON.stringify({
			id:adId,
			starttime:startTime,
			endtime:endTime
		})
	};
	GHBB.prompt("数据保存中~");
	$.ajax({
		cache : false,
		type : "POST",
		url : commonUrl_ajax,
		data : submitData,
		success : function(datas) {
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code === "200") {
				$(currentElement).attr("starttime",startTime);
				$(currentElement).attr("endtime",endTime);
				$("#extensionTime_"+adId).html(makeTimeStr(startTime,endTime));
				$('#modal-check-time').modal('hide');
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function setExtension(obj){
	var launch=$(obj).attr("launch");
	var id=$(obj).attr("adid");
	if(launch == "0"){
		launch = 1;
	}else{
		launch = 0;
	}
	if($(obj).prev().prev().attr("campusids")==""){
		alert("请先选择推广校区");
		return;
	}
	if($("#extensionTime_"+id).html() == null || $("#extensionTime_"+id).html() == ""){
		alert("请先选择推广时间");
		return;
	}
	var submitData = {
		api:ApiParamUtil.DLS_AD_LAUNCH_STATE_UPDATE,
		param:JSON.stringify({
			id:id,
			launch:launch
		})
	};
	GHBB.prompt("数据保存中~");
	$.ajax({
		cache : false,
		type : "POST",
		url : commonUrl_ajax,
		data : submitData,
		success : function(datas) {
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code === "200") {
				getAdList();
			} else {				
				console.log(result.ret.code + ":" + result.ret.msg);
				PromptBox.alert(result.ret.msg);
			}
		}
	});
}

function checkTime(timeBoxType){
	var startTimeValue = $("#startTimeValue").val();
	var endTimeValue = $("#endTimeValue").val();
	var stv = Date.parse(new Date(startTimeValue));
	var etv = Date.parse(new Date(endTimeValue));
	if(!isNaN(stv) && !isNaN(etv)){
		if(timeBoxType == "start" && stv > etv){
			$("#endTimeValue").val($("#startTimeValue").val());
			$('#endTime').datepicker('update', new Date(startTimeValue.split("/")[0], parseInt(startTimeValue.split("/")[1]) - 1, startTimeValue.split("/")[2]));
			
		}else if(timeBoxType == "end" && stv > etv){
			$("#startTimeValue").val($("#endTimeValue").val());
			$('#startTime').datepicker('update', new Date(endTimeValue.split("/")[0], parseInt(endTimeValue.split("/")[1]) - 1, endTimeValue.split("/")[2]));
		}
	}
};











